// Pattern Determination Module - Relationship Dynamic Quiz v2.1
// Determines primary relationship pattern, her response pattern, and situationship modifier

(function() {
    'use strict';
    
    const RELATIONSHIP_PATTERN_QUESTION_INDEX = 5; // Q6 — pattern anchor (v6.0 10-Q)
    const HER_RESPONSE_QUESTIONS = [6]; // Her-response (index 6)
    
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
        'one-sided': 'one-sided-investment',
        'mixed-signals': 'mixed-signals-loop'
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
            // Primary: pattern-anchor question (Q6, index 5) — strongest single signal
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
            const futureIdx = 7; // Future projection (Q8, index 7)
            if (!quizData || !quizData[futureIdx] || !quizData[futureIdx].options) return null;
            const ansIdx = answers[futureIdx];
            if (ansIdx === undefined) return null;
            const option = quizData[futureIdx].options[ansIdx];
            return option && option.value ? option.value : null;
        },
        
        // v4.6: duration question removed, so this modifier is currently disabled.
        hasSituationshipModifier: function(answers, quizData, relationshipStatus) {
            return false;
        }
    };
})();
