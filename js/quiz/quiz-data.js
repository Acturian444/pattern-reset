// Quiz Data - Relationship Dynamic Quiz v6.0 (10 Q — less redundancy, sharper options, earlier tension path)
// Scoring: 0/2/4/6; primary pattern still anchored Q6; future Q8 (index 7); decision + desire unscored

// Scoring scale: 0 (healthy) / 2 (mild) / 4 (moderate) / 6 (strong signal)
const SCORE = { NONE: 0, MILD: 2, MODERATE: 4, STRONG: 6 };

/** Teaser line: free results name the pattern, not the playbook (full breakdown holds next steps). */
const RELATIONSHIP_FREE_RESULT_COPY = 'You can keep spinning the story… or finally see what\'s actually happening—clear enough that it stops feeling like it\'s all in your head.';

// Relationship Patterns (Primary Result) - replaces archetype + personality pattern
window.relationshipPatterns = {
    'hot-cold-cycle': {
        id: 'hot-cold-cycle',
        breakdownVerdict: 'He pulls you close, then pushes you away. That isn\'t confusion — it\'s him wanting you available without having to commit.',
        breakdownIfYouAct: [
            'you stop chasing the warm moments and start reading the cold ones as information',
            'you get one clear answer instead of a running collection of maybes',
            'you stop paying in anxiety for attention that was never going to be steady'
        ],
        breakdownWatchForHim: 'Expect one more warm reach — a text, a plan, a perfectly timed apology — right when you pull back. That\'s the cycle resetting, not the pattern changing.',
        breakdownOrigin: 'You chase when he pulls away because sitting still in the distance feels worse than anything. It\'s not weakness — it\'s the part of you that learned connection has to be kept alive to be safe.',
        breakdownValidation: 'You\'re not crazy. You\'re not too much. The inconsistency is the pattern — not your reading of it.',
        breakdownEscalation: [
            '"Hey stranger" texts after he disappears — no explanation for where he went.',
            'Cold phases get longer. Warm phases get shorter and more transactional.',
            'You mostly hear from him late at night, after drinks, or when he\'s bored.'
        ],
        breakdownTimeline: {
            twoWeeks: 'same cycle — one more warm reach, one more cold stretch.',
            threeMonths: 'you stop mentioning him to friends. The chase becomes automatic.',
            oneYear: 'a full year decoding someone whose pattern never actually changed.'
        },
        breakdownScript: 'I need steady, not intense. When you pull back and come back, I\'m not going to chase — I\'ll wait until you can stay.',
        breakdownHealthy: 'In healthy: distance gets named, not performed. "I need a quiet night" — not disappearing and reappearing.',
        name: 'The "Hot Then Cold" Loop',
        userOneLiner: 'He shows up strong—then pulls away. You\'re left trying to figure out what changed.',
        paywallDynamicShort: 'He shows up strong—then pulls away. You\'re left trying to figure out what changed.',
        dynamicLabelInternal: 'Hot-and-Cold / Push–Pull Dynamic',
        description: 'He\'s close, then distant. You never know where you stand. When he pulls away, you chase. When he comes back, you feel relief—until the cycle repeats.',
        hisPattern: 'Pulls away right when things start to feel real. Comes back warm on his timing — not yours.',
        herPattern: 'You reach for him when he goes cold. You soften, adjust, try harder — and hope this time the warmth sticks.',
        dynamic: 'He shows up strong, pulls away, shows up again — and you\'re always adjusting to him.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'He pulls away when things get real—closeness triggers his need for space. He returns when he wants connection—on his terms. The inconsistency keeps you available without him having to commit. His behavior follows a pattern: pursue when distant, retreat when close.',
        doesHeLikeMe: 'He likely has feelings—otherwise he wouldn\'t keep coming back. But "liking" someone and showing up consistently are different. His behavior suggests he wants you when it suits him, not as a priority. The real question: Is his investment enough for what I need?',
        whyItFeelsConfusing: 'Your brain seeks consistency. When he\'s warm, it feels real. When he pulls away, you try to understand why. That inconsistency creates anxiety—and anxiety creates attachment. You\'re not crazy. The confusion is built into the pattern.',
        hisIdentityLines: [
            'Pulls away right when things start to feel close.',
            'Comes back warm — on his timing, not yours.',
            'Disappears without explanation, then reappears like nothing happened.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'He pulls away → you try to reconnect',
                'He comes back → it feels real again',
                'Then it drops—and the cycle resets'
            ],
            ['You keep trying to get back to how it felt at its best.'],
            ['But nothing actually stabilizes.']
        ],
        resultModal: {
            loopBody: 'He comes close—then goes cold. You feel relief when he\'s warm, then anxiety when he disappears. You reach or replay what happened; he returns just enough to reset hope. You never get a stable place to stand—just the next swing.',
            costAfterLead: 'you live in anxiety between highs, and you start blaming yourself for "overreacting" when the distance comes back.',
            futureAfterLead: 'you keep chasing someone who only shows up on his terms—and clarity never arrives, because the pattern is the point.',
            lcfMerged: 'He comes close—then goes cold. You live between relief and anxiety, replaying what happened, and you start blaming yourself when the distance returns. If nothing changes, you keep chasing someone who only shows up on his terms—while clarity never arrives, because the pattern is the point.',
            oneDecision: 'Decide whether you will keep pursuing closeness every time he withdraws—or hold a standard for steadiness that matches what you need.',
            oneAction: 'Before you pursue, pause and name what you need in one clear sentence (for yourself first): connection, reassurance, or a plan—without sending a novel or chasing “proof.”'
        }
    },
    'breadcrumb-dynamic': {
        id: 'breadcrumb-dynamic',
        breakdownVerdict: 'Crumbs aren\'t commitment. His effort has a ceiling, and you\'ve been shrinking what you need to fit under it.',
        breakdownIfYouAct: [
            'you stop grading his bare minimum as progress',
            'you see in two weeks what you\'ve been guessing at for months',
            'you get your standard back before another year goes by'
        ],
        breakdownWatchForHim: 'Expect a bigger-than-usual gesture right when you pull back — crumbs get larger when supply is threatened. That isn\'t change; that\'s a reset.',
        breakdownOrigin: 'You wait for the next crumb because each one feels like proof this is going somewhere. Hope is a survival skill — it\'s kept you through hard seasons. Here it\'s costing more than it\'s saving.',
        breakdownValidation: 'You\'re not stupid for staying. You\'re invested. Your brain is protecting the investment — not the relationship. That\'s a different problem than the one you\'ve been solving.',
        breakdownEscalation: [
            'Promises with no calendar: "we should…" / "soon" / "one day."',
            'He only initiates after you\'ve pulled away — never without that cue.',
            'Plans that almost happen. Conversations that almost get real.'
        ],
        breakdownTimeline: {
            twoWeeks: 'one slightly bigger gesture when you go quiet — then back to crumbs.',
            threeMonths: 'you\'ve shrunk what you tell friends he does, because saying it out loud makes it smaller.',
            oneYear: 'a year of "almost" — nothing defined, nothing moved in, nothing actually different.'
        },
        breakdownScript: 'I don\'t want to keep guessing where we are. Either we\'re building something, or we\'re not — what are you actually offering?',
        breakdownHealthy: 'In healthy: he initiates without being chased. Plans happen on the calendar, not in theory.',
        name: 'The "Just Enough" Loop',
        userOneLiner: 'He gives you just enough to stay—but never enough to feel secure.',
        paywallDynamicShort: 'He gives you just enough to stay—but never enough to feel secure.',
        dynamicLabelInternal: 'Breadcrumb / Intermittent Reinforcement Dynamic',
        description: 'He gives just enough to keep you interested, but not enough to feel secure. His words might sound promising, but his actions stay minimal. You stay hoping for more, tolerating the ambiguity.',
        hisPattern: 'Texts enough to stay in your head, not enough to plan around. Keeps plans loose, affection rationed.',
        herPattern: 'You wait for the next sign he\'s choosing you. You call "at least he\'s trying" enough — and stay.',
        dynamic: 'He gives just enough to keep you hoping — never enough to feel sure.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'He gives minimal effort because it works. Occasional texts, plans, or affection keep you invested without him showing up fully. He controls the pace. His behavior is efficient: maximum connection, minimum commitment.',
        doesHeLikeMe: 'He wants to keep you in his life—but not as a priority. He gives enough to maintain the connection without committing. His investment has a ceiling. The real question: Does his level of investment match what you need?',
        whyItFeelsConfusing: 'Each crumb feels like progress. When he texts or makes a plan, it feels like he\'s choosing you. Your brain waits for the next sign. That hope keeps you invested—and confused about whether you\'re "almost there" or nowhere at all. You\'re not crazy. The ambiguity is the pattern.',
        hisIdentityLines: [
            'Texts enough to stay in your head — not enough to plan around.',
            'Makes loose plans that never land on the calendar.',
            'Reaches out right when you\'re about to move on.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'He gives a little → you stay hopeful',
                'Then he disappears → you wait',
                'He comes back just enough → and it resets'
            ],
            ['It\'s never enough to feel secure—but just enough to keep you in it.']
        ],
        resultModal: {
            loopBody: 'He drops attention in bursts. You wait for the next text, plan, or sign it\'s "getting serious." Each crumb feels like proof—then silence resets you. You lower the bar so the pattern can continue.',
            costAfterLead: 'you shrink what you need to match what he offers, and you start calling inconsistency "potential."',
            futureAfterLead: 'you stay suspended—never secure enough to relax, never gone enough to grieve it and move on.',
            lcfMerged: 'He drops attention in bursts; you wait for the next sign and shrink what you need to match what he offers. You start calling inconsistency "potential" and stay suspended—never secure enough to relax, never gone enough to move on. If nothing changes, hope keeps costing you time and self-trust.',
            oneDecision: 'Decide whether “just enough” is still a yes—or whether you need consistent, chosen effort you don’t have to beg for.',
            oneAction: 'For two weeks, track only behavior: who initiates, who follows through, what actually happens on the calendar—leave his intentions out of it.'
        }
    },
    'commitment-avoidance': {
        id: 'commitment-avoidance',
        breakdownVerdict: 'He isn\'t figuring it out. He\'s keeping it undefined on purpose. Vague is the answer.',
        breakdownIfYouAct: [
            'you stop auditioning for a role he hasn\'t offered',
            'you get a timeline instead of more "someday" language',
            'you stop confusing patience with progress'
        ],
        breakdownWatchForHim: 'Expect feelings talk without timeline. "I care about you" is not the same as "here is what I\'m committing to, and by when."',
        breakdownOrigin: 'You stay patient because patience has worked for you before — in jobs, in family, in friendships. But patience doesn\'t build readiness in someone who won\'t name what he wants. You\'re paying in time he won\'t spend.',
        breakdownValidation: 'You\'re not asking for too much. Wanting a label isn\'t pressure — it\'s baseline. His vagueness isn\'t confusion he\'s working through. It\'s the answer he\'s already giving.',
        breakdownEscalation: [
            'He hasn\'t introduced you to anyone close to him — family, best friends, his real life.',
            'He reframes every future question as "why are you making it so serious?"',
            'His language about the future gets softer the longer you\'re in it, not firmer.'
        ],
        breakdownTimeline: {
            twoWeeks: 'another round of "I\'m just not ready yet" — said warmly, meaning the same thing.',
            threeMonths: 'you stop bringing up "us" because it\'s easier than hearing a non-answer.',
            oneYear: 'a year older, in the exact same undefined position.'
        },
        breakdownScript: 'I need to know where this is going. What are you actually committing to — and by when?',
        breakdownHealthy: 'In healthy: he can answer "what are we" without flinching. The timeline is his to offer, not yours to extract.',
        name: 'The "Almost" Loop',
        userOneLiner: 'It feels close to something real—but never actually becomes it.',
        paywallDynamicShort: 'It feels close to something real—but never actually becomes it.',
        dynamicLabelInternal: 'Commitment Avoidance / Ambiguity Dynamic',
        description: 'The future is always vague. You want clarity; he keeps it fuzzy. You stay despite the uncertainty, waiting for him to change.',
        hisPattern: 'Dodges "where is this going?" every time. Says the right things, but never puts anything on a timeline.',
        herPattern: 'You stop asking the question as often — to keep the peace. You stay patient and hope he becomes ready.',
        dynamic: 'You want to know where this is going. He keeps it undefined — on purpose.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'He avoids "where is this going?" because clarity would require him to choose. Keeping things undefined lets him have connection without commitment. His actions keep things open-ended. That ambiguity isn\'t confusion. It\'s a choice.',
        doesHeLikeMe: 'He may care—but his behavior suggests he\'s not ready to choose you in a defined way. "Liking" someone and being willing to commit are different. His vagueness is the answer: if he wanted to move forward, he would. The question: Is he capable of giving me what I need?',
        whyItFeelsConfusing: '"Almost" feels like progress. You\'re so close to having what you want. The future feels like a conversation you\'re not allowed to have. You\'re not crazy for wanting clarity. The vagueness is the pattern—designed to keep you waiting.',
        hisIdentityLines: [
            'Dodges "where is this going?" every time you ask.',
            'Says "I\'m not ready" — then keeps everything exactly the same.',
            'Talks about the future in "maybe" and "someday" — never in weeks or months.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'You get close to clarity → he pulls it back',
                'You wait for "later" → nothing actually moves',
                'You stay patient → hoping it turns into something real'
            ],
            ['It always feels close—but never actually becomes it.']
        ],
        resultModal: {
            loopBody: 'You want a real answer about the future. He keeps it fuzzy—enough hope to stay, never enough definition to know. "Almost" replaces the decision, so you wait instead of choose.',
            costAfterLead: 'your patience trains you to accept vague as normal—and you put your life on hold for someone who won\'t name what this is.',
            futureAfterLead: 'you stay in something that never becomes real—because "later" never has to become now.',
            lcfMerged: 'You want a real answer; he keeps the future fuzzy—enough hope to stay, never enough to choose. Your patience trains you to accept vague as normal and put your life on hold. If nothing changes, "later" never becomes now—and you stay in something that never becomes real.',
            oneDecision: 'Decide whether open-ended “someday” still works for your life—or whether you need a direct answer with a timeframe attached.',
            oneAction: 'Ask one clarity question you can repeat verbatim—and treat vague as information: “What are we, and by when will you know?”'
        }
    },
    'emotional-distance': {
        id: 'emotional-distance',
        breakdownVerdict: 'He isn\'t closed because of you. He\'s closed. Period. You\'ve been asking him for a depth he doesn\'t offer.',
        breakdownIfYouAct: [
            'you stop doing the emotional labor for both of you',
            'you find out in weeks what his real ceiling is — not in years',
            'you stop questioning whether wanting depth is "too much"'
        ],
        breakdownWatchForHim: 'Expect a small opening right after you back off, then back to surface. His capacity hasn\'t changed — only the pressure on him has.',
        breakdownOrigin: 'You reach for depth because depth is how you love. That\'s not a flaw — that\'s the whole reason you\'re worth choosing. It just means you need someone who can meet you there.',
        breakdownValidation: 'You\'re not too much. You\'re not needy. Wanting to be known is the most basic ask in a relationship — and asking for it isn\'t the problem. His capacity is.',
        breakdownEscalation: [
            'He changes the subject when you cry, get serious, or share something hard.',
            'Humor shows up every time depth gets near — a joke, a deflection, an exit.',
            'You start pre-editing what you share because you already know what will land and what won\'t.'
        ],
        breakdownTimeline: {
            twoWeeks: 'one small opening when you back off — then the wall again.',
            threeMonths: 'you stop sharing the hard things. The relationship shrinks to logistics and light.',
            oneYear: 'a year of feeling more alone inside it than you ever did outside it.'
        },
        breakdownScript: 'When I share something hard and you change the subject, I feel alone with it. Can you stay with me when it gets uncomfortable?',
        breakdownHealthy: 'In healthy: he stays when it gets heavy. He doesn\'t have to fix it — he just has to not leave the room emotionally.',
        name: 'The "Can\'t Reach Him" Loop',
        userOneLiner: 'No matter what you do, you can\'t get him to open up or meet you emotionally.',
        paywallDynamicShort: 'No matter what you do, you can\'t get him to open up or meet you emotionally.',
        dynamicLabelInternal: 'Emotional Unavailability / Distance Dynamic',
        description: 'You feel shut out. He stays surface-level. You try to get closer; he keeps a wall up.',
        hisPattern: 'Keeps it light. Changes the subject when things get heavy. Shuts down when you try to go deep.',
        herPattern: 'You reach for real conversation. You share what\'s actually going on — and feel shut out when he won\'t meet you there.',
        dynamic: 'You reach for closeness. He keeps a wall up. You keep trying.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'He keeps a wall up because emotional intimacy feels threatening. He may care—but he doesn\'t go deep. He shuts down when things get emotional. It\'s not about you. It\'s his pattern.',
        doesHeLikeMe: 'He may have feelings—but his capacity for emotional depth is limited. "Liking" someone and being able to meet them emotionally are different. His distance isn\'t a sign he doesn\'t care; it\'s a sign of his capacity. The real question: Can you live with the connection he\'s capable of offering?',
        whyItFeelsConfusing: 'When he does open up—even a little—it feels like a breakthrough. You think "if I just try harder, he\'ll let me in." You wonder if you\'re asking for too much. You\'re not. The distance is his pattern, not your failure. The confusion comes from trying to solve something that isn\'t yours to fix.',
        hisIdentityLines: [
            'Changes the subject when things get heavy.',
            'Cracks a joke or checks out when you try to go deep.',
            'Says "I\'m fine" when you both know he isn\'t.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'You try to go deeper → he shuts down',
                'You hold back → nothing improves',
                'You try again → hit the same wall'
            ],
            ['So the connection stays where it is—even though you want more.']
        ],
        resultModal: {
            loopBody: 'You go for closeness; he stays light or shuts down. You try again—same wall. You feel rejected for wanting normal intimacy, and the gap between you becomes the default.',
            costAfterLead: 'you carry the emotional work alone—and start wondering if you\'re "too much" for asking for depth.',
            futureAfterLead: 'you keep starving for connection while he stays comfortable behind the wall—and nothing shifts unless you stop compensating for it.',
            lcfMerged: 'You reach for closeness; he stays light or shuts down—and the gap becomes normal. You carry the emotional work alone and start to feel "too much" for wanting depth. If nothing shifts, you starve for connection while he stays comfortable behind the wall.',
            oneDecision: 'Decide whether you can live with the depth he offers—or whether you need a partner who meets you emotionally without you doing all the bridging.',
            oneAction: 'Try one small connection bid (not a lecture): a short check-in at a set time—and watch whether he can stay with it or shuts down.'
        }
    },
    'mixed-signals-loop': {
        id: 'mixed-signals-loop',
        breakdownVerdict: 'His words and his actions aren\'t confused — they\'re two different things. Actions are the truth; the words are the hook.',
        breakdownIfYouAct: [
            'you stop decoding him and start watching him',
            'you rebuild trust in your own read of the situation',
            'you get one clear pattern instead of a running list of contradictions'
        ],
        breakdownWatchForHim: 'Expect a grand statement, a promise, or a future-talk moment — with no follow-through on a calendar. That\'s the signal, not the content.',
        breakdownOrigin: 'You keep trying to reconcile his words with his actions because your brain is wired to make things make sense. It\'s not obsession — it\'s intelligence being used on the wrong problem.',
        breakdownValidation: 'You\'re not making it up. You\'re not overreacting. If his words and his actions matched, you wouldn\'t be confused — you\'d be settled. The confusion is the evidence.',
        breakdownEscalation: [
            'Future talk without follow-through — "when we…" / "we should…" — that never makes it onto a calendar.',
            'He introduces you to people once, then goes vague again when you ask about them.',
            'Affection is bigger than behavior — words warmer than plans, plans warmer than effort.'
        ],
        breakdownTimeline: {
            twoWeeks: 'one more grand statement, one more "prove I\'m here" moment — no behavioral change.',
            threeMonths: 'you keep a running list of contradictions in your head. He keeps a clean slate.',
            oneYear: 'a year of decoding someone who never actually moved.'
        },
        breakdownScript: 'I\'m not going to react to what you say anymore. I\'ll watch what you do. Show me.',
        breakdownHealthy: 'In healthy: words match actions on the same day. Not eventually — the same day.',
        name: 'The "Nothing Adds Up" Loop',
        userOneLiner: 'What he says and what he does don\'t match—and you\'re left trying to make sense of it.',
        paywallDynamicShort: 'What he says and what he does don\'t match—and you\'re left trying to make sense of it.',
        dynamicLabelInternal: 'Mixed Signals / Inconsistency Dynamic',
        description: 'His words and actions don\'t match. You\'re always second-guessing. You seek clarity but end up more confused.',
        hisPattern: 'Says "I want something serious" — then behaves like he doesn\'t. Promises, disappears, resurfaces.',
        herPattern: 'You replay what he said vs. what he did. You try to make it make sense — and end up more confused.',
        dynamic: 'His words say one thing. His actions say another. You\'re always interpreting.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'His words and his willingness don\'t align. He may believe what he says in the moment—but his behavior reveals his actual investment. Mixed signals aren\'t confusion; they\'re the pattern. He keeps you guessing because that keeps you invested without him showing up consistently.',
        doesHeLikeMe: 'When words and actions don\'t match, trust the actions. His behavior reveals his real investment. He may say he likes you or wants something serious—but if his actions don\'t back that up, the actions are the truth. The question: What is he willing to do?',
        whyItFeelsConfusing: 'You\'re trying to decode his words instead of trusting his actions. You replay conversations. You wonder what he meant. The confusion is the trap—it keeps you analyzing instead of deciding. You\'re not crazy. Inconsistency creates anxiety. The confusion is built into the pattern.',
        hisIdentityLines: [
            'Says "I want something serious" — then disappears for days.',
            'Makes promises he doesn\'t follow through on.',
            'Tells you you\'re special — then treats you like an option.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'He says one thing → does another',
                'You try to make sense of it → explain it away',
                'Something still feels off → so you keep thinking about it'
            ],
            ['You stay trying to figure it out—but it never fully adds up.']
        ],
        resultModal: {
            loopBody: 'His words promise; his actions hesitate. You replay, decode, and give the benefit of the doubt—then it happens again. The confusion isn\'t random; it keeps you invested without solid ground.',
            costAfterLead: 'you live in your head, second-guess your instincts, and feel crazy for noticing what doesn\'t line up.',
            futureAfterLead: 'you keep analyzing instead of deciding—and your trust in yourself is what erodes first.',
            lcfMerged: 'His words promise; his actions hesitate—you replay, decode, and doubt your instincts. That keeps you invested without solid ground. If you keep analyzing instead of deciding, your trust in yourself erodes first.',
            oneDecision: 'Decide whether you’re building a relationship from his words or from his behavior—because those are often two different futures.',
            oneAction: 'Same-day log, two lines: what he said he’d do vs. what he actually did—no storytelling, just events.'
        }
    },
    'one-sided-investment': {
        id: 'one-sided-investment',
        breakdownVerdict: 'The relationship isn\'t working — you\'re the one making it look like it is.',
        breakdownIfYouAct: [
            'you stop subsidizing a dynamic that only runs because of you',
            'you find out in one week whether he steps up or coasts',
            'you stop confusing your capacity with his commitment'
        ],
        breakdownWatchForHim: 'Expect quiet. When you stop carrying, many men don\'t step up — they stop noticing. That silence is the data.',
        breakdownOrigin: 'You carry because you\'re capable, and capable people get handed the weight. You learned early that if you don\'t hold it, it falls. That instinct is why you\'re good at life — and why this dynamic keeps running despite him.',
        breakdownValidation: 'You\'re not doing too much. You\'re doing the job of two people. He\'s not "bad at relationships" — he\'s letting you do his part, and calling it peace.',
        breakdownEscalation: [
            'You plan every date, trip, conversation, and repair.',
            'He forgets details you\'ve told him more than once.',
            'He only reaches out late — after work, after drinks, after his own things are handled.'
        ],
        breakdownTimeline: {
            twoWeeks: 'one week of quiet if you stop initiating — he won\'t step up, he\'ll coast.',
            threeMonths: 'you exhaust yourself and call it love. He calls it easy.',
            oneYear: 'a year spent running a relationship that only exists because you\'re running it.'
        },
        breakdownScript: 'I\'ve been doing the work of two people. I\'m going to stop carrying the relationship and see what happens. You can step in anytime.',
        breakdownHealthy: 'In healthy: initiation is roughly even across a month. Not identical — but you never feel like you\'re the reason it exists.',
        name: 'The "I\'m Carrying This" Loop',
        userOneLiner: 'You\'re doing most of the effort—and the relationship only works because of you.',
        paywallDynamicShort: 'You\'re doing most of the effort—and the relationship only works because of you.',
        dynamicLabelInternal: 'One-Sided Investment / Imbalance Dynamic',
        description: 'You\'re doing most of the work. He\'s comfortable with that. You overinvest; he takes more than he gives.',
        hisPattern: 'Waits for you to plan, initiate, and check in. Takes your effort without matching it — and stays comfortable there.',
        herPattern: 'You carry it. You plan, text first, smooth things over — and hope the effort finally gets returned.',
        dynamic: 'You\'re the one keeping this alive. He\'s comfortable with that.',
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
        freeModalWhatItMeans: '',
        freeResultCopy: RELATIONSHIP_FREE_RESULT_COPY,
        whyHeActsThisWay: 'He takes more than he gives because you allow it. He\'s comfortable with the imbalance—no incentive to change when you\'re carrying the relationship. He may care, but he\'s not matching your effort. That\'s a choice.',
        doesHeLikeMe: 'He may care—but his behavior suggests he\'s comfortable receiving more than he gives. "Liking" someone shows up in effort: who initiates, who plans, who invests. If you\'re doing most of the work, his investment doesn\'t match yours. The question: Is he willing to show up the way I need?',
        whyItFeelsConfusing: 'Your effort feels like love. You believe that if you give more, he\'ll match it. The relationship feels like work—and you wonder if that\'s normal. You\'re not crazy for wanting reciprocity. The imbalance is the pattern. The confusion comes from hoping he\'ll change when he hasn\'t shown that he will.',
        hisIdentityLines: [
            'Waits for you to plan, initiate, check in — every time.',
            'Shows up when it\'s easy; goes quiet when it takes effort.',
            'Takes your energy without matching it — and stays comfortable there.'
        ],
        whyKeepsHappeningBlocks: [
            [
                'You put in more → to keep it going',
                'He gives less → but doesn\'t lose you',
                'You keep compensating → hoping he steps up'
            ],
            ['So the relationship works—but only because you\'re holding it together.']
        ],
        resultModal: {
            loopBody: 'You initiate, plan, fix, and invest. He shows up when it\'s easy. You hope effort will be matched—it isn\'t. The relationship only "works" because you\'re carrying it.',
            costAfterLead: 'you get depleted, and your generosity gets mistaken for proof he\'s committed when he\'s mostly receiving.',
            futureAfterLead: 'you keep overgiving until you break—or until you stop, and discover how little he was putting in all along.',
            lcfMerged: 'You initiate, plan, and invest; he shows up when it\'s easy. You get depleted—and your effort gets mistaken for proof he\'s all in when he\'s mostly receiving. If nothing changes, you overgive until you break—or stop and finally see how little he was putting in.',
            oneDecision: 'Decide whether you’ll keep overgiving—or temporarily match effort and see what the relationship actually is without you carrying it.',
            oneAction: 'For one week, initiate only as much as he initiates; don’t rescue, don’t compensate—observe what’s left between you.'
        }
    }
};

