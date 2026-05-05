/**
 * Relationship quiz: clarity tier paywall ($59 / $197).
 * $19 tier hard-hidden 2026-04 (founder conviction + competitive fit).
 * Legacy isUnlocked/setUnlocked helpers retained for backward-compat
 * with any returning visitors who previously unlocked in-modal content.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'patternResetClarityUnlocked';
    var overlayEl = null;

    /*
     * $197 call flow: direct navigation to Calendly's hosted page.
     * Popup overlay approach hit z-index conflict with paywall (paywall at
     * 100002, Calendly popup defaults to 9999 → popup rendered invisibly
     * behind paywall). Direct navigation is 100% reliable across ad blockers,
     * mobile, and iframe restrictions. URL can be swapped per-event-type by
     * setting window.PATTERN_RESET_CALENDLY_URL before this script loads.
     * Booking confirmation still tracked via Calendly postMessage event if
     * a Calendly iframe ever renders on a post-paywall page.
     */
    var CALENDLY_URL_DEFAULT = 'https://calendly.com/resetmypattern/60min';

    function getCalendlyUrl() {
        var override = window.PATTERN_RESET_CALENDLY_URL;
        if (typeof override === 'string' && override.length > 0) return override;
        return CALENDLY_URL_DEFAULT;
    }

    /*
     * Read quiz state for Calendly prefill. Sources, in order of trust:
     *   1) live window.* globals set during this session (most current)
     *   2) localStorage patternResetQuizState (survives reload / cross-page)
     * Returns flat object; missing fields are empty strings.
     */
    function readQuizSnapshotForCalendly() {
        var snap = { name: '', email: '', patternKey: '', submissionId: '', uid: '' };
        try {
            var raw = localStorage.getItem('patternResetQuizState');
            if (raw) {
                var st = JSON.parse(raw) || {};
                snap.name = st.userName || '';
                snap.email = st.userEmail || '';
                snap.patternKey = st.patternKey || '';
                snap.submissionId = st.firestoreSubmissionId || '';
            }
        } catch (e) {}
        if (!snap.name && typeof window.quizUserName === 'string') snap.name = window.quizUserName;
        if (!snap.email && typeof window.quizUserEmail === 'string') snap.email = window.quizUserEmail;
        if (!snap.patternKey && typeof window.quizPatternKey === 'string') snap.patternKey = window.quizPatternKey;
        if (typeof window.firebaseUserId === 'string') snap.uid = window.firebaseUserId;
        return snap;
    }

    /*
     * Build the Calendly URL with quiz context prefilled so:
     *   1) Calendly's booking form shows name + email already filled in
     *      (saves typing → marginally faster booking flow, no UX added)
     *   2) Quiz attribution + Firestore IDs ride on the booking via Calendly's
     *      `tracking` channel (utm_*, salesforce_uuid). These values come back
     *      verbatim in the invitee.created webhook payload, letting the server
     *      link the booking to the right quizProfiles + submissions docs
     *      without fragile email matching.
     *
     * salesforce_uuid is Calendly's documented passthrough for external IDs;
     * we use it for the Firebase uid. If a field can't be read we just omit it
     * (Calendly silently ignores empty params).
     */
    function buildCalendlyUrlWithPrefill() {
        var base = getCalendlyUrl();
        try {
            var url = new URL(base, window.location.origin);
            var quiz = readQuizSnapshotForCalendly();
            if (quiz.name) url.searchParams.set('name', quiz.name);
            if (quiz.email) url.searchParams.set('email', quiz.email);
            url.searchParams.set('utm_source', 'quiz');
            url.searchParams.set('utm_medium', 'paywall');
            url.searchParams.set('utm_campaign', 'decide_with_me_197');
            if (quiz.patternKey) url.searchParams.set('utm_content', quiz.patternKey);
            if (quiz.submissionId) url.searchParams.set('utm_term', quiz.submissionId);
            if (quiz.uid) url.searchParams.set('salesforce_uuid', quiz.uid);
            return url.toString();
        } catch (e) {
            return base;
        }
    }

    window.addEventListener('message', function (e) {
        if (!e || !e.data) return;
        var isCalendly = typeof e.data === 'object' && typeof e.data.event === 'string' && e.data.event.indexOf('calendly.') === 0;
        if (!isCalendly) return;
        if (e.data.event === 'calendly.event_scheduled') {
            var oid = (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DECIDE_WITH_ME_197) || 'decide_with_me_197';
            if (typeof window.trackCustomerEvent === 'function') {
                window.trackCustomerEvent('call_booked', {
                    offerId: oid,
                    source: 'clarity-paywall',
                    provider: 'calendly'
                });
            }
        }
    });

    function isUnlocked() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    function setUnlocked() {
        try {
            localStorage.setItem(STORAGE_KEY, 'true');
        } catch (e) {}
    }

    function lockBody() {
        var y = window.scrollY;
        document.body.dataset.clarityPaywallScrollY = String(y);
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + y + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.classList.add('clarity-paywall-open');
    }

    function unlockBody() {
        var y = parseInt(document.body.dataset.clarityPaywallScrollY || '0', 10) || 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        delete document.body.dataset.clarityPaywallScrollY;
        document.body.classList.remove('clarity-paywall-open');
        window.scrollTo(0, y);
    }

    /** $59 intake page — prefer config; fall back to .html so static hosts work (clean /path needs rewrites). */
    function getWrittenAnswerHref() {
        var urls = window.PATTERN_RESET_CTA_URLS || {};
        var h = (urls.myTakeWritten || urls.personalBreakdown || '').trim();
        if (!h || h === '#') return '/personal-relationship-read.html';
        return h;
    }

    function syncWrittenAnswerTierHref() {
        if (!overlayEl) return;
        var a59 = overlayEl.querySelector('#clarity-paywall-tier-59');
        if (a59) a59.href = getWrittenAnswerHref();
    }

    function ensureOverlay() {
        if (overlayEl && overlayEl.parentNode) return overlayEl;
        overlayEl = document.createElement('div');
        overlayEl.id = 'clarity-paywall-overlay';
        overlayEl.className = 'clarity-paywall-overlay';
        overlayEl.setAttribute('role', 'dialog');
        overlayEl.setAttribute('aria-modal', 'true');
        overlayEl.setAttribute('aria-labelledby', 'clarity-paywall-title');
        overlayEl.innerHTML =
            '<div class="clarity-paywall-backdrop" data-clarity-paywall-dismiss="1"></div>' +
            '<div class="clarity-paywall-panel">' +
            '<button type="button" class="clarity-paywall-close" aria-label="Close">&times;</button>' +
            '<div class="clarity-paywall-header" role="group" aria-labelledby="clarity-paywall-title">' +
            '<h2 id="clarity-paywall-title" class="clarity-paywall-title">You can keep guessing\u2014or get clarity on what this actually is.</h2>' +
            '<p class="clarity-paywall-sub">If you&rsquo;re unsure, you&rsquo;re who this is for.</p>' +
            '</div>' +
            '<div class="clarity-paywall-tiers clarity-paywall-tiers--two">' +
            '<article class="clarity-paywall-tier clarity-paywall-tier--featured">' +
            '<div class="clarity-paywall-tier-cardhead">' +
            '<span class="clarity-paywall-tier-price-big">$59</span>' +
            '<p class="clarity-paywall-tier-label">A DIRECT, WRITTEN ANSWER</p>' +
            '</div>' +
            '<ul class="clarity-paywall-tier-list">' +
            '<li>Share your situation and your question</li>' +
            '<li>I read it personally and write back with a real answer</li>' +
            '<li>You&rsquo;ll know what this actually is &mdash; and what to do next</li>' +
            '<li>In your inbox in 48 hours</li>' +
            '</ul>' +
            '<div class="clarity-paywall-tier-cta">' +
            '<a class="clarity-paywall-btn clarity-paywall-btn-primary" id="clarity-paywall-tier-59" href="#">Get my written answer</a>' +
            '</div>' +
            '</article>' +
            '<article class="clarity-paywall-tier">' +
            '<div class="clarity-paywall-tier-cardhead">' +
            '<span class="clarity-paywall-tier-price-big">$197</span>' +
            '<p class="clarity-paywall-tier-label">A 60-MIN CALL WITH ME</p>' +
            '</div>' +
            '<ul class="clarity-paywall-tier-list">' +
            '<li>1:1 call with me on Zoom</li>' +
            '<li>I read your situation before we talk</li>' +
            '<li>I tell you what this actually is &mdash; and what to do about it</li>' +
            '<li>You leave with a clear plan, not a question</li>' +
            '</ul>' +
            '<div class="clarity-paywall-tier-cta">' +
            '<a class="clarity-paywall-btn clarity-paywall-btn-secondary" id="clarity-paywall-tier-197" href="#">Book my call</a>' +
            '</div>' +
            '</article>' +
            '</div>' +
            '<p class="clarity-paywall-foot">No AI. No templates. Just me.</p>' +
            '</div>';

        overlayEl.querySelector('.clarity-paywall-backdrop').addEventListener('click', closeClarityPaywallModal);
        overlayEl.querySelector('.clarity-paywall-close').addEventListener('click', closeClarityPaywallModal);

        var urls = window.PATTERN_RESET_CTA_URLS || {};
        var applyHref = getWrittenAnswerHref();
        var callHref = urls.talkDirectly || urls.liveSession || '#';
        var a59 = overlayEl.querySelector('#clarity-paywall-tier-59');
        var a197 = overlayEl.querySelector('#clarity-paywall-tier-197');
        if (a59) {
            a59.href = applyHref;
            a59.addEventListener('click', function (e) {
                var oid = (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DIRECT_READ_59) || 'direct_read_59';
                if (typeof window.trackCustomerEvent === 'function') {
                    window.trackCustomerEvent('offer_clicked', { offerId: oid, source: 'clarity-paywall' });
                }
                var dest = getWrittenAnswerHref();
                if (!dest || dest === '#') e.preventDefault();
            });
        }
        if (a197) {
            /*
             * $197 tier: navigate directly to Calendly's hosted scheduling
             * page in the same tab. We do NOT swap button text — that read
             * as broken UI per user feedback. Just dim slightly to confirm
             * the click and prevent double-fires. Tracking events fire
             * synchronously before navigation; assign() runs same-tick so
             * the browser starts loading Calendly immediately. <link
             * rel="preconnect"> in the page head warms the connection so
             * Calendly's hosted page appears as fast as possible.
             */
            var calendlyUrl = buildCalendlyUrlWithPrefill();
            a197.href = calendlyUrl;
            a197.setAttribute('target', '_self');
            a197.setAttribute('rel', 'noopener');
            a197.addEventListener('click', function (e) {
                e.preventDefault();
                if (a197.dataset.clarityNavigating === '1') return;
                a197.dataset.clarityNavigating = '1';
                a197.style.opacity = '0.85';
                a197.style.pointerEvents = 'none';
                var oid = (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DECIDE_WITH_ME_197) || 'decide_with_me_197';
                if (typeof window.trackCustomerEvent === 'function') {
                    try {
                        window.trackCustomerEvent('offer_clicked', { offerId: oid, source: 'clarity-paywall' });
                        window.trackCustomerEvent('checkout_started', {
                            offerId: oid,
                            source: 'clarity-paywall',
                            provider: 'calendly'
                        });
                    } catch (err) {}
                }
                // Re-build at click-time in case quiz state finished loading after overlay render.
                window.location.assign(buildCalendlyUrlWithPrefill());
                setTimeout(function () {
                    if (document.body.contains(a197)) {
                        a197.style.pointerEvents = '';
                        a197.style.opacity = '';
                        delete a197.dataset.clarityNavigating;
                    }
                }, 4000);
            });
        }

        document.body.appendChild(overlayEl);
        return overlayEl;
    }

    function showClarityPaywallModal() {
        ensureOverlay();
        syncWrittenAnswerTierHref();
        lockBody();
        overlayEl.classList.add('is-visible');
        overlayEl.setAttribute('aria-hidden', 'false');
        if (typeof window.trackCustomerEvent === 'function') {
            window.trackCustomerEvent('paywall_opened', { source: 'clarity-paywall' });
        }
        try {
            var primaryCta = overlayEl.querySelector('#clarity-paywall-tier-59');
            if (primaryCta) primaryCta.focus();
        } catch (e) {}
    }

    function closeClarityPaywallModal() {
        if (!overlayEl) return;
        overlayEl.classList.remove('is-visible');
        overlayEl.setAttribute('aria-hidden', 'true');
        unlockBody();
    }

    window.patternResetIsClarityUnlocked = isUnlocked;
    window.showClarityPaywallModal = showClarityPaywallModal;
    window.closeClarityPaywallModal = closeClarityPaywallModal;
    window.showPaywallModal = showClarityPaywallModal;
    window.closePaywallModal = closeClarityPaywallModal;

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var el = document.getElementById('clarity-paywall-overlay');
        if (el && el.classList.contains('is-visible')) {
            closeClarityPaywallModal();
        }
    });
})();
