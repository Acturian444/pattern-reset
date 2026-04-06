#!/usr/bin/env node
/**
 * QA runner for inference - runs in Node without Puppeteer
 * Simulates window/global and loads the inference logic
 */
const path = require('path');
const fs = require('fs');

// Create minimal global/window for browser scripts
global.window = global;
global.SCORE = { NONE: 0, MILD: 2, MODERATE: 4, STRONG: 6 };

// Load quiz-data (needs relationshipPatterns, herResponsePatterns, etc.)
const quizDataPath = path.join(__dirname, '..', 'js', 'quiz', 'quiz-data.js');
const quizDataCode = fs.readFileSync(quizDataPath, 'utf8');
eval(quizDataCode);

// Load results-inference
const inferencePath = path.join(__dirname, '..', 'js', 'quiz', 'results-inference.js');
const inferenceCode = fs.readFileSync(inferencePath, 'utf8');
eval(inferenceCode);

const RI = global.ResultsInference;
const quizData = global.quizData || [];

const SCENARIOS = [
    { name: '1. Hot-Cold + Reassurance Seeker', answers: [2,2,3,0,2,1,1,2,0,0,0,0,0,1,1,0], primaryPatternId: 'hot-cold-cycle', relationshipStatus: 'situationship', herResponse: 'reassurance-seeker' },
    { name: '2. Mixed Signals + Direct Communicator', answers: [2,1,0,2,1,0,2,2,3,2,2,2,1,2,1,2], primaryPatternId: 'mixed-signals-loop', relationshipStatus: 'dating', herResponse: 'direct-communicator' },
    { name: '3. Breadcrumb + Space Giver', answers: [1,1,1,1,0,3,3,1,1,1,1,1,2,0,1,0], primaryPatternId: 'breadcrumb-dynamic', relationshipStatus: 'situationship', herResponse: 'space-giver' },
    { name: '4. Emotional Wall + Protector', answers: [1,2,2,0,3,2,0,3,4,3,3,3,0,2,1,4], primaryPatternId: 'one-sided-investment', relationshipStatus: 'emotionally-invested', herResponse: 'protector' },
    { name: '5. Commitment Avoidance + Future Faking', answers: [1,1,1,2,1,1,1,1,2,0,0,1,1,1,3,3], primaryPatternId: 'commitment-avoidance', relationshipStatus: 'situationship', herResponse: 'reassurance-seeker' },
    { name: '6. Situational-Not-Ready (moderate, situationship, short)', answers: [1,1,0,1,0,0,0,1,1,1,1,1,3,0,3,0], primaryPatternId: 'breadcrumb-dynamic', relationshipStatus: 'situationship', herResponse: 'space-giver' },
    { name: '7. One-Sided + Balanced', answers: [1,0,0,0,0,1,1,3,4,1,2,2,2,2,1,4], primaryPatternId: 'one-sided-investment', relationshipStatus: 'dating', herResponse: 'balanced' },
    { name: '8. Emotional Distance + Direct', answers: [0,2,2,0,3,0,0,0,4,2,2,2,0,1,0,0], primaryPatternId: 'emotional-distance', relationshipStatus: 'emotionally-invested', herResponse: 'direct-communicator' },
    { name: '9. Strong Future Faking', answers: [2,1,1,2,1,1,2,2,3,0,0,0,0,1,1,2], primaryPatternId: 'mixed-signals-loop', relationshipStatus: 'situationship', herResponse: 'reassurance-seeker' },
    { name: '10. Passive-Indecisive', answers: [1,1,1,1,0,0,0,1,2,1,1,1,1,2,3,0], primaryPatternId: 'commitment-avoidance', relationshipStatus: 'situationship', herResponse: 'space-giver' }
];

console.log('\n=== QA Inference Scenarios ===\n');

SCENARIOS.forEach(s => {
    const r = RI.inferHisBehavioralPattern(s.answers, quizData, s.primaryPatternId, s.relationshipStatus);
    const dynamic = RI.getDynamicInteractionText(s.herResponse, r.primary);
    const compat = RI.inferEmotionalCompatibility(s.answers, quizData);
    console.log(s.name);
    console.log(`  Primary: ${r.primary} | Modifier: ${r.modifier || 'none'} | Confidence: ${r.confidence}`);
    console.log(`  Emotional: ${compat ? compat.label : 'N/A'}`);
    console.log(`  Primary scores: ${JSON.stringify(r.primaryScores)}`);
    console.log(`  Modifier scores: ${JSON.stringify(r.modifierScores)}`);
    console.log(`  Dynamic (first 100 chars): ${(dynamic || '').substring(0, 100)}...`);
    console.log('');
});