// Her Response Patterns (Secondary Result)
window.herResponsePatterns = {
    'reassurance-seeker': {
        name: 'The One Who Needs to Feel Sure',
        patternLabelInternal: 'Reassurance-Seeking Pattern',
        description: 'You look for consistency and clarity—but don\'t always get it.',
        identityLines: [
            'You check your phone for a reply you know isn\'t coming yet.',
            'You re-read his last message, trying to read his tone.',
            'You reach out when he goes quiet — hoping he\'ll prove he still cares.'
        ]
    },
    'space-giver': {
        name: 'The One Who Backs Off to Keep It',
        patternLabelInternal: 'Space-Giving / Self-Abandonment Pattern',
        description: 'You give space and adjust—hoping it will make things work.',
        identityLines: [
            'You rewrite your messages to sound shorter, softer, less "needy."',
            'You wait him out when he goes quiet — even when it\'s killing you.',
            'You talk yourself out of reaching first, over and over.'
        ]
    },
    'direct-communicator': {
        name: 'The One Who Says It Straight',
        patternLabelInternal: 'Direct Communication Pattern',
        description: 'You communicate clearly—but don\'t always get the same back.',
        identityLines: [
            'You tell him clearly what you need — in plain words.',
            'You ask the hard questions instead of hinting at them.',
            'You repeat yourself when he deflects — and wonder if you\'re the problem.'
        ]
    },
    'hopeful-waiter': {
        name: 'The One Who Hopes It\'ll Change',
        patternLabelInternal: 'Hope / Waiting Pattern',
        description: 'You stay because you believe it can become what you want.',
        identityLines: [
            'You give it one more month, then one more, then one more.',
            'You keep finding reasons this time could be different.',
            'You stay in "almost" because leaving feels like giving up too soon.'
        ]
    },
    'protector': {
        name: 'The One Who Pulls Back First',
        patternLabelInternal: 'Self-Protection / Avoidance Pattern',
        description: 'You shut down first so you don\'t get hurt or rejected.',
        identityLines: [
            'You go cold first so he can\'t go cold on you.',
            'You stop reaching out the second you feel the shift.',
            'You tell yourself you don\'t care — while still checking his last seen.'
        ]
    },
    'balanced': {
        name: 'The One Who Sees It Clearly',
        patternLabelInternal: 'Self-Awareness / Balanced Pattern',
        description: 'You recognize what\'s happening—you just haven\'t acted on it yet.',
        identityLines: [
            'You can see the pattern — you\'re just not sure what to do with what you see.',
            'You try to stay steady instead of reacting to every shift.',
            'You know something\'s off, and you\'re tired of talking yourself out of it.'
        ]
    }
};

