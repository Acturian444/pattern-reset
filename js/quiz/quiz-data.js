// Quiz Data - All questions and pattern definitions
// This file contains all quiz questions and pattern data

// Use global QUIZ_CONFIG (set by quiz-config.js)
const QUIZ_CONFIG = window.QUIZ_CONFIG || {
    POINTS_PER_ANSWER: 3
};

// Archetype Categories (Tier 1)
window.archetypeCategories = {
    'control': {
        name: 'The Anchor',
        description: 'Stable, grounded, and structured',
        symbol: '⚓'
    },
    'validation': {
        name: 'The Catalyst',
        description: 'Dynamic, influential, and driven',
        symbol: '⚡'
    },
    'avoidance': {
        name: 'The Wanderer',
        description: 'Free, flowing, and adaptable',
        symbol: '🌊'
    },
    'fear-of-rejection': {
        name: 'The Guardian',
        description: 'Protective, loyal, and resilient',
        symbol: '🛡️'
    }
};

// Personality Patterns (Tier 2)
window.personalityPatterns = {
    'fixer': {
        name: 'The Fixer',
        archetypeCategory: 'The Anchor',
        driver: 'control',
        rootEmotion: 'Control',
        coreBelief: 'If I solve it, I\'m safe.',
        strength: 'Responsible & capable',
        shadow: 'Overfunctioning → burnout',
        resetFocus: 'Allow others to own their part',
        identity: 'You take charge and solve problems, believing that if you can fix things, you\'ll stay safe and in control.',
        cta: 'The 22-Day Reset will help you release the need to control everything and allow others to take responsibility for their own lives.'
    },
    'perfectionist': {
        name: 'The Perfectionist',
        archetypeCategory: 'The Anchor',
        driver: 'control',
        rootEmotion: 'Control',
        coreBelief: 'If I do it right, I\'ll be loved.',
        strength: 'Disciplined & driven',
        shadow: 'Shame & rigidity',
        resetFocus: 'Self-acceptance & rest',
        identity: 'You strive for excellence, believing that doing things perfectly will earn you love and acceptance.',
        cta: 'The 22-Day Reset will help you embrace self-acceptance, release shame, and find rest without perfection.'
    },
    'escaper': {
        name: 'The Escaper',
        archetypeCategory: 'The Wanderer',
        driver: 'avoidance',
        rootEmotion: 'Avoidance',
        coreBelief: 'If I don\'t feel it, it can\'t hurt me.',
        strength: 'Free & creative',
        shadow: 'Disconnection',
        resetFocus: 'Face emotions without fleeing',
        identity: 'You avoid difficult feelings and situations, using freedom and spontaneity as protection from pain.',
        cta: 'The 22-Day Reset will help you face your emotions without fleeing and build deeper connections.'
    },
    'overthinker': {
        name: 'The Overthinker',
        archetypeCategory: 'The Wanderer',
        driver: 'avoidance',
        rootEmotion: 'Avoidance',
        coreBelief: 'If I analyze enough, I\'ll feel safe.',
        strength: 'Insightful & intelligent',
        shadow: 'Paralysis & anxiety',
        resetFocus: 'Act before over-analyzing',
        identity: 'You analyze everything deeply, believing that understanding will protect you from uncertainty and pain.',
        cta: 'The 22-Day Reset will help you move from analysis to action and break free from paralysis.'
    },
    'pleaser': {
        name: 'The Pleaser',
        archetypeCategory: 'The Catalyst',
        driver: 'validation',
        rootEmotion: 'Validation',
        coreBelief: 'If they\'re happy, I\'m okay.',
        strength: 'Empathetic & kind',
        shadow: 'People-pleasing → resentment',
        resetFocus: 'Honesty & boundaries',
        identity: 'You prioritize others\' happiness, believing that keeping people happy will keep you safe and loved.',
        cta: 'The 22-Day Reset will help you set boundaries, speak your truth, and release the need to please everyone.'
    },
    'performer': {
        name: 'The Performer',
        archetypeCategory: 'The Catalyst',
        driver: 'validation',
        rootEmotion: 'Validation',
        coreBelief: 'If I impress, I belong.',
        strength: 'Charismatic & motivated',
        shadow: 'Burnout & emptiness',
        resetFocus: 'Authenticity over image',
        identity: 'You work hard to impress and achieve, believing that success and recognition will make you belong.',
        cta: 'The 22-Day Reset will help you find authenticity beyond performance and connect with your true self.'
    },
    'guarded-one': {
        name: 'The Guarded One',
        archetypeCategory: 'The Guardian',
        driver: 'fear-of-rejection',
        rootEmotion: 'Fear of Rejection',
        coreBelief: 'If I don\'t open up, I won\'t get hurt.',
        strength: 'Independent',
        shadow: 'Isolation & loneliness',
        resetFocus: 'Emotional vulnerability',
        identity: 'You protect yourself by staying independent and closed off, believing that not opening up will prevent rejection.',
        cta: 'The 22-Day Reset will help you safely open up, practice vulnerability, and build genuine connections.'
    },
    'overgiver': {
        name: 'The Overgiver',
        archetypeCategory: 'The Guardian',
        driver: 'fear-of-rejection',
        rootEmotion: 'Fear of Rejection',
        coreBelief: 'If I give more, they won\'t leave.',
        strength: 'Loyal & generous',
        shadow: 'Self-neglect',
        resetFocus: 'Balance & self-worth',
        identity: 'You give endlessly to others, believing that giving more will prevent abandonment and rejection.',
        cta: 'The 22-Day Reset will help you balance giving with receiving and recognize your own worth.'
    }
};

