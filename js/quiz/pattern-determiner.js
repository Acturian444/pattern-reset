// Pattern Determination Module - Relationship Dynamic Quiz v2.1
// Determines primary relationship pattern, her response pattern, and situationship modifier

(function() {
    'use strict';
    
    const RELATIONSHIP_PATTERN_QUESTION_INDEX = 8; // Q9 - "Which description feels closest"
    const HER_RESPONSE_QUESTIONS = [9, 10, 11]; // Q10-Q12 indices (0-based) - 3 questions
    const DURATION_QUESTION_INDEX = 13; // Q14 - "How long has this dynamic been going on?"
    
    const SUBDIMENSION_TO_PATTERN = {
        'hot-cold-cycle': 'hot-cold-cycle',
        'breadcrumb-dynamic': 'breadcrumb-dynamic',
        'commitment-avoidance': 'commitment-avoidance',
        'emotional-distance': 'emotional-distance',
        'mixed-signals-loop': 'mixed-signals-loop',
        'one-sided-investment': 'one-sided-investment',
        'hot-cold': 'hot-cold-cycle',
        'breadcrumb': 'breadcrumb-dynamic',
        'avoidant': 'emotional-distance',
        'one-sided': 'one-sided-investment'
    };
    
    const SUBDIMENSION_TO_HER_RESPONSE = {
        'reassurance-seeker': 'reassurance-seeker',
        'space-giver': 'space-giver',
        'direct-communicator': 'direct-communicator',
        'protector': 'protector',
        'balanced': 'balanced'
    };
    
    window.PatternDeterminer = {
        determinePattern: function(driverScores, answers, quizData, personalityPatterns, archetypeCategories) {
            // Primary: Use Q9 (dynamic question) if available - strongest signal
            const dynamicQuestion = quizData && quizData[RELATIONSHIP_PATTERN_QUESTION_INDEX];
            if (dynamicQuestion && dynamicQuestion.options && answers[RELATIONSHIP_PATTERN_QUESTION_INDEX] !== undefined) {
                const ansIdx = answers[RELATIONSHIP_PATTERN_QUESTION_INDEX];
                const option = dynamicQuestion.options[ansIdx];
                if (option && option.subDimension && SUBDIMENSION_TO_PATTERN[option.subDimension]) {
                    return SUBDIMENSION_TO_PATTERN[option.subDimension];
                }
            }
            
            // Fallback: Use dimension scores from driverScores (which now holds subDimension scores)
            const patternKeys = ['hot-cold-cycle', 'breadcrumb-dynamic', 'commitment-avoidance', 'emotional-distance', 'mixed-signals-loop', 'one-sided-investment'];
            let bestKey = 'hot-cold-cycle';
            let bestScore = 0;
            
            patternKeys.forEach(key => {
                const score = driverScores[key] || 0;
                if (score > bestScore) {
                    bestScore = score;
                    bestKey = key;
                }
            });
            
            return bestKey;
        },
        
        determineHerResponsePattern: function(answers, quizData) {
            const scores = { 'reassurance-seeker': 0, 'space-giver': 0, 'direct-communicator': 0, 'protector': 0 };
            
            HER_RESPONSE_QUESTIONS.forEach(qIdx => {
                if (!quizData || !quizData[qIdx] || !quizData[qIdx].options) return;
                const ansIdx = answers[qIdx];
                if (ansIdx === undefined) return;
                const option = quizData[qIdx].options[ansIdx];
                if (!option || !option.subDimension) return;
                const key = SUBDIMENSION_TO_HER_RESPONSE[option.subDimension];
                if (key && key !== 'balanced' && scores[key] !== undefined) {
                    scores[key] += option.score || 0;
                }
            });
            
            const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
            const topScore = sorted[0][1];
            return topScore > 0 ? sorted[0][0] : 'balanced';
        },
        
        getRepetitionInsight: function(answers, quizData) {
            const repetitionIdx = 12; // Q13
            if (!quizData || !quizData[repetitionIdx] || !quizData[repetitionIdx].options) return null;
            const ansIdx = answers[repetitionIdx];
            if (ansIdx === undefined) return null;
            const option = quizData[repetitionIdx].options[ansIdx];
            return option && option.value ? option.value : null;
        },
        
        // Situationship modifier: applies when undefined relationship + months without clarity
        hasSituationshipModifier: function(answers, quizData, relationshipStatus) {
            if (!relationshipStatus || relationshipStatus !== 'situationship') return false;
            if (!quizData || !quizData[DURATION_QUESTION_INDEX] || !quizData[DURATION_QUESTION_INDEX].options) return false;
            const ansIdx = answers[DURATION_QUESTION_INDEX];
            if (ansIdx === undefined) return false;
            const option = quizData[DURATION_QUESTION_INDEX].options[ansIdx];
            if (!option || !option.subDimension) return false;
            return option.subDimension === 'long' || option.subDimension === 'very-long';
        }
    };
})();
