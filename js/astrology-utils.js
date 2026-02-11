/**
 * Astrology utils: Sun + approximate Moon from birthdate only.
 * Used only to add optional personalization to life-area copy (no front-facing astrology).
 */
(function() {
    'use strict';

    const SIGN_NAMES = ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'];

    // Sun sign from date (standard Western tropical date ranges)
    function getSunSign(dateStr) {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        const month = d.getUTCMonth() + 1;
        const day = d.getUTCDate();
        if (month === 1 && day >= 20) return 'aquarius';
        if (month === 1) return 'capricorn';
        if (month === 2 && day >= 19) return 'pisces';
        if (month === 2) return 'aquarius';
        if (month === 3 && day >= 21) return 'aries';
        if (month === 3) return 'pisces';
        if (month === 4 && day >= 20) return 'taurus';
        if (month === 4) return 'aries';
        if (month === 5 && day >= 21) return 'gemini';
        if (month === 5) return 'taurus';
        if (month === 6 && day >= 21) return 'cancer';
        if (month === 6) return 'gemini';
        if (month === 7 && day >= 23) return 'leo';
        if (month === 7) return 'cancer';
        if (month === 8 && day >= 23) return 'virgo';
        if (month === 8) return 'leo';
        if (month === 9 && day >= 23) return 'libra';
        if (month === 9) return 'virgo';
        if (month === 10 && day >= 23) return 'scorpio';
        if (month === 10) return 'libra';
        if (month === 11 && day >= 22) return 'sagittarius';
        if (month === 11) return 'scorpio';
        if (month === 12 && day >= 22) return 'capricorn';
        return 'sagittarius';
    }

    // Moon sign from date: ephemeris reference + mean motion (synodic 29.530588 d → 12.190749°/day).
    // Use ref for Jan 1 of birth year so we integrate over ≤1 year (reduces drift). Base: Jan 1 2000 00:00 UT — Moon 7°17' Scorpio = 217.28° (ephemeris).
    function getMoonSign(dateStr) {
        if (!dateStr) return null;
        var birth = parseDateToUTCNoon(dateStr);
        if (!birth || isNaN(birth.getTime())) return null;
        var y = birth.getUTCFullYear();
        var refUTC = Date.UTC(y, 0, 1, 0, 0, 0);  // Jan 1 of birth year
        var baseUTC = Date.UTC(2000, 0, 1, 0, 0, 0);
        var msPerDay = 24 * 60 * 60 * 1000;
        var daysFromBaseToRef = (refUTC - baseUTC) / msPerDay;
        var degreesPerDay = 360 / 29.530588;
        var refLongitude = 217.28 + daysFromBaseToRef * degreesPerDay;  // Moon long at Jan 1 of birth year
        refLongitude = ((refLongitude % 360) + 360) % 360;
        var daysSinceRef = (birth.getTime() - refUTC) / msPerDay;
        var longitude = refLongitude + daysSinceRef * degreesPerDay;
        longitude = ((longitude % 360) + 360) % 360;
        var signIndex = (Math.floor(longitude / 30) + 3) % 12;
        return SIGN_NAMES[signIndex] || null;
    }

    function parseDateToUTCNoon(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') return null;
        dateStr = dateStr.trim();
        var year, month, day;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            var parts = dateStr.split('-');
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
            day = parseInt(parts[2], 10);
        } else {
            var parts = dateStr.split('/');
            if (parts.length !== 3) return null;
            month = parseInt(parts[0], 10) - 1;
            day = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
        }
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        if (month < 0 || month > 11 || day < 1 || day > 31) return null;
        return new Date(Date.UTC(year, month, day, 12, 0, 0));
    }

    // One short sentence per sign for Moon (emotional need/fear) - used in Love, Health, Lifestyle, Money
    const MOON_INSIGHT = {
        aries: 'Your need for independence and momentum can make it hard to slow down and tend to your emotional needs.',
        taurus: 'Your need for security and comfort can make change feel threatening, even when it would help.',
        gemini: 'Your need to process through words and variety can leave deeper feelings unexamined.',
        cancer: 'Your need to nurture and be needed can make it hard to receive as much as you give.',
        leo: 'Your need to be seen and valued can make it hard when others don\'t reflect you back.',
        virgo: 'Your need to get it right can turn into self-criticism when things feel out of control.',
        libra: 'Your need for harmony can lead you to absorb others\' feelings and lose your own center.',
        scorpio: 'Your need for depth and trust can make you guarded when you sense surface-level connection.',
        sagittarius: 'Your need for freedom and meaning can make it hard to sit with difficult emotions.',
        capricorn: 'Your need for structure and responsibility can make it hard to prioritize rest and feeling.',
        aquarius: 'Your need for space and objectivity can create distance from your own emotional world.',
        pisces: 'Your sensitivity and need for connection can make boundaries feel impossible.'
    };

    // One short sentence per sign for Sun (identity/drive) - used in Identity, Purpose, Career
    const SUN_INSIGHT = {
        aries: 'Your drive to lead and take action can make it hard to wait for others or delegate.',
        taurus: 'Your drive for stability and quality can make change feel risky even when it serves you.',
        gemini: 'Your drive to learn and communicate can scatter focus when one path would serve you more.',
        cancer: 'Your drive to protect and nurture can put others\' needs ahead of your own growth.',
        leo: 'Your drive to be seen and create can tie your worth to recognition and applause.',
        virgo: 'Your drive to improve and serve can turn into impossible standards for yourself.',
        libra: 'Your drive for balance and partnership can blur where you end and others begin.',
        scorpio: 'Your drive for depth and transformation can make vulnerability feel dangerous.',
        sagittarius: 'Your drive for meaning and freedom can make commitment feel like loss.',
        capricorn: 'Your drive for achievement and structure can make rest feel like failure.',
        aquarius: 'Your drive for innovation and detachment can keep you from being fully present in your day-to-day.',
        pisces: 'Your drive for connection and transcendence can make boundaries and self-interest feel wrong.'
    };

    window.AstrologyUtils = {
        getSunSign: getSunSign,
        getMoonSign: getMoonSign,
        getMoonInsight: function(sign) { return sign ? MOON_INSIGHT[sign] || null : null; },
        getSunInsight: function(sign) { return sign ? SUN_INSIGHT[sign] || null : null; }
    };
})();
