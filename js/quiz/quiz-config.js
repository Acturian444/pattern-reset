// Quiz Configuration Constants
// Relationship Dynamic Quiz - Version 2.0
// Centralized configuration for easy maintenance and updates
// IIFE pattern - works without build system

(function() {
    'use strict';
    
    // Make config available globally
    window.QUIZ_CONFIG = {
    // Question counts - 16 scored + 1 birth date + 1 relationship status + 1 current pain + 1 biggest fear (v2.1)
    TOTAL_SCORED_QUESTIONS: 16,
    TOTAL_QUESTIONS: 20,
    BIRTH_DATE_QUESTION_INDEX: 16,
    RELATIONSHIP_STATUS_QUESTION_INDEX: 17,
    CURRENT_PAIN_QUESTION_INDEX: 18,
    BIGGEST_FEAR_QUESTION_INDEX: 19,
    
    // Scoring - 0/2/4/6 scale for nuanced signals (v2.1)
    POINTS_PER_ANSWER: 3, // legacy fallback
    MAX_SCORE: 96, // 16 questions × 6 max
    
    // Dimension keys for relationship dynamic quiz
    DIMENSIONS: {
        HIS_BEHAVIOR: 'his-behavior',
        HER_RESPONSE: 'her-response',
        DYNAMIC: 'dynamic',
        ATTRACTION: 'attraction'
    },
    
    // Pattern dominance thresholds
    DOMINANCE_THRESHOLDS: {
        STRONG: 70,
        MODERATE: 50,
        BALANCED: 40,
        MIXED: 0
    },
    
    // Secondary pattern threshold
    SECONDARY_PATTERN_THRESHOLD: 25, // Percentage
    
    // LocalStorage key (primary - used throughout code)
    STORAGE_KEY: 'patternResetQuizState',
    
    // Additional localStorage keys (for reference)
    STORAGE_KEYS: {
        QUIZ_STATE: 'patternResetQuizState',
        POPUP_CLOSED: 'hm_popup_closed',
        COURSE_UNLOCKED: 'courseUnlocked_breakup'
    },
    
    // Error messages
    ERROR_MESSAGES: {
        PATTERN_NOT_FOUND: 'An error occurred calculating your pattern. Please try again.',
        INVALID_EMAIL: 'Please enter a valid email address.',
        MISSING_NAME: 'Please enter your name.',
        MISSING_PHONE: 'Please enter your phone number.',
        MISSING_ANSWER: 'Please select an answer before continuing.'
    }
    };
})();
