// Quiz Data - Relationship Dynamic Quiz v2.1 (Optimized)
// Stronger signals, fewer redundant questions, clearer patterns, 0/2/4/6 scoring

// Scoring scale: 0 (healthy) / 2 (mild) / 4 (moderate) / 6 (strong signal)
const SCORE = { NONE: 0, MILD: 2, MODERATE: 4, STRONG: 6 };

// Relationship Patterns (Primary Result) - replaces archetype + personality pattern
window.relationshipPatterns = {
    'hot-cold-cycle': {
        id: 'hot-cold-cycle',
        name: 'The Hot-and-Cold Cycle',
        description: 'He\'s close, then distant. You never know where you stand. When he pulls away, you chase. When he comes back, you feel relief—until the cycle repeats.',
        hisPattern: 'Inconsistent attention. He pulls away when things get real or when you get close, then returns when he wants connection.',
        herPattern: 'You chase when he\'s distant. You try harder to reconnect, hoping this time will be different.',
        dynamic: 'A chase-withdraw loop. The more you pursue, the more he retreats. The more he retreats, the more you pursue.',
        whatItMeans: 'He gives just enough closeness to keep you invested—then withdraws before things deepen. The inconsistency isn\'t accidental. It keeps you available without him having to commit.',
        whyYouStay: 'The attention comes in cycles. When he\'s warm, it feels real. When he pulls away, you try to understand it. Your brain keeps solving the inconsistency—that keeps you invested longer than you expected.',
        ifNothingChanges: ['the relationship stays undefined', 'the chase-withdraw cycle repeats', 'emotional investment becomes one-sided', 'clarity rarely appears suddenly'],
        signsYoureInIt: ['you replay his behavior trying to understand why he pulled away', 'you feel relief when he comes back—then anxiety when he disappears again', 'you never know where you stand from one week to the next', 'you keep hoping "this time" will be different'],
        strengths: 'You notice when something\'s off. You want clarity instead of pretending everything is fine. That awareness is what allows you to break the pattern.',
        watchFor: 'Staying in hope instead of reality. Ignoring that the pattern hasn\'t changed. Waiting for him to become someone he hasn\'t shown you he is.',
        watchForInstead: 'Ask yourself: Has his behavior actually changed? If not, that\'s your answer. His staying or leaving is his choice—your job is to decide what you\'ll accept.',
        nextStep: 'You know the cycle now—chase, retreat, repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t waiting for him to change—it\'s deciding what you\'re willing to accept.',
        coreBelief: 'If I try harder, he\'ll stay.',
        behaviorDriver: 'chase when he pulls away, or try harder to reconnect',
        coreBeliefReframe: 'His staying or leaving is his choice. Your job is to decide what you\'ll accept—not to try harder until he chooses.',
        successSubtext: 'he pulls you close one moment and becomes distant the next — keeping you emotionally hooked but never secure about where you stand',
        whyHeActsThisWay: 'He pulls away when things get real—closeness triggers his need for space. He returns when he wants connection—on his terms. The inconsistency keeps you available without him having to commit. His behavior follows a pattern: pursue when distant, retreat when close.',
        doesHeLikeMe: 'He likely has feelings—otherwise he wouldn\'t keep coming back. But "liking" someone and showing up consistently are different. His behavior suggests he wants you when it suits him, not as a priority. The real question: Is his investment enough for what I need?',
        whyItFeelsConfusing: 'Your brain seeks consistency. When he\'s warm, it feels real. When he pulls away, you try to understand why. That inconsistency creates anxiety—and anxiety creates attachment. You\'re not crazy. The confusion is built into the pattern.'
    },
    'breadcrumb-dynamic': {
        id: 'breadcrumb-dynamic',
        name: 'The Breadcrumb Dynamic',
        description: 'He gives just enough to keep you interested, but not enough to feel secure. His words might sound promising, but his actions stay minimal. You stay hoping for more, tolerating the ambiguity.',
        hisPattern: 'Minimal effort. He keeps you hooked with occasional attention—texts, plans, affection—without committing.',
        herPattern: 'You tolerate the ambiguity. You stay hoping for more, rationalizing that "at least he\'s trying."',
        dynamic: 'Validation seeking. You\'re waiting for crumbs to feel okay. He controls the pace and the terms.',
        whatItMeans: 'He gives just enough attention to keep you invested—but not enough consistency to move forward. He keeps you available without having to invest.',
        whyYouStay: 'Each crumb feels like progress—your brain waits for the next sign. That hope keeps you invested longer than you\'d choose if you saw it clearly.',
        ifNothingChanges: ['the relationship stays undefined', 'you keep waiting for more that never arrives', 'emotional investment becomes one-sided', 'you\'ll stay available longer than you intended'],
        signsYoureInIt: ['you rationalize "at least he\'s trying" when his effort is minimal', 'you feel relief when he reaches out—then anxiety when he goes quiet', 'you\'re waiting for him to give more before you feel fully invested', 'you\'ve lowered your expectations to fit what he offers'],
        strengths: 'You see the good in people. You\'re willing to give things time. That patience, when directed toward someone who matches it, is a strength. Right now it\'s being used on someone who hasn\'t earned it.',
        watchFor: 'Accepting less than you want because "something is better than nothing." Confusing his crumbs with real investment.',
        watchForInstead: 'Ask yourself: "Am I getting what I need, or am I just getting enough to stay?" If it\'s the latter, that\'s your answer.',
        nextStep: 'You know the pattern now—crumbs, hope, repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t waiting for more—it\'s deciding what you need and whether he can give it.',
        coreBelief: 'If I wait long enough, he\'ll choose me.',
        behaviorDriver: 'wait for the next crumb, or hope for more',
        coreBeliefReframe: 'Waiting doesn\'t make him choose. His choice is independent of your patience. You can decide what you need—and leave if he can\'t give it.',
        successSubtext: 'he gives small bursts of attention just often enough to keep you invested — but never enough to build something real',
        whyHeActsThisWay: 'He gives minimal effort because it works. Occasional texts, plans, or affection keep you invested without him showing up fully. He controls the pace. His behavior is efficient: maximum connection, minimum commitment.',
        doesHeLikeMe: 'He wants to keep you in his life—but not as a priority. He gives enough to maintain the connection without committing. His investment has a ceiling. The real question: Does his level of investment match what you need?',
        whyItFeelsConfusing: 'Each crumb feels like progress. When he texts or makes a plan, it feels like he\'s choosing you. Your brain waits for the next sign. That hope keeps you invested—and confused about whether you\'re "almost there" or nowhere at all. You\'re not crazy. The ambiguity is the pattern.'
    },
    'commitment-avoidance': {
        id: 'commitment-avoidance',
        name: 'The Commitment Avoidance',
        description: 'The future is always vague. You want clarity; he keeps it fuzzy. You stay despite the uncertainty, waiting for him to change.',
        hisPattern: 'Avoids or deflects "where is this going?" Keeps things undefined. Says the right things but doesn\'t act.',
        herPattern: 'You stay despite uncertainty. You wait for him to be ready, hoping your patience will pay off.',
        dynamic: 'Ambiguity loop. You want a label, a direction, a plan. He keeps it open-ended.',
        whatItMeans: 'He keeps the future vague on purpose. He may say he wants something serious—but his actions keep things undefined. That ambiguity isn\'t confusion. It\'s a choice. You\'re waiting for clarity he may never give.',
        whyYouStay: '"Almost" feels like progress. You\'re so close to having what you want. Leaving feels like giving up right before you\'d get it. Your brain keeps hoping your patience will finally pay off.',
        ifNothingChanges: ['the relationship stays undefined', 'the future stays vague', 'you\'ll keep waiting for clarity that never arrives', 'emotional investment becomes one-sided'],
        signsYoureInIt: ['you\'ve asked "where is this going?" and didn\'t get a real answer', 'you stay because "we\'re almost there" or "he just needs time"', 'the future feels like a conversation you\'re not allowed to have', 'you\'ve lowered your expectations to avoid the question'],
        strengths: 'You know what you\'re looking for. You\'re willing to have the hard conversations. That clarity about what you want is what allows you to stop waiting for someone who won\'t choose you.',
        watchFor: 'Staying in "almost" because leaving feels like giving up. Waiting for him to change when he hasn\'t shown that he will.',
        watchForInstead: 'Ask yourself: "Can he answer the question? If not, that\'s the answer." Vagueness is a choice—not confusion.',
        nextStep: 'You know the pattern now—vague answers, "almost there," repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t waiting for him to be ready—it\'s deciding what you need and whether he can give it.',
        coreBelief: 'If I\'m patient enough, he\'ll commit.',
        behaviorDriver: 'stay patient, or wait for him to be ready',
        coreBeliefReframe: 'Patience doesn\'t create readiness. If he wanted to commit, he would. Your patience may be enabling his avoidance.',
        successSubtext: 'the future always stays vague — leaving you hoping things will move forward while nothing actually changes',
        whyHeActsThisWay: 'He avoids "where is this going?" because clarity would require him to choose. Keeping things undefined lets him have connection without commitment. His actions keep things open-ended. That ambiguity isn\'t confusion. It\'s a choice.',
        doesHeLikeMe: 'He may care—but his behavior suggests he\'s not ready to choose you in a defined way. "Liking" someone and being willing to commit are different. His vagueness is the answer: if he wanted to move forward, he would. The question: Is he capable of giving me what I need?',
        whyItFeelsConfusing: '"Almost" feels like progress. You\'re so close to having what you want. The future feels like a conversation you\'re not allowed to have. You\'re not crazy for wanting clarity. The vagueness is the pattern—designed to keep you waiting.'
    },
    'emotional-distance': {
        id: 'emotional-distance',
        name: 'The Emotional Wall',
        description: 'You feel shut out. He stays surface-level. You try to get closer; he keeps a wall up.',
        hisPattern: 'Avoidant. Doesn\'t go deep. Keeps conversations light. Shuts down when things get emotional.',
        herPattern: 'You try to get closer. You initiate deep conversations, share your feelings—and feel rejected when he doesn\'t match.',
        dynamic: 'Pursuit-distance. You want emotional intimacy; he maintains distance. The more you pursue, the more he withdraws.',
        whatItMeans: 'He keeps the emotional wall up on purpose. He may say he cares—but he doesn\'t go deep. You feel shut out. That distance isn\'t about you. It\'s his pattern. You can only decide if you can live with it.',
        whyYouStay: 'When he does open up—even a little—it feels like a breakthrough. You think "if I just try harder, he\'ll let me in." Your brain keeps trying to solve the distance. That hope keeps you invested longer than you expected.',
        ifNothingChanges: ['the emotional distance stays', 'you\'ll keep trying to get closer and feeling rejected', 'intimacy becomes one-sided', 'you\'ll exhaust yourself trying to bridge a gap he\'s not trying to close'],
        signsYoureInIt: ['you initiate deep conversations and he keeps things surface-level', 'you feel shut out when things get emotional', 'you\'ve tried to explain what you need and nothing changed', 'you wonder if you\'re asking for too much'],
        strengths: 'You want real connection. You\'re willing to be vulnerable. That emotional awareness is what allows you to recognize when someone can\'t meet you—and choose differently.',
        watchFor: 'Trying to "fix" his emotional unavailability. Taking his distance personally when it may be his pattern.',
        watchForInstead: 'Ask yourself: "Is he capable of the depth I want?" If he\'s not, that\'s not a you problem—it\'s a compatibility problem.',
        nextStep: 'You know the pattern now—pursue, he withdraws, repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t trying harder to get closer—it\'s deciding if you can live with the connection he\'s capable of offering.',
        coreBelief: 'If I open up more, he\'ll open up too.',
        behaviorDriver: 'try to get closer, or pursue when he withdraws',
        coreBeliefReframe: 'His capacity for depth isn\'t something you can create. You can only decide if you can live with what he offers.',
        successSubtext: 'he keeps an emotional wall up — leaving you trying harder to connect while he stays guarded and distant',
        whyHeActsThisWay: 'He keeps a wall up because emotional intimacy feels threatening. He may care—but he doesn\'t go deep. He shuts down when things get emotional. It\'s not about you. It\'s his pattern.',
        doesHeLikeMe: 'He may have feelings—but his capacity for emotional depth is limited. "Liking" someone and being able to meet them emotionally are different. His distance isn\'t a sign he doesn\'t care; it\'s a sign of his capacity. The real question: Can you live with the connection he\'s capable of offering?',
        whyItFeelsConfusing: 'When he does open up—even a little—it feels like a breakthrough. You think "if I just try harder, he\'ll let me in." You wonder if you\'re asking for too much. You\'re not. The distance is his pattern, not your failure. The confusion comes from trying to solve something that isn\'t yours to fix.'
    },
    'mixed-signals-loop': {
        id: 'mixed-signals-loop',
        name: 'The Mixed Signals Trap',
        description: 'His words and actions don\'t match. You\'re always second-guessing. You seek clarity but end up more confused.',
        hisPattern: 'Says one thing, does another. "I want something serious" but doesn\'t act like it. Inconsistent behavior.',
        herPattern: 'You seek clarity. You try to understand, to make sense of the disconnect—and feel confused.',
        dynamic: 'Trust erosion. You can\'t rely on what he says. You\'re always interpreting, wondering what\'s real.',
        whatItMeans: 'He gives just enough attention to keep you invested—but not enough consistency to move forward. His words and actions don\'t match. That disconnect isn\'t confusion. It\'s the pattern.',
        whyYouStay: 'The attention comes in cycles. When he\'s warm, it feels real. When he pulls away, you try to understand it. Your brain keeps solving the inconsistency—that keeps you invested longer than you expected.',
        ifNothingChanges: ['the relationship stays undefined', 'emotional investment becomes one-sided', 'the confusion increases over time', 'clarity rarely appears suddenly'],
        signsYoureInIt: ['you replay conversations trying to understand what he meant', 'his words and actions don\'t match', 'the relationship feels intense but unclear', 'you keep waiting for clarity that never fully arrives'],
        strengths: 'You notice inconsistencies. You ask questions. You want clarity instead of pretending everything is fine. That awareness is what allows you to break the pattern.',
        watchFor: 'Over-analyzing his behavior. Giving him the benefit of the doubt when his actions keep contradicting his words.',
        watchForInstead: 'Trust his actions, not his words. Neuroscience shows: behavior predicts future behavior. If his actions don\'t match his words, the actions are the truth.',
        nextStep: 'You know the pattern now—words and actions don\'t match, you decode, repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t figuring him out—it\'s trusting his actions and deciding what you\'ll accept.',
        coreBelief: 'If I figure out what he really means, I\'ll know where I stand.',
        behaviorDriver: 'decode his words, or analyze the disconnect',
        coreBeliefReframe: 'You\'ll never "figure out" mixed signals—that\'s the trap. Clarity comes from his actions, not your analysis.',
        successSubtext: 'his words and actions don\'t match — leaving you constantly trying to interpret what he really feels',
        whyHeActsThisWay: 'His words and his willingness don\'t align. He may believe what he says in the moment—but his behavior reveals his actual investment. Mixed signals aren\'t confusion; they\'re the pattern. He keeps you guessing because that keeps you invested without him showing up consistently.',
        doesHeLikeMe: 'When words and actions don\'t match, trust the actions. His behavior reveals his real investment. He may say he likes you or wants something serious—but if his actions don\'t back that up, the actions are the truth. The question: What is he willing to do?',
        whyItFeelsConfusing: 'You\'re trying to decode his words instead of trusting his actions. You replay conversations. You wonder what he meant. The confusion is the trap—it keeps you analyzing instead of deciding. You\'re not crazy. Inconsistency creates anxiety. The confusion is built into the pattern.'
    },
    'one-sided-investment': {
        id: 'one-sided-investment',
        name: 'The One-Sided Investment',
        description: 'You\'re doing most of the work. He\'s comfortable with that. You overinvest; he takes more than he gives.',
        hisPattern: 'Takes more than he gives. Lets you initiate, plan, and invest. Comfortable with the imbalance.',
        herPattern: 'You overinvest. You tolerate the imbalance, hoping he\'ll step up.',
        dynamic: 'Imbalance of power. You want reciprocity; he\'s fine with the status quo. You give; he receives.',
        whatItMeans: 'You\'re doing most of the emotional work—initiating, planning, investing. He\'s comfortable with that. He has no incentive to change when you\'re carrying the relationship. One-sided dynamics rarely shift unless you stop overgiving.',
        whyYouStay: 'Your effort feels like love. You believe that if you give more, he\'ll match it. Your brain keeps hoping he\'ll finally step up. That hope keeps you invested—and exhausted—longer than you expected.',
        ifNothingChanges: ['the imbalance stays', 'you\'ll keep overgiving and feeling depleted', 'the relationship only works because you\'re carrying it', 'he has no reason to change'],
        signsYoureInIt: ['you initiate most plans and conversations', 'you feel like you\'re doing more than he is', 'you\'ve hoped he\'d step up and he hasn\'t', 'the relationship feels like work'],
        strengths: 'You show up. You\'re generous. You\'re willing to put in effort. That capacity for investment, when matched, is a strength. Right now it\'s being used on someone who isn\'t matching it.',
        watchFor: 'Confusing your effort with his commitment. Believing that if you give more, he\'ll match it.',
        watchForInstead: 'Match his energy. Pull back. See if he steps up—or if the relationship was only working because you were carrying it. Research on reciprocity shows: imbalance rarely corrects itself.',
        nextStep: 'You know the pattern now—you give, he takes, repeat. The real question: Does this relationship give you what you actually want? If the answer is no, the next step isn\'t giving more—it\'s matching his energy and seeing if he steps up.',
        coreBelief: 'If I give more, he\'ll give back.',
        behaviorDriver: 'give more, or overinvest hoping he\'ll match',
        coreBeliefReframe: 'Giving more doesn\'t create reciprocity. He has no incentive to change when you\'re doing the work. Your pullback is the only leverage you have.',
        successSubtext: 'you\'re putting in most of the effort — trying to hold the relationship together while he gives far less in return',
        whyHeActsThisWay: 'He takes more than he gives because you allow it. He\'s comfortable with the imbalance—no incentive to change when you\'re carrying the relationship. He may care, but he\'s not matching your effort. That\'s a choice.',
        doesHeLikeMe: 'He may care—but his behavior suggests he\'s comfortable receiving more than he gives. "Liking" someone shows up in effort: who initiates, who plans, who invests. If you\'re doing most of the work, his investment doesn\'t match yours. The question: Is he willing to show up the way I need?',
        whyItFeelsConfusing: 'Your effort feels like love. You believe that if you give more, he\'ll match it. The relationship feels like work—and you wonder if that\'s normal. You\'re not crazy for wanting reciprocity. The imbalance is the pattern. The confusion comes from hoping he\'ll change when he hasn\'t shown that he will.'
    }
};

