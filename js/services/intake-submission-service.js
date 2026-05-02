/**
 * Paid intake layer: intakeSubmissions/{intakeId} (client create only; payment via server webhook).
 */
(function () {
    'use strict';

    function getDb() {
        return window.letitoutDb || (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore());
    }

    function waitAuth() {
        if (window.QuizProfileService && typeof window.QuizProfileService.waitForFirebaseAuth === 'function') {
            return window.QuizProfileService.waitForFirebaseAuth(12000);
        }
        return Promise.reject(new Error('QuizProfileService missing'));
    }

    /**
     * @param {object} p
     * @returns {Promise<string>} intakeId
     */
    function createIntakeSubmission(p) {
        p = p || {};
        var db = getDb();
        if (!db) return Promise.reject(new Error('Firestore not available'));

        return waitAuth().then(function (user) {
            var uid = user.uid;
            var ts = firebase.firestore.FieldValue.serverTimestamp();
            var doc = {
                uid: uid,
                profileId: uid,
                submissionId: p.submissionId || null,
                quizSubmissionId: p.submissionId || null,
                source: String(p.source || 'personal-relationship-read').slice(0, 120),
                entryPath: p.entryPath === 'quiz' ? 'quiz' : 'direct_url',
                entrySource: p.entrySource ? String(p.entrySource).slice(0, 120) : null,
                entryCampaign: p.entryCampaign ? String(p.entryCampaign).slice(0, 120) : null,
                offerId: String(p.offerId || 'direct_read_59').slice(0, 64),
                patternKey: p.patternKey != null ? String(p.patternKey).slice(0, 80) : null,
                patternName: p.patternName != null ? String(p.patternName).slice(0, 200) : null,
                herPatternKey: p.herPatternKey != null ? String(p.herPatternKey).slice(0, 80) : null,
                herPatternName: p.herPatternName != null ? String(p.herPatternName).slice(0, 200) : null,
                email: p.email ? String(p.email).slice(0, 320) : null,
                name: p.name != null ? String(p.name).slice(0, 120) : null,
                relationshipStage: p.relationshipStage != null ? String(p.relationshipStage).slice(0, 120) : null,
                relationshipStageLabel:
                    p.relationshipStageLabel != null ? String(p.relationshipStageLabel).slice(0, 400) : null,
                relationshipDuration:
                    p.relationshipDuration != null ? String(p.relationshipDuration).slice(0, 64) : null,
                relationshipDurationLabel:
                    p.relationshipDurationLabel != null ? String(p.relationshipDurationLabel).slice(0, 200) : null,
                patternScope: p.patternScope != null ? String(p.patternScope).slice(0, 64) : null,
                patternScopeLabel:
                    p.patternScopeLabel != null ? String(p.patternScopeLabel).slice(0, 200) : null,
                age: typeof p.age === 'number' && !isNaN(p.age) ? p.age : null,
                whatIsHappening: p.whatIsHappening ? String(p.whatIsHappening).slice(0, 8000) : null,
                whatIsConfusing: p.whatIsConfusing ? String(p.whatIsConfusing).slice(0, 8000) : null,
                whatDoYouNeedAnswered: p.whatDoYouNeedAnswered ? String(p.whatDoYouNeedAnswered).slice(0, 8000) : null,
                biggestFear: p.biggestFear != null ? String(p.biggestFear).slice(0, 200) : null,
                biggestFearLabel: p.biggestFearLabel != null ? String(p.biggestFearLabel).slice(0, 400) : null,
                idealOutcome: p.idealOutcome != null ? String(p.idealOutcome).slice(0, 2000) : null,
                paymentStatus: 'pending_checkout',
                checkoutStartedAt: null,
                checkoutSessionId: null,
                stripeCustomerId: null,
                deliveryStatus: 'pending',
                deliveredAt: null,
                assignedTo: null,
                createdAt: ts,
                updatedAt: ts
            };

            return db.collection('intakeSubmissions').add(doc).then(function (ref) {
                return ref.id;
            });
        });
    }

    /**
     * After Stripe session is created — narrow client update (see firestore.rules).
     */
    function patchIntakeCheckoutMeta(intakeId, checkoutSessionId) {
        if (!intakeId || !checkoutSessionId) {
            return Promise.reject(new Error('patchIntakeCheckoutMeta: missing id'));
        }
        var db = getDb();
        if (!db) return Promise.reject(new Error('Firestore not available'));

        return waitAuth().then(function () {
            var ts = firebase.firestore.FieldValue.serverTimestamp();
            return db
                .collection('intakeSubmissions')
                .doc(intakeId)
                .set(
                    {
                        checkoutSessionId: String(checkoutSessionId).slice(0, 200),
                        checkoutStartedAt: ts,
                        updatedAt: ts
                    },
                    { merge: true }
                );
        });
    }

    window.createIntakeSubmission = createIntakeSubmission;
    window.patchIntakeCheckoutMeta = patchIntakeCheckoutMeta;
})();
