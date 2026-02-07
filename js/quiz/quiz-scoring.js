// Quiz Scoring Module
// Centralized scoring logic to eliminate code duplication

(function() {
    'use strict';
    
    // Make scoring functions available globally
    window.QuizScoring = {
        // Calculate driver scores from answers
        calculateDriverScores: function(answers, quizData, config) {
            const driverScores = {
                'control': 0,
                'avoidance': 0,
                'validation': 0,
                'fear-of-rejection': 0
            };
            
            let totalScore = 0;
            
            // Calculate driver scores and total score (skip birth date and relationship status)
            answers.forEach((answerIndex, questionIndex) => {
                if (questionIndex < config.TOTAL_SCORED_QUESTIONS && answerIndex !== undefined) {
                    const question = quizData[questionIndex];
                    if (!question || !question.options) return;
                    
                    const option = question.options[answerIndex];
                    if (option && option.driver && option.score !== undefined) {
                        if (driverScores[option.driver] === undefined) {
                            driverScores[option.driver] = 0;
                        }
                        driverScores[option.driver] += option.score;
                        totalScore += option.score;
                    }
                }
            });
            
            return { driverScores, totalScore };
        },
        
        // Calculate driver percentages
        calculateDriverPercentages: function(driverScores, totalScore) {
            const validTotalScore = totalScore || 1; // Avoid division by zero
            
            return {
                'control': Math.round((driverScores['control'] / validTotalScore) * 100),
                'avoidance': Math.round((driverScores['avoidance'] / validTotalScore) * 100),
                'validation': Math.round((driverScores['validation'] / validTotalScore) * 100),
                'fear-of-rejection': Math.round((driverScores['fear-of-rejection'] / validTotalScore) * 100)
            };
        },
        
        // Calculate pattern dominance
        calculatePatternDominance: function(driverScores, totalScore) {
            const sortedDrivers = Object.entries(driverScores).sort((a, b) => b[1] - a[1]);
            const dominantDriver = sortedDrivers[0][0];
            const dominantScore = sortedDrivers[0][1];
            const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
            const secondaryScore = sortedDrivers[1] ? sortedDrivers[1][1] : 0;
            const validTotalScore = totalScore || 1;
            const patternDominance = Math.round((dominantScore / validTotalScore) * 100);
            
            return {
                dominantDriver,
                dominantScore,
                secondaryDriver,
                secondaryScore,
                patternDominance,
                sortedDrivers
            };
        },
        
        // Get dominance label
        getDominanceLabel: function(dominance, thresholds) {
            if (dominance >= thresholds.STRONG) return 'Strong';
            if (dominance >= thresholds.MODERATE) return 'Moderate';
            if (dominance >= thresholds.BALANCED) return 'Balanced';
            return 'Mixed';
        }
    };
})();

