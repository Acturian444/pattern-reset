// Results Inference Module - Relationship Dynamic Quiz
// Infers his behavioral pattern (4 primary + 4 modifiers), dynamic interaction, and emotional compatibility
// Behavioral patterns are contextual—not clinical diagnoses or fixed personality labels

(function() {
    'use strict';

    // PRIMARY patterns (return exactly 1)
    // Structure: behavior → real-world translation → meaning → outcome
    const PRIMARY_PATTERNS = {
        'avoidant-pullback': {
            id: 'avoidant-pullback',
            name: 'Avoidant Pullback',
            description: 'He tends to withdraw when things get emotionally real. He creates distance after closeness and avoids deeper vulnerability. This often shows up as pulling away when you get closer or when conversations become more serious.\n\nThis isn\'t random — it\'s how he handles emotional intensity. And it usually means the relationship struggles to move forward when things start to matter.',
            shortLabel: 'withdraws when things get real'
        },
        'mixed-signals': {
            id: 'mixed-signals',
            name: 'Mixed Signals',
            description: 'His words and actions don\'t match. He may say serious things without follow-through — which creates confusion. This often shows up as you replaying conversations, second-guessing what he meant, or waiting for his behavior to finally line up with his words.\n\nThis isn\'t random — it\'s how he responds to expectations and pressure. And it usually means you stay stuck decoding instead of deciding, while the relationship stays undefined.',
            shortLabel: 'words and actions don\'t match'
        },
        'low-investment': {
            id: 'low-investment',
            name: 'Low Investment',
            description: 'He takes more than he gives. You initiate plans and conversations; he shows up when he wants to. This often shows up as you carrying the effort while he enjoys the connection without stepping up when you need him to.\n\nThis isn\'t random — it\'s how he responds when there\'s no pressure to commit. And it usually means the relationship only works because you\'re doing the work — and it rarely shifts unless something changes.',
            shortLabel: 'takes more than he gives—you carry the effort'
        },
        'emotionally-closed': {
            id: 'emotionally-closed',
            name: 'Emotionally Closed',
            description: 'He keeps things surface-level. Deep conversations or emotional topics shut him down. This often shows up as you wanting more depth while he deflects, stays guarded, or changes the subject when things get real.\n\nThis isn\'t random — it\'s how he responds to emotional closeness. And it usually means you feel shut out, and the relationship struggles to deepen when you need it to.',
            shortLabel: 'stays surface-level and shuts down emotionally'
        }
    };

    // MODIFIERS (return at most 1, only if strong)
    const MODIFIERS = {
        'future-faking': {
            id: 'future-faking',
            name: 'Future Faking',
            shortLabel: 'talks about the future without backing it up — keeps you hoping while nothing changes'
        },
        'push-pull': {
            id: 'push-pull',
            name: 'Push–Pull',
            shortLabel: 'comes close then withdraws — creates instability and keeps you unsure where you stand'
        },
        'passive-indecisive': {
            id: 'passive-indecisive',
            name: 'Passive-Indecisive',
            shortLabel: 'avoids decisions and lets the relationship drift — "go with the flow" without clarity'
        },
        'situational-not-ready': {
            id: 'situational-not-ready',
            name: 'Situational-Not-Ready',
            shortLabel: 'interest exists but readiness or stability is low — life context or timing gets in the way'
        }
    };

    // Her response display names
    const HER_RESPONSE_NAMES = {
        'reassurance-seeker': 'The Reassurance Seeker',
        'space-giver': 'The Space Giver',
        'direct-communicator': 'The Direct Communicator',
        'protector': 'The Protector',
        'balanced': 'The Self-Aware One'
    };

    // Dynamic interaction: her response + his PRIMARY pattern only
    const DYNAMIC_INTERACTION_MAP = {
        'reassurance-seeker_avoidant-pullback': 'You move closer for clarity when you feel uncertain. He pulls away when things get emotionally real. That combination creates a cycle: you reach out for reassurance, he withdraws—and the more you pursue, the more he retreats. You\'re not crazy. The pattern explains why it feels so confusing.',
        'reassurance-seeker_mixed-signals': 'You look for proof he cares—through his texts, his effort, his words. His words and actions don\'t match, so you keep analyzing. The trap: his inconsistency keeps you decoding instead of deciding. You want clarity. He gives just enough to keep you guessing.',
        'reassurance-seeker_low-investment': 'You initiate to feel connected. He engages when it\'s easy—and avoids effort when it\'s not. You\'re doing the emotional work for both of you. Reciprocity research shows: imbalance rarely corrects itself. Your capacity for connection is real; the question is whether he\'ll match it.',
        'reassurance-seeker_emotionally-closed': 'You try to get closer—you initiate deep conversations, share your feelings. He stays surface-level or shuts down. The more you pursue connection, the more he withdraws. Your desire for depth is a strength—but it\'s hitting a wall. His capacity isn\'t something you can create.',
        'space-giver_avoidant-pullback': 'You give him space when he pulls away. He rarely fills that space with consistency. Your patience can feel dignified—but avoidant partners rarely step up on their own. You\'re waiting for him to set the pace. The question: How long will you wait?',
        'space-giver_mixed-signals': 'You hold back when he\'s inconsistent. That can feel protective—but it also means you\'re waiting for him to make sense. His words and actions don\'t match. Your patience is a strength; use it to observe his actions, then decide what you\'ll accept.',
        'space-giver_low-investment': 'You wait for him to come to you. He enjoys access without being required to step up. In a low-investment pattern, he has no incentive to change when you\'re not demanding more. Your patience may be enabling the status quo.',
        'space-giver_emotionally-closed': 'You give him space when he shuts down. Emotionally closed partners rarely bridge the gap on their own. You\'re not asking for too much. The question: Can you live with the connection he\'s capable of offering?',
        'direct-communicator_avoidant-pullback': 'You ask directly for clarity. He withdraws or deflects when things get real. That\'s not a you problem. His deflection is the answer. Your willingness to have the hard conversation is rare—use it to get one clear answer, then decide.',
        'direct-communicator_mixed-signals': 'You ask directly—and his words still don\'t match his actions. That disconnect is the answer. Trust his behavior, not his explanations. Your clarity-seeking is a strength; use it to observe what he does, not what he says.',
        'direct-communicator_low-investment': 'You ask for more. He avoids effort or clarity. That avoidance is the answer. Your willingness to name the imbalance is rare; use it to set a standard, not to convince him to change.',
        'direct-communicator_emotionally-closed': 'You bring up deep topics. He hits a wall or shuts down. That wall isn\'t about you. His capacity for depth is his. Your willingness to be vulnerable is a strength; use it to assess compatibility, not to fix him.',
        'protector_avoidant-pullback': 'You shut down or pull back to avoid more hurt. He withdraws when things get real. You\'re both protecting yourselves—but that can mean you\'re both staying stuck. Your awareness of the pattern is the first step; the next is one direct conversation.',
        'protector_mixed-signals': 'You\'ve pulled back to avoid more confusion. His words and actions don\'t match. That protects you—but it can also keep you in limbo. Your awareness of the disconnect is the first step; the next is trusting his actions over his words.',
        'protector_low-investment': 'You\'ve stopped overgiving. That protects you—but it can also reveal the truth: the relationship may have only worked because you were carrying it. Your pullback is the experiment.',
        'protector_emotionally-closed': 'You\'ve shut down to avoid more rejection. He stays surface-level. You\'re both staying guarded. Your awareness of the gap is the first step; the next is deciding if you can live with the distance.',
        'balanced_avoidant-pullback': 'You notice the pattern and try to stay grounded. He withdraws when things get real. Your awareness is rare—and it\'s your greatest asset. Use it to get one direct answer, then choose based on reality, not hope.',
        'balanced_mixed-signals': 'You notice the words-actions gap. His inconsistency keeps you guessing. Your awareness is your leverage. Use it to observe: What does he do? Not what does he say. Actions predict future behavior.',
        'balanced_low-investment': 'You see the imbalance. He engages when it\'s easy. Your awareness is your leverage. Use it to match his energy: pull back and see if he steps up. If not, that\'s your answer.',
        'balanced_emotionally-closed': 'You notice the pursuit-distance pattern. He stays surface-level. Your awareness is rare. Use it to decide: "Is he capable of the depth I want?" If not, that\'s a compatibility answer—not a you problem.'
    };

    // Emotional compatibility states
    const EMOTIONAL_COMPATIBILITY = {
        'misaligned': {
            label: 'Emotionally misaligned',
            description: 'Your emotional styles don\'t match. You want more depth, clarity, or consistency than he\'s showing. That\'s not a flaw in you—it\'s a compatibility gap. The question isn\'t "How do I get him to change?"—it\'s "Can I live with what he\'s capable of offering?"'
        },
        'partially-compatible': {
            label: 'Partially compatible but unstable',
            description: 'There are moments of connection—but they\'re inconsistent. When he\'s present, it feels real. When he pulls away, the gap feels huge. The instability makes it hard to feel secure. You\'re not asking for too much; you\'re asking for consistency.'
        },
        'low-under-pressure': {
            label: 'Low compatibility under emotional pressure',
            description: 'When things are easy, you connect. When you need more—clarity, depth, or reassurance—he withdraws or shuts down. The pattern shows up most when you need him most. That\'s when compatibility matters most.'
        },
        'capable-but-inconsistent': {
            label: 'Capable of closeness but inconsistent',
            description: 'He can show up—when he wants to. The inconsistency isn\'t about his capacity; it\'s about his pattern. He\'s capable of more than he\'s giving. The question: Is he willing to show up consistently?'
        },
        'aligned-but-blocked': {
            label: 'More aligned than it feels—but blocked by pattern dynamics',
            description: 'Underneath the confusion, you may want similar things. But the dynamic—the chase, the withdrawal, the mixed signals—creates a wall. The pattern is blocking what could be there. Breaking the cycle could reveal more compatibility than it feels like right now.'
        }
    };

    /**
     * Get option subDimension and score for a question
     */
    function getAnswerOption(answers, quizData, qIdx) {
        if (!answers || answers[qIdx] === undefined || !quizData || !quizData[qIdx] || !quizData[qIdx].options) return null;
        return quizData[qIdx].options[answers[qIdx]] || null;
    }

    /**
     * Infer his behavioral pattern: 1 primary (always), 0–1 modifier (only if strong)
     */
    function inferHisBehavioralPattern(answers, quizData, primaryPatternId, relationshipStatus) {
        const primaryScores = { 'avoidant-pullback': 0, 'mixed-signals': 0, 'low-investment': 0, 'emotionally-closed': 0 };
        const modifierScores = { 'future-faking': 0, 'push-pull': 0, 'passive-indecisive': 0, 'situational-not-ready': 0 };

        const opt = (qIdx) => getAnswerOption(answers, quizData, qIdx);
        const add = (scores, key, weight) => { if (scores[key] !== undefined) scores[key] += weight; };

        // --- PRIMARY: Avoidant Pullback ---
        // Q2 low emotional openness, Q3 tension creates distance/disappears, Q5 distant/defensive, Q4 avoids future, Q9 hot-cold-cycle
        const o2 = opt(1);
        if (o2 && (o2.subDimension === 'emotional-distance' || o2.subDimension === 'one-sided')) add(primaryScores, 'avoidant-pullback', (o2.score || 0) * 1.5);
        const o3 = opt(2);
        if (o3 && (o3.subDimension === 'emotional-distance' || o3.subDimension === 'hot-cold')) add(primaryScores, 'avoidant-pullback', (o3.score || 0) * 1.5);
        const o5 = opt(4);
        if (o5 && (o5.subDimension === 'hot-cold' || o5.subDimension === 'emotional-distance')) add(primaryScores, 'avoidant-pullback', (o5.score || 0) * 1.5);
        const o4 = opt(3);
        if (o4 && o4.subDimension === 'commitment-avoidance') add(primaryScores, 'avoidant-pullback', (o4.score || 0) * 0.8);
        const o9 = opt(8);
        if (o9 && o9.subDimension === 'hot-cold-cycle') add(primaryScores, 'avoidant-pullback', (o9.score || 0) * 2);

        // --- PRIMARY: Mixed Signals ---
        // Q1 inconsistent attention, Q4 vague/no follow-through, Q5 reassures but nothing changes, Q9 words/actions don't match
        const o1 = opt(0);
        if (o1 && o1.subDimension === 'hot-cold') add(primaryScores, 'mixed-signals', (o1.score || 0) * 1.2);
        if (o4 && o4.subDimension === 'mixed-signals') add(primaryScores, 'mixed-signals', (o4.score || 0) * 2);
        if (o5 && o5.subDimension === 'mixed-signals') add(primaryScores, 'mixed-signals', (o5.score || 0) * 2);
        if (o9 && o9.subDimension === 'mixed-signals-loop') add(primaryScores, 'mixed-signals', (o9.score || 0) * 2.5);

        // --- PRIMARY: Low Investment ---
        // Q6 effort imbalance, Q7 initiation imbalance, Q8 anxious/drained, Q15 she wants more/he holds power, Q9 one-sided/breadcrumb
        const o6 = opt(5);
        if (o6 && (o6.subDimension === 'one-sided-investment' || o6.subDimension === 'breadcrumb-dynamic')) add(primaryScores, 'low-investment', (o6.score || 0) * 1.5);
        const o7 = opt(6);
        if (o7 && (o7.subDimension === 'one-sided-investment' || o7.subDimension === 'breadcrumb-dynamic' || o7.subDimension === 'hot-cold-cycle')) add(primaryScores, 'low-investment', (o7.score || 0) * 1.2);
        const o8 = opt(7);
        if (o8 && (o8.subDimension === 'one-sided-investment' || o8.subDimension === 'breadcrumb-dynamic' || o8.subDimension === 'hot-cold-cycle')) add(primaryScores, 'low-investment', (o8.score || 0) * 1.2);
        const o15 = opt(14);
        if (o15 && (o15.subDimension === 'she-wants-more' || o15.subDimension === 'he-holds-cards')) add(primaryScores, 'low-investment', (o15.score || 0) * 1.5);
        if (o9 && (o9.subDimension === 'one-sided-investment' || o9.subDimension === 'breadcrumb-dynamic')) add(primaryScores, 'low-investment', (o9.score || 0) * 2);

        // --- PRIMARY: Emotionally Closed ---
        // Q2 rarely/almost never open, Q3 avoids tension, Q5 shuts down, Q8 emotionally drained
        if (o2 && o2.subDimension === 'emotional-distance') add(primaryScores, 'emotionally-closed', (o2.score || 0) * 2);
        if (o3 && (o3.subDimension === 'avoidant' || o3.subDimension === 'emotional-distance')) add(primaryScores, 'emotionally-closed', (o3.score || 0) * 1.2);
        if (o5 && o5.subDimension === 'emotional-distance') add(primaryScores, 'emotionally-closed', (o5.score || 0) * 2);
        if (o8 && o8.subDimension === 'one-sided-investment') add(primaryScores, 'emotionally-closed', (o8.score || 0) * 0.8);

        // --- MODIFIER: Future Faking ---
        // Q4 "says same things but doesn't follow through", Q5 "reassures but nothing changes" — threshold 6 so one strong signal is enough
        if (o4 && o4.subDimension === 'mixed-signals') add(modifierScores, 'future-faking', (o4.score || 0) * 2);
        if (o5 && o5.subDimension === 'mixed-signals') add(modifierScores, 'future-faking', (o5.score || 0) * 2);

        // --- MODIFIER: Push–Pull ---
        if (o1 && o1.subDimension === 'hot-cold') add(modifierScores, 'push-pull', (o1.score || 0) * 1.5);
        if (o3 && (o3.subDimension === 'emotional-distance' || o3.subDimension === 'hot-cold')) add(modifierScores, 'push-pull', (o3.score || 0) * 1.2);
        if (o8 && (o8.subDimension === 'hot-cold-cycle' || o8.subDimension === 'one-sided-investment')) add(modifierScores, 'push-pull', (o8.score || 0) * 1);
        if (o9 && o9.subDimension === 'hot-cold-cycle') add(modifierScores, 'push-pull', (o9.score || 0) * 2);

        // --- MODIFIER: Passive-Indecisive ---
        if (o4 && o4.subDimension === 'commitment-avoidance') add(modifierScores, 'passive-indecisive', (o4.score || 0) * 1.2);
        if (o15 && (o15.subDimension === 'mutual-uncertainty' || o15.subDimension === 'she-wants-more')) add(modifierScores, 'passive-indecisive', (o15.score || 0) * 1);
        const o14 = opt(13);
        if (o14 && (o14.subDimension === 'long' || o14.subDimension === 'very-long')) add(modifierScores, 'passive-indecisive', (o14.score || 0) * 1.2);

        // Pick primary: highest score; fallback to primary pattern if all zero
        const primaryEntries = Object.entries(primaryScores).sort((a, b) => b[1] - a[1]);
        const primaryKey = primaryEntries[0][0];
        const primaryScore = primaryEntries[0][1];

        // Fallback when all scores are zero: use primary relationship pattern
        let primary = primaryKey;
        if (primaryScore === 0) {
            const fallback = {
                'hot-cold-cycle': 'avoidant-pullback',
                'breadcrumb-dynamic': 'low-investment',
                'commitment-avoidance': 'avoidant-pullback',
                'emotional-distance': 'emotionally-closed',
                'mixed-signals-loop': 'mixed-signals',
                'one-sided-investment': 'low-investment'
            };
            primary = fallback[primaryPatternId] || 'mixed-signals';
        }

        // --- MODIFIER: Situational-Not-Ready ---
        // Only when ambiguity is moderate (primary not strongly dominant) AND situationship + short/medium duration
        const maxPrimaryScore = Math.max(...Object.values(primaryScores));
        if (relationshipStatus === 'situationship' && maxPrimaryScore < 15 && o14 && (o14.subDimension === 'short' || o14.subDimension === 'medium')) {
            add(modifierScores, 'situational-not-ready', 6);
        }

        // Pick modifier: at most 1, only if score >= threshold (future-faking: 6, others: 8)
        const MODIFIER_THRESHOLDS = { 'future-faking': 6, 'push-pull': 8, 'passive-indecisive': 8, 'situational-not-ready': 6 };
        const modifierEntries = Object.entries(modifierScores)
            .filter(([k, v]) => v >= (MODIFIER_THRESHOLDS[k] || 8))
            .sort((a, b) => b[1] - a[1]);
        const modifier = modifierEntries.length > 0 ? modifierEntries[0][0] : null;

        const confidence = primaryScore > 10 ? 'high' : primaryScore > 3 ? 'medium' : 'low';

        return {
            primary,
            modifier,
            confidence,
            primaryScores,
            modifierScores
        };
    }

    /**
     * Get dynamic interaction text (her response + his primary pattern)
     */
    function getDynamicInteractionText(herResponsePattern, hisPrimaryPattern) {
        const her = herResponsePattern || 'balanced';
        const key = `${her}_${hisPrimaryPattern}`;
        let text = DYNAMIC_INTERACTION_MAP[key];
        if (!text) {
            const herName = HER_RESPONSE_NAMES[her] || 'You';
            const hisPrimary = PRIMARY_PATTERNS[hisPrimaryPattern];
            const hisLabel = hisPrimary ? hisPrimary.shortLabel : 'his pattern';
            return `${herName} and his ${hisLabel} create a feedback loop. You respond to his behavior; he responds to yours. The dynamic feels confusing because both of you are reacting—not choosing. Seeing the pattern clearly is the first step to breaking it.`;
        }
        return text;
    }

    /**
     * Infer emotional compatibility from answers
     */
    function inferEmotionalCompatibility(answers, quizData) {
        if (!answers || !Array.isArray(answers) || answers.length < 8) {
            return EMOTIONAL_COMPATIBILITY.misaligned;
        }

        let openScore = 0, conflictScore = 0, vulnerabilityScore = 0, effortScore = 0, clarityScore = 0;
        const opt = (qIdx) => getAnswerOption(answers, quizData, qIdx);

        if (opt(1)) openScore = 6 - (opt(1).score || 0);
        if (opt(2)) conflictScore = opt(2).score || 0;
        if (opt(4)) vulnerabilityScore = opt(4).score || 0;
        if (opt(5)) effortScore += opt(5).score || 0;
        if (opt(6)) effortScore += opt(6).score || 0;
        if (opt(3)) clarityScore = opt(3).score || 0;

        const total = conflictScore + vulnerabilityScore + (effortScore / 2) + clarityScore - (openScore / 2);
        if (total <= 6) return EMOTIONAL_COMPATIBILITY['aligned-but-blocked'];
        if (total <= 14) return EMOTIONAL_COMPATIBILITY['capable-but-inconsistent'];
        if (total <= 20) return EMOTIONAL_COMPATIBILITY['low-under-pressure'];
        if (total <= 28) return EMOTIONAL_COMPATIBILITY['partially-compatible'];
        return EMOTIONAL_COMPATIBILITY.misaligned;
    }

    window.ResultsInference = {
        inferHisBehavioralPattern,
        getDynamicInteractionText,
        inferEmotionalCompatibility,
        PRIMARY_PATTERNS,
        MODIFIERS,
        EMOTIONAL_COMPATIBILITY,
        // Backward compatibility
        HIS_BEHAVIORAL_PATTERNS: PRIMARY_PATTERNS
    };
})();
