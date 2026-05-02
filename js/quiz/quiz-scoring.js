// Quiz Scoring Module - Relationship Dynamic Quiz v2.0
// Dimension-based scoring for relationship patterns

(function() {
    'use strict';
    
    window.QuizScoring = {
        // Calculate dimension scores from answers (his-behavior, her-response, dynamic, attraction)
        calculateDriverScores: function(answers, quizData, config) {
            // For backward compatibility, we still use driverScores structure
            // but map dimensions to relationship pattern sub-dimensions
            const dimensionScores = {
                'hot-cold-cycle': 0,
                'breadcrumb-dynamic': 0,
                'commitment-avoidance': 0,
                'emotional-distance': 0,
                'mixed-signals-loop': 0,
                'one-sided-investment': 0,
                'reassurance-seeker': 0,
                'space-giver': 0,
                'direct-communicator': 0,
                'hopeful-waiter': 0,
                'protector': 0
            };
            
            let totalScore = 0;
            
            answers.forEach((answerIndex, questionIndex) => {
                if (questionIndex >= (config.TOTAL_SCORED_QUESTIONS || 14)) return;
                const question = quizData[questionIndex];
                if (!question || !question.options) return;
                
                const option = question.options[answerIndex];
                if (!option || option.score === undefined) return;
                
                totalScore += option.score;
                
                if (option.subDimension) {
                    const key = option.subDimension;
                    if (dimensionScores[key] !== undefined) {
                        dimensionScores[key] = (dimensionScores[key] || 0) + (option.score || 0);
                    }
                }
            });
            
            return { 
                driverScores: dimensionScores, 
                totalScore,
                dimensionScores 
            };
        },
        
        // Legacy: Calculate driver percentages (for backward compat - maps to first 4 drivers)
        calculateDriverPercentages: function(driverScores, totalScore) {
            const validTotalScore = totalScore || 1;
            const patternScores = {
                'hot-cold-cycle': driverScores['hot-cold-cycle'] || 0,
                'breadcrumb-dynamic': driverScores['breadcrumb-dynamic'] || 0,
                'commitment-avoidance': driverScores['commitment-avoidance'] || 0,
                'emotional-distance': driverScores['emotional-distance'] || 0,
                'mixed-signals-loop': driverScores['mixed-signals-loop'] || 0,
                'one-sided-investment': driverScores['one-sided-investment'] || 0
            };
            const sum = Object.values(patternScores).reduce((a, b) => a + b, 0) || 1;
            return {
                'control': Math.round(((patternScores['hot-cold-cycle'] || 0) / sum) * 100),
                'avoidance': Math.round(((patternScores['emotional-distance'] || 0) / sum) * 100),
                'validation': Math.round(((patternScores['breadcrumb-dynamic'] || 0) / sum) * 100),
                'fear-of-rejection': Math.round(((patternScores['commitment-avoidance'] || 0) / sum) * 100)
            };
        },
        
        // Calculate pattern dominance
        calculatePatternDominance: function(driverScores, totalScore) {
            const patternKeys = ['hot-cold-cycle', 'breadcrumb-dynamic', 'commitment-avoidance', 'emotional-distance', 'mixed-signals-loop', 'one-sided-investment'];
            const sorted = patternKeys
                .map(k => [k, driverScores[k] || 0])
                .sort((a, b) => b[1] - a[1]);
            const dominant = sorted[0];
            const validTotalScore = totalScore || 1;
            const patternDominance = Math.round((dominant[1] / validTotalScore) * 100);
            return {
                dominantDriver: dominant[0],
                dominantScore: dominant[1],
                secondaryDriver: sorted[1] ? sorted[1][0] : null,
                secondaryScore: sorted[1] ? sorted[1][1] : 0,
                patternDominance,
                sortedDrivers: sorted
            };
        },
        
        // Get dominance label
        getDominanceLabel: function(dominance, thresholds) {
            if (!thresholds) thresholds = { STRONG: 70, MODERATE: 50, BALANCED: 40 };
            if (dominance >= thresholds.STRONG) return 'Strong';
            if (dominance >= thresholds.MODERATE) return 'Moderate';
            if (dominance >= thresholds.BALANCED) return 'Balanced';
            return 'Mixed';
        }
    };
})();
