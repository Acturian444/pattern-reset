/**
 * Personal Relationship Read ($59) — intake → Stripe Checkout → thanks page.
 * Draft autosave: sessionStorage prReadIntakeDraft. Cleared after verified payment on thanks page.
 */
(function () {
    'use strict';

    var earlyParams = new URLSearchParams(window.location.search);
    if (
        earlyParams.get('checkout') === 'success' &&
        earlyParams.get('session_id') &&
        /\/personal-relationship-read(?:\.html)?\/?$/i.test(window.location.pathname)
    ) {
        var pathDirEarly = window.location.pathname.replace(/[^/]+$/, '');
        window.location.replace(
            window.location.origin +
                pathDirEarly +
                'personal-relationship-read-thanks.html?checkout=success&session_id=' +
                encodeURIComponent(earlyParams.get('session_id'))
        );
        return;
    }

    var QUIZ_KEY = 'patternResetQuizState';
    var DRAFT_KEY = 'prReadIntakeDraft';
    var cachedPublishableKey;
    var draftTimer;

    function getPublishableKey() {
        if (cachedPublishableKey !== undefined) {
            return Promise.resolve(cachedPublishableKey);
        }
        var fallback = (typeof window.PR_READ_STRIPE_PUBLIC_KEY === 'string' && window.PR_READ_STRIPE_PUBLIC_KEY.trim()) || '';
        return fetch('/api/stripe-client-config')
            .then(function (r) {
                if (!r.ok) return { publishableKey: '' };
                return r.json();
            })
            .then(function (data) {
                var fromServer =
                    data && typeof data.publishableKey === 'string' ? data.publishableKey.trim() : '';
                var pk = fromServer || fallback || '';
                cachedPublishableKey = pk;
                return pk;
            })
            .catch(function () {
                cachedPublishableKey = fallback || '';
                return cachedPublishableKey;
            });
    }

    function thanksPageBaseUrl() {
        var pathDir = window.location.pathname.replace(/[^/]+$/, '');
        return window.location.origin + pathDir + 'personal-relationship-read-thanks.html';
    }

    function applyIntakeFromObject(d) {
        if (!d) return;
        var setVal = function (id, val) {
            var el = document.getElementById(id);
            if (!el || val === undefined || val === null) return;
            if (typeof val === 'number' && isNaN(val)) return;
            el.value = typeof val === 'number' ? String(val) : val;
        };
        setVal('pr-read-email', d.email);
        setVal('pr-read-name', d.name);
        setVal('pr-read-happening', d.happening);
        setVal('pr-read-want', d.wantKnow);
        setVal('pr-read-stage', d.stage);
        setVal('pr-read-duration', d.duration);
        setVal('pr-read-scope', d.scope);
    }

    function saveIntakeDraft() {
        var form = document.getElementById('pr-read-form-intake');
        if (!form) return;
        try {
            var d = readForm();
            var hasAny =
                (d.email && d.email.length > 0) ||
                (d.name && d.name.length > 0) ||
                (d.happening && d.happening.length > 0) ||
                (d.wantKnow && d.wantKnow.length > 0) ||
                (d.stage && d.stage.length > 0) ||
                (d.duration && d.duration.length > 0) ||
                (d.scope && d.scope.length > 0);
            if (!hasAny) {
                sessionStorage.removeItem(DRAFT_KEY);
                return;
            }
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
        } catch (e) {}
    }

    function scheduleDraftSave() {
        clearTimeout(draftTimer);
        draftTimer = setTimeout(saveIntakeDraft, 500);
    }

    function restoreIntakeDraft() {
        try {
            var raw = sessionStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            applyIntakeFromObject(JSON.parse(raw));
        } catch (e) {}
    }

    function parseQuizState() {
        try {
            var raw = localStorage.getItem(QUIZ_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function patternLabel(patternKey) {
        if (!patternKey || !window.relationshipPatterns) return null;
        var p = window.relationshipPatterns[patternKey];
        return p && p.name ? p.name : null;
    }

    function ageFromBirthDate(str) {
        if (!str || typeof str !== 'string') return null;
        var d = new Date(str.trim());
        if (isNaN(d.getTime())) return null;
        var t = new Date();
        var age = t.getFullYear() - d.getFullYear();
        var mo = t.getMonth() - d.getMonth();
        if (mo < 0 || (mo === 0 && t.getDate() < d.getDate())) age--;
        if (age < 13 || age > 120) return null;
        return age;
    }

    function herPatternNameFromState(state) {
        if (!state || !state.answers || !window.quizData || !window.PatternDeterminer) return null;
        if (typeof window.PatternDeterminer.determineHerResponsePattern !== 'function') return null;
        try {
            var key = window.PatternDeterminer.determineHerResponsePattern(state.answers, window.quizData);
            if (!key || !window.herResponsePatterns) return null;
            var meta = window.herResponsePatterns[key];
            return meta && meta.name ? meta.name : null;
        } catch (e) {
            return null;
        }
    }

    function prefillFromQuiz() {
        var state = parseQuizState();
        var banner = document.getElementById('pr-read-quiz-banner');
        var wrapDyn = document.getElementById('pr-read-quiz-dynamic-wrap');
        var wrapHer = document.getElementById('pr-read-quiz-her-wrap');
        var elDyn = document.getElementById('pr-read-quiz-dynamic');
        var elHer = document.getElementById('pr-read-quiz-her');
        if (!state || !banner) return;

        var dynName = patternLabel(state.patternKey);
        var herName = herPatternNameFromState(state);

        if (dynName && elDyn && wrapDyn) {
            elDyn.textContent = dynName;
            wrapDyn.hidden = false;
        }
        if (herName && elHer && wrapHer) {
            elHer.textContent = herName;
            wrapHer.hidden = false;
        }

        if ((dynName || herName) && banner) {
            banner.hidden = false;
        }

        /*
         * Map legacy quiz relationshipStatus values → current stage options.
         * Quiz historically wrote values like 'talking', 'emotionally-invested',
         * 'recently-ended', 'single', 'undefined'. Normalize them so prefill
         * continues to work for returning users without forcing a re-pick.
         */
        var STAGE_PREFILL_MAP = {
            talking: 'early',
            'emotionally-invested': 'relationship',
            'recently-ended': 'ending',
            engaged: 'living-engaged',
            single: 'not-in-one',
            undefined: 'situationship'
        };
        var stageSelect = document.getElementById('pr-read-stage');
        if (stageSelect && state.relationshipStatus && !stageSelect.value) {
            var stageValue = STAGE_PREFILL_MAP[state.relationshipStatus] || state.relationshipStatus;
            for (var i = 0; i < stageSelect.options.length; i++) {
                if (stageSelect.options[i].value === stageValue) {
                    stageSelect.selectedIndex = i;
                    break;
                }
            }
        }

        var happening = document.getElementById('pr-read-happening');
        if (happening && state.userStory && !happening.value.trim()) {
            happening.value = state.userStory;
        }

        var emailEl = document.getElementById('pr-read-email');
        if (emailEl && state.userEmail && !emailEl.value.trim()) {
            emailEl.value = state.userEmail;
        }
        var nameEl = document.getElementById('pr-read-name');
        if (nameEl && state.userName && !nameEl.value.trim()) {
            nameEl.value = state.userName;
        }
    }

    function showError(id, msg) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = msg || '';
        el.classList.toggle('is-visible', !!msg);
    }

    function selectOptionLabel(selectEl, value) {
        if (!selectEl || value == null || value === '') return null;
        var v = String(value);
        for (var i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value === v) {
                return String(selectEl.options[i].textContent || '').replace(/\s+/g, ' ').trim() || null;
            }
        }
        return null;
    }

    function readForm() {
        var getVal = function (id) {
            var el = document.getElementById(id);
            return el ? String(el.value || '').trim() : '';
        };
        var selectVal = function (id) {
            var el = document.getElementById(id);
            return el ? String(el.value || '') : '';
        };
        return {
            email: getVal('pr-read-email'),
            name: getVal('pr-read-name'),
            age: null,
            happening: getVal('pr-read-happening'),
            confusing: null,
            wantKnow: getVal('pr-read-want'),
            stage: selectVal('pr-read-stage'),
            duration: selectVal('pr-read-duration'),
            scope: selectVal('pr-read-scope'),
            fear: null,
            outcome: null
        };
    }

    function validateIntake(d) {
        if (!d.email) return 'Please enter your email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please enter a valid email address.';
        if (!d.happening) return 'Please tell me what is happening.';
        if (!d.wantKnow) return 'Please tell me what you want me to answer.';
        if (!d.stage) return 'Please tell me what you two are right now.';
        if (!d.duration) return 'Please tell me how long you have been with him.';
        return '';
    }

    function buildQuizSnapshot() {
        var state = parseQuizState();
        if (!state) {
            return {
                patternKey: null,
                patternName: null,
                herPatternKey: null,
                herPatternName: null,
                relationshipStatus: null,
                biggestFear: null,
                currentPain: null,
                birthDate: null,
                answers: null,
                driverScores: null
            };
        }
        var herKey = null;
        if (window.PatternDeterminer && typeof window.PatternDeterminer.determineHerResponsePattern === 'function' && state.answers && window.quizData) {
            try {
                herKey = window.PatternDeterminer.determineHerResponsePattern(state.answers, window.quizData);
            } catch (e) {
                herKey = null;
            }
        }
        var herName = null;
        if (herKey && window.herResponsePatterns && window.herResponsePatterns[herKey]) {
            herName = window.herResponsePatterns[herKey].name || null;
        }
        return {
            patternKey: state.patternKey || null,
            patternName: patternLabel(state.patternKey),
            herPatternKey: herKey,
            herPatternName: herName,
            relationshipStatus: state.relationshipStatus || null,
            biggestFear: state.biggestFear || null,
            currentPain: state.currentPain || null,
            birthDate: state.birthDate || null,
            answers: state.answers || null,
            driverScores: state.driverScores || null
        };
    }

    /** Stripe metadata size limits — drop heavy fields; full copy stays in sessionStorage. */
    function quizSnapshotForCheckout(snap) {
        if (!snap) return {};
        return {
            patternKey: snap.patternKey,
            patternName: snap.patternName,
            herPatternKey: snap.herPatternKey,
            herPatternName: snap.herPatternName,
            relationshipStatus: snap.relationshipStatus,
            biggestFear: snap.biggestFear,
            currentPain: snap.currentPain,
            birthDate: snap.birthDate,
            driverScores: snap.driverScores
        };
    }

    function handleCheckoutReturn() {
        var params = new URLSearchParams(window.location.search);
        var checkout = params.get('checkout');

        if (checkout === 'cancelled') {
            try {
                var pending = JSON.parse(sessionStorage.getItem('prReadPendingOrder') || 'null');
                if (pending && pending.intake) {
                    applyIntakeFromObject(pending.intake);
                }
            } catch (e) {}
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        }
    }

    restoreIntakeDraft();
    prefillFromQuiz();
    handleCheckoutReturn();

    var intakeForm = document.getElementById('pr-read-form-intake');
    if (!intakeForm) return;

    var funnelEntryPath = 'direct_url';
    var qsFunnel = new URLSearchParams(window.location.search);
    var stFunnel = parseQuizState();
    if (qsFunnel.get('entry') === 'direct') {
        funnelEntryPath = 'direct_url';
    } else if (stFunnel && stFunnel.quizCompleted) {
        funnelEntryPath = 'quiz';
    } else {
        funnelEntryPath = 'direct_url';
    }
    if (typeof window.trackCustomerEvent === 'function') {
        window.trackCustomerEvent('intake_page_viewed', {
            source: 'personal-relationship-read',
            entryPath: funnelEntryPath,
            entrySource: qsFunnel.get('utm_source') || null,
            entryCampaign: qsFunnel.get('utm_campaign') || null
        });
    }

    function intakeStartedOnce() {
        intakeForm.removeEventListener('focusin', intakeStartedOnce, true);
        if (typeof window.trackCustomerEvent === 'function') {
            window.trackCustomerEvent('intake_started', {
                source: 'personal-relationship-read',
                entryPath: funnelEntryPath
            });
        }
    }
    intakeForm.addEventListener('focusin', intakeStartedOnce, true);

    intakeForm.addEventListener('input', scheduleDraftSave);
    intakeForm.addEventListener('change', scheduleDraftSave);
    saveIntakeDraft();

    intakeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showError('pr-read-intake-error', '');
        var d = readForm();
        var err = validateIntake(d);
        if (err) {
            showError('pr-read-intake-error', err);
            return;
        }

        if (typeof window.Stripe !== 'function') {
            showError('pr-read-intake-error', 'Payment could not load. Please refresh the page and try again.');
            return;
        }

        if (typeof window.createIntakeSubmission !== 'function') {
            showError(
                'pr-read-intake-error',
                'Could not initialize secure checkout. Refresh the page, disable strict blockers, or try another browser.'
            );
            return;
        }

        var OFF =
            (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DIRECT_READ_59) || 'direct_read_59';
        var qsPost = new URLSearchParams(window.location.search);

        var submitBtn = intakeForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.setAttribute('data-prev-label', submitBtn.textContent);
            // Avoid "redirecting" — sounds broken/technical. Handoff to Stripe Checkout.
            submitBtn.textContent = 'Opening secure checkout…';
        }

        function resetSubmitBtn() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.getAttribute('data-prev-label') || 'Get my answer — $59';
            }
        }

        getPublishableKey()
            .then(function (pk) {
                if (!pk) {
                    showError(
                        'pr-read-intake-error',
                        'Stripe publishable key is missing. Either set STRIPE_PUBLISHABLE_KEY in Vercel (same account as STRIPE_SECRET_KEY) and redeploy, or set window.PR_READ_STRIPE_PUBLIC_KEY in personal-relationship-read.html to your Dashboard pk_live.'
                    );
                    resetSubmitBtn();
                    return null;
                }

                var snap = buildQuizSnapshot();
                var st = parseQuizState();

                var stageEl = document.getElementById('pr-read-stage');
                var durationEl = document.getElementById('pr-read-duration');
                var scopeEl = document.getElementById('pr-read-scope');
                var stageLabel = d.stage ? selectOptionLabel(stageEl, d.stage) : null;
                var durationLabel = d.duration ? selectOptionLabel(durationEl, d.duration) : null;
                var scopeLabel = d.scope ? selectOptionLabel(scopeEl, d.scope) : null;

                /*
                 * Fear + age are no longer exposed as form fields — the UI was dropping
                 * conversions at a $59 paid moment. We still carry whatever the quiz
                 * already captured so backend/tracking signals don't regress.
                 */
                var quizFear = st && typeof st.biggestFear === 'string' ? st.biggestFear : null;
                var quizFearLabel = st && typeof st.biggestFearLabel === 'string' ? st.biggestFearLabel : null;
                var quizAge =
                    st && st.birthDate ? ageFromBirthDate(st.birthDate) : null;

                var intakeFields = {
                    submissionId: st && st.firestoreSubmissionId ? st.firestoreSubmissionId : null,
                    source: 'personal-relationship-read',
                    entryPath: funnelEntryPath,
                    entrySource: qsPost.get('utm_source') || null,
                    entryCampaign: qsPost.get('utm_campaign') || null,
                    offerId: OFF,
                    patternKey: snap.patternKey,
                    patternName: snap.patternName,
                    herPatternKey: snap.herPatternKey,
                    herPatternName: snap.herPatternName,
                    email: d.email,
                    name: d.name || null,
                    relationshipStage: d.stage || null,
                    relationshipStageLabel: stageLabel,
                    relationshipDuration: d.duration || null,
                    relationshipDurationLabel: durationLabel,
                    patternScope: d.scope || null,
                    patternScopeLabel: scopeLabel,
                    age: quizAge,
                    whatIsHappening: d.happening,
                    whatIsConfusing: null,
                    whatDoYouNeedAnswered: d.wantKnow,
                    biggestFear: quizFear,
                    biggestFearLabel: quizFearLabel,
                    idealOutcome: null
                };

                var intakePayloadForTracking = {
                    relationshipStage: d.stage || null,
                    relationshipStageLabel: stageLabel,
                    relationshipDuration: d.duration || null,
                    relationshipDurationLabel: durationLabel,
                    patternScope: d.scope || null,
                    patternScopeLabel: scopeLabel,
                    biggestFear: quizFear,
                    biggestFearLabel: quizFearLabel,
                    idealOutcome: null,
                    whatDoYouNeedAnswered: d.wantKnow,
                    whatIsHappening: d.happening,
                    whatIsConfusing: null
                };

                return window.createIntakeSubmission(intakeFields).then(function (intakeId) {
                    if (!intakeId) {
                        throw new Error('intake_missing');
                    }

                    // Google Sheet: NOT appending an intake row here. The
                    // pending_checkout row was noise — most intake fillers
                    // never resolve to "paid" (Stripe abandonment), and the
                    // resulting "ghost" rows clutter the sheet without
                    // surviving as actionable data. Firestore intakeSubmissions
                    // captures the intake regardless. The Sheet now shows
                    // exactly two rows per converting user:
                    //   1) Quiz completion (deliveryStatus = quiz_only)
                    //   2) Stripe webhook on payment (deliveryStatus = paid)
                    // Filter / sort by Submission ID to roll a user up.

                    var chain = Promise.resolve();
                    if (typeof window.trackCustomerEvent === 'function') {
                        chain = window
                            .trackCustomerEvent('intake_submitted', {
                                intakeId: intakeId,
                                offerId: OFF,
                                source: 'personal-relationship-read',
                                entryPath: funnelEntryPath,
                                intakePayload: intakePayloadForTracking
                            })
                            .then(function () {
                                return window.trackCustomerEvent('checkout_started', {
                                    intakeId: intakeId,
                                    offerId: OFF,
                                    source: 'personal-relationship-read'
                                });
                            });
                    }
                    var uidForStripe = typeof window.firebaseUserId === 'string' ? window.firebaseUserId : '';
                    var intakePayload = {
                        intake: d,
                        quizSnapshot: quizSnapshotForCheckout(snap),
                        funnelContext: {
                            intakeId: intakeId,
                            firebaseUid: uidForStripe,
                            quizSubmissionId: (st && st.firestoreSubmissionId) || '',
                            offerId: OFF
                        }
                    };
                    return chain.then(function () {
                        return {
                            pk: pk,
                            intakeId: intakeId,
                            snap: snap,
                            intakePayload: intakePayload
                        };
                    });
                });
            })
            .then(function (ctx) {
                if (!ctx || !ctx.pk) return null;
                var pk = ctx.pk;
                var intakeId = ctx.intakeId;
                var snap = ctx.snap;
                var intakePayload = ctx.intakePayload;

                try {
                    sessionStorage.setItem(
                        'prReadPendingOrder',
                        JSON.stringify({
                            tier: 'apply_written_59',
                            intakeId: intakeId,
                            intake: d,
                            quizSnapshot: snap,
                            savedAt: new Date().toISOString(),
                            checkoutStatus: 'redirecting'
                        })
                    );
                    sessionStorage.removeItem(DRAFT_KEY);
                } catch (err) {}

                var intakePageUrl = window.location.origin + window.location.pathname.split('?')[0];
                var thanksUrl = thanksPageBaseUrl();

                return fetch('/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'personal_relationship_read',
                        customerEmail: d.email,
                        successUrl: thanksUrl + '?checkout=success&session_id={CHECKOUT_SESSION_ID}',
                        cancelUrl: intakePageUrl + '?checkout=cancelled',
                        intakePayload: intakePayload
                    })
                }).then(function (r) {
                    return r.json().then(function (data) {
                        return { ok: r.ok, data: data, pk: pk, intakeId: intakeId };
                    });
                });
            })
            .then(function (result) {
                if (!result || !result.data) return;
                if (!result.ok || !result.data.id) {
                    var derr = result.data || {};
                    var msg =
                        derr.error ||
                        'Could not start checkout. Try again or email resetmypattern@gmail.com.';
                    if (derr.hint) {
                        msg += ' ' + derr.hint;
                    }
                    showError('pr-read-intake-error', msg);
                    resetSubmitBtn();
                    return;
                }
                var patchP =
                    typeof window.patchIntakeCheckoutMeta === 'function' && result.intakeId && result.data.id
                        ? window.patchIntakeCheckoutMeta(result.intakeId, result.data.id).catch(function (err) {
                              console.warn('patchIntakeCheckoutMeta', err);
                          })
                        : Promise.resolve();
                return patchP.then(function () {
                    var stripe = window.Stripe(result.pk);
                    return stripe.redirectToCheckout({ sessionId: result.data.id });
                });
            })
            .then(function (redirectResult) {
                if (redirectResult && redirectResult.error) {
                    showError('pr-read-intake-error', redirectResult.error.message || 'Checkout redirect failed.');
                    resetSubmitBtn();
                }
            })
            .catch(function (err) {
                console.warn('Intake / checkout error', err);
                var msg = 'Network error starting checkout. Check your connection and try again.';
                if (err && err.message === 'intake_missing') {
                    msg = 'Could not save your intake securely. Check your connection and try again.';
                }
                showError('pr-read-intake-error', msg);
                resetSubmitBtn();
            });
    });
})();
