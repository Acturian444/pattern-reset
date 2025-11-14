#!/usr/bin/env node

/**
 * Domain Change Script
 * Safely replaces domain references across the entire project
 * 
 * Usage: node change-domain.js [old-domain] [new-domain]
 * Example: node change-domain.js www.joinheartmatters.com www.patternresetclub.com
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const oldDomain = process.argv[2] || 'www.joinheartmatters.com';
const newDomain = process.argv[3] || 'mypatternreset.com';

if (!newDomain) {
    console.error('❌ Error: New domain required');
    console.log('\nUsage: node change-domain.js [old-domain] [new-domain]');
    console.log('Example: node change-domain.js www.joinheartmatters.com mypatternreset.com');
    process.exit(1);
}

// Remove www from new domain if present (user wants non-www)
const cleanNewDomain = newDomain.replace(/^www\./, '');

// Files to process
const filesToUpdate = [
    // Main pages
    'index.html',
    'letitout.html',
    'info.html',
    'theheartroom.html',
    'makers.html',
    'legal.html',
    
    // Product pages
    'product/breakup-course.html',
    'product/balance-earrings.html',
    'product/reminder-tshirt.html',
    'product/self-love-bracelet.html',
    'product/power-earrings.html',
    
    // Shop and course
    'shop/index.html',
    'course/breakup-course.html',
    
    // SEO files
    'sitemap.xml',
    'robots.txt'
];

// Simple domain replacement - just replace the domain part
// Handles: https://www.joinheartmatters.com/letitout.html → https://mypatternreset.com/letitout.html
const oldDomainEscaped = oldDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const oldDomainNoWww = oldDomain.replace(/^www\./, '');
const oldDomainNoWwwEscaped = oldDomainNoWww.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replacements = [
    // Replace https://www.joinheartmatters.com (with trailing slash or path)
    {
        pattern: new RegExp(`https://${oldDomainEscaped}`, 'g'),
        replacement: `https://${cleanNewDomain}`
    },
    // Replace https://joinheartmatters.com (non-www version)
    {
        pattern: new RegExp(`https://${oldDomainNoWwwEscaped}`, 'g'),
        replacement: `https://${cleanNewDomain}`
    },
    // Replace www.joinheartmatters.com (standalone, not in https://)
    {
        pattern: new RegExp(`\\b${oldDomainEscaped}\\b`, 'g'),
        replacement: cleanNewDomain
    },
    // Replace joinheartmatters.com (standalone, non-www)
    {
        pattern: new RegExp(`\\b${oldDomainNoWwwEscaped}\\b`, 'g'),
        replacement: cleanNewDomain
    },
    // Email addresses
    {
        pattern: new RegExp(`@${oldDomainEscaped}`, 'g'),
        replacement: `@${cleanNewDomain}`
    },
    {
        pattern: new RegExp(`@${oldDomainNoWwwEscaped}`, 'g'),
        replacement: `@${cleanNewDomain}`
    }
];

let totalFiles = 0;
let totalReplacements = 0;
const changes = [];

console.log(`\n🔄 Starting domain change...`);
console.log(`   Old: ${oldDomain} (and non-www version)`);
console.log(`   New: ${cleanNewDomain} (no www)\n`);

// Process each file
filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping: ${file} (not found)`);
        return;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let fileReplacements = 0;
        const originalContent = content;
        
        // Apply all replacements
        replacements.forEach(({ pattern, replacement }) => {
            const matches = content.match(pattern);
            if (matches) {
                fileReplacements += matches.length;
                content = content.replace(pattern, replacement);
            }
        });
        
        // Only write if changes were made
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            totalFiles++;
            totalReplacements += fileReplacements;
            changes.push({
                file,
                count: fileReplacements
            });
            console.log(`✅ Updated: ${file} (${fileReplacements} replacements)`);
        } else {
            console.log(`⏭️  Skipped: ${file} (no matches)`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Files updated: ${totalFiles}`);
console.log(`   Total replacements: ${totalReplacements}`);

if (changes.length > 0) {
    console.log(`\n📝 Files changed:`);
    changes.forEach(({ file, count }) => {
        console.log(`   - ${file}: ${count} replacement(s)`);
    });
}

console.log(`\n✨ Domain change complete!`);
console.log(`\n⚠️  Next steps:`);
console.log(`   1. Review changes with: git diff`);
console.log(`   2. Test locally`);
console.log(`   3. Update DNS settings`);
console.log(`   4. Update Vercel domain configuration`);
console.log(`   5. Update Google Search Console`);
console.log(`   6. Update Google Analytics property`);
console.log(`   7. Commit and deploy\n`);