// Quiz Questions Data
// Questions organized by life areas: Love (4), Money (4), Health (4), Identity (4), 
// Childhood & Origin (6), Relationship Patterns (6), Reflection (2), Birth Date (1), Relationship Status (1)
// Total: 30 scored questions + 1 birth date + 1 relationship status = 32 questions
window.quizData = [
    // Love & Connection (Questions 1-4)
    {
        question: "When someone I care about pulls away, my first move is to:",
        domain: 'LOVE',
        options: [
            { text: "Step in and try to fix what went wrong.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Act casual and avoid the heavy talk.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Do more to win them back.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Emotionally withdraw to protect myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "I feel safest in relationships when:",
        domain: 'LOVE',
        options: [
            { text: "I can set the pace and keep things on track.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Nothing feels too serious or intense.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "I am reassured and appreciated.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I keep some distance until I trust fully.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "During conflict, I usually:",
        domain: 'LOVE',
        options: [
            { text: "Take charge and resolve it quickly.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Step away or distract myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Apologize or smooth things over fast.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Emotionally withdraw and go quiet.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When love feels uncertain, I tend to:",
        domain: 'LOVE',
        options: [
            { text: "Plan and try to control the outcome.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Change the subject or avoid the talk.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Please more to feel wanted.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Pull back so I cannot be hurt.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Money & Security (Questions 5-8)
    {
        question: "My relationship with money often feels:",
        domain: 'MONEY',
        options: [
            { text: "Safe only when I am fully in control.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Stressful, so I avoid thinking about it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Tied to my value and success.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Uncertain, and I fear losing it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When a money problem hits, I:",
        domain: 'MONEY',
        options: [
            { text: "Go into fix mode with plans and tasks.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Delay and hope it feels easier later.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Feel like I failed or let people down.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Freeze and worry about worst cases.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "Success to me mostly means:",
        domain: 'MONEY',
        options: [
            { text: "Stability and control over my life.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Freedom and flexible choices.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Being respected and recognized.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Feeling safe and secure with a cushion.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When my income changes, I usually:",
        domain: 'MONEY',
        options: [
            { text: "Rework the plan and tighten systems.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Avoid looking closely for a while.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Link it to how worthy I am.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Worry and become guarded with spending.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Health & Habits (Questions 9-12)
    {
        question: "When I feel overwhelmed, I usually:",
        domain: 'HEALTH',
        options: [
            { text: "Make a clear plan and structure my day.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Numb out or distract myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Look for praise or support to keep going.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Pull back from others and keep to myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "I stay consistent with routines when:",
        domain: 'HEALTH',
        options: [
            { text: "I control the schedule and rules.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "I feel inspired or in the mood.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Someone notices and cheers me on.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I feel safe and emotionally held.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "My biggest health challenge is:",
        domain: 'HEALTH',
        options: [
            { text: "Overworking and doing too much.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Avoiding discomfort or boredom.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Needing outside motivation to start.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Quitting when I feel unseen or alone.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When my routine breaks, I:",
        domain: 'HEALTH',
        options: [
            { text: "Get strict and push myself harder.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Say I will restart later, then delay.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Feel guilty and look for approval again.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Isolate and stop talking about it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Identity & Purpose (Questions 13-16)
    {
        question: "When I think about my direction in life, I:",
        domain: 'IDENTITY',
        options: [
            { text: "Plan deeply and try to control outcomes.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Switch paths or keep it open.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Focus on how others will see me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Doubt if I truly belong anywhere.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "My biggest fear about failing is:",
        domain: 'IDENTITY',
        options: [
            { text: "Losing control of what happens next.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Having to face hard feelings.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Disappointing people who believed in me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Being rejected or left behind.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "I feel most like myself when:",
        domain: 'IDENTITY',
        options: [
            { text: "I am leading and creating structure.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "I am free and spontaneous.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "I am appreciated and seen.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I am understood at a deep level.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "Under pressure, I tend to:",
        domain: 'IDENTITY',
        options: [
            { text: "Take charge and handle it fast.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Avoid it or procrastinate.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Push harder to prove myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Shut down emotionally to stay safe.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Childhood & Origin (Questions 17-22)
    {
        question: "Growing up, when I was upset or emotional, my parents usually:",
        domain: 'CHILDHOOD',
        options: [
            { text: "Took charge and tried to fix or solve it for me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Avoided talking about it or changed the subject.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Reassured me and made me feel better.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Withdrew or seemed uncomfortable with my emotions.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "As a child, I felt safest when:",
        domain: 'CHILDHOOD',
        options: [
            { text: "I was in control of my environment and knew what to expect.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "I could escape or avoid difficult situations.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "I was praised, appreciated, or recognized by others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I was alone or didn't have to depend on anyone.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "In my family growing up, emotions were typically:",
        domain: 'CHILDHOOD',
        options: [
            { text: "Managed and controlled — we kept things structured.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Avoided or ignored — we didn't talk about feelings much.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Validated and celebrated — feelings were acknowledged positively.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Unpredictable or unsafe — I learned to hide my emotions.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "As a child, I learned that to feel safe and loved, I needed to:",
        domain: 'CHILDHOOD',
        options: [
            { text: "Be responsible, capable, and solve problems.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Stay free, avoid conflict, and not make waves.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Please others, be helpful, and make people happy.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Stay independent and not rely on others too much.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When I needed something as a child (comfort, help, attention), my parents usually:",
        domain: 'CHILDHOOD',
        options: [
            { text: "Provided it but only if I handled things correctly first.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Were inconsistent — sometimes there, sometimes not.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Provided it warmly and made me feel valued.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Were unavailable or made me feel like a burden.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "My earliest memories of relationships with caregivers involve feeling:",
        domain: 'CHILDHOOD',
        options: [
            { text: "Like I had to be the responsible one or take charge.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Like I needed to escape or avoid getting too close.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Like I needed to earn love through being good or helpful.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Like I couldn't fully trust or depend on others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Relationship Patterns (Questions 23-28)
    {
        question: "When someone gets too close or wants deeper intimacy, I usually:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "Take control and set boundaries to manage the pace.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Pull away or create distance to avoid getting too close.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Try harder to be what they want so they don't leave.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Shut down emotionally or push them away to protect myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When a relationship starts getting serious or committed, I tend to:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "Plan and control how the relationship progresses.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Feel trapped and want to escape or keep options open.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Work harder to prove I'm worthy of commitment.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Fear they'll see the real me and reject me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "My relationships typically end because:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "I try to control or fix things too much and it becomes too much.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "I avoid difficult conversations until it's too late.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "I lose myself trying to please them and they lose interest.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I push them away before they can reject me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "The hardest part of being in a relationship for me is:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "Letting go of control and trusting the process.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Having to face difficult emotions or conversations.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Feeling like I'm not enough or will disappoint them.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Opening up and being vulnerable without fear of rejection.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "I'm typically drawn to partners who:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "Need fixing or managing, so I can be in control.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Keep things casual and don't want too much commitment.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Make me feel needed, valued, or appreciated.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Are emotionally unavailable, so I don't have to risk rejection.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When I feel lonely or want connection, I usually:",
        domain: 'RELATIONSHIPS',
        options: [
            { text: "Take charge and create opportunities to connect on my terms.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Distract myself or avoid thinking about it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Seek validation or approval from others to feel less alone.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Isolate myself because reaching out feels too risky.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Reflection (Questions 29-30)
    {
        question: "The hardest thing for me to let go of right now is:",
        domain: 'REFLECTION',
        options: [
            { text: "Control of people or outcomes.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Discomfort I keep avoiding.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "The need for approval.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Fear of being rejected.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "Right now, my sense of self-worth depends most on:",
        domain: 'REFLECTION',
        options: [
            { text: "How well I manage and perform.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "How easy and pressure-free life feels.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "How much others value or praise me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Whether I feel fully accepted.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Birth Date (Question 31 / Index 30) - Special handling, not scored
    {
        question: "What is your birth date?",
        questionType: 'birthdate',
        domain: 'BIRTHDATE',
        options: [] // Will be handled as text input
    },
    // Relationship Status (Question 32 / Index 31) - Special handling, not scored, optional
    {
        question: "What is your current relationship status?",
        questionType: 'relationship-status',
        domain: 'RELATIONSHIP_STATUS',
        options: [
            { text: "Single", value: "single" },
            { text: "Dating / Casually seeing someone", value: "dating" },
            { text: "In a committed relationship", value: "committed" },
            { text: "Married", value: "married" },
            { text: "Divorced / Separated", value: "divorced" },
            { text: "Prefer not to say", value: "prefer-not-to-say" }
        ]
    }
];

