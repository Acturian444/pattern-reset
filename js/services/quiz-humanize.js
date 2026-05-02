/**
 * Human-readable quiz snapshots for Firestore (console-friendly).
 * v6 relationship quiz: 10 questions, indices 0–9.
 */
(function () {
    'use strict';

    var SUMMARY_KEYS = [
        'predictability',
        'mainPain',
        'conflictResponse',
        'effortBalance',
        'emotionalAfter',
        'corePatternAnswer',
        'herResponse',
        'futureView',
        'decisionBlock',
        'desiredOutcome'
    ];

    function detailedFieldId(index) {
        return 'q' + (index + 1) + '_' + SUMMARY_KEYS[index];
    }

    function machineKeyFromOption(opt) {
        if (!opt) return null;
        var k =
            opt.answerKey ||
            opt.value ||
            opt.painKey ||
            opt.fearKey ||
            opt.desireKey ||
            opt.subDimension;
        if (k == null || k === '') return null;
        return String(k);
    }

    /**
     * Per-question snapshot for Firestore: stable keys + exact option copy + question text.
     * @returns {object} e.g. q1_predictability → { question, answerKey, answerLabel }
     */
    function buildAnswersDetailed(quizData, answers) {
        var out = {};
        if (!quizData || !answers) return out;
        for (var i = 0; i < SUMMARY_KEYS.length; i++) {
            var skid = detailedFieldId(i);
            var q = quizData[i];
            var ai = answers[i];
            if (!q || ai === undefined || !q.options || !q.options[ai]) {
                out[skid] = {
                    question: q && q.question ? String(q.question) : null,
                    answerKey: null,
                    answerLabel: null
                };
                continue;
            }
            var opt = q.options[ai];
            var key = machineKeyFromOption(opt);
            var label = opt.text != null ? String(opt.text).trim() : null;
            out[skid] = {
                question: q.question ? String(q.question) : null,
                answerKey: key,
                answerLabel: label
            };
        }
        return out;
    }

    function optionTextAt(quizData, answers, index) {
        if (!quizData || !answers || index < 0 || index >= quizData.length) return null;
        var ai = answers[index];
        if (ai === undefined || !quizData[index] || !quizData[index].options) return null;
        var opt = quizData[index].options[ai];
        if (!opt || opt.text == null) return null;
        return String(opt.text).trim();
    }

    /**
     * @returns {object} answersSummary — short field names → exact option copy from quiz
     */
    function buildAnswersSummary(quizData, answers) {
        var out = {};
        for (var i = 0; i < SUMMARY_KEYS.length; i++) {
            var key = SUMMARY_KEYS[i];
            var t = optionTextAt(quizData, answers, i);
            out[key] = t || null;
        }
        return out;
    }

    /**
     * @returns {{ latestUrgencyLabel: string|null, latestDecisionBlockLabel: string|null, latestDesiredOutcomeLabel: string|null }}
     */
    function buildLabelFields(quizData, answers) {
        return {
            latestUrgencyLabel: optionTextAt(quizData, answers, 7),
            latestDecisionBlockLabel: optionTextAt(quizData, answers, 8),
            latestDesiredOutcomeLabel: optionTextAt(quizData, answers, 9)
        };
    }

    /**
     * One-line intent for CRM (not clinical; marketing/ops clarity).
     */
    function deriveUserIntent(ctx) {
        ctx = ctx || {};
        var patternName = ctx.patternName ? String(ctx.patternName).trim() : '';
        var desire = ctx.latestDesiredOutcomeLabel ? String(ctx.latestDesiredOutcomeLabel).trim() : '';
        var block = ctx.latestDecisionBlockLabel ? String(ctx.latestDecisionBlockLabel).trim() : '';
        var trajectory = ctx.latestUrgencyLabel ? String(ctx.latestUrgencyLabel).trim() : '';
        var mainPain = ctx.mainPainText ? String(ctx.mainPainText).trim() : '';

        var chunks = [];
        if (desire) {
            chunks.push('Wants: ' + desire);
        }
        if (mainPain && mainPain !== desire) {
            chunks.push('Hurts most: ' + mainPain);
        }
        if (trajectory) {
            chunks.push('Where she sees it going: ' + trajectory);
        }
        if (block) {
            chunks.push('Stuck because: ' + block);
        }
        if (patternName && chunks.length < 2) {
            chunks.push('Dynamic: ' + patternName);
        }

        var s = chunks.length ? chunks.join(' · ') : '';
        if (!s && patternName) {
            s = 'Needs clarity on what this dynamic means for her — ' + patternName;
        }
        if (!s) {
            s = 'Wants relationship clarity and a clear next step';
        }
        return s.length > 350 ? s.slice(0, 347) + '…' : s;
    }

    function buildAll(quizData, answers, extra) {
        extra = extra || {};
        var summary = buildAnswersSummary(quizData, answers);
        var detailed = buildAnswersDetailed(quizData, answers);
        var labels = buildLabelFields(quizData, answers);
        var intent = deriveUserIntent({
            patternName: extra.patternName,
            latestDesiredOutcomeLabel: labels.latestDesiredOutcomeLabel,
            latestDecisionBlockLabel: labels.latestDecisionBlockLabel,
            latestUrgencyLabel: labels.latestUrgencyLabel,
            mainPainText: summary.mainPain
        });
        return {
            answersSummary: summary,
            answersDetailed: detailed,
            latestUrgencyLabel: labels.latestUrgencyLabel,
            latestDecisionBlockLabel: labels.latestDecisionBlockLabel,
            latestDesiredOutcomeLabel: labels.latestDesiredOutcomeLabel,
            latestUserIntent: intent
        };
    }

    window.QuizHumanize = {
        buildAnswersSummary: buildAnswersSummary,
        buildAnswersDetailed: buildAnswersDetailed,
        buildLabelFields: buildLabelFields,
        deriveUserIntent: deriveUserIntent,
        buildAll: buildAll
    };
})();
