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

// Quiz Questions Data - 36 questions total (34 scored + 2 optional)
// Love (4), Money (4), Health (4), Lifestyle (1), Physical (1), Productivity (2), Purpose (2), Identity (4), Childhood (4), Trauma (1), Relationships (5), Reflection (2), Birth Date (1), Relationship Status (1)
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
        question: "When it comes to your physical health, what's your biggest struggle?",
        domain: 'HEALTH',
        options: [
            { text: "Struggling to lose weight despite strict dieting and over-exercising.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Lack of energy, feeling sluggish, or dealing with chronic fatigue.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Inconsistent motivation - I start strong but lose momentum when results don't come fast.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Body image issues and feeling disconnected from my body.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When I try to build a new habit, I usually:",
        domain: 'HEALTH',
        options: [
            { text: "Create a detailed system and stick to it rigidly, even if it's unsustainable.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Start strong but lose momentum when it gets difficult or boring.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Need external accountability, support, or recognition to stay consistent.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Quit early because I feel like I'm already failing or not good enough.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Lifestyle & Daily Habits (Question 13)
    {
        question: "My relationship with food is:",
        domain: 'LIFESTYLE',
        options: [
            { text: "Rigid and controlled - I follow strict rules and feel guilty when I break them.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Emotional and chaotic - I eat to numb feelings, then feel shame about it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Tied to my self-worth - I feel good about myself when I eat 'right' and bad when I don't.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Disconnected - I often forget to eat or eat mindlessly, feeling disconnected from my body.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Physical Health & Body (Question 14)
    {
        question: "My relationship with my body is:",
        domain: 'PHYSICAL',
        options: [
            { text: "Critical and controlling - I'm constantly trying to fix or improve it.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Disconnected - I avoid thinking about it or looking at it closely.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Tied to my worth - I feel good about myself when my body looks 'right' to others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Shameful - I feel like my body isn't good enough and hide it from others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Productivity & Time (Questions 15-16)
    {
        question: "My relationship with time is:",
        domain: 'PRODUCTIVITY',
        options: [
            { text: "Rigid and scheduled - I plan every hour and feel stressed when things don't go as planned.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Chaotic and avoidant - I lose track of time or procrastinate on important tasks.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Driven by others' needs - I fill my time helping others and neglect my own priorities.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Isolated and minimal - I keep my schedule empty to avoid depending on others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "When I procrastinate, it's usually because:",
        domain: 'PRODUCTIVITY',
        options: [
            { text: "I'm overthinking and trying to plan everything perfectly before starting.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "The task feels overwhelming or boring, so I avoid it and distract myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "I'm waiting for motivation or someone to hold me accountable.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "I fear I'll fail or be judged, so I delay starting.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Purpose & Flow (Questions 17-18)
    {
        question: "I feel most alive and in flow when I'm:",
        domain: 'PURPOSE',
        options: [
            { text: "Leading a project or creating a structured system that works perfectly.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Completely free and spontaneous, with no pressure or expectations.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Being recognized or appreciated for my work and contributions.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Alone and fully immersed in something that makes me feel safe.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    {
        question: "My relationship with my goals and purpose is:",
        domain: 'PURPOSE',
        options: [
            { text: "Rigid and planned - I have detailed goals and feel off-track if I deviate.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Unclear and avoidant - I keep my options open and avoid committing to one path.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Tied to others' approval - I pursue goals that will make others proud of me.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Fearful and hidden - I have dreams but don't pursue them for fear of rejection.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Identity & Self (Questions 19-22)
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
        question: "When I think about changing who I am, I feel:",
        domain: 'IDENTITY',
        options: [
            { text: "Anxious about losing control of my identity and what I've built.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Resistant - I avoid thinking about it because change feels uncomfortable.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Worried about what others will think if I change.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Afraid that changing means I wasn't good enough as I was.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Childhood & Origin (Questions 23-26)
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
    // Trauma & Adversity (Question 27)
    {
        question: "Growing up, did you experience significant challenges, difficult situations, or adversity that shaped how you learned to cope?",
        domain: 'TRAUMA',
        options: [
            { text: "Yes, I had to take care of others or be responsible for things beyond my age.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "Yes, I learned to escape or avoid difficult situations to protect myself.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "Yes, I learned that I had to earn love or approval through achievement or being helpful.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Yes, I experienced abandonment, rejection, or learned I couldn't depend on others.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Relationship Patterns (Questions 28-32)
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
    // Reflection (Questions 33-34)
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
        question: "Right now, my sense of self-worth and ability to change depends on:",
        domain: 'REFLECTION',
        options: [
            { text: "How well I manage, perform, and control my life.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'control' },
            { text: "How easy and pressure-free life feels - I avoid change because it's uncomfortable.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'avoidance' },
            { text: "How much others value, praise, or validate me - I need their approval to believe I can change.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'validation' },
            { text: "Whether I feel fully accepted - I fear I'm not good enough to change or transform.", score: QUIZ_CONFIG.POINTS_PER_ANSWER, driver: 'fear-of-rejection' }
        ]
    },
    // Birth Date (Question 35 / Index 34) - Special handling, not scored
    {
        question: "What is your birth date?",
        questionType: 'birthdate',
        domain: 'BIRTHDATE',
        options: [] // Will be handled as text input
    },
    // Relationship Status (Question 36 / Index 35) - Special handling, not scored, optional
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

