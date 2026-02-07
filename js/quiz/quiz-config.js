// Quiz Configuration Constants
// Centralized configuration for easy maintenance and updates
// IIFE pattern - works without build system

(function() {
    'use strict';
    
    // Make config available globally
    window.QUIZ_CONFIG = {
    // Question counts
    TOTAL_SCORED_QUESTIONS: 47,
    TOTAL_QUESTIONS: 49, // 47 scored + 1 birth date + 1 relationship status
    BIRTH_DATE_QUESTION_INDEX: 47,
    RELATIONSHIP_STATUS_QUESTION_INDEX: 48,
    
    // Scoring
    POINTS_PER_ANSWER: 3,
    MAX_SCORE: 141, // 47 questions × 3 points
    
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
    // Structure: Love (4), Money (4), Health (6), Lifestyle (4), Physical (2), Productivity (3), Purpose (3), Identity (4), Childhood (6), Trauma (3), Relationships (6), Reflection (2)
    QUESTION_DOMAINS: {
        LOVE: { start: 0, end: 3, name: 'Love & Connection' },
        MONEY: { start: 4, end: 7, name: 'Money & Finances' },
        HEALTH: { start: 8, end: 13, name: 'Health & Habits' },
        LIFESTYLE: { start: 14, end: 17, name: 'Lifestyle & Daily Habits' },
        PHYSICAL: { start: 18, end: 19, name: 'Physical Health & Body' },
        PRODUCTIVITY: { start: 20, end: 22, name: 'Productivity & Time' },
        PURPOSE: { start: 23, end: 25, name: 'Purpose & Flow' },
        IDENTITY: { start: 26, end: 29, name: 'Identity & Self' },
        CHILDHOOD: { start: 30, end: 35, name: 'Childhood & Origin' },
        TRAUMA: { start: 36, end: 38, name: 'Trauma & Adversity' },
        RELATIONSHIPS: { start: 39, end: 44, name: 'Relationship Patterns' },
        REFLECTION: { start: 45, end: 46, name: 'Reflection' }
    },
    
    // LocalStorage key (primary - used throughout code)
    STORAGE_KEY: 'patternResetQuizState', // Updated from heartMattersQuizState
    
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

