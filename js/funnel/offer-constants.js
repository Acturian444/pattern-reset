/**
 * Stable offer IDs for funnel / Stripe / Firestore (do not rename lightly).
 */
(function () {
    'use strict';
    window.PATTERN_RESET_OFFER_IDS = {
        FAST_CLARITY_19: 'fast_clarity_19',
        DIRECT_READ_59: 'direct_read_59',
        DECIDE_WITH_ME_197: 'decide_with_me_197'
    };
    /** Shown together on the relationship quiz paywall (order for analytics only). */
    window.PATTERN_RESET_PAYWALL_OFFERS_SHOWN = [
        'fast_clarity_19',
        'direct_read_59',
        'decide_with_me_197'
    ];
    /** Short labels for Firebase console / events (differentiate tiers at a glance). */
    window.PATTERN_RESET_OFFER_LABELS = {
        fast_clarity_19: '$19 — See what to do next (in-modal breakdown)',
        direct_read_59: '$59 — Direct written answer for your situation',
        decide_with_me_197: '$197 — 1:1 call (decide with me)'
    };
    window.PATTERN_RESET_JOURNEY_STAGES = {
        ANONYMOUS_VISITOR: 'anonymous_visitor',
        QUIZ_STARTED: 'quiz_started',
        QUIZ_COMPLETED: 'quiz_completed',
        RESULTS_VIEWED: 'results_viewed',
        PAYWALL_OPENED: 'paywall_opened',
        OFFER_CLICKED: 'offer_clicked',
        INTAKE_PAGE_VIEWED: 'intake_page_viewed',
        INTAKE_STARTED: 'intake_started',
        INTAKE_SUBMITTED: 'intake_submitted',
        CHECKOUT_STARTED: 'checkout_started',
        PAID: 'paid',
        DELIVERED: 'delivered'
    };
    window.PATTERN_RESET_EVENT_TYPES = {
        QUIZ_COMPLETED: 'quiz_completed',
        RESULTS_VIEWED: 'results_viewed',
        PAYWALL_OPENED: 'paywall_opened',
        OFFER_CLICKED: 'offer_clicked',
        INTAKE_PAGE_VIEWED: 'intake_page_viewed',
        INTAKE_STARTED: 'intake_started',
        INTAKE_SUBMITTED: 'intake_submitted',
        CHECKOUT_STARTED: 'checkout_started',
        CHECKOUT_COMPLETED: 'checkout_completed',
        PAYMENT_SUCCEEDED: 'payment_succeeded',
        PAYMENT_FAILED: 'payment_failed',
        DIRECT_ANSWER_DELIVERED: 'direct_answer_delivered'
    };
})();
