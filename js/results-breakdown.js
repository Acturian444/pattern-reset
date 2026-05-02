// Pattern Reset — Relationship Dynamic $19 breakdown renderer.
// Scope: only the paid in-modal read.
// Data contract: matches what js/results-modal.js passes to ResultsBreakdown.render.
(function () {
    'use strict';

    function esc(v) {
        if (v == null) return '';
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function firstSentence(txt) {
        if (!txt) return '';
        var m = String(txt).match(/^([^.!?]*[.!?])/);
        return m ? m[1].trim() : String(txt).trim();
    }

    function normKey(s) { return (s || '').toLowerCase().replace(/\s+/g, '-'); }

    function answerText(quizData, answers, idx) {
        if (!quizData || !quizData[idx] || !quizData[idx].options || answers[idx] === undefined) return null;
        var opt = quizData[idx].options[answers[idx]];
        return (opt && opt.text) ? opt.text : null;
    }

    // Label-ify the emotional-compat output so it reads human, not clinical.
    function humanizeEmotLabel(raw) {
        if (!raw) return '';
        var txt = String(raw).trim();
        // Lowercase only if it's a TYPED_TAG; otherwise keep.
        if (/^[A-Z0-9 _-]+$/.test(txt)) txt = txt.toLowerCase();
        return txt;
    }

    var PAIN_LABELS = {
        'same-type': 'attracting emotionally unavailable men',
        'stay-when-shouldnt': 'staying when you know you shouldn\u2019t',
        'sabotage': 'sabotaging when it gets serious',
        'tolerate-less': 'tolerating less than you deserve',
        'ignore-red-flags': 'ignoring red flags',
        'situationship': 'a situationship that won\u2019t progress',
        'cheated-betrayed': 'recovering from betrayal',
        'dont-know-why': 'not understanding why this keeps happening',
        'he-went-cold': 'him going cold',
        'keeping-me-option': 'him keeping you as an option',
        'not-enough': 'feeling like you\u2019re not enough for him',
        'feel-invisible': 'feeling invisible in the relationship'
    };
    var FEAR_LABELS = {
        'abandoned': 'being abandoned',
        'rejected': 'being rejected',
        'alone-forever': 'being alone long-term',
        'losing-myself': 'losing yourself',
        'hurt-again': 'being hurt again',
        'emotionally-neglected': 'being emotionally neglected',
        'im-the-problem': 'that you\u2019re the problem',
        'never-find-right': 'that you\u2019ll never find the right person',
        'losing-his-interest': 'losing his interest',
        'not-enough': 'not being enough for him',
        'losing-time': 'wasting your time',
        'losing-him-to-other': 'losing him to someone else',
        'becoming-invisible': 'becoming invisible',
        'him-never-committing': 'him never committing'
    };

    var CORE_ANSWER_BY_FEAR = {
        'losing-time': 'You\u2019re not wasting time because you\u2019re wrong. You\u2019re wasting time because you\u2019re waiting for clarity he won\u2019t give.',
        'him-never-committing': 'He isn\u2019t confused about commitment. He\u2019s avoiding it and calling it patience.',
        'losing-his-interest': 'His interest isn\u2019t slipping. His pattern is finishing the loop.',
        'not-enough': 'Enough isn\u2019t a number. He\u2019s showing you his ceiling \u2014 not your worth.',
        'losing-him-to-other': 'Someone else isn\u2019t the problem. Him not choosing you now is.',
        'abandoned': 'The fear of being abandoned is why you wait. Waiting is a slower version of being abandoned.',
        'rejected': 'Being rejected once hurts. Being partially chosen on repeat costs more.',
        'alone-forever': 'Being alone isn\u2019t the worst outcome. Being partnered and unseen is.',
        'hurt-again': 'You\u2019re not avoiding hurt. You\u2019re delaying it and paying interest.',
        'emotionally-neglected': 'You\u2019re not asking for too much. He\u2019s offering surface and you\u2019ve been calling it connection.',
        'im-the-problem': 'You\u2019re not the problem. You\u2019re the variable you can actually change.',
        'never-find-right': 'You\u2019re not running out of time. You\u2019re running out of patience for the wrong dynamic \u2014 that\u2019s good.',
        'becoming-invisible': 'The invisibility is the dynamic \u2014 not you.'
    };
    var CORE_ANSWER_BY_PAIN = {
        'situationship': 'You\u2019re not stuck because you\u2019re missing something. You\u2019re stuck because he\u2019s choosing undefined.',
        'stay-when-shouldnt': 'You\u2019re not weak for staying. Staying feels safer than uncertainty \u2014 it isn\u2019t.',
        'sabotage': 'You\u2019re not broken. Your nervous system is running a strategy that stopped serving you.',
        'tolerate-less': 'You\u2019re not accepting less because it\u2019s all you\u2019re worth. You\u2019re accepting less because the alternative feels lonelier.',
        'ignore-red-flags': 'You\u2019re not blind. You\u2019re invested. Your brain is minimizing what hurts to protect the investment.',
        'he-went-cold': 'He didn\u2019t go cold because you did something. He went cold because the pattern required it.',
        'keeping-me-option': 'You already know. He\u2019s not confused \u2014 he\u2019s comfortable.',
        'not-enough': 'The question isn\u2019t whether you\u2019re enough. His behavior is the answer \u2014 not your worth.',
        'feel-invisible': 'You\u2019re not invisible. You\u2019re in a dynamic where being seen is optional for him.',
        'same-type': 'You\u2019re not attracting it. You\u2019re tolerating it. That\u2019s the part that actually changes.',
        'cheated-betrayed': 'Trust wasn\u2019t what was broken. Reality was. That\u2019s what you\u2019re rebuilding.',
        'dont-know-why': 'It\u2019s not random. The pattern is the mechanism \u2014 and you\u2019re part of it in a way you can change.'
    };

    function pickCoreAnswer(pain, fear) {
        return CORE_ANSWER_BY_FEAR[normKey(fear)] || CORE_ANSWER_BY_PAIN[normKey(pain)] || '';
    }

    // Prioritized Q&A. Pain/fear-keyed items first; universals fill in. Hard cap 6.
    function buildQuestions(pattern, pain, fear, relationshipStatus) {
        var pk = normKey(pain);
        var fk = normKey(fear);
        var items = [];

        if (pk === 'cheated-betrayed' || pk === 'keeping-me-option' || fk === 'losing-him-to-other') {
            items.push({
                q: 'Is he seeing someone else?',
                a: 'Trust the pattern more than the denials. If his attention goes quiet at predictable times, his phone habits have shifted, his explanations got thinner \u2014 you don\u2019t need proof to know what you already know. Your job isn\u2019t to catch him. It\u2019s to decide what you\u2019ll accept either way.'
            });
        }
        if (pk === 'situationship' || relationshipStatus === 'situationship') {
            items.push({
                q: 'Why won\u2019t this situationship progress?',
                a: 'Situationships keep you guessing by design. Occasional clarity feels like progress \u2014 it\u2019s the next crumb. If he wanted to define it, he would have by now. What he\u2019s showing you is the ceiling, not the starting line.'
            });
        }
        if (fk === 'him-never-committing' || pk === 'keeping-me-option') {
            items.push({
                q: 'Will he ever commit?',
                a: 'If he wanted to commit, he\u2019d be moving toward it \u2014 not managing your expectations. Vague is a choice. Treat it like the answer.'
            });
        }
        if (pk === 'same-type' || pk === 'dont-know-why' || pk === 'stay-when-shouldnt') {
            items.push({
                q: 'How do I stop attracting this?',
                a: 'You don\u2019t stop attracting them. You stop staying when you recognize them. The attraction isn\u2019t the problem \u2014 the tolerating is. That\u2019s the part you can change in a week.'
            });
        }
        if (fk === 'losing-his-interest' || pk === 'he-went-cold') {
            items.push({
                q: 'Why did he go cold?',
                a: 'His cold phase isn\u2019t a verdict on you \u2014 it\u2019s the part of the loop that resets it. Stop measuring your worth by his weather.'
            });
        }
        if (fk === 'losing-time') {
            items.push({
                q: 'Am I wasting my time?',
                a: 'If you\u2019re asking, you already know. The real cost isn\u2019t the relationship \u2014 it\u2019s the years spent waiting for a shift that hasn\u2019t come.'
            });
        }
        if (fk === 'not-enough' || pk === 'not-enough') {
            items.push({
                q: 'Am I enough for him?',
                a: 'Enough isn\u2019t a slider he moves up. His behavior is showing his ceiling \u2014 not your worth.'
            });
        }
        if (fk === 'im-the-problem') {
            items.push({
                q: 'Am I the problem?',
                a: 'You\u2019re not the problem. You\u2019re the variable you can actually change \u2014 that\u2019s different. Your pattern is a survival move that stopped paying off.'
            });
        }

        // Universals (always considered, drop if cap hit).
        items.push({
            q: 'Can he change?',
            a: 'Yes \u2014 but only when staying costs him more than changing. Until the pressure shifts, he won\u2019t. That\u2019s not cynical; it\u2019s how change works.'
        });
        items.push({
            q: 'Should I confront him?',
            a: 'Confrontation is for information, not persuasion. Ask one clear question, one time. His answer \u2014 or his silence \u2014 is the data. You don\u2019t need to argue him into it.'
        });
        items.push({
            q: 'Does he actually like me?',
            a: pattern.doesHeLikeMe || 'Liking someone and showing up for them are two different things. His behavior is the answer \u2014 not his words.'
        });
        items.push({
            q: 'Should I leave?',
            a: 'The question isn\u2019t "should I leave?" \u2014 it\u2019s "what am I willing to accept?" Give it 2 weeks. If nothing shifts, leaving is already the decision you\u2019ve made.'
        });

        var seen = {};
        var out = [];
        for (var i = 0; i < items.length; i++) {
            if (seen[items[i].q]) continue;
            seen[items[i].q] = 1;
            out.push(items[i]);
            if (out.length >= 6) break;
        }
        return out;
    }

    function render(container, data) {
        if (!container) return;
        var pattern = data && data.pattern;
        if (!pattern) {
            container.innerHTML = '<div class="pr-break pr-break--error"><p>Pattern data missing. Please retake the quiz.</p></div>';
            return;
        }

        var firstName = ((data.firstName || '') + '').trim() || 'there';
        var answers = data.answers || [];
        var quizData = data.quizData || window.quizData || [];
        var herResponseKey = data.herResponsePattern || null;
        var herResponse = (window.herResponsePatterns && herResponseKey && window.herResponsePatterns[herResponseKey]) ||
            { name: 'Your response pattern', description: '', identityLines: [] };
        var pain = data.currentPain || null;
        var fear = data.biggestFear || null;
        var relationshipStatus = data.relationshipStatus || null;
        var situationship = !!data.situationshipModifier;
        var repetition = data.repetitionInsight || null;

        var hisInfo = null, dynamicText = null, emotCompat = null;
        if (window.ResultsInference) {
            try {
                hisInfo = window.ResultsInference.inferHisBehavioralPattern(answers, quizData, pattern.id, relationshipStatus);
                dynamicText = window.ResultsInference.getDynamicInteractionText(herResponseKey, hisInfo ? hisInfo.primary : null);
                emotCompat = window.ResultsInference.inferEmotionalCompatibility(answers, quizData);
            } catch (e) { /* fallbacks below */ }
        }

        var verdictLine = pattern.breakdownVerdict || pattern.whatItMeans || '';
        var emotLabel = humanizeEmotLabel(emotCompat && emotCompat.label);
        var coreAnswer = pickCoreAnswer(pain, fear);

        var ifNothing = (pattern.ifNothingChanges || []).slice(0, 3);
        var ifAct = (pattern.breakdownIfYouAct || [
            'you stop spending energy trying to interpret him',
            'you see a clear pattern in two weeks instead of a year',
            'you get your standard back before another chapter closes'
        ]).slice(0, 3);

        var timeline = pattern.breakdownTimeline || null;
        var escalation = (pattern.breakdownEscalation || []).slice(0, 3);
        var origin = pattern.breakdownOrigin || '';
        var validation = pattern.breakdownValidation || '';
        var script = pattern.breakdownScript || '';
        var healthy = pattern.breakdownHealthy || '';

        var oneDecision = (pattern.resultModal && pattern.resultModal.oneDecision) || '';
        var oneAction = (pattern.resultModal && pattern.resultModal.oneAction) || '';
        var stopLine = pattern.watchFor || '';
        var watchHim = pattern.breakdownWatchForHim || '';

        var painLabel = PAIN_LABELS[normKey(pain)] || null;
        var fearLabel = FEAR_LABELS[normKey(fear)] || null;

        var tagList = [];
        if (situationship && window.situationshipModifier) tagList.push('Situationship amplifier');
        if (repetition && (['same-type', 'same-ending', 'same-confusion'].indexOf(repetition) !== -1)) tagList.push('This isn\u2019t the first time');
        if (hisInfo && hisInfo.modifier && window.ResultsInference && window.ResultsInference.MODIFIERS && window.ResultsInference.MODIFIERS[hisInfo.modifier]) {
            tagList.push(window.ResultsInference.MODIFIERS[hisInfo.modifier].name);
        }

        var qs = buildQuestions(pattern, pain, fear, relationshipStatus);

        var urls = window.PATTERN_RESET_CTA_URLS || {};
        var href59 = urls.myTakeWritten || urls.personalBreakdown || '/personal-relationship-read.html';
        var href197 = urls.talkDirectly || urls.liveSession || '#';

        var socialProof = window.PATTERN_RESET_BREAKDOWN_TESTIMONIAL ||
            '"I spent 2 years trying to figure out what was wrong with me. You explained him in 3 minutes. I cried \u2014 in a good way."';

        var out = '';
        out += '<div class="pr-break" role="document">';

        // 1) THE ANSWER
        out += '<section class="pr-break-section pr-break-section--verdict" aria-labelledby="pr-break-verdict-title">';
        out += '<p class="pr-break-kicker">THE ANSWER</p>';
        out += '<h1 class="pr-break-h1" id="pr-break-verdict-title">Here\u2019s what\u2019s actually going on, ' + esc(firstName) + '.</h1>';
        if (verdictLine) out += '<p class="pr-break-verdict">' + esc(verdictLine) + '</p>';
        if (coreAnswer) out += '<p class="pr-break-coreline">' + esc(coreAnswer) + '</p>';
        if (emotLabel) out += '<p class="pr-break-emot"><span class="pr-break-emot__k">Right now:</span> ' + esc(emotLabel) + '</p>';
        if (painLabel || fearLabel) {
            out += '<div class="pr-break-chips">';
            if (painLabel) out += '<span class="pr-break-chip"><span class="pr-break-chip__k">You said</span>' + esc(painLabel) + '</span>';
            if (fearLabel) out += '<span class="pr-break-chip"><span class="pr-break-chip__k">You fear</span>' + esc(fearLabel) + '</span>';
            out += '</div>';
        }
        out += '<p class="pr-break-bywhen">Give it 2 weeks. If nothing shifts \u2014 that is your answer.</p>';
        out += '</section>';

        // 2) WHAT'S ACTUALLY HAPPENING
        out += '<section class="pr-break-section pr-break-section--trio" aria-labelledby="pr-break-happening-title">';
        out += '<p class="pr-break-kicker">WHAT\u2019S ACTUALLY HAPPENING</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-happening-title">Him, you, and the loop between you.</h2>';
        out += '<div class="pr-break-trio">';

        var hisLine1 = (pattern.hisIdentityLines && pattern.hisIdentityLines[0]) || pattern.hisPattern || '';
        var hisLine2 = (pattern.hisIdentityLines && pattern.hisIdentityLines[1]) || '';
        out += '<article class="pr-break-card pr-break-card--him">';
        out += '<p class="pr-break-card__label">HIM</p>';
        if (hisLine1) out += '<p class="pr-break-card__line">' + esc(hisLine1) + '</p>';
        if (hisLine2) out += '<p class="pr-break-card__sub">' + esc(hisLine2) + '</p>';
        out += '</article>';

        var yourLine1 = (herResponse.identityLines && herResponse.identityLines[0]) || pattern.herPattern || '';
        var anchorTxt = answerText(quizData, answers, 5);
        out += '<article class="pr-break-card pr-break-card--you">';
        out += '<p class="pr-break-card__label">YOU</p>';
        if (herResponse.name) out += '<p class="pr-break-card__line">' + esc(herResponse.name) + '</p>';
        if (yourLine1) out += '<p class="pr-break-card__sub">' + esc(yourLine1) + '</p>';
        if (origin) out += '<p class="pr-break-card__origin">' + esc(origin) + '</p>';
        if (anchorTxt) out += '<p class="pr-break-card__foot">You said: \u201C' + esc(anchorTxt) + '\u201D</p>';
        out += '</article>';

        out += '<article class="pr-break-card pr-break-card--loop">';
        out += '<p class="pr-break-card__label">THE LOOP</p>';
        out += '<p class="pr-break-card__line">' + esc(pattern.name) + '</p>';
        var steps3 = (pattern.whyKeepsHappeningBlocks && pattern.whyKeepsHappeningBlocks[0]) || [];
        if (steps3.length) {
            out += '<ol class="pr-break-steps">';
            for (var si = 0; si < steps3.length; si++) {
                out += '<li><span class="pr-break-steps__n">' + (si + 1) + '</span><span>' + esc(steps3[si]) + '</span></li>';
            }
            out += '</ol>';
        }
        out += '</article>';
        out += '</div>';
        if (dynamicText) out += '<p class="pr-break-together"><span class="pr-break-together__label">THE DYNAMIC</span> ' + esc(dynamicText) + '</p>';
        out += '</section>';

        // 3) WHY IT FEELS LIKE THIS  (richer validation)
        out += '<section class="pr-break-section pr-break-section--mechanism" aria-labelledby="pr-break-feel-title">';
        out += '<p class="pr-break-kicker">WHY IT FEELS LIKE THIS</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-feel-title">You\u2019re not imagining it. You\u2019re not asking for too much.</h2>';
        if (validation) out += '<p class="pr-break-validation">' + esc(validation) + '</p>';
        var mech = firstSentence(pattern.whyItFeelsConfusing);
        if (mech) out += '<p class="pr-break-body">' + esc(mech) + '</p>';
        if (tagList.length) {
            out += '<div class="pr-break-tags" role="list">';
            for (var ti = 0; ti < tagList.length; ti++) {
                out += '<span class="pr-break-tag" role="listitem">' + esc(tagList[ti]) + '</span>';
            }
            out += '</div>';
        }
        out += '</section>';

        // 4) WHERE THIS IS HEADED — 2 paths + timeline under "if nothing changes"
        out += '<section class="pr-break-section pr-break-section--paths" aria-labelledby="pr-break-paths-title">';
        out += '<p class="pr-break-kicker">WHERE THIS IS HEADED</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-paths-title">Two trajectories. You pick.</h2>';
        out += '<div class="pr-break-paths">';
        out += '<article class="pr-break-path pr-break-path--neg">';
        out += '<p class="pr-break-path__label">IF NOTHING CHANGES</p>';
        out += '<ul class="pr-break-path__list">';
        for (var ni = 0; ni < ifNothing.length; ni++) out += '<li>' + esc(ifNothing[ni]) + '</li>';
        out += '</ul>';
        if (timeline && (timeline.twoWeeks || timeline.threeMonths || timeline.oneYear)) {
            out += '<div class="pr-break-timeline">';
            out += '<p class="pr-break-timeline__label">The cost, timestamped</p>';
            out += '<ol class="pr-break-timeline__list">';
            if (timeline.twoWeeks) out += '<li><span class="pr-break-timeline__when">2 weeks</span><span class="pr-break-timeline__what">' + esc(timeline.twoWeeks) + '</span></li>';
            if (timeline.threeMonths) out += '<li><span class="pr-break-timeline__when">3 months</span><span class="pr-break-timeline__what">' + esc(timeline.threeMonths) + '</span></li>';
            if (timeline.oneYear) out += '<li><span class="pr-break-timeline__when">1 year</span><span class="pr-break-timeline__what">' + esc(timeline.oneYear) + '</span></li>';
            out += '</ol>';
            out += '</div>';
        }
        out += '</article>';
        out += '<article class="pr-break-path pr-break-path--pos">';
        out += '<p class="pr-break-path__label">IF YOU ACT ON IT</p>';
        out += '<ul class="pr-break-path__list">';
        for (var pi = 0; pi < ifAct.length; pi++) out += '<li>' + esc(ifAct[pi]) + '</li>';
        out += '</ul>';
        if (healthy) out += '<p class="pr-break-path__healthy"><span class="pr-break-path__healthy-k">What healthy looks like</span>' + esc(healthy) + '</p>';
        out += '</article>';
        out += '</div>';
        out += '</section>';

        // NEW: SIGNS THIS IS ESCALATING
        if (escalation.length) {
            out += '<section class="pr-break-section pr-break-section--escalation" aria-labelledby="pr-break-escalation-title">';
            out += '<p class="pr-break-kicker">SIGNS THIS IS ESCALATING</p>';
            out += '<h2 class="pr-break-h2" id="pr-break-escalation-title">Specific to this pattern. Not a checklist.</h2>';
            out += '<ul class="pr-break-escalation">';
            for (var ei = 0; ei < escalation.length; ei++) {
                out += '<li class="pr-break-escalation__item"><span class="pr-break-escalation__mark" aria-hidden="true">!</span><span>' + esc(escalation[ei]) + '</span></li>';
            }
            out += '</ul>';
            out += '<p class="pr-break-escalation__foot">If two or more of these are showing up already, the loop is tightening \u2014 not resolving.</p>';
            out += '</section>';
        }

        // 5) WHAT TO DO NEXT (+ script in 02)
        out += '<section class="pr-break-section pr-break-section--moves" aria-labelledby="pr-break-moves-title">';
        out += '<p class="pr-break-kicker">WHAT TO DO NEXT</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-moves-title">One decision. One move. One thing to stop.</h2>';
        out += '<ol class="pr-break-moves">';
        if (oneDecision) out += '<li class="pr-break-move"><span class="pr-break-move__n">01</span><div class="pr-break-move__body"><p class="pr-break-move__label">DECIDE</p><p class="pr-break-move__text">' + esc(oneDecision) + '</p></div></li>';
        if (oneAction) {
            out += '<li class="pr-break-move"><span class="pr-break-move__n">02</span><div class="pr-break-move__body"><p class="pr-break-move__label">DO THIS (ONCE)</p><p class="pr-break-move__text">' + esc(oneAction) + '</p>';
            if (script) {
                out += '<figure class="pr-break-script">';
                out += '<figcaption class="pr-break-script__k">If you need words, say this</figcaption>';
                out += '<blockquote class="pr-break-script__q">\u201C' + esc(script) + '\u201D</blockquote>';
                out += '</figure>';
            }
            out += '</div></li>';
        }
        if (stopLine) out += '<li class="pr-break-move"><span class="pr-break-move__n">03</span><div class="pr-break-move__body"><p class="pr-break-move__label">STOP DOING THIS</p><p class="pr-break-move__text">' + esc(stopLine) + '</p></div></li>';
        if (watchHim) out += '<li class="pr-break-move"><span class="pr-break-move__n">04</span><div class="pr-break-move__body"><p class="pr-break-move__label">WATCH FOR THIS FROM HIM</p><p class="pr-break-move__text">' + esc(watchHim) + '</p></div></li>';
        out += '</ol>';
        out += '<p class="pr-break-window">Give it 2 weeks. Track behavior \u2014 not words.</p>';
        out += '</section>';

        // 6) Q&A
        if (qs.length) {
            out += '<section class="pr-break-section pr-break-section--qa" aria-labelledby="pr-break-qa-title">';
            out += '<p class="pr-break-kicker">QUESTIONS YOU\u2019RE PROBABLY ASKING</p>';
            out += '<h2 class="pr-break-h2" id="pr-break-qa-title">Short answers. No filler.</h2>';
            out += '<div class="pr-break-qa">';
            for (var qi = 0; qi < qs.length; qi++) {
                var openAttr = qi === 0 ? ' open' : '';
                out += '<details class="pr-break-qa__item"' + openAttr + '>';
                out += '<summary class="pr-break-qa__q">' + esc(qs[qi].q) + '</summary>';
                out += '<div class="pr-break-qa__a"><p>' + esc(qs[qi].a) + '</p></div>';
                out += '</details>';
            }
            out += '</div>';
            out += '</section>';
        }

        // 7) UPSELL — scarcity + deliverable bullets + social proof + alt CTA renamed
        out += '<section class="pr-break-section pr-break-section--upsell" aria-labelledby="pr-break-upsell-title">';
        out += '<div class="pr-break-upsell">';
        out += '<p class="pr-break-kicker">WANT THIS APPLIED TO YOUR EXACT STORY?</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-upsell-title">You have the read. I can write back on your situation.</h2>';
        out += '<p class="pr-break-upsell__body">You\u2019re in <strong>' + esc(pattern.name) + '</strong>' + (herResponse.name ? ' with a <strong>' + esc(herResponse.name) + '</strong> response' : '') + '. Send me your story \u2014 I\u2019ll read it personally and send back a written answer.</p>';
        out += '<ul class="pr-break-upsell__bullets">';
        out += '<li><span class="pr-break-upsell__bullet-k">Your specific dynamic</span> named, not guessed at.</li>';
        out += '<li><span class="pr-break-upsell__bullet-k">His likely next 2 moves</span> \u2014 so you stop being surprised by the same thing twice.</li>';
        out += '<li><span class="pr-break-upsell__bullet-k">Your sharpest next step</span>, with the words to use if you need them.</li>';
        out += '</ul>';
        out += '<p class="pr-break-upsell__scarcity">I take a limited number of story reads each week. Delivered in 48\u201372 hours.</p>';
        out += '<blockquote class="pr-break-upsell__quote">' + esc(socialProof) + '</blockquote>';
        out += '<div class="pr-break-upsell__cta">';
        out += '<a href="' + esc(href59) + '" class="pr-break-btn pr-break-btn--primary" id="pr-break-upsell-59"' + (href59 === '#' ? ' aria-disabled="true"' : '') + '>Get my written answer <span class="pr-break-btn__price">$59</span></a>';
        out += '<a href="' + esc(href197) + '" class="pr-break-upsell__alt" id="pr-break-upsell-197"' + (href197 === '#' ? ' aria-disabled="true"' : '') + '>Or get the deep video breakdown &rarr;</a>';
        out += '</div>';
        out += '<p class="pr-break-upsell__foot">Private. Personal. Based on what you share.</p>';
        out += '</div>';
        out += '</section>';

        // 8) SHARE CARD — screenshot-able summary
        out += '<section class="pr-break-section pr-break-section--share" aria-labelledby="pr-break-share-title">';
        out += '<p class="pr-break-kicker">SAVE THIS FOR LATER</p>';
        out += '<h2 class="pr-break-h2" id="pr-break-share-title">Screenshot this. Pin it. Come back in 2 weeks.</h2>';
        out += '<figure class="pr-break-share-card">';
        out += '<figcaption class="pr-break-share-card__brand">PATTERN RESET \u2014 FOR ' + esc(firstName.toUpperCase()) + '</figcaption>';
        out += '<p class="pr-break-share-card__pattern">You\u2019re in <strong>' + esc(pattern.name) + '</strong>.</p>';
        if (verdictLine) out += '<p class="pr-break-share-card__line">' + esc(verdictLine) + '</p>';
        out += '<p class="pr-break-share-card__move"><span class="pr-break-share-card__k">Next 2 weeks</span>' + esc(oneAction || 'Track behavior \u2014 not words.') + '</p>';
        out += '<p class="pr-break-share-card__foot">patternreset</p>';
        out += '</figure>';
        out += '</section>';

        out += '</div>';

        container.innerHTML = out;

        var a59 = container.querySelector('#pr-break-upsell-59');
        if (a59) {
            a59.addEventListener('click', function (e) {
                var oid = (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DIRECT_READ_59) || 'direct_read_59';
                if (typeof window.trackCustomerEvent === 'function') {
                    window.trackCustomerEvent('offer_clicked', { offerId: oid, source: 'breakdown' });
                }
                if (href59 === '#') e.preventDefault();
            });
        }
        var a197 = container.querySelector('#pr-break-upsell-197');
        if (a197) {
            a197.addEventListener('click', function (e) {
                var oid = (window.PATTERN_RESET_OFFER_IDS && window.PATTERN_RESET_OFFER_IDS.DECIDE_WITH_ME_197) || 'decide_with_me_197';
                if (typeof window.trackCustomerEvent === 'function') {
                    window.trackCustomerEvent('offer_clicked', { offerId: oid, source: 'breakdown' });
                }
                if (href197 === '#') e.preventDefault();
            });
        }

        if (typeof window.trackCustomerEvent === 'function') {
            try {
                window.trackCustomerEvent('breakdown_viewed', {
                    pattern: pattern.id || null,
                    herResponse: herResponseKey || null,
                    source: 'in_modal'
                });
            } catch (e) { /* no-op */ }
        }
    }

    window.ResultsBreakdown = { render: render };
})();
