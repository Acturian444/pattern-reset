// Results Modal Overlay System
// Full-screen scrollable modal for quiz results
(function() {
    'use strict';
    
    // Declare functions first so they can be assigned to window early
    let showResultsModal, closeResultsModal, loadAndRenderResults;
    
    // Check if results modal should auto-show (from URL parameter)
    function shouldAutoShow() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('results') === 'true';
    }
    
    // Lock body scroll
    function lockBodyScroll() {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.dataset.scrollY = scrollY;
    }
    
    // Unlock body scroll
    function unlockBodyScroll() {
        const scrollY = document.body.dataset.scrollY || 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY, 10));
        delete document.body.dataset.scrollY;
    }
    
    // Load pattern data (needs to match quiz-data.js structure)
    function loadPatternData() {
        // This will be loaded from quiz-data.js or duplicated here
        // For now, we'll need to ensure this data is available
        // The results-renderer.js will handle the actual rendering
        return null; // Will be loaded dynamically
    }
    
    // Show results modal
    showResultsModal = function() {
        // Check if quiz was completed
        const savedState = localStorage.getItem('patternResetQuizState');
        if (!savedState) {
            console.warn('No quiz results found');
            alert('No quiz results found. Please complete the quiz first.');
            return false;
        }
        
        let state;
        try {
            state = JSON.parse(savedState);
        } catch (e) {
            console.error('Error parsing quiz state:', e);
            alert('Error loading quiz results. Please try completing the quiz again.');
            return false;
        }
        
        // Check if quiz is completed - allow viewing even if form not submitted yet
        if (!state.quizCompleted) {
            console.warn('Quiz not completed');
            alert('Please complete the quiz first to view your results.');
            return false;
        }
        
        // Note: We allow viewing results even if form not submitted
        // The form submission is optional for viewing results
        
        // Remove existing modal if present
        const existingModal = document.getElementById('results-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Lock body scroll
        lockBodyScroll();
        
        // Function to hide theme toggle - call immediately and repeatedly
        // Also hide any elements with theme-toggle class or id
        const hideThemeToggle = () => {
            // Try multiple selectors to find the toggle
            const themeToggleById = document.getElementById('theme-toggle');
            const themeToggleByClass = document.querySelector('.theme-toggle-btn');
            const themeToggle = themeToggleById || themeToggleByClass;
            
            if (themeToggle) {
                // Store original computed styles only if not already stored
                if (!themeToggle.hasAttribute('data-original-display')) {
                    const computedStyle = window.getComputedStyle(themeToggle);
                    themeToggle.setAttribute('data-original-display', computedStyle.display);
                    themeToggle.setAttribute('data-original-visibility', computedStyle.visibility);
                    themeToggle.setAttribute('data-original-opacity', computedStyle.opacity);
                    themeToggle.setAttribute('data-original-z-index', computedStyle.zIndex);
                    themeToggle.setAttribute('data-original-position', computedStyle.position);
                    themeToggle.setAttribute('data-original-left', computedStyle.left);
                    themeToggle.setAttribute('data-original-top', computedStyle.top);
                    themeToggle.setAttribute('data-original-width', computedStyle.width);
                    themeToggle.setAttribute('data-original-height', computedStyle.height);
                }
                
                // Completely hide with inline styles (highest specificity)
                themeToggle.style.setProperty('display', 'none', 'important');
                themeToggle.style.setProperty('visibility', 'hidden', 'important');
                themeToggle.style.setProperty('opacity', '0', 'important');
                themeToggle.style.setProperty('pointer-events', 'none', 'important');
                themeToggle.style.setProperty('z-index', '-9999', 'important');
                themeToggle.style.setProperty('position', 'fixed', 'important');
                themeToggle.style.setProperty('left', '-9999px', 'important');
                themeToggle.style.setProperty('top', '-9999px', 'important');
                themeToggle.style.setProperty('width', '0', 'important');
                themeToggle.style.setProperty('height', '0', 'important');
                themeToggle.style.setProperty('overflow', 'hidden', 'important');
                themeToggle.style.setProperty('clip', 'rect(0, 0, 0, 0)', 'important');
                themeToggle.style.setProperty('clip-path', 'inset(50%)', 'important');
                themeToggle.setAttribute('data-hidden-by-modal', 'true');
            }
            
            // Also hide any theme toggle buttons that might be in the modal content
            const modalContent = document.getElementById('results-modal-content');
            if (modalContent) {
                const togglesInModal = modalContent.querySelectorAll('#theme-toggle, .theme-toggle-btn');
                togglesInModal.forEach(toggle => {
                    toggle.style.setProperty('display', 'none', 'important');
                    toggle.style.setProperty('visibility', 'hidden', 'important');
                    toggle.remove();
                });
            }
        };
        
        // Hide toggle immediately
        hideThemeToggle();
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'results-modal-overlay';
        overlay.className = 'results-modal-overlay';
        
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'results-modal-container';
        
        // Hide toggle again after overlay is created
        hideThemeToggle();
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'results-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close results');
        closeBtn.onclick = closeResultsModal;
        
        // Create scrollable content wrapper
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'results-modal-scroll-wrapper';
        
        // Create content container
        const content = document.createElement('div');
        content.id = 'results-modal-content';
        content.className = 'results-modal-content';
        
        // Assemble modal
        scrollWrapper.appendChild(content);
        modal.appendChild(closeBtn);
        modal.appendChild(scrollWrapper);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Remove any theme toggle buttons from modal container (in case they were cloned)
        const togglesInModal = modal.querySelectorAll('#theme-toggle, .theme-toggle-btn, button[id*="theme"], button[class*="theme-toggle"]');
        togglesInModal.forEach(toggle => {
            console.log('Removing theme toggle from modal:', toggle);
            toggle.remove();
        });
        
        // Hide toggle immediately after overlay is added to DOM
        hideThemeToggle();
        
        // Force immediate reflow to ensure overlay is in DOM
        overlay.offsetHeight;
        
        // Load and render results
        loadAndRenderResults(content);
        
        // Hide toggle again after content loads
        setTimeout(hideThemeToggle, 50);
        
        // Set up MutationObserver to catch toggle if it's added later or styles change
        const toggleObserver = new MutationObserver((mutations) => {
            // Check if toggle was added or modified
            const themeToggleById = document.getElementById('theme-toggle');
            const themeToggleByClass = document.querySelector('.theme-toggle-btn');
            const themeToggle = themeToggleById || themeToggleByClass;
            
            if (themeToggle) {
                const computedStyle = window.getComputedStyle(themeToggle);
                const isVisible = computedStyle.display !== 'none' && 
                                 computedStyle.visibility !== 'hidden' &&
                                 computedStyle.opacity !== '0';
                if (isVisible) {
                    console.log('Theme toggle detected as visible, hiding it');
                    hideThemeToggle();
                }
            }
            
            // Also check if toggle was added to modal
            const modalContent = document.getElementById('results-modal-content');
            if (modalContent) {
                const togglesInModal = modalContent.querySelectorAll('#theme-toggle, .theme-toggle-btn');
                togglesInModal.forEach(toggle => {
                    console.log('Removing theme toggle from modal content:', toggle);
                    toggle.remove();
                });
            }
        });
        
        // Observe body and document for any additions/changes
        toggleObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id']
        });
        
        // Also observe document head in case styles are added
        toggleObserver.observe(document.head, {
            childList: true,
            subtree: true
        });
        
        // Store observer on overlay for cleanup
        overlay._toggleObserver = toggleObserver;
        
        // Show modal with animation
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            // Hide toggle multiple times during animation to ensure it stays hidden
            setTimeout(hideThemeToggle, 50);
            setTimeout(hideThemeToggle, 100);
            setTimeout(hideThemeToggle, 200);
            setTimeout(hideThemeToggle, 300);
        });
        
        // Close on backdrop click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeResultsModal();
            }
        });
        
        // Close on ESC key
        const escHandler = function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                closeResultsModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };
    
    // Assign to window immediately after definition (before other code runs)
    try {
        if (typeof window !== 'undefined') {
            window.showResultsModal = showResultsModal;
        }
    } catch (e) {
        console.error('Error assigning showResultsModal:', e);
    }
    
    // Close results modal
    closeResultsModal = function() {
        const overlay = document.getElementById('results-modal-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            
            // Stop observing
            if (overlay._toggleObserver) {
                overlay._toggleObserver.disconnect();
                delete overlay._toggleObserver;
            }
            
            // Restore theme toggle if it was hidden by modal
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle && themeToggle.getAttribute('data-hidden-by-modal') === 'true') {
                // Remove all inline styles (which will restore to CSS defaults)
                themeToggle.style.removeProperty('display');
                themeToggle.style.removeProperty('visibility');
                themeToggle.style.removeProperty('opacity');
                themeToggle.style.removeProperty('pointer-events');
                themeToggle.style.removeProperty('z-index');
                themeToggle.style.removeProperty('position');
                themeToggle.style.removeProperty('left');
                themeToggle.style.removeProperty('top');
                themeToggle.style.removeProperty('width');
                themeToggle.style.removeProperty('height');
                themeToggle.style.removeProperty('overflow');
                
                // Remove all data attributes
                themeToggle.removeAttribute('data-hidden-by-modal');
                themeToggle.removeAttribute('data-original-display');
                themeToggle.removeAttribute('data-original-visibility');
                themeToggle.removeAttribute('data-original-opacity');
                themeToggle.removeAttribute('data-original-z-index');
                themeToggle.removeAttribute('data-original-position');
                themeToggle.removeAttribute('data-original-left');
                themeToggle.removeAttribute('data-original-top');
                themeToggle.removeAttribute('data-original-width');
                themeToggle.removeAttribute('data-original-height');
            }
            
            setTimeout(() => {
                overlay.remove();
                unlockBodyScroll();
            }, 300); // Match animation duration
        }
    };
    
    // Assign to window immediately after definition
    try {
        if (typeof window !== 'undefined') {
            window.closeResultsModal = closeResultsModal;
        }
    } catch (e) {
        console.error('Error assigning closeResultsModal:', e);
    }
    
    // Load and render results
    loadAndRenderResults = function(container) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #666;">Loading your results...</div>';
        
        // Load quiz data and patterns
        // We need to load from quiz-data.js or duplicate the data
        // For now, we'll use the results-renderer.js module
        setTimeout(() => {
            try {
                const savedState = localStorage.getItem('patternResetQuizState');
                if (!savedState) {
                    container.innerHTML = '<div class="no-results"><h2>No Results Found</h2><p>Please complete the quiz first.</p></div>';
                    return;
                }
                
                const state = JSON.parse(savedState);
                
                // Allow viewing results if quiz is completed, even if form not submitted
                if (!state.quizCompleted) {
                    container.innerHTML = '<div class="no-results"><h2>Quiz Not Completed</h2><p>Please complete the quiz to view your results.</p></div>';
                    return;
                }
                
                // Recalculate results
                const driverScores = state.driverScores || {
                    'control': 0,
                    'avoidance': 0,
                    'validation': 0,
                    'fear-of-rejection': 0
                };
                
                const totalScore = state.totalScore || 0;
                
                // Calculate driver percentages
                const driverPercentages = {};
                Object.keys(driverScores).forEach(driver => {
                    driverPercentages[driver] = totalScore > 0 ? Math.round((driverScores[driver] / totalScore) * 100) : 0;
                });
                
                // Get pattern key
                let patternKey = state.patternKey || null;
                
                if (!patternKey) {
                    const sortedDrivers = Object.entries(driverScores).sort((a, b) => b[1] - a[1]);
                    const dominantDriver = sortedDrivers[0][0];
                    const driverPatternMap = {
                        'control': 'fixer',
                        'validation': 'performer',
                        'avoidance': 'avoider',
                        'fear-of-rejection': 'withdrawer'
                    };
                    patternKey = driverPatternMap[dominantDriver] || 'fixer';
                }
                
                const sortedDrivers = Object.entries(driverScores).sort((a, b) => b[1] - a[1]);
                const dominantDriver = sortedDrivers[0][0];
                
                // Load pattern and archetype data
                // Check if quiz data is available globally
                if (typeof window.personalityPatterns === 'undefined' || typeof window.archetypeCategories === 'undefined') {
                    container.innerHTML = '<div class="no-results"><h2>Error Loading Results</h2><p>Quiz data not loaded. Please refresh the page.</p></div>';
                    return;
                }
                
                // Map pattern keys from index.html to results.html structure if needed
                const patternKeyMap = {
                    'guarded-one': 'withdrawer',
                    'pleaser': 'people-pleaser',
                    'escaper': 'avoider',
                    'overgiver': 'perfectionist' // Fallback, may need adjustment
                };
                
                // Try to get pattern with mapped key first, then original key
                let pattern = window.personalityPatterns[patternKeyMap[patternKey]] || window.personalityPatterns[patternKey];
                const archetype = window.archetypeCategories[dominantDriver];
                
                if (!pattern || !archetype) {
                    console.error('Pattern not found:', patternKey, 'Available patterns:', Object.keys(window.personalityPatterns));
                    container.innerHTML = '<div class="no-results"><h2>Error Loading Results</h2><p>Pattern data not found. Pattern key: ' + patternKey + '</p><p>Available: ' + Object.keys(window.personalityPatterns).join(', ') + '</p></div>';
                    return;
                }
                
                // If pattern is missing required properties (from index.html structure), add fallbacks
                // index.html patterns have: name, coreBelief, strength, shadow, resetFocus, identity, cta
                // results.html patterns have: name, coreBelief, strength, shadow, resetFocus, resetFocusDescription, love, money, health, identity, childhood, relationships
                if (!pattern.love) {
                    pattern.love = pattern.identity || 'Your pattern shows up in how you navigate relationships and connections.';
                }
                if (!pattern.money) {
                    pattern.money = 'Your pattern influences how you approach financial decisions and money management.';
                }
                if (!pattern.health) {
                    pattern.health = 'Your pattern affects your health routines and daily habits.';
                }
                if (!pattern.childhood) {
                    pattern.childhood = 'Your pattern likely developed from early experiences and childhood patterns that shaped how you navigate the world.';
                }
                if (!pattern.relationships) {
                    pattern.relationships = pattern.identity || 'Your pattern influences how you connect with others and navigate relationships.';
                }
                if (!pattern.resetFocusDescription) {
                    pattern.resetFocusDescription = pattern.cta || 'Practice this focus area to break your pattern and create lasting change.';
                }
                
                // Ensure shadow format matches (index.html uses "→" while renderer expects " → ")
                if (pattern.shadow && !pattern.shadow.includes(' → ')) {
                    pattern.shadow = pattern.shadow.replace('→', ' → ').replace('→', ' → ');
                }
                
                // Calculate pattern dominance
                const dominantScore = sortedDrivers[0][1];
                const patternDominance = totalScore > 0 ? Math.round((dominantScore / totalScore) * 100) : 0;
                
                function getDominanceLabel(dominance) {
                    if (dominance >= 70) return 'Strong';
                    if (dominance >= 50) return 'Moderate';
                    if (dominance >= 30) return 'Balanced';
                    return 'Mixed';
                }
                const dominanceLabel = getDominanceLabel(patternDominance);
                
                // Get personalization data
                const birthDate = state.birthDate || null;
                const relationshipStatus = state.relationshipStatus || null;
                
                function calculateExactAge(birthDate) {
                    if (!birthDate) return null;
                    const birth = new Date(birthDate);
                    const today = new Date();
                    let age = today.getFullYear() - birth.getFullYear();
                    const monthDiff = today.getMonth() - birth.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                        age--;
                    }
                    return age;
                }
                
                const exactAge = calculateExactAge(birthDate);
                const fullName = state.userName || '';
                const firstName = fullName.split(' ')[0] || 'there';
                
                // Debug logging
                console.log('Pattern data:', pattern);
                console.log('Pattern key:', patternKey);
                console.log('Pattern has love?', !!pattern.love);
                console.log('Pattern has money?', !!pattern.money);
                
                // Create sortedDrivers array with percentages (not raw scores)
                const sortedDriversWithPercentages = Object.entries(driverPercentages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([driver, percentage]) => [driver, percentage]);
                
                // Use ResultsRenderer if available, otherwise render directly
                if (window.ResultsRenderer && window.ResultsRenderer.renderFullResults) {
                    try {
                        window.ResultsRenderer.renderFullResults(container, {
                            pattern: pattern,
                            archetype: archetype,
                            patternDominance: patternDominance,
                            dominanceLabel: dominanceLabel,
                            driverPercentages: driverPercentages,
                            totalScore: totalScore,
                            exactAge: exactAge,
                            relationshipStatus: relationshipStatus,
                            firstName: firstName,
                            birthDate: birthDate,
                            sortedDrivers: sortedDriversWithPercentages,
                            answers: state.answers || [], // Pass answers for personalized story
                            driverScores: driverScores,
                            quizData: window.quizData || [], // Pass quiz data for daily examples
                            driverNames: {
                                'control': 'Control',
                                'avoidance': 'Avoidance',
                                'validation': 'Validation',
                                'fear-of-rejection': 'Fear of Rejection'
                            },
                            driverDescriptions: {
                                'control': 'You seek safety through taking charge and solving problems.',
                                'avoidance': 'You avoid difficult emotions by staying free and flexible.',
                                'validation': 'You seek approval through achievement and recognition.',
                                'fear-of-rejection': 'You protect yourself by keeping distance and being perfect.'
                            }
                        });
                        
                        // Initialize workbook downloads, invite button, journaling, and pill selector after results are rendered
                        setTimeout(() => {
                            initWorkbookDownloads(container, pattern, firstName);
                            initInviteQuizButton(container);
                            initJournaling(container, pattern);
                            initWorkbookPills(container, pattern);
                        }, 500);
                    } catch (e) {
                        console.error('Error rendering results:', e);
                        container.innerHTML = '<div class="no-results"><h2>Error Rendering Results</h2><p>' + e.message + '</p></div>';
                    }
                } else {
                    // Fallback: render simplified version
                    container.innerHTML = '<div class="no-results"><h2>Results Renderer Not Loaded</h2><p>Please refresh the page.</p></div>';
                }
            } catch (e) {
                console.error('Error loading results:', e);
                container.innerHTML = '<div class="no-results"><h2>Error Loading Results</h2><p>Please try again later.</p></div>';
            }
        }, 100);
    }
    
    
    // Add PDF download button to results
    function addPDFDownloadButton(container, pattern, firstName) {
        // Check if button already exists
        if (document.getElementById('pdf-download-btn')) {
            return;
        }
        
        // Find the header section to insert button after
        const header = container.querySelector('.results-header');
        if (!header) {
            return;
        }
        
        // Create wrapper div for centering
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'text-align: center; width: 100%; margin: 1.5rem 0 2rem 0;';
        
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'pdf-download-btn';
        downloadBtn.className = 'pdf-download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF Report';
        downloadBtn.setAttribute('aria-label', 'Download PDF report');
        
        // Add click handler
        downloadBtn.onclick = function() {
            downloadPDFReport(container, pattern, firstName);
        };
        
        // Add button to wrapper
        buttonWrapper.appendChild(downloadBtn);
        
        // Insert wrapper after header
        header.insertAdjacentElement('afterend', buttonWrapper);
        
        // Initialize workbook download buttons in Your Next Step section
        initWorkbookDownloads(container, pattern, firstName);
        // Initialize invite quiz button
        initInviteQuizButton(container);
    }
    
    // Initialize workbook download buttons (full report, workbook)
    function initWorkbookDownloads(container, pattern, firstName) {
        const downloadButtons = container.querySelectorAll('.workbook-download-btn');
        downloadButtons.forEach(btn => {
            const downloadType = btn.getAttribute('data-download-type');
            btn.onclick = function() {
                if (downloadType === 'full-report') {
                    downloadPDFReport(container, pattern, firstName);
                } else if (downloadType === 'workbook') {
                    downloadWorkbookPDF(container, pattern, firstName);
                }
            };
        });
    }

    // Initialize invite quiz button - copy quiz link to clipboard
    function initInviteQuizButton(container) {
        const btn = container.querySelector('#cta-invite-quiz-btn');
        if (!btn) return;
        const quizUrl = window.location.origin + (window.location.pathname || '/') + '#quiz-section';
        btn.onclick = function() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(quizUrl).then(function() {
                    showInviteToast(container, 'Link copied! Send it to anyone who would benefit.');
                    const textSpan = btn.querySelector('.cta-invite-btn-text');
                    if (textSpan) {
                        textSpan.textContent = 'Copied!';
                        setTimeout(function() { textSpan.textContent = 'Copy Quiz Link'; }, 2000);
                    }
                }).catch(function() {
                    fallbackCopyQuizLink(quizUrl, container, btn);
                });
            } else {
                fallbackCopyQuizLink(quizUrl, container, btn);
            }
        };
    }

    function fallbackCopyQuizLink(url, container, btn) {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            showInviteToast(container, 'Link copied! Send it to anyone who would benefit.');
            const textSpan = btn.querySelector('.cta-invite-btn-text');
            if (textSpan) {
                textSpan.textContent = 'Copied!';
                setTimeout(function() { textSpan.textContent = 'Copy Quiz Link'; }, 2000);
            }
        } catch (e) {
            showInviteToast(container, 'Could not copy. Share this link: ' + url, true);
        }
        document.body.removeChild(ta);
    }

    function showInviteToast(container, message, isError) {
        const existing = container.querySelector('.cta-invite-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'cta-invite-toast' + (isError ? ' cta-invite-toast-error' : '');
        toast.textContent = message;
        const inviteCard = container.querySelector('.cta-invite-container');
        if (inviteCard) {
            inviteCard.style.position = 'relative';
            inviteCard.appendChild(toast);
            setTimeout(function() {
                if (toast.parentNode) toast.classList.add('cta-invite-toast-visible');
            }, 10);
            setTimeout(function() {
                toast.classList.remove('cta-invite-toast-visible');
                setTimeout(function() {
                    if (toast.parentNode) toast.remove();
                }, 300);
            }, 3000);
        }
    }
    
    // Helper function to wait for fonts and content to be ready
    function waitForContentReady(callback, maxWait = 2000) {
        // Wait for fonts to load and DOM to be ready
        // Use document.fonts.ready if available, otherwise use timeout
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                setTimeout(callback, 300); // Small delay for rendering
            }).catch(() => {
                // Fallback if fonts API fails
                setTimeout(callback, 500);
            });
        } else {
            // Fallback: wait reasonable time for fonts/content
            setTimeout(callback, 500);
        }
    }
    
    // Download Workbook PDF (How to Break Your Pattern section with user answers)
    function downloadWorkbookPDF(container, pattern, firstName) {
        if (typeof html2pdf === 'undefined') {
            alert('PDF generation library not loaded. Please refresh the page and try again.');
            return;
        }
        
        const btn = container.querySelector('.workbook-download-btn[data-download-type="workbook"]');
        const originalHTML = btn ? btn.innerHTML : '';
        if (btn) {
            btn.innerHTML = '<span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span><span class="btn-text"><span class="btn-title">Generating...</span></span>';
            btn.disabled = true;
        }
        
        // Wait for content to be ready
        waitForContentReady(() => {
            setTimeout(() => {
                try {
                    // Get the workbook outer box (visible container, Parts 1–4 collapsible inside)
                    const workbookBox = container.querySelector('.workbook-outer-box');
                    if (!workbookBox) {
                        alert('Workbook section not found. Please ensure the Pattern Reset Workbook is visible in the results.');
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }
                        return;
                    }
                
                    // Clone the workbook section
                    const workbookClone = workbookBox.cloneNode(true);
                    
                    // Expand all collapsible parts (details) so PDF includes full content
                    workbookClone.querySelectorAll('details.workbook-part-details').forEach(d => d.setAttribute('open', ''));
                    
                    // Ensure all nested content is visible
                    workbookClone.querySelectorAll('*').forEach(el => {
                        if (el.style) {
                            if (el.style.display === 'none') el.style.display = 'block';
                            if (el.style.visibility === 'hidden') el.style.visibility = 'visible';
                            if (el.style.opacity === '0') el.style.opacity = '1';
                        }
                    });
                
                    // Get all journal entries from localStorage
                    const storageKey = 'patternReset_journal_' + pattern.name;
                    let journalData = {};
                    try {
                        const raw = localStorage.getItem(storageKey);
                        if (raw) journalData = JSON.parse(raw);
                    } catch (e) {
                        console.warn('Could not load journal data:', e);
                    }
                    
                    // Replace journal UI with actual answers
                    workbookClone.querySelectorAll('[data-journal-id]').forEach(el => {
                        if (el.classList && el.classList.contains('workbook-pill-group')) {
                            const areasRaw = journalData['p1-life-pattern-merged-areas'];
                            const extra = journalData['p1-life-pattern-merged-extra'] || '';
                            let areas = [];
                            try {
                                if (areasRaw) areas = JSON.parse(areasRaw);
                            } catch (e) {}
                            const parts = [];
                            if (areas.length) parts.push('<strong>Areas:</strong> ' + areas.join(', '));
                            if (extra) parts.push('<strong>Anything else:</strong> ' + extra.replace(/\n/g, '<br>'));
                            const answerDiv = document.createElement('div');
                            answerDiv.style.cssText = 'margin-top: 0.5rem; padding: 1rem; background: rgba(202,0,19,0.05); border-radius: 6px; border-left: 3px solid #ca0013;';
                            answerDiv.innerHTML = '<strong style="color: #ca0013; font-size: 0.9rem;">Your Answer:</strong><p style="margin: 0.5rem 0 0; color: #333; line-height: 1.6;">' + (parts.length ? parts.join('<br>') : 'No selections yet') + '</p>';
                            el.replaceWith(answerDiv);
                            return;
                        }
                        const journalId = el.getAttribute('data-journal-id');
                        if (journalId === 'p1-life-pattern-merged-extra') return;
                        const answer = journalData[journalId];
                        const journalUI = el.querySelector('.journal-ui');
                        if (journalUI && answer) {
                            const answerDiv = document.createElement('div');
                            answerDiv.style.cssText = 'margin-top: 0.5rem; padding: 0.75rem; background: rgba(202,0,19,0.05); border-radius: 6px; border-left: 3px solid #ca0013;';
                            answerDiv.innerHTML = '<strong style="color: #ca0013; font-size: 0.9rem;">Your Answer:</strong><p style="margin: 0.5rem 0 0; color: #333; line-height: 1.6;">' + answer.replace(/\n/g, '<br>') + '</p>';
                            journalUI.replaceWith(answerDiv);
                        } else if (journalUI) {
                            journalUI.remove();
                        }
                    });

                    // Remove all buttons
                    workbookClone.querySelectorAll('button').forEach(b => b.remove());
                
                    // Create PDF container - position on-screen for html2canvas
                    const pdfContainer = document.createElement('div');
                    pdfContainer.id = 'workbook-pdf-temp';
                    pdfContainer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 816px;
                        min-height: 1056px;
                        padding: 48px;
                        background: #ffffff;
                        font-family: 'DM Sans', sans-serif;
                        color: #000000;
                        z-index: -1;
                        overflow: visible;
                        visibility: visible;
                        opacity: 1;
                        display: block;
                        pointer-events: none;
                    `;
                    
                    // Add header
                    const header = document.createElement('div');
                    header.style.cssText = 'margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #ca0013;';
                    header.innerHTML = `
                        <h1 style="font-size: 2rem; font-weight: 700; color: #ca0013; margin: 0 0 0.5rem;">Pattern Reset Workbook</h1>
                        <p style="font-size: 1.1rem; color: #666; margin: 0 0 0.25rem;"><strong>Pattern:</strong> ${pattern.name}</p>
                        <p style="font-size: 1rem; color: #666; margin: 0;"><strong>Primary Shift:</strong> ${pattern.resetFocus || 'Breaking your pattern'}</p>
                    `;
                    
                    pdfContainer.appendChild(header);
                    pdfContainer.appendChild(workbookClone);
                    document.body.appendChild(pdfContainer);
                    
                    // Force reflow
                    pdfContainer.offsetHeight;
                    
                    // Generate PDF with better options
                    const filename = `Pattern-Reset-Workbook-${pattern.name}-${firstName || 'Your'}.pdf`;
                    const opt = {
                        margin: [0.5, 0.5, 0.5, 0.5],
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { 
                            scale: 2, 
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            logging: false,
                            windowWidth: 816,
                            windowHeight: 1056
                        },
                        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                    };
                    
                    // Generate PDF as blob and force download
                    html2pdf().set(opt).from(pdfContainer).outputPdf('blob').then((pdfBlob) => {
                        // Create download link
                        const blobUrl = URL.createObjectURL(pdfBlob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = blobUrl;
                        downloadLink.download = filename;
                        downloadLink.style.display = 'none';
                        document.body.appendChild(downloadLink);
                        
                        // Trigger download
                        downloadLink.click();
                        
                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(downloadLink);
                            URL.revokeObjectURL(blobUrl);
                        }, 100);
                        
                        if (document.body.contains(pdfContainer)) {
                            document.body.removeChild(pdfContainer);
                        }
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }
                    }).catch(err => {
                        console.error('PDF generation error:', err);
                        if (document.body.contains(pdfContainer)) {
                            document.body.removeChild(pdfContainer);
                        }
                        alert('Error generating PDF. Please try again.');
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }
                    });
                } catch (e) {
                    console.error('Error generating workbook PDF:', e);
                    alert('Error generating workbook PDF: ' + (e.message || 'Unknown error'));
                    if (btn) {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                    }
                }
            }, 200);
        });
    }
    
    // Download Affirmation Card (Napoleon Hill style - personalized blueprint)
    function downloadAffirmationCard(container, pattern, firstName) {
        if (typeof html2pdf === 'undefined') {
            alert('PDF generation library not loaded. Please refresh the page and try again.');
            return;
        }
        
        const btn = container.querySelector('.workbook-download-btn[data-download-type="affirmation-card"]');
        const originalHTML = btn ? btn.innerHTML : '';
        if (btn) {
            btn.innerHTML = '<span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span><span class="btn-text"><span class="btn-title">Generating...</span></span>';
            btn.disabled = true;
        }
        
        // Wait for content to be ready
        waitForContentReady(() => {
            setTimeout(() => {
                try {
                    // Get user's journal data to extract their definite purpose, vision, etc.
                    const storageKey = 'patternReset_journal_' + pattern.name;
                    let journalData = {};
                    try {
                        const raw = localStorage.getItem(storageKey);
                        if (raw) journalData = JSON.parse(raw);
                    } catch (e) {
                        console.warn('Could not load journal data for affirmation card:', e);
                    }
                
                // Get pattern data
                const resetFocus = pattern.resetFocus || 'Breaking your pattern';
                let jump = null;
                if (window.PATTERN_JUMPSTART) {
                    jump = window.PATTERN_JUMPSTART[pattern.name] || window.PATTERN_JUMPSTART['The ' + pattern.name];
                }
                if (!jump) {
                    // Fallback: create basic jump data
                    const shPart = (pattern.shadow && pattern.shadow.split(' → ')[0]) ? pattern.shadow.split(' → ')[0].toLowerCase() : 'staying stuck';
                    const rf = pattern.resetFocus ? pattern.resetFocus.toLowerCase() : 'breaks this pattern';
                    jump = {
                        interrupt: 'What am I doing right now? Is it my pattern? What\'s one different choice?',
                        visionMVP: 'I\'m building toward being someone who ' + rf + '.',
                        antiVisionCompressed: 'I refuse to let my life become defined by ' + shPart + '.'
                    };
                }
                
                // Build affirmation card content (Napoleon Hill style)
                const definitePurpose = journalData['p0-intention'] || `I am breaking my ${pattern.name} pattern to create the life I want.`;
                const why = journalData['p0-why'] || 'Because I deserve freedom from this pattern.';
                const vision = journalData['p1-vision-1'] || 'I see myself living free from this pattern, making choices aligned with who I\'m becoming.';
                const identity = journalData['p2-desire-identity'] || journalData['p1-vision-2'] || 'I am someone who breaks my pattern.';
                const oneYear = journalData['p3-g-1yr'] || 'I will know I\'ve broken this pattern when I consistently choose differently.';
                
                // Create card HTML (wallet-sized, printable)
                const cardHTML = `
                    <div style="width: 3.375in; height: 2.125in; padding: 0.5in; background: #ffffff; border: 2px solid #ca0013; border-radius: 8px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;">
                        <div style="border-bottom: 1px solid #ca0013; padding-bottom: 0.25rem; margin-bottom: 0.5rem;">
                            <h2 style="font-size: 0.9rem; font-weight: 700; color: #ca0013; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">My Definite Purpose</h2>
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                            <p style="font-size: 0.65rem; line-height: 1.4; color: #000; margin: 0 0 0.4rem; font-weight: 600;">${definitePurpose}</p>
                            <div style="margin-top: auto;">
                                <p style="font-size: 0.55rem; color: #666; margin: 0.25rem 0; line-height: 1.3;"><strong>Why:</strong> ${why.length > 80 ? why.substring(0, 80) + '...' : why}</p>
                                <p style="font-size: 0.55rem; color: #666; margin: 0.25rem 0; line-height: 1.3;"><strong>Identity:</strong> ${identity.length > 60 ? identity.substring(0, 60) + '...' : identity}</p>
                                <p style="font-size: 0.5rem; color: #ca0013; margin: 0.5rem 0 0; font-weight: 600; text-align: center;">${pattern.name} Pattern Reset</p>
                            </div>
                        </div>
                    </div>
                `;
                
                // Create PDF container
                const pdfContainer = document.createElement('div');
                pdfContainer.id = 'affirmation-card-pdf-temp';
                pdfContainer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 8.5in;
                    height: 11in;
                    padding: 1in;
                    background: #ffffff;
                    font-family: 'DM Sans', sans-serif;
                    z-index: -1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                `;
                
                // Add instructions
                const instructions = document.createElement('div');
                instructions.style.cssText = 'text-align: center; margin-bottom: 1.5rem; max-width: 6in;';
                instructions.innerHTML = `
                    <h3 style="font-size: 1.2rem; color: #000; margin: 0 0 0.5rem;">Your Affirmation Card</h3>
                    <p style="font-size: 0.9rem; color: #666; margin: 0 0 0.75rem; line-height: 1.6;">Napoleon Hill recommended carrying a card with your definite purpose. Print this page, cut out the card, and carry it with you. Read it morning and evening.</p>
                    <div style="border-top: 1px solid #ddd; padding-top: 1rem; margin-top: 1rem;">
                        ${cardHTML}
                    </div>
                `;
                
                    pdfContainer.appendChild(instructions);
                    document.body.appendChild(pdfContainer);
                    
                    // Force reflow to ensure content is rendered
                    pdfContainer.offsetHeight;
                    
                    // Generate PDF with better options
                    const filename = `Affirmation-Card-${pattern.name}-${firstName || 'Your'}.pdf`;
                    const opt = {
                        margin: [0.5, 0.5, 0.5, 0.5],
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { 
                            scale: 2, 
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            logging: false,
                            windowWidth: 816,
                            windowHeight: 1056
                        },
                        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                    };
                    
                    // Generate PDF as blob and force download
                    html2pdf().set(opt).from(pdfContainer).outputPdf('blob').then((pdfBlob) => {
                        // Create download link
                        const blobUrl = URL.createObjectURL(pdfBlob);
                        const downloadLink = document.createElement('a');
                        downloadLink.href = blobUrl;
                        downloadLink.download = filename;
                        downloadLink.style.display = 'none';
                        document.body.appendChild(downloadLink);
                        
                        // Trigger download
                        downloadLink.click();
                        
                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(downloadLink);
                            URL.revokeObjectURL(blobUrl);
                        }, 100);
                        
                        if (document.body.contains(pdfContainer)) {
                            document.body.removeChild(pdfContainer);
                        }
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }
                    }).catch(err => {
                        console.error('PDF generation error:', err);
                        if (document.body.contains(pdfContainer)) {
                            document.body.removeChild(pdfContainer);
                        }
                        alert('Error generating PDF. Please try again.');
                        if (btn) {
                            btn.innerHTML = originalHTML;
                            btn.disabled = false;
                        }
                    });
                } catch (e) {
                    console.error('Error generating affirmation card:', e);
                    alert('Error generating affirmation card: ' + (e.message || 'Unknown error'));
                    if (btn) {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                    }
                }
            }, 200);
        });
    }
    
    // Journaling: expandable answer per prompt in "How to Break Your Pattern", persisted in localStorage
    function initJournaling(container, pattern) {
        if (!container || !pattern || !pattern.name) return;
        var storageKey = 'patternReset_journal_' + pattern.name;
        var data = {};
        try {
            var raw = localStorage.getItem(storageKey);
            if (raw) data = JSON.parse(raw);
        } catch (e) { data = {}; }
        function saveData() { try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (e) {} }
        var items = container.querySelectorAll('[data-journal-id]');
        var saveTimeouts = {};
        items.forEach(function(el) {
            if (el.classList && el.classList.contains('workbook-pill-group')) return;
            var id = el.getAttribute('data-journal-id');
            var ui = el.querySelector('.journal-ui');
            if (!ui) return;
            var entry = ui.querySelector('.journal-entry');
            var textarea = entry ? entry.querySelector('textarea.journal-textarea') : null;
            var savedIndicator = entry ? entry.querySelector('.journal-saved-indicator') : null;
            if (!entry || !textarea) return;
            
            // Load existing data
            if (data[id]) {
                textarea.value = data[id];
            }
            
            // Auto-save on input with debounce
            textarea.addEventListener('input', function() {
                var val = textarea.value.trim();
                if (val) {
                    data[id] = val;
                } else {
                    delete data[id];
                }
                
                // Clear existing timeout
                if (saveTimeouts[id]) {
                    clearTimeout(saveTimeouts[id]);
                }
                
                // Save after 500ms of no typing
                saveTimeouts[id] = setTimeout(function() {
                    saveData();
                    // Show saved indicator briefly
                    if (savedIndicator) {
                        savedIndicator.style.display = 'block';
                        setTimeout(function() {
                            savedIndicator.style.display = 'none';
                        }, 1500);
                    }
                }, 500);
            });
            
            // Auto-resize textarea
            textarea.addEventListener('input', function() {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
            
            // Set initial height
            if (textarea.value) {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            }
        });
    }

    // Workbook pill selector (Part 1 Q2): life areas + dynamic pains display when area selected
    function initWorkbookPills(container, pattern) {
        if (!container || !pattern || !pattern.name) return;
        var storageKey = 'patternReset_journal_' + pattern.name;
        var data = {};
        try {
            var raw = localStorage.getItem(storageKey);
            if (raw) data = JSON.parse(raw);
        } catch (e) { data = {}; }
        function saveData() { try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (e) {} }

        var group = container.querySelector('.workbook-pill-group[data-journal-id="p1-life-pattern-merged"]');
        if (!group) return;

        var areasKey = 'p1-life-pattern-merged-areas';
        var areasEl = group.querySelector('.workbook-pills[data-pill-group="areas"]');
        var painsContainer = group.querySelector('.workbook-pains-display-container');
        var painsLabel = painsContainer ? painsContainer.querySelector('.workbook-pains-area-names') : null;
        var painsPills = painsContainer ? painsContainer.querySelector('.workbook-pains-display-pills') : null;

        function refreshPainsDisplay() {
            if (!painsContainer || !painsPills || typeof window.getCombinedPainsByArea !== 'function') return;
            var selected = [];
            if (areasEl) {
                areasEl.querySelectorAll('.workbook-pill.selected').forEach(function(p) {
                    selected.push(p.getAttribute('data-value'));
                });
            }
            if (selected.length === 0) {
                painsContainer.style.display = 'none';
                return;
            }
            var seen = {};
            var pills = [];
            selected.forEach(function(area) {
                var combined = window.getCombinedPainsByArea(area, pattern.name);
                (combined || []).forEach(function(p) {
                    if (!seen[p]) { seen[p] = true; pills.push(p); }
                });
            });
            painsLabel.textContent = selected.join(', ');
            painsPills.innerHTML = pills.map(function(p) {
                return '<span class="workbook-pill workbook-pill-display">' + p + '</span>';
            }).join('');
            painsContainer.style.display = 'block';
        }

        function loadAndRestore() {
            var areas = [];
            try {
                if (data[areasKey]) areas = JSON.parse(data[areasKey]);
            } catch (e) {}
            if (areasEl) {
                areasEl.querySelectorAll('.workbook-pill').forEach(function(pill) {
                    var v = pill.getAttribute('data-value');
                    if (areas.indexOf(v) >= 0) pill.classList.add('selected');
                    else pill.classList.remove('selected');
                });
            }
            refreshPainsDisplay();
        }
        loadAndRestore();

        function onPillClick(container, key) {
            if (!container) return;
            container.querySelectorAll('.workbook-pill').forEach(function(pill) {
                pill.addEventListener('click', function() {
                    pill.classList.toggle('selected');
                    var vals = [];
                    container.querySelectorAll('.workbook-pill.selected').forEach(function(p) {
                        vals.push(p.getAttribute('data-value'));
                    });
                    data[key] = JSON.stringify(vals);
                    saveData();
                    if (key === areasKey) refreshPainsDisplay();
                });
            });
        }
        onPillClick(areasEl, areasKey);
    }

    // Generate and download PDF report
    function downloadPDFReport(container, pattern, firstName) {
        // Check if html2pdf is available
        if (typeof html2pdf === 'undefined') {
            alert('PDF generation library not loaded. Please refresh the page and try again.');
            return;
        }
        
        // Show loading state
        const downloadBtn = document.getElementById('pdf-download-btn');
        const originalText = downloadBtn ? downloadBtn.innerHTML : '';
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
            downloadBtn.disabled = true;
        }
        
        // Wait for content to be ready (fonts, rendering)
        waitForContentReady(() => {
            setTimeout(() => {
                try {
                    // Ensure container is visible and content is rendered
                    const modalContent = document.getElementById('results-modal-content');
                    const sourceContainer = modalContent || container;
                    
                    // Validate that sourceContainer exists and has content
                    if (!sourceContainer) {
                        throw new Error('Source container not found. Please ensure the results modal is open.');
                    }
                    
                    // Check if container has any meaningful content
                    const hasContent = sourceContainer.children.length > 0 || sourceContainer.textContent.trim().length > 0;
                    if (!hasContent) {
                        throw new Error('Source container is empty. Please wait for results to load.');
                    }
                    
                    console.log('Cloning content for PDF. Container has', sourceContainer.children.length, 'children');
                    
                    // Force visibility (don't modify original modal - only for cloning)
                    // Store original styles to restore later if needed
                    const originalVisibility = sourceContainer.style.visibility;
                    const originalOpacity = sourceContainer.style.opacity;
                    const originalDisplay = sourceContainer.style.display;
                    
                    // Temporarily ensure visibility for cloning
                    sourceContainer.style.visibility = 'visible';
                    sourceContainer.style.opacity = '1';
                    if (sourceContainer.style.display === 'none') {
                        sourceContainer.style.display = 'block';
                    }
                
                    // Create a deep clone of the entire content
                    const contentClone = sourceContainer.cloneNode(true);
                    
                    // Validate clone has content
                    if (!contentClone || contentClone.children.length === 0) {
                        throw new Error('Failed to clone content. Clone is empty.');
                    }
                    
                    console.log('Content cloned successfully. Clone has', contentClone.children.length, 'children');
                    
                    // Expand all accordions for PDF
                    const accordionItems = contentClone.querySelectorAll('.accordion-item');
                    accordionItems.forEach(item => {
                        const content = item.querySelector('.accordion-content');
                        const header = item.querySelector('.accordion-header');
                        if (content && header) {
                            // Force expand accordion
                            content.style.maxHeight = 'none';
                            content.style.height = 'auto';
                            content.style.padding = '1.5rem 2rem';
                            content.style.display = 'block';
                            content.style.visibility = 'visible';
                            content.style.opacity = '1';
                            content.classList.add('expanded');
                            
                            // Remove the accordion icon/arrow
                            const icon = header.querySelector('.accordion-icon');
                            if (icon) {
                                icon.style.display = 'none';
                            }
                        }
                    });
                    
                    // Expand life area accordions
                    const lifeAreaItems = contentClone.querySelectorAll('.life-area-accordion-item');
                    lifeAreaItems.forEach(item => {
                        const content = item.querySelector('.life-area-accordion-content');
                        if (content) {
                            content.style.maxHeight = 'none';
                            content.style.height = 'auto';
                            content.style.padding = '0 2rem 2rem 2rem';
                            content.style.display = 'block';
                            content.style.visibility = 'visible';
                            content.style.opacity = '1';
                            content.classList.add('expanded');
                        }
                    });
                    
                    // Expand driver details
                    const driverDetails = contentClone.querySelectorAll('.driver-details');
                    driverDetails.forEach(details => {
                        details.style.display = 'block';
                        details.style.maxHeight = 'none';
                        details.style.visibility = 'visible';
                        details.style.opacity = '1';
                    });
                    
                    // Get all journal entries from localStorage and replace journal UI with actual answers
                    const storageKey = 'patternReset_journal_' + pattern.name;
                    let journalData = {};
                    try {
                        const raw = localStorage.getItem(storageKey);
                        if (raw) journalData = JSON.parse(raw);
                    } catch (e) {
                        console.warn('Could not load journal data for PDF:', e);
                    }
                    
                    // Replace journal UI with actual answers in the cloned content
                    contentClone.querySelectorAll('[data-journal-id]').forEach(el => {
                        if (el.classList && el.classList.contains('workbook-pill-group')) {
                            const areasRaw = journalData['p1-life-pattern-merged-areas'];
                            const extra = journalData['p1-life-pattern-merged-extra'] || '';
                            let areas = [];
                            try {
                                if (areasRaw) areas = JSON.parse(areasRaw);
                            } catch (e) {}
                            const parts = [];
                            if (areas.length) parts.push('<strong>Areas:</strong> ' + areas.join(', '));
                            if (extra) parts.push('<strong>Anything else:</strong> ' + extra.replace(/\n/g, '<br>'));
                            const answerDiv = document.createElement('div');
                            answerDiv.style.cssText = 'margin-top: 0.5rem; padding: 1rem; background: rgba(202,0,19,0.05); border-radius: 6px; border-left: 3px solid #ca0013;';
                            answerDiv.innerHTML = '<strong style="color: #ca0013; font-size: 0.9rem;">Your Answer:</strong><p style="margin: 0.5rem 0 0; color: #333; line-height: 1.6;">' + (parts.length ? parts.join('<br>') : 'No selections yet') + '</p>';
                            el.replaceWith(answerDiv);
                            return;
                        }
                        if (el.getAttribute('data-journal-id') === 'p1-life-pattern-merged-extra') return;
                        const journalId = el.getAttribute('data-journal-id');
                        const answer = journalData[journalId];
                        const journalUI = el.querySelector('.journal-ui');
                        if (journalUI && answer) {
                            const answerDiv = document.createElement('div');
                            answerDiv.style.cssText = 'margin-top: 0.5rem; padding: 0.75rem; background: rgba(202,0,19,0.05); border-radius: 6px; border-left: 3px solid #ca0013;';
                            answerDiv.innerHTML = '<strong style="color: #ca0013; font-size: 0.9rem;">Your Answer:</strong><p style="margin: 0.5rem 0 0; color: #333; line-height: 1.6;">' + answer.replace(/\n/g, '<br>') + '</p>';
                            journalUI.replaceWith(answerDiv);
                        } else if (journalUI) {
                            journalUI.remove();
                        }
                    });
                    
                    // Remove buttons and interactive elements
                    const buttons = contentClone.querySelectorAll('button, .pdf-download-btn, .results-modal-close');
                    buttons.forEach(btn => {
                        const parent = btn.parentElement;
                        if (parent && parent.classList.contains('pdf-download-btn')) {
                            // Remove the wrapper div too
                            parent.remove();
                        } else {
                            btn.remove();
                        }
                    });
                    
                    // Hide invite section in PDF (not actionable in static PDF)
                    const inviteContainer = contentClone.querySelector('.cta-invite-container');
                    if (inviteContainer) inviteContainer.style.display = 'none';

                    // Remove CTA link but keep the text
                    const ctaLinks = contentClone.querySelectorAll('.cta-section a, .btn-results-cta');
                    ctaLinks.forEach(link => {
                        const text = link.textContent;
                        const span = document.createElement('span');
                        span.textContent = text;
                        span.style.cssText = 'color: #ca0013; font-weight: 600;';
                        link.parentNode.replaceChild(span, link);
                    });
                    
                    // Make driver bars non-interactive
                    const driverBars = contentClone.querySelectorAll('.driver-bar');
                    driverBars.forEach(bar => {
                        bar.style.cursor = 'default';
                        bar.style.pointerEvents = 'none';
                    });
                    
                    // Ensure all text is visible
                    const allText = contentClone.querySelectorAll('*');
                    allText.forEach(el => {
                        if (el.style) {
                            if (el.style.display === 'none') {
                                el.style.display = 'block';
                            }
                            if (el.style.visibility === 'hidden') {
                                el.style.visibility = 'visible';
                            }
                            if (el.style.opacity === '0') {
                                el.style.opacity = '1';
                            }
                        }
                    });
                    
                    // Create a container for PDF generation
                    // CRITICAL: html2canvas can only capture elements that are in the viewport
                    // Position it on-screen (top-left) but make it visually hidden to user
                    // Container width = 8.5in (816px at 96dpi) - this matches the PDF page width
                    // PDF margins will be applied by html2pdf, so content should fill container
                    const pdfContainer = document.createElement('div');
                    pdfContainer.id = 'pdf-temp-container';
                    pdfContainer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 816px;
                        min-height: 1056px;
                        max-width: 816px;
                        padding: 0;
                        margin: 0;
                        background: #ffffff;
                        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        color: #000000;
                        z-index: -1;
                        overflow: visible;
                        visibility: visible;
                        opacity: 1;
                        display: block;
                        box-sizing: border-box;
                        pointer-events: none;
                        text-align: left;
                    `;
                    
                    // Add optimized PDF styles - modern, clean, centered, no borders/shadows
                    const style = document.createElement('style');
                    style.textContent = `
                        #pdf-temp-container {
                            visibility: visible !important;
                            opacity: 1 !important;
                            background: #ffffff !important;
                        }
                        #pdf-temp-container * {
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        #pdf-temp-container .results-modal-content {
                            background: #ffffff !important;
                            padding: 0 !important;
                            max-width: 100% !important;
                            margin: 0 auto !important;
                            width: 100% !important;
                            box-sizing: border-box !important;
                            border: none !important;
                            box-shadow: none !important;
                            outline: none !important;
                            text-align: left !important;
                            /* Match modal: 1000px max-width with 2rem padding = 936px content */
                            /* PDF: 816px total, scaled proportionally for professional layout */
                        }
                        #pdf-temp-container .results-header {
                            margin-top: 0 !important;
                            margin-bottom: 1.5rem !important;
                            padding-top: 0 !important;
                            padding-bottom: 1rem !important;
                            border-bottom: 1px solid #e5e5e5 !important;
                            text-align: center !important;
                            width: 100% !important;
                        }
                        #pdf-temp-container .results-title {
                            font-size: 2.2rem !important;
                            margin-bottom: 0.75rem !important;
                            line-height: 1.2 !important;
                        }
                        #pdf-temp-container .results-subtitle {
                            font-size: 1.1rem !important;
                            margin-bottom: 0 !important;
                            line-height: 1.6 !important;
                        }
                        #pdf-temp-container .pattern-intro-section {
                            margin-top: 0 !important;
                            margin-bottom: 1.5rem !important;
                            padding: 1rem 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            outline: none !important;
                            width: 100% !important;
                            max-width: 100% !important;
                        }
                        #pdf-temp-container .pattern-display-prominent {
                            margin-top: 0 !important;
                            margin-bottom: 1.25rem !important;
                            padding: 1rem 0 !important;
                            width: 100% !important;
                            max-width: 100% !important;
                        }
                        #pdf-temp-container .results-section {
                            background: #ffffff !important;
                            border: none !important;
                            border-radius: 0 !important;
                            padding: 1.25rem 0 !important;
                            margin-bottom: 1.5rem !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            box-shadow: none !important;
                            outline: none !important;
                            page-break-inside: avoid !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        #pdf-temp-container .results-section-title {
                            font-size: 1.5rem !important;
                            margin-bottom: 1rem !important;
                            padding-bottom: 0.75rem !important;
                            border-bottom: 1px solid #e5e5e5 !important;
                        }
                        #pdf-temp-container .accordion-item {
                            background: #ffffff !important;
                            border: none !important;
                            border-radius: 0 !important;
                            margin-bottom: 1.25rem !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            overflow: visible !important;
                            box-shadow: none !important;
                            outline: none !important;
                            page-break-inside: avoid !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            box-sizing: border-box !important;
                        }
                        #pdf-temp-container .accordion-header {
                            display: none !important;
                        }
                        #pdf-temp-container .accordion-content {
                            max-height: none !important;
                            height: auto !important;
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            overflow: visible !important;
                            padding: 1rem 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            outline: none !important;
                        }
                        #pdf-temp-container .accordion-content h3 {
                            font-size: 1.3rem !important;
                            margin-top: 0 !important;
                            margin-bottom: 0.75rem !important;
                        }
                        #pdf-temp-container .accordion-content h4 {
                            font-size: 1.1rem !important;
                            margin-top: 1rem !important;
                            margin-bottom: 0.5rem !important;
                        }
                        #pdf-temp-container .life-area-accordion-content {
                            max-height: none !important;
                            height: auto !important;
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            overflow: visible !important;
                            padding: 1rem 1.5rem !important;
                        }
                        #pdf-temp-container .driver-details {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        #pdf-temp-container .results-hero-section,
                        #pdf-temp-container .results-accordion,
                        #pdf-temp-container .cta-section {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            page-break-inside: avoid !important;
                            width: 100% !important;
                            max-width: 100% !important;
                            margin-left: 0 !important;
                            margin-right: 0 !important;
                            box-sizing: border-box !important;
                        }
                        #pdf-temp-container .cta-section {
                            margin-top: 2rem !important;
                            padding-top: 1.5rem !important;
                            border-top: 1px solid #e5e5e5 !important;
                            border: none !important;
                            border-top: 1px solid #e5e5e5 !important;
                            box-shadow: none !important;
                            outline: none !important;
                        }
                        #pdf-temp-container .workbook-download-btn,
                        #pdf-temp-container button {
                            display: none !important;
                        }
                        #pdf-temp-container .journal-ui {
                            display: none !important;
                        }
                        #pdf-temp-container h1, #pdf-temp-container h2, #pdf-temp-container h3, #pdf-temp-container h4 {
                            color: #000000 !important;
                            font-weight: 600 !important;
                            page-break-after: avoid !important;
                        }
                        #pdf-temp-container .content-text {
                            color: #333 !important;
                            line-height: 1.6 !important;
                            font-size: 0.95rem !important;
                            margin-bottom: 0.75rem !important;
                        }
                        #pdf-temp-container .content-text p {
                            margin-bottom: 0.75rem !important;
                        }
                        #pdf-temp-container .content-list {
                            margin: 0.75rem 0 !important;
                            padding-left: 1.5rem !important;
                        }
                        #pdf-temp-container .content-list li {
                            margin-bottom: 0.5rem !important;
                            line-height: 1.6 !important;
                        }
                        #pdf-temp-container .pattern-identity-card {
                            margin-bottom: 1.5rem !important;
                            padding: 1.25rem !important;
                            border: none !important;
                            box-shadow: none !important;
                            outline: none !important;
                        }
                        #pdf-temp-container .driver-breakdown {
                            margin-top: 1rem !important;
                        }
                        #pdf-temp-container .driver-item {
                            margin-bottom: 0.75rem !important;
                            padding: 0.75rem !important;
                        }
                    `;
                    document.head.appendChild(style);
                    
                    // Ensure cloned content has proper base styles optimized for PDF
                    // Content should fill the container width exactly (816px = 8.5in)
                    // PDF margins will be handled by html2pdf options
                    // Match modal design: 1000px max-width with 2rem (32px) padding = 936px content
                    // PDF: 816px total, 0.75in (72px) margins each side = 672px content area
                    // Scale proportionally to maintain visual consistency
                    contentClone.style.cssText = `
                        width: 816px;
                        max-width: 816px;
                        background: #ffffff;
                        padding: 0;
                        margin: 0;
                        visibility: visible;
                        opacity: 1;
                        display: block;
                        color: #000000;
                        box-sizing: border-box;
                        border: none !important;
                        box-shadow: none !important;
                        outline: none !important;
                        text-align: left;
                    `;
                    
                    // Apply PDF-optimized spacing to key elements
                    const applyPDFStyles = (element) => {
                        if (!element) return;
                        
                        // Reduce excessive margins/padding for PDF
                        const sections = element.querySelectorAll('.results-section, .accordion-item');
                        sections.forEach(section => {
                            const currentMargin = window.getComputedStyle(section).marginBottom;
                            if (parseFloat(currentMargin) > 32) {
                                section.style.marginBottom = '1.25rem';
                            }
                        });
                        
                        // Ensure proper text spacing
                        const paragraphs = element.querySelectorAll('p');
                        paragraphs.forEach(p => {
                            const currentMargin = window.getComputedStyle(p).marginBottom;
                            if (parseFloat(currentMargin) > 16) {
                                p.style.marginBottom = '0.75rem';
                            }
                        });
                    };
                    
                    applyPDFStyles(contentClone);
                    
                    pdfContainer.appendChild(contentClone);
                    
                    // Append to body - ensure it's in the DOM before html2canvas
                    document.body.appendChild(pdfContainer);
                    
                    // CRITICAL: Force the container to be in viewport for html2canvas
                    // Scroll to top to ensure container is visible
                    const originalScrollY = window.scrollY;
                    window.scrollTo(0, 0);
                    
                    // Validate that content was appended
                    if (pdfContainer.children.length === 0) {
                        throw new Error('Failed to append content to PDF container.');
                    }
                    
                    // Validate that the cloned content has actual HTML content
                    const clonedContent = pdfContainer.querySelector('.results-modal-content');
                    if (!clonedContent) {
                        throw new Error('Cloned content structure not found. Expected .results-modal-content element.');
                    }
                    
                    // Check if cloned content has text
                    const hasText = clonedContent.textContent.trim().length > 0;
                    if (!hasText) {
                        throw new Error('Cloned content appears to be empty. No text content found.');
                    }
                    
                    console.log('PDF container created with', pdfContainer.children.length, 'children');
                    console.log('Cloned content has', clonedContent.children.length, 'direct children');
                    console.log('Cloned content text length:', clonedContent.textContent.trim().length);
                    
                    // Force multiple reflows to ensure content is rendered
                    const forceReflow = () => {
                        pdfContainer.offsetHeight;
                        pdfContainer.scrollHeight;
                        pdfContainer.clientHeight;
                    };
                    
                    forceReflow();
                    requestAnimationFrame(() => {
                        forceReflow();
                        requestAnimationFrame(() => {
                            forceReflow();
                        });
                    });
                    
                    // Wait longer for content to settle, fonts to load, and images to render
                    setTimeout(() => {
                        // Validate container still has content
                        if (pdfContainer.children.length === 0 || !pdfContainer.querySelector('.results-modal-content')) {
                            throw new Error('PDF container lost content during preparation.');
                        }
                        
                        // Final validation - check for actual rendered content
                        const finalContent = pdfContainer.querySelector('.results-modal-content');
                        if (!finalContent || finalContent.textContent.trim().length === 0) {
                            throw new Error('Content is empty when attempting to generate PDF. Please ensure the results modal is fully loaded.');
                        }
                        
                        // Validate container dimensions
                        const containerHeight = pdfContainer.scrollHeight || pdfContainer.offsetHeight;
                        if (containerHeight < 100) {
                            console.warn('Container height is very small:', containerHeight);
                        }
                        
                        console.log('Starting PDF generation...');
                        console.log('Final content validation - text length:', finalContent.textContent.trim().length);
                        console.log('Container dimensions:', {
                            width: pdfContainer.offsetWidth,
                            height: pdfContainer.offsetHeight,
                            scrollHeight: pdfContainer.scrollHeight
                        });
                        
                        // Configure PDF options with optimized margins for letter size
                        // Equal margins for proper centering - content will be centered automatically
                        const options = {
                            margin: [0.5, 0.75, 0.5, 0.75], // Top, Right, Bottom, Left (in inches) - equal side margins for centering
                            filename: `${pattern.name}-Pattern-Report-${new Date().toISOString().split('T')[0]}.pdf`,
                            image: { 
                                type: 'jpeg', 
                                quality: 0.98 
                            },
                            html2canvas: { 
                                scale: 2,
                                useCORS: true,
                                logging: false,
                                backgroundColor: '#ffffff',
                                width: 816,
                                height: Math.max(pdfContainer.scrollHeight || 1056, pdfContainer.offsetHeight || 1056),
                                windowWidth: 816,
                                windowHeight: Math.max(pdfContainer.scrollHeight || 1056, pdfContainer.offsetHeight || 1056),
                                allowTaint: true,
                                letterRendering: true,
                                removeContainer: false,
                                scrollX: 0,
                                scrollY: 0,
                                x: 0,
                                y: 0,
                                ignoreElements: function(element) {
                                    // Don't ignore any elements - we want everything
                                    return false;
                                },
                                onclone: function(clonedDoc) {
                                    console.log('html2canvas onclone called');
                                    // Ensure all content is visible in cloned document
                                    const clonedContainer = clonedDoc.getElementById('pdf-temp-container');
                                    if (clonedContainer) {
                                        console.log('Found cloned container with', clonedContainer.children.length, 'children');
                                        // Force all styles to be visible
                                        clonedContainer.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important;';
                                        const allElements = clonedContainer.querySelectorAll('*');
                                        allElements.forEach(el => {
                                            if (el.style) {
                                                if (el.style.display === 'none') el.style.display = 'block';
                                                if (el.style.visibility === 'hidden') el.style.visibility = 'visible';
                                                if (el.style.opacity === '0') el.style.opacity = '1';
                                            }
                                        });
                                    } else {
                                        console.warn('Cloned container not found in onclone');
                                    }
                                }
                            },
                            jsPDF: { 
                                unit: 'in', 
                                format: 'letter', 
                                orientation: 'portrait',
                                compress: true
                            },
                            pagebreak: { 
                                mode: ['avoid-all', 'css', 'legacy'],
                                before: '.results-hero-section',
                                after: ['.accordion-item', '.results-section', '.cta-section'],
                                avoid: ['.results-header', '.pattern-intro-section', '.accordion-content']
                            }
                        };
                    
                        // Generate PDF and force download (not open in browser)
                        console.log('Calling html2pdf...');
                        const filename = `${pattern.name}-Pattern-Report-${new Date().toISOString().split('T')[0]}.pdf`;
                        
                        html2pdf()
                            .set(options)
                            .from(pdfContainer)
                            .outputPdf('blob')
                            .then((pdfBlob) => {
                                console.log('PDF blob created, size:', pdfBlob.size, 'bytes');
                                
                                // Create a download link and trigger it
                                const blobUrl = URL.createObjectURL(pdfBlob);
                                const downloadLink = document.createElement('a');
                                downloadLink.href = blobUrl;
                                downloadLink.download = filename;
                                downloadLink.style.display = 'none';
                                document.body.appendChild(downloadLink);
                                
                                // Trigger download
                                downloadLink.click();
                                
                                // Clean up the link and blob URL after a delay
                                setTimeout(() => {
                                    document.body.removeChild(downloadLink);
                                    URL.revokeObjectURL(blobUrl);
                                }, 100);
                                
                                console.log('PDF downloaded successfully');
                                
                                // Restore scroll position
                                window.scrollTo(0, originalScrollY);
                                
                                // Clean up PDF container and styles
                                if (document.body.contains(pdfContainer)) {
                                    document.body.removeChild(pdfContainer);
                                }
                                if (document.head.contains(style)) {
                                    document.head.removeChild(style);
                                }
                                if (downloadBtn) {
                                    downloadBtn.innerHTML = originalText;
                                    downloadBtn.disabled = false;
                                }
                            })
                            .catch((error) => {
                                console.error('Error generating PDF:', error);
                                console.error('Error stack:', error.stack);
                                
                                // Restore scroll position on error
                                window.scrollTo(0, originalScrollY);
                                
                                alert('Error generating PDF: ' + (error.message || 'Unknown error') + '. Please check the console for details.');
                                // Clean up on error
                                if (document.body.contains(pdfContainer)) {
                                    document.body.removeChild(pdfContainer);
                                }
                                if (document.head.contains(style)) {
                                    document.head.removeChild(style);
                                }
                                if (downloadBtn) {
                                    downloadBtn.innerHTML = originalText;
                                    downloadBtn.disabled = false;
                                }
                            });
                    }, 1000); // Wait longer for content to settle, fonts to load, and images to render
                    
                } catch (error) {
                    console.error('Error preparing PDF:', error);
                    alert('Error preparing PDF: ' + (error.message || 'Unknown error'));
                    if (downloadBtn) {
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                    }
                }
            }, 200); // Initial delay for animations
        });
    }
    
    // Make functions available globally immediately when script loads
    // This ensures the function is available even if script loads after button is rendered
    try {
        if (typeof window !== 'undefined') {
            window.showResultsModal = showResultsModal;
            window.closeResultsModal = closeResultsModal;
        }
    } catch (e) {
        console.error('Error assigning functions to window:', e);
    }
    
    // Auto-show if URL parameter is present
    if (shouldAutoShow()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showResultsModal);
        } else {
            showResultsModal();
        }
    }
})();

// Safety: Ensure function is available even if IIFE fails
// This runs after the IIFE, so if assignment inside IIFE worked, this does nothing
// If assignment failed, this provides a fallback
if (typeof window !== 'undefined' && typeof window.showResultsModal === 'undefined') {
    console.warn('showResultsModal was not assigned in IIFE - this may indicate a script error');
    // Don't create a placeholder - let the button's error message show
    // This helps debug the real issue
}
