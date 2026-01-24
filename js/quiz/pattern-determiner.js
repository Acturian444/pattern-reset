// Pattern Determination Module
// Data-driven pattern determination (replaces hardcoded indices)

(function() {
    'use strict';
    
    // Pattern determination rules (data-driven, not hardcoded)
    const PATTERN_RULES = {
        'control': {
            patterns: ['fixer', 'perfectionist'],
            // Fixer indicators: action-oriented responses in Love domain
            fixerIndicators: {
                domains: ['LOVE'],
                // Questions that indicate Fixer pattern (action-oriented)
                questionIndicators: {
                    // "Step in and try to fix" - action-oriented
                    actionKeywords: ['fix', 'resolve', 'take charge', 'set the pace'],
                    // "Plan deeply" - perfectionist indicator
                    perfectionistKeywords: ['plan deeply', 'do it right', 'perfect']
                }
            }
        },
        'avoidance': {
            patterns: ['escaper', 'overthinker'],
            // Escaper: numbing/avoiding in Health domain
            // Overthinker: analyzing in Identity domain
            escaperIndicators: {
                domains: ['HEALTH'],
                keywords: ['numb', 'distract', 'avoid', 'delay']
            },
            overthinkerIndicators: {
                domains: ['IDENTITY'],
                keywords: ['analyze', 'plan', 'understand']
            }
        },
        'validation': {
            patterns: ['pleaser', 'performer'],
            // Pleaser: harmony-focused in Love domain
            // Performer: achievement-focused in Money domain
            pleaserIndicators: {
                domains: ['LOVE'],
                keywords: ['apologize', 'smooth', 'please', 'happy']
            },
            performerIndicators: {
                domains: ['MONEY'],
                keywords: ['value', 'success', 'respected', 'recognized']
            }
        },
        'fear-of-rejection': {
            patterns: ['guarded-one', 'overgiver'],
            // Guarded: withdraws in Love domain
            // Overgiver: gives more in Reflection domain
            guardedIndicators: {
                domains: ['LOVE'],
                keywords: ['withdraw', 'pull back', 'distance', 'protect']
            },
            overgiverIndicators: {
                domains: ['REFLECTION'],
                keywords: ['give', 'worth', 'accepted']
            }
        }
    };
    
    // Helper: Check if answer text contains keywords
    function answerMatchesKeywords(optionText, keywords) {
        const lowerText = optionText.toLowerCase();
        return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
    }
    
    // Helper: Get questions in domain
    function getQuestionsInDomain(quizData, domain, answers) {
        const domainQuestions = [];
        quizData.forEach((question, index) => {
            if (question.domain === domain && answers[index] !== undefined) {
                const option = question.options[answers[index]];
                if (option) {
                    domainQuestions.push({
                        index,
                        option,
                        question
                    });
                }
            }
        });
        return domainQuestions;
    }
    
    // Determine pattern based on driver and domain-specific responses
    window.PatternDeterminer = {
        determinePattern: function(driverScores, answers, quizData, personalityPatterns, archetypeCategories) {
            // Find dominant driver
            const sortedDrivers = Object.entries(driverScores)
                .sort((a, b) => b[1] - a[1]);
            
            const dominantDriver = sortedDrivers[0][0];
            const rules = PATTERN_RULES[dominantDriver];
            
            if (!rules) {
                console.error('Unknown driver:', dominantDriver);
                return 'fixer'; // Fallback
            }
            
            // If only one pattern for this driver, return it
            if (rules.patterns.length === 1) {
                return rules.patterns[0];
            }
            
            // Determine between two patterns using domain-specific analysis
            if (dominantDriver === 'control') {
                return determineControlPattern(answers, quizData, rules);
            } else if (dominantDriver === 'avoidance') {
                return determineAvoidancePattern(answers, quizData, rules);
            } else if (dominantDriver === 'validation') {
                return determineValidationPattern(answers, quizData, rules);
            } else if (dominantDriver === 'fear-of-rejection') {
                return determineFearOfRejectionPattern(answers, quizData, rules);
            }
            
            // Fallback
            return rules.patterns[0];
        }
    };
    
    // Control driver: Fixer vs Perfectionist
    function determineControlPattern(answers, quizData, rules) {
        let fixerScore = 0;
        let perfectionistScore = 0;
        
        // Check Love domain for action-oriented (Fixer) vs planning (Perfectionist)
        const loveQuestions = getQuestionsInDomain(quizData, 'LOVE', answers);
        loveQuestions.forEach(({ option }) => {
            if (option.driver === 'control') {
                const text = option.text.toLowerCase();
                // Fixer: action-oriented
                if (text.includes('fix') || text.includes('resolve') || text.includes('take charge') || text.includes('set the pace')) {
                    fixerScore += option.score;
                }
            }
        });
        
        // Check Identity domain for planning (Perfectionist) vs action (Fixer)
        const identityQuestions = getQuestionsInDomain(quizData, 'IDENTITY', answers);
        identityQuestions.forEach(({ option, index }) => {
            if (option.driver === 'control') {
                const text = option.text.toLowerCase();
                // Perfectionist: planning/deep thinking
                if (text.includes('plan deeply') || text.includes('control outcomes')) {
                    perfectionistScore += option.score;
                }
                // Fixer: action-oriented (index 15 = "Take charge and handle it fast")
                if (index === 15 && text.includes('take charge')) {
                    fixerScore += option.score;
                }
            }
        });
        
        return fixerScore >= perfectionistScore ? 'fixer' : 'perfectionist';
    }
    
    // Avoidance driver: Escaper vs Overthinker
    function determineAvoidancePattern(answers, quizData, rules) {
        let escaperScore = 0;
        let overthinkerScore = 0;
        
        // Check Health domain for numbing/avoiding (Escaper)
        const healthQuestions = getQuestionsInDomain(quizData, 'HEALTH', answers);
        healthQuestions.forEach(({ option }) => {
            if (option.driver === 'avoidance') {
                const text = option.text.toLowerCase();
                if (text.includes('numb') || text.includes('distract') || text.includes('avoid') || text.includes('delay')) {
                    escaperScore += option.score;
                }
            }
        });
        
        // Check Identity domain for analyzing (Overthinker)
        const identityQuestions = getQuestionsInDomain(quizData, 'IDENTITY', answers);
        identityQuestions.forEach(({ option }) => {
            if (option.driver === 'avoidance') {
                const text = option.text.toLowerCase();
                if (text.includes('analyze') || text.includes('plan') || text.includes('understand')) {
                    overthinkerScore += option.score;
                }
            }
        });
        
        return escaperScore >= overthinkerScore ? 'escaper' : 'overthinker';
    }
    
    // Validation driver: Pleaser vs Performer
    function determineValidationPattern(answers, quizData, rules) {
        let pleaserScore = 0;
        let performerScore = 0;
        
        // Check Love domain for harmony (Pleaser)
        const loveQuestions = getQuestionsInDomain(quizData, 'LOVE', answers);
        loveQuestions.forEach(({ option }) => {
            if (option.driver === 'validation') {
                const text = option.text.toLowerCase();
                if (text.includes('apologize') || text.includes('smooth') || text.includes('please')) {
                    pleaserScore += option.score;
                }
            }
        });
        
        // Check Money domain for achievement (Performer)
        const moneyQuestions = getQuestionsInDomain(quizData, 'MONEY', answers);
        moneyQuestions.forEach(({ option }) => {
            if (option.driver === 'validation') {
                const text = option.text.toLowerCase();
                if (text.includes('value') || text.includes('success') || text.includes('respected') || text.includes('recognized')) {
                    performerScore += option.score;
                }
            }
        });
        
        return pleaserScore >= performerScore ? 'pleaser' : 'performer';
    }
    
    // Fear of Rejection driver: Guarded One vs Overgiver
    function determineFearOfRejectionPattern(answers, quizData, rules) {
        let guardedScore = 0;
        let overgiverScore = 0;
        
        // Check Love domain for withdrawal (Guarded)
        const loveQuestions = getQuestionsInDomain(quizData, 'LOVE', answers);
        loveQuestions.forEach(({ option }) => {
            if (option.driver === 'fear-of-rejection') {
                const text = option.text.toLowerCase();
                if (text.includes('withdraw') || text.includes('pull back') || text.includes('distance') || text.includes('protect')) {
                    guardedScore += option.score;
                }
            }
        });
        
        // Check Reflection domain for giving (Overgiver)
        const reflectionQuestions = getQuestionsInDomain(quizData, 'REFLECTION', answers);
        reflectionQuestions.forEach(({ option }) => {
            if (option.driver === 'fear-of-rejection') {
                const text = option.text.toLowerCase();
                if (text.includes('worth') || text.includes('accepted')) {
                    overgiverScore += option.score;
                }
            }
        });
        
        return guardedScore >= overgiverScore ? 'guarded-one' : 'overgiver';
    }
})();