// Future projection + legacy repetition (modal bridging copy)
window.repetitionInsights = {
    'same-type': 'You tend to end up in dynamics where you want more than you\'re getting.',
    'same-ending': 'Your relationships often end in the same kind of confusion.',
    'same-confusion': 'You often choose people who keep you guessing.',
    'different': 'You\'ve had different kinds of relationships—this one stands out.',
    'first-time': 'This feels new to you—or you\'re seeing what\'s been going on more clearly for the first time.',
    'still-unclear': 'If nothing changes, you already sense you\'d still be in the same ambiguity—and waiting is its own cost.',
    'fade-apart': 'Part of you sees this fading. Naming that is uncomfortable—and it\'s what makes the next step hard to avoid.',
    'still-waiting': 'You\'re bracing for more waiting. That usually means your gut knows the pattern hasn\'t shifted.',
    'might-improve': 'You want to believe it could improve without a clear sign—that hope is often what keeps people in the loop longest.',
    'avoid-thinking': 'Not wanting to look ahead is data. It usually means you already feel the stakes.',
    'fade-confused': 'If it ends messy, part of you already dreads not knowing what this even was—and that uncertainty keeps you hooked now.',
    'going-nowhere': 'When deep down you don\'t see it going anywhere, staying is often conflict with what you already sense.'
};

