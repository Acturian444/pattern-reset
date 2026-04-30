/**
 * Quiz profile + submission writes — Firestore as source of truth.
 * Collections: quizProfiles/{uid}, quizProfiles/{uid}/submissions/{submissionId}
 */
(function () {
    'use strict';

    var QUIZ_RESULT_VERSION = 'relationship-dynamic-v6';
    var DEFAULT_SOURCE = 'index-relationship-quiz';

    function getDb() {
        return window.letitoutDb || (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore());
    }

    function getAuth() {
        return window.letitoutAuth || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth());
    }

    function waitForFirebaseAuth(timeoutMs) {
        timeoutMs = timeoutMs || 10000;
        var auth = getAuth();
        if (!auth) {
            return Promise.reject(new Error('Firebase Auth not available'));
        }
        if (auth.currentUser) {
            return Promise.resolve(auth.currentUser);
        }
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

    function buildAnswerKeys(quizData, answers) {
        if (!quizData || !answers) return [];
        var keys = [];
        for (var i = 0; i < quizData.length; i++) {
            var ai = answers[i];
            if (ai === undefined || !quizData[i] || !quizData[i].options) {
                keys.push(null);
                continue;
            }
            var opt = quizData[i].options[ai];
            if (!opt) {
                keys.push(null);
                continue;
            }
            var k =
                opt.answerKey ||
                opt.value ||
                opt.painKey ||
                opt.fearKey ||
                opt.subDimension ||
                opt.desireKey;
            if (k == null || k === '') {
                k = 'idx:' + ai;
            }
            keys.push(k);
        }
        return keys;
    }

    /**
     * @param {object} params — all quiz-derived fields + contact
     * @returns {Promise<{ uid: string, submissionId: string }>}
     */
    async function saveQuizCompletion(params) {
        var db = getDb();
        if (!db) {
            throw new Error('Firestore not available');
        }
        var user = await waitForFirebaseAuth();
        var uid = user.uid;
        var ts = firebase.firestore.FieldValue.serverTimestamp();
        var increment = firebase.firestore.FieldValue.increment(1);

        var quizData = params.quizData || [];
        var answers = params.answers || [];
        var answerKeys = buildAnswerKeys(quizData, answers);

        var human =
            window.QuizHumanize && typeof window.QuizHumanize.buildAll === 'function'
                ? window.QuizHumanize.buildAll(quizData, answers, {
                      patternName: params.patternName
                  })
                : {
                      answersSummary: {},
                      answersDetailed: {},
                      latestUrgencyLabel: null,
                      latestDecisionBlockLabel: null,
                      latestDesiredOutcomeLabel: null,
                      latestUserIntent: null
                  };

        var submissionId = db.collection('quizProfiles').doc().id;
        var subRef = db.collection('quizProfiles').doc(uid).collection('submissions').doc(submissionId);
        var profileRef = db.collection('quizProfiles').doc(uid);

        var profileSnap = await profileRef.get();
        var existing = profileSnap.exists ? profileSnap.data() : {};

        var offersShown =
            typeof window !== 'undefined' && Array.isArray(window.PATTERN_RESET_PAYWALL_OFFERS_SHOWN)
                ? window.PATTERN_RESET_PAYWALL_OFFERS_SHOWN
                : ['fast_clarity_19', 'direct_read_59', 'decide_with_me_197'];

        var submission = {
            createdAt: ts,
            source: params.source || DEFAULT_SOURCE,
            pagePath: params.pagePath || (typeof location !== 'undefined' ? location.pathname : ''),
            quizResultVersion: params.quizResultVersion || QUIZ_RESULT_VERSION,
            patternKey: params.patternKey || '',
            patternName: params.patternName || '',
            herPatternKey: params.herPatternKey != null ? params.herPatternKey : null,
            herPatternName: params.herPatternName != null ? params.herPatternName : null,
            driverScores: params.driverScores || {},
            driverPercentages: params.driverPercentages || {},
            patternDominance: typeof params.patternDominance === 'number' ? params.patternDominance : null,
            futureView: params.futureView != null ? params.futureView : null,
            decisionBlock: params.decisionBlock != null ? params.decisionBlock : null,
            desiredOutcomeIndex: typeof params.desiredOutcomeIndex === 'number' ? params.desiredOutcomeIndex : null,
            desiredOutcomeKey: params.desiredOutcomeKey != null ? params.desiredOutcomeKey : null,
            relationshipStage: params.relationshipStage != null ? params.relationshipStage : null,
            currentPainKey: params.currentPainKey != null ? params.currentPainKey : null,
            answerKeys: answerKeys,
            answersSummary: human.answersSummary || {},
            answersDetailed: human.answersDetailed || {},
            latestUrgencyLabel: human.latestUrgencyLabel != null ? human.latestUrgencyLabel : null,
            latestDecisionBlockLabel: human.latestDecisionBlockLabel != null ? human.latestDecisionBlockLabel : null,
            latestDesiredOutcomeLabel: human.latestDesiredOutcomeLabel != null ? human.latestDesiredOutcomeLabel : null,
            latestUserIntent: human.latestUserIntent != null ? human.latestUserIntent : null,
            secondaryPatternName: params.secondaryPatternName != null ? params.secondaryPatternName : null,
            secondaryDriverPercentage:
                params.secondaryDriverPercentage != null ? params.secondaryDriverPercentage : null,
            offersShown: offersShown,
            paywallViewedAt: null,
            offerClicked: null,
            offerClickedAt: null,
            intakeStartedAt: null,
            intakeSubmittedAt: null,
            checkoutStarted: false,
            checkoutStartedAt: null,
            checkoutOfferId: null,
            selectedOffer: null,
            paymentStatus: 'none',
            paidOffer: null,
            convertedAt: null
        };

        var profilePayload = {
            uid: uid,
            updatedAt: ts,
            email: params.email || null,
            name: params.name || null,
            latestPatternKey: params.patternKey || null,
            latestPatternName: params.patternName || null,
            latestHerPatternKey: params.herPatternKey != null ? params.herPatternKey : null,
            latestHerPatternName: params.herPatternName != null ? params.herPatternName : null,
            latestUrgency: params.futureView != null ? params.futureView : null,
            latestUrgencyLabel: human.latestUrgencyLabel != null ? human.latestUrgencyLabel : null,
            latestDecisionBlock: params.decisionBlock != null ? params.decisionBlock : null,
            latestDecisionBlockLabel: human.latestDecisionBlockLabel != null ? human.latestDecisionBlockLabel : null,
            latestDesiredOutcome: params.desiredOutcomeKey != null ? params.desiredOutcomeKey : null,
            latestDesiredOutcomeLabel: human.latestDesiredOutcomeLabel != null ? human.latestDesiredOutcomeLabel : null,
            latestUserIntent: human.latestUserIntent != null ? human.latestUserIntent : null,
            latestRelationshipStage: params.relationshipStage != null ? params.relationshipStage : null,
            latestSource: params.source || DEFAULT_SOURCE,
            latestQuizCompletedAt: ts,
            latestSubmissionId: submissionId,
            quizCount: increment,
            latestOfferViewed: null,
            latestOfferClicked: null,
            latestOfferClickedAt: null,
            latestCheckoutStartedOffer: null,
            latestPaidOffer: null,
            latestPaymentStatus: 'none',
            latestCustomerJourneyStage: 'quiz_completed',
            latestIntakeId: null,
            latestIntakeStartedAt: null,
            latestIntakeSubmittedAt: null,
            latestEntryPath: null,
            selectedOffer: null,
            checkoutStarted: false,
            checkoutStartedAt: null
        };

        if (!profileSnap.exists) {
            profilePayload.createdAt = ts;
        }
        if (!existing.customerStatus) {
            profilePayload.customerStatus = 'lead';
        }

        var batch = db.batch();
        batch.set(subRef, submission);
        batch.set(profileRef, profilePayload, { merge: true });
        await batch.commit();

        return { uid: uid, submissionId: submissionId };
    }

    window.QuizProfileService = {
        waitForFirebaseAuth: waitForFirebaseAuth,
        buildAnswerKeys: buildAnswerKeys,
        saveQuizCompletion: saveQuizCompletion,
        QUIZ_RESULT_VERSION: QUIZ_RESULT_VERSION
    };
})();
