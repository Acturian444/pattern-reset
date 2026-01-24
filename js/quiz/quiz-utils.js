// Quiz Utility Functions
// Reusable functions for quiz operations

(function() {
    'use strict';
    
    // Make utilities available globally
    window.QuizUtils = {
        // Birth date parsing
        parseBirthDate: function(dateString) {
            // Format: MM/DD/YYYY
            const parts = dateString.split('/');
            if (parts.length !== 3) return null;
            
            const month = parseInt(parts[0], 10);
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            
            if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
            if (month < 1 || month > 12) return null;
            if (day < 1 || day > 31) return null;
            
            return {
                month: month,
                day: day,
                year: year,
                dateString: dateString
            };
        },
        
        // Get sun sign from birth date
        getSunSign: function(month, day) {
            const signs = [
                { name: 'Capricorn', start: [12, 22], end: [1, 19] },
                { name: 'Aquarius', start: [1, 20], end: [2, 18] },
                { name: 'Pisces', start: [2, 19], end: [3, 20] },
                { name: 'Aries', start: [3, 21], end: [4, 19] },
                { name: 'Taurus', start: [4, 20], end: [5, 20] },
                { name: 'Gemini', start: [5, 21], end: [6, 20] },
                { name: 'Cancer', start: [6, 21], end: [7, 22] },
                { name: 'Leo', start: [7, 23], end: [8, 22] },
                { name: 'Virgo', start: [8, 23], end: [9, 22] },
                { name: 'Libra', start: [9, 23], end: [10, 22] },
                { name: 'Scorpio', start: [10, 23], end: [11, 21] },
                { name: 'Sagittarius', start: [11, 22], end: [12, 21] }
            ];
            
            for (let sign of signs) {
                if (sign.start[0] === month && day >= sign.start[1]) return sign.name;
                if (sign.end[0] === month && day <= sign.end[1]) return sign.name;
                // Handle Capricorn (Dec 22 - Jan 19)
                if (sign.name === 'Capricorn') {
                    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return sign.name;
                }
            }
            return 'Unknown';
        },
        
        // Get element from sign
        getElement: function(sign) {
            const fire = ['Aries', 'Leo', 'Sagittarius'];
            const earth = ['Taurus', 'Virgo', 'Capricorn'];
            const air = ['Gemini', 'Libra', 'Aquarius'];
            const water = ['Cancer', 'Scorpio', 'Pisces'];
            
            if (fire.includes(sign)) return 'fire';
            if (earth.includes(sign)) return 'earth';
            if (air.includes(sign)) return 'air';
            if (water.includes(sign)) return 'water';
            return 'unknown';
        },
        
        // Get age range from birth date
        getAgeRange: function(birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            const age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
            
            if (actualAge >= 18 && actualAge <= 27) return '18-27';
            if (actualAge >= 28 && actualAge <= 38) return '28-38';
            if (actualAge >= 39 && actualAge <= 50) return '39-50';
            if (actualAge >= 51) return '51+';
            return 'unknown';
        },
        
        // Validate email
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        // Safe DOM element getter with error handling
        getElement: function(id, errorMessage) {
            const element = document.getElementById(id);
            if (!element && errorMessage) {
                console.error(errorMessage);
            }
            return element;
        },
        
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
})();