// Situationship Dynamic - sub-pattern modifier (applied when undefined relationship + months without clarity)
window.situationshipModifier = {
    name: 'Situationship Dynamic',
    tagline: 'Undefined relationship · Months without clarity',
    description: 'Your pattern is amplified by the situationship context—undefined status combined with extended ambiguity.'
};

// Keep archetypeCategories for backward compatibility (map to relationship pattern)
window.archetypeCategories = {
    'hot-cold-cycle': { name: 'The "Hot Then Cold" Loop', description: 'He shows up strong—then pulls away.', symbol: '🔄' },
    'breadcrumb-dynamic': { name: 'The "Just Enough" Loop', description: 'Just enough to stay, never enough to feel secure.', symbol: '🍞' },
    'commitment-avoidance': { name: 'The "Almost" Loop', description: 'Close to something real—never quite there.', symbol: '❓' },
    'emotional-distance': { name: 'The "Can\'t Reach Him" Loop', description: 'You can\'t get him to open up emotionally.', symbol: '🧊' },
    'mixed-signals-loop': { name: 'The "Nothing Adds Up" Loop', description: 'What he says and what he does don\'t match.', symbol: '〰️' },
    'one-sided-investment': { name: 'The "I\'m Carrying This" Loop', description: 'You\'re carrying most of the effort.', symbol: '⚖️' }
};

