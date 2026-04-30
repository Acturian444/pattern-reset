// Quiz Configuration Constants
// Relationship Dynamic Quiz — v6.0 (10 Q, escalation: mirror + tension, less redundancy)

(function() {
    'use strict';
    
    window.QUIZ_CONFIG = {
    // Indices 0–7: included in driver accumulation loop (her-response + future may score 0); 8–9 decision + desire (score 0)
    TOTAL_SCORED_QUESTIONS: 8,
    TOTAL_QUESTIONS: 10,
    // Legacy indices removed (birthdate, standalone status/pain/fear). Kept for any old guards:
    BIRTH_DATE_QUESTION_INDEX: -1,
    RELATIONSHIP_STATUS_QUESTION_INDEX: -1,
    CURRENT_PAIN_QUESTION_INDEX: -1,
    BIGGEST_FEAR_QUESTION_INDEX: -1,
    
    POINTS_PER_ANSWER: 3,
    MAX_SCORE: 72,
    
    DIMENSIONS: {
        HIS_BEHAVIOR: 'his-behavior',
        HER_RESPONSE: 'her-response',
        DYNAMIC: 'dynamic',
        ATTRACTION: 'attraction'
    },
    
    DOMINANCE_THRESHOLDS: {
        STRONG: 70,
        MODERATE: 50,
        BALANCED: 40,
        MIXED: 0
    },
    
    SECONDARY_PATTERN_THRESHOLD: 25,
    
    STORAGE_KEY: 'patternResetQuizState',
    
    STORAGE_KEYS: {
        QUIZ_STATE: 'patternResetQuizState',
        POPUP_CLOSED: 'hm_popup_closed',
        COURSE_UNLOCKED: 'courseUnlocked_breakup'
    },
    
    ERROR_MESSAGES: {
        PATTERN_NOT_FOUND: 'An error occurred calculating your pattern. Please try again.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        MISSING_NAME: 'Please enter your name.',
        MISSING_PHONE: 'Please enter your phone number.',
        MISSING_ANSWER: 'Please select an answer before continuing.'
    }
    };
})();
