/**
 * Personal Relationship Read — post-payment confirmation (full page, not modal).
 */
(function () {
    'use strict';

    var DRAFT_KEY = 'prReadIntakeDraft';
    var PENDING_KEY = 'prReadPendingOrder';
    var VERIFIED_KEY = 'prReadThanksVerified';
    // Verified flag is valid for 24h within the same tab (sessionStorage scope).
    // Long enough to survive accidental refreshes / back-navigation; short enough
    // that an old tab reopened weeks later won't falsely claim a fresh order.
    var VERIFIED_TTL_MS = 24 * 60 * 60 * 1000;

    function clearOrderDraftStorage() {
        try {
            sessionStorage.removeItem(DRAFT_KEY);
            sessionStorage.removeItem(PENDING_KEY);
        } catch (e) {}
    }

    function markVerified(sessionId) {
        try {
            sessionStorage.setItem(VERIFIED_KEY, JSON.stringify({
                sessionId: sessionId || '',
                at: Date.now()
            }));
        } catch (e) {}
    }

    function readVerifiedFlag() {
        try {
            var raw = sessionStorage.getItem(VERIFIED_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (!data || typeof data.at !== 'number') return null;
            if (Date.now() - data.at > VERIFIED_TTL_MS) {
                sessionStorage.removeItem(VERIFIED_KEY);
                return null;
            }
            return data;
        } catch (e) {
            return null;
        }
    }

    var VIEW_IDS = ['pr-thanks-loading', 'pr-thanks-verified', 'pr-thanks-unverified', 'pr-thanks-nosession'];

    function setView(visibleId) {
        VIEW_IDS.forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.hidden = id !== visibleId;
        });
    }

    function verifyCheckoutOnce(sessionId) {
        return fetch('/api/verify-checkout?session=' + encodeURIComponent(sessionId)).then(function (r) {
            return r.text().then(function (text) {
                var data = {};
                var parseError = false;
                if (text) {
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                        parseError = true;
                    }
                }
                return { ok: r.ok, status: r.status, data: data, parseError: parseError };
            });
        });
    }

    /**
     * One retry on 5xx / non-JSON helps flaky networks and brief serverless cold starts.
     * Test vs live Stripe mode does not change this — mismatched keys or missing /api route does.
     */
    function verifyCheckoutWithRetry(sessionId) {
        return verifyCheckoutOnce(sessionId).then(function (result) {
            if (result.ok && result.data && result.data.verified) {
                return result;
            }
            var retryable =
                result.status >= 500 ||
                result.parseError ||
                (result.status === 0);
            if (!retryable) {
                return result;
            }
            return new Promise(function (resolve) {
                setTimeout(function () {
                    verifyCheckoutOnce(sessionId).then(resolve);
                }, 1300);
            });
        });
    }

    var params = new URLSearchParams(window.location.search);
    var checkout = params.get('checkout');
    var sessionId = params.get('session_id');

    if (checkout === 'success' && sessionId) {
        setView('pr-thanks-loading');
        verifyCheckoutWithRetry(sessionId)
            .then(function (result) {
                if (result.ok && result.data && result.data.verified) {
                    clearOrderDraftStorage();
                    markVerified(sessionId);
                    setView('pr-thanks-verified');
                } else {
                    setView('pr-thanks-unverified');
                }
                window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(function () {
                setView('pr-thanks-unverified');
                window.history.replaceState({}, document.title, window.location.pathname);
            });
    } else {
        // No query params on the URL. This is either a refresh AFTER a successful
        // verification (we stripped the params with replaceState) or a cold visit.
        // Honor the in-tab verified flag so refresh still shows the success state.
        var verified = readVerifiedFlag();
        if (verified) {
            setView('pr-thanks-verified');
        } else {
            setView('pr-thanks-nosession');
        }
    }
})();
