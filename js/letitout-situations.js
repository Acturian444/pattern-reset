/**
 * Canonical situation tags for Let It Out (write form modal + wall filter).
 * Loaded before postForm.js / wallFeed.js — see letitout.html script order.
 */
(function (g) {
    g.LET_IT_OUT_SITUATION_TAGS = [
        'Relationships',
        'Dating',
        'Breakup',
        'Marriage',
        'Divorce',
        'Infidelity',
        'Friendship',
        'Family',
        'Parenthood',
        'Childhood',
        'School',
        'Identity',
        'Sexuality',
        'Self-Worth',
        'Purpose',
        'Work',
        'Burnout',
        'Money',
        'Success',
        'Failure',
        'Addiction',
        'Mental Health',
        'Illness & Health',
        'Trauma',
        'Grief & Loss',
        'Regret',
        'Starting Over',
        'Life Change',
        'Faith & Spirituality',
        'Abuse',
        'Secret',
        'Confession',
        'Other'
    ];

    /** Older posts may still use pre-rename situation values. */
    g.LET_IT_OUT_SITUATION_LEGACY_TO_CANONICAL = {
        Career: 'Work',
        Health: 'Illness & Health',
    };

    g.canonicalLetItOutSituation = function canonicalLetItOutSituation(label) {
        if (!label || typeof label !== 'string') return label;
        const trimmed = label.trim();
        return g.LET_IT_OUT_SITUATION_LEGACY_TO_CANONICAL[trimmed] || trimmed;
    };

    g.situationTagMatches = function situationTagMatches(storedSituation, filterLabel) {
        if (!storedSituation || !filterLabel) return false;
        const stored = String(storedSituation).trim();
        const filter = String(filterLabel).trim();
        if (stored === filter) return true;
        return g.canonicalLetItOutSituation(stored) === filter;
    };
})(typeof globalThis !== 'undefined' ? globalThis : window);