// Her Response Patterns (Secondary Result)
window.herResponsePatterns = {
    'reassurance-seeker': {
        name: 'The Reassurance Seeker',
        description: 'When you feel uncertain, you reach out more. You look for proof he cares—through his texts, his effort, his words. You may push for real answers when something bothers you. You initiate to feel connected.'
    },
    'space-giver': {
        name: 'The Space Giver',
        description: 'When he pulls away, you hold back. You give him space so you don\'t seem needy, even though it\'s hard. You wait for him to come to you.'
    },
    'direct-communicator': {
        name: 'The Direct Communicator',
        description: 'You ask directly. You bring things up and want real answers. But you often hit a wall—he deflects, gets defensive, or shuts down.'
    },
    'hopeful-waiter': {
        name: 'The Hopeful Waiter',
        description: 'You stay and hope things will change. You give him time, drop things when he deflects, and wait for him to show up the way you need.'
    },
    'protector': {
        name: 'The Protector',
        description: 'You shut down or pull back to avoid more hurt. You stop investing, stop bringing things up, and build walls to protect yourself.'
    },
    'balanced': {
        name: 'The Self-Aware One',
        description: 'You notice the dynamic and try to stay grounded. You\'re not chasing, not shutting down—you\'re aware of what\'s happening and choosing how to respond.'
    }
};

