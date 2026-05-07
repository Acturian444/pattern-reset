#!/usr/bin/env node

/**
 * Remove .html extensions from URLs in all HTML files and sitemap
 * Updates: canonical URLs, OG URLs, structured data URLs, sitemap URLs
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    // Main pages
    'index.html',
    'letitout.html',
    'info.html',
    'theheartroom.html',
    'makers.html',
    'legal.html',
    
    // Product pages
    'product/balance-earrings.html',
    'product/reminder-tshirt.html',
    'product/self-love-bracelet.html',
    'product/power-earrings.html',
    
    // Shop and course
    'shop/index.html',
    
    // SEO files
    'sitemap.xml'
];

// Patterns to replace - remove .html from URLs
const replacements = [
    // Canonical URLs: href="https://mypatternreset.com/page.html" → href="https://mypatternreset.com/page"
    {
        pattern: /(href="https:\/\/mypatternreset\.com\/[^"]+)\.html(")/g,
        replacement: '$1$2'
    },
    // OG URLs: content="https://mypatternreset.com/page.html" → content="https://mypatternreset.com/page"
    {
        pattern: /(content="https:\/\/mypatternreset\.com\/[^"]+)\.html(")/g,
        replacement: '$1$2'
    },
    // Structured data URLs: "url": "https://mypatternreset.com/page.html" → "url": "https://mypatternreset.com/page"
    {
        pattern: /("url":\s*"https:\/\/mypatternreset\.com\/[^"]+)\.html(")/g,
        replacement: '$1$2'
    },
    // Structured data item URLs: "item": "https://mypatternreset.com/page.html" → "item": "https://mypatternreset.com/page"
    {
        pattern: /("item":\s*"https:\/\/mypatternreset\.com\/[^"]+)\.html(")/g,
        replacement: '$1$2'
    },
    // Sitemap URLs: <loc>https://mypatternreset.com/page.html</loc> → <loc>https://mypatternreset.com/page</loc>
    {
        pattern: /(<loc>https:\/\/mypatternreset\.com\/[^<]+)\.html(<\/loc>)/g,
        replacement: '$1$2'
    }
];

let totalFiles = 0;
let totalReplacements = 0;
const changes = [];

console.log(`\n🔄 Removing .html extensions from URLs...\n`);

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

console.log(`\n✨ URL cleanup complete!`);
console.log(`\n📌 Note: Vercel redirects in vercel.json already handle clean URLs`);
console.log(`   (e.g., /letitout → /letitout.html)\n`);

