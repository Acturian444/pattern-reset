// Quiz Configuration Constants
// Centralized configuration for easy maintenance and updates
// IIFE pattern - works without build system

(function() {
    'use strict';
    
    // Make config available globally
    window.QUIZ_CONFIG = {
    // Question counts
    TOTAL_SCORED_QUESTIONS: 34,
    TOTAL_QUESTIONS: 36, // 34 scored + 1 birth date + 1 relationship status
    BIRTH_DATE_QUESTION_INDEX: 34,
    RELATIONSHIP_STATUS_QUESTION_INDEX: 35,
    
    // Scoring
    POINTS_PER_ANSWER: 3,
    MAX_SCORE: 102, // 34 questions × 3 points
    
    // Pattern dominance thresholds
    DOMINANCE_THRESHOLDS: {
        STRONG: 70,
        MODERATE: 50,
        BALANCED: 40,
        MIXED: 0
    },
    
    // Secondary pattern threshold
    SECONDARY_PATTERN_THRESHOLD: 25, // Percentage
    
    // Question domains (for pattern determination)
    // Structure: Love (4), Money (4), Health (4), Lifestyle (1), Physical (1), Productivity (2), Purpose (2), Identity (4), Childhood (4), Trauma (1), Relationships (5), Reflection (2)
    QUESTION_DOMAINS: {
        LOVE: { start: 0, end: 3, name: 'Love & Connection' },
        MONEY: { start: 4, end: 7, name: 'Money & Finances' },
        HEALTH: { start: 8, end: 11, name: 'Health & Habits' },
        LIFESTYLE: { start: 12, end: 12, name: 'Lifestyle & Daily Habits' },
        PHYSICAL: { start: 13, end: 13, name: 'Physical Health & Body' },
        PRODUCTIVITY: { start: 14, end: 15, name: 'Productivity & Time' },
        PURPOSE: { start: 16, end: 17, name: 'Purpose & Flow' },
        IDENTITY: { start: 18, end: 21, name: 'Identity & Self' },
        CHILDHOOD: { start: 22, end: 25, name: 'Childhood & Origin' },
        TRAUMA: { start: 26, end: 26, name: 'Trauma & Adversity' },
        RELATIONSHIPS: { start: 27, end: 31, name: 'Relationship Patterns' },
        REFLECTION: { start: 32, end: 33, name: 'Reflection' }
    },
    
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

