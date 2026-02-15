#!/usr/bin/env node

/**
 * Migration Script for Standalone Project
 * 
 * Usage: node migrate.js
 * 
 * This script helps automate the migration process by:
 * 1. Finding all files that need updates
 * 2. Creating a report of what needs to be changed
 * 3. Optionally performing find/replace operations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
// NOTE: This project is now Pattern Reset. OLD_CONFIG below represents
// the legacy pre-migration setup (no longer in use). GA G-ZEZQRBTLR7
// is the pattern-reset property @ analytics.google.com.

const OLD_CONFIG = {
    domain: 'joinheartmatters.com',
    brandName: 'Heart Matters',
    brandNameTM: 'Heart Matters™',
    googleAnalyticsId: 'G-ZEZQRBTLR7',
    contactEmail: 'info@joinheartmatters.com',
    instagram: 'heartmatters__',
    tiktok: '@heartmatters__',
    firebaseProjectId: 'heart-matters-ceb3a'
};

const NEW_CONFIG = {
    domain: 'YOURNEWDOMAIN.com',           // ⚠️ UPDATE THIS
    brandName: 'Your New Brand',            // ⚠️ UPDATE THIS
    brandNameTM: 'Your New Brand™',         // ⚠️ UPDATE THIS
    googleAnalyticsId: 'G-XXXXXXXXXX',     // ⚠️ UPDATE THIS
    contactEmail: 'hello@yournewsite.com', // ⚠️ UPDATE THIS
    instagram: 'yourhandle',                // ⚠️ UPDATE THIS
    tiktok: '@yourhandle',                  // ⚠️ UPDATE THIS
    firebaseProjectId: 'your-new-project'   // ⚠️ UPDATE THIS
};

// ============================================
// FILE PATTERNS TO SEARCH
// ============================================

const FILE_PATTERNS = [
    '**/*.html',
    '**/*.js',
    '**/*.css',
    '**/*.xml',
    '**/*.txt',
    '**/*.json',
    '**/*.md'
];

const EXCLUDE_DIRS = [
    'node_modules',
    '.git',
    'product_backup',
    'tests',
    'tests/letitout'
];

// ============================================
// REPLACEMENT PATTERNS
// ============================================

const REPLACEMENTS = [
    // Domain replacements
    { old: `https://www.${OLD_CONFIG.domain}`, new: `https://www.${NEW_CONFIG.domain}` },
    { old: `http://www.${OLD_CONFIG.domain}`, new: `https://www.${NEW_CONFIG.domain}` },
    { old: `www.${OLD_CONFIG.domain}`, new: `www.${NEW_CONFIG.domain}` },
    { old: OLD_CONFIG.domain, new: NEW_CONFIG.domain },
    
    // Brand name replacements
    { old: OLD_CONFIG.brandNameTM, new: NEW_CONFIG.brandNameTM },
    { old: OLD_CONFIG.brandName, new: NEW_CONFIG.brandName },
    
    // Analytics
    { old: OLD_CONFIG.googleAnalyticsId, new: NEW_CONFIG.googleAnalyticsId },
    
    // Email
    { old: OLD_CONFIG.contactEmail, new: NEW_CONFIG.contactEmail },
    
    // Social media
    { old: `instagram.com/${OLD_CONFIG.instagram}`, new: `instagram.com/${NEW_CONFIG.instagram}` },
    { old: `@${OLD_CONFIG.instagram}`, new: `@${NEW_CONFIG.instagram}` },
    { old: OLD_CONFIG.tiktok, new: NEW_CONFIG.tiktok },
    
    // Firebase
    { old: OLD_CONFIG.firebaseProjectId, new: NEW_CONFIG.firebaseProjectId }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        // Skip excluded directories
        if (EXCLUDE_DIRS.some(exclude => filePath.includes(exclude))) {
            return;
        }
        
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            // Only process text-based files
            const ext = path.extname(file);
            if (['.html', '.js', '.css', '.xml', '.txt', '.json', '.md'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

function findMatches(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = [];
    
    REPLACEMENTS.forEach(({ old, new: newVal }) => {
        if (content.includes(old)) {
            matches.push({
                file: filePath,
                old: old,
                new: newVal,
                count: (content.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
            });
        }
    });
    
    return matches;
}

function performReplacements(filePath, dryRun = true) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    const changes = [];
    
    REPLACEMENTS.forEach(({ old, new: newVal }) => {
        if (content.includes(old)) {
            const count = (content.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            if (!dryRun) {
                content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVal);
            }
            changes.push({ old, new: newVal, count });
            changed = true;
        }
    });
    
    if (changed && !dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
    
    return { changed, changes };
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
    console.log('🔍 Migration Script for Standalone Project\n');
    console.log('=' .repeat(60));
    console.log('OLD CONFIG:');
    console.log(JSON.stringify(OLD_CONFIG, null, 2));
    console.log('\nNEW CONFIG:');
    console.log(JSON.stringify(NEW_CONFIG, null, 2));
    console.log('=' .repeat(60));
    console.log('\n');
    
    // Check if NEW_CONFIG has placeholder values
    const hasPlaceholders = Object.values(NEW_CONFIG).some(val => 
        val.includes('YOUR') || val.includes('XXXX') || val.includes('your')
    );
    
    if (hasPlaceholders) {
        console.log('⚠️  WARNING: You have placeholder values in NEW_CONFIG!');
        console.log('   Please update NEW_CONFIG in migrate.js before running.\n');
        return;
    }
    
    console.log('📂 Scanning files...\n');
    
    const allFiles = getAllFiles('.');
    const filesWithMatches = [];
    
    allFiles.forEach(file => {
        const matches = findMatches(file);
        if (matches.length > 0) {
            filesWithMatches.push({ file, matches });
        }
    });
    
    console.log(`Found ${filesWithMatches.length} files that need updates:\n`);
    
    // Group by replacement type
    const summary = {};
    filesWithMatches.forEach(({ file, matches }) => {
        matches.forEach(match => {
            if (!summary[match.old]) {
                summary[match.old] = { files: [], totalCount: 0 };
            }
            summary[match.old].files.push(file);
            summary[match.old].totalCount += match.count;
        });
    });
    
    // Display summary
    Object.entries(summary).forEach(([old, data]) => {
        const replacement = REPLACEMENTS.find(r => r.old === old);
        console.log(`\n📝 "${old}" → "${replacement.new}"`);
        console.log(`   Found in ${data.files.length} files (${data.totalCount} total occurrences)`);
        if (data.files.length <= 10) {
            data.files.forEach(f => console.log(`   - ${f}`));
        } else {
            data.files.slice(0, 5).forEach(f => console.log(`   - ${f}`));
            console.log(`   ... and ${data.files.length - 5} more files`);
        }
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log('\n💡 To perform replacements, run:');
    console.log('   node migrate.js --apply\n');
    console.log('⚠️  Make sure to backup your project first!');
}

// ============================================
// APPLY REPLACEMENTS
// ============================================

if (process.argv.includes('--apply')) {
    console.log('🔄 Applying replacements...\n');
    
    const allFiles = getAllFiles('.');
    let totalChanged = 0;
    
    allFiles.forEach(file => {
        const result = performReplacements(file, false);
        if (result.changed) {
            totalChanged++;
            console.log(`✅ Updated: ${file}`);
            result.changes.forEach(change => {
                console.log(`   - "${change.old}" → "${change.new}" (${change.count} occurrences)`);
            });
        }
    });
    
    console.log(`\n✨ Done! Updated ${totalChanged} files.`);
} else {
    main();
}