// Pattern across relationships (from repetition question)
window.repetitionInsights = {
    'same-type': 'You tend to end up in dynamics where you want more than you\'re getting.',
    'same-ending': 'Your relationships often end in the same kind of confusion.',
    'same-confusion': 'You often choose people who keep you guessing.',
    'different': 'You\'ve had different kinds of relationships—this one stands out.',
    'first-time': 'This feels new to you—or you\'re noticing the pattern for the first time.'
};

// Situationship Dynamic - sub-pattern modifier (applied when undefined relationship + months without clarity)
window.situationshipModifier = {
    name: 'Situationship Dynamic',
    tagline: 'Undefined relationship · Months without clarity',
    description: 'Your pattern is amplified by the situationship context—undefined status combined with extended ambiguity.'
};

// Keep archetypeCategories for backward compatibility (map to relationship pattern)
window.archetypeCategories = {
    'hot-cold-cycle': { name: 'The Hot-and-Cold Cycle', description: 'Inconsistent emotional availability', symbol: '🔄' },
    'breadcrumb-dynamic': { name: 'The Breadcrumb Dynamic', description: 'Minimal effort to keep connection alive', symbol: '🍞' },
    'commitment-avoidance': { name: 'The Commitment Avoidance', description: 'Future stays vague', symbol: '❓' },
    'emotional-distance': { name: 'The Emotional Wall', description: 'Emotionally unavailable partner', symbol: '🧊' },
    'mixed-signals-loop': { name: 'The Mixed Signals Trap', description: 'Words and actions don\'t match', symbol: '〰️' },
    'one-sided-investment': { name: 'The One-Sided Investment', description: 'You give more than you receive', symbol: '⚖️' }
};