// Map relationship patterns to personalityPatterns for backward compatibility with results-modal
window.personalityPatterns = {};
Object.keys(window.relationshipPatterns || {}).forEach(key => {
    const rp = window.relationshipPatterns[key];
    window.personalityPatterns[key] = {
        name: rp.name,
        userOneLiner: rp.userOneLiner,
        dynamicLabel: rp.userOneLiner,
        dynamicLabelInternal: rp.dynamicLabelInternal,
        paywallDynamicShort: rp.paywallDynamicShort,
        archetypeCategory: rp.name,
        driver: 'relationship-dynamic',
        rootEmotion: 'Clarity',
        coreBelief: rp.coreBelief,
        strength: rp.strengths,
        shadow: rp.watchFor,
        resetFocus: rp.nextStep,
        identity: rp.description,
        cta: 'Want clarity about your specific situation? Submit your relationship story for a personalized analysis.',
        freeResultCopy: rp.freeResultCopy,
        freeModalWhatItMeans: rp.freeModalWhatItMeans,
        resultModal: rp.resultModal,
        hisIdentityLines: rp.hisIdentityLines
    };
});

// Quiz success modal: one-line summary + article for dynamic name
window.patternResultHelpers = {
    escapeQuizHtml: function (s) {
        if (s == null || s === '') return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },
    /**
     * Quiz success snapshot: Relationship dynamic only. "How you're showing up inside it"
     * block intentionally removed — her pattern name was internal-facing jargon that
     * confused the audience. Her behavior is now folded into the "You" column of
     * the identity row ("scenes" format) directly below this summary.
     */
    buildSummaryHTML: function (herPatternDisplayName, relationshipLoopDisplayName) {
        const esc = this.escapeQuizHtml.bind(this);
        const loopName = (relationshipLoopDisplayName || '').trim();
        if (!loopName) return '';
        let html = '<div class="quiz-success-happening" role="region" aria-label="Your relationship dynamic">';
        html += '<div class="quiz-success-happening__block">';
        html += '<span class="quiz-success-happening__kicker">The dynamic</span>';
        html += `<p class="quiz-success-happening__loop">${esc(loopName)}</p>`;
        html += '</div>';
        html += '</div>';
        return html;
    },
    /** @returns {string[]} Up to 3 short lines: what it feels/looks like now (symptoms/outcomes), mirrored to quiz signals. */
    _quizOpt: function (quizData, answers, idx) {
        if (!quizData || !quizData[idx] || !quizData[idx].options || answers[idx] === undefined) return null;
        return quizData[idx].options[answers[idx]] || null;
    },
    /**
     * Quiz success "WHAT'S ACTUALLY HAPPENING": per-pattern + per-answer personalization
     * via buildMeansBullets below. Previously rendered a generic 3-line copy for every
     * user which collapsed the "you've been seen" moment that drives paywall conversion.
     * Falls back to generic copy only when pattern cannot be resolved (e.g. personality quiz).
     */
    buildWhyKeepsHappeningHTML: function (pattern, ctx) {
        var esc = this.escapeQuizHtml.bind(this);
        ctx = ctx || {};
        var patternKey = (pattern && (pattern.id || pattern.key || pattern.patternKey)) ||
            ctx.patternKey ||
            (typeof window !== 'undefined' && window.quizPatternKey) ||
            '';
        var lines = [];
        if (patternKey && typeof this.buildMeansBullets === 'function') {
            try {
                lines = this.buildMeansBullets(patternKey, ctx) || [];
            } catch (e) {
                lines = [];
            }
        }
        if (!lines || !lines.length) {
            lines = [
                'You get close to clarity \u2192 he pulls it back',
                'You wait for "later" \u2192 nothing actually moves'
            ];
        }
        // Diagnostic-only section now: conversion bridge moved UP to the epilogue
        // hook (where "man's read from the outside" lands harder before the CTA).
        // This keeps WHAT'S ACTUALLY HAPPENING focused on mechanism, not sales.
        var topLines = lines.slice(0, 2);
        var html = '<div class="quiz-success-means-why">';
        html += '<ul class="quiz-success-means-bullets" role="list">';
        for (var i = 0; i < topLines.length; i++) {
            if (!topLines[i]) continue;
            html += '<li>' + esc(topLines[i]) + '</li>';
        }
        html += '</ul>';
        html += '</div>';
        return html;
    },
    /*
     * V2 means-bullets — rewritten for conversion.
     * Goal: move from describing what she feels (she already knows) to naming the
     * mechanism and the hidden cost. Each pattern gets 2 bullets that:
     *   [0] Name what HE is actually doing and why it keeps working on her.
     *   [1] Name the cost she hasn't fully clocked — how staying is shaping her.
     * Conditional overrides sharpen bullets based on her quiz answers (pain/fear/her).
     */
    buildMeansBullets: function (patternKey, ctx) {
        var answers = (ctx && ctx.answers) || [];
        var her = (ctx && ctx.herResponseKey) || 'balanced';
        var rs = (ctx && ctx.relationshipStatus) || '';
        var pain = (ctx && ctx.currentPain) || '';
        var fear = (ctx && ctx.biggestFear) || '';
        var a = ['', ''];

        if (patternKey === 'hot-cold-cycle') {
            a = [
                'He pulls away, you wait, he comes back warm \u2014 and the relief is what keeps you hooked. That\u2019s not love. That\u2019s intermittent reinforcement.',
                'Calm now feels boring. Him pulling back feels normal. Your nervous system has started calling chaos "chemistry."'
            ];
            if (pain === 'he-went-cold' || fear === 'losing-his-interest') {
                a[0] = 'He pulls back right when things feel close \u2014 and you\u2019ve learned to wait for the next warm stretch instead of asking why they keep ending.';
            }
            if (her === 'reassurance-seeker') {
                a[1] = 'When he goes cold, you chase proof he\u2019s still there. Every reply lands like relief \u2014 and relief is now the feeling you\u2019re calling love.';
            } else if (her === 'space-giver') {
                a[1] = 'You go quiet so you don\u2019t seem "too much" \u2014 but the anxiety doesn\u2019t leave. It just waits for him to come back.';
            } else if (her === 'protector') {
                a[1] = 'You pull back first to feel in control \u2014 but you\u2019re still tracking him. That\u2019s not distance. That\u2019s self-protection from the same loop.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        if (patternKey === 'breadcrumb-dynamic') {
            a = [
                'He\u2019s giving you just enough to keep you here. Not enough to feel secure. That gap is the whole strategy.',
                'You\u2019ve started calling "not much" "something." That\u2019s what breadcrumbing does \u2014 it shrinks what you\u2019ll accept without you noticing.'
            ];
            if (pain === 'keeping-me-option') {
                a[0] = 'He\u2019s keeping you on rotation \u2014 enough contact to stay in your head, not enough to make you his priority. That\u2019s not confusion. That\u2019s design.';
            }
            if (pain === 'not-enough' || fear === 'not-enough' || fear === 'im-the-problem') {
                a[1] = 'You\u2019ve started asking what\u2019s wrong with you instead of what\u2019s wrong with this \u2014 which is exactly what keeps you working harder for less.';
            }
            if (her === 'reassurance-seeker') {
                a[1] = 'Every small crumb lands like a sign this is turning real. It isn\u2019t turning real \u2014 you\u2019re being conditioned to need less.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        if (patternKey === 'commitment-avoidance') {
            a = [
                'He avoids defining this on purpose. Ambiguity is what lets him have you without having to choose you.',
                'Every "let\u2019s see where it goes" buys him more time. Your clock is the one running out \u2014 not his.'
            ];
            if (rs === 'situationship' || pain === 'situationship') {
                a[0] = 'You\u2019re in a situationship because he needs you to be. A title would force a decision he doesn\u2019t want to make.';
            }
            if (fear === 'him-never-committing') {
                a[1] = 'You already sense he won\u2019t commit \u2014 you\u2019re staying in case you\u2019re wrong. That hope is the thing costing you the most time.';
            }
            if (fear === 'losing-time') {
                a[1] = 'Your life is moving. His version of "us" isn\u2019t. Every month of patience is a month you\u2019re subsidizing his indecision.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        if (patternKey === 'emotional-distance') {
            a = [
                'He\u2019s physically here and emotionally checked out. You\u2019re running the relationship on the hope he\u2019ll show up \u2014 he won\u2019t, not without being asked, and usually not even then.',
                'You\u2019re shrinking yourself to match what he can give \u2014 and calling it "not being needy." That\u2019s not maturity. That\u2019s disappearing.'
            ];
            if (fear === 'emotionally-neglected') {
                a[0] = 'He\u2019s physically in the relationship and emotionally not \u2014 and you\u2019re carrying the weight of connection alone while calling it a partnership.';
            }
            if (pain === 'feel-invisible' || fear === 'becoming-invisible') {
                a[1] = 'You\u2019ve started asking for less so you don\u2019t seem "too much" \u2014 and disappearing inside the relationship to keep it peaceful.';
            }
            if (her === 'direct-communicator') {
                a[1] = 'You\u2019ve told him what you need, clearly. He\u2019s heard you and still isn\u2019t meeting it. That\u2019s not a communication problem \u2014 that\u2019s his answer.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        if (patternKey === 'mixed-signals-loop') {
            a = [
                'He\u2019s saying one thing and doing another \u2014 and the words are the part that keeps you invested. That gap isn\u2019t a glitch. That\u2019s the whole message.',
                'You\u2019ve started doubting your own read because his version keeps rewriting yours. That\u2019s how you lose yourself inside a situation like this.'
            ];
            if (fear === 'im-the-problem') {
                a[1] = 'You\u2019re defaulting to "maybe I\u2019m the problem" because the math doesn\u2019t add up any other way. It adds up \u2014 once you stop weighing his words heavier than his actions.';
            }
            if (pain === 'ignore-red-flags') {
                a[0] = 'You\u2019ve been smoothing over signals that already told you what this is. The mismatch isn\u2019t subtle anymore \u2014 it\u2019s survived months of you explaining it away.';
            }
            if (fear === 'losing-time') {
                a[1] = 'You\u2019re spending weeks decoding him instead of deciding what you need. The decoding is the trap.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        if (patternKey === 'one-sided-investment') {
            a = [
                'You\u2019re the one keeping this alive \u2014 and he\u2019s calibrated to exactly that. The imbalance isn\u2019t a phase. It\u2019s the dynamic.',
                'What you\u2019re getting back isn\u2019t love. It\u2019s the relief of him not pulling away \u2014 and that relief is what you keep mistaking for the real thing.'
            ];
            if (pain === 'tolerate-less' || pain === 'stay-when-shouldnt') {
                a[1] = 'You said you\u2019re tolerating less than you want. The reason it keeps working for him is that tolerating it is still cheaper for you than facing the alternative \u2014 for now.';
            }
            if (fear === 'losing-time') {
                a[1] = 'Your time, your effort, your emotional labor \u2014 going out. Matching effort \u2014 not coming back. That\u2019s not a slow season. That\u2019s the shape of this.';
            }
            if (pain === 'not-enough' || fear === 'not-enough') {
                a[1] = 'You\u2019re trying to earn closeness that should be given. The harder you work, the more the imbalance normalizes.';
            }
            if (her === 'reassurance-seeker') {
                a[1] = 'You overgive hoping he\u2019ll finally match it. He won\u2019t \u2014 he doesn\u2019t have to. You\u2019ve already closed the gap for him.';
            }
            return a.filter(Boolean).slice(0, 2);
        }
        return [];
    }
};

// Quiz Questions — v6.0: Q1–Q8 (indices 0–7) in scoring loop; Q9–Q10 (8–9) decision + desire (score 0)
window.quizData = [
    {
        question: 'How predictable does he feel to you?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'I know where I stand', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'stable-read', answerKey: 'know_where_i_stand' },
            { text: 'It changes, but I try to make sense of it', score: SCORE.MODERATE, dimension: 'his-behavior', subDimension: 'mixed-signals', answerKey: 'changes_trying_to_make_sense' },
            { text: 'It depends on him—I can\'t rely on it', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold', answerKey: 'depends_on_him_cant_rely' },
            { text: 'I honestly don\'t feel clear at all', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'mixed-signals', answerKey: 'dont_feel_clear_at_all' }
        ]
    },
    {
        question: 'What\'s hitting you hardest right now?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'I don\'t know where I stand', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'commitment-avoidance', painKey: 'situationship', answerKey: 'dont_know_where_i_stand' },
            { text: 'What he says and what he does don\'t line up', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'mixed-signals-loop', painKey: 'he-went-cold', answerKey: 'his_words_and_actions_dont_match' },
            { text: 'I feel like I care more than he does', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment', painKey: 'not-enough', answerKey: 'i_care_more_than_he_does' },
            { text: 'I replay what happened — over and over', score: SCORE.MODERATE, dimension: 'dynamic', subDimension: 'hot-cold-cycle', painKey: 'he-went-cold', answerKey: 'replay_what_happened' },
            { text: 'I know something\'s wrong — I haven\'t acted on it yet', score: SCORE.MODERATE, dimension: 'dynamic', subDimension: 'commitment-avoidance', painKey: 'stay-when-shouldnt', answerKey: 'something_wrong_not_acted' }
        ]
    },
    {
        question: 'When something feels off, what usually happens?',
        domain: 'HIS_BEHAVIOR',
        dimension: 'his-behavior',
        options: [
            { text: 'We talk it through', score: SCORE.NONE, dimension: 'his-behavior', subDimension: 'open', answerKey: 'we_talk_it_through' },
            { text: 'It gets brushed off', score: SCORE.MODERATE, dimension: 'his-behavior', subDimension: 'avoidant', answerKey: 'gets_brushed_off' },
            { text: 'He pulls away', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'hot-cold', answerKey: 'he_pulls_away' },
            { text: 'He shuts down or gets defensive', score: SCORE.STRONG, dimension: 'his-behavior', subDimension: 'emotional-distance', answerKey: 'he_shuts_down_defensive' }
        ]
    },
    {
        question: 'Who\'s really keeping this going?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'Both of us', score: SCORE.NONE, dimension: 'dynamic', subDimension: 'balanced', answerKey: 'both_of_us' },
            { text: 'Mostly me', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment', answerKey: 'mostly_me' },
            { text: 'Me—until I pull back', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'breadcrumb-dynamic', answerKey: 'me_until_i_pull_back' },
            { text: 'Him—but it doesn\'t last', score: SCORE.MODERATE, dimension: 'dynamic', subDimension: 'hot-cold-cycle', answerKey: 'him_but_doesnt_last' }
        ]
    },
    {
        question: 'After you talk to him, how do you feel?',
        domain: 'EMOTIONAL_STATE',
        dimension: 'emotional-state',
        options: [
            { text: 'Calm', score: SCORE.NONE, dimension: 'emotional-state', subDimension: 'balanced', answerKey: 'calm_after_talk' },
            { text: 'Slightly off', score: SCORE.MILD, dimension: 'emotional-state', subDimension: 'breadcrumb-dynamic', answerKey: 'slightly_off_after_talk' },
            { text: 'Overthinking everything', score: SCORE.STRONG, dimension: 'emotional-state', subDimension: 'hot-cold-cycle', answerKey: 'overthinking_everything' },
            { text: 'Drained or anxious', score: SCORE.STRONG, dimension: 'emotional-state', subDimension: 'one-sided-investment', answerKey: 'drained_or_anxious' }
        ]
    },
    {
        question: 'Which sounds closest to what\'s actually happening between you two?',
        domain: 'DYNAMIC',
        dimension: 'dynamic',
        options: [
            { text: 'We get close, then he pulls away, then comes back again', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'hot-cold-cycle', answerKey: 'close_then_pulls_away_returns' },
            { text: 'He gives just enough to keep me in it, but not enough to feel secure', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'breadcrumb-dynamic', answerKey: 'just_enough_not_secure' },
            { text: 'We never clearly define what this is', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'commitment-avoidance', answerKey: 'never_define_what_this_is' },
            { text: 'His words and his actions don\'t match', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'mixed-signals-loop', answerKey: 'words_and_actions_dont_match' },
            { text: 'I\'m the one doing most of the reaching, planning, and emotional work', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'one-sided-investment', answerKey: 'i_do_most_emotional_work' },
            { text: 'I try to connect deeper, but he stays guarded or shuts down', score: SCORE.STRONG, dimension: 'dynamic', subDimension: 'emotional-distance', answerKey: 'i_reach_he_stays_guarded' }
        ]
    },
    {
        question: 'When tension hits between you, what\'s your first move?',
        domain: 'HER_RESPONSE',
        dimension: 'her-response',
        options: [
            { text: 'I reach out for reassurance', score: 6, dimension: 'her-response', subDimension: 'reassurance-seeker', answerKey: 'reach_out_reassurance' },
            { text: 'I go quiet or give space', score: 4, dimension: 'her-response', subDimension: 'space-giver', answerKey: 'go_quiet_give_space' },
            { text: 'I ask directly', score: 2, dimension: 'her-response', subDimension: 'direct-communicator', answerKey: 'ask_directly' },
            { text: 'I pull back or shut down', score: 6, dimension: 'her-response', subDimension: 'protector', answerKey: 'pull_back_or_shut_down' }
        ]
    },
    {
        question: 'If nothing changes, where do you honestly see this going?',
        domain: 'FUTURE',
        dimension: 'future',
        options: [
            { text: 'We\'ll still be stuck in this same place', score: 0, value: 'still-unclear', answerKey: 'still_stuck_same_place' },
            { text: 'I\'ll still be waiting for it to become what I want', score: 0, value: 'still-waiting', answerKey: 'still_waiting_becomes_what_i_want' },
            { text: 'It\'ll fade—and I\'ll be left confused about what this was', score: 0, value: 'fade-confused', answerKey: 'fade_left_confused' },
            { text: 'Deep down, I don\'t think it\'s going anywhere', score: 0, value: 'going-nowhere', answerKey: 'not_going_anywhere' },
            { text: 'I try not to think about it because I already know', score: 0, value: 'avoid-thinking', answerKey: 'avoid_thinking_already_know' }
        ]
    },
    {
        question: 'What\'s stopping you from making a clear decision right now?',
        domain: 'DECISION',
        dimension: 'decision',
        options: [
            { text: 'I don\'t trust my read of the situation', score: 0, fearKey: 'im-the-problem', answerKey: 'dont_trust_my_read' },
            { text: 'I don\'t want to lose him', score: 0, fearKey: 'losing-his-interest', answerKey: 'dont_want_to_lose_him' },
            { text: 'I keep hoping it\'ll change', score: 0, fearKey: 'him-never-committing', answerKey: 'keep_hoping_it_will_change' },
            { text: 'I don\'t have enough clarity', score: 0, fearKey: 'losing-time', answerKey: 'not_enough_clarity' },
            { text: 'I\'m afraid I\'ll regret it', score: 0, fearKey: 'hurt-again', answerKey: 'afraid_ill_regret_it' }
        ]
    },
    {
        question: 'If you could have one thing today…',
        domain: 'DESIRE',
        dimension: 'desire',
        options: [
            { text: 'A clear answer I can trust', score: 0, desireKey: 'clear_answer', answerKey: 'clear_answer' },
            { text: 'For my mind to finally quiet down', score: 0, desireKey: 'mind_to_quiet', answerKey: 'mind_to_quiet' },
            { text: 'To walk away without second-guessing myself', score: 0, desireKey: 'walk_away_without_second_guessing', answerKey: 'walk_away_without_second_guessing' },
            { text: 'To feel like myself again', score: 0, desireKey: 'feel_like_myself_again', answerKey: 'feel_like_myself_again' }
        ]
    }
];
