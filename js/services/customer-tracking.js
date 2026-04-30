/**
 * Funnel events + rollups: quizProfiles/{uid}/events/{eventId}, profile merge, submission merge.
 */
(function () {
    'use strict';

    var QUIZ_STORAGE = 'patternResetQuizState';
    var SESSION_KEY = 'prFunnelSessionId';

    function getDb() {
        return window.letitoutDb || (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore());
    }

    function getAuth() {
        return window.letitoutAuth || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth());
    }

    function waitForFirebaseAuth(timeoutMs) {
        if (window.QuizProfileService && typeof window.QuizProfileService.waitForFirebaseAuth === 'function') {
            return window.QuizProfileService.waitForFirebaseAuth(timeoutMs || 10000);
        }
        timeoutMs = timeoutMs || 10000;
        var auth = getAuth();
        if (!auth) return Promise.reject(new Error('Firebase Auth not available'));
        if (auth.currentUser) return Promise.resolve(auth.currentUser);
        return new Promise(function (resolve, reject) {
            var done = false;
            var t = setTimeout(function () {
                if (done) return;
                done = true;
                try { unsub(); } catch (e) {}
                reject(new Error('Firebase Auth timeout'));
            }, timeoutMs);
            var unsub = auth.onAuthStateChanged(function (user) {
                if (!user || done) return;
                done = true;
                clearTimeout(t);
                try { unsub(); } catch (e) {}
                resolve(user);
            }, function (err) {
                if (done) return;
                done = true;
                clearTimeout(t);
                reject(err);
            });
        });
    }

    function getOrCreateSessionId() {
        try {
            var s = sessionStorage.getItem(SESSION_KEY);
            if (s) return s;
            s = 'fs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 12);
            sessionStorage.setItem(SESSION_KEY, s);
            return s;
        } catch (e) {
            return 'fs_fallback_' + Date.now();
        }
    }

    function readQuizState() {
        try {
            var raw = localStorage.getItem(QUIZ_STORAGE);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function getFunnelContext() {
        var st = readQuizState();
        var uid = (typeof window.firebaseUserId === 'string' && window.firebaseUserId) || null;
        return {
            submissionId: st && st.firestoreSubmissionId ? st.firestoreSubmissionId : null,
            patternKey: st && st.patternKey ? st.patternKey : window.quizPatternKey || null,
            herPatternKey: window.quizHerResponsePattern || null,
            quizState: st,
            uid: uid
        };
    }

    function profileRollupForEvent(eventType, payload) {
        var ts = firebase.firestore.FieldValue.serverTimestamp();
        var stages = window.PATTERN_RESET_JOURNEY_STAGES || {};
        var out = { updatedAt: ts };
        var offerId = payload && payload.offerId ? payload.offerId : null;

        switch (eventType) {
            case 'quiz_completed':
                out.latestCustomerJourneyStage = stages.QUIZ_COMPLETED || 'quiz_completed';
                break;
            case 'results_viewed':
                out.latestCustomerJourneyStage = stages.RESULTS_VIEWED || 'results_viewed';
                break;
            case 'paywall_opened':
                out.latestOfferViewed = offerId || 'all_tiers';
                out.latestCustomerJourneyStage = stages.PAYWALL_OPENED || 'paywall_opened';
                break;
            case 'offer_clicked':
                if (offerId) {
                    out.latestOfferClicked = offerId;
                    out.latestOfferClickedAt = ts;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.latestOfferClickedLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(
                            0,
                            400
                        );
                    }
                    out.latestOfferViewed = out.latestOfferViewed || 'all_tiers';
                }
                out.latestCustomerJourneyStage = stages.OFFER_CLICKED || 'offer_clicked';
                break;
            case 'intake_page_viewed':
                out.latestCustomerJourneyStage = stages.INTAKE_PAGE_VIEWED || 'intake_page_viewed';
                if (payload && payload.entryPath) {
                    out.latestEntryPath = payload.entryPath;
                }
                break;
            case 'intake_started':
                out.latestIntakeStartedAt = ts;
                out.latestCustomerJourneyStage = stages.INTAKE_STARTED || 'intake_started';
                break;
            case 'intake_submitted':
                if (payload && payload.intakeId) {
                    out.latestIntakeId = payload.intakeId;
                    out.latestIntakeSubmittedAt = ts;
                }
                out.latestCustomerJourneyStage = stages.INTAKE_SUBMITTED || 'intake_submitted';
                if (offerId) {
                    out.latestOfferClicked = offerId;
                    out.latestOfferClickedAt = ts;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.latestOfferClickedLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                if (payload && payload.intakePayload && typeof payload.intakePayload === 'object') {
                    var ip = payload.intakePayload;
                    if (ip.relationshipStage != null && ip.relationshipStage !== '') {
                        out.latestRelationshipStage = String(ip.relationshipStage).slice(0, 120);
                    }
                    if (ip.relationshipStageLabel != null && ip.relationshipStageLabel !== '') {
                        out.latestRelationshipStageLabel = String(ip.relationshipStageLabel).slice(0, 400);
                    }
                    if (ip.biggestFear != null && ip.biggestFear !== '') {
                        out.latestBiggestFear = String(ip.biggestFear).slice(0, 200);
                    }
                    if (ip.biggestFearLabel != null && ip.biggestFearLabel !== '') {
                        out.latestBiggestFearLabel = String(ip.biggestFearLabel).slice(0, 400);
                    }
                    if (ip.idealOutcome != null && ip.idealOutcome !== '') {
                        out.latestIdealOutcome = String(ip.idealOutcome).slice(0, 2000);
                    }
                    if (ip.whatDoYouNeedAnswered != null && ip.whatDoYouNeedAnswered !== '') {
                        out.latestNeedOrQuestion = String(ip.whatDoYouNeedAnswered).slice(0, 8000);
                    }
                    if (ip.whatIsHappening != null && ip.whatIsHappening !== '') {
                        out.latestSituationSummary = String(ip.whatIsHappening).slice(0, 8000);
                    }
                }
                break;
            case 'checkout_started':
                if (offerId) {
                    out.latestCheckoutStartedOffer = offerId;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.selectedOfferLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                out.checkoutStarted = true;
                out.checkoutStartedAt = ts;
                out.latestPaymentStatus = 'pending';
                out.latestCustomerJourneyStage = stages.CHECKOUT_STARTED || 'checkout_started';
                break;
            case 'checkout_completed':
                break;
            case 'payment_succeeded':
                if (offerId) {
                    out.latestPaidOffer = offerId;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.selectedOfferLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                        out.latestPaidOfferLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                out.latestPaymentStatus = 'paid';
                out.latestCustomerJourneyStage = stages.PAID || 'paid';
                if (payload && payload.intakeId) out.latestIntakeId = payload.intakeId;
                if (payload && payload.customerStatus) out.customerStatus = payload.customerStatus;
                out.convertedAt = ts;
                break;
            case 'payment_failed':
                out.latestPaymentStatus = 'failed';
                break;
            case 'direct_answer_delivered':
                out.latestCustomerJourneyStage = stages.DELIVERED || 'delivered';
                out.deliveryStatus = 'delivered';
                break;
            default:
                break;
        }
        return out;
    }

    function submissionRollupForEvent(eventType, payload) {
        var ts = firebase.firestore.FieldValue.serverTimestamp();
        var offerId = payload && payload.offerId ? payload.offerId : null;
        var out = {};

        switch (eventType) {
            case 'paywall_opened':
                out.paywallViewedAt = ts;
                break;
            case 'offer_clicked':
                if (offerId) {
                    out.offerClicked = offerId;
                    out.offerClickedAt = ts;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.offerClickedLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                break;
            case 'intake_started':
                out.intakeStartedAt = ts;
                break;
            case 'intake_submitted':
                out.intakeSubmittedAt = ts;
                if (payload && payload.intakeId) {
                    out.linkedIntakeId = payload.intakeId;
                }
                if (offerId) {
                    out.offerClicked = offerId;
                    out.offerClickedAt = ts;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.offerClickedLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                break;
            case 'checkout_started':
                out.checkoutStarted = true;
                out.checkoutStartedAt = ts;
                out.paymentStatus = 'pending';
                if (offerId) {
                    out.checkoutOfferId = offerId;
                    out.selectedOffer = offerId;
                    if (window.PATTERN_RESET_OFFER_LABELS && window.PATTERN_RESET_OFFER_LABELS[offerId]) {
                        out.selectedOfferLabel = String(window.PATTERN_RESET_OFFER_LABELS[offerId]).slice(0, 400);
                    }
                }
                break;
            case 'payment_succeeded':
                out.paymentStatus = 'paid';
                if (offerId) out.paidOffer = offerId;
                out.convertedAt = ts;
                break;
            case 'payment_failed':
                out.paymentStatus = 'failed';
                break;
            default:
                return null;
        }
        return out;
    }

    /**
     * @param {string} eventType
     * @param {object} [payload] offerId, metadata, entryPath, intakeId, customerStatus, patternKey, herPatternKey, submissionId override
     */
    function trackCustomerEvent(eventType, payload) {
        payload = payload || {};
        var db = getDb();
        if (!db || typeof firebase === 'undefined') {
            return Promise.resolve(null);
        }

        return waitForFirebaseAuth()
            .then(function (user) {
                var uid = user.uid;
                var ctx = getFunnelContext();
                var submissionId = payload.submissionId != null ? payload.submissionId : ctx.submissionId;
                var patternKey = payload.patternKey != null ? payload.patternKey : ctx.patternKey;
                var herPatternKey = payload.herPatternKey != null ? payload.herPatternKey : ctx.herPatternKey;

                var eventRef = db.collection('quizProfiles').doc(uid).collection('events').doc();
                var profileRef = db.collection('quizProfiles').doc(uid);
                var profileMerge = profileRollupForEvent(eventType, payload);

                var ev = {
                    uid: uid,
                    eventType: String(eventType || '').slice(0, 64),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    source: String(payload.source || 'site').slice(0, 120),
                    submissionId: submissionId || null,
                    patternKey: patternKey || null,
                    herPatternKey: herPatternKey || null,
                    offerId: payload.offerId || null,
                    offerLabel:
                        payload.offerId &&
                        window.PATTERN_RESET_OFFER_LABELS &&
                        window.PATTERN_RESET_OFFER_LABELS[payload.offerId]
                            ? String(window.PATTERN_RESET_OFFER_LABELS[payload.offerId]).slice(0, 300)
                            : null,
                    page: typeof location !== 'undefined' ? String(location.href).slice(0, 2000) : '',
                    path: typeof location !== 'undefined' ? String(location.pathname).slice(0, 500) : '',
                    sessionId: getOrCreateSessionId(),
                    entryPath: payload.entryPath || null,
                    entrySource: payload.entrySource != null ? String(payload.entrySource).slice(0, 120) : null,
                    entryCampaign: payload.entryCampaign != null ? String(payload.entryCampaign).slice(0, 120) : null,
                    intakeId: payload.intakeId || null,
                    metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : null
                };

                var subMerge = submissionRollupForEvent(eventType, payload);
                var batch = db.batch();
                batch.set(eventRef, ev);

                if (profileMerge && Object.keys(profileMerge).length > 0) {
                    batch.set(profileRef, profileMerge, { merge: true });
                }

                if (submissionId && subMerge && Object.keys(subMerge).length > 0) {
                    var subRef = profileRef.collection('submissions').doc(submissionId);
                    batch.set(subRef, subMerge, { merge: true });
                }

                return batch.commit().then(function () {
                    return { eventId: eventRef.id, uid: uid };
                });
            })
            .catch(function (err) {
                console.warn('trackCustomerEvent', eventType, err);
                return null;
            });
    }

    function persistFirestoreSubmissionId(submissionId) {
        if (!submissionId) return;
        try {
            var raw = localStorage.getItem(QUIZ_STORAGE);
            var st = raw ? JSON.parse(raw) : {};
            st.firestoreSubmissionId = submissionId;
            localStorage.setItem(QUIZ_STORAGE, JSON.stringify(st));
        } catch (e) {}
    }

    window.trackCustomerEvent = trackCustomerEvent;
    window.getFunnelContext = getFunnelContext;
    window.persistFirestoreSubmissionId = persistFirestoreSubmissionId;
    window.getOrCreateFunnelSessionId = getOrCreateSessionId;
})();