// Map relationship patterns to personalityPatterns for backward compatibility with results-modal
window.personalityPatterns = {};
Object.keys(window.relationshipPatterns || {}).forEach(key => {
    const rp = window.relationshipPatterns[key];
    window.personalityPatterns[key] = {
        name: rp.name,
        archetypeCategory: rp.name,
        driver: 'relationship-dynamic',
        rootEmotion: 'Clarity',
        coreBelief: rp.coreBelief,
        strength: rp.strengths,
        shadow: rp.watchFor,
        resetFocus: rp.nextStep,
        identity: rp.description,
        cta: 'Want clarity about your specific situation? Submit your relationship story for a personalized analysis.'
    };
});

// Quiz Questions - 16 scored + 4 special (v2.1 Optimized)
window.quizData = [
    // Q1 - Category 1: Consistency
    {
        question: 'How consistent is his attention toward you?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'Very consistent — I know where I stand', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'consistent' },
            { text: 'Mostly consistent, with small dips', score: SCORE.MILD, dimension: 'his-behavior', subDimension: 'mostly-consistent' },
            { text: 'Hot and cold — it changes a lot', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold' },
            { text: 'He disappears and comes back without explanation', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold' }
        ]
    },
    // Q2 - Category 2: Emotional availability
    {
        question: 'How emotionally open is he with you?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'Very open — we talk about feelings easily', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'open' },
            { text: 'Somewhat open, but I usually bring it up first', score: SCORE.MILD, dimension: 'his-behavior', subDimension: 'one-sided' },
            { text: 'Rarely — he keeps things surface-level', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'emotional-distance' },
            { text: 'Almost never — emotional topics shut him down', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'emotional-distance' }
        ]
    },
    // Q3 - Category 3: Conflict behavior (NEW)
    {
        question: 'When tension comes up between you, what usually happens?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'We talk through it', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'open' },
            { text: 'It gets avoided', score: SCORE.MODERATE, dimension: 'his-behavior', subDimension: 'avoidant' },
            { text: 'It creates distance between us', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'emotional-distance' },
            { text: 'He disappears', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold' }
        ]
    },
    // Q4 - Category 4: Commitment clarity
    {
        question: 'When you\'ve talked about the future or defining things, he usually…',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'Avoids the topic', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'commitment-avoidance' },
            { text: 'Keeps things vague ("let\'s just see where it goes")', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'commitment-avoidance' },
            { text: 'Says he wants the same things but doesn\'t follow through', score: SCORE.MODERATE, dimension: 'his-behavior', subDimension: 'mixed-signals' },
            { text: 'Is clear about his intentions', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'clear' }
        ]
    },
    // Q5 - Category 5: Response to vulnerability (NEW - high-value diagnostic)
    {
        question: 'When you express your feelings or ask for clarity about the relationship, what usually happens?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'He listens, tries to understand, and we talk through it', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'open' },
            { text: 'He reassures me in the moment, but nothing really changes afterward', score: SCORE.MODERATE, dimension: 'his-behavior', subDimension: 'mixed-signals' },
            { text: 'He becomes distant or pulls away after the conversation', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold' },
            { text: 'He shuts the conversation down or becomes defensive', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'emotional-distance' }
        ]
    },
    // Q6 - Category 6: Effort balance
    {
        question: 'Who puts in most of the effort in the relationship?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'We both contribute equally', score: SCORE.NONE, dimension: 'dynamic', subDimension: 'balanced' },
            { text: 'I do most of the initiating and planning', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment' },
            { text: 'I used to put in more, but I\'ve pulled back', score: SCORE.MODERATE, dimension: 'her-response', subDimension: 'protector' },
            { text: 'He shows up when he wants to', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'breadcrumb-dynamic' }
        ]
    },
    // Q7 - Category 7: Initiation pattern
    {
        question: 'Who usually initiates communication or plans?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'We both initiate equally', score: SCORE.NONE, dimension: 'dynamic', subDimension: 'balanced' },
            { text: 'I usually reach out first', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment' },
            { text: 'He reaches out — but inconsistently', score: SCORE.MODERATE, dimension: 'dynamic', subDimension: 'hot-cold-cycle' },
            { text: 'It depends on what he wants', score: SCORE.MODERATE, dimension: 'dynamic', subDimension: 'breadcrumb-dynamic' }
        ]
    },
    // Q8 - Category 8: Emotional aftermath (powerful diagnostic)
    {
        question: 'How do you usually feel after spending time with him?',
        domain: 'EMOTIONAL_STATE',
        dimension: 'emotional-state',
        options: [
            { text: 'Secure and calm', score: SCORE.NONE, dimension: 'emotional-state', subDimension: 'balanced' },
            { text: 'Happy but slightly unsure', score: SCORE.MILD, dimension: 'emotional-state', subDimension: 'breadcrumb-dynamic' },
            { text: 'Anxious or overthinking', score: SCORE.STRONG, dimension: 'emotional-state', subDimension: 'hot-cold-cycle' },
            { text: 'Emotionally drained', score: SCORE.STRONG, dimension: 'emotional-state', subDimension: 'one-sided-investment' }
        ]
    },
    // Q9 - Dynamic: Overall feel (primary pattern)
    {
        question: 'Which of these feels most like your relationship right now?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'Hot and cold — we feel close one moment, then distant the next', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'hot-cold-cycle' },
            { text: 'He gives just enough attention to keep me interested, but never enough to feel secure', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'breadcrumb-dynamic' },
            { text: 'The future always feels unclear — we never fully define where this is going', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'commitment-avoidance' },
            { text: 'His words and actions don\'t match, and it leaves me second-guessing things', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'mixed-signals-loop' },
            { text: 'I feel like I\'m doing most of the emotional work in the relationship', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment' }
        ]
    },
    // Q10 - Her response 1: Reaction to distance (differentiated scoring)
    {
        question: 'When you feel him pulling away, what do you tend to do?',
        domain: 'HER_RESPONSE',
        dimension: 'her-response',
        options: [
            { text: 'Reach out more to reconnect', score: 6, dimension: 'her-response', subDimension: 'reassurance-seeker' },
            { text: 'Try to act calm and give him space', score: 4, dimension: 'her-response', subDimension: 'space-giver' },
            { text: 'Ask him directly what\'s going on', score: 2, dimension: 'her-response', subDimension: 'direct-communicator' },
            { text: 'Pull back to protect myself', score: 5, dimension: 'her-response', subDimension: 'protector' }
        ]
    },
    // Q11 - Her response 2: When unsure
    {
        question: 'When you\'re unsure where you stand, what do you usually do?',
        domain: 'HER_RESPONSE',
        dimension: 'her-response',
        options: [
            { text: 'Look for signs he cares (texts, effort, attention)', score: 6, dimension: 'her-response', subDimension: 'reassurance-seeker' },
            { text: 'Pretend I\'m fine so I don\'t seem needy', score: 4, dimension: 'her-response', subDimension: 'space-giver' },
            { text: 'Ask directly where we stand', score: 2, dimension: 'her-response', subDimension: 'direct-communicator' },
            { text: 'Withdraw emotionally so I don\'t get hurt', score: 5, dimension: 'her-response', subDimension: 'protector' }
        ]
    },
    // Q12 - Her response 3: When bothered
    {
        question: 'When something he does bothers you, you usually…',
        domain: 'HER_RESPONSE',
        dimension: 'her-response',
        options: [
            { text: 'Bring it up and push for clarity', score: 5, dimension: 'her-response', subDimension: 'reassurance-seeker' },
            { text: 'Mention it once but drop it if he deflects', score: 4, dimension: 'her-response', subDimension: 'space-giver' },
            { text: 'Tell him clearly how it affects me', score: 2, dimension: 'her-response', subDimension: 'direct-communicator' },
            { text: 'Keep it to myself to avoid conflict', score: 6, dimension: 'her-response', subDimension: 'protector' }
        ]
    },
    // Q13 - Category 9: Pattern history
    {
        question: 'Looking at your past relationships, which feels most true?',
        domain: 'REPETITION',
        dimension: 'repetition',
        options: [
            { text: 'I keep attracting the same type of partner', score: SCORE.MILD, dimension: 'repetition', subDimension: 'same-type', value: 'same-type' },
            { text: 'My relationships tend to follow the same pattern', score: SCORE.MILD, dimension: 'repetition', subDimension: 'same-ending', value: 'same-ending' },
            { text: 'I often want more than the other person does', score: SCORE.MILD, dimension: 'repetition', subDimension: 'same-confusion', value: 'same-confusion' },
            { text: 'This dynamic feels different from my past ones', score: SCORE.NONE, dimension: 'repetition', subDimension: 'different', value: 'different' },
            { text: 'I\'m just now starting to notice a pattern', score: SCORE.NONE, dimension: 'repetition', subDimension: 'first-time', value: 'first-time' }
        ]
    },
    // Q14 - Context: Duration (for situationship modifier)
    {
        question: 'How long has this pattern between you been going on?',
        domain: 'CONTEXT',
        dimension: 'context',
        options: [
            { text: 'Less than 3 months', score: SCORE.NONE, dimension: 'context', subDimension: 'short' },
            { text: '3–6 months', score: SCORE.MILD, dimension: 'context', subDimension: 'medium' },
            { text: '6–12 months', score: SCORE.MODERATE, dimension: 'context', subDimension: 'long' },
            { text: 'Over a year', score: SCORE.STRONG, dimension: 'context', subDimension: 'very-long' }
        ]
    },
    // Q15 - Attraction: Who wants more
    {
        question: 'Who wants more clarity or commitment right now?',
        domain: 'ATTRACTION',
        dimension: 'attraction',
        options: [
            { text: 'We both want the same thing', score: SCORE.NONE, dimension: 'attraction', subDimension: 'balanced' },
            { text: 'I want more clarity than he does', score: SCORE.STRONG, dimension: 'attraction', subDimension: 'she-wants-more' },
            { text: 'He holds the power — I\'m waiting on him', score: SCORE.STRONG, dimension: 'attraction', subDimension: 'he-holds-cards' },
            { text: 'We\'re both unsure', score: SCORE.MODERATE, dimension: 'attraction', subDimension: 'mutual-uncertainty' }
        ]
    },
    // Q16 - Attraction: Her fear
    {
        question: 'What worries you most about this relationship?',
        domain: 'ATTRACTION',
        dimension: 'attraction',
        options: [
            { text: 'That I\'m wasting my time', score: SCORE.MILD, dimension: 'attraction', subDimension: 'she-wants-more' },
            { text: 'That I\'m ignoring red flags', score: SCORE.MILD, dimension: 'attraction', subDimension: 'she-wants-more' },
            { text: 'That he\'ll eventually leave', score: SCORE.MILD, dimension: 'attraction', subDimension: 'he-holds-cards' },
            { text: 'That I\'ll never get real clarity', score: SCORE.MILD, dimension: 'attraction', subDimension: 'she-wants-more' },
            { text: 'That I\'m more invested than he is', score: SCORE.MILD, dimension: 'attraction', subDimension: 'he-holds-cards' }
        ]
    },
    // Birth Date (Q17) - Optional
    {
        question: 'What is your birth date?',
        questionType: 'birthdate',
        domain: 'BIRTHDATE',
        options: []
    },
    // Relationship Status (Q18) - Required
    {
        question: 'Which best describes your situation?',
        questionType: 'relationship-status',
        domain: 'RELATIONSHIP_STATUS',
        required: true,
        options: [
            { text: 'Dating — getting to know each other', value: 'dating' },
            { text: 'Situationship / undefined', value: 'situationship' },
            { text: 'In a relationship but unsure about it', value: 'emotionally-invested' },
            { text: 'Recently ended', value: 'recently-ended' },
            { text: 'Not in one now, but patterns keep repeating', value: 'not-in-one' }
        ]
    },
    // Biggest Challenge (Q19) - Required
    {
        question: "What's the biggest challenge you're facing in love or relationships right now?",
        questionType: 'current-pain',
        domain: 'CURRENT_PAIN',
        required: true,
        options: [
            { text: 'I keep attracting emotionally unavailable people', value: 'same-type' },
            { text: 'I stay even when I know it\'s not right', value: 'stay-when-shouldnt' },
            { text: 'I sabotage when things get serious', value: 'sabotage' },
            { text: 'I tolerate less than I deserve', value: 'tolerate-less' },
            { text: 'I ignore red flags or make excuses', value: 'ignore-red-flags' },
            { text: 'Situationship that won\'t progress', value: 'situationship' },
            { text: 'Recovering from betrayal or cheating', value: 'cheated-betrayed' },
            { text: 'I don\'t understand why relationships keep failing', value: 'dont-know-why' },
            { text: 'Other', value: 'other' }
        ]
    },
    // Biggest Fear (Q20) - Required
    {
        question: "What's your biggest fear when it comes to love or relationships?",
        questionType: 'biggest-fear',
        domain: 'BIGGEST_FEAR',
        required: true,
        options: [
            { text: 'Being abandoned', value: 'abandoned' },
            { text: 'Being rejected or not chosen', value: 'rejected' },
            { text: 'Being alone long-term', value: 'alone-forever' },
            { text: 'Losing myself in a relationship', value: 'losing-myself' },
            { text: 'Being hurt again', value: 'hurt-again' },
            { text: 'Being emotionally neglected', value: 'emotionally-neglected' },
            { text: 'That I\'m the problem', value: 'im-the-problem' },
            { text: 'That I\'ll never find the right person', value: 'never-find-right' },
            { text: 'Other', value: 'other' }
        ]
    }
];
