// Results Renderer Module
// Extracts all results rendering logic for use in modal overlay
(function() {
    'use strict';
    
    // Make results renderer available globally
    window.ResultsRenderer = {
        // Load and render full results content
        renderFullResults: function(container, data) {
            const { pattern, archetype, patternDominance, dominanceLabel, driverPercentages, totalScore, exactAge, relationshipStatus, firstName, sortedDrivers, answers, driverScores } = data;
            
            // Get driver names and descriptions
            const driverNames = {
                'control': 'Control',
                'avoidance': 'Avoidance',
                'validation': 'Validation',
                'fear-of-rejection': 'Fear of Rejection'
            };
            
            const driverDescriptions = {
                'control': 'You seek safety through taking charge and solving problems.',
                'avoidance': 'You avoid difficult emotions by staying free and flexible.',
                'validation': 'You seek approval through achievement and recognition.',
                'fear-of-rejection': 'You protect yourself by keeping distance and being perfect.'
            };
            
            // Ensure sortedDrivers exists - create from driverPercentages if not provided
            let sortedDriversArray = sortedDrivers;
            if (!sortedDriversArray || !Array.isArray(sortedDriversArray)) {
                if (driverPercentages) {
                    sortedDriversArray = Object.entries(driverPercentages)
                        .sort((a, b) => b[1] - a[1])
                        .map(([driver, percentage]) => [driver, percentage]);
                } else {
                    sortedDriversArray = [];
                }
            }
            
            // Build personalized intro
            let personalizedIntro = '';
            if (exactAge && relationshipStatus) {
                personalizedIntro = `At ${exactAge}, ${relationshipStatus === 'single' ? 'as someone who is single' : relationshipStatus === 'married' ? 'in your marriage' : 'in your relationship'}, your ${pattern.name} pattern shows up in how you navigate life, relationships, and your goals.`;
            } else if (exactAge) {
                personalizedIntro = `At ${exactAge}, your ${pattern.name} pattern influences how you show up in relationships, work, and life.`;
            } else if (relationshipStatus) {
                personalizedIntro = `${relationshipStatus === 'single' ? 'As someone who is single' : relationshipStatus === 'married' ? 'In your marriage' : 'In your relationship'}, your ${pattern.name} pattern shows up in how you connect and navigate relationships.`;
            } else {
                personalizedIntro = `Your ${pattern.name} pattern influences how you show up in relationships, work, and life.`;
            }
            
            // Calculate next reset date
            function getNextResetDate() {
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const currentDay = today.getDate();
                
                let nextResetMonth = currentMonth;
                let nextResetYear = currentYear;
                
                if (currentDay > 1) {
                    nextResetMonth = currentMonth + 1;
                    if (nextResetMonth > 11) {
                        nextResetMonth = 0;
                        nextResetYear = currentYear + 1;
                    }
                }
                
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return monthNames[nextResetMonth] + ' ' + nextResetYear;
            }
            
            const nextResetDate = getNextResetDate();
            
            // Generate full HTML (using the complete template from results.html)
            const html = generateFullResultsHTML({
                pattern,
                archetype,
                patternDominance,
                dominanceLabel,
                driverPercentages,
                totalScore,
                exactAge,
                relationshipStatus,
                firstName,
                sortedDrivers: sortedDriversArray,
                driverNames,
                driverDescriptions,
                personalizedIntro,
                nextResetDate,
                answers: answers || [],
                driverScores: driverScores || {}
            });
            
            container.innerHTML = html;
            
            // Set next reset date in CTA
            const nextResetDateElement = container.querySelector('#next-reset-date-results');
            if (nextResetDateElement) {
                nextResetDateElement.textContent = nextResetDate;
            }
        }
    };
    
    // Generate full results HTML - Complete Redesign (Expert-Backed, Science-Driven)
    function generateFullResultsHTML(data) {
        const { 
            pattern, archetype, patternDominance, dominanceLabel, 
            driverPercentages, firstName, sortedDrivers, 
            driverNames, driverDescriptions, personalizedIntro, nextResetDate,
            exactAge, relationshipStatus, answers, driverScores, quizData
        } = data;
        
        // Safety checks - ensure required data exists
        if (!pattern || !pattern.name) {
            return '<div class="results-section"><h2>Error Loading Results</h2><p>Pattern data is missing. Please complete the quiz first.</p></div>';
        }
        
        if (!archetype || !archetype.name) {
            return '<div class="results-section"><h2>Error Loading Results</h2><p>Archetype data is missing. Please complete the quiz first.</p></div>';
        }
        
        // Ensure sortedDrivers exists
        let sortedDriversArray = sortedDrivers;
        if (!sortedDriversArray || !Array.isArray(sortedDriversArray) || sortedDriversArray.length === 0) {
            if (driverPercentages) {
                sortedDriversArray = Object.entries(driverPercentages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([driver, percentage]) => [driver, percentage]);
            } else {
                sortedDriversArray = [['control', 25], ['avoidance', 25], ['validation', 25], ['fear-of-rejection', 25]];
            }
        }
        
        // Ensure driverPercentages exists
        let driverPercentagesObj = driverPercentages || {};
        if (Object.keys(driverPercentagesObj).length === 0 && sortedDriversArray.length > 0) {
            sortedDriversArray.forEach(([driver, percentage]) => {
                driverPercentagesObj[driver] = percentage;
            });
        }
        
        // Ensure pattern has required properties with fallbacks
        if (!pattern.shadow) {
            pattern.shadow = 'Pattern behavior → Consequences';
        }
        if (!pattern.coreBelief) {
            pattern.coreBelief = 'Your core belief drives your pattern.';
        }
        if (!pattern.resetFocus) {
            pattern.resetFocus = 'Breaking Your Pattern';
        }
        
        return `
            <!-- HERO SECTION: Always Visible -->
            <div class="results-hero-section">
            <div class="results-header">
                    <h1 class="results-title">Hi <span class="user-name-red">${firstName || 'there'}</span>,<br>This Is the Pattern That's Been Running Your Life</h1>
                    <p class="results-subtitle">You're not broken. You've been repeating something you couldn't see—until now.</p>
            </div>
            
                <!-- Pattern Display - Professional & Clean -->
                <div class="pattern-display-prominent">
                    <div class="pattern-identity-card">
                        <div class="pattern-archetype-label">Your Pattern</div>
                        <div class="pattern-name-display">
                            <span class="pattern-name-main">${pattern.name}</span>
                        </div>
                        <div class="pattern-archetype-subtitle">${archetype.name}</div>
                        ${pattern.coreBelief ? `<div class="pattern-core-belief-preview">"${pattern.coreBelief}"</div>` : ''}
                        ${getAllDriversGrid(sortedDriversArray, driverPercentagesObj)}
                    </div>
                </div>
            </div>
            
            <!-- Visual Divider -->
            <div class="results-section-divider"></div>
            
            <!-- Content Section - White Background -->
            <div class="results-content-section">
                <!-- Quick Summary - About Your Pattern -->
                ${getQuickSummary(archetype, pattern, patternDominance, dominanceLabel, firstName, exactAge, relationshipStatus, answers, quizData || window.quizData || [], sortedDriversArray, driverPercentagesObj)}
                
                <!-- Dive Deeper - Expandable Hero Content -->
                ${getComprehensiveHeroContent(archetype, pattern, patternDominance, dominanceLabel, answers, sortedDriversArray, driverPercentagesObj, firstName, exactAge, relationshipStatus, quizData || window.quizData || [])}
                
                <p class="content-text" style="margin: 1.5rem 0 1rem 0; color: #555;">Next: <strong>Your free Pattern Reset Workbook</strong>. A self-paced blueprint to break your pattern and transform your life.</p>
                
                <!-- ACCORDION: Your Pattern Reset Workbook (merged) -->
                <div class="results-accordion">
                    ${getAccordionSection('how-to-break', 'Your Pattern Reset Workbook', getMergedHowToBreakPattern(pattern, firstName, archetype), false)}
                </div>
                
                <!-- Your Next Step - Minimal Modern Design -->
                <div class="cta-section">
                    <div style="margin-bottom: 1.5rem;">
                        <h4 class="cta-title" style="font-size: 1.15rem; margin-bottom: 0.75rem;">Continue Your Transformation</h4>
                        <p class="content-text" style="color: #555; line-height: 1.7; margin: 0;">Work through your workbook at your own pace. When your pattern shows up, use your interrupt and choose differently. Every practice session builds new neural pathways.</p>
                    </div>
                    
                    <div class="workbook-downloads-container">
                        <p class="workbook-downloads-label">Download Your Tools</p>
                        <div class="workbook-downloads-grid">
                            <button type="button" class="workbook-download-btn" data-download-type="full-report">
                                <span class="btn-icon"><i class="fas fa-file-pdf"></i></span>
                                <span class="btn-text">
                                    <span class="btn-title">Full Report</span>
                                    <span class="btn-subtitle">Complete results</span>
                                </span>
                            </button>
                            <button type="button" class="workbook-download-btn" data-download-type="workbook">
                                <span class="btn-icon"><i class="fas fa-book"></i></span>
                                <span class="btn-text">
                                    <span class="btn-title">Workbook</span>
                                    <span class="btn-subtitle">With your answers</span>
                                </span>
                            </button>
                            <button type="button" class="workbook-download-btn" data-download-type="affirmation-card">
                                <span class="btn-icon"><i class="fas fa-id-card"></i></span>
                                <span class="btn-text">
                                    <span class="btn-title">Affirmation Card</span>
                                    <span class="btn-subtitle">Carry your purpose</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    <p class="workbook-note">Your answers are saved automatically. Return anytime to continue.</p>
                </div>
            </div>
        `;
    }
    
    // Helper functions
    
    // Helper function to convert shadow behavior to grammatically correct verb phrase
    function getShadowBehaviorVerb(shadowValue) {
        if (!shadowValue) return 'repeat this pattern';
        
        const shadowPart = shadowValue.split(' → ')[0].toLowerCase().trim();
        const shadowParts = shadowPart.split(' & ');
        const firstShadow = shadowParts[0].trim();
        
        // Convert nouns to verb phrases for grammatical correctness
        const shadowVerbMap = {
            'disconnection': 'disconnect or withdraw',
            'overfunctioning': 'overfunction or take charge',
            'paralysis': 'get paralyzed by overthinking',
            'anxiety': 'feel anxious and overthink',
            'isolation': 'isolate yourself',
            'loneliness': 'withdraw and feel alone',
            'self-neglect': 'neglect yourself',
            'burnout': 'burn out from overdoing',
            'resentment': 'feel resentful',
            'people-pleasing': 'people-please',
            'shame': 'strive for perfection out of shame',
            'rigidity': 'become rigid',
            'emptiness': 'feel empty despite achievement'
        };
        
        const keyShadow = firstShadow;
        let verbPhrase = shadowVerbMap[keyShadow] || shadowVerbMap[shadowPart] || shadowPart;
        
        // If it's not in the map and doesn't contain spaces, try to make it work
        if (!shadowVerbMap[keyShadow] && !shadowVerbMap[shadowPart] && !shadowPart.includes(' ')) {
            // If it ends in -ing, it might be a gerund - try to convert
            if (shadowPart.endsWith('ing')) {
                verbPhrase = shadowPart.replace(/ing$/, '');
            } else {
                // Otherwise, add context
                verbPhrase = `engage in ${shadowPart}`;
            }
        }
        
        return verbPhrase;
    }
    
    function getCoreBeliefExplanation(coreBelief) {
        const explanations = {
            'If I solve it, I\'m safe.': 'You believe that taking charge and fixing problems will keep you safe and in control of your life.',
            'If I think it through, I\'m safe.': 'You believe that thinking through every situation will keep you safe and prevent problems.',
            'If I achieve, I\'m worthy.': 'You believe that achieving and performing will make you worthy of love and belonging.',
            'If I please others, I\'m safe.': 'You believe that pleasing others and being helpful will keep you safe in relationships.',
            'If I stay free, I\'m safe.': 'You believe that staying free and avoiding commitment will keep you safe from being trapped.',
            'If I keep moving, I\'m safe.': 'You believe that staying mobile and avoiding stability will keep you safe from being stuck.',
            'If I protect myself, I\'m safe.': 'You believe that protecting yourself and keeping distance will keep you safe from rejection.',
            'If I\'m perfect, I\'m safe.': 'You believe that being perfect will keep you safe from rejection and criticism.'
        };
        return explanations[coreBelief] || 'This belief shapes how you navigate life and relationships.';
    }
    
    function getStrengthDescription(strength) {
        const descriptions = {
            'Responsible & Capable': 'You\'re the person people turn to when things go wrong. You\'re reliable, action-oriented, and you get things done. This is a genuine strength that serves you well.',
            'Thoughtful & Analytical': 'You think through situations carefully and make well-considered decisions. You\'re thorough and detail-oriented. This is a genuine strength that serves you well.',
            'Ambitious & Driven': 'You set high goals and work hard to achieve them. You\'re motivated and persistent. This is a genuine strength that serves you well.',
            'Caring & Considerate': 'You genuinely care about others and go out of your way to help. You\'re thoughtful and considerate. This is a genuine strength that serves you well.',
            'Independent & Flexible': 'You adapt easily to change and value your freedom. You\'re open-minded and resourceful. This is a genuine strength that serves you well.',
            'Adaptable & Open': 'You embrace new experiences and adapt to different situations. You\'re curious and open to possibilities. This is a genuine strength that serves you well.',
            'Loyal & Protective': 'You\'re deeply loyal to those you care about and protect what matters to you. You\'re reliable and trustworthy. This is a genuine strength that serves you well.',
            'Detail-Oriented & Reliable': 'You pay attention to details and strive for excellence. You\'re reliable and thorough. This is a genuine strength that serves you well.'
        };
        return descriptions[strength] || 'This is a genuine strength that serves you well.';
    }
    
    function getShadowDescription(shadow) {
        const descriptions = {
            'Overfunctioning → Burnout': 'you take responsibility for things that aren\'t yours to fix. You overfunction for others, leading to exhaustion, resentment, and burnout.',
            'Analysis Paralysis → Inaction': 'you get stuck thinking instead of acting. You analyze every detail, leading to paralysis and missed opportunities.',
            'Performing → Exhaustion': 'you work to earn approval instead of doing things for yourself. You perform for others, leading to exhaustion and losing yourself.',
            'Pleasing → Resentment': 'you prioritize others\' needs over your own. You people-please, leading to resentment and losing yourself.',
            'Avoiding → Isolation': 'you avoid difficult emotions and situations. You stay free, leading to isolation and missing deep connections.',
            'Wandering → Rootlessness': 'you keep moving and avoid commitment. You stay mobile, leading to rootlessness and missing stability.',
            'Withdrawing → Loneliness': 'you protect yourself by keeping distance. You withdraw, leading to loneliness and missing connection.',
            'Perfectionism → Paralysis': 'you try to be perfect to avoid rejection. You strive for flawlessness, leading to paralysis and missing opportunities.'
        };
        return descriptions[shadow] || 'your pattern shows up in ways that limit your growth and connection.';
    }
    
    function getCoreBeliefKeyword(coreBelief) {
        if (coreBelief.includes('solve')) return 'in control';
        if (coreBelief.includes('think')) return 'thinking';
        if (coreBelief.includes('achieve')) return 'achieving';
        if (coreBelief.includes('please')) return 'pleasing';
        if (coreBelief.includes('free')) return 'free';
        if (coreBelief.includes('moving')) return 'moving';
        if (coreBelief.includes('protect')) return 'protecting';
        return 'perfect';
    }
    
    function getWorthKeyword(coreBelief) {
        if (coreBelief.includes('solve')) return 'how much you fix';
        if (coreBelief.includes('think')) return 'how much you think';
        if (coreBelief.includes('achieve')) return 'what you achieve';
        if (coreBelief.includes('please')) return 'how much you please';
        if (coreBelief.includes('free')) return 'how free you are';
        if (coreBelief.includes('moving')) return 'how mobile you are';
        if (coreBelief.includes('protect')) return 'how protected you are';
        return 'how perfect you are';
    }
    
    function getTimeWasteText(coreBelief) {
        if (coreBelief.includes('solve')) return 'fixing things that aren\'t yours to fix';
        if (coreBelief.includes('think')) return 'overthinking instead of taking action';
        if (coreBelief.includes('achieve')) return 'performing for others instead of living authentically';
        if (coreBelief.includes('please')) return 'people-pleasing instead of honoring your needs';
        if (coreBelief.includes('free')) return 'avoiding commitment instead of building connection';
        if (coreBelief.includes('moving')) return 'staying mobile instead of creating stability';
        if (coreBelief.includes('protect')) return 'protecting yourself instead of opening up';
        return 'trying to be perfect instead of being human';
    }
    
    // Expert-backed explanation of archetype and pattern - why they got these results
    function getArchetypePatternExplanation(archetype, pattern, patternDominance, dominanceLabel, exactAge, relationshipStatus, firstName) {
        // Map drivers to archetypes
        const driverToArchetype = {
            'control': 'The Anchor',
            'validation': 'The Catalyst',
            'avoidance': 'The Wanderer',
            'fear-of-rejection': 'The Guardian'
        };
        
        // Find which driver led to this archetype
        const archetypeDriver = Object.keys(driverToArchetype).find(key => driverToArchetype[key] === archetype.name) || 'control';
        
        // Explain what archetype means
        const archetypeExplanations = {
            'The Anchor': {
                meaning: 'You seek safety through control and stability. When you feel uncertain or unsafe, you take charge and create structure.',
                why: 'Your answers showed that you respond to stress by taking control—fixing problems, creating plans, and managing situations. This is your primary way of feeling safe.'
            },
            'The Catalyst': {
                meaning: 'You seek safety through validation and achievement. When you feel uncertain or unsafe, you perform and earn approval.',
                why: 'Your answers showed that you respond to stress by achieving, performing, and seeking recognition. This is your primary way of feeling worthy and safe.'
            },
            'The Wanderer': {
                meaning: 'You seek safety through avoidance and freedom. When you feel uncertain or unsafe, you stay mobile and avoid commitment.',
                why: 'Your answers showed that you respond to stress by avoiding, staying busy, or keeping your options open. This is your primary way of feeling safe.'
            },
            'The Guardian': {
                meaning: 'You seek safety through protection and distance. When you feel uncertain or unsafe, you keep boundaries and protect yourself.',
                why: 'Your answers showed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This is your primary way of feeling safe.'
            }
        };
        
        // Explain what pattern means and why they got it
        const patternExplanations = {
            'Fixer': {
                meaning: 'You step in to solve problems—even when they\'re not yours to fix. You take responsibility for others\' emotions and outcomes.',
                why: 'Within The Anchor category, your answers showed you\'re more action-oriented. When conflicts arise, you jump in to fix them. When people pull away, you take charge. This makes you The Fixer.'
            },
            'Perfectionist': {
                meaning: 'You strive for flawlessness to avoid criticism. You overthink decisions and avoid risks to ensure you do everything "right."',
                why: 'Within The Anchor category, your answers showed you\'re more detail-oriented. You analyze every decision, trying to make the perfect choice. This makes you The Perfectionist.'
            },
            'Pleaser': {
                meaning: 'You prioritize others\' needs over your own to maintain connection. You say yes when you mean no and lose yourself in relationships.',
                why: 'Within The Catalyst category, your answers showed you prioritize harmony over achievement. You avoid conflict by pleasing others. This makes you The Pleaser.'
            },
            'Performer': {
                meaning: 'You work hard to earn approval and recognition. You achieve for others instead of yourself and feel exhausted from performing.',
                why: 'Within The Catalyst category, your answers showed you prioritize achievement and recognition. You work to impress and earn approval. This makes you The Performer.'
            },
            'Escaper': {
                meaning: 'You avoid difficult emotions by staying busy or disconnected. You numb feelings and avoid deep conversations to stay safe.',
                why: 'Within The Wanderer category, your answers showed you avoid through distraction and numbing. You stay busy, avoid feelings, and keep moving. This makes you The Escaper.'
            },
            'Overthinker': {
                meaning: 'You analyze every situation to feel safe before acting. You get stuck in analysis paralysis and miss opportunities while thinking.',
                why: 'Within The Wanderer category, your answers showed you avoid through over-analysis. You think through everything before acting, trying to feel safe. This makes you The Overthinker.'
            },
            'Withdrawer': {
                meaning: 'You protect yourself by keeping emotional distance. You push people away when they get too close and struggle with intimacy.',
                why: 'Within The Guardian category, your answers showed you protect through withdrawal. When people get close, you pull away to stay safe. This makes you The Withdrawer.'
            },
            'Overgiver': {
                meaning: 'You give more than you receive to feel needed and secure. You sacrifice your needs and feel resentful when others don\'t reciprocate.',
                why: 'Within The Guardian category, your answers showed you protect through over-giving. You give everything hoping they\'ll stay, but end up resentful. This makes you The Overgiver.'
            }
        };
        
        const archetypeInfo = archetypeExplanations[archetype.name] || { meaning: '', why: '' };
        const patternInfo = patternExplanations[pattern.name] || { meaning: '', why: '' };
        
        return `
            <div class="archetype-pattern-explanation">
                <div class="explanation-section">
                    <h3 class="explanation-title">What ${archetype.name} Means:</h3>
                    <p class="explanation-text">${archetypeInfo.meaning}</p>
                    <p class="explanation-why"><strong>Why you got this:</strong> ${archetypeInfo.why}</p>
                </div>
                
                <div class="explanation-section">
                    <h3 class="explanation-title">What ${pattern.name} Means:</h3>
                    <p class="explanation-text">${patternInfo.meaning}</p>
                    <p class="explanation-why"><strong>Why you got this:</strong> ${patternInfo.why}</p>
                </div>
            </div>
        `;
    }
    
    // Consolidated powerful personalized intro - Expert-backed, minimal, contextual
    function getPowerfulPersonalizedIntro(archetype, pattern, patternDominance, dominanceLabel, exactAge, relationshipStatus, firstName, sortedDrivers, driverPercentages) {
        // Safety check
        if (!sortedDrivers || !Array.isArray(sortedDrivers) || sortedDrivers.length === 0) {
            sortedDrivers = [['control', 25], ['avoidance', 25], ['validation', 25], ['fear-of-rejection', 25]];
        }
        if (!driverPercentages) {
            driverPercentages = {};
            sortedDrivers.forEach(([driver, percentage]) => {
                driverPercentages[driver] = percentage;
            });
        }
        // Get concrete pattern examples based on user's situation
        const getConcreteExample = () => {
            if (relationshipStatus === 'single') {
                const examples = {
                    'Fixer': 'You jump in to "help" dates who seem lost or broken, believing if you fix them, they\'ll stay. But they pull away when they feel controlled.',
                    'Perfectionist': 'You analyze every potential partner for flaws before committing, waiting for the "perfect" match that never comes.',
                    'Pleaser': 'You say yes to dates you\'re not interested in, go along with plans you don\'t want, and lose yourself trying to be what they want.',
                    'Performer': 'You work hard to impress dates—achieving, succeeding, showing your best self—but they leave when they see the real you.',
                    'Escaper': 'You stay busy, avoid deep conversations, and pull away when things get serious—keeping yourself safe but alone.',
                    'Overthinker': 'You analyze every text, every date, every interaction, trying to figure out if they\'re "the one" before you even know them.',
                    'Withdrawer': 'You push people away when they get too close, protecting yourself from rejection but creating the loneliness you fear.',
                    'Overgiver': 'You give everything—time, energy, attention—hoping they\'ll see your worth, but they take and leave when you need something.'
                };
                return examples[pattern.name] || `Your ${pattern.name.toLowerCase()} pattern shows up in how you approach dating and relationships.`;
            } else if (relationshipStatus === 'married' || relationshipStatus === 'in a relationship') {
                const examples = {
                    'Fixer': 'When your partner has a problem, you immediately jump in to solve it—even when they need to handle it themselves. This creates resentment on both sides.',
                    'Perfectionist': 'You overthink every decision together, trying to make the "right" choice, which leads to paralysis and missed opportunities.',
                    'Pleaser': 'You say yes to everything your partner wants, even when you\'re exhausted, leading to resentment and losing yourself in the relationship.',
                    'Performer': 'You work hard to be the "perfect" partner, achieving and succeeding to earn their approval, but you\'re exhausted and they don\'t see the real you.',
                    'Escaper': 'When conflict arises, you avoid it—staying busy, numbing feelings, or withdrawing—which creates distance and unresolved issues.',
                    'Overthinker': 'You analyze every interaction, every conversation, trying to figure out what they "really" mean, which creates anxiety and distance.',
                    'Withdrawer': 'When your partner gets too close or vulnerable, you pull away, protecting yourself but creating the distance you fear.',
                    'Overgiver': 'You give more than you receive, hoping they\'ll reciprocate, but you end up resentful and they feel smothered.'
                };
                return examples[pattern.name] || `Your ${pattern.name.toLowerCase()} pattern shows up in how you navigate your relationship.`;
            } else if (relationshipStatus === 'divorced' || relationshipStatus === 'separated') {
                return `This ${pattern.name.toLowerCase()} pattern likely contributed to your relationship ending—and it\'s still affecting how you approach new connections.`;
            } else {
                return `Your ${pattern.name.toLowerCase()} pattern shows up in your relationships, work, and daily choices—influencing ${patternDominance}% of your decisions.`;
            }
        };
        
        // Get age-specific context
        const getAgeContext = () => {
            if (!exactAge) return '';
            
            if (exactAge < 30) {
                return 'Right now, at ' + exactAge + ', this pattern is still forming—which means it\'s the perfect time to break it before it becomes even more ingrained.';
            } else if (exactAge < 40) {
                return 'At ' + exactAge + ', you\'re at a critical point—this pattern has been running for years, and breaking it now will transform your next decade.';
            } else if (exactAge < 50) {
                return 'At ' + exactAge + ', you\'ve likely seen how this pattern has cost you—in relationships, opportunities, and peace. It\'s not too late to break it.';
            } else {
                return 'At ' + exactAge + ', breaking this pattern can transform your remaining years—giving you the freedom and connection you\'ve been missing.';
            }
        };
        
        // Get pattern strength in practical terms - Expert explanation with clarity on dominance
        const getStrengthContext = () => {
            const otherPatternsPercent = 100 - patternDominance;
            const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
            const secondaryPercent = sortedDrivers[1] ? driverPercentages[sortedDrivers[1][0]] : 0;
            
            if (patternDominance >= 70) {
                return `This ${pattern.name.toLowerCase()} pattern is your <strong>dominant pattern</strong>—it influences ${patternDominance}% of your daily decisions. This means when you feel stressed, uncertain, or unsafe, you default to this pattern automatically. It\'s the primary pattern running your life right now. The remaining ${otherPatternsPercent}% represents other emotional drivers that show up less frequently, but this ${pattern.name.toLowerCase()} pattern is the one driving most of your choices.`;
            } else if (patternDominance >= 50) {
                return `This ${pattern.name.toLowerCase()} pattern is your <strong>dominant pattern</strong>—it influences ${patternDominance}% of your decisions. While you have other patterns present (${otherPatternsPercent}% combined), this ${pattern.name.toLowerCase()} pattern is the primary one running your life. It shows up most consistently, especially when you feel stressed or uncertain, and it\'s the one costing you authentic connection and peace. Breaking this dominant pattern first will have the biggest impact on your life.`;
            } else if (patternDominance >= 30) {
                return `This ${pattern.name.toLowerCase()} pattern is your <strong>dominant pattern</strong>—at ${patternDominance}%, it's the primary pattern running your life, even though you have other patterns present (${otherPatternsPercent}% combined). Here's what this means: Even at ${patternDominance}%, this pattern shows up in your most important moments—when you're stressed, making big decisions, or feeling unsafe. The other ${otherPatternsPercent}% represents secondary patterns that create <strong>internal conflict and confusion</strong>. You might feel torn between different responses, making it harder to know what you actually want. Breaking this dominant ${patternDominance}% pattern first will reduce that conflict and give you clarity, making it easier to address the secondary patterns.`;
            } else {
                return `This ${pattern.name.toLowerCase()} pattern is your <strong>dominant pattern</strong>—at ${patternDominance}%, it's the primary pattern running your life, even though you have multiple patterns competing (${otherPatternsPercent}% combined). Here's why this matters: (1) Even at ${patternDominance}%, this pattern shows up in your most vulnerable moments—when you're stressed, uncertain, or making important decisions. (2) The other ${otherPatternsPercent}% represents secondary patterns that create internal conflict, confusion, and make it harder to know what you actually want. (3) This ${patternDominance}% pattern is still the dominant one—it's the one driving most of your choices, even if it doesn't feel like it. Breaking this dominant pattern first will reduce the conflict and give you clarity on what you actually want.`;
            }
        };
        
        const concreteExample = getConcreteExample();
        const ageContext = getAgeContext();
        const strengthContext = getStrengthContext();
        
        return `
            <div class="pattern-intro-content">
                <p class="pattern-intro-main" style="font-size: 1.25rem; line-height: 1.7; color: #000; margin-bottom: 1.5rem; font-weight: 500;">
                    ${firstName ? `${firstName}, ` : ''}${concreteExample}
                </p>
                
                <p class="pattern-intro-strength" style="font-size: 1.1rem; line-height: 1.6; color: #333; margin-bottom: 1.5rem;">
                    ${strengthContext}
                </p>
                
                ${ageContext ? `
                    <p class="pattern-intro-age" style="font-size: 1.1rem; line-height: 1.6; color: #ca0013; font-weight: 600; margin-bottom: 1.5rem;">
                        ${ageContext}
                    </p>
                ` : ''}
                
                <p class="pattern-intro-value" style="font-size: 1.15rem; line-height: 1.7; color: #000; font-weight: 600; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.1);">
                    Breaking this pattern means you can finally show up as yourself—not your pattern. You can create the relationships, life, and peace you want instead of repeating the same cycle.
                </p>
            </div>
        `;
    }
    
    // ========================================
    // NEW EXPERT-BACKED HELPER FUNCTIONS
    // ========================================
    
    // The Science Behind Your Pattern - Neuroscience, Psychology, Nervous System
    function getScienceBehindPattern(pattern, patternDominance, firstName) {
        // Safety checks
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '<div class="results-section"><p>Error: Pattern data incomplete.</p></div>';
        }
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = getShadowBehaviorVerb(pattern.shadow);
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        return `
            <div class="results-section science-section">
                <h2 class="results-section-title">
                    <span class="icon">🧠</span>
                    The Science Behind Your Pattern
                </h2>
                
                <p class="content-text">${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern isn't random—it's rooted in neuroscience, psychology, and your nervous system. Here's what the research shows:</p>
                
                <div class="science-subsection">
                    <h3 class="subsection-title">Neuroscience: How Your Brain Wired This Pattern</h3>
                    <p class="content-text">Research in neuroscience shows that <strong>every time you ${shadowBehavior}, you're strengthening neural pathways</strong> in your brain. Here's how it works:</p>
                    <ul class="content-list">
                        <li><strong>Neural pathways strengthen with repetition.</strong> When you ${shadowBehavior}, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the pathway becomes—making it your brain's default response.</li>
                        <li><strong>Your pattern operates on autopilot.</strong> After years of repetition, your ${pattern.name.toLowerCase()} pattern has become automatic. Your brain doesn't need to "think" about it—it just happens. This is called <em>neuroplasticity in action</em>—your brain has literally shaped itself around this pattern.</li>
                        <li><strong>Breaking it requires new pathways.</strong> To change, you need to create NEW neural pathways through consistent practice. Research shows this takes a minimum of 21-66 days of repetition (we use 22 days as the minimum effective dose).</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Doidge (2007), "The Brain That Changes Itself" - Neuroplasticity research</p>
                </div>
                
                <div class="science-subsection">
                    <h3 class="subsection-title">Psychology: Why This Pattern Developed</h3>
                    <p class="content-text">Your pattern developed as a <strong>survival strategy</strong>—it kept you safe when you needed it most:</p>
                    <ul class="content-list">
                        <li><strong>Your core belief: "${pattern.coreBelief}"</strong> - This belief developed early in life as a way to feel safe. Every time you ${shadowBehavior}, it reinforced this belief, making it stronger over time.</li>
                        <li><strong>Pattern reinforcement.</strong> When ${shadowBehavior} led to temporary relief or safety, your brain learned: "This works." So you kept doing it, even when it stopped serving you.</li>
                        <li><strong>Childhood adaptation.</strong> Your pattern likely developed in childhood as a way to navigate your environment. It worked then—but now it's limiting you.</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Attachment theory, Cognitive Behavioral Therapy research</p>
                </div>
                
                <div class="science-subsection">
                    <h3 class="subsection-title">Nervous System: How Your Body Responds</h3>
                    <p class="content-text">Your pattern activates your <strong>autonomic nervous system</strong>—the part that controls fight, flight, or freeze responses:</p>
                    <ul class="content-list">
                        <li><strong>When you feel unsafe, your pattern activates.</strong> Your nervous system perceives a threat (even if it's emotional, not physical), and your ${pattern.name.toLowerCase()} pattern kicks in as a protective response.</li>
                        <li><strong>Your body stores the pattern.</strong> Research shows that patterns aren't just in your mind—they're stored in your body. This is why breaking patterns requires both mental AND physical practice.</li>
                        <li><strong>Chronic activation leads to stress.</strong> When your pattern is constantly activated, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Polyvagal theory, Somatic psychology research</p>
                </div>
                
                <div class="science-highlight">
                    <p class="content-text" style="font-size: 1.15rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;"><strong>The Bottom Line:</strong></p>
                    <p class="content-text">Your ${pattern.name.toLowerCase()} pattern is <strong>biologically real</strong>—it's wired into your brain and nervous system. But here's the good news: <strong>neuroplasticity means you can rewire it.</strong> Your brain can change. You just need the right system to do it.</p>
                </div>
            </div>
        `;
    }
    
    // How Your Pattern Shows Up Across ALL Life Areas - Comprehensive Coverage
    function getLifeAreaImpact(pattern, exactAge, relationshipStatus, firstName, patternDominance) {
        // Get comprehensive life area descriptions with neuroscience backing
        const lifeAreas = getComprehensiveLifeAreas(pattern, exactAge, relationshipStatus, firstName);
        
        return `
            <div class="results-section life-areas-section">
                <h2 class="results-section-title">
                    <span class="icon">🌍</span>
                    How Your ${pattern.name} Pattern Shows Up Across ALL Areas of Your Life
                </h2>
                
                <p class="content-text">${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern doesn't just show up in one area—it's operating across <strong>every area of your life</strong>. Here's how it's impacting you right now:</p>
                
                ${lifeAreas}
                
                <div class="life-areas-summary">
                    <p class="content-text" style="font-size: 1.15rem; font-weight: 600; color: #ca0013; margin-top: 2rem;">
                        <strong>The Pattern Is Everywhere:</strong> Your ${pattern.name.toLowerCase()} pattern influences ${patternDominance}% of your decisions across all these areas. It's not isolated—it's a system-wide pattern that needs a system-wide solution.
                    </p>
                </div>
            </div>
        `;
    }
    
    // Comprehensive Life Areas with Specific Examples
    function getComprehensiveLifeAreas(pattern, exactAge, relationshipStatus, firstName) {
        // Safety check
        if (!pattern || !pattern.name) {
            return '<p class="content-text">Your pattern shows up across all areas of your life.</p>';
        }
        
        const patternKey = pattern.name.toLowerCase();
        
        // Love & Relationships
        const loveImpact = getLoveImpact(pattern, relationshipStatus, exactAge);
        
        // Money & Finances
        const moneyImpact = getMoneyImpact(pattern, exactAge);
        
        // Health & Habits
        const healthImpact = getHealthImpact(pattern, exactAge);
        
        // Career & Work
        const careerImpact = getCareerImpact(pattern, exactAge);
        
        // Identity & Self-Worth
        const identityImpact = getIdentityImpact(pattern, exactAge);
        
        // Childhood Origin
        const childhoodImpact = getChildhoodImpact(pattern);
        
        // Relationship Patterns (Intimacy, Commitment, etc.)
        const relationshipPatternsImpact = getRelationshipPatternsImpact(pattern, relationshipStatus);
        
        return `
            <div class="life-area-item">
                <h3 class="life-area-title">💕 Love & Relationships</h3>
                ${loveImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">💰 Money & Finances</h3>
                ${moneyImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">🏃 Health & Habits</h3>
                ${healthImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">💼 Career & Work</h3>
                ${careerImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">🎭 Identity & Self-Worth</h3>
                ${identityImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">👶 Childhood Origin</h3>
                ${childhoodImpact}
            </div>
            
            <div class="life-area-item">
                <h3 class="life-area-title">💑 Relationship Patterns</h3>
                ${relationshipPatternsImpact}
            </div>
        `;
    }
    
    // Life Area Helper Functions - Expert-Backed, Specific Examples
    function getLoveImpact(pattern, relationshipStatus, exactAge) {
        // Safety check
        if (!pattern || !pattern.name) {
            return '<p class="content-text">Your pattern shows up in how you navigate relationships and connections.</p>';
        }
        
        const examples = {
            'Fixer': {
                single: 'You jump in to "fix" dates who seem lost or broken, believing if you solve their problems, they\'ll stay. But they pull away when they feel controlled, leaving you confused about why relationships don\'t work.',
                relationship: 'When your partner has a problem, you immediately jump in to solve it—even when they need to handle it themselves. This creates resentment on both sides: you feel unappreciated, they feel controlled.',
                neuroscience: 'Your brain has wired "fixing = safety" so strongly that you can\'t help but jump in, even when it\'s not helpful.'
            },
            'Perfectionist': {
                single: 'You analyze every potential partner for flaws before committing, waiting for the "perfect" match that never comes. You overthink every text, every date, trying to ensure you make the "right" choice—but you end up alone.',
                relationship: 'You overthink every decision together, trying to make the "right" choice, which leads to paralysis and missed opportunities. Your partner feels like they can never measure up to your standards.',
                neuroscience: 'Your brain has wired "perfect = safe" so strongly that anything less feels dangerous, keeping you from taking risks in love.'
            },
            'Pleaser': {
                single: 'You say yes to dates you\'re not interested in, go along with plans you don\'t want, and lose yourself trying to be what they want. You end up in relationships where you\'re not being yourself, and they leave when they realize it.',
                relationship: 'You say yes to everything your partner wants, even when you\'re exhausted, leading to resentment and losing yourself in the relationship. You don\'t know who you are outside of pleasing them.',
                neuroscience: 'Your brain has wired "pleasing = safe" so strongly that saying no feels dangerous, even when it\'s necessary for your wellbeing.'
            },
            'Performer': {
                single: 'You work hard to impress dates—achieving, succeeding, showing your best self—but they leave when they see the real you. You\'re exhausted from performing, but you don\'t know how to stop.',
                relationship: 'You work hard to be the "perfect" partner, achieving and succeeding to earn their approval, but you\'re exhausted and they don\'t see the real you. You\'re performing, not connecting.',
                neuroscience: 'Your brain has wired "achieving = worthy" so strongly that you can\'t relax and be yourself, even with someone you love.'
            },
            'Escaper': {
                single: 'You stay busy, avoid deep conversations, and pull away when things get serious—keeping yourself safe but alone. You want connection but can\'t let yourself have it.',
                relationship: 'When conflict arises, you avoid it—staying busy, numbing feelings, or withdrawing—which creates distance and unresolved issues. Your partner feels like you\'re not present.',
                neuroscience: 'Your brain has wired "avoiding = safe" so strongly that intimacy feels threatening, even when you want it.'
            },
            'Overthinker': {
                single: 'You analyze every text, every date, every interaction, trying to figure out if they\'re "the one" before you even know them. You get stuck in analysis paralysis, missing opportunities while thinking.',
                relationship: 'You analyze every interaction, every conversation, trying to figure out what they "really" mean, which creates anxiety and distance. You\'re in your head instead of your heart.',
                neuroscience: 'Your brain has wired "thinking = safe" so strongly that you can\'t trust your instincts, even when they\'re right.'
            },
            'Withdrawer': {
                single: 'You push people away when they get too close, protecting yourself from rejection but creating the loneliness you fear. You want connection but can\'t let yourself have it.',
                relationship: 'When your partner gets too close or vulnerable, you pull away, protecting yourself but creating the distance you fear. They feel rejected, you feel misunderstood.',
                neuroscience: 'Your brain has wired "distance = safe" so strongly that closeness feels threatening, even when you want it.'
            },
            'Overgiver': {
                single: 'You give everything—time, energy, attention—hoping they\'ll see your worth, but they take and leave when you need something. You end up resentful and alone.',
                relationship: 'You give more than you receive, hoping they\'ll reciprocate, but you end up resentful and they feel smothered. You don\'t know how to receive love.',
                neuroscience: 'Your brain has wired "giving = safe" so strongly that receiving feels dangerous, even when you need it.'
            }
        };
        
        const patternData = examples[pattern.name] || examples['Fixer'];
        const context = relationshipStatus === 'single' ? patternData.single : (relationshipStatus === 'married' || relationshipStatus === 'in a relationship') ? patternData.relationship : patternData.single;
        
        return `
            <p class="content-text">${context}</p>
            <p class="content-text" style="margin-top: 0.75rem; font-size: 0.95rem; color: #666; font-style: italic;">${patternData.neuroscience}</p>
        `;
    }
    
    function getMoneyImpact(pattern, exactAge) {
        const examples = {
            'Fixer': 'You feel safe only when you\'re fully in control of finances. When money problems hit, you go into "fix mode"—creating plans, tightening systems, trying to solve everything. But this constant control creates stress and prevents you from trusting the process.',
            'Perfectionist': 'You overthink every financial decision, trying to make the "perfect" choice. You analyze investments, budgets, and opportunities endlessly—but this paralysis causes you to miss opportunities and stay stuck.',
            'Pleaser': 'You spend money to please others—buying gifts, saying yes to expensive plans, trying to show you care through spending. But this leaves you financially drained and resentful when others don\'t reciprocate.',
            'Performer': 'You spend money to impress—buying status symbols, expensive experiences, trying to show your worth through what you own. But this creates financial stress and prevents you from building real wealth.',
            'Escaper': 'You avoid dealing with money—ignoring bills, avoiding budgets, staying busy so you don\'t have to think about finances. But this creates financial chaos and prevents you from building security.',
            'Overthinker': 'You analyze every financial decision endlessly, trying to figure out the "right" move. You research, compare, and think—but this paralysis causes you to miss opportunities and stay stuck.',
            'Withdrawer': 'You protect yourself financially by hoarding, avoiding risks, and keeping everything separate. But this prevents you from building wealth and creating financial partnerships.',
            'Overgiver': 'You give money away—loaning to friends, paying for others, trying to show your worth through generosity. But this leaves you financially drained and resentful when others don\'t reciprocate.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getHealthImpact(pattern, exactAge) {
        const examples = {
            'Fixer': 'You make clear plans and structure your day when overwhelmed, but you struggle to rest because you feel responsible for everything. Your biggest health challenge is overfunctioning leading to burnout and exhaustion.',
            'Perfectionist': 'You create perfect health routines but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely. This all-or-nothing approach prevents consistent health habits.',
            'Pleaser': 'You prioritize others\' health needs over your own, saying yes to plans that exhaust you and putting everyone else first. This leads to burnout, stress, and neglecting your own wellbeing.',
            'Performer': 'You work out and eat well to look good and impress others, but you\'re exhausted from performing. Your health becomes about appearance, not wellbeing, leading to unsustainable habits.',
            'Escaper': 'You avoid dealing with health issues—staying busy, numbing feelings, avoiding doctors. You use distraction to avoid discomfort, but this prevents you from addressing real health concerns.',
            'Overthinker': 'You analyze every health decision endlessly—researching diets, workouts, supplements—but this paralysis prevents you from taking action. You think about health more than you practice it.',
            'Withdrawer': 'You protect yourself by keeping distance from health support—avoiding doctors, therapists, or wellness communities. But this isolation prevents you from getting the help you need.',
            'Overgiver': 'You give your energy to everyone else, leaving nothing for yourself. You neglect your own health needs while taking care of others, leading to exhaustion and burnout.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getCareerImpact(pattern, exactAge) {
        const examples = {
            'Fixer': 'You step in to solve problems at work, even when they\'re not yours to fix. You take on extra responsibilities, believing if you solve everything, you\'ll be safe. But this leads to burnout and prevents others from growing.',
            'Perfectionist': 'You overthink every work decision, trying to make the "perfect" choice. You analyze projects endlessly, leading to paralysis and missed deadlines. Your perfectionism prevents you from taking risks and advancing.',
            'Pleaser': 'You say yes to everything at work, trying to please everyone. You take on extra projects, work late, and prioritize others\' needs over your own. This leads to burnout and prevents you from focusing on what matters.',
            'Performer': 'You work hard to impress and earn approval, achieving and succeeding to prove your worth. But you\'re exhausted from performing, and you don\'t know how to work authentically without the need for recognition.',
            'Escaper': 'You avoid difficult conversations, challenging projects, and career risks. You stay busy with tasks that don\'t matter, avoiding the work that would actually advance your career.',
            'Overthinker': 'You analyze every career decision endlessly, trying to figure out the "right" path. You research, compare, and think—but this paralysis causes you to miss opportunities and stay stuck.',
            'Withdrawer': 'You protect yourself by keeping distance from colleagues, avoiding networking, and staying isolated. But this prevents you from building relationships that advance your career.',
            'Overgiver': 'You give your time and energy to everyone else\'s projects, leaving nothing for your own growth. You help others succeed but neglect your own career advancement.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getIdentityImpact(pattern, exactAge) {
        const examples = {
            'Fixer': 'You see yourself as the problem-solver, the one who takes charge. Your worth is tied to how much you fix and how capable you are. But this identity prevents you from receiving help and being vulnerable.',
            'Perfectionist': 'You see yourself as someone who does things "right." Your worth is tied to being flawless. But this identity prevents you from taking risks and being human.',
            'Pleaser': 'You see yourself as helpful, caring, the one who puts others first. Your worth is tied to how much you please. But this identity prevents you from knowing who you are outside of serving others.',
            'Performer': 'You see yourself as successful, achieving, impressive. Your worth is tied to what you accomplish. But this identity prevents you from being authentic and vulnerable.',
            'Escaper': 'You see yourself as free, independent, uncommitted. Your worth is tied to staying mobile. But this identity prevents you from building deep connections and stability.',
            'Overthinker': 'You see yourself as thoughtful, analytical, careful. Your worth is tied to how much you think. But this identity prevents you from trusting your instincts and taking action.',
            'Withdrawer': 'You see yourself as independent, self-sufficient, protected. Your worth is tied to how safe you keep yourself. But this identity prevents you from experiencing deep connection and intimacy.',
            'Overgiver': 'You see yourself as generous, giving, needed. Your worth is tied to how much you give. But this identity prevents you from receiving and knowing your worth outside of giving.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getChildhoodImpact(pattern) {
        const examples = {
            'Fixer': 'You likely grew up in an environment where you learned that taking charge and solving problems kept you safe. Maybe you were the "responsible one" in your family, or you learned that fixing things earned you love and approval. This pattern developed as a survival strategy—and it worked. But now it\'s limiting you.',
            'Perfectionist': 'You likely grew up in an environment where you learned that being perfect kept you safe. Maybe you were praised for doing things "right," or you learned that mistakes led to criticism or rejection. This pattern developed as a way to avoid pain—and it worked. But now it\'s preventing you from taking risks and being human.',
            'Pleaser': 'You likely grew up in an environment where you learned that pleasing others kept you safe. Maybe you were rewarded for being helpful, or you learned that saying no led to conflict or rejection. This pattern developed as a way to maintain connection—and it worked. But now it\'s preventing you from knowing yourself.',
            'Performer': 'You likely grew up in an environment where you learned that achieving and performing earned you love and approval. Maybe you were praised for success, or you learned that your worth was tied to what you accomplished. This pattern developed as a way to feel worthy—and it worked. But now it\'s exhausting you.',
            'Escaper': 'You likely grew up in an environment where you learned that avoiding difficult emotions kept you safe. Maybe you learned to stay busy or numb feelings, or you learned that feeling deeply was dangerous. This pattern developed as a way to protect yourself—and it worked. But now it\'s preventing you from experiencing deep connection.',
            'Overthinker': 'You likely grew up in an environment where you learned that thinking through everything kept you safe. Maybe you were rewarded for being careful, or you learned that acting without thinking led to mistakes or criticism. This pattern developed as a way to feel safe—and it worked. But now it\'s preventing you from taking action.',
            'Withdrawer': 'You likely grew up in an environment where you learned that keeping distance kept you safe. Maybe you learned that closeness led to pain, or you learned that protecting yourself was necessary. This pattern developed as a way to avoid rejection—and it worked. But now it\'s preventing you from experiencing intimacy.',
            'Overgiver': 'You likely grew up in an environment where you learned that giving more kept you safe. Maybe you learned that your worth was tied to how much you gave, or you learned that giving prevented people from leaving. This pattern developed as a way to feel needed—and it worked. But now it\'s leaving you drained and resentful.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getRelationshipPatternsImpact(pattern, relationshipStatus) {
        const examples = {
            'Fixer': 'You struggle with intimacy because you\'re always "fixing." When your partner shares a problem, you jump in to solve it instead of just listening. This prevents deep emotional connection and makes your partner feel like they can\'t be vulnerable without you trying to control the situation.',
            'Perfectionist': 'You struggle with commitment because you\'re waiting for the "perfect" partner. You analyze every potential partner for flaws, trying to ensure you make the "right" choice. But this perfectionism prevents you from taking risks in love and experiencing real connection.',
            'Pleaser': 'You struggle with boundaries because you say yes to everything your partner wants, even when you\'re exhausted. You lose yourself in relationships, trying to be what they want instead of who you are. This prevents authentic connection and leads to resentment.',
            'Performer': 'You struggle with vulnerability because you\'re always performing. You show your best self, achieve, and succeed to earn approval—but your partner never sees the real you. This prevents deep intimacy and leaves you feeling alone even in relationships.',
            'Escaper': 'You struggle with commitment because you avoid difficult conversations and pull away when things get serious. You stay busy, avoid feelings, and keep your options open—but this prevents you from building deep, lasting connections.',
            'Overthinker': 'You struggle with trust because you analyze every interaction, trying to figure out what your partner "really" means. You get stuck in your head instead of your heart, which creates anxiety and distance in relationships.',
            'Withdrawer': 'You struggle with intimacy because you push people away when they get too close. You protect yourself by keeping emotional distance, but this creates the loneliness you fear. Your partner feels rejected, you feel misunderstood.',
            'Overgiver': 'You struggle with receiving love because you give more than you receive. You hope they\'ll see your worth through your generosity, but you end up resentful when they don\'t reciprocate. You don\'t know how to receive love.'
        };
        
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    // Why Your Pattern Is Unique to You
    function getPatternUniqueness(pattern, archetype, driverPercentages, sortedDrivers, driverNames, exactAge, relationshipStatus, firstName) {
        const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
        const secondaryPercentage = sortedDrivers[1] ? sortedDrivers[1][1] : 0;
        
        let uniquenessFactors = [];
        
        // Driver combination
        if (secondaryDriver && secondaryPercentage >= 20) {
            uniquenessFactors.push(`Your combination of ${driverPercentages[sortedDrivers[0][0]]}% ${driverNames[sortedDrivers[0][0]]} and ${secondaryPercentage}% ${driverNames[secondaryDriver]} creates a unique pattern blend that shows up differently than someone with just one dominant driver.`);
        }
        
        // Age context
        if (exactAge) {
            if (exactAge < 30) {
                uniquenessFactors.push(`At ${exactAge}, your pattern is still forming, which means you have a unique opportunity to break it before it becomes even more ingrained.`);
            } else if (exactAge < 40) {
                uniquenessFactors.push(`At ${exactAge}, your pattern has been running for years, creating a unique combination of strengths and limitations based on your life experiences.`);
            } else {
                uniquenessFactors.push(`At ${exactAge}, your pattern has been reinforced over decades, creating a unique combination of wisdom and stuckness that requires a specific approach to break.`);
            }
        }
        
        // Relationship context
        if (relationshipStatus) {
            if (relationshipStatus === 'single') {
                uniquenessFactors.push(`As someone who is single, your pattern shows up uniquely in how you approach dating, friendships, and why relationships haven\'t lasted—this is specific to your situation.`);
            } else if (relationshipStatus === 'married' || relationshipStatus === 'in a relationship') {
                uniquenessFactors.push(`In your ${relationshipStatus === 'married' ? 'marriage' : 'relationship'}, your pattern shows up uniquely in how you navigate conflict, intimacy, and connection—this is specific to your dynamic.`);
            } else if (relationshipStatus === 'divorced' || relationshipStatus === 'separated') {
                uniquenessFactors.push(`After your relationship ended, your pattern shows up uniquely in how you approach new connections and process what happened—this is specific to your experience.`);
            }
        }
        
        return `
            <div class="results-section uniqueness-section">
                <h2 class="results-section-title">
                    <span class="icon">✨</span>
                    Why Your ${pattern.name} Pattern Is Unique to You
                </h2>
                
                <p class="content-text">${firstName ? `${firstName}, ` : ''}While you share the ${pattern.name} pattern with others, <strong>your specific combination of drivers, life experiences, and context makes your pattern unique.</strong> Here's what makes yours different:</p>
                
                <div class="uniqueness-factors">
                    ${uniquenessFactors.map(factor => `
                        <div class="uniqueness-item">
                            <p class="content-text">${factor}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="uniqueness-summary">
                    <p class="content-text" style="font-size: 1.1rem; font-weight: 600; color: #000; margin-top: 1.5rem;">
                        <strong>What This Means:</strong> Your pattern isn't generic—it's uniquely yours based on your specific answers, your combination of emotional drivers, and your life context. This means your path to breaking it will also be unique to you.
                    </p>
                </div>
            </div>
        `;
    }
    
    // What This Pattern Is Costing You (Stakes)
    function getPatternCosts(pattern, exactAge, relationshipStatus, firstName, patternDominance) {
        // Safety checks
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        return `
                <p class="content-text" style="font-size: 1.2rem; font-weight: 600; color: #ca0013; margin-bottom: 1.5rem;">
                    ${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern is costing you more than you realize. Here's what you're missing:
                </p>
                
                <div class="cost-item">
                    <h3 class="cost-title">💔 In Relationships:</h3>
                    <p class="content-text">You're missing <strong>authentic connection</strong>. When you ${shadowBehavior}, you can't show up fully. You're hiding behind your pattern instead of being yourself, which prevents deep intimacy and leaves you feeling alone even when you're with someone.</p>
                    ${relationshipStatus === 'single' ? '<p class="content-text" style="margin-top: 0.5rem; font-weight: 600; color: #ca0013;">This is likely why relationships haven\'t lasted—your pattern keeps repeating until you break it.</p>' : ''}
                </div>
                
                <div class="cost-item">
                    <h3 class="cost-title">💼 In Your Career:</h3>
                    <p class="content-text">You're missing <strong>opportunities for growth and advancement</strong>. Your pattern ${shadowBehavior} prevents you from taking risks, having difficult conversations, or showing up authentically at work. This limits your potential and keeps you stuck in roles that don't fulfill you.</p>
                </div>
                
                <div class="cost-item">
                    <h3 class="cost-title">🏃 In Your Health:</h3>
                    <p class="content-text">You're missing <strong>sustainable health habits and peace</strong>. Your pattern leads to ${shadowConsequence}, which creates stress, burnout, and prevents you from building consistent routines that support your wellbeing.</p>
                </div>
                
                <div class="cost-item">
                    <h3 class="cost-title">💰 In Your Finances:</h3>
                    <p class="content-text">You're missing <strong>financial security and freedom</strong>. Your pattern ${shadowBehavior} prevents you from making confident financial decisions, taking calculated risks, or building wealth. This keeps you stuck in financial patterns that don't serve you.</p>
                </div>
                
                <div class="cost-item">
                    <h3 class="cost-title">🎭 In Your Identity:</h3>
                    <p class="content-text">You're missing <strong>knowing who you really are</strong>. Your pattern has become so ingrained that you don't know who you are outside of it. You're living as your pattern, not as yourself—and this prevents you from experiencing authentic self-expression and fulfillment.</p>
                </div>
                
                <div class="cost-item">
                    <h3 class="cost-title">⏰ In Your Time & Energy:</h3>
                    <p class="content-text">You're wasting <strong>mental energy and time</strong> on ${shadowBehavior} and managing ${shadowConsequence}. Every day you repeat this pattern, you're investing your finite resources into what's keeping you stuck instead of what could set you free.</p>
                </div>
                
                <div class="costs-summary">
                    <p class="content-text" style="font-size: 1.2rem; font-weight: 700; color: #ca0013; margin-top: 2rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.08); border-radius: 8px; border-left: 4px solid #ca0013;">
                        <strong>The Cost of Waiting:</strong> Every day you don't break this pattern, it gets stronger. Every day you wait, it costs you more—in relationships, opportunities, health, money, and your sense of self. The longer you wait, the harder it becomes to break.
                    </p>
            </div>
        `;
    }
    
    // The Neuroscience of Breaking Patterns (Condensed)
    function getNeuroscienceOfBreakingPatterns(pattern, patternDominance, firstName) {
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        
        return `
                <p class="content-text" style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">${firstName ? `${firstName}, ` : ''}Here's what neuroscience research shows about breaking patterns—and why awareness alone isn't enough:</p>
                
                <div class="neuroscience-subsection">
                    <h3 class="subsection-title">Why Awareness Isn't Enough</h3>
                    <p class="content-text">Research shows that <strong>knowing your pattern doesn't break it</strong>. Here's why:</p>
                    <ul class="content-list">
                        <li><strong>Your pattern operates on autopilot.</strong> After years of repetition, your ${pattern.name.toLowerCase()} pattern has become automatic. Your brain doesn't need conscious thought to activate it—it just happens. This is called <em>implicit memory</em>—it's stored in your brain's deeper structures, not your conscious mind.</li>
                        <li><strong>Thinking doesn't rewire neural pathways.</strong> You can't think your way out of a pattern because thinking uses different neural pathways than the ones that control your automatic behaviors. To change, you need to create NEW pathways through practice, not just awareness.</li>
                        <li><strong>Your brain resists change.</strong> Your brain is designed to conserve energy, so it defaults to what's familiar—your pattern. This is why breaking patterns feels hard: your brain is literally fighting to keep the old pathway active.</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Doidge (2007), "The Brain That Changes Itself" - Neuroplasticity and implicit memory research</p>
                </div>
                
                <div class="neuroscience-subsection">
                    <h3 class="subsection-title">Why You Need Practice, Not Just Understanding</h3>
                    <p class="content-text">Neuroscience shows that <strong>breaking patterns requires consistent practice</strong>:</p>
                    <ul class="content-list">
                        <li><strong>New neural pathways form through repetition.</strong> Research shows it takes 21-66 days of consistent practice to create new neural pathways. We use 22 days as the minimum effective dose—long enough to create real change, short enough to stay consistent.</li>
                        <li><strong>Practice creates new automatic responses.</strong> When you practice a new behavior consistently, your brain creates new pathways. Over time, these new pathways become stronger than the old ones, making the new behavior automatic.</li>
                        <li><strong>Consistency is key.</strong> Your brain needs daily repetition to rewire. Missing days weakens the new pathway and strengthens the old one. This is why a structured 22-day program works—it ensures consistency.</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Lally et al. (2009), "How are habits formed" - Habit formation research (21-66 days)</p>
                </div>
                
                <div class="neuroscience-subsection">
                    <h3 class="subsection-title">Why 22 Days Works</h3>
                    <p class="content-text">Research in neuroscience and behavioral psychology shows that <strong>22 days is the minimum time needed</strong> to:</p>
                    <ul class="content-list">
                        <li><strong>Interrupt your current pattern.</strong> Break the automatic cycle you're stuck in by creating enough disruption that your brain can't default to the old pathway.</li>
                        <li><strong>Create new neural pathways.</strong> Wire your brain for new behaviors through consistent daily practice that strengthens new pathways.</li>
                        <li><strong>Experience different results.</strong> See what happens when you choose differently, which reinforces the new pathway and weakens the old one.</li>
                        <li><strong>Build momentum.</strong> Create enough consistency that new behaviors start to feel natural and automatic.</li>
                        <li><strong>Establish a new baseline.</strong> Make breaking your pattern your new normal, not just a temporary change.</li>
                    </ul>
                    <p class="content-text" style="margin-top: 1rem; font-style: italic; color: #666;">Source: Multiple studies on habit formation and neuroplasticity (21-66 day range, 22 days as minimum effective dose)</p>
                </div>
                
                <div class="neuroscience-highlight" style="margin-top: 2rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.08); border-radius: 8px; border-left: 4px solid #ca0013;">
                    <p class="content-text" style="font-size: 1.15rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;"><strong>The Bottom Line:</strong></p>
                    <p class="content-text">Your ${pattern.name.toLowerCase()} pattern is <strong>biologically real</strong>—it's wired into your brain. But neuroscience also shows that <strong>your brain can change</strong>. You just need the right system: consistent daily practice for 22 days, with support and accountability to ensure you don't default back to the old pathway.</p>
            </div>
        `;
    }
    
    // Pattern-specific data for free jumpstart (Dan Koe "How to fix your entire life in 1 day" – identity, teleology, anti-vision, vision MVP, interrupts, roadmap)
    const PATTERN_JUMPSTART = {
        'The Fixer': {
            patternVerb: 'take over or fix things that aren\'t mine', whenIPattern: 'when I take over or fix things that aren\'t mine', protectingBy: 'taking over or fixing',
            interrupt: 'Is this mine to fix? What happens if I don\'t?', enemyHint: 'I need to fix to feel safe.',
            identityToGiveUp: 'I am the type of person who keeps everything under control and fixes things for others.',
            outsiderConcludes: 'When you step in to fix things that aren\'t yours, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by overfunctioning, burnout, and never letting others own their part.',
            visionMVP: 'I\'m building toward being someone who allows others to own their part and stays out of what isn\'t mine.',
            oneThingThisWeek: 'Let one thing stay "unfixed"—don\'t step in. Notice what happens.',
            challengesComplex: 'by shifting you from fixing to trusting others\' agency.',
            whyInterruptHits: 'This question pulls you out of auto-fixing and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when you don\'t have to fix it.'
        },
        'The Perfectionist': {
            patternVerb: 'strive for perfect or criticize myself', whenIPattern: 'when I strive for perfect or criticize myself', protectingBy: 'demanding perfect',
            interrupt: 'What\'s the good-enough choice? What am I avoiding by perfecting?', enemyHint: 'I need to be perfect to feel safe.',
            identityToGiveUp: 'I am the type of person who must get it right and never settle for good enough.',
            outsiderConcludes: 'When you demand perfect or criticize yourself, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by shame, rigidity, and never feeling good enough.',
            visionMVP: 'I\'m building toward being someone who chooses self-acceptance and rest over perfection.',
            oneThingThisWeek: 'Choose one "good enough" option without overthinking. Ship it.',
            challengesComplex: 'by shifting you from perfect to "good enough" and self-acceptance.',
            whyInterruptHits: 'This question pulls you out of auto-perfecting and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when it\'s not perfect.'
        },
        'The Escaper': {
            patternVerb: 'escape or numb out', whenIPattern: 'when I escape or numb out', protectingBy: 'escaping or numbing out',
            interrupt: 'What am I avoiding feeling right now? Can I stay with it for 60 seconds?', enemyHint: 'I need to escape to feel safe.',
            identityToGiveUp: 'I am the type of person who stays safe by avoiding difficult feelings.',
            outsiderConcludes: 'When you escape or numb out, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by disconnection and never facing what I feel.',
            visionMVP: 'I\'m building toward being someone who faces emotions instead of fleeing.',
            oneThingThisWeek: 'Stay with one difficult feeling for 60 seconds instead of numbing or escaping.',
            challengesComplex: 'by shifting you from avoiding to facing what you feel.',
            whyInterruptHits: 'This question pulls you out of auto-escaping and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when you feel—not only when you flee.'
        },
        'The Overthinker': {
            patternVerb: 'overthink instead of act', whenIPattern: 'when I overthink instead of act', protectingBy: 'overthinking',
            interrupt: 'What\'s one thing I can do in the next 5 minutes? What am I avoiding by analyzing?', enemyHint: 'I need to overthink to feel safe.',
            identityToGiveUp: 'I am the type of person who figures everything out before acting.',
            outsiderConcludes: 'When you overthink instead of act, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by paralysis and never moving until it\'s "ready."',
            visionMVP: 'I\'m building toward being someone who acts before over-analyzing.',
            oneThingThisWeek: 'Do one small action in the next 5 minutes before you\'re "ready."',
            challengesComplex: 'by shifting you from analyzing to acting before you have all the answers.',
            whyInterruptHits: 'This question pulls you out of auto-analyzing and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when you act—not only when you know.'
        },
        'The Pleaser': {
            patternVerb: 'people-please or say yes when I mean no', whenIPattern: 'when I people-please or say yes when I mean no', protectingBy: 'people-pleasing',
            interrupt: 'What do I actually want? What happens if I say no?', enemyHint: 'I need to please to feel safe.',
            identityToGiveUp: 'I am the type of person who keeps everyone happy and avoids conflict.',
            outsiderConcludes: 'When you people-please or say yes when you mean no, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by resentment and never speaking my truth.',
            visionMVP: 'I\'m building toward being someone who speaks up and keeps healthy boundaries.',
            oneThingThisWeek: 'Say no to one thing you don\'t want. Notice what happens.',
            challengesComplex: 'by shifting you from pleasing to honesty and boundaries.',
            whyInterruptHits: 'This question pulls you out of auto-pleasing and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when you say no.'
        },
        'The Performer': {
            patternVerb: 'perform for approval or work to impress', whenIPattern: 'when I perform for approval or work to impress', protectingBy: 'performing for approval',
            interrupt: 'Who would I be without their approval? What do I want to do, regardless of recognition?', enemyHint: 'I need to perform to feel safe.',
            identityToGiveUp: 'I am the type of person who earns worth through achievement and recognition.',
            outsiderConcludes: 'When you perform for approval or work to impress, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by burnout and an empty chase for the next win.',
            visionMVP: 'I\'m building toward being someone who chooses authenticity over image.',
            oneThingThisWeek: 'Do one thing for its own sake, with no one watching or praising.',
            challengesComplex: 'by shifting you from performing to authenticity beyond approval.',
            whyInterruptHits: 'This question pulls you out of auto-performing and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re worthy without the spotlight.'
        },
        'The Guarded One': {
            patternVerb: 'withdraw or shut down', whenIPattern: 'when I withdraw or shut down', protectingBy: 'withdrawing or staying closed',
            interrupt: 'What would it cost to share one real feeling? What am I protecting by staying closed?', enemyHint: 'I need to stay closed to feel safe.',
            identityToGiveUp: 'I am the type of person who stays safe by not opening up.',
            outsiderConcludes: 'When you withdraw or shut down, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by isolation and never letting anyone in.',
            visionMVP: 'I\'m building toward being someone who opens up when it\'s safe.',
            oneThingThisWeek: 'Share one real feeling with someone safe. One sentence.',
            challengesComplex: 'by shifting you from staying closed to opening up when it\'s safe.',
            whyInterruptHits: 'This question pulls you out of auto-withdrawing and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re safe when you\'re seen.'
        },
        'The Overgiver': {
            patternVerb: 'overgive or put others\' needs before mine', whenIPattern: 'when I overgive or put others\' needs before mine', protectingBy: 'overgiving',
            interrupt: 'What do I need right now? What happens if I receive instead of give?', enemyHint: 'I need to overgive to feel safe.',
            identityToGiveUp: 'I am the type of person who proves their worth by giving more than they receive.',
            outsiderConcludes: 'When you overgive or put others\' needs before yours, what would someone who only watched your behavior—not your words—conclude you actually want?',
            antiVisionCompressed: 'I refuse to let my life become defined by self-neglect and never receiving.',
            visionMVP: 'I\'m building toward being someone who balances giving with receiving.',
            oneThingThisWeek: 'Receive one offer of help or care without deflecting. Say "Thank you."',
            challengesComplex: 'by shifting you from overgiving to receiving and balance.',
            whyInterruptHits: 'This question pulls you out of auto-giving and into choice.',
            howOneThingTrains: 'It trains your brain that you\'re worthy when you receive.'
        }
    };
    PATTERN_JUMPSTART['Withdrawer'] = PATTERN_JUMPSTART['The Guarded One'];
    
    // Make PATTERN_JUMPSTART globally accessible for PDF generation
    if (typeof window !== 'undefined') {
        window.PATTERN_JUMPSTART = PATTERN_JUMPSTART;
    }

    const IDENTITY_PHRASES = {
        'Allow others to own their part': 'I am someone who allows others to own their part.',
        'Self-acceptance & rest': 'I am someone who chooses self-acceptance and rest.',
        'Face emotions without fleeing': 'I am someone who faces emotions instead of fleeing.',
        'Act before over-analyzing': 'I am someone who acts before over-analyzing.',
        'Honesty & boundaries': 'I am someone who speaks up and keeps healthy boundaries.',
        'Authenticity over image': 'I am someone who chooses authenticity over image.',
        'Emotional vulnerability': 'I am someone who opens up when it\'s safe.',
        'Balance & self-worth': 'I am someone who balances giving with receiving.'
    };

    const PATTERN_DAILY_LIFE_EXAMPLES = {
        'Fixer': [
            'In relationships, you jump in with solutions when your partner shares a problem, instead of just listening.',
            'At work, you immediately help coworkers with their problems, even when it\'s not your responsibility.',
            'With finances, you offer to help others financially, even when you can\'t afford it.',
            'In your health, you skip your own self-care to help others with their health problems.'
        ],
        'Perfectionist': [
            'In relationships, you overthink every detail of dates and conversations, creating anxiety instead of connection.',
            'At work, you spend hours perfecting projects that were already "good enough," causing burnout.',
            'With finances, you overthink every financial decision, trying to make the "perfect" choice, and miss opportunities.',
            'In your health, you create perfect workout and meal plans but burn out trying to follow them perfectly.'
        ],
        'Pleaser': [
            'In relationships, you say yes to things your partner wants, even when you don\'t want to do them.',
            'At work, you say yes to every request, even when you\'re overwhelmed and exhausted.',
            'With finances, you spend money on others to make them happy, even when it strains your budget.',
            'In your health, you say yes to plans that exhaust you because you can\'t say no.'
        ],
        'Performer': [
            'In relationships, you dress perfectly and say the right things, but your partner never sees the real you.',
            'At work, you work 60+ hours to prove your worth, but you\'re exhausted and empty.',
            'With finances, you spend money to look successful—nice car, expensive clothes—to prove your worth.',
            'In your health, you push yourself to extreme workouts to prove your discipline, leading to injury.'
        ],
        'Escaper': [
            'In relationships, when your partner wants to have a difficult conversation, you suddenly "remember" something you need to do.',
            'At work, when work gets stressful, you avoid difficult conversations and stay busy with easier tasks.',
            'With finances, you avoid looking at your finances, hoping problems will resolve themselves.',
            'In your health, you stay busy to avoid feeling difficult emotions, leading to stress and burnout.'
        ],
        'Overthinker': [
            'In relationships, you analyze every text and interaction, trying to figure out what your partner "really" means.',
            'At work, you analyze every decision endlessly, missing opportunities while thinking.',
            'With finances, you research every investment endlessly but never actually invest.',
            'In your health, you research every health trend but never commit to a routine.'
        ],
        'Withdrawer': [
            'In relationships, when your partner gets too close, you pull away emotionally.',
            'At work, you keep your distance from colleagues, avoiding connection at work.',
            'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
            'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
        ],
        'Overgiver': [
            'In relationships, you give your partner everything—time, energy, gifts—hoping they\'ll see your worth and stay.',
            'At work, you take on extra work, stay late, do favors—hoping to earn recognition and job security.',
            'With finances, you give money to others freely, even when you need it yourself.',
            'In your health, you give your energy to everyone else, leaving nothing for your own health.'
        ],
        'The Guarded One': [
            'In relationships, when your partner gets too close, you pull away emotionally.',
            'At work, you keep your distance from colleagues, avoiding connection at work.',
            'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
            'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
        ]
    };

    // For "it pushes you to [X]" (Why It Happens) and "the need to [X] when you feel unsafe" (How It Developed)
    const PATTERN_COMPLEX_THEMES = {
        'Fixer': 'take over and fix things, even when they\'re not yours to fix',
        'Perfectionist': 'be perfect and get it right, often at the cost of taking action',
        'Pleaser': 'please others and put their needs first, even when you\'re exhausted',
        'Performer': 'achieve and impress to feel worthy',
        'Escaper': 'escape and avoid difficult feelings',
        'Overthinker': 'analyze and think instead of taking action',
        'Withdrawer': 'withdraw and protect yourself when someone gets close',
        'Overgiver': 'give more than you receive, hoping to be valued and kept',
        'The Guarded One': 'withdraw and protect yourself when someone gets close'
    };
    const PATTERN_NEED_THEMES = {
        'Fixer': 'fix and take charge',
        'Perfectionist': 'be perfect and get it right',
        'Pleaser': 'please and put others first',
        'Performer': 'achieve and impress',
        'Escaper': 'escape and avoid difficult feelings',
        'Overthinker': 'analyze instead of act',
        'Withdrawer': 'withdraw and protect yourself',
        'Overgiver': 'give more than you receive',
        'The Guarded One': 'withdraw and protect yourself'
    };

    // For Quick Reference: "the specific way your [X] shows up in behavior"
    const ARCHETYPE_DRIVER_PHRASE = {
        'The Anchor': 'need for control',
        'The Catalyst': 'need for validation',
        'The Wanderer': 'need for freedom or avoidance',
        'The Guardian': 'need for protection'
    };

    // Your Pattern Reset Jumpstart (Dan Koe–aligned: identity first, anti-vision, vision MVP, interrupt, one thing this week)
    function getResetFocusJumpstart(pattern, firstName, answers) {
        if (!pattern || !pattern.name) {
            return '<div class="results-section"><p>Error: Pattern data incomplete.</p></div>';
        }
        const resetFocus = pattern.resetFocus || 'Breaking your pattern';
        const jump = PATTERN_JUMPSTART[pattern.name] || {
            patternVerb: 'repeat my pattern', whenIPattern: 'when I repeat my pattern', protectingBy: 'repeating my pattern',
            interrupt: 'What am I doing right now? Is it my pattern? What\'s one different choice?', enemyHint: 'I need to ___ to feel safe.',
            antiVisionCompressed: 'I refuse to let my life become defined by staying stuck.', visionMVP: 'I\'m building toward being someone who breaks my pattern.', oneThingThisWeek: 'Choose one small action the person you\'re becoming would do—and do it.'
        };
        const identityLine = IDENTITY_PHRASES[pattern.resetFocus] || 'I am someone who breaks my pattern.';
        const shadowParts = (pattern.shadow || 'Stuck → Same results').split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'my pattern';
        const consequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'stay stuck and repeat the same results';
        const antiVision5yr = 'If I keep ' + shadowBehavior + ', in 5 years I\'ll ' + consequence + '.';
        const antiVisionCompressed = jump.antiVisionCompressed || ('I refuse to let my life become ' + consequence + '.');
        const visionMVP = jump.visionMVP || ('I\'m building toward being someone who ' + resetFocus.toLowerCase() + '.');
        const oneThingThisWeek = jump.oneThingThisWeek || 'Choose one small action the person you\'re becoming would do—and do it.';

        return `
            <div class="reset-focus-section">
                <p class="content-text" style="margin-bottom: 1rem;">If you want a specific outcome, you must have the lifestyle that creates it long before you reach it. One shift to focus on first—your jumpstart.</p>
                <div class="reset-focus-box" style="margin-bottom: 1.25rem;">
                    <h4 class="reset-focus-subtitle" style="margin-bottom: 0.5rem;">Primary shift</h4>
                    <p class="reset-focus-content" style="font-weight: 600; margin: 0;">${resetFocus}</p>
                </div>
                <ul class="content-list" style="margin-bottom: 1rem;">
                    <li><strong>Identity:</strong> "${identityLine}"</li>
                    <li><strong>Anti-vision (5 years):</strong> "${antiVision5yr}"</li>
                    <li><strong>Anti-vision (one sentence):</strong> "${antiVisionCompressed}"</li>
                    <li><strong>Vision MVP (one sentence):</strong> "${visionMVP}"</li>
                    <li><strong>One interrupt:</strong> When your pattern shows up, ask: "${jump.interrupt}"</li>
                    <li><strong>One thing this week:</strong> ${oneThingThisWeek}</li>
                    <li><strong>Tomorrow:</strong> Use your interrupt when your pattern shows up. Then choose one different, small action.</li>
                </ul>
            </div>
        `;
    }

    // Your Reset Focus - Answer-Specific (legacy, kept for reference)
    function getResetFocusSection(pattern, firstName, answers) {
        // Safety checks
        if (!pattern) {
            return '<div class="results-section"><p>Error: Pattern data incomplete.</p></div>';
        }
        
        const resetFocus = pattern.resetFocus || 'Breaking your pattern';
        const shadowParts = pattern.shadow ? pattern.shadow.split(' → ') : [];
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const coreBelief = pattern.coreBelief || 'your core belief';
        
        // Get answer-specific actions
        const quizData = window.quizData || [];
        let answerSpecificActions = [];
        
        // Based on health answers (Q11-14)
        if (answers && answers.length > 10 && quizData[11]) {
            const healthAnswer = answers[11];
            if (healthAnswer !== undefined && quizData[11].options[healthAnswer]) {
                const option = quizData[11].options[healthAnswer];
                if (option.driver) {
                    answerSpecificActions.push(`Based on your health challenge answer, start by addressing ${option.text.toLowerCase()}—this is where your pattern shows up most.`);
                }
            }
        }
        
        // Based on lifestyle answers (Q15-18)
        if (answers && answers.length > 14 && quizData[15]) {
            const lifestyleAnswer = answers[15];
            if (lifestyleAnswer !== undefined && quizData[15].options[lifestyleAnswer]) {
                const option = quizData[15].options[lifestyleAnswer];
                if (option.driver) {
                    answerSpecificActions.push(`Your relationship with food (${option.text.substring(0, 50)}...) shows you need to practice mindful eating and break the emotional eating cycle.`);
                }
            }
        }
        
        const answerActionsHTML = answerSpecificActions.length > 0 
            ? `<div class="answer-specific-actions" style="margin-top: 1.5rem; padding: 1rem; background: rgba(202, 0, 19, 0.05); border-left: 3px solid #ca0013; border-radius: 4px;">
                <h4 style="font-size: 1.1rem; font-weight: 600; color: #ca0013; margin-bottom: 0.75rem;">Based on Your Answers:</h4>
                <ul class="content-list">
                    ${answerSpecificActions.map(action => `<li>${action}</li>`).join('')}
                </ul>
               </div>`
            : '';
        
        return `
            <div class="reset-focus-section">
                <div class="reset-focus-box">
                    <h3 class="reset-focus-title">Primary Action: ${resetFocus}</h3>
                    <p class="reset-focus-content">${pattern.resetFocusDescription || pattern.cta || 'Practice this focus area to break your pattern and create lasting change.'}</p>
                </div>
                
                ${answerActionsHTML}
                
                <div class="reset-focus-actions">
                    <div class="reset-focus-do">
                        <h4 class="reset-focus-subtitle">What to Practice:</h4>
                        <ul class="content-list">
                            <li><strong>Practice ${resetFocus.toLowerCase()} daily</strong> - This is your new default, your new focus</li>
                            <li><strong>Notice when your pattern shows up</strong> - Awareness + practice = change</li>
                            <li><strong>Choose a different response</strong> - Instead of autopilot, consciously choose</li>
                            <li><strong>Get support</strong> - You can't do this alone—patterns are too persistent</li>
                        </ul>
                    </div>
                    
                    <div class="reset-focus-stop">
                        <h4 class="reset-focus-subtitle">What to Stop:</h4>
                        <ul class="content-list">
                            <li><strong>Stop ${shadowBehavior}</strong> - This is what's keeping you stuck</li>
                            <li><strong>Stop believing your core belief is the only truth</strong> - "${coreBelief}" isn't the only reality</li>
                            <li><strong>Stop repeating the same behaviors</strong> - They're reinforcing your pattern</li>
                            <li><strong>Stop trying to break it alone</strong> - Patterns need systems, not just willpower</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    // The Solution: 22-Day Pattern Reset
    function getSolutionSection(pattern, nextResetDate, firstName, exactAge, relationshipStatus, patternDominance) {
        // Safety checks
        if (!pattern || !pattern.name) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        const shadowParts = pattern.shadow ? pattern.shadow.split(' → ') : [];
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        
        return `
                <p class="content-text" style="font-size: 1.2rem; font-weight: 600; color: #000; margin-bottom: 1.5rem;">
                    ${firstName ? `${firstName}, ` : ''}You know your pattern. You understand why you're stuck. Now you need a <strong>system to actually break it</strong>.
                </p>
                
                <div class="problem-solution-framework">
                    <div class="problem-box">
                        <h3 class="framework-title">The Problem:</h3>
                        <p class="content-text">Your ${pattern.name.toLowerCase()} pattern is costing you relationships, opportunities, health, money, and your sense of self. Every day you ${shadowBehavior}, you're reinforcing it. Awareness alone won't break it—you need consistent practice with support.</p>
                    </div>
                    
                    <div class="solution-box">
                        <h3 class="framework-title">The Solution:</h3>
                        <p class="content-text">The 22-Day Pattern Reset gives you a <strong>science-backed system</strong> to break your pattern: daily practice, pattern interruption tools, community support, and accountability. In 22 days, you'll create new neural pathways and establish breaking your pattern as your new normal.</p>
                    </div>
                </div>
                
                <div class="solution-benefits">
                    <h3 class="subsection-title">What You Get in the 22-Day Pattern Reset:</h3>
                    <ul class="content-list">
                        <li><strong>Daily guidance for your ${pattern.name} pattern</strong> - Specific practices for ${pattern.resetFocus.toLowerCase()}, tailored to your unique situation</li>
                        <li><strong>Pattern interruption tools</strong> - Learn to recognize and interrupt your ${pattern.name.toLowerCase()} pattern in real-time, before it takes over</li>
                        <li><strong>Community support</strong> - Join others breaking similar patterns (you're not alone in this)</li>
                        <li><strong>Accountability</strong> - Daily check-ins and peer support to keep you on track when it gets hard</li>
                        <li><strong>Personalized focus</strong> - Work on your unique goals across habits, career, finance, and relationships</li>
                        <li><strong>Neural pathway rewiring</strong> - 22 days of consistent practice to create new automatic responses</li>
                        <li><strong>Time Wealth methodology</strong> - Learn to invest your energy, focus, and time into what you want to grow, not what's keeping you stuck</li>
                    </ul>
                </div>
                
                <div class="solution-why">
                    <h3 class="subsection-title">Why This Works (Science-Backed):</h3>
                    <ul class="content-list">
                        <li><strong>22 days is the minimum time needed</strong> to create new neural pathways (neuroscience research)</li>
                        <li><strong>Daily practice creates automatic responses</strong> - Your new behavior becomes your default (habit formation research)</li>
                        <li><strong>Support and accountability increase success</strong> - Patterns are too persistent to break alone (behavioral psychology research)</li>
                        <li><strong>Community reduces isolation</strong> - Knowing others are breaking similar patterns increases motivation and reduces shame</li>
                    </ul>
                </div>
                
                <div class="solution-stakes">
                    <p class="content-text" style="font-size: 1.2rem; font-weight: 700; color: #ca0013; margin-top: 2rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.08); border-radius: 8px; border-left: 4px solid #ca0013;">
                        <strong>The Stakes Are High:</strong> Every day you wait, your pattern gets stronger. Every day you don't break it, it costs you more—in relationships, opportunities, health, money, and your sense of self. The 22-Day Pattern Reset gives you the system, support, and structure to actually break it. <strong>You need a system, not just willpower.</strong>
                    </p>
            </div>
        `;
    }
    
    // Emotional Drivers Section - With Interaction Analysis
    function getEmotionalDriversSection(sortedDrivers, driverNames, driverDescriptions, driverPercentages, archetype, pattern, firstName) {
        const dominantDriver = sortedDrivers[0][0];
        const dominantPercent = driverPercentages[dominantDriver];
        const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
        const secondaryPercent = sortedDrivers[1] ? driverPercentages[sortedDrivers[1][0]] : 0;
        
        // Driver interaction analysis
        let interactionAnalysis = '';
        if (secondaryDriver && secondaryPercent >= 20) {
            const dominantName = driverNames[dominantDriver] || dominantDriver;
            const secondaryName = driverNames[secondaryDriver] || secondaryDriver;
            
            if ((dominantDriver === 'control' && secondaryDriver === 'avoidance') || (dominantDriver === 'avoidance' && secondaryDriver === 'control')) {
                interactionAnalysis = `<div class="driver-interaction" style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.08); border-left: 4px solid #ca0013; border-radius: 4px;">
                    <h4 style="font-size: 1.1rem; font-weight: 600; color: #ca0013; margin-bottom: 0.75rem;">Driver Interaction Analysis:</h4>
                    <p class="content-text">Your combination of <strong>${dominantName} (${dominantPercent}%)</strong> and <strong>${secondaryName} (${secondaryPercent}%)</strong> creates internal conflict. You want to take charge (Control) but also want to avoid discomfort (Avoidance), which creates a push-pull dynamic. This conflict makes it harder to know what you actually want and creates confusion in your decision-making.</p>
                    <p class="content-text" style="margin-top: 0.75rem;"><strong>Which to work on first:</strong> Start with your dominant driver (${dominantName})—breaking this ${dominantPercent}% pattern first will reduce the conflict and give you clarity.</p>
                </div>`;
            } else if ((dominantDriver === 'validation' && secondaryDriver === 'fear-of-rejection') || (dominantDriver === 'fear-of-rejection' && secondaryDriver === 'validation')) {
                interactionAnalysis = `<div class="driver-interaction" style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.08); border-left: 4px solid #ca0013; border-radius: 4px;">
                    <h4 style="font-size: 1.1rem; font-weight: 600; color: #ca0013; margin-bottom: 0.75rem;">Driver Interaction Analysis:</h4>
                    <p class="content-text">Your combination of <strong>${dominantName} (${dominantPercent}%)</strong> and <strong>${secondaryName} (${secondaryPercent}%)</strong> creates a cycle: You seek approval (Validation) but fear rejection (Fear of Rejection), so you perform to earn approval while simultaneously protecting yourself from being hurt. This creates exhaustion and prevents authentic connection.</p>
                    <p class="content-text" style="margin-top: 0.75rem;"><strong>Which to work on first:</strong> Start with your dominant driver (${dominantName})—breaking this ${dominantPercent}% pattern first will reduce the cycle and allow you to show up authentically.</p>
                </div>`;
            } else {
                interactionAnalysis = `<div class="driver-interaction" style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.08); border-left: 4px solid #ca0013; border-radius: 4px;">
                    <h4 style="font-size: 1.1rem; font-weight: 600; color: #ca0013; margin-bottom: 0.75rem;">Driver Interaction Analysis:</h4>
                    <p class="content-text">Your secondary driver (<strong>${secondaryName} at ${secondaryPercent}%</strong>) is actually protecting you from your dominant driver (<strong>${dominantName} at ${dominantPercent}%</strong>). This creates internal conflict and makes it harder to know what you actually want. Breaking your dominant ${dominantPercent}% pattern first will reduce this conflict and give you clarity.</p>
                    <p class="content-text" style="margin-top: 0.75rem;"><strong>Which to work on first:</strong> Focus on your dominant driver (${dominantName})—this ${dominantPercent}% pattern is the primary one running your life.</p>
                </div>`;
            }
        }
        
        // Get how each driver applies to this specific archetype and pattern
        const driverContexts = {
            'control': {
                title: 'Control Driver',
                description: 'You seek safety through taking charge and solving problems.',
                howItApplies: `As ${archetype.name}, your control driver (${dominantPercent}%) shows up as ${pattern.name.toLowerCase()}—you take charge and create structure when you feel unsafe. This is your primary way of feeling secure.`,
                impact: dominantDriver === 'control' ? 'This is your dominant driver—it\'s the primary force behind your pattern.' : `While not your dominant driver, control still influences ${driverPercentages['control'] || 0}% of your decisions, showing up when you need to feel in charge.`
            },
            'avoidance': {
                title: 'Avoidance Driver',
                description: 'You avoid difficult emotions by staying free and flexible.',
                howItApplies: `As ${archetype.name}, your avoidance driver (${driverPercentages['avoidance'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you stay mobile and avoid commitment when you feel unsafe. This is how you protect yourself.`,
                impact: dominantDriver === 'avoidance' ? 'This is your dominant driver—it\'s the primary force behind your pattern.' : `While not your dominant driver, avoidance still influences ${driverPercentages['avoidance'] || 0}% of your decisions, showing up when you need to feel free.`
            },
            'validation': {
                title: 'Validation Driver',
                description: 'You seek approval through achievement and recognition.',
                howItApplies: `As ${archetype.name}, your validation driver (${driverPercentages['validation'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you perform and earn approval when you feel unsafe. This is how you feel worthy.`,
                impact: dominantDriver === 'validation' ? 'This is your dominant driver—it\'s the primary force behind your pattern.' : `While not your dominant driver, validation still influences ${driverPercentages['validation'] || 0}% of your decisions, showing up when you need to feel valued.`
            },
            'fear-of-rejection': {
                title: 'Fear of Rejection Driver',
                description: 'You protect yourself by keeping distance and being perfect.',
                howItApplies: `As ${archetype.name}, your fear of rejection driver (${driverPercentages['fear-of-rejection'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you keep boundaries and protect yourself when you feel unsafe. This is how you stay safe.`,
                impact: dominantDriver === 'fear-of-rejection' ? 'This is your dominant driver—it\'s the primary force behind your pattern.' : `While not your dominant driver, fear of rejection still influences ${driverPercentages['fear-of-rejection'] || 0}% of your decisions, showing up when you need to protect yourself.`
            }
        };
        
        return `
            <div class="emotional-drivers-breakdown">
                <h3 class="drivers-section-title">Your 4 Emotional Drivers & How They Apply to You</h3>
                <p class="drivers-intro">These 4 emotional drivers show how your ${pattern.name} pattern operates. Here's how each one applies to you as ${archetype.name}:</p>
                
                <div class="drivers-grid">
                    ${sortedDrivers.map(([driver, percentage]) => {
                        const context = driverContexts[driver];
                        return `
                            <div class="driver-card ${driver === dominantDriver ? 'dominant' : ''}">
                                <div class="driver-header">
                                    <h4 class="driver-card-title">${context.title}</h4>
                                    <div class="driver-percentage-badge">${percentage}%</div>
                                </div>
                                <p class="driver-card-description">${context.description}</p>
                                <div class="driver-application">
                                    <p class="driver-how-applies"><strong>How it applies to you:</strong> ${context.howItApplies}</p>
                                    <p class="driver-impact">${context.impact}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${interactionAnalysis}
            </div>
        `;
    }
    
    // Personalized Pattern Story - Connect the Dots Based on Answers
    function getPersonalizedPatternStory(pattern, archetype, patternDominance, driverPercentages, sortedDrivers, exactAge, relationshipStatus, firstName, answers, driverScores) {
        // Safety check
        if (!pattern || !pattern.name) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        // Get quiz data if available (for question analysis)
        const quizData = window.quizData || [];
        
        // Build the story based on answers and pattern
        const story = buildPersonalizedStory(pattern, archetype, patternDominance, driverPercentages, sortedDrivers, exactAge, relationshipStatus, firstName, answers, quizData, driverScores);
        
        return `
            <p class="story-intro" style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">${firstName ? `${firstName}, ` : ''}Here's your pattern story—how your answers connect to reveal the bigger picture of what's been running your life:</p>
                
                ${story}
        `;
    }
    
    // Build the personalized story based on answers
    function buildPersonalizedStory(pattern, archetype, patternDominance, driverPercentages, sortedDrivers, exactAge, relationshipStatus, firstName, answers, quizData, driverScores) {
        // Safety check for answers
        if (!answers || !Array.isArray(answers)) {
            answers = [];
        }
        
        const dominantDriver = sortedDrivers[0][0];
        const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
        const secondaryPercent = sortedDrivers[1] ? driverPercentages[sortedDrivers[1][0]] : 0;
        
        // Get quiz data from window if not passed
        const qData = quizData || window.quizData || [];
        
        // Get domain ranges from config (safe fallback if not available)
        const config = window.QUIZ_CONFIG || {};
        const domains = config.QUESTION_DOMAINS || {
            LOVE: { start: 0, end: 3 },
            MONEY: { start: 4, end: 7 },
            HEALTH: { start: 8, end: 13 },
            LIFESTYLE: { start: 14, end: 17 },
            PHYSICAL: { start: 18, end: 19 },
            PRODUCTIVITY: { start: 20, end: 22 },
            PURPOSE: { start: 23, end: 25 },
            IDENTITY: { start: 26, end: 29 },
            CHILDHOOD: { start: 30, end: 35 },
            RELATIONSHIPS: { start: 36, end: 41 },
            REFLECTION: { start: 42, end: 43 }
        };
        
        // Analyze answers by domain to build story (using config ranges)
        const loveAnswers = getAnswersForDomain(answers, domains.LOVE);
        const moneyAnswers = getAnswersForDomain(answers, domains.MONEY);
        const healthAnswers = getAnswersForDomain(answers, domains.HEALTH);
        const lifestyleAnswers = getAnswersForDomain(answers, domains.LIFESTYLE);
        const physicalAnswers = getAnswersForDomain(answers, domains.PHYSICAL);
        const productivityAnswers = getAnswersForDomain(answers, domains.PRODUCTIVITY);
        const purposeAnswers = getAnswersForDomain(answers, domains.PURPOSE);
        const identityAnswers = getAnswersForDomain(answers, domains.IDENTITY);
        const childhoodAnswers = getAnswersForDomain(answers, domains.CHILDHOOD);
        const traumaAnswers = getAnswersForDomain(answers, domains.TRAUMA);
        const relationshipAnswers = getAnswersForDomain(answers, domains.RELATIONSHIPS);
        const reflectionAnswers = getAnswersForDomain(answers, domains.REFLECTION);
        
        // Build story sections
        const originStory = buildOriginStory(pattern, archetype, childhoodAnswers, exactAge, qData);
        const howItShowsUp = buildHowItShowsUp(pattern, loveAnswers, moneyAnswers, healthAnswers, lifestyleAnswers, physicalAnswers, productivityAnswers, purposeAnswers, identityAnswers, relationshipAnswers, reflectionAnswers, relationshipStatus, qData);
        const howItsReinforced = buildHowItsReinforced(pattern, dominantDriver, driverPercentages, sortedDrivers);
        const whyYoureStuck = buildWhyYoureStuck(pattern, patternDominance, secondaryDriver, secondaryPercent);
        const theBigPicture = buildBigPicture(pattern, archetype, patternDominance, exactAge, relationshipStatus, firstName);
        
        return `
            <div class="story-section origin-story">
                <h3 class="story-section-title">Your Origin Story: Where This Pattern Started</h3>
                ${originStory}
            </div>
            
            <div class="story-section how-it-shows">
                <h3 class="story-section-title">How Your Pattern Shows Up: What Your Answers Reveal</h3>
                ${howItShowsUp}
            </div>
            
            <div class="story-section how-reinforced">
                <h3 class="story-section-title">How Your Pattern Gets Reinforced: The Cycle</h3>
                ${howItsReinforced}
            </div>
            
            <div class="story-section why-stuck">
                <h3 class="story-section-title">Why You're Stuck: The Truth</h3>
                ${whyYoureStuck}
            </div>
            
            <div class="story-section big-picture">
                <h3 class="story-section-title">The Big Picture: What This All Means</h3>
                ${theBigPicture}
            </div>
        `;
    }
    
    // Build origin story based on childhood answers
    function buildOriginStory(pattern, archetype, childhoodAnswers, exactAge, quizData) {
        const hasChildhoodData = childhoodAnswers && childhoodAnswers.length > 0;
        const hasQuizData = quizData && quizData.length > 0;
        
        // Get childhood domain range from config (safe fallback if config not available)
        const childhoodDomain = (window.QUIZ_CONFIG && window.QUIZ_CONFIG.QUESTION_DOMAINS && window.QUIZ_CONFIG.QUESTION_DOMAINS.CHILDHOOD) || { start: 30, end: 34 };
        const childhoodStart = childhoodDomain.start;
        const childhoodEnd = childhoodDomain.end;
        const childhoodLength = childhoodEnd - childhoodStart + 1;
        
        let story = '';
        
        if (hasChildhoodData && hasQuizData) {
            // Analyze childhood answers to build personalized origin
            story = `Based on your answers about your childhood and early experiences, your ${pattern.name.toLowerCase()} pattern likely developed as a <strong>survival strategy</strong>. `;
            
            // Check for specific patterns in childhood answers (use domain-based lookup)
            const controlAnswers = childhoodAnswers.filter((ans, idx) => {
                const questionIndex = childhoodStart + idx;
                if (idx < childhoodLength && quizData[questionIndex] && quizData[questionIndex].options) {
                    const option = quizData[questionIndex].options[ans];
                    return option && option.driver === 'control';
                }
                return false;
            }).length;
            
            const avoidanceAnswers = childhoodAnswers.filter((ans, idx) => {
                const questionIndex = childhoodStart + idx;
                if (idx < childhoodLength && quizData[questionIndex] && quizData[questionIndex].options) {
                    const option = quizData[questionIndex].options[ans];
                    return option && option.driver === 'avoidance';
                }
                return false;
            }).length;
            
            if (controlAnswers >= 3) {
                story += `You learned early that taking charge and solving problems kept you safe. Maybe you were the "responsible one" in your family, or you learned that fixing things earned you love and approval. This ${pattern.name.toLowerCase()} pattern developed as a way to feel secure—and it worked. But now it's limiting you.`;
            } else if (avoidanceAnswers >= 3) {
                story += `You learned early that avoiding difficult emotions and staying free kept you safe. Maybe you learned that feeling deeply was dangerous, or that staying mobile prevented you from getting hurt. This ${pattern.name.toLowerCase()} pattern developed as a way to protect yourself—and it worked. But now it's preventing you from experiencing deep connection.`;
            } else {
                story += `Your early experiences shaped how you learned to navigate the world. This ${pattern.name.toLowerCase()} pattern developed as a way to feel safe and secure—and it worked when you needed it most. But now, what once protected you is holding you back.`;
            }
        } else {
            // Generic but personalized origin story
            story = `Your ${pattern.name.toLowerCase()} pattern likely developed early in life as a <strong>survival strategy</strong>. As ${archetype.name}, you learned that ${getArchetypeSurvivalStrategy(archetype.name)} kept you safe. This pattern worked when you needed it most—it protected you, helped you navigate difficult situations, and gave you a sense of control. But now, what once served you is limiting you.`;
        }
        
        if (exactAge) {
            story += ` At ${exactAge}, this pattern has been running for ${exactAge >= 30 ? 'decades' : 'years'}, becoming more ingrained with each repetition.`;
        }
        
        return `<p class="story-content">${story}</p>`;
    }
    
    // Helper function to get answers for a domain
    function getAnswersForDomain(answers, domain) {
        if (!domain || !answers || !Array.isArray(answers)) return [];
        const start = domain.start || 0;
        const end = domain.end || 0;
        return answers.slice(start, end + 1).filter(a => a !== undefined);
    }
    
    // Build how pattern shows up based on answers
    function buildHowItShowsUp(pattern, loveAnswers, moneyAnswers, healthAnswers, lifestyleAnswers, physicalAnswers, productivityAnswers, purposeAnswers, identityAnswers, relationshipAnswers, reflectionAnswers, relationshipStatus, quizData) {
        let story = `Your answers reveal how your ${pattern.name.toLowerCase()} pattern shows up across every area of your life:`;
        
        const sections = [];
        
        // Love & Relationships
        if (loveAnswers.length > 0) {
            sections.push(`<strong>In Love & Relationships:</strong> Your answers show that when someone pulls away or conflict arises, you ${getPatternResponse(pattern.name, 'love')}. This ${pattern.name.toLowerCase()} response is your default—it's how you navigate relationships when you feel unsafe.`);
        }
        
        // Money & Finances
        if (moneyAnswers.length > 0) {
            sections.push(`<strong>In Money & Finances:</strong> Your answers reveal that your ${pattern.name.toLowerCase()} pattern influences how you approach financial decisions. You ${getPatternResponse(pattern.name, 'money')}, which affects your financial security and freedom.`);
        }
        
        // Health & Habits
        if (healthAnswers.length > 0) {
            sections.push(`<strong>In Health & Habits:</strong> Your answers show that your ${pattern.name.toLowerCase()} pattern affects your health routines, stress responses, and habit-building. You ${getPatternResponse(pattern.name, 'health')}, which impacts your wellbeing and daily habits.`);
        }
        
        // Lifestyle & Daily Habits
        if (lifestyleAnswers.length > 0) {
            sections.push(`<strong>In Lifestyle & Daily Habits:</strong> Your answers reveal that your ${pattern.name.toLowerCase()} pattern shows up in your relationship with food, sleep, daily routines, and movement. This affects your overall lifestyle and how you care for yourself.`);
        }
        
        // Physical Health & Body
        if (physicalAnswers.length > 0) {
            sections.push(`<strong>In Physical Health & Body:</strong> Your answers show that your ${pattern.name.toLowerCase()} pattern influences your relationship with your body and energy levels. This affects how you feel physically and how you show up in your body.`);
        }
        
        // Productivity & Time
        if (productivityAnswers.length > 0) {
            sections.push(`<strong>In Productivity & Time:</strong> Your answers reveal that your ${pattern.name.toLowerCase()} pattern affects how you manage time, handle procrastination, and approach productivity. This impacts your ability to achieve your goals.`);
        }
        
        // Purpose & Flow
        if (purposeAnswers.length > 0) {
            sections.push(`<strong>In Purpose & Flow:</strong> Your answers show that your ${pattern.name.toLowerCase()} pattern influences how you connect with your purpose, experience flow, and pursue your calling. This affects your sense of meaning and direction.`);
        }
        
        // Identity & Self
        if (identityAnswers.length > 0) {
            sections.push(`<strong>In Identity & Self-Worth:</strong> Your answers reveal that your ${pattern.name.toLowerCase()} pattern shapes how you see yourself, handle pressure, and think about changing. This affects your sense of self and worth.`);
        }
        
        // Relationship Patterns
        if (relationshipAnswers.length > 0) {
            sections.push(`<strong>In Relationship Patterns:</strong> Your answers show that your ${pattern.name.toLowerCase()} pattern influences how you connect with others, handle intimacy, and navigate relationships. This affects your ability to build deep, lasting connections.`);
        }
        
        // Reflection
        if (reflectionAnswers.length > 0) {
            sections.push(`<strong>In Reflection & Self-Awareness:</strong> Your answers reveal that your ${pattern.name.toLowerCase()} pattern affects what you hold onto and how you see your self-worth and ability to change. This impacts your readiness for transformation.`);
        }
        
        if (sections.length > 0) {
            story += '<ul class="story-list">' + sections.map(s => `<li>${s}</li>`).join('') + '</ul>';
        } else {
            story += ` Your ${pattern.name.toLowerCase()} pattern shows up consistently across all these areas, creating a system-wide pattern that needs a system-wide solution.`;
        }
        
        return `<p class="story-content">${story}</p>`;
    }
    
    // Build how pattern gets reinforced
    function buildHowItsReinforced(pattern, dominantDriver, driverPercentages, sortedDrivers) {
        const shadowParts = pattern.shadow ? pattern.shadow.split(' → ') : [];
        const shadowBehavior = pattern.shadow ? getShadowBehaviorVerb(pattern.shadow) : 'repeat this pattern';
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        let story = `Your ${pattern.name.toLowerCase()} pattern gets reinforced through a <strong>self-reinforcing cycle</strong>:`;
        
        story += `<ol class="story-list">`;
        story += `<li><strong>You feel unsafe or uncertain</strong> - This triggers your ${dominantDriver} driver (${driverPercentages[dominantDriver]}%), which activates your ${pattern.name.toLowerCase()} pattern.</li>`;
        story += `<li><strong>You ${shadowBehavior}</strong> - This is your automatic response, your default when you feel unsafe.</li>`;
        story += `<li><strong>You experience ${shadowConsequence}</strong> - This is the consequence of your pattern behavior.</li>`;
        story += `<li><strong>This reinforces your core belief</strong> - "${pattern.coreBelief || 'Your core belief'}" gets strengthened, making you believe this is the only way to stay safe.</li>`;
        story += `<li><strong>The cycle repeats</strong> - Every time you repeat this cycle, the neural pathway gets stronger, making it harder to break.</li>`;
        story += `</ol>`;
        
        story += `<p class="story-content" style="margin-top: 1rem;"><strong>The problem:</strong> This cycle feeds itself. The more you ${shadowBehavior}, the stronger the pattern becomes, and the harder it is to break. Your brain has literally wired itself around this cycle.</p>`;
        
        return `<div class="story-content">${story}</div>`;
    }
    
    // Build why you're stuck
    function buildWhyYoureStuck(pattern, patternDominance, secondaryDriver, secondaryPercent) {
        const otherPatternsPercent = 100 - patternDominance;
        
        let story = `You're stuck because your ${pattern.name.toLowerCase()} pattern (${patternDominance}%) is your <strong>dominant pattern</strong>—it's the primary one running your life. `;
        
        if (secondaryDriver && secondaryPercent >= 20) {
            story += `You also have a secondary pattern (${secondaryPercent}% ${getDriverName(secondaryDriver)}) that creates internal conflict. `;
        }
        
        if (otherPatternsPercent > 30) {
            story += `The other ${otherPatternsPercent}% represents competing patterns that create confusion and make it harder to know what you actually want. `;
        }
        
        story += `Here's why you're stuck:`;
        
        story += `<ul class="story-list">`;
        story += `<li><strong>Your pattern operates on autopilot</strong> - After years of repetition, it's automatic. You don't consciously choose it—it just happens.</li>`;
        story += `<li><strong>Your core belief feels like truth</strong> - "${pattern.coreBelief || 'Your core belief'}" feels like the only reality, making it hard to see other options.</li>`;
        story += `<li><strong>Breaking it feels unsafe</strong> - Your pattern developed to keep you safe, so breaking it feels dangerous, even when it's not.</li>`;
        story += `<li><strong>You don't know who you are without it</strong> - Your identity is tied to your pattern, making it hard to imagine life without it.</li>`;
        if (otherPatternsPercent > 30) {
            story += `<li><strong>Competing patterns create confusion</strong> - The ${otherPatternsPercent}% of other patterns creates internal conflict, making it harder to know what you actually want.</li>`;
        }
        story += `</ul>`;
        
        return `<div class="story-content">${story}</div>`;
    }
    
    // Build the big picture
    function buildBigPicture(pattern, archetype, patternDominance, exactAge, relationshipStatus, firstName) {
        let story = `${firstName ? `${firstName}, ` : ''}Here's the big picture—what all of this means for you:`;
        
        story += `<p class="story-content" style="margin-top: 1rem; font-size: 1.15rem; line-height: 1.7;">`;
        story += `Your ${pattern.name.toLowerCase()} pattern (${patternDominance}%) is your <strong>dominant pattern</strong>—it's the primary one running your life right now. As ${archetype.name}, this pattern shows up in how you navigate relationships, work, health, money, and your sense of self. `;
        
        if (exactAge) {
            story += `At ${exactAge}, this pattern has been running for ${exactAge >= 30 ? 'decades' : 'years'}, becoming more ingrained with each repetition. `;
        }
        
        story += `Every time you repeat this pattern, it gets stronger. Every day you don't break it, it costs you more—in relationships, opportunities, health, money, and your sense of self.`;
        story += `</p>`;
        
        story += `<p class="story-content" style="margin-top: 1.5rem; font-weight: 600; color: #ca0013; font-size: 1.1rem;">`;
        story += `But here's the truth: <strong>This pattern isn't who you are—it's what you learned to survive.</strong> And just as you learned it, you can unlearn it. You can break this cycle and create something new.`;
        story += `</p>`;
        
        return `<div class="story-content">${story}</div>`;
    }
    
    // Helper functions for story building
    function getArchetypeSurvivalStrategy(archetypeName) {
        const strategies = {
            'The Anchor': 'taking charge and creating structure',
            'The Catalyst': 'achieving and earning approval',
            'The Wanderer': 'staying free and avoiding commitment',
            'The Guardian': 'protecting yourself and keeping distance'
        };
        return strategies[archetypeName] || 'navigating the world in a specific way';
    }
    
    function getPatternResponse(patternName, area) {
        const responses = {
            'Fixer': {
                'love': 'jump in to fix problems and take charge',
                'money': 'try to control and manage everything',
                'health': 'create strict plans and systems',
                'identity': 'see yourself as the problem-solver',
                'relationships': 'step in to solve others\' problems'
            },
            'Perfectionist': {
                'love': 'analyze every decision and wait for the perfect choice',
                'money': 'overthink every financial decision',
                'health': 'create perfect routines that are too rigid',
                'identity': 'see yourself as someone who does things right',
                'relationships': 'analyze every interaction for flaws'
            },
            'Pleaser': {
                'love': 'say yes to everything and prioritize others\' needs',
                'money': 'spend to please others and show you care',
                'health': 'prioritize others\' health needs over your own',
                'identity': 'see yourself as helpful and caring',
                'relationships': 'people-please to maintain connection'
            },
            'Performer': {
                'love': 'work hard to impress and earn approval',
                'money': 'spend to show status and impress others',
                'health': 'work out and eat well to look good',
                'identity': 'see yourself as successful and achieving',
                'relationships': 'perform to earn love and approval'
            },
            'Escaper': {
                'love': 'avoid difficult conversations and stay busy',
                'money': 'avoid dealing with finances and stay distracted',
                'health': 'avoid dealing with health issues and numb feelings',
                'identity': 'see yourself as free and independent',
                'relationships': 'avoid commitment and stay mobile'
            },
            'Overthinker': {
                'love': 'analyze every interaction and get stuck thinking',
                'money': 'overthink every financial decision',
                'health': 'research endlessly but struggle to take action',
                'identity': 'see yourself as thoughtful and analytical',
                'relationships': 'analyze every text and interaction'
            },
            'Withdrawer': {
                'love': 'push people away when they get too close',
                'money': 'protect yourself by keeping everything separate',
                'health': 'avoid health support and stay isolated',
                'identity': 'see yourself as independent and self-sufficient',
                'relationships': 'keep emotional distance to protect yourself'
            },
            'Overgiver': {
                'love': 'give everything hoping they\'ll see your worth',
                'money': 'give money away to show your worth',
                'health': 'give your energy to everyone else',
                'identity': 'see yourself as generous and giving',
                'relationships': 'give more than you receive'
            }
        };
        
        return responses[patternName] && responses[patternName][area] 
            ? responses[patternName][area] 
            : `respond in ways that reflect your ${patternName.toLowerCase()} pattern`;
    }
    
    function getDriverName(driver) {
        const names = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        return names[driver] || driver;
    }
    
    // ========================================
    // ACCORDION HELPER FUNCTIONS
    // ========================================
    
    // Create accordion section structure
    function getAccordionSection(id, title, content, isExpanded, preview) {
        const expandedClass = isExpanded ? 'expanded' : '';
        const iconRotation = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
        const previewText = preview ? `<span class="accordion-preview">${preview}</span>` : '';
        
        return `
            <div class="accordion-item ${expandedClass}" data-section="${id}">
                <button class="accordion-header ${expandedClass}" onclick="toggleAccordion('${id}')">
                    <span class="accordion-icon" style="transform: ${iconRotation};">▶</span>
                    <span class="accordion-title">${title}</span>
                    ${previewText}
                </button>
                <div class="accordion-content ${expandedClass}">
                    ${content}
                </div>
            </div>
        `;
    }
    
    // Get driver preview for accordion header
    function getDriverPreview(sortedDrivers, driverPercentages) {
        if (!sortedDrivers || sortedDrivers.length === 0) return '';
        const top2 = sortedDrivers.slice(0, 2);
        return top2.map(([driver, percent]) => {
            const driverName = getDriverName(driver);
            return `${driverName}: ${percent}%`;
        }).join(' • ');
    }
    
    // Quick Summary - At Top of Hero (User-Friendly, Value-Focused, Clean & Minimal)
    // Get 4 condensed daily life examples for hero section
    function getHeroDailyLifeExamples(pattern, answers, quizData, firstName, exactAge, relationshipStatus) {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return '';
        }
        
        const examples = [];
        
        // Always include relationship example
        const relationshipEx = getRelationshipDailyExample(pattern, answers, quizData, relationshipStatus);
        if (relationshipEx) examples.push({ area: 'Relationships', example: relationshipEx });
        
        // Always include career example
        const careerEx = getCareerDailyExample(pattern, answers, quizData);
        if (careerEx) examples.push({ area: 'Career', example: careerEx });
        
        // Always include finance example
        const financeEx = getFinanceDailyExample(pattern, answers, quizData);
        if (financeEx) examples.push({ area: 'Finances', example: financeEx });
        
        // Always include health example
        const healthEx = getHealthDailyExample(pattern, answers, quizData);
        if (healthEx) examples.push({ area: 'Health', example: healthEx });
        
        // Take first 4 examples
        const selectedExamples = examples.slice(0, 4);
        
        if (selectedExamples.length === 0) return '';
        
        return `
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <h4 style="font-size: 1.1rem; font-weight: 600; color: #000; margin: 0 0 1.25rem 0;">How It Shows Up in Your Daily Life</h4>
                ${selectedExamples.map((ex, idx) => `
                    <div style="margin-bottom: 1.25rem; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; border-left: 3px solid rgba(202, 0, 19, 0.3);">
                        <p style="font-size: 0.95rem; font-weight: 600; color: #000; margin: 0 0 0.5rem 0;">${ex.area}:</p>
                        <p style="font-size: 0.95rem; line-height: 1.7; color: #333; margin: 0;">${ex.example}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Get "Why It Matters Now" - Urgency, Costs, and Stakes
    function getWhyItMattersNow(pattern, patternDominance, firstName) {
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '';
        }
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        const urgencyMessages = {
            'Fixer': `Every day you don't break this pattern, you're losing your peace, energy, and ability to focus on your own goals. You're burning out from overfunctioning, and your relationships are becoming one-sided. The longer you wait, the more exhausted you become.`,
            'Perfectionist': `Every day you don't break this pattern, you're missing opportunities, feeling never good enough, and burning out from trying to be flawless. You're paralyzed by perfectionism, and it's costing you progress. The longer you wait, the more stuck you become.`,
            'Pleaser': `Every day you don't break this pattern, you're losing yourself, feeling resentful, and building relationships that drain you. You're saying yes to everything but yourself. The longer you wait, the more you disappear.`,
            'Performer': `Every day you don't break this pattern, you're burning out, feeling empty, and working for others instead of yourself. You're performing constantly but never feeling worthy. The longer you wait, the more exhausted you become.`,
            'Escaper': `Every day you don't break this pattern, you're disconnecting from yourself and others, staying busy to avoid feelings, and missing deep connections. You're escaping but never finding peace. The longer you wait, the more disconnected you become.`,
            'Overthinker': `Every day you don't break this pattern, you're missing opportunities, feeling paralyzed, and getting stuck in your head. You're analyzing but never acting. The longer you wait, the more opportunities you miss.`,
            'Withdrawer': `Every day you don't break this pattern, you're creating the loneliness you fear, pushing people away, and missing deep connections. You're protecting yourself but isolating yourself. The longer you wait, the more alone you become.`,
            'Overgiver': `Every day you don't break this pattern, you're neglecting yourself, feeling resentful, and giving more than you receive. You're hoping others will see your worth, but you're losing yourself. The longer you wait, the more drained you become.`
        };
        
        const urgencyMessage = urgencyMessages[pattern.name] || `Every day you don't break this pattern, it gets stronger. This ${pattern.name.toLowerCase()} pattern is running ${patternDominance}% of your life right now. The longer you wait, the harder it becomes to break.`;
        
        const costOfWaitingMessage = `Every day you don't break this pattern, it gets stronger. Every day you wait, it costs you more—in relationships, opportunities, health, money, and your sense of self.`;
        
        return `
            <div style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.05); border-radius: 6px; border-left: 4px solid rgba(202, 0, 19, 0.3);">
                <h4 style="font-size: 1rem; font-weight: 600; color: #ca0013; margin: 0 0 1rem 0;">Why This Matters Now:</h4>
                <p style="font-size: 0.95rem; line-height: 1.7; color: #333; margin: 0 0 1.5rem 0;">
                    ${urgencyMessage}
                </p>
                
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(202, 0, 19, 0.2);">
                    <p style="font-size: 0.95rem; font-weight: 600; color: #000; margin: 0 0 1rem 0;">What You're Missing</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.25rem 0;">💔 In Relationships:</p>
                            <p style="font-size: 0.9rem; line-height: 1.6; color: #555; margin: 0;">You're missing <strong>authentic connection</strong>. When you ${shadowBehavior}, you can't show up fully, which prevents deep intimacy.</p>
                        </div>
                        
                        <div>
                            <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.25rem 0;">💼 In Your Career:</p>
                            <p style="font-size: 0.9rem; line-height: 1.6; color: #555; margin: 0;">You're missing <strong>opportunities for growth</strong>. Your pattern prevents you from taking risks or showing up authentically at work.</p>
                        </div>
                        
                        <div>
                            <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.25rem 0;">🏃 In Your Health:</p>
                            <p style="font-size: 0.9rem; line-height: 1.6; color: #555; margin: 0;">You're missing <strong>sustainable health habits</strong>. Your pattern leads to ${shadowConsequence}, creating stress and burnout.</p>
                        </div>
                        
                        <div>
                            <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.25rem 0;">💰 In Your Finances:</p>
                            <p style="font-size: 0.9rem; line-height: 1.6; color: #555; margin: 0;">You're missing <strong>financial security</strong>. Your pattern prevents confident financial decisions and building wealth.</p>
                        </div>
                        
                        <div>
                            <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.25rem 0;">🎭 In Your Identity:</p>
                            <p style="font-size: 0.9rem; line-height: 1.6; color: #555; margin: 0;">You're missing <strong>knowing who you really are</strong>. Your pattern has become so ingrained that you don't know yourself outside of it.</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(202, 0, 19, 0.2);">
                    <p style="font-size: 0.95rem; font-weight: 600; color: #ca0013; margin: 0 0 0.5rem 0;">The Cost of Waiting:</p>
                    <p style="font-size: 0.95rem; line-height: 1.7; color: #333; margin: 0;">
                        ${costOfWaitingMessage} The longer you wait, the harder it becomes to break.
                    </p>
                </div>
            </div>
        `;
    }
    
    function getQuickSummary(archetype, pattern, patternDominance, dominanceLabel, firstName, exactAge, relationshipStatus, answers, quizData, sortedDrivers, driverPercentages) {
        // Safety checks
        if (!archetype || !archetype.name) {
            return '<p>Error: Archetype data missing.</p>';
        }
        if (!pattern || !pattern.name) {
            return '<p>Error: Pattern data missing.</p>';
        }
        
        const complex = pattern.complex || {};
        
        // Ensure we have driver data - use parameters, window, or fallback
        let sortedDriversArray = sortedDrivers || [];
        let driverPercentagesObj = driverPercentages || {};
        if (sortedDriversArray.length === 0) {
            if (window.quizDriverPercentages) {
                driverPercentagesObj = window.quizDriverPercentages;
                sortedDriversArray = Object.entries(driverPercentagesObj)
                    .sort((a, b) => b[1] - a[1])
                    .map(([driver, percentage]) => [driver, percentage]);
            } else {
                // Fallback based on archetype
                const archetypeDriver = getDriverNameFromArchetype(archetype.name);
                sortedDriversArray = [[archetypeDriver, 40], ['control', 20], ['avoidance', 20], ['validation', 20]];
                driverPercentagesObj = { [archetypeDriver]: 40, control: 20, avoidance: 20, validation: 20 };
            }
        }
        
        const dominantDriver = sortedDriversArray.length > 0 ? sortedDriversArray[0][0] : getDriverNameFromArchetype(archetype.name);
        const jump = PATTERN_JUMPSTART[pattern.name] || PATTERN_JUMPSTART['The ' + (pattern.name || '')] || {};
        const identityToGiveUp = jump.identityToGiveUp || 'I am the type of person who keeps repeating this pattern.';
        const shadowParts = (pattern.shadow || 'Stuck → Same results').split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const patternTheme = PATTERN_COMPLEX_THEMES[pattern.name] || PATTERN_COMPLEX_THEMES['The ' + (pattern.name || '')] || 'repeat the pattern';
        const needTheme = PATTERN_NEED_THEMES[pattern.name] || PATTERN_NEED_THEMES['The ' + (pattern.name || '')] || 'protect yourself';
        
        // Get archetype explanation
        const archetypeExplanations = {
            'The Anchor': {
                meaning: 'You seek safety through control and stability. When you feel uncertain or unsafe, you take charge and create structure. This is your primary way of feeling secure.',
                whatItMeans: 'As The Anchor, you\'re driven by a need for control. You believe that managing situations, solving problems, and creating structure will keep you safe from chaos and uncertainty.'
            },
            'The Catalyst': {
                meaning: 'You seek safety through validation and achievement. When you feel uncertain or unsafe, you perform and earn approval. This is your primary way of feeling worthy.',
                whatItMeans: 'As The Catalyst, you\'re driven by a need for validation. You believe that achieving, performing, and earning approval will make you worthy and keep you safe from rejection.'
            },
            'The Wanderer': {
                meaning: 'You seek safety through avoidance and freedom. When you feel uncertain or unsafe, you stay mobile and avoid commitment. This is your primary way of feeling safe.',
                whatItMeans: 'As The Wanderer, you\'re driven by a need for freedom. You believe that staying mobile, avoiding difficult emotions, and keeping your options open will keep you safe from being trapped or overwhelmed.'
            },
            'The Guardian': {
                meaning: 'You seek safety through protection and distance. When you feel uncertain or unsafe, you keep boundaries and protect yourself. This is your primary way of feeling secure.',
                whatItMeans: 'As The Guardian, you\'re driven by a need for protection. You believe that keeping emotional distance, maintaining boundaries, and protecting yourself will keep you safe from rejection and abandonment.'
            }
        };
        
        const archetypeInfo = archetypeExplanations[archetype.name] || { meaning: '', whatItMeans: '' };
        
        // Get pattern explanation - detailed and unique
        const patternExplanations = {
            'Fixer': {
                quickDesc: 'You step in to solve problems and take charge, even when it\'s not yours to fix.',
                whatItIs: 'The Fixer pattern means you automatically step in to solve problems—even when they\'re not yours to fix. You take responsibility for others\' emotions and outcomes, believing that if you can fix things, you\'ll stay safe and in control.',
                howItsUnique: 'What makes your Fixer pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by taking charge—fixing problems, managing situations, and creating solutions. This pattern is powered by your Control driver, which makes you feel safe when you\'re in charge.',
                whatPowersIt: (driver) => `Your Fixer pattern is powered by your need for control (${driver} driver). When you feel stressed or uncertain, your Control driver activates, making you jump in to solve problems. This was a survival strategy that worked—it made you feel valuable and safe—but now it's limiting your ability to let others take responsibility.`,
                origin: 'This pattern likely developed in childhood when you learned that your worth came from being helpful. Maybe you had to take care of siblings, or a parent needed you, or you learned that helping others was the only way to feel loved and safe.',
                currentState: 'Right now, you\'re likely taking responsibility for things that aren\'t yours to fix—in relationships, work, and daily life. You feel exhausted from overfunctioning and constantly solving others\' problems.',
                dailyLifeExamples: [
                    'In relationships, you jump in with solutions when your partner shares a problem, instead of just listening.',
                    'At work, you immediately help coworkers with their problems, even when it\'s not your responsibility.',
                    'With finances, you offer to help others financially, even when you can\'t afford it.',
                    'In your health, you skip your own self-care to help others with their health problems.'
                ]
            },
            'Perfectionist': {
                quickDesc: 'You push for flawlessness and get stuck making things right before acting.',
                whatItIs: 'The Perfectionist pattern means you automatically try to make everything flawless before acting. You overthink decisions and avoid risks to ensure you do everything "right," believing that perfection will protect you from criticism and rejection.',
                howItsUnique: 'What makes your Perfectionist pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by analyzing, perfecting, and ensuring everything is flawless. This pattern is powered by your Control driver, which makes you feel safe when everything is "right."',
                whatPowersIt: (driver) => `Your Perfectionist pattern is powered by your need for control (${driver} driver). When you feel stressed or uncertain, your Control driver activates, making you strive for flawlessness. This was a survival strategy that worked—it protected you from criticism—but now it's causing you to miss opportunities and never feel good enough.`,
                origin: 'This pattern likely developed in childhood when you learned that mistakes led to criticism, rejection, or punishment. Maybe you had to be perfect to earn love, or you learned that "good enough" wasn\'t safe.',
                currentState: 'Right now, you\'re likely overthinking every decision, trying to make the "perfect" choice, and feeling paralyzed by analysis. You\'re exhausted from trying to be flawless and never feeling good enough.',
                dailyLifeExamples: [
                    'In relationships, you overthink every detail of dates and conversations, creating anxiety instead of connection.',
                    'At work, you spend hours perfecting projects that were already "good enough," causing burnout.',
                    'With finances, you overthink every financial decision, trying to make the "perfect" choice, and miss opportunities.',
                    'In your health, you create perfect workout and meal plans but burn out trying to follow them perfectly.'
                ]
            },
            'Pleaser': {
                quickDesc: 'You say yes and put others first, even when you\'re exhausted.',
                whatItIs: 'The Pleaser pattern means you automatically say yes and put others\' needs before your own—even when you\'re exhausted. You prioritize harmony over your own needs, believing that keeping others happy will keep you safe and loved.',
                howItsUnique: 'What makes your Pleaser pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by saying yes, avoiding conflict, and putting others first. This pattern is powered by your Validation driver, which makes you feel safe when others are happy with you.',
                whatPowersIt: (driver) => `Your Pleaser pattern is powered by your need for validation (${driver} driver). When you feel stressed or uncertain, your Validation driver activates, making you prioritize others' approval. This was a survival strategy that worked—it kept you safe from conflict—but now it's causing you to lose yourself and feel resentful.`,
                origin: 'This pattern likely developed in childhood when you learned that your needs didn\'t matter or that keeping others happy was the only way to feel safe. Maybe you had to manage a parent\'s emotions, or you learned that saying "no" led to rejection.',
                currentState: 'Right now, you\'re likely saying yes to things you don\'t want, putting others first, and losing yourself in relationships. You feel resentful but don\'t know how to stop without feeling guilty.',
                dailyLifeExamples: [
                    'In relationships, you say yes to things your partner wants, even when you don\'t want to do them.',
                    'At work, you say yes to every request, even when you\'re overwhelmed and exhausted.',
                    'With finances, you spend money on others to make them happy, even when it strains your budget.',
                    'In your health, you say yes to plans that exhaust you because you can\'t say no.'
                ]
            },
            'Performer': {
                quickDesc: 'You work to impress and achieve so you feel worthy and that you belong.',
                whatItIs: 'The Performer pattern means you automatically work harder to impress and earn approval. You achieve for others instead of yourself, believing that success and recognition will make you belong and feel worthy.',
                howItsUnique: 'What makes your Performer pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by achieving, performing, and seeking recognition. This pattern is powered by your Validation driver, which makes you feel safe when you\'re seen as successful.',
                whatPowersIt: (driver) => `Your Performer pattern is powered by your need for validation (${driver} driver). When you feel stressed or uncertain, your Validation driver activates, making you work harder to prove your worth. This was a survival strategy that worked—it earned you approval—but now it's causing you to burn out and feel empty.`,
                origin: 'This pattern likely developed in childhood when you learned that love and acceptance were conditional on achievement. Maybe you had to perform to earn attention, or you learned that being "good enough" required constant success.',
                currentState: 'Right now, you\'re likely working hard to impress and earn approval, achieving and succeeding, but feeling empty and exhausted from performing. You don\'t know how to work authentically without the need for recognition.',
                dailyLifeExamples: [
                    'In relationships, you dress perfectly and say the right things, but your partner never sees the real you.',
                    'At work, you work 60+ hours to prove your worth, but you\'re exhausted and empty.',
                    'With finances, you spend money to look successful—nice car, expensive clothes—to prove your worth.',
                    'In your health, you push yourself to extreme workouts to prove your discipline, leading to injury.'
                ]
            },
            'Escaper': {
                quickDesc: 'You stay busy and avoid difficult feelings so you don\'t have to face pain.',
                whatItIs: 'The Escaper pattern means you automatically stay busy and avoid difficult feelings. You numb emotions and avoid deep conversations, believing that not feeling will keep you safe from pain and overwhelm.',
                howItsUnique: 'What makes your Escaper pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by staying busy, avoiding feelings, and keeping your options open. This pattern is powered by your Avoidance driver, which makes you feel safe when you\'re free and disconnected.',
                whatPowersIt: (driver) => `Your Escaper pattern is powered by your need for avoidance (${driver} driver). When you feel stressed or uncertain, your Avoidance driver activates, making you escape through distraction and numbing. This was a survival strategy that worked—it protected you from overwhelming emotions—but now it's causing you to disconnect from yourself and others.`,
                origin: 'This pattern likely developed in childhood when you learned that difficult emotions were overwhelming, unsafe, or led to rejection. Maybe you had to stay "positive" or "strong," or you learned that feeling deeply was dangerous.',
                currentState: 'Right now, you\'re likely staying busy, avoiding difficult feelings, and pulling away when things get serious. You feel disconnected and alone, but you don\'t know how to stop escaping without feeling overwhelmed.',
                dailyLifeExamples: [
                    'In relationships, when your partner wants to have a difficult conversation, you suddenly "remember" something you need to do.',
                    'At work, when work gets stressful, you avoid difficult conversations and stay busy with easier tasks.',
                    'With finances, you avoid looking at your finances, hoping problems will resolve themselves.',
                    'In your health, you stay busy to avoid feeling difficult emotions, leading to stress and burnout.'
                ]
            },
            'Overthinker': {
                quickDesc: 'You analyze everything before acting and get stuck in your head.',
                whatItIs: 'The Overthinker pattern means you automatically analyze everything before acting—often getting stuck in your head. You believe thinking will keep you safe, but this causes you to miss opportunities while analyzing.',
                howItsUnique: 'What makes your Overthinker pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by analyzing, thinking through every possibility, and trying to understand everything before acting. This pattern is powered by your Avoidance driver, which makes you feel safe when you\'re in your head instead of your heart.',
                whatPowersIt: (driver) => `Your Overthinker pattern is powered by your need for avoidance (${driver} driver). When you feel stressed or uncertain, your Avoidance driver activates, making you think instead of feel. This was a survival strategy that worked—it protected you from making mistakes—but now it's causing you to feel paralyzed and miss opportunities.`,
                origin: 'This pattern likely developed in childhood when you learned that acting without thinking was dangerous. Maybe you had to analyze every situation to stay safe, or you learned that understanding was more valuable than feeling.',
                currentState: 'Right now, you\'re likely analyzing every situation, trying to figure out the "right" move, but getting stuck in your head and missing opportunities. You feel paralyzed by overthinking and don\'t know how to take action.',
                dailyLifeExamples: [
                    'In relationships, you analyze every text and interaction, trying to figure out what your partner "really" means.',
                    'At work, you analyze every decision endlessly, missing opportunities while thinking.',
                    'With finances, you research every investment endlessly but never actually invest.',
                    'In your health, you research every health trend but never commit to a routine.'
                ]
            },
            'Withdrawer': {
                quickDesc: 'You pull away and protect yourself when someone gets too close.',
                whatItIs: 'The Withdrawer pattern means you automatically pull away and protect yourself emotionally when someone gets too close. You keep emotional distance, believing that distance will keep you safe from rejection and hurt.',
                howItsUnique: 'What makes your Withdrawer pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Withdrawer pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding connection at work.',
                    'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
                    'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
                ]
            },
            'Overgiver': {
                quickDesc: 'You give more than you receive, hoping they\'ll see your worth and stay.',
                whatItIs: 'The Overgiver pattern means you automatically give more than you receive, hoping they\'ll see your worth and stay. You sacrifice your needs, believing that giving will prevent abandonment and make you valuable.',
                howItsUnique: 'What makes your Overgiver pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by giving, sacrificing, and hoping others will reciprocate. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re needed and valuable.',
                whatPowersIt: (driver) => `Your Overgiver pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you give more to prevent abandonment. This was a survival strategy that worked—it kept people close—but now it's causing you to neglect yourself and feel resentful.`,
                origin: 'This pattern likely developed in childhood when you learned that love was conditional on giving. Maybe you had to give to earn attention, or you learned that your needs didn\'t matter compared to others\'.',
                currentState: 'Right now, you\'re likely giving more than you receive, hoping they\'ll see your worth, but feeling resentful and drained. You don\'t know how to stop giving without feeling like you\'re being selfish.',
                dailyLifeExamples: [
                    'In relationships, you give your partner everything—time, energy, gifts—hoping they\'ll see your worth and stay.',
                    'At work, you take on extra work, stay late, do favors—hoping to earn recognition and job security.',
                    'With finances, you give money to others freely, even when you need it yourself.',
                    'In your health, you give your energy to everyone else, leaving nothing for your own health.'
                ]
            },
            'The Guarded One': {
                quickDesc: 'You pull away and protect yourself when someone gets too close.',
                whatItIs: 'The Guarded One pattern means you automatically pull away and protect yourself emotionally when someone gets too close. You keep emotional distance, believing that distance will keep you safe from rejection and hurt.',
                howItsUnique: 'What makes your Guarded One pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Guarded One pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding connection at work.',
                    'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
                    'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
                ]
            },
            'Guarded One': {
                quickDesc: 'You pull away and protect yourself when someone gets too close.',
                whatItIs: 'The Guarded One pattern means you automatically pull away and protect yourself emotionally when someone gets too close. You keep emotional distance, believing that distance will keep you safe from rejection and hurt.',
                howItsUnique: 'What makes your Guarded One pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Guarded One pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding connection at work.',
                    'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
                    'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
                ]
            }
        };
        
        const patternInfo = patternExplanations[pattern.name] || patternExplanations['The ' + pattern.name] || patternExplanations[pattern.name && pattern.name.replace(/^The\s+/, '')] || {
            quickDesc: 'Your default when you feel stressed or unsafe.',
            whatItIs: `Your ${pattern.name} pattern is your automatic response when you feel stressed or uncertain.`,
            howItsUnique: `What makes your ${pattern.name} pattern unique is how it shows up in your specific life areas based on your answers.`,
            whatPowersIt: (driver) => `Your ${pattern.name} pattern is powered by your emotional drivers, which activate when you feel stressed or uncertain.`,
            origin: `This pattern likely developed in childhood as a way to feel safe and loved.`,
            currentState: `Right now, this pattern is influencing how you show up in your daily life.`,
            dailyLifeExamples: [
                `Your ${pattern.name.toLowerCase()} pattern shows up in your relationships.`,
                `Your ${pattern.name.toLowerCase()} pattern shows up at work.`,
                `Your ${pattern.name.toLowerCase()} pattern shows up with your finances.`,
                `Your ${pattern.name.toLowerCase()} pattern shows up in your health.`
            ]
        };
        const patternQuickDesc = patternInfo.quickDesc || (patternInfo.whatItIs && (patternInfo.whatItIs.split('.')[0].trim() + '.')) || 'Your default when you feel stressed or unsafe.';
        const archetypeDriverPhrase = (ARCHETYPE_DRIVER_PHRASE && ARCHETYPE_DRIVER_PHRASE[archetype.name]) || 'emotional drive';
        
        // Get secondary complex explanation
        const secondaryComplexInfo = complex.secondary ? getSecondaryComplexExplanation(complex.primary, complex.secondary) : null;
        
        // Get percentage explanation
        const percentageExplanation = getPercentageExplanation(patternDominance, dominanceLabel);
        
        // Get "Why It Matters Now"
        const whyItMattersNow = getWhyItMattersNow(pattern, patternDominance, firstName);
        
        return `
            <div class="quick-summary-box" style="margin-top: 0; padding: 0;">
                <!-- Title: About Your Pattern -->
                <h3 class="about-pattern-title">About Your Pattern</h3>
                
                <!-- Detailed Pattern Explanation -->
                <div style="margin-bottom: 2rem;">
                    <p class="content-text" style="color: #000; margin: 0 0 1rem 0; font-weight: 400;">
                        ${firstName ? `${firstName}, ` : ''}${patternInfo.whatItIs}
                    </p>
                    <p class="content-text" style="margin: 0 0 1rem 0;">
                        ${patternInfo.howItsUnique}
                    </p>
                    
                    <!-- What Powers It -->
                    <p class="content-text" style="margin: 0 0 1.5rem 0;">
                        <strong style="color: #000;">What powers it:</strong> ${typeof patternInfo.whatPowersIt === 'function' ? patternInfo.whatPowersIt(dominantDriver) : patternInfo.whatPowersIt}
                    </p>
                    
                    <!-- Where you'll see it (pointer to How This Impacts Your Life) -->
                    <p class="content-text" style="color: #555; margin: 1rem 0 0 0;">
                        You'll see it in relationships, work, money, and health. Open <strong>How This Impacts Your Life</strong> below for details.
                    </p>
                    
                    <!-- How It Developed (comprehensive version) -->
                    ${pattern.complex ? (function() {
                        // Get driver data from parameters or window or create fallback
                        let sortedDriversArray = sortedDrivers || [];
                        let driverPercentagesObj = driverPercentages || {};
                        if (sortedDriversArray.length === 0) {
                            if (window.quizDriverPercentages) {
                                driverPercentagesObj = window.quizDriverPercentages;
                                sortedDriversArray = Object.entries(driverPercentagesObj)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([driver, percentage]) => [driver, percentage]);
                            } else {
                                // Fallback based on archetype
                                const archetypeDriver = getDriverNameFromArchetype(archetype.name);
                                sortedDriversArray = [[archetypeDriver, 40], ['control', 20], ['avoidance', 20], ['validation', 20]];
                                driverPercentagesObj = { [archetypeDriver]: 40, control: 20, avoidance: 20, validation: 20 };
                            }
                        }
                        
                        const comprehensiveDevelopment = buildComprehensiveHowItDeveloped(
                            pattern, 
                            pattern.complex, 
                            sortedDriversArray, 
                            driverPercentagesObj, 
                            answers, 
                            quizData || window.quizData || [], 
                            firstName, 
                            exactAge, 
                            patternDominance
                        );
                        
                        return `
                    <div style="margin-top: 1.5rem;">
                        <h4 class="how-developed-title">How It Developed</h4>
                        ${comprehensiveDevelopment}
                    </div>
                    `;
                    })() : ''}
                </div>
                
                <!-- Quick reference (What This Means) -->
                <div style="padding: 1.75rem; background: #ffffff; border-radius: 8px; border: 1px solid rgba(0, 0, 0, 0.1);">
                    <p class="quick-reference-label">Quick Reference</p>
                    <p class="content-text" style="color: #666; margin: 0 0 1.25rem 0;">Your <strong>archetype</strong> is how you seek safety; your <strong>pattern</strong> is what you <em>do</em> when that strategy gets <strong>activated</strong>.</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <!-- Your Archetype -->
                        <div>
                            <p class="quick-reference-item-title">
                                <span style="color: #ca0013;">Your Archetype:</span> ${archetype.name}
                            </p>
                            <p class="content-text" style="color: #555; margin: 0;">
                                ${archetypeInfo.meaning}
                            </p>
                        </div>
                        
                        <!-- Your Pattern -->
                        <div>
                            <p class="quick-reference-item-title">
                                <span style="color: #ca0013;">Your Pattern:</span> ${pattern.name}
                            </p>
                            <p class="content-text" style="color: #555; margin: 0;">
                                As ${archetype.name}, your pattern is ${pattern.name}—the specific way your ${archetypeDriverPhrase} shows up in behavior. ${patternQuickDesc}
                            </p>
                        </div>
                        
                        <!-- Why It Happens - Primary Complex -->
                        ${complex.primary && complex.definition ? `
                            <div>
                                <p class="quick-reference-item-title">
                                    <span style="color: #ca0013;">Why It Happens:</span> ${complex.primary}
                                </p>
                                <p class="content-text" style="color: #555; margin: 0;">
                                    ${complex.definition}
                                </p>
                                <p class="content-text" style="color: #555; margin: 0.5rem 0 0 0;">
                                    Your ${pattern.name} pattern is how this complex shows up in behavior: when you feel stressed or unsafe, it pushes you to ${patternTheme}.
                                </p>
                            </div>
                        ` : ''}
                        
                        <!-- The identity you're defending -->
                        <div>
                            <p class="quick-reference-item-title">
                                <span style="color: #ca0013;">The identity you're defending:</span>
                            </p>
                            <p class="content-text" style="color: #555; margin: 0;">
                                "${identityToGiveUp}"
                            </p>
                        </div>
                        
                        <!-- The good news (rewire) -->
                        <div>
                            <p class="quick-reference-item-title">
                                <span style="color: #ca0013;">The good news:</span>
                            </p>
                            <p class="content-text" style="color: #555; margin: 0;">
                                It runs on autopilot: when you feel unsafe, your brain and body default to ${shadowBehavior}. That pathway strengthened with repetition—and it can rewire with consistent new practice.
                            </p>
                        </div>
                        
                        <!-- Secondary Complex -->
                        ${complex.secondary && secondaryComplexInfo ? `
                            <div>
                                <p class="quick-reference-item-title">
                                    <span style="color: #ca0013;">You Also Have:</span> ${complex.secondary}
                                </p>
                                <p class="content-text" style="color: #555; margin: 0 0 0.5rem 0;">
                                    ${secondaryComplexInfo.definition}
                                </p>
                                <p class="content-text" style="color: #555; margin: 0; font-style: italic;">
                                    ${secondaryComplexInfo.howItWorksTogether}
                                </p>
                            </div>
                        ` : ''}
                        
                        <!-- How Everything Connects -->
                        <div>
                            <p style="font-size: 1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0;">
                                <span style="color: #ca0013;">How Everything Connects</span>
                            </p>
                            ${buildEnhancedPatternStrengthExplanation(pattern, patternDominance, dominanceLabel, complex, sortedDriversArray, driverPercentagesObj)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get "What This Means For You" - Personal, Clear, Value-Focused
    function getWhatThisMeansForYou(pattern, patternDominance, dominanceLabel, firstName) {
        const patternMeanings = {
            'Fixer': `When you feel stressed or uncertain, you automatically jump in to fix problems—even when they're not yours to fix. You take charge because it makes you feel safe, but this is costing you your peace and energy.`,
            'Perfectionist': `When you feel stressed or uncertain, you automatically try to make everything perfect. You believe doing it right will keep you safe, but this is causing you to never feel good enough and miss opportunities.`,
            'Pleaser': `When you feel stressed or uncertain, you automatically say yes and put others first—even when you're exhausted. You believe keeping others happy will keep you safe, but this is causing you to lose yourself and feel resentful.`,
            'Performer': `When you feel stressed or uncertain, you automatically work harder to impress and earn approval. You believe achievement will make you belong, but this is causing you to burn out and feel empty.`,
            'Escaper': `When you feel stressed or uncertain, you automatically stay busy and avoid difficult feelings. You believe not feeling will keep you safe, but this is causing you to disconnect from yourself and others.`,
            'Overthinker': `When you feel stressed or uncertain, you automatically analyze everything before acting—often getting stuck in your head. You believe thinking will keep you safe, but this is causing you to miss opportunities and feel paralyzed.`,
            'Withdrawer': `When you feel stressed or uncertain, you automatically pull away and protect yourself from getting hurt. You believe distance will keep you safe, but this is causing you to isolate and miss deep connections.`,
            'Overgiver': `When you feel stressed or uncertain, you automatically give more than you receive, hoping they'll see your worth. You believe giving will prevent abandonment, but this is causing you to neglect yourself and feel resentful.`
        };
        
        const meaning = patternMeanings[pattern.name] || `When you feel stressed or uncertain, you default to your ${pattern.name.toLowerCase()} pattern automatically.`;
        
        return `${firstName ? `${firstName}, ` : ''}${meaning} This pattern influences <strong>${patternDominance}% of your daily decisions</strong>—in your relationships, work, health, money, and every area of your life.`;
    }
    
    // Get driver name from archetype
    function getDriverNameFromArchetype(archetypeName) {
        const mapping = {
            'The Anchor': 'Control',
            'The Catalyst': 'Validation',
            'The Wanderer': 'Avoidance',
            'The Guardian': 'Fear of Rejection'
        };
        return mapping[archetypeName] || 'Your emotional driver';
    }
    
    // Get archetype symbol with fallback
    function getArchetypeSymbol(archetypeName) {
        const symbolMap = {
            'The Anchor': '⚓',
            'The Catalyst': '⚡',
            'The Wanderer': '🌊',
            'The Guardian': '🛡️'
        };
        return symbolMap[archetypeName] || '⚓';
    }
    
    // Get percentage explanation - interpretation only (percentage stated in wrapper)
    function getPercentageExplanation(patternDominance, dominanceLabel) {
        if (patternDominance >= 70) {
            return `This is your <strong>dominant pattern</strong>. When you face stress, uncertainty, or difficult emotions, you default to it ${patternDominance >= 75 ? 'almost always' : 'most of the time'}—it's deeply ingrained and automatic.`;
        } else if (patternDominance >= 50) {
            return `This is your <strong>dominant pattern</strong>. While it's your primary response, you also have other patterns competing for control. You have more flexibility, but this pattern still drives most of your automatic responses.`;
        } else if (patternDominance >= 40) {
            return `This is your <strong>dominant pattern</strong>. You have multiple patterns operating at similar levels, so you might feel pulled in different directions. It's still your primary default, but it competes with other responses.`;
        } else {
            return `You have multiple patterns operating at similar levels, so your responses can vary. While this is your dominant pattern, it's not as automatic as it could be—giving you more opportunity for change.`;
        }
    }
    
    // Build enhanced pattern strength explanation - clear, simple, user-friendly
    // Focus: What the percentage means and how everything connects
    function buildEnhancedPatternStrengthExplanation(pattern, patternDominance, dominanceLabel, complex, sortedDrivers, driverPercentages) {
        if (!pattern || !complex) {
            return '<p style="font-size: 0.95rem; color: #555; margin: 0; line-height: 1.6;">This is your dominant pattern.</p>';
        }

        const otherPatternsPercent = 100 - patternDominance;
        const dominantDriver = sortedDrivers && sortedDrivers.length > 0 ? sortedDrivers[0][0] : 'control';
        const dominantPercent = driverPercentages && driverPercentages[dominantDriver] ? driverPercentages[dominantDriver] : 0;
        const secondaryDriver = sortedDrivers && sortedDrivers.length > 1 ? sortedDrivers[1][0] : null;
        const secondaryPercent = secondaryDriver && driverPercentages && driverPercentages[secondaryDriver] ? driverPercentages[secondaryDriver] : 0;

        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };

        // Build driver list text
        let driverListText = `${driverNames[dominantDriver]} ${dominantPercent}%`;
        if (secondaryDriver && secondaryPercent >= 15) {
            driverListText += `, ${driverNames[secondaryDriver]} ${secondaryPercent}%`;
        }

        let explanation = '';

        // Opening: What the percentage means
        if (patternDominance >= 70) {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 1rem 0; line-height: 1.6;">This pattern influences <strong>${patternDominance}% of your daily decisions</strong>—it's deeply wired and runs almost automatically. The remaining ${otherPatternsPercent}% represents other patterns that occasionally surface, but this one is your brain's default response.</p>`;
        } else if (patternDominance >= 50) {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 1rem 0; line-height: 1.6;">This pattern influences <strong>${patternDominance}% of your daily decisions</strong>. The other ${otherPatternsPercent}% represents competing patterns that create internal conflict—this is why you might feel pulled in different directions or uncertain about what you actually want.</p>`;
        } else {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 1rem 0; line-height: 1.6;">This pattern influences <strong>${patternDominance}% of your daily decisions</strong>. You have multiple patterns operating at similar levels (other patterns make up ${otherPatternsPercent}%), which explains why change can feel confusing—you're not just breaking one pattern, but navigating competing responses.</p>`;
        }

        // How everything connects - clear, simple explanation (no repetitive heading)
        explanation += `<div style="margin: 1rem 0; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; border-left: 3px solid #ca0013;">`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Emotional Drivers</strong> (${driverListText}) are what you learned to do to feel safe. They're your survival strategies.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Complexes</strong> (${complex.primary || 'complex'}${complex.secondary ? ' + ' + complex.secondary : ''}) are the beliefs that developed from those strategies. They're like the "rules" your brain follows.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Pattern</strong> (${pattern.name}) is what you actually do—the behavior that shows up when you're triggered.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0; line-height: 1.6;"><strong>Your Archetype</strong> is your style—how all of this shows up in your life.</p>`;
        explanation += `</div>`;

        // Simple flow explanation
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 1rem 0 0.75rem 0; line-height: 1.6;">Your drivers created your complexes, which created your pattern. It's all connected—one thing led to another.</p>`;

        // Why percentages differ
        explanation += `<div style="margin: 1rem 0; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px;">`;
        explanation += `<p style="font-size: 0.95rem; color: #333; margin: 0 0 0.5rem 0; line-height: 1.6; font-weight: 600;">Why percentages differ:</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;">• <strong>Pattern ${patternDominance}%</strong> = How often you do ${pattern.name} behavior</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0; line-height: 1.6;">• <strong>${driverListText}</strong> = How much each survival strategy contributes overall</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0.5rem 0 0 0; line-height: 1.6; font-style: italic;">They're different because your drivers create multiple patterns, but ${pattern.name} shows up most (${patternDominance}%).</p>`;
        explanation += `</div>`;

        // Why two complexes (if applicable)
        if (complex.secondary) {
            explanation += `<div style="margin: 1rem 0; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px;">`;
            explanation += `<p style="font-size: 0.95rem; color: #333; margin: 0 0 0.5rem 0; line-height: 1.6; font-weight: 600;">Why two complexes:</p>`;
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0; line-height: 1.6;">${complex.primary} (main one) drives your pattern. ${complex.secondary} (secondary) adds another layer, making it stronger.</p>`;
            explanation += `</div>`;
        }

        // What this means for change
        if (patternDominance >= 70) {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 1rem 0 0; line-height: 1.6;"><strong>What this means for change:</strong> Because this pattern is so dominant, breaking it will have the biggest impact on your life. It's also the most automatic, so change requires consistent awareness and intentional interruption—but the payoff is transformative.</p>`;
        } else if (patternDominance >= 50) {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 1rem 0 0; line-height: 1.6;"><strong>What this means for change:</strong> While this is your dominant pattern, the ${otherPatternsPercent}% of competing patterns create internal conflict that makes change harder. You'll need to not only interrupt this pattern but also clarify which competing response you're moving toward.</p>`;
        } else {
            explanation += `<p style="font-size: 0.95rem; color: #555; margin: 1rem 0 0; line-height: 1.6;"><strong>What this means for change:</strong> With multiple patterns at similar levels, you have more flexibility—but also more confusion. The key is choosing one pattern to focus on breaking first, then the others will become clearer. Start here.</p>`;
        }

        return explanation;
    }
    
    // Quick Takeaway Box - Simplified (removed duplicate text, kept only essential)
    function getQuickTakeawayBox(pattern, patternDominance, dominanceLabel, firstName) {
        return `
            <div class="quick-takeaway-box" style="margin-top: 1.5rem; padding: 1.25rem 0; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <p style="font-size: 1.1rem; line-height: 1.7; color: #000; margin: 0;">
                    When you feel stressed or uncertain, you default to your <strong>${pattern.name}</strong> pattern automatically.
                </p>
            </div>
        `;
    }
    
    // Comprehensive Hero Content - Strengths, Triggers, Consequences, Impact, Drivers
    function getComprehensiveHeroContent(archetype, pattern, patternDominance, dominanceLabel, answers, sortedDrivers, driverPercentages, firstName, exactAge, relationshipStatus, quizData) {
        const dominantDriver = sortedDrivers[0][0];
        const dominantPercent = driverPercentages[dominantDriver];
        const complex = pattern.complex || {};
        
        return `
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <!-- Strengths, Triggers, Consequences -->
                ${getStrengthsTriggersConsequences(pattern, archetype, complex)}
                
                <!-- How It Impacts Your Life -->
                ${getHowItImpactsYourLife(pattern, archetype, complex, patternDominance, firstName, sortedDrivers, driverPercentages, exactAge, relationshipStatus)}
                
                <!-- Emotional Drivers Visual - Clickable with Details -->
                ${getSimplifiedDriversVisual(sortedDrivers, driverPercentages, dominantDriver, dominantPercent, firstName)}
            </div>
        `;
    }
    
    // Get Strengths, Triggers, and Consequences
    function getStrengthsTriggersConsequences(pattern, archetype, complex) {
        // Merge consequences and commonProblems, then select top 3 most powerful
        const allCostsData = {
            'Fixer': {
                strengths: [
                    'You\'re incredibly responsible and capable—people trust you to get things done',
                    'You have strong problem-solving skills and can see solutions others miss',
                    'You\'re reliable and dependable—people know they can count on you'
                ],
                triggers: [
                    'When someone you care about is struggling or in crisis',
                    'When situations feel chaotic or out of control',
                    'When you see problems that need solving, even if they\'re not yours'
                ],
                allCosts: [
                    'You burn out from overfunctioning and taking on others\' responsibilities',
                    'You lose your peace and energy, constantly feeling responsible for outcomes',
                    'You prevent others from learning and growing by solving their problems for them',
                    'You feel exhausted from constantly solving others\' problems',
                    'Your relationships become one-sided—you give more than you receive',
                    'You struggle to relax or rest because there\'s always something to fix',
                    'People become dependent on you instead of learning to solve their own problems'
                ],
                top3Costs: [
                    'You burn out from constantly solving others\' problems and taking on responsibilities that aren\'t yours',
                    'Your relationships become one-sided—you give more than you receive, leading to resentment',
                    'You lose yourself in others\' problems, never having time for your own goals or peace'
                ]
            },
            'Perfectionist': {
                strengths: [
                    'You\'re disciplined and driven—you produce high-quality work',
                    'You have strong attention to detail and can catch mistakes others miss',
                    'You\'re committed to excellence and continuous improvement'
                ],
                triggers: [
                    'When you need to make an important decision or complete a task',
                    'When you receive feedback or criticism, even if it\'s constructive',
                    'When you see something that isn\'t "perfect" or "right"'
                ],
                allCosts: [
                    'You miss opportunities because you\'re waiting for perfect conditions',
                    'You experience chronic stress and anxiety from never feeling good enough',
                    'You waste time overthinking and perfecting instead of taking action',
                    'You procrastinate on important tasks because they\'re not "perfect" yet',
                    'You struggle to accept feedback or criticism without feeling defensive'
                ],
                top3Costs: [
                    'You miss opportunities waiting for perfect conditions instead of taking action',
                    'You experience chronic stress and anxiety from never feeling good enough',
                    'You struggle to accept feedback or criticism without feeling defensive, limiting your growth'
                ]
            },
            'Pleaser': {
                strengths: [
                    'You\'re empathetic and kind—people feel heard and understood around you',
                    'You\'re great at maintaining harmony and avoiding conflict',
                    'You\'re considerate and thoughtful—you genuinely care about others\' wellbeing'
                ],
                triggers: [
                    'When someone asks you for something, even if you don\'t want to do it',
                    'When you sense conflict or tension in relationships',
                    'When you feel like saying "no" might disappoint or upset someone'
                ],
                allCosts: [
                    'You lose your identity and boundaries, constantly adapting to others\' needs',
                    'You build resentment from saying yes when you mean no',
                    'You neglect your own needs and priorities, leading to exhaustion and burnout',
                    'People don\'t know the real you because you\'re always trying to be what they want'
                ],
                top3Costs: [
                    'You lose your identity and boundaries, constantly adapting to what others want',
                    'You build resentment from saying yes when you mean no, leading to exhaustion',
                    'People don\'t know the real you, creating surface-level relationships where you never feel truly seen'
                ]
            },
            'Performer': {
                strengths: [
                    'You\'re ambitious and achievement-oriented—you set high goals and reach them',
                    'You\'re hardworking and dedicated—you don\'t give up easily',
                    'You\'re capable of producing impressive results and earning recognition'
                ],
                triggers: [
                    'When you feel like you need to prove your worth or value',
                    'When you see others achieving or being recognized',
                    'When you fear being seen as lazy, unproductive, or not enough'
                ],
                allCosts: [
                    'You burn out from constantly performing and never feeling like you can rest',
                    'You lose your authenticity, performing for others instead of being yourself',
                    'You feel empty even after achieving goals, because your worth is tied to external validation',
                    'You struggle to enjoy success because you\'re always focused on the next achievement'
                ],
                top3Costs: [
                    'You burn out from constantly performing and never feeling like you can rest',
                    'You lose your authenticity, performing for others instead of being yourself',
                    'You feel empty even after achieving goals because your worth is tied to external validation'
                ]
            },
            'Escaper': {
                strengths: [
                    'You\'re free-spirited and creative—you think outside the box',
                    'You\'re adaptable and flexible—you can pivot when needed',
                    'You\'re independent and self-sufficient—you don\'t need others to feel complete'
                ],
                triggers: [
                    'When difficult emotions start to surface or feel overwhelming',
                    'When situations feel too intense, committed, or constraining',
                    'When conflicts arise or conversations get too deep'
                ],
                allCosts: [
                    'You disconnect from yourself and others, missing deep emotional intimacy',
                    'You avoid processing difficult feelings, which leads to emotional numbness',
                    'You miss opportunities for growth and connection by staying on the surface',
                    'You struggle with commitment and depth in relationships'
                ],
                top3Costs: [
                    'You disconnect from yourself and others, missing deep emotional intimacy',
                    'You avoid processing difficult feelings, leading to emotional numbness and staying stuck',
                    'You struggle with commitment and depth, missing opportunities for growth and staying on the surface'
                ]
            },
            'Overthinker': {
                strengths: [
                    'You\'re insightful and intelligent—you see connections others miss',
                    'You\'re thorough and analytical—you consider multiple perspectives',
                    'You\'re thoughtful and deliberate—you make informed decisions'
                ],
                triggers: [
                    'When you need to make an important decision or take action',
                    'When you face uncertainty or don\'t have all the information',
                    'When you feel pressure to choose or commit to something'
                ],
                allCosts: [
                    'You get paralyzed by analysis, missing opportunities while thinking',
                    'You experience anxiety and overwhelm from endless thinking loops',
                    'You avoid taking action, using thinking as a way to escape feeling or doing',
                    'You struggle to make decisions confidently, always second-guessing yourself'
                ],
                top3Costs: [
                    'You get paralyzed by analysis, missing opportunities while thinking instead of taking action',
                    'You experience chronic anxiety and overwhelm from endless thinking loops that never lead to decisions',
                    'You struggle to make decisions confidently, always second-guessing yourself'
                ]
            },
            'Withdrawer': {
                strengths: [
                    'You\'re independent and self-reliant—you can handle things on your own',
                    'You\'re protective of your energy and boundaries—you know your limits',
                    'You\'re emotionally stable—you don\'t get easily overwhelmed by others\' emotions'
                ],
                triggers: [
                    'When someone gets too close or wants deeper intimacy',
                    'When you feel vulnerable or exposed in relationships',
                    'When you sense rejection, criticism, or potential abandonment'
                ],
                allCosts: [
                    'You isolate yourself, missing opportunities for deep connection and intimacy',
                    'You push people away, creating the very abandonment you fear',
                    'You struggle with vulnerability, preventing authentic relationships from forming',
                    'You feel lonely even when you want connection'
                ],
                top3Costs: [
                    'You isolate yourself and push people away, creating the very abandonment you fear',
                    'You struggle with vulnerability, preventing authentic relationships from forming',
                    'You miss opportunities for deep connection and intimacy because you keep people at a distance'
                ]
            },
            'Overgiver': {
                strengths: [
                    'You\'re generous and giving—people feel cared for around you',
                    'You\'re loyal and committed—you show up for people consistently',
                    'You\'re nurturing and supportive—you help others feel valued'
                ],
                triggers: [
                    'When you feel like someone might leave or abandon you',
                    'When you sense distance or disconnection in relationships',
                    'When you feel insecure about your worth or value'
                ],
                allCosts: [
                    'You neglect your own needs, leading to exhaustion and resentment',
                    'You attract people who take advantage of your generosity',
                    'You give from fear instead of love, creating codependent relationships',
                    'You feel unappreciated and taken for granted'
                ],
                top3Costs: [
                    'You neglect your own needs, leading to exhaustion, resentment, and feeling unappreciated',
                    'You attract people who take advantage of your generosity, creating codependent relationships',
                    'You give from fear instead of love, preventing genuine, balanced connections'
                ]
            }
        };
        
        const patternData = allCostsData[pattern.name] || {
            strengths: ['You have unique strengths that serve you well'],
            triggers: ['Stress and uncertainty activate your pattern'],
            top3Costs: ['This pattern limits your growth and connection']
        };
        
        return `
            <div style="margin-bottom: 2.5rem;">
                <!-- Strengths -->
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Strengths</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${patternData.strengths.map(strength => `
                            <div style="padding: 0.875rem 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #4caf50;">
                                <p style="font-size: 0.95rem; line-height: 1.6; color: #333; margin: 0;">${strength}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Triggers -->
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What Triggers Your Pattern</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${patternData.triggers.map(trigger => `
                            <div style="padding: 0.875rem 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #ffc107;">
                                <p style="font-size: 0.95rem; line-height: 1.6; color: #333; margin: 0;">${trigger}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- What This Costs You - Merged with Most Common Problems (Top 3) -->
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What This Costs You</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        ${patternData.top3Costs.map(cost => `
                            <div style="padding: 0.875rem 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #ca0013;">
                                <p style="font-size: 0.95rem; line-height: 1.6; color: #333; margin: 0;">${cost}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get How It Impacts Your Life
    function getHowItImpactsYourLife(pattern, archetype, complex, patternDominance, firstName, sortedDrivers, driverPercentages, exactAge, relationshipStatus) {
        // Get dominant driver info
        const dominantDriver = sortedDrivers && sortedDrivers[0] ? sortedDrivers[0][0] : 'control';
        const dominantPercent = driverPercentages && driverPercentages[dominantDriver] ? driverPercentages[dominantDriver] : 30;
        
        // Life areas with icons and detailed impact
        const lifeAreas = [
            {
                id: 'love',
                icon: '💕',
                title: 'Love & Relationships',
                getImpact: () => getLifeAreaImpact('love', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'money',
                icon: '💰',
                title: 'Money & Finances',
                getImpact: () => getLifeAreaImpact('money', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'health',
                icon: '🏃',
                title: 'Health & Habits',
                getImpact: () => getLifeAreaImpact('health', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'career',
                icon: '💼',
                title: 'Career & Work',
                getImpact: () => getLifeAreaImpact('career', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'identity',
                icon: '🎭',
                title: 'Identity & Self-Worth',
                getImpact: () => getLifeAreaImpact('identity', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'purpose',
                icon: '🎯',
                title: 'Purpose & Goals',
                getImpact: () => getLifeAreaImpact('purpose', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'lifestyle',
                icon: '🌱',
                title: 'Lifestyle & Daily Habits',
                getImpact: () => getLifeAreaImpact('lifestyle', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            },
            {
                id: 'productivity',
                icon: '⏰',
                title: 'Productivity & Time',
                getImpact: () => getLifeAreaImpact('productivity', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus)
            }
        ];
        
        // Generate accordion items matching emotional drivers style
        const accordionItems = lifeAreas.map((area, idx) => {
            const areaId = `life-area-${area.id}`;
            const isExpanded = false; // All start collapsed
            const expandedClass = isExpanded ? 'expanded' : '';
            const iconRotation = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
            
            return `
                <div class="life-area-accordion-item ${expandedClass}" data-area="${area.id}" style="margin-bottom: 1.25rem; background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 6px; overflow: hidden;">
                    <button onclick="toggleLifeArea('${area.id}')" style="width: 100%; padding: 1rem 1.25rem; background: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; text-align: left; transition: background 0.2s ease;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                            <span class="life-area-icon-arrow" style="transform: ${iconRotation}; width: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: #666; font-size: 0.75rem; transition: transform 0.3s ease;">▶</span>
                            <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                <span style="font-size: 1.2rem; line-height: 1;">${area.icon}</span>
                                <span style="font-size: 1rem; font-weight: 600; color: #000;">
                                    ${area.title}
                                </span>
                            </div>
                        </div>
                    </button>
                    <div class="life-area-accordion-content ${expandedClass}" id="life-area-content-${area.id}" style="max-height: ${isExpanded ? '5000px' : '0'}; overflow: hidden; transition: max-height 0.4s ease, padding-top 0.4s ease, padding-bottom 0.4s ease; padding: ${isExpanded ? '0 1.25rem 1.25rem 1.25rem' : '0 1.25rem'};">
                        ${area.getImpact()}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div style="margin-bottom: 2.5rem;">
                <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">How This Impacts Your Life</h3>
                <p style="font-size: 0.95rem; line-height: 1.7; color: #555; margin: 0 0 1.5rem 0;">
                    ${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern influences every area of your life. Click each area below to see how it impacts you:
                </p>
                
                <div class="life-areas-accordion-list">
                    ${accordionItems}
                </div>
            </div>
        `;
    }
    
    // Helper function to generate condensed impact format
    function generateCondensedImpact(summary, challenge, benefit) {
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${summary}</p>
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${challenge}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate detailed impact for each life area
    function getLifeAreaImpact(area, pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus) {
        const impactData = {
            love: getLoveImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus),
            money: getMoneyImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            health: getHealthImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            career: getCareerImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            identity: getIdentityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            purpose: getPurposeImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            lifestyle: getLifestyleImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge),
            productivity: getProductivityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge)
        };
        
        return impactData[area] || '<p>Impact data not available for this area.</p>';
    }
    
    // Condensed impact functions - Unified summaries with challenges and benefits
    function getLoveImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus) {
        const impactSummaries = {
            'Fixer': {
                summary: relationshipStatus === 'single' 
                    ? 'Your ${pattern.name} pattern makes you jump in to "fix" dates who seem lost, believing solving their problems will make them stay. But they pull away when they feel controlled, leaving you confused about why relationships don\'t work.'
                    : 'Your ${pattern.name} pattern makes you immediately solve your partner\'s problems—even when they need to handle it themselves. This creates resentment: you feel unappreciated, they feel controlled.',
                challenge: 'You struggle to let others take responsibility, which prevents them from growing and creates one-sided relationships.',
                benefit: 'When you break this pattern, you\'ll experience balanced relationships where both partners can be vulnerable and support each other without one person overfunctioning.'
            },
            'Perfectionist': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you analyze every potential partner for flaws, waiting for the "perfect" match. You overthink every text, every date—but end up alone because no one meets your impossible standards.'
                    : 'Your ${pattern.name} pattern makes you overthink every decision together, trying to make the "right" choice. This leads to paralysis and missed opportunities. Your partner feels they can\'t measure up.',
                challenge: 'Your perfectionism prevents you from taking risks in love, causing you to miss real connections while waiting for the impossible.',
                benefit: 'When you break this pattern, you\'ll be able to connect authentically, accept imperfection, and build relationships based on real connection, not impossible standards.'
            },
            'Pleaser': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you say yes to dates you\'re not interested in, losing yourself trying to be what they want. They leave when they realize it\'s not the real you.'
                    : 'Your ${pattern.name} pattern makes you say yes to everything your partner wants, even when exhausted. This leads to resentment and losing yourself in the relationship. You don\'t know who you are outside of pleasing them.',
                challenge: 'You lose your identity in relationships, constantly adapting to what others want, which prevents authentic connection.',
                benefit: 'When you break this pattern, you\'ll show up as your true self, attract people who love the real you, and build relationships based on mutual respect and authenticity.'
            },
            'Performer': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you work hard to impress dates—achieving, succeeding, showing your best self. But they leave when they see the real you, exhausted from performing.'
                    : 'Your ${pattern.name} pattern makes you work hard to be the "perfect" partner, achieving to earn approval. But you\'re exhausted and they don\'t see the real you. You\'re performing, not connecting.',
                challenge: 'You\'re so focused on impressing that you never show your authentic self, preventing deep intimacy and connection.',
                benefit: 'When you break this pattern, you\'ll connect from a place of authenticity, allowing others to see and love the real you beyond achievements.'
            },
            'Escaper': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you stay busy, avoid deep conversations, and pull away when things get serious. You want connection but can\'t let yourself have it because intimacy feels threatening.'
                    : 'Your ${pattern.name} pattern makes you avoid conflict—staying busy, numbing feelings, or withdrawing. This creates distance and unresolved issues. Your partner feels you\'re not present.',
                challenge: 'You avoid emotional intimacy to protect yourself, but this creates the loneliness and disconnection you\'re trying to escape.',
                benefit: 'When you break this pattern, you\'ll be able to stay present through difficult emotions, build deep connections, and experience the intimacy you actually crave.'
            },
            'Overthinker': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you analyze every text, every date, trying to figure out if they\'re "the one" before you even know them. You get stuck in analysis paralysis, missing opportunities while thinking.'
                    : 'Your ${pattern.name} pattern makes you analyze every interaction, trying to figure out what they "really" mean. This creates anxiety and distance. You\'re in your head instead of your heart.',
                challenge: 'You overthink relationships instead of experiencing them, using analysis as a way to avoid vulnerability and real connection.',
                benefit: 'When you break this pattern, you\'ll trust your instincts, be present in relationships, and connect from your heart instead of your head.'
            },
            'Withdrawer': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you push people away when they get too close, protecting yourself from rejection but creating the loneliness you fear.'
                    : 'Your ${pattern.name} pattern makes you pull away when your partner gets too close or vulnerable, creating the distance you fear. They feel rejected, you feel misunderstood.',
                challenge: 'You protect yourself through distance, but this creates the very abandonment and isolation you\'re trying to avoid.',
                benefit: 'When you break this pattern, you\'ll be able to open up safely, practice vulnerability, and build the deep connections you actually want.'
            },
            'Overgiver': {
                summary: relationshipStatus === 'single'
                    ? 'Your ${pattern.name} pattern makes you give everything—time, energy, attention—hoping they\'ll see your worth. But they take and leave when you need something, leaving you resentful and alone.'
                    : 'Your ${pattern.name} pattern makes you give more than you receive, hoping they\'ll reciprocate. But you end up resentful and they feel smothered. You don\'t know how to receive love.',
                challenge: 'You give from fear instead of love, creating codependent relationships where you neglect your own needs and attract people who take advantage.',
                benefit: 'When you break this pattern, you\'ll experience balanced relationships where giving and receiving flow naturally, and you feel valued for who you are, not what you give.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        const summary = data.summary.replace('${pattern.name}', pattern.name);
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${summary}</p>
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${data.challenge}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getMoneyImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ${pattern.name} pattern makes you feel safe only when fully in control of finances. When money problems hit, you go into "fix mode"—creating plans, tightening systems. But this constant control creates stress and prevents you from trusting the process.',
                challenge: 'You overfunction with money, trying to control everything, which creates anxiety and prevents you from building sustainable financial habits.',
                benefit: 'When you break this pattern, you\'ll create healthy financial systems without constant control, allowing money to flow while maintaining security.'
            },
            'Perfectionist': {
                summary: 'Your ${pattern.name} pattern makes you overthink every financial decision, trying to make the "perfect" choice. You analyze investments and budgets endlessly—but this paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'Your perfectionism prevents you from taking calculated financial risks, causing you to miss growth opportunities while waiting for perfect conditions.',
                benefit: 'When you break this pattern, you\'ll make confident financial decisions, take calculated risks, and build wealth without waiting for perfection.'
            },
            'Pleaser': {
                summary: 'Your ${pattern.name} pattern makes you spend money to please others—buying gifts, saying yes to expensive plans, trying to show you care through spending. But this leaves you financially drained and resentful when others don\'t reciprocate.',
                challenge: 'You spend money to earn approval, which drains your finances and prevents you from building wealth or prioritizing your own financial goals.',
                benefit: 'When you break this pattern, you\'ll spend money aligned with your values, set financial boundaries, and build wealth while still being generous from a place of abundance.'
            },
            'Performer': {
                summary: 'Your ${pattern.name} pattern makes you spend money to impress—buying status symbols, expensive experiences, trying to show your worth through what you own. But this creates financial stress and prevents you from building real wealth.',
                challenge: 'You spend to prove your worth, which creates financial stress and prevents you from building sustainable wealth or financial security.',
                benefit: 'When you break this pattern, you\'ll spend money aligned with your authentic values, build real wealth, and feel valuable without needing to prove it through spending.'
            },
            'Escaper': {
                summary: 'Your ${pattern.name} pattern makes you avoid dealing with money—ignoring bills, avoiding budgets, staying busy so you don\'t have to think about finances. But this creates financial chaos and prevents you from building security.',
                challenge: 'You avoid financial responsibility, which creates chaos, debt, and prevents you from building the financial security you actually want.',
                benefit: 'When you break this pattern, you\'ll face your finances with clarity, create sustainable budgets, and build the financial security that gives you real freedom.'
            },
            'Overthinker': {
                summary: 'Your ${pattern.name} pattern makes you analyze every financial decision endlessly, trying to figure out the "right" move. You research and compare—but this paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'You overthink money decisions, using analysis as a way to avoid taking action, which causes you to miss opportunities and stay financially stagnant.',
                benefit: 'When you break this pattern, you\'ll make confident financial decisions, take action despite uncertainty, and build wealth through consistent choices.'
            },
            'Withdrawer': {
                summary: 'Your ${pattern.name} pattern makes you protect yourself financially by hoarding, avoiding risks, and keeping everything separate. But this prevents you from building wealth and creating financial partnerships.',
                challenge: 'You protect yourself through financial isolation, which prevents you from taking calculated risks, building wealth, or creating financial partnerships.',
                benefit: 'When you break this pattern, you\'ll take calculated financial risks, build wealth through smart investments, and create financial partnerships that support your goals.'
            },
            'Overgiver': {
                summary: 'Your ${pattern.name} pattern makes you give money away—loaning to friends, paying for others, trying to show your worth through generosity. But this leaves you financially drained and resentful when others don\'t reciprocate.',
                challenge: 'You give money from fear instead of abundance, which drains your finances and prevents you from building wealth or financial security.',
                benefit: 'When you break this pattern, you\'ll give from a place of abundance, set financial boundaries, and build wealth while still being generous when it truly serves.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        const summary = data.summary.replace('${pattern.name}', pattern.name);
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${summary}</p>
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${data.challenge}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getHealthImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your Fixer pattern makes you create clear plans and structure your day when overwhelmed, but you struggle to rest because you feel responsible for everything. Your biggest health challenge is overfunctioning leading to burnout and exhaustion.',
                challenge: 'You can\'t rest because you feel responsible for everything, which leads to chronic burnout and prevents you from building sustainable health habits.',
                benefit: 'When you break this pattern, you\'ll create healthy routines that include rest, prioritize your own wellbeing, and build sustainable habits without constant overfunctioning.'
            },
            'Perfectionist': {
                summary: 'Your Perfectionist pattern makes you create perfect health routines but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely. This all-or-nothing approach prevents consistent habits.',
                challenge: 'Your perfectionism creates rigid routines you can\'t maintain, leading to cycles of starting and stopping that prevent consistent health habits.',
                benefit: 'When you break this pattern, you\'ll create flexible, sustainable health routines, accept "good enough," and build consistent habits without all-or-nothing thinking.'
            },
            'Pleaser': {
                summary: 'Your Pleaser pattern makes you prioritize others\' health needs over your own, saying yes to plans that exhaust you. This leads to burnout, stress, and neglecting your own wellbeing.',
                challenge: 'You put everyone else\'s health needs first, which leads to burnout, stress, and prevents you from prioritizing your own wellbeing.',
                benefit: 'When you break this pattern, you\'ll prioritize your own health needs, set boundaries around your energy, and build sustainable wellness habits that support you.'
            },
            'Performer': {
                summary: 'Your Performer pattern makes you work out and eat well to look good and impress others, but you\'re exhausted from performing. Your health becomes about appearance, not wellbeing.',
                challenge: 'You focus on health for appearance and performance, which exhausts you and prevents you from building sustainable wellness habits based on actual wellbeing.',
                benefit: 'When you break this pattern, you\'ll focus on health for wellbeing, not appearance, build sustainable habits, and rest without guilt.'
            },
            'Escaper': {
                summary: 'Your Escaper pattern makes you avoid dealing with health issues—staying busy, numbing feelings, avoiding doctors. You use distraction to avoid discomfort, but this prevents you from addressing real concerns.',
                challenge: 'You avoid health issues to escape discomfort, which prevents you from addressing real concerns and building proactive wellness habits.',
                benefit: 'When you break this pattern, you\'ll face health issues with clarity, build proactive wellness habits, and address concerns before they become problems.'
            },
            'Overthinker': {
                summary: 'Your Overthinker pattern makes you analyze every health decision endlessly—researching diets, workouts, supplements—but this paralysis prevents you from taking action. You think about health more than you practice it.',
                challenge: 'You overthink health decisions, using analysis as a way to avoid taking action, which prevents you from building consistent wellness habits.',
                benefit: 'When you break this pattern, you\'ll make confident health decisions, take action despite uncertainty, and build consistent habits through practice, not perfection.'
            },
            'Withdrawer': {
                summary: 'Your Withdrawer pattern makes you protect yourself by keeping distance from health support—avoiding doctors, therapists, or wellness communities. But this isolation prevents you from getting the help you need.',
                challenge: 'You isolate from health support to protect yourself, which prevents you from getting the help you need and building wellness habits with support.',
                benefit: 'When you break this pattern, you\'ll seek health support safely, build wellness habits with community, and get the help you need without isolation.'
            },
            'Overgiver': {
                summary: 'Your Overgiver pattern makes you give your energy to everyone else, leaving nothing for yourself. You neglect your own health needs while taking care of others, leading to exhaustion and burnout.',
                challenge: 'You give all your energy to others, leaving nothing for yourself, which leads to exhaustion and prevents you from prioritizing your own health needs.',
                benefit: 'When you break this pattern, you\'ll balance giving with self-care, prioritize your own health needs, and build sustainable wellness habits that support you.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${data.summary}</p>
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${data.challenge}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getCareerImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your Fixer pattern makes you step in to solve problems at work, even when they\'re not yours to fix. You take on extra responsibilities, believing if you solve everything, you\'ll be safe. But this leads to burnout and prevents others from growing.',
                challenge: 'You overfunction at work, taking on responsibilities that aren\'t yours, which leads to burnout and prevents you from focusing on your own career growth.',
                benefit: 'When you break this pattern, you\'ll focus on your own responsibilities, allow others to solve their problems, and advance your career without constant overfunctioning.'
            },
            'Perfectionist': {
                summary: 'Your Perfectionist pattern makes you overthink every work decision, trying to make the "perfect" choice. You analyze projects endlessly, leading to paralysis and missed deadlines. Your perfectionism prevents you from taking risks and advancing.',
                challenge: 'Your perfectionism causes paralysis and missed opportunities, preventing you from taking calculated risks and advancing your career.',
                benefit: 'When you break this pattern, you\'ll make confident work decisions, take calculated risks, and advance your career without waiting for perfection.'
            },
            'Pleaser': {
                summary: 'Your Pleaser pattern makes you say yes to everything at work, trying to please everyone. You take on extra projects, work late, and prioritize others\' needs over your own. This leads to burnout and prevents you from focusing on what matters.',
                challenge: 'You say yes to everything to please others, which leads to burnout and prevents you from focusing on your own career priorities and growth.',
                benefit: 'When you break this pattern, you\'ll set boundaries at work, prioritize your own career goals, and focus on what truly matters for your advancement.'
            },
            'Performer': {
                summary: 'Your Performer pattern makes you work hard to impress and earn approval, achieving and succeeding to prove your worth. But you\'re exhausted from performing, and you don\'t know how to work authentically without the need for recognition.',
                challenge: 'You work to prove your worth through performance, which exhausts you and prevents you from working authentically and advancing based on your true value.',
                benefit: 'When you break this pattern, you\'ll work authentically, advance based on your true value, and feel worthy without constant performance and recognition.'
            },
            'Escaper': {
                summary: 'Your Escaper pattern makes you avoid difficult conversations, challenging projects, and career risks. You stay busy with tasks that don\'t matter, avoiding the work that would actually advance your career.',
                challenge: 'You avoid challenges and risks to escape discomfort, which prevents you from taking on projects that would advance your career and build your skills.',
                benefit: 'When you break this pattern, you\'ll take on challenging projects, have difficult conversations, and advance your career by facing challenges instead of avoiding them.'
            },
            'Overthinker': {
                summary: 'Your Overthinker pattern makes you analyze every career decision endlessly, trying to figure out the "right" path. You research and compare—but this paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'You overthink career decisions, using analysis as a way to avoid taking action, which causes you to miss opportunities and stay stuck in your current role.',
                benefit: 'When you break this pattern, you\'ll make confident career decisions, take action despite uncertainty, and advance your career through consistent choices.'
            },
            'Withdrawer': {
                summary: 'Your Withdrawer pattern makes you protect yourself by keeping distance from colleagues, avoiding networking, and staying isolated. But this prevents you from building relationships that advance your career.',
                challenge: 'You isolate from colleagues and avoid networking to protect yourself, which prevents you from building relationships that advance your career.',
                benefit: 'When you break this pattern, you\'ll build professional relationships safely, network authentically, and advance your career through connection and collaboration.'
            },
            'Overgiver': {
                summary: 'Your Overgiver pattern makes you give your time and energy to everyone else\'s projects, leaving nothing for your own growth. You help others succeed but neglect your own career advancement.',
                challenge: 'You give all your time to others\' projects, leaving nothing for your own growth, which prevents you from advancing your own career.',
                benefit: 'When you break this pattern, you\'ll balance helping others with your own career growth, prioritize your advancement, and succeed without neglecting yourself.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return generateCondensedImpact(data.summary, data.challenge, data.benefit);
    }
    
    function getIdentityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: `Your Fixer pattern makes you define yourself by what you can fix and solve. You believe "${pattern.coreBelief || 'If I solve it, I\'m safe'}", which gives you strength (${pattern.strength || 'responsible & capable'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'overfunctioning and burnout'}.`,
                challenge: 'You define yourself by fixing and solving, which makes you lose yourself when you can\'t control everything and prevents you from knowing who you are beyond being helpful.',
                benefit: 'When you break this pattern, you\'ll know your worth beyond fixing, define yourself by who you are, not what you do, and feel valuable without solving everything.'
            },
            'Perfectionist': {
                summary: `Your Perfectionist pattern makes you define yourself by being flawless and doing things right. You believe "${pattern.coreBelief || 'If I do it right, I\'ll be loved'}", which gives you strength (${pattern.strength || 'disciplined & driven'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'shame and rigidity'}.`,
                challenge: 'You define yourself by perfection, which makes you feel never good enough and prevents you from accepting yourself as you are.',
                benefit: 'When you break this pattern, you\'ll accept yourself as you are, define yourself beyond perfection, and feel valuable without being flawless.'
            },
            'Pleaser': {
                summary: `Your Pleaser pattern makes you define yourself by keeping others happy. You believe "${pattern.coreBelief || 'If they\'re happy, I\'m okay'}", which gives you strength (${pattern.strength || 'empathetic & kind'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'disconnection from your true self'}.`,
                challenge: 'You define yourself by others\' happiness, which makes you lose your identity and prevents you from knowing who you really are.',
                benefit: 'When you break this pattern, you\'ll know your true identity, define yourself by who you are, not who others want you to be, and feel valuable as your authentic self.'
            },
            'Performer': {
                summary: `Your Performer pattern makes you define yourself by achievements and recognition. You believe "${pattern.coreBelief || 'If I impress, I belong'}", which gives you strength (${pattern.strength || 'charismatic & motivated'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'burnout and emptiness'}.`,
                challenge: 'You define yourself by achievement, which makes you feel empty when you\'re not performing and prevents you from knowing who you are beyond success.',
                benefit: 'When you break this pattern, you\'ll know your worth beyond achievement, define yourself by who you are, not what you achieve, and feel valuable without constant performance.'
            },
            'Escaper': {
                summary: `Your Escaper pattern makes you define yourself by freedom and independence. You believe "${pattern.coreBelief || 'If I don\'t feel it, it can\'t hurt me'}", which gives you strength (${pattern.strength || 'free & creative'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'disconnection from yourself'}.`,
                challenge: 'You define yourself by avoiding feelings, which makes you lose connection to who you really are and prevents you from knowing your authentic self.',
                benefit: 'When you break this pattern, you\'ll connect with your authentic self, define yourself by who you are, not what you avoid, and feel valuable with all your emotions.'
            },
            'Overthinker': {
                summary: `Your Overthinker pattern makes you define yourself by your intelligence and analysis. You believe "${pattern.coreBelief || 'If I analyze enough, I\'ll feel safe'}", which gives you strength (${pattern.strength || 'insightful & intelligent'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'paralysis and anxiety'}.`,
                challenge: 'You define yourself by thinking, which makes you feel stuck when you can\'t figure things out and prevents you from knowing who you are beyond analysis.',
                benefit: 'When you break this pattern, you\'ll know your worth beyond thinking, define yourself by who you are, not what you analyze, and feel valuable without constant analysis.'
            },
            'Withdrawer': {
                summary: `Your Withdrawer pattern makes you define yourself by independence and protection. You believe "${pattern.coreBelief || 'If I don\'t open up, I won\'t get hurt'}", which gives you strength (${pattern.strength || 'independent'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'isolation and loneliness'}.`,
                challenge: 'You define yourself by protection and distance, which makes you feel lonely and prevents you from knowing who you are in connection with others.',
                benefit: 'When you break this pattern, you\'ll know your worth in connection, define yourself by who you are with others, not just alone, and feel valuable in relationships.'
            },
            'Overgiver': {
                summary: `Your Overgiver pattern makes you define yourself by giving and generosity. You believe "${pattern.coreBelief || 'If I give more, they won\'t leave'}", which gives you strength (${pattern.strength || 'loyal & generous'}) but also creates ${pattern.shadow ? pattern.shadow.split(' → ')[1] : 'self-neglect'}.`,
                challenge: 'You define yourself by giving, which makes you lose yourself when you can\'t give and prevents you from knowing who you are beyond generosity.',
                benefit: 'When you break this pattern, you\'ll know your worth beyond giving, define yourself by who you are, not what you give, and feel valuable without constant generosity.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return generateCondensedImpact(data.summary, data.challenge, data.benefit);
    }
    
    function getPurposeImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your Fixer pattern makes you find purpose in helping others, but you lose yourself in others\' goals. You take on their problems as your purpose, which prevents you from pursuing your authentic goals.',
                challenge: 'You find purpose in fixing others\' problems, which prevents you from discovering and pursuing your own authentic purpose and goals.',
                benefit: 'When you break this pattern, you\'ll discover your authentic purpose, pursue your own goals, and help others without losing yourself in their problems.'
            },
            'Perfectionist': {
                summary: 'Your Perfectionist pattern makes you wait for perfect conditions before pursuing purpose, causing paralysis. You analyze and plan endlessly, but never take action because it\'s not "perfect" yet.',
                challenge: 'You wait for perfect conditions to pursue purpose, which causes paralysis and prevents you from taking action toward your authentic goals.',
                benefit: 'When you break this pattern, you\'ll pursue your purpose despite imperfection, take action toward your goals, and build your purpose through practice, not perfection.'
            },
            'Pleaser': {
                summary: 'Your Pleaser pattern makes you find purpose in pleasing others, losing your own direction. You adapt your purpose to what others want, which prevents you from pursuing your authentic goals.',
                challenge: 'You find purpose in pleasing others, which prevents you from discovering and pursuing your own authentic purpose and direction.',
                benefit: 'When you break this pattern, you\'ll discover your authentic purpose, pursue your own goals, and find direction that aligns with who you really are.'
            },
            'Performer': {
                summary: 'Your Performer pattern makes you find purpose in achievement, but you feel empty after reaching goals. You pursue purpose through success and recognition, which prevents you from finding deeper meaning.',
                challenge: 'You find purpose in achievement, which makes you feel empty after reaching goals and prevents you from finding deeper, more meaningful purpose.',
                benefit: 'When you break this pattern, you\'ll find purpose beyond achievement, discover deeper meaning, and pursue goals that fulfill you beyond recognition.'
            },
            'Escaper': {
                summary: 'Your Escaper pattern makes you avoid committing to purpose, staying mobile and free. You avoid defining your purpose to stay flexible, which prevents you from pursuing meaningful goals.',
                challenge: 'You avoid committing to purpose to stay free, which prevents you from pursuing meaningful goals and building a life aligned with your values.',
                benefit: 'When you break this pattern, you\'ll commit to your authentic purpose, pursue meaningful goals, and build a life aligned with your values while maintaining freedom.'
            },
            'Overthinker': {
                summary: 'Your Overthinker pattern makes you analyze purpose endlessly, but you never take action. You think about your purpose constantly, but this paralysis prevents you from pursuing your goals.',
                challenge: 'You overthink your purpose, using analysis as a way to avoid taking action, which prevents you from pursuing your authentic goals.',
                benefit: 'When you break this pattern, you\'ll take action toward your purpose, pursue your goals despite uncertainty, and build your purpose through practice, not perfection.'
            },
            'Withdrawer': {
                summary: 'Your Withdrawer pattern makes you protect yourself from purpose, avoiding commitment. You avoid defining your purpose to prevent disappointment, which prevents you from pursuing meaningful goals.',
                challenge: 'You protect yourself from purpose to avoid disappointment, which prevents you from pursuing meaningful goals and building a life aligned with your values.',
                benefit: 'When you break this pattern, you\'ll commit to your authentic purpose safely, pursue meaningful goals, and build a life aligned with your values without fear of disappointment.'
            },
            'Overgiver': {
                summary: 'Your Overgiver pattern makes you find purpose in giving, but you neglect your own goals. You pursue purpose through serving others, which prevents you from pursuing your authentic goals.',
                challenge: 'You find purpose in giving to others, which prevents you from pursuing your own authentic goals and building a life aligned with your values.',
                benefit: 'When you break this pattern, you\'ll balance giving with pursuing your own purpose, discover your authentic goals, and build a life that serves both you and others.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return generateCondensedImpact(data.summary, data.challenge, data.benefit);
    }
    
    function getLifestyleImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your Fixer pattern makes you fill your days solving others\' problems, leaving no time for yourself. You create structured routines, but they\'re focused on fixing, not living.',
                challenge: 'You fill your days with fixing others\' problems, which leaves no time for your own life and prevents you from building a lifestyle that supports your wellbeing.',
                benefit: 'When you break this pattern, you\'ll create a lifestyle that includes time for yourself, balance fixing with living, and build daily routines that support your wellbeing.'
            },
            'Perfectionist': {
                summary: 'Your Perfectionist pattern makes you create rigid routines that you can\'t maintain, leading to all-or-nothing cycles. You plan perfect days, but when you "fail," you give up entirely.',
                challenge: 'You create rigid routines you can\'t maintain, which leads to cycles of starting and stopping that prevent you from building consistent lifestyle habits.',
                benefit: 'When you break this pattern, you\'ll create flexible, sustainable daily routines, accept imperfection, and build consistent lifestyle habits without all-or-nothing thinking.'
            },
            'Pleaser': {
                summary: 'Your Pleaser pattern makes you say yes to everything, filling your schedule with others\' priorities. You create a lifestyle around pleasing others, leaving no time for your own needs.',
                challenge: 'You fill your schedule with others\' priorities, which leaves no time for your own needs and prevents you from building a lifestyle that supports your wellbeing.',
                benefit: 'When you break this pattern, you\'ll create a lifestyle that includes your own priorities, set boundaries around your time, and build daily routines that support your wellbeing.'
            },
            'Performer': {
                summary: 'Your Performer pattern makes you maintain a busy, achievement-focused lifestyle that exhausts you. You create routines around performing and achieving, leaving no time for rest.',
                challenge: 'You maintain a lifestyle focused on performance, which exhausts you and prevents you from building daily routines that include rest and authentic living.',
                benefit: 'When you break this pattern, you\'ll create a lifestyle that includes rest, balance achievement with authentic living, and build daily routines that support your wellbeing.'
            },
            'Escaper': {
                summary: 'Your Escaper pattern makes you avoid routine and stay busy to avoid feelings. You create a lifestyle of distraction and mobility, which prevents you from building consistent habits.',
                challenge: 'You avoid routine to escape feelings, which prevents you from building consistent lifestyle habits and creating a stable foundation for your life.',
                benefit: 'When you break this pattern, you\'ll create consistent routines, build stable lifestyle habits, and face feelings without needing to escape or stay busy.'
            },
            'Overthinker': {
                summary: 'Your Overthinker pattern makes you overthink daily decisions, causing paralysis. You analyze your lifestyle endlessly, but this prevents you from taking action and building consistent habits.',
                challenge: 'You overthink daily decisions, using analysis as a way to avoid taking action, which prevents you from building consistent lifestyle habits.',
                benefit: 'When you break this pattern, you\'ll make confident daily decisions, take action despite uncertainty, and build consistent lifestyle habits through practice.'
            },
            'Withdrawer': {
                summary: 'Your Withdrawer pattern makes you maintain isolated, protective daily habits. You create a lifestyle of distance and protection, which prevents you from building connections and community.',
                challenge: 'You maintain an isolated lifestyle to protect yourself, which prevents you from building connections and community that support your wellbeing.',
                benefit: 'When you break this pattern, you\'ll create a lifestyle that includes connection, build community safely, and maintain daily habits that support both independence and connection.'
            },
            'Overgiver': {
                summary: 'Your Overgiver pattern makes you give your time to everyone else, leaving nothing for yourself. You create a lifestyle around giving, which prevents you from building habits that support your own wellbeing.',
                challenge: 'You give all your time to others, which leaves nothing for yourself and prevents you from building lifestyle habits that support your own wellbeing.',
                benefit: 'When you break this pattern, you\'ll create a lifestyle that balances giving with self-care, prioritize your own needs, and build daily habits that support both you and others.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return generateCondensedImpact(data.summary, data.challenge, data.benefit);
    }
    
    function getProductivityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your Fixer pattern makes you spend time solving others\' problems, leaving no time for your own goals. You\'re productive, but your productivity is focused on fixing, not your own priorities.',
                challenge: 'You spend your productive time on others\' problems, which leaves no time for your own goals and prevents you from being productive on what truly matters to you.',
                benefit: 'When you break this pattern, you\'ll focus your productivity on your own goals, balance helping others with your priorities, and use your time for what truly matters.'
            },
            'Perfectionist': {
                summary: 'Your Perfectionist pattern makes you waste time perfecting instead of taking action. You\'re productive at perfecting, but this prevents you from completing tasks and moving forward.',
                challenge: 'You waste productive time perfecting instead of taking action, which prevents you from completing tasks and moving forward on your goals.',
                benefit: 'When you break this pattern, you\'ll take action despite imperfection, complete tasks efficiently, and use your time productively to move forward on your goals.'
            },
            'Pleaser': {
                summary: 'Your Pleaser pattern makes you say yes to everything, filling your time with others\' priorities. You\'re productive, but your productivity is focused on pleasing, not your own goals.',
                challenge: 'You spend your productive time on others\' priorities, which leaves no time for your own goals and prevents you from being productive on what truly matters to you.',
                benefit: 'When you break this pattern, you\'ll focus your productivity on your own goals, set boundaries around your time, and use your productivity for what truly matters.'
            },
            'Performer': {
                summary: 'Your Performer pattern makes you work constantly to prove your worth, never resting. You\'re productive at performing, but this exhausts you and prevents you from sustainable productivity.',
                challenge: 'You work constantly to prove your worth, which exhausts you and prevents you from building sustainable productivity habits that include rest.',
                benefit: 'When you break this pattern, you\'ll build sustainable productivity habits, balance work with rest, and use your time productively without constant performance.'
            },
            'Escaper': {
                summary: 'Your Escaper pattern makes you stay busy to avoid feelings, wasting time on distractions. You\'re productive at staying busy, but this prevents you from being productive on what truly matters.',
                challenge: 'You waste productive time on distractions to avoid feelings, which prevents you from being productive on what truly matters and moving forward on your goals.',
                benefit: 'When you break this pattern, you\'ll focus your productivity on what truly matters, face feelings without distraction, and use your time productively to move forward.'
            },
            'Overthinker': {
                summary: 'Your Overthinker pattern makes you spend time analyzing instead of acting. You\'re productive at thinking, but this prevents you from taking action and completing tasks.',
                challenge: 'You waste productive time analyzing instead of acting, which prevents you from completing tasks and moving forward on your goals.',
                benefit: 'When you break this pattern, you\'ll take action despite uncertainty, complete tasks efficiently, and use your time productively to move forward on your goals.'
            },
            'Withdrawer': {
                summary: 'Your Withdrawer pattern makes you isolate and protect your time, missing opportunities. You\'re productive alone, but this prevents you from collaborating and building productivity through connection.',
                challenge: 'You isolate to protect your time, which prevents you from collaborating and building productivity through connection and community.',
                benefit: 'When you break this pattern, you\'ll balance solo productivity with collaboration, build productivity through connection, and use your time productively both alone and with others.'
            },
            'Overgiver': {
                summary: 'Your Overgiver pattern makes you give your time to everyone else, leaving nothing for yourself. You\'re productive at giving, but this prevents you from being productive on your own goals.',
                challenge: 'You spend your productive time on others\' goals, which leaves no time for your own goals and prevents you from being productive on what truly matters to you.',
                benefit: 'When you break this pattern, you\'ll focus your productivity on your own goals, balance giving with your priorities, and use your time productively for both you and others.'
            }
        };
        
        const data = impactSummaries[pattern.name] || impactSummaries['Fixer'];
        
        return generateCondensedImpact(data.summary, data.challenge, data.benefit);
    }
    
    // Get Personalized Drivers Explanation
    function getPersonalizedDriversExplanation(sortedDrivers, driverPercentages, dominantDriver, dominantPercent, firstName) {
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        const driverMeanings = {
            'control': {
                meaning: 'Your need for control drives you to take charge, create structure, and manage situations to feel safe.',
                whenHigh: 'When Control is your dominant driver, you feel most secure when you\'re in charge and things are predictable. You take responsibility for outcomes and feel anxious when situations are out of control.',
                personalContext: (percent) => {
                    if (percent >= 40) {
                        return `With ${percent}% Control, this is your primary way of feeling safe. You automatically take charge when stressed, believing that managing situations will protect you from chaos and uncertainty.`;
                    } else {
                        return `With ${percent}% Control, you have some need for control, but it\'s not your dominant response. You may take charge in certain situations, but other drivers influence your behavior more.`;
                    }
                }
            },
            'avoidance': {
                meaning: 'Your tendency to avoid drives you to escape difficult emotions, stay mobile, and keep your options open to feel safe.',
                whenHigh: 'When Avoidance is your dominant driver, you feel most secure when you\'re free and disconnected. You avoid commitment, difficult feelings, and situations that feel too intense.',
                personalContext: (percent) => {
                    if (percent >= 40) {
                        return `With ${percent}% Avoidance, this is your primary way of feeling safe. You automatically escape when stressed, believing that staying mobile and avoiding difficult feelings will protect you from pain and overwhelm.`;
                    } else {
                        return `With ${percent}% Avoidance, you have some tendency to avoid, but it\'s not your dominant response. You may escape certain situations, but other drivers influence your behavior more.`;
                    }
                }
            },
            'validation': {
                meaning: 'Your need for validation drives you to achieve, perform, and earn approval to feel worthy and safe.',
                whenHigh: 'When Validation is your dominant driver, you feel most secure when you\'re seen as successful and valuable. You work hard to impress and earn recognition.',
                personalContext: (percent) => {
                    if (percent >= 40) {
                        return `With ${percent}% Validation, this is your primary way of feeling safe. You automatically perform when stressed, believing that achieving and earning approval will make you worthy and protect you from rejection.`;
                    } else {
                        return `With ${percent}% Validation, you have some need for validation, but it\'s not your dominant response. You may seek approval in certain situations, but other drivers influence your behavior more.`;
                    }
                }
            },
            'fear-of-rejection': {
                meaning: 'Your fear of rejection drives you to protect yourself, keep distance, or give more to prevent abandonment and feel safe.',
                whenHigh: 'When Fear of Rejection is your dominant driver, you feel most secure when you\'re protected from potential hurt. You keep emotional distance or give endlessly to prevent abandonment.',
                personalContext: (percent) => {
                    if (percent >= 40) {
                        return `With ${percent}% Fear of Rejection, this is your primary way of feeling safe. You automatically protect yourself when stressed, believing that distance or overgiving will protect you from abandonment and rejection.`;
                    } else {
                        return `With ${percent}% Fear of Rejection, you have some fear of rejection, but it\'s not your dominant response. You may protect yourself in certain situations, but other drivers influence your behavior more.`;
                    }
                }
            }
        };
        
        // Get all driver explanations
        const driverExplanations = sortedDrivers.map(([driver, score]) => {
            const driverData = driverMeanings[driver];
            const percent = driverPercentages[driver];
            return {
                name: driverNames[driver],
                percent: percent,
                meaning: driverData.meaning,
                personalContext: driverData.personalContext(percent),
                isDominant: driver === dominantDriver
            };
        });
        
        // Generate unique IDs for each driver accordion
        const driverIds = driverExplanations.map((_, idx) => `driver-${idx}`);
        
        return `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.2rem; font-weight: 600; color: #000; margin: 0 0 0.75rem 0;">Your Emotional Drivers</h3>
                <p style="font-size: 0.95rem; line-height: 1.7; color: #555; margin: 0 0 1.5rem 0;">
                    Your emotional drivers are the underlying needs that activate your pattern. Understanding them helps you see why you respond the way you do and what you're really seeking when your pattern shows up.
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${driverExplanations.map((driver, idx) => {
                        const driverId = driverIds[idx];
                        const isExpanded = driver.isDominant; // Expand dominant driver by default
                        const expandedClass = isExpanded ? 'expanded' : '';
                        const iconRotation = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
                        
                        return `
                            <div class="accordion-item ${expandedClass}" data-section="${driverId}" style="background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 6px; overflow: hidden;">
                                <button class="accordion-header ${expandedClass}" onclick="toggleAccordion('${driverId}')" style="width: 100%; padding: 1.25rem; background: ${driver.isDominant ? 'rgba(202, 0, 19, 0.03)' : '#ffffff'}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; text-align: left; transition: background 0.2s ease;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                                        <span class="accordion-icon" style="transform: ${iconRotation}; width: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: #666; font-size: 0.75rem; transition: transform 0.3s ease;">▶</span>
                                        <div style="display: flex; align-items: baseline; gap: 0.75rem; flex: 1;">
                                            <p style="font-size: 1rem; font-weight: 600; color: #000; margin: 0;">
                                                ${driver.name}
                                            </p>
                                            <p style="font-size: 0.9rem; font-weight: 600; color: ${driver.isDominant ? '#ca0013' : '#666'}; margin: 0;">
                                                ${driver.percent}%
                                            </p>
                                            ${driver.isDominant ? '<span style="font-size: 0.7rem; font-weight: 600; color: #ca0013; text-transform: uppercase; letter-spacing: 0.5px; padding: 0.2rem 0.5rem; background: rgba(202, 0, 19, 0.1); border-radius: 4px;">Dominant</span>' : ''}
                                        </div>
                                    </div>
                                </button>
                                <div class="accordion-content ${expandedClass}" style="max-height: ${isExpanded ? '500px' : '0'}; overflow: hidden; transition: max-height 0.4s ease, padding-top 0.4s ease, padding-bottom 0.4s ease; padding: ${isExpanded ? '0 1.25rem 1.25rem 1.25rem' : '0 1.25rem'};">
                                    <div style="padding-left: 1.75rem;">
                                        <p style="font-size: 0.95rem; line-height: 1.6; color: #555; margin: 0 0 0.75rem 0;">
                                            ${driver.meaning}
                                        </p>
                                        <p style="font-size: 0.95rem; line-height: 1.6; color: #333; margin: 0; font-weight: 500;">
                                            ${driver.personalContext}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // How Your Pattern Operates - Simplified & User-Friendly
    function getHowPatternOperatesSimple(pattern, dominantDriver, dominantPercent, firstName) {
        const patternStories = {
            'Fixer': {
                when: 'When you feel stressed, overwhelmed, or uncertain',
                what: 'you automatically jump in to solve problems—even when they\'re not yours to fix',
                why: 'Your Control driver is trying to keep you safe by taking charge',
                cost: 'This costs you: your peace, your energy, and your ability to let others take responsibility'
            },
            'Perfectionist': {
                when: 'When you feel stressed, uncertain, or afraid of making mistakes',
                what: 'you automatically try to make everything perfect before acting',
                why: 'Your Control driver is trying to keep you safe by ensuring everything is flawless',
                cost: 'This costs you: opportunities, time, and your ability to feel good enough'
            },
            'Pleaser': {
                when: 'When you feel stressed, uncertain, or afraid of conflict',
                what: 'you automatically say yes and put others\' needs before your own',
                why: 'Your Validation driver is trying to keep you safe by earning approval',
                cost: 'This costs you: your identity, your boundaries, and your ability to prioritize yourself'
            },
            'Performer': {
                when: 'When you feel stressed, uncertain, or afraid of not being enough',
                what: 'you automatically work harder to impress and prove your worth',
                why: 'Your Validation driver is trying to keep you safe by achieving recognition',
                cost: 'This costs you: your authenticity, your rest, and your ability to feel valuable without proving it'
            },
            'Escaper': {
                when: 'When you feel stressed, overwhelmed, or facing difficult emotions',
                what: 'you automatically stay busy and avoid feeling deeply',
                why: 'Your Avoidance driver is trying to keep you safe by escaping pain',
                cost: 'This costs you: deep connections, emotional intimacy, and your ability to process feelings'
            },
            'Overthinker': {
                when: 'When you feel stressed, uncertain, or facing a decision',
                what: 'you automatically analyze everything before acting—often getting stuck',
                why: 'Your Avoidance driver is trying to keep you safe by thinking instead of feeling',
                cost: 'This costs you: opportunities, action, and your ability to make decisions confidently'
            },
            'Withdrawer': {
                when: 'When you feel stressed, uncertain, or someone gets too close',
                what: 'you automatically pull away and protect yourself emotionally',
                why: 'Your Fear of Rejection driver is trying to keep you safe by maintaining distance',
                cost: 'This costs you: intimacy, connection, and your ability to be vulnerable'
            },
            'Overgiver': {
                when: 'When you feel stressed, uncertain, or afraid of being abandoned',
                what: 'you automatically give more than you receive, hoping they\'ll stay',
                why: 'Your Fear of Rejection driver is trying to keep you safe by preventing abandonment',
                cost: 'This costs you: your needs, your boundaries, and your ability to receive'
            }
        };
        
        const story = patternStories[pattern.name] || {
            when: 'When you feel stressed or uncertain',
            what: `you default to your ${pattern.name.toLowerCase()} pattern`,
            why: 'This is your automatic response',
            cost: 'This is limiting your growth'
        };
        
        return `
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 8px; border-left: 4px solid #ca0013;">
                <p style="font-size: 1rem; font-weight: 600; color: #000; margin: 0 0 1rem 0;">Here's How Your Pattern Works:</p>
                
                <div style="margin-bottom: 1rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #666; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.5px;">When:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">${story.when}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #666; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What Happens:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">${story.what}</p>
                </div>
                
                <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(202, 0, 19, 0.05); border-radius: 6px;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #666; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Why:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">${story.why} (${dominantPercent}% of your responses). This was a survival strategy that worked, but now it's limiting you.</p>
                </div>
                
                <div style="padding: 1rem; background: rgba(202, 0, 19, 0.08); border-radius: 6px; border-left: 3px solid #ca0013;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #ca0013; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What This Costs You:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0; font-weight: 500;">${story.cost}</p>
                </div>
            </div>
        `;
    }
    
    // Core Belief with Context - Enhanced with Value & Examples
    function getCoreBeliefWithContext(pattern, complex, firstName) {
        const enhancedBeliefs = {
            'If I solve it, I\'m safe.': {
                whatItMeans: 'You believe that taking charge and fixing problems will keep you safe from chaos, uncertainty, and things falling apart.',
                howItShowsUp: 'You jump in to solve others\' problems, take responsibility for outcomes that aren\'t yours, and feel anxious when things are out of control.',
                whyItDeveloped: 'You likely learned early that being helpful and capable kept you safe. Maybe you had to take care of siblings, or a parent needed you, or you learned that fixing things earned you love and approval.',
                whatItCosts: 'This costs you: your peace, your energy, your ability to rest, and your relationships (because you\'re overfunctioning for others).',
                whatToNotice: 'Notice when you jump in to fix something that\'s not yours to fix. Notice the anxiety that comes up when things are out of control.'
            },
            'If I do it right, I\'ll be loved.': {
                whatItMeans: 'You believe that being perfect and doing everything flawlessly will protect you from criticism, rejection, and the fear of not being good enough.',
                howItShowsUp: 'You spend hours perfecting tasks that were already "good enough," criticize yourself harshly for any mistake, delay completing projects because they\'re not perfect yet, and feel anxious when things aren\'t exactly as planned.',
                whyItDeveloped: 'You likely learned early that mistakes led to criticism, rejection, or punishment. Maybe you had to be perfect to earn love, or you learned that "good enough" wasn\'t safe.',
                whatItCosts: 'This costs you: opportunities (because you\'re waiting for perfect), time (because you\'re overthinking), your ability to feel good enough, and your ability to rest without guilt.',
                whatToNotice: 'Notice when you\'re overthinking a decision or trying to make it perfect. Notice the fear that comes up when something isn\'t flawless.'
            },
            'If they\'re happy, I\'m okay.': {
                whatItMeans: 'You believe that keeping others happy and avoiding conflict will keep you safe from rejection, abandonment, and the fear of not being loved.',
                howItShowsUp: 'You say yes when you want to say no, prioritize others\' needs over your own, avoid conflict at all costs, shape yourself to fit others\' expectations, and feel responsible for others\' emotions.',
                whyItDeveloped: 'You likely learned early that your needs didn\'t matter or that keeping others happy was the only way to feel safe. Maybe you had to manage a parent\'s emotions, or you learned that saying "no" led to rejection.',
                whatItCosts: 'This costs you: your identity (because you\'re losing yourself), your boundaries, your ability to prioritize yourself, and your relationships (because people don\'t know the real you).',
                whatToNotice: 'Notice when you say yes to something you don\'t want. Notice the fear that comes up when you consider saying no or setting a boundary.'
            },
            'If I impress, I belong.': {
                whatItMeans: 'You believe that achieving success, earning recognition, and proving your worth will make you belong and protect you from being seen as unworthy or not enough.',
                howItShowsUp: 'You work excessively to prove your value, tie your worth to accomplishments, feel empty even after achieving goals, fear being seen as lazy or unproductive, and perform for others instead of being authentic.',
                whyItDeveloped: 'You likely learned early that love and acceptance were conditional on achievement. Maybe you had to perform to earn attention, or you learned that being "good enough" required constant success.',
                whatItCosts: 'This costs you: your authenticity (because you\'re performing), your rest (because you can\'t stop), your ability to feel valuable without proving it, and your relationships (because people don\'t see the real you).',
                whatToNotice: 'Notice when you\'re working to impress someone or prove your worth. Notice the emptiness that comes up even after achieving something.'
            },
            'If I don\'t feel it, it can\'t hurt me.': {
                whatItMeans: 'You believe that avoiding difficult emotions, staying busy, and not feeling deeply will protect you from pain, overwhelm, and the fear of being consumed by your feelings.',
                howItShowsUp: 'You distract yourself when difficult emotions come up, avoid conflicts and difficult conversations, stay busy to avoid feeling deeply, flee situations that feel too intense, and numb out when things get overwhelming.',
                whyItDeveloped: 'You likely learned early that difficult emotions were overwhelming, unsafe, or led to rejection. Maybe you had to stay "positive" or "strong," or you learned that feeling deeply was dangerous.',
                whatItCosts: 'This costs you: deep connections (because you\'re avoiding intimacy), emotional intimacy, your ability to process feelings, and your relationship with yourself (because you\'re disconnected).',
                whatToNotice: 'Notice when you\'re staying busy or distracting yourself to avoid feeling something. Notice the urge to flee when emotions get intense.'
            },
            'If I analyze enough, I\'ll feel safe.': {
                whatItMeans: 'You believe that thinking through everything perfectly, understanding all possibilities, and analyzing every detail will protect you from making mistakes, uncertainty, and the fear of failure.',
                howItShowsUp: 'You overthink decisions for days or weeks without acting, research endlessly but struggle to make choices, analyze situations instead of experiencing them, feel paralyzed by too many options, and use thinking to avoid feeling or acting.',
                whyItDeveloped: 'You likely learned early that acting without thinking was dangerous. Maybe you had to analyze every situation to stay safe, or you learned that understanding was more valuable than feeling.',
                whatItCosts: 'This costs you: opportunities (because you\'re stuck thinking), action (because you\'re paralyzed), your ability to make decisions confidently, and your ability to feel emotions (because you\'re analyzing them).',
                whatToNotice: 'Notice when you\'re analyzing instead of acting. Notice the paralysis that comes up when you have to make a decision without all the information.'
            },
            'If I don\'t open up, I won\'t get hurt.': {
                whatItMeans: 'You believe that keeping emotional distance, staying independent, and not being vulnerable will protect you from rejection, abandonment, and the fear of being seen and then left.',
                howItShowsUp: 'You emotionally withdraw when relationships get too close, keep distance to protect yourself from getting hurt, struggle to express or receive deep emotions, pull away when intimacy feels too intense, and maintain independence as protection.',
                whyItDeveloped: 'You likely learned early that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                whatItCosts: 'This costs you: intimacy (because you\'re keeping distance), deep connections, your ability to be vulnerable, and your relationships (because people can\'t get close to you).',
                whatToNotice: 'Notice when you pull away from someone getting close or when you emotionally shut down. Notice the fear that comes up when someone wants to see the real you.'
            },
            'If I give more, they won\'t leave.': {
                whatItMeans: 'You believe that giving endlessly, sacrificing your needs, and being indispensable will prevent abandonment, rejection, and the fear of being left or not being enough.',
                howItShowsUp: 'You give more than you receive, sacrifice your own needs to keep others close, feel resentful when giving isn\'t reciprocated, believe you must give more to be valuable, and give from fear instead of genuine generosity.',
                whyItDeveloped: 'You likely learned early that love was conditional on giving. Maybe you had to give to earn attention, or you learned that your needs didn\'t matter compared to others\'.',
                whatItCosts: 'This costs you: your needs (because you\'re neglecting yourself), your boundaries, your ability to receive, and your relationships (because you\'re giving from fear, not love).',
                whatToNotice: 'Notice when you give more than you receive or when you sacrifice your needs. Notice the fear that comes up when you consider saying no or setting a limit on giving.'
            }
        };
        
        const beliefData = enhancedBeliefs[pattern.coreBelief] || {
            whatItMeans: 'This core belief shapes how you navigate life and relationships.',
            howItShowsUp: 'This belief shows up in your daily responses to stress and uncertainty.',
            whyItDeveloped: 'This belief developed as a survival strategy.',
            whatItCosts: 'This belief is limiting your growth.',
            whatToNotice: 'Notice when this belief is driving your behavior.'
        };
        
        return `
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 8px; border-left: 4px solid #ca0013;">
                <p style="font-size: 0.9rem; font-weight: 600; color: #666; margin: 0 0 0.75rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Core Belief</p>
                <p style="font-size: 1.4rem; font-weight: 400; color: #000; margin: 0 0 1.5rem 0; font-style: italic; line-height: 1.4;">
                    "${pattern.coreBelief}"
                </p>
                
                <!-- What It Means -->
                <div style="margin-bottom: 1.25rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.5rem 0;">What This Means:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">
                        ${beliefData.whatItMeans}
                    </p>
                </div>
                
                <!-- How It Shows Up -->
                <div style="margin-bottom: 1.25rem; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.5rem 0;">How This Shows Up in Your Life:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">
                        ${beliefData.howItShowsUp}
                    </p>
                </div>
                
                <!-- Why It Developed -->
                <div style="margin-bottom: 1.25rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #000; margin: 0 0 0.5rem 0;">Why You Developed This:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">
                        ${beliefData.whyItDeveloped}
                    </p>
                </div>
                
                <!-- What It Costs -->
                <div style="margin-bottom: 1.25rem; padding: 1rem; background: rgba(202, 0, 19, 0.08); border-radius: 6px; border-left: 3px solid #ca0013;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #ca0013; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What This Costs You:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0; font-weight: 500;">
                        ${beliefData.whatItCosts}
                    </p>
                </div>
                
                <!-- What To Notice -->
                <div style="padding: 1rem; background: rgba(76, 175, 80, 0.05); border-radius: 6px; border-left: 3px solid #4caf50;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #4caf50; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.5px;">What To Notice:</p>
                    <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">
                        ${beliefData.whatToNotice}
                    </p>
                </div>
                
                ${complex.primary ? `
                    <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                        <p style="font-size: 0.95rem; line-height: 1.6; color: #666; margin: 0;">
                            <strong>Your ${complex.primary}</strong> is the psychological mechanism behind this belief. It developed as a survival strategy that worked when you needed it most, but now it's limiting your growth and connection.
                        </p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // How Your Pattern Operates
    function getHowPatternOperates(pattern, dominantDriver, dominantPercent, firstName) {
        const patternOperations = {
            'Fixer': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You jump in to solve problems—even when they're not yours to fix. This happens because your <strong>Control driver (${dominantPercent}%)</strong> is trying to keep you safe by taking charge.`,
            'Perfectionist': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You analyze every detail and strive for flawlessness. This happens because your <strong>Control driver (${dominantPercent}%)</strong> is trying to keep you safe by ensuring everything is perfect.`,
            'Pleaser': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You say yes and put others first—even when you're exhausted. This happens because your <strong>Validation driver (${dominantPercent}%)</strong> is trying to keep you safe by earning approval.`,
            'Performer': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You work hard to impress and earn recognition. This happens because your <strong>Validation driver (${dominantPercent}%)</strong> is trying to keep you safe by proving your worth.`,
            'Escaper': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You stay busy and avoid difficult feelings. This happens because your <strong>Avoidance driver (${dominantPercent}%)</strong> is trying to keep you safe by escaping pain.`,
            'Overthinker': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You analyze everything before acting—often getting stuck in your head. This happens because your <strong>Avoidance driver (${dominantPercent}%)</strong> is trying to keep you safe by thinking instead of feeling.`,
            'Withdrawer': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You pull away and protect yourself from getting hurt. This happens because your <strong>Fear of Rejection driver (${dominantPercent}%)</strong> is trying to keep you safe by maintaining distance.`,
            'Overgiver': `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates. You give more than you receive, hoping they'll see your worth. This happens because your <strong>Fear of Rejection driver (${dominantPercent}%)</strong> is trying to keep you safe by preventing abandonment.`
        };
        
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        return `
            <div style="margin-bottom: 2rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.03); border-radius: 6px;">
                <p style="font-size: 0.95rem; font-weight: 600; color: #000; margin: 0 0 0.75rem 0;">How Your Pattern Operates:</p>
                <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0;">
                    ${patternOperations[pattern.name] || `When you feel stressed or uncertain, your ${pattern.name.toLowerCase()} pattern automatically activates.`}
                </p>
            </div>
        `;
    }
    
    // Improved First Step
    function getImprovedFirstStep(pattern, dominantDriver, dominantPercent, firstName) {
        const firstSteps = {
            'Fixer': {
                action: 'Notice when you jump in to fix something that\'s not yours to fix.',
                insight: 'Just observe without judgment. Awareness breaks the automatic response.',
                why: 'Your Control driver is trying to keep you safe, but you can choose to allow others to own their problems.'
            },
            'Perfectionist': {
                action: 'Notice when you\'re overthinking a decision or trying to make it perfect.',
                insight: 'Ask yourself: "What\'s the good enough choice?" Just notice—don\'t force change yet.',
                why: 'Your Control driver is trying to keep you safe through perfection, but "good enough" is often enough.'
            },
            'Pleaser': {
                action: 'Notice when you say yes to something you don\'t want to do.',
                insight: 'Just notice the moment—awareness is the first step to setting boundaries.',
                why: 'Your Validation driver is trying to keep you safe by earning approval, but you can choose to prioritize your needs.'
            },
            'Performer': {
                action: 'Notice when you\'re working to impress someone or prove your worth.',
                insight: 'Just observe the moment—awareness helps you see when you\'re performing vs. being authentic.',
                why: 'Your Validation driver is trying to keep you safe through achievement, but you\'re already valuable without proving it.'
            },
            'Escaper': {
                action: 'Notice when you\'re staying busy or distracting yourself to avoid feeling something.',
                insight: 'Just pause and notice what you\'re avoiding. Don\'t force yourself to feel—just observe.',
                why: 'Your Avoidance driver is trying to keep you safe by escaping pain, but you can learn to sit with difficult emotions.'
            },
            'Overthinker': {
                action: 'Notice when you\'re analyzing instead of acting.',
                insight: 'Just observe the moment—awareness helps you see when thinking is avoidance.',
                why: 'Your Avoidance driver is trying to keep you safe through analysis, but action often requires uncertainty.'
            },
            'Withdrawer': {
                action: 'Notice when you pull away from someone getting close or when you emotionally shut down.',
                insight: 'Just observe—awareness helps you see when withdrawal is protection vs. genuine need for space.',
                why: 'Your Fear of Rejection driver is trying to keep you safe through distance, but you can learn to open up safely.'
            },
            'Overgiver': {
                action: 'Notice when you give more than you receive or when you sacrifice your needs.',
                insight: 'Just observe the moment—awareness helps you see when giving is from fear vs. genuine generosity.',
                why: 'Your Fear of Rejection driver is trying to keep you safe by preventing abandonment, but you can learn to receive as much as you give.'
            }
        };
        
        const step = firstSteps[pattern.name] || {
            action: `Notice when your ${pattern.name.toLowerCase()} pattern shows up.`,
            insight: 'Just observe—awareness is the first step.',
            why: 'Awareness breaks the automatic response.'
        };
        
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        return `
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(76, 175, 80, 0.05); border-radius: 8px; border-left: 4px solid #4caf50;">
                <p style="font-size: 1rem; font-weight: 600; color: #4caf50; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your First Step Today</p>
                <p style="font-size: 1.1rem; line-height: 1.7; color: #000; margin: 0 0 1rem 0; font-weight: 500;">
                    ${step.action}
                </p>
                <p style="font-size: 1rem; line-height: 1.7; color: #333; margin: 0 0 1rem 0;">
                    ${step.insight}
                </p>
                <div style="padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; margin-top: 1rem;">
                    <p style="font-size: 0.9rem; font-weight: 600; color: #666; margin: 0 0 0.5rem 0;">Why This Works:</p>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: #333; margin: 0 0 0.75rem 0;">
                        ${step.why}
                    </p>
                    <p style="font-size: 0.9rem; line-height: 1.6; color: #666; margin: 0; font-style: italic;">
                        Focus on breaking your <strong>${driverNames[dominantDriver]} driver (${dominantPercent}%)</strong> first—this is your dominant driver and the root of your pattern.
                    </p>
                </div>
            </div>
        `;
    }
    
    // Simplified Core Insight - Core Belief + What It Means + First Step
    function getSimplifiedCoreInsight(pattern, patternDominance, firstName, dominantDriver, dominantPercent) {
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        const patternExplanations = {
            'Fixer': 'When you feel stressed, you default to fixing problems—even when they\'re not yours to fix.',
            'Perfectionist': 'When you feel stressed, you default to analyzing every detail and trying to make the perfect choice.',
            'Pleaser': 'When you feel stressed, you default to saying yes and putting others first—even when you\'re exhausted.',
            'Performer': 'When you feel stressed, you default to working hard to impress and earn approval.',
            'Escaper': 'When you feel stressed, you default to staying busy and avoiding difficult feelings.',
            'Overthinker': 'When you feel stressed, you default to analyzing everything before acting—often getting stuck in your head.',
            'Withdrawer': 'When you feel stressed, you default to pulling away and protecting yourself from getting hurt.',
            'Overgiver': 'When you feel stressed, you default to giving more than you receive, hoping they\'ll see your worth.'
        };
        
        const firstSteps = {
            'Fixer': 'Notice when you jump in to fix something that\'s not yours to fix. Just observe—awareness is the first step.',
            'Perfectionist': 'Notice when you\'re overthinking a decision. Ask yourself: "What\'s the good enough choice?"',
            'Pleaser': 'Notice when you say yes to something you don\'t want. Just notice the moment.',
            'Performer': 'Notice when you\'re working to impress someone. Just observe.',
            'Escaper': 'Notice when you\'re staying busy to avoid feeling something. Just pause and notice.',
            'Overthinker': 'Notice when you\'re analyzing instead of acting. Just observe the moment.',
            'Withdrawer': 'Notice when you pull away from someone getting close. Just observe.',
            'Overgiver': 'Notice when you give more than you receive. Just observe the moment.'
        };
        
        return `
            <div class="simplified-core-insight" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                ${pattern.coreBelief ? `
                    <p style="font-size: 1.5rem; font-weight: 400; color: #000; margin: 0 0 1rem 0; font-style: italic; line-height: 1.4;">
                        "${pattern.coreBelief}"
                    </p>
                ` : ''}
                
                <p style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">
                    ${patternExplanations[pattern.name] || `Your ${pattern.name.toLowerCase()} pattern shows up when you feel stressed or uncertain.`}
                </p>
                
                <div style="padding: 1.25rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; margin-bottom: 1rem;">
                    <p style="font-size: 0.95rem; font-weight: 600; color: #ca0013; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your First Step</p>
                    <p style="font-size: 1.05rem; line-height: 1.6; color: #000; margin: 0;">
                        ${firstSteps[pattern.name] || `Notice when your ${pattern.name.toLowerCase()} pattern shows up. Just observe—awareness is the first step.`}
                    </p>
                </div>
                
                <p style="font-size: 0.95rem; color: #666; margin: 0; font-style: italic;">
                    Focus: Break your <strong>${driverNames[dominantDriver]} driver (${dominantPercent}%)</strong> first—this is your dominant driver.
                </p>
            </div>
        `;
    }
    
    // Simplified Drivers Visual - Clickable with Expandable Details
    function getSimplifiedDriversVisual(sortedDrivers, driverPercentages, dominantDriver, dominantPercent, firstName) {
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        // Get driver meanings data - Expert-consulted explanations with clear contrast
        const driverMeanings = {
            'control': {
                meaning: 'Your need for control drives you to take charge, create structure, and manage situations to feel safe. When you feel uncertain or stressed, you automatically try to control outcomes, people, or circumstances.',
                personalContext: (percent, isDominant, allDrivers) => {
                    if (isDominant) {
                        if (percent >= 50) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Control is your primary way of feeling safe. This means when you face stress or uncertainty, you automatically take charge and try to manage the situation. You believe that controlling outcomes will protect you from chaos and unpredictability. This driver influences most of your automatic responses, even when other drivers are present.`;
                        } else if (percent >= 35) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Control is your primary way of feeling safe, though you have other drivers operating at similar levels. This means when you face stress, you tend to take charge first, but you may also respond with other drivers depending on the situation. You believe that managing situations will protect you, but you have more flexibility than someone with a higher percentage.`;
                        } else {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Control is your primary response, but you have multiple drivers operating at similar levels. This means you have more flexibility—you may take charge in some situations, but other drivers (like ${allDrivers.filter(d => d.name !== 'Control' && d.percent > 20).map(d => d.name).join(' or ')}) also influence your behavior significantly. Your responses can vary depending on the context.`;
                        }
                    } else {
                        if (percent >= 30) {
                            return `At ${percent}%, Control is a significant secondary driver for you. While it's not your primary response, you do take charge in certain situations, especially when you feel like things are getting out of hand. This driver works alongside your dominant driver (${allDrivers.find(d => d.isDominant)?.name}), creating a more complex response pattern.`;
                        } else {
                            return `At ${percent}%, Control is a minor driver for you. You may take charge occasionally, but this is not your primary way of responding to stress. Your dominant driver (${allDrivers.find(d => d.isDominant)?.name}) influences your behavior much more strongly.`;
                        }
                    }
                }
            },
            'avoidance': {
                meaning: 'Your tendency to avoid drives you to escape difficult emotions, stay mobile, and keep your options open to feel safe. When you feel overwhelmed or stressed, you automatically try to escape, distract, or avoid feeling deeply.',
                personalContext: (percent, isDominant, allDrivers) => {
                    if (isDominant) {
                        if (percent >= 50) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Avoidance is your primary way of feeling safe. This means when you face stress or difficult emotions, you automatically escape, stay busy, or avoid feeling deeply. You believe that staying mobile and not feeling will protect you from pain and overwhelm. This driver influences most of your automatic responses, even when other drivers are present.`;
                        } else if (percent >= 35) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Avoidance is your primary way of feeling safe, though you have other drivers operating at similar levels. This means when you face stress, you tend to escape or avoid first, but you may also respond with other drivers depending on the situation. You believe that avoiding difficult feelings will protect you, but you have more flexibility than someone with a higher percentage.`;
                        } else {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Avoidance is your primary response, but you have multiple drivers operating at similar levels. This means you have more flexibility—you may escape in some situations, but other drivers (like ${allDrivers.filter(d => d.name !== 'Avoidance' && d.percent > 20).map(d => d.name).join(' or ')}) also influence your behavior significantly. Your responses can vary depending on the context.`;
                        }
                    } else {
                        if (percent >= 30) {
                            return `At ${percent}%, Avoidance is a significant secondary driver for you. While it's not your primary response, you do escape or avoid in certain situations, especially when emotions feel too intense. This driver works alongside your dominant driver (${allDrivers.find(d => d.isDominant)?.name}), creating a more complex response pattern.`;
                        } else {
                            return `At ${percent}%, Avoidance is a minor driver for you. You may escape occasionally, but this is not your primary way of responding to stress. Your dominant driver (${allDrivers.find(d => d.isDominant)?.name}) influences your behavior much more strongly.`;
                        }
                    }
                }
            },
            'validation': {
                meaning: 'Your need for validation drives you to achieve, perform, and earn approval to feel worthy and safe. When you feel uncertain or stressed, you automatically try to prove your worth through achievement, performance, or earning others\' approval.',
                personalContext: (percent, isDominant, allDrivers) => {
                    if (isDominant) {
                        if (percent >= 50) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Validation is your primary way of feeling safe. This means when you face stress or uncertainty, you automatically work harder, perform, or seek approval. You believe that achieving and earning recognition will make you worthy and protect you from rejection. This driver influences most of your automatic responses, even when other drivers are present.`;
                        } else if (percent >= 35) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Validation is your primary way of feeling safe, though you have other drivers operating at similar levels. This means when you face stress, you tend to seek approval or perform first, but you may also respond with other drivers depending on the situation. You believe that earning validation will protect you, but you have more flexibility than someone with a higher percentage.`;
                        } else {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Validation is your primary response, but you have multiple drivers operating at similar levels. This means you have more flexibility—you may seek approval in some situations, but other drivers (like ${allDrivers.filter(d => d.name !== 'Validation' && d.percent > 20).map(d => d.name).join(' or ')}) also influence your behavior significantly. Your responses can vary depending on the context.`;
                        }
                    } else {
                        if (percent >= 30) {
                            return `At ${percent}%, Validation is a significant secondary driver for you. While it's not your primary response, you do seek approval or perform in certain situations, especially when you feel insecure. This driver works alongside your dominant driver (${allDrivers.find(d => d.isDominant)?.name}), creating a more complex response pattern.`;
                        } else {
                            return `At ${percent}%, Validation is a minor driver for you. You may seek approval occasionally, but this is not your primary way of responding to stress. Your dominant driver (${allDrivers.find(d => d.isDominant)?.name}) influences your behavior much more strongly.`;
                        }
                    }
                }
            },
            'fear-of-rejection': {
                meaning: 'Your fear of rejection drives you to protect yourself, keep distance, or give more to prevent abandonment and feel safe. When you feel uncertain or stressed, you automatically try to protect yourself from potential hurt, rejection, or abandonment.',
                personalContext: (percent, isDominant, allDrivers) => {
                    if (isDominant) {
                        if (percent >= 50) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Fear of Rejection is your primary way of feeling safe. This means when you face stress or uncertainty, you automatically protect yourself by keeping distance, withdrawing, or overgiving to prevent abandonment. You believe that protecting yourself will keep you safe from rejection and hurt. This driver influences most of your automatic responses, even when other drivers are present.`;
                        } else if (percent >= 35) {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Fear of Rejection is your primary way of feeling safe, though you have other drivers operating at similar levels. This means when you face stress, you tend to protect yourself first, but you may also respond with other drivers depending on the situation. You believe that preventing rejection will protect you, but you have more flexibility than someone with a higher percentage.`;
                        } else {
                            return `As your <strong>dominant driver</strong> at ${percent}%, Fear of Rejection is your primary response, but you have multiple drivers operating at similar levels. This means you have more flexibility—you may protect yourself in some situations, but other drivers (like ${allDrivers.filter(d => d.name !== 'Fear of Rejection' && d.percent > 20).map(d => d.name).join(' or ')}) also influence your behavior significantly. Your responses can vary depending on the context.`;
                        }
                    } else {
                        if (percent >= 30) {
                            return `At ${percent}%, Fear of Rejection is a significant secondary driver for you. While it's not your primary response, you do protect yourself in certain situations, especially when you feel vulnerable. This driver works alongside your dominant driver (${allDrivers.find(d => d.isDominant)?.name}), creating a more complex response pattern.`;
                        } else {
                            return `At ${percent}%, Fear of Rejection is a minor driver for you. You may protect yourself occasionally, but this is not your primary way of responding to stress. Your dominant driver (${allDrivers.find(d => d.isDominant)?.name}) influences your behavior much more strongly.`;
                        }
                    }
                }
            }
        };
        
        // Prepare all driver data for context
        const allDriversData = sortedDrivers.map(([driver, score]) => ({
            name: driverNames[driver],
            percent: driverPercentages[driver],
            isDominant: driver === dominantDriver
        }));
        
        const driverBars = sortedDrivers.map(([driver, score], idx) => {
            const percentage = driverPercentages[driver];
            const isDominant = driver === dominantDriver;
            const barWidth = percentage;
            const barColor = isDominant ? '#ca0013' : '#666';
            const driverId = `driver-visual-${idx}`;
            const driverData = driverMeanings[driver];
            const isExpanded = isDominant; // Expand dominant driver by default
            const expandedClass = isExpanded ? 'expanded' : '';
            const iconRotation = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
            
            return `
                <div class="driver-bar-item ${expandedClass}" data-driver-id="${driverId}" style="margin-bottom: 1.25rem; background: #ffffff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 6px; overflow: hidden;">
                    <button onclick="toggleDriverDetails('${driverId}')" style="width: 100%; padding: 1rem 1.25rem; background: ${isDominant ? 'rgba(202, 0, 19, 0.03)' : '#ffffff'}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; text-align: left; transition: background 0.2s ease;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
                            <span class="driver-icon" style="transform: ${iconRotation}; width: 20px; min-width: 20px; max-width: 20px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; color: #666; font-size: 0.75rem; transition: transform 0.3s ease;">▶</span>
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <span style="font-size: 1rem; font-weight: ${isDominant ? '600' : '500'}; color: ${isDominant ? '#ca0013' : '#000'};">
                                        ${driverNames[driver]} ${isDominant ? '(Dominant)' : ''}
                                    </span>
                                    <span style="font-size: 1rem; font-weight: 600; color: ${isDominant ? '#ca0013' : '#666'};">
                                        ${percentage}%
                                    </span>
                                </div>
                                <div style="width: 100%; height: 8px; background: rgba(0, 0, 0, 0.1); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${barWidth}%; height: 100%; background: ${barColor}; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                        </div>
                    </button>
                    <div class="driver-details-content ${expandedClass}" style="max-height: ${isExpanded ? '500px' : '0'}; overflow: hidden; transition: max-height 0.4s ease, padding-top 0.4s ease, padding-bottom 0.4s ease; padding: ${isExpanded ? '0 1.25rem 1.25rem 1.25rem' : '0 1.25rem'};">
                        <div style="padding-left: 1.75rem; padding-top: 0.75rem;">
                            <p style="font-size: 0.95rem; line-height: 1.6; color: #555; margin: 0 0 0.75rem 0;">
                                ${driverData.meaning}
                            </p>
                            <p style="font-size: 0.95rem; line-height: 1.7; color: #333; margin: 0; font-weight: 400;">
                                ${driverData.personalContext(percentage, isDominant, allDriversData)}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="simplified-drivers-visual" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <h3 style="font-size: 1.2rem; font-weight: 600; color: #000; margin-bottom: 1.5rem;">Your Emotional Drivers</h3>
                <p style="font-size: 0.95rem; line-height: 1.7; color: #555; margin: 0 0 1.5rem 0;">
                    Click on any driver below to learn more about what it means for you personally.
                </p>
                ${driverBars}
            </div>
        `;
    }
    
    // Simplified Strength & Shadow - Balanced, Minimal
    function getSimplifiedStrengthShadow(pattern) {
        if (!pattern.strength || !pattern.shadow) return '';
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = shadowParts[0] || 'your pattern behavior';
        const shadowConsequence = shadowParts[1] || 'consequences';
        
        return `
            <div class="simplified-strength-shadow" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem;">
                    <div>
                        <p style="font-size: 0.95rem; font-weight: 600; color: #4caf50; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Strength</p>
                        <p style="font-size: 1rem; line-height: 1.6; color: #000; margin: 0;">
                            <strong>${pattern.strength}</strong> - This is the positive side of your pattern. Keep this strength while breaking free from the shadow.
                        </p>
                    </div>
                    <div>
                        <p style="font-size: 0.95rem; font-weight: 600; color: #ca0013; margin: 0 0 0.5rem 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Shadow</p>
                        <p style="font-size: 1rem; line-height: 1.6; color: #000; margin: 0;">
                            <strong>${shadowBehavior}</strong> → <strong>${shadowConsequence}</strong> - This is what your pattern costs you.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Pattern in Action - Merged Story + Life Areas
    function getPatternInActionMerged(pattern, archetype, patternDominance, driverPercentages, sortedDrivers, exactAge, relationshipStatus, firstName, answers, driverScores, quizData) {
        const quizDataArray = quizData || window.quizData || [];
        const story = buildPersonalizedStory(pattern, archetype, patternDominance, driverPercentages, sortedDrivers, exactAge, relationshipStatus, firstName, answers, quizDataArray, driverScores);
        const lifeAreas = getLifeAreaImpactAccordion(pattern, exactAge, relationshipStatus, firstName, patternDominance, answers);
        
        return `
            <p class="content-text" style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">
                ${firstName ? `${firstName}, ` : ''}Here's how your ${pattern.name} pattern shows up in your life—from your origin story to how it impacts every area today:
            </p>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin-bottom: 1rem;">Your Pattern Story</h3>
                ${story}
            </div>
            
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin-bottom: 1rem;">How It Shows Up Across All Life Areas</h3>
                ${lifeAreas}
            </div>
        `;
    }
    
    // Pattern Costs Merged - Costs + Urgency
    function getPatternCostsMerged(pattern, exactAge, relationshipStatus, firstName, patternDominance) {
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        const urgencyMessages = [
            `Every day you don't break this pattern, it gets stronger. Every day you wait, it costs you more—in relationships, opportunities, health, money, and your sense of self.`,
            `This ${pattern.name.toLowerCase()} pattern is running ${patternDominance}% of your life right now. The longer you wait, the harder it becomes to break.`
        ];
        
        return `
            <p class="content-text" style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">
                ${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern is costing you more than you realize. Here's what you're missing:
            </p>
            
            <div class="cost-item" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">💔 In Relationships:</h3>
                <p class="content-text">You're missing <strong>authentic connection</strong>. When you ${shadowBehavior}, you can't show up fully, which prevents deep intimacy.</p>
            </div>
            
            <div class="cost-item" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">💼 In Your Career:</h3>
                <p class="content-text">You're missing <strong>opportunities for growth</strong>. Your pattern prevents you from taking risks or showing up authentically at work.</p>
            </div>
            
            <div class="cost-item" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">🏃 In Your Health:</h3>
                <p class="content-text">You're missing <strong>sustainable health habits</strong>. Your pattern leads to ${shadowConsequence}, creating stress and burnout.</p>
            </div>
            
            <div class="cost-item" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">💰 In Your Finances:</h3>
                <p class="content-text">You're missing <strong>financial security</strong>. Your pattern prevents confident financial decisions and building wealth.</p>
            </div>
            
            <div class="cost-item" style="margin-bottom: 1.5rem;">
                <h3 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">🎭 In Your Identity:</h3>
                <p class="content-text">You're missing <strong>knowing who you really are</strong>. Your pattern has become so ingrained that you don't know yourself outside of it.</p>
            </div>
            
            <div style="margin-top: 2rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.05); border-radius: 6px;">
                <p style="font-size: 1.1rem; font-weight: 600; color: #ca0013; margin: 0 0 0.75rem 0;">The Cost of Waiting:</p>
                <p class="content-text" style="margin: 0;">
                    ${urgencyMessages[0]} The longer you wait, the harder it becomes to break.
                </p>
            </div>
        `;
    }
    
    // Psychological Complex Section - Condensed (Understanding Your Complex & Pattern)
    function getPsychologicalComplexSectionComprehensive(pattern, answers, quizData, firstName, patternDominance, sortedDrivers, driverPercentages, exactAge) {
        if (!pattern) {
            return '<p>Pattern data is missing.</p>';
        }
        const shadowParts = pattern.shadow ? pattern.shadow.split(' → ') : [];
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        const jump = PATTERN_JUMPSTART[pattern.name] || PATTERN_JUMPSTART['The ' + (pattern.name || '')] || {};
        const identityToGiveUp = jump.identityToGiveUp || 'I am the type of person who keeps repeating this pattern.';

        // Fallback when pattern.complex is missing
        if (!pattern.complex) {
            return `
                <p class="content-text" style="margin-bottom: 1rem;">${firstName ? firstName + ', ' : ''}Your <strong>${pattern.name}</strong> pattern is a recognized pattern, not a flaw. It runs on autopilot when you feel unsafe—and it can rewire with consistent new practice.</p>
                <p class="content-text" style="margin-bottom: 1rem;"><strong>The identity you're defending:</strong> "${identityToGiveUp}"</p>
                <p class="content-text" style="margin-bottom: 1rem;">What helps: use your interrupt when the pattern shows up, practice the identity you want, and get support or therapy if you want to go deeper.</p>
            `;
        }

        const complex = pattern.complex;
        const secondaryComplexExplanation = getSecondaryComplexExplanation(complex.primary, complex.secondary);
        const treatmentApproachesHTML = getTreatmentApproachesHTML((complex.treatmentApproaches || []).slice(0, 4));
        
        // Ensure we have driver data - create from pattern if not provided
        let sortedDriversArray = sortedDrivers;
        let driverPercentagesObj = driverPercentages || {};
        if (!sortedDriversArray || sortedDriversArray.length === 0) {
            // Try to get from window if available
            if (window.quizDriverPercentages) {
                driverPercentagesObj = window.quizDriverPercentages;
                sortedDriversArray = Object.entries(driverPercentagesObj)
                    .sort((a, b) => b[1] - a[1])
                    .map(([driver, percentage]) => [driver, percentage]);
            } else {
                // Fallback: create default
                sortedDriversArray = [['control', 25], ['avoidance', 25], ['validation', 25], ['fear-of-rejection', 25]];
                driverPercentagesObj = { control: 25, avoidance: 25, validation: 25, 'fear-of-rejection': 25 };
            }
        }
        
        return `
            <p class="content-text" style="margin-bottom: 1.25rem; font-weight: 500;">${firstName ? firstName + ', ' : ''}Your <strong>${pattern.name}</strong> pattern is your <strong>${complex.primary}</strong> in action—a recognized pattern, not a flaw. It's wired and runs on autopilot when you feel unsafe.</p>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">What It Means</h4>
                <p class="content-text" style="margin-bottom: 0; line-height: 1.7;">${complex.definition}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.75rem;">How It Developed</h4>
                ${buildComprehensiveHowItDeveloped(pattern, complex, sortedDriversArray, driverPercentagesObj, answers, quizData, firstName, exactAge, patternDominance)}
            </div>
            <p class="content-text" style="margin-bottom: 1rem;"><strong>The identity you're defending:</strong> "${identityToGiveUp}"</p>
            <p class="content-text" style="margin-bottom: 1.5rem; line-height: 1.7;">It runs on autopilot: when you feel unsafe, your brain and body default to ${shadowBehavior}. That pathway strengthened with repetition—and it can rewire with consistent new practice.</p>
            ${complex.secondary ? `<p class="content-text" style="margin-bottom: 1.5rem; line-height: 1.7;">You also show elements of <strong>${complex.secondary}</strong>: ${secondaryComplexExplanation.definition} ${secondaryComplexExplanation.howItWorksTogether}</p>` : ''}
            <p class="content-text" style="margin-bottom: 1.5rem; line-height: 1.7;">These ways of breaking free work because they build new neural pathways through consistent practice.</p>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="font-size: 1rem; font-weight: 600; color: #000; margin-bottom: 0.5rem;">What Helps You Break Free</h4>
                ${treatmentApproachesHTML}
            </div>
            <div style="padding: 1.25rem; background: rgba(76, 175, 80, 0.05); border-radius: 8px; border-left: 4px solid #4caf50;">
                <h4 style="font-size: 1rem; font-weight: 600; color: #4caf50; margin-bottom: 0.75rem;">How You'll Know You're Breaking Free</h4>
                <ul class="content-list" style="margin-bottom: 0;">
                    ${complex.recoveryIndicators.map(indicator => `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${indicator}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Build comprehensive "How It Developed" section with deep psychological insights
    function buildComprehensiveHowItDeveloped(pattern, complex, sortedDrivers, driverPercentages, answers, quizData, firstName, exactAge, patternDominance) {
        if (!pattern || !complex) {
            return '<p class="content-text" style="margin-bottom: 0; line-height: 1.7;">Your pattern developed as a survival strategy early in life.</p>';
        }

        const dominantDriver = sortedDrivers && sortedDrivers.length > 0 ? sortedDrivers[0][0] : 'control';
        const dominantPercent = driverPercentages && driverPercentages[dominantDriver] ? driverPercentages[dominantDriver] : 0;
        const secondaryDriver = sortedDrivers && sortedDrivers.length > 1 ? sortedDrivers[1][0] : null;
        const secondaryPercent = secondaryDriver && driverPercentages ? driverPercentages[secondaryDriver] : 0;

        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };

        // Get childhood and trauma answers if available
        const domains = (window.QUIZ_CONFIG && window.QUIZ_CONFIG.QUESTION_DOMAINS) || {};
        const childhoodDomain = domains.CHILDHOOD || { start: 30, end: 35 };
        const traumaDomain = domains.TRAUMA || { start: 36, end: 38 };
        const childhoodAnswers = answers && domains.CHILDHOOD ? 
            answers.slice(childhoodDomain.start, childhoodDomain.end + 1).filter(a => a !== undefined) : [];
        const traumaAnswers = answers && domains.TRAUMA ? 
            answers.slice(traumaDomain.start, traumaDomain.end + 1).filter(a => a !== undefined) : [];
        const hasTraumaData = traumaAnswers && traumaAnswers.length > 0;

        let developmentStory = '';

        // Opening: Personalized based on complex and pattern
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7; font-weight: 500;">${firstName ? firstName + ', ' : ''}Your <strong>${complex.primary}</strong>—which drives your ${pattern.name.toLowerCase()} pattern—didn't develop by accident. It formed as a <strong>protective mechanism</strong> during critical developmental periods when you needed to feel safe.</p>`;

        // Section 1: The Emotional Driver Foundation
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">Your pattern is primarily driven by <strong>${driverNames[dominantDriver]} (${dominantPercent}%)</strong>`;
        if (secondaryDriver && secondaryPercent >= 20) {
            developmentStory += `, with <strong>${driverNames[secondaryDriver]} (${secondaryPercent}%)</strong> as a secondary driver`;
        }
        developmentStory += `. These emotional drivers aren't random—they're <strong>learned responses</strong> that developed when you needed to navigate uncertainty, threat, or emotional overwhelm.</p>`;

        // Section 2: How the Complex Developed (personalized based on driver and trauma)
        // Get trauma-specific insights if available
        let traumaContext = '';
        if (hasTraumaData && quizData && traumaAnswers.length > 0) {
            const traumaQuestionIndex = traumaDomain.start;
            const firstTraumaAnswer = traumaAnswers[0];
            if (quizData[traumaQuestionIndex] && quizData[traumaQuestionIndex].options && quizData[traumaQuestionIndex].options[firstTraumaAnswer]) {
                const traumaOption = quizData[traumaQuestionIndex].options[firstTraumaAnswer];
                const traumaDriver = traumaOption.driver || dominantDriver;
                
                const traumaInsights = {
                    'control': `Based on your answers, you experienced significant challenges that required you to take care of others or be responsible beyond your years. This shaped your ${complex.primary.toLowerCase()}—you learned that being in control and solving problems was how you survived and felt safe.`,
                    'avoidance': `Based on your answers, you experienced significant challenges that taught you to escape or avoid difficult situations to protect yourself. This shaped your ${complex.primary.toLowerCase()}—you learned that staying free and avoiding pain was how you survived and felt safe.`,
                    'validation': `Based on your answers, you experienced significant challenges that taught you to earn love or approval through achievement or being helpful. This shaped your ${complex.primary.toLowerCase()}—you learned that proving your worth was how you survived and felt safe.`,
                    'fear-of-rejection': `Based on your answers, you experienced significant challenges involving abandonment, rejection, or learning you couldn't depend on others. This shaped your ${complex.primary.toLowerCase()}—you learned that protecting yourself from being hurt was how you survived and felt safe.`
                };
                traumaContext = traumaInsights[traumaDriver] || traumaInsights[dominantDriver];
            }
        }
        
        const driverDevelopmentInsights = {
            'control': {
                insight: traumaContext || `Your need for control likely developed when you learned that <strong>taking charge and solving problems</strong> was the safest way to navigate your world. Perhaps you were the "responsible one" who learned that fixing things earned you love, approval, or prevented conflict. Or maybe you learned that being in control meant you couldn't be hurt or disappointed.`,
                mechanism: `Every time you took control and it "worked" (you solved a problem, prevented conflict, or earned approval), your brain reinforced this pathway. Over time, your ${complex.primary.toLowerCase()} became wired as your default response—not because you chose it, but because it kept you safe when you needed it most.`
            },
            'avoidance': {
                insight: traumaContext || `Your tendency toward avoidance likely developed when you learned that <strong>staying free and flexible</strong> protected you from pain, disappointment, or being trapped. Perhaps you learned that feeling deeply was dangerous, or that staying mobile prevented you from getting hurt. You may have learned that avoiding difficult emotions or situations was safer than facing them.`,
                mechanism: `Every time you avoided something difficult and it "worked" (you didn't get hurt, you stayed free, or you prevented emotional overwhelm), your brain reinforced this pathway. Over time, your ${complex.primary.toLowerCase()} became wired as your default response—not because you're weak, but because avoidance kept you safe when you needed it most.`
            },
            'validation': {
                insight: traumaContext || `Your need for validation likely developed when you learned that <strong>achievement and recognition</strong> were the safest ways to feel worthy and secure. Perhaps you learned that your worth was tied to what you accomplished, how you performed, or how others saw you. You may have learned that being "good enough" required constant proof.`,
                mechanism: `Every time you achieved or received validation and it "worked" (you felt worthy, you earned approval, or you felt secure), your brain reinforced this pathway. Over time, your ${complex.primary.toLowerCase()} became wired as your default response—not because you're shallow, but because validation kept you safe when you needed it most.`
            },
            'fear-of-rejection': {
                insight: traumaContext || `Your fear of rejection likely developed when you learned that <strong>keeping distance and being perfect</strong> protected you from being hurt or abandoned. Perhaps you learned that being vulnerable was dangerous, or that perfection was the only way to be loved. You may have learned that staying small or perfect meant you couldn't be rejected.`,
                mechanism: `Every time you protected yourself from rejection and it "worked" (you didn't get hurt, you stayed safe, or you avoided abandonment), your brain reinforced this pathway. Over time, your ${complex.primary.toLowerCase()} became wired as your default response—not because you're unlovable, but because protection kept you safe when you needed it most.`
            }
        };

        const driverInsight = driverDevelopmentInsights[dominantDriver] || driverDevelopmentInsights['control'];
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">${driverInsight.insight}</p>`;
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">${driverInsight.mechanism}</p>`;

        // Section 3: The Pattern Connection
        const shadowBehaviorPhrase = getShadowBehaviorVerb(pattern.shadow);
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">This is how your <strong>${complex.primary}</strong> connects to your ${pattern.name.toLowerCase()} pattern: Your complex created a <strong>core belief</strong>—"${pattern.coreBelief || 'If I do this, I\'m safe'}"—and your pattern became the <strong>behavioral expression</strong> of that belief. Every time you ${shadowBehaviorPhrase}, you're unconsciously trying to satisfy that core belief and feel safe.</p>`;

        // Section 4: Why It Persists (neuroscience + psychology)
        if (exactAge) {
            developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">At ${exactAge}, this pattern has been running for ${exactAge >= 30 ? 'decades' : 'years'}. Research in neuroscience shows that <strong>repetition literally rewires your brain</strong>—the more you repeat a behavior, the stronger the neural pathway becomes. Your ${complex.primary.toLowerCase()} isn't just a habit; it's a <strong>deeply wired survival strategy</strong> that operates on autopilot.</p>`;
        } else {
            developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">Research in neuroscience shows that <strong>repetition literally rewires your brain</strong>—the more you repeat a behavior, the stronger the neural pathway becomes. Your ${complex.primary.toLowerCase()} isn't just a habit; it's a <strong>deeply wired survival strategy</strong> that operates on autopilot.</p>`;
        }

        // Section 5: The Hope (because it was learned, it can change)
        developmentStory += `<p class="content-text" style="margin-bottom: 0; line-height: 1.7; font-weight: 500; color: #ca0013;">Here's what matters most: <strong>Because this pattern was learned, it can be unlearned.</strong> Your brain has the capacity to rewire itself through new experiences and consistent practice. The same mechanism that created this pattern—repetition and reinforcement—can create new patterns that serve you better.</p>`;

        return developmentStory;
    }
    
    // Get neuroscience explanation for complex
    function getComplexNeuroscienceExplanation(complexName, patternName, shadowBehavior) {
        const neuroscienceData = {
            'Savior Complex': {
                explanation: `Your Savior Complex is wired into your brain through years of repetition. Every time you jump in to help or fix, your brain releases neurotransmitters (like dopamine) that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making helping your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "helping = safety." This pathway operates on autopilot—you don't need to think about helping, you just do it automatically.`
            },
            'Perfectionism Complex': {
                explanation: `Your Perfectionism Complex is wired into your brain through years of repetition. Every time you strive for perfection, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making perfectionism your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "perfect = safe." This pathway operates on autopilot—you don't need to think about perfecting, you just do it automatically.`
            },
            'Codependency Complex': {
                explanation: `Your Codependency Complex is wired into your brain through years of repetition. Every time you prioritize others' needs over your own, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making people-pleasing your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "pleasing = safe." This pathway operates on autopilot—you don't need to think about saying yes, you just do it automatically.`
            },
            'Achievement Complex': {
                explanation: `Your Achievement Complex is wired into your brain through years of repetition. Every time you perform or achieve, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making performance your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "achieving = worthy." This pathway operates on autopilot—you don't need to think about performing, you just do it automatically.`
            },
            'Avoidance Complex': {
                explanation: `Your Avoidance Complex is wired into your brain through years of repetition. Every time you escape or avoid difficult feelings, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making avoidance your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "avoiding = safe." This pathway operates on autopilot—you don't need to think about escaping, you just do it automatically.`
            },
            'Analysis Paralysis Complex': {
                explanation: `Your Analysis Paralysis Complex is wired into your brain through years of repetition. Every time you overthink or analyze, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making overthinking your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "thinking = safe." This pathway operates on autopilot—you don't need to think about analyzing, you just do it automatically.`
            },
            'Emotional Unavailability Complex': {
                explanation: `Your Emotional Unavailability Complex is wired into your brain through years of repetition. Every time you withdraw or protect yourself, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making withdrawal your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "distance = safe." This pathway operates on autopilot—you don't need to think about withdrawing, you just do it automatically.`
            },
            'Martyr Complex': {
                explanation: `Your Martyr Complex is wired into your brain through years of repetition. Every time you overgive or sacrifice, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making overgiving your brain's default response.`,
                pathway: `Your brain has literally shaped itself around the belief that "giving = safe." This pathway operates on autopilot—you don't need to think about giving, you just do it automatically.`
            }
        };
        
        const data = neuroscienceData[complexName] || {
            explanation: `Your ${complexName} is wired into your brain through years of repetition. Every time you ${shadowBehavior ? getShadowBehaviorVerb(shadowBehavior) : 'repeat this pattern'}, your brain releases neurotransmitters that reinforce this behavior. The more you do it, the stronger the neural pathway becomes—making this your brain's default response.`,
            pathway: `Your brain has literally shaped itself around this pattern. This pathway operates on autopilot—you don't need to think about it, you just do it automatically.`
        };
        
        return `
            <p class="content-text" style="margin-bottom: 0.75rem; line-height: 1.7;">
                ${data.explanation}
            </p>
            <p class="content-text" style="margin-bottom: 0; line-height: 1.7;">
                ${data.pathway}
            </p>
        `;
    }
    
    // Get nervous system explanation for complex
    function getComplexNervousSystemExplanation(complexName, patternName, shadowConsequence) {
        const nervousSystemData = {
            'Savior Complex': `When you feel unsafe or see someone struggling, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "help mode"—increased heart rate, tension, hypervigilance. This is your nervous system's way of preparing you to take action and solve problems. When this runs constantly, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.`,
            'Perfectionism Complex': `When you feel unsafe or face imperfection, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "perfect mode"—increased tension, anxiety, hypervigilance. This is your nervous system's way of preparing you to control outcomes. When this runs constantly, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.`,
            'Codependency Complex': `When you feel unsafe or sense others' unhappiness, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "please mode"—increased anxiety, people-pleasing responses, hypervigilance to others' needs. This is your nervous system's way of preparing you to earn approval. When this runs constantly, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.`,
            'Achievement Complex': `When you feel unsafe or need to prove worth, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "perform mode"—increased drive, tension, hypervigilance to achievement. This is your nervous system's way of preparing you to earn validation. When this runs constantly, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.`,
            'Avoidance Complex': `When you feel unsafe or face difficult emotions, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "freeze mode"—numbing, disconnection, shutting down. This is your nervous system's way of protecting you from overwhelm. When this runs constantly, your nervous system stays in a state of shutdown, leading to disconnection, numbness, and ${shadowConsequence}.`,
            'Analysis Paralysis Complex': `When you feel unsafe or need to make decisions, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "think mode"—increased mental activity, tension, hypervigilance to analysis. This is your nervous system's way of preparing you to understand everything before acting. When this runs constantly, your nervous system stays in a state of alert, leading to stress, paralysis, and ${shadowConsequence}.`,
            'Emotional Unavailability Complex': `When you feel unsafe or someone gets too close, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "protect mode"—withdrawal, emotional shutdown, distance. This is your nervous system's way of protecting you from rejection. When this runs constantly, your nervous system stays in a state of protection, leading to isolation, loneliness, and ${shadowConsequence}.`,
            'Martyr Complex': `When you feel unsafe or fear abandonment, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body goes into "give mode"—increased giving responses, tension, hypervigilance to others' needs. This is your nervous system's way of preparing you to prevent abandonment. When this runs constantly, your nervous system stays in a state of alert, leading to stress, exhaustion, and ${shadowConsequence}.`
        };
        
        return `
            <p class="content-text" style="margin-bottom: 0; line-height: 1.7;">
                ${nervousSystemData[complexName] || `When you feel unsafe, your ${complexName.toLowerCase()} activates your autonomic nervous system. Your body responds with stress responses—this is your nervous system's way of protecting you. When this runs constantly, your nervous system stays in a state of alert, leading to stress, burnout, and ${shadowConsequence}.`}
            </p>
        `;
    }
    
    // Get why treatments work explanation
    function getWhyTreatmentsWorkExplanation(complexName, patternName) {
        const treatmentScience = {
            'Savior Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice boundary-setting, you're literally rewiring your brain to respond differently. Instead of automatically jumping in to help, your brain learns: "I can observe without fixing." This creates a new pathway that becomes stronger with practice.`,
            'Perfectionism Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice self-compassion and allow imperfection, you're literally rewiring your brain to respond differently. Instead of automatically striving for perfection, your brain learns: "Good enough is enough." This creates a new pathway that becomes stronger with practice.`,
            'Codependency Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice saying "no" and setting boundaries, you're literally rewiring your brain to respond differently. Instead of automatically saying yes, your brain learns: "My needs matter too." This creates a new pathway that becomes stronger with practice.`,
            'Achievement Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice authenticity and rest, you're literally rewiring your brain to respond differently. Instead of automatically performing, your brain learns: "I'm valuable without achievement." This creates a new pathway that becomes stronger with practice.`,
            'Avoidance Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice feeling emotions and facing situations, you're literally rewiring your brain to respond differently. Instead of automatically escaping, your brain learns: "I can handle difficult feelings." This creates a new pathway that becomes stronger with practice.`,
            'Analysis Paralysis Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice taking action despite uncertainty, you're literally rewiring your brain to respond differently. Instead of automatically analyzing, your brain learns: "I can act without knowing everything." This creates a new pathway that becomes stronger with practice.`,
            'Emotional Unavailability Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice vulnerability and connection, you're literally rewiring your brain to respond differently. Instead of automatically withdrawing, your brain learns: "I can open up safely." This creates a new pathway that becomes stronger with practice.`,
            'Martyr Complex': `The treatment approaches work because they help you create NEW neural pathways. When you practice receiving and setting limits, you're literally rewiring your brain to respond differently. Instead of automatically overgiving, your brain learns: "I can give from abundance, not fear." This creates a new pathway that becomes stronger with practice.`
        };
        
        return `
            <div style="margin-bottom: 1rem;">
                <h4 style="font-size: 0.95rem; font-weight: 600; color: #000; margin-bottom: 0.75rem;">Why These Approaches Work:</h4>
                <p class="content-text" style="margin-bottom: 0; line-height: 1.7;">
                    ${treatmentScience[complexName] || `The treatment approaches work because they help you create NEW neural pathways. When you practice new behaviors, you're literally rewiring your brain to respond differently. This creates new pathways that become stronger with practice.`}
                </p>
            </div>
        `;
    }
    
    // Psychological Complex Section (Simplified - kept for backward compatibility)
    function getPsychologicalComplexSectionSimplified(pattern, answers, quizData, firstName) {
        return getPsychologicalComplexSectionComprehensive(pattern, answers, quizData, firstName, 0, null, null, null);
    }
    
    // Psychological Complex Section (Original - kept for reference but not used)
    function getPsychologicalComplexSection(pattern, answers, quizData, firstName) {
        return getPsychologicalComplexSectionComprehensive(pattern, answers, quizData, firstName, 0, null, null, null);
    }
    
    // Get secondary complex explanation and how it works with primary
    function getSecondaryComplexExplanation(primaryComplex, secondaryComplex) {
        const secondaryComplexDefinitions = {
            'Control Complex': {
                definition: 'A Control Complex develops when you believe that controlling everything around you will keep you safe. You learned that uncertainty was dangerous, so you try to manage outcomes, people, and situations to feel secure.',
                howItWorksTogether: 'Your Control Complex amplifies your Savior Complex. When you help others, you also try to control how they solve problems, what they do, and how they respond. This creates a double layer: you\'re not just helping—you\'re also ensuring the outcome meets your standards. Together, they create a pattern where you feel responsible for both helping and controlling the results.'
            },
            'Shame Complex': {
                definition: 'A Shame Complex develops when you believe you are fundamentally flawed or defective at your core. Unlike guilt (which is about what you did), shame is about who you are—you feel like there\'s something wrong with you that can\'t be fixed.',
                howItWorksTogether: primaryComplex === 'Perfectionism Complex' ? 'Your Shame Complex drives your Perfectionism Complex. You strive for perfection because you believe you\'re fundamentally flawed—if you can be perfect, maybe you can prove you\'re not broken. But perfection is impossible, so you\'re stuck in a cycle of trying to prove your worth while feeling like you\'ll never be good enough.' : 
                primaryComplex === 'Emotional Unavailability Complex' ? 'Your Shame Complex amplifies your Emotional Unavailability Complex. You withdraw because you believe if others see the real you, they\'ll see how fundamentally flawed you are. You keep distance to protect yourself from the shame of being truly known.' :
                'Your Shame Complex creates a core belief that you are fundamentally flawed, which amplifies your primary complex. This deep sense of defectiveness drives your pattern—you\'re trying to prove you\'re not broken, but shame tells you you always will be.'
            },
            'Abandonment Complex': {
                definition: 'An Abandonment Complex develops when you have a deep fear of being left, rejected, or abandoned by those you care about. This fear is so intense that it drives many of your relationship patterns and behaviors.',
                howItWorksTogether: primaryComplex === 'Martyr Complex' ? 'Your Abandonment Complex drives your Martyr Complex. You give endlessly because you believe that if you give enough, they won\'t leave you. The fear of abandonment is so intense that you\'ll sacrifice everything to prevent it—but this creates the very dynamic that makes you feel more abandoned.' :
                primaryComplex === 'Codependency Complex' ? 'Your Abandonment Complex amplifies your Codependency Complex. You lose yourself in relationships because you\'re terrified they\'ll leave if you\'re not exactly what they need. You shape yourself to fit their expectations, believing this will prevent abandonment—but it actually makes you more vulnerable to it.' :
                primaryComplex === 'Emotional Unavailability Complex' ? 'Your Abandonment Complex paradoxically drives your Emotional Unavailability Complex. You withdraw because you\'re so afraid of being abandoned that you leave first—you reject before you can be rejected. This protects you from the pain of abandonment, but it also prevents the deep connection you actually want.' :
                'Your Abandonment Complex creates an intense fear of being left, which amplifies your primary complex. This fear drives your pattern—you\'re constantly trying to prevent abandonment, but the fear itself often creates the very dynamic you\'re trying to avoid.'
            },
            'Emotional Numbing Complex': {
                definition: 'An Emotional Numbing Complex develops when you disconnect from difficult emotions to protect yourself. You learned that feeling deeply was overwhelming or unsafe, so you shut down emotionally as a survival strategy.',
                howItWorksTogether: 'Your Emotional Numbing Complex works alongside your Avoidance Complex. While Avoidance helps you escape situations, Emotional Numbing helps you escape feelings. Together, they create a pattern where you avoid both external triggers and internal emotions. You might avoid a difficult conversation (Avoidance) and then numb the anxiety that comes up (Emotional Numbing). This double protection keeps you disconnected from both the situation and yourself.'
            },
            'Intellectualization Complex': {
                definition: 'An Intellectualization Complex develops when you use thinking and analysis to avoid feeling emotions. You learned that understanding was safer than feeling, so you analyze situations instead of experiencing them emotionally.',
                howItWorksTogether: 'Your Intellectualization Complex amplifies your Analysis Paralysis Complex. While Analysis Paralysis keeps you stuck in endless thinking, Intellectualization keeps you stuck in your head instead of your heart. Together, they create a pattern where you think through everything but feel nothing. You might analyze a relationship problem for hours (Analysis Paralysis) while completely avoiding the fear or sadness underneath (Intellectualization).'
            },
            'People-Pleasing Complex': {
                definition: 'A People-Pleasing Complex develops when you prioritize others\' approval over your own needs. You learned that keeping others happy was the only way to feel safe, so you say yes, avoid conflict, and shape yourself to fit others\' expectations.',
                howItWorksTogether: 'Your People-Pleasing Complex amplifies your Codependency Complex. While Codependency makes you lose yourself in relationships, People-Pleasing makes you lose yourself in others\' expectations. Together, they create a pattern where you not only prioritize others\' needs but also their approval. You might stay in a relationship that drains you (Codependency) while constantly trying to be what they want (People-Pleasing).'
            },
            'Self-Sacrifice Complex': {
                definition: 'A Self-Sacrifice Complex develops when you believe that giving everything is the only way to earn love and prevent abandonment. You learned that your needs didn\'t matter, so you sacrifice yourself to keep others close.',
                howItWorksTogether: 'Your Self-Sacrifice Complex amplifies your Martyr Complex. While Martyr Complex makes you give endlessly, Self-Sacrifice makes you give at your own expense. Together, they create a pattern where you not only overgive but also neglect yourself completely. You might give your time, energy, and resources (Martyr) while ignoring your own health, needs, and boundaries (Self-Sacrifice).'
            },
            'Imposter Syndrome': {
                definition: 'Imposter Syndrome develops when you believe you\'re not as capable as others think you are. You fear being exposed as a fraud, so you work harder to prove yourself while feeling like you don\'t deserve success.',
                howItWorksTogether: 'Your Imposter Syndrome amplifies your Perfectionism Complex. While Perfectionism drives you to be flawless, Imposter Syndrome makes you believe you\'ll never be good enough. Together, they create a pattern where you strive for perfection (Perfectionism) while feeling like a fraud no matter how well you perform (Imposter Syndrome). This creates an exhausting cycle: you work harder to prove yourself, but you never feel worthy.'
            }
        };
        
        return secondaryComplexDefinitions[secondaryComplex] || {
            definition: `${secondaryComplex} works alongside your primary complex, creating additional layers to your pattern.`,
            howItWorksTogether: 'This secondary complex amplifies and reinforces your primary complex, making the pattern more entrenched and harder to break.'
        };
    }
    
    // Get treatment approaches in double column with more approachable wording
    function getTreatmentApproachesHTML(treatmentApproaches) {
        if (!treatmentApproaches || treatmentApproaches.length === 0) {
            return '<p class="content-text">Treatment approaches not available.</p>';
        }
        
        // Map clinical terms to more approachable, relatable language
        const approachableMapping = {
            'Boundary-setting therapy': 'Learning to say "no" and protect your energy',
            'Codependency recovery programs': 'Breaking free from losing yourself in relationships',
            'Self-compassion practices': 'Being kind to yourself instead of self-critical',
            'Learning to allow others to struggle': 'Stepping back and letting others solve their own problems',
            'Internal Family Systems (IFS) therapy': 'Understanding the different parts of yourself and healing them',
            'Somatic experiencing': 'Releasing stored stress and trauma from your body',
            'Cognitive Behavioral Therapy (CBT)': 'Changing thought patterns that keep you stuck',
            'Exposure therapy (allowing imperfection)': 'Practicing being imperfect and seeing you\'re still okay',
            'Mindfulness-based stress reduction': 'Staying present instead of getting lost in worry',
            'Acceptance and Commitment Therapy (ACT)': 'Accepting difficult feelings while taking action anyway',
            'Shame resilience work': 'Breaking free from shame and self-criticism',
            'Emotion regulation therapy': 'Learning to feel emotions without being overwhelmed',
            'Trauma-informed therapy': 'Healing from past wounds that created your pattern',
            'Dialectical Behavior Therapy (DBT)': 'Building skills to handle intense emotions',
            'Gradual exposure to emotions': 'Slowly allowing yourself to feel what you\'ve been avoiding',
            'Action-based therapy': 'Taking action despite fear and uncertainty',
            'Exposure therapy (acting despite uncertainty)': 'Doing things even when you don\'t have all the answers',
            'Assertiveness training': 'Speaking your truth and setting boundaries confidently',
            'Self-worth therapy': 'Building genuine self-worth that doesn\'t depend on others',
            'Reciprocity work': 'Learning to receive as much as you give',
            'Learning to receive': 'Allowing others to give to you without guilt'
        };
        
        // Convert to approachable language
        const approachableApproaches = treatmentApproaches.map(approach => {
            return approachableMapping[approach] || approach;
        });
        if (approachableApproaches.length <= 4) {
            return `<ul class="content-list" style="margin: 0;">${approachableApproaches.map(a => `<li style="margin-bottom: 0.5rem;">${a}</li>`).join('')}</ul>`;
        }
        const midPoint = Math.ceil(approachableApproaches.length / 2);
        const leftColumn = approachableApproaches.slice(0, midPoint);
        const rightColumn = approachableApproaches.slice(midPoint);
        return `
            <div class="treatment-approaches-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 0;">
                <ul class="content-list" style="margin: 0;">
                    ${leftColumn.map(approach => `<li style="margin-bottom: 0.5rem;">${approach}</li>`).join('')}
                </ul>
                <ul class="content-list" style="margin: 0;">
                    ${rightColumn.map(approach => `<li style="margin-bottom: 0.5rem;">${approach}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Get how complex shows up based on user answers
    function getHowComplexShowsUp(pattern, answers, quizData) {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return '<p class="content-text">Your answers reveal how this complex operates in your life.</p>';
        }
        
        const complex = pattern.complex || {};
        const primaryComplexName = complex.primary || pattern.name;
        
        // Get specific examples from key questions with more context and value
        const examples = [];
        
        // Get config for domain ranges
        const config = window.QUIZ_CONFIG || {};
        const domains = config.QUESTION_DOMAINS || {
            LOVE: { start: 0, end: 3 },
            MONEY: { start: 4, end: 7 },
            HEALTH: { start: 8, end: 13 }
        };
        
        // Check relationship answers (LOVE domain)
        if (domains.LOVE && answers[domains.LOVE.start] !== undefined && quizData[domains.LOVE.start]) {
            const answer = answers[domains.LOVE.start];
            const question = quizData[domains.LOVE.start];
            if (question.options && question.options[answer]) {
                const selectedOption = question.options[answer].text;
                const driver = question.options[answer].driver;
                const driverContext = getDriverContextForComplex(driver, primaryComplexName);
                examples.push({
                    area: 'In relationships',
                    answer: selectedOption,
                    insight: `This reveals how your ${primaryComplexName} operates when you feel emotionally unsafe. ${driverContext}`
                });
            }
        }
        
        // Check money answers (MONEY domain)
        if (domains.MONEY && answers[domains.MONEY.start] !== undefined && quizData[domains.MONEY.start]) {
            const answer = answers[domains.MONEY.start];
            const question = quizData[domains.MONEY.start];
            if (question.options && question.options[answer]) {
                const selectedOption = question.options[answer].text;
                const driver = question.options[answer].driver;
                const driverContext = getDriverContextForComplex(driver, primaryComplexName);
                examples.push({
                    area: 'With money and finances',
                    answer: selectedOption,
                    insight: `This shows how your ${primaryComplexName} influences your financial decisions and relationship with money. ${driverContext}`
                });
            }
        }
        
        // Check stress/health answers (HEALTH domain - look for stress-related question)
        const stressQuestionIndex = domains.HEALTH ? domains.HEALTH.start + 5 : 13; // Question about stress response
        if (answers[stressQuestionIndex] !== undefined && quizData[stressQuestionIndex]) {
            const answer = answers[stressQuestionIndex];
            const question = quizData[stressQuestionIndex];
            if (question.options && question.options[answer]) {
                const selectedOption = question.options[answer].text;
                const driver = question.options[answer].driver;
                const driverContext = getDriverContextForComplex(driver, primaryComplexName);
                examples.push({
                    area: 'When you\'re stressed or overwhelmed',
                    answer: selectedOption,
                    insight: `This demonstrates your ${primaryComplexName} in action during difficult moments. ${driverContext}`
                });
            }
        }
        
        // If no examples found, provide pattern-specific defaults
        if (examples.length === 0) {
            return getDefaultComplexExamples(pattern, primaryComplexName);
        }
        
        // Format examples with better structure and value
        return `
            <div style="margin-bottom: 0;">
                ${examples.map((ex, idx) => `
                    <div style="margin-bottom: ${idx < examples.length - 1 ? '1.25rem' : '0'}; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; border-left: 3px solid rgba(202, 0, 19, 0.3);">
                        <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">
                            ${ex.area}:
                        </p>
                        <p style="margin: 0 0 0.5rem 0; color: #333; font-style: italic;">
                            "${ex.answer}"
                        </p>
                        <p style="margin: 0; color: #555; font-size: 0.95rem;">
                            ${ex.insight}
                        </p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Get driver context for complex explanation
    function getDriverContextForComplex(driver, complexName) {
        const contextMap = {
            'control': `Your need for control drives this behavior—you're trying to manage the situation to feel safe.`,
            'avoidance': `Your tendency to avoid difficult feelings drives this response—you're protecting yourself by staying away from what feels overwhelming.`,
            'validation': `Your need for approval drives this behavior—you're seeking external validation to feel worthy.`,
            'fear-of-rejection': `Your fear of rejection drives this response—you're protecting yourself from potential abandonment or criticism.`
        };
        return contextMap[driver] || `This behavior is driven by your underlying emotional patterns.`;
    }
    
    // Get default complex examples if no answers available
    function getDefaultComplexExamples(pattern, complexName) {
        const defaults = {
            'Savior Complex': [
                'You jump in to fix others\' problems (even when they don\'t ask)',
                'You feel responsible for others\' emotions and outcomes',
                'You neglect your own needs to help others',
                'You feel resentful when help isn\'t appreciated or reciprocated'
            ],
            'Perfectionism Complex': [
                'You spend hours perfecting tasks that were already "good enough"',
                'You criticize yourself harshly for any mistake, no matter how small',
                'You delay completing projects because they\'re not perfect yet',
                'You feel anxious when things aren\'t exactly as you planned'
            ],
            'Avoidance Complex': [
                'You distract yourself when difficult emotions come up',
                'You avoid conflicts and difficult conversations',
                'You stay busy to avoid feeling deeply',
                'You flee situations that feel too intense or overwhelming'
            ],
            'Analysis Paralysis Complex': [
                'You overthink decisions for days or weeks without acting',
                'You research endlessly but struggle to make choices',
                'You analyze situations instead of experiencing them',
                'You feel paralyzed by too many options or possibilities'
            ],
            'Codependency Complex': [
                'You lose yourself in relationships, prioritizing others\' needs',
                'You struggle to say "no" even when you\'re overwhelmed',
                'You feel responsible for others\' happiness',
                'You shape yourself to fit others\' expectations'
            ],
            'Achievement Complex': [
                'You tie your worth to accomplishments and success',
                'You work excessively to prove your value',
                'You feel empty even after achieving goals',
                'You fear being seen as lazy or unproductive'
            ],
            'Emotional Unavailability Complex': [
                'You emotionally withdraw when relationships get too close',
                'You keep distance to protect yourself from getting hurt',
                'You struggle to express or receive deep emotions',
                'You pull away when intimacy feels too intense'
            ],
            'Martyr Complex': [
                'You give endlessly, hoping to earn love and prevent abandonment',
                'You sacrifice your own needs to keep others close',
                'You feel resentful when giving isn\'t reciprocated',
                'You believe you must give more to be valuable'
            ]
        };
        
        const examples = defaults[complexName] || defaults['Savior Complex'];
        
        return `
            <ul class="content-list" style="margin-bottom: 0;">
                ${examples.map(ex => `<li>${ex}</li>`).join('')}
            </ul>
        `;
    }
    
    // Daily Life Examples Section
    function getDailyLifeExamples(pattern, answers, quizData, firstName, exactAge, relationshipStatus, patternDominance) {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return '<p class="content-text">Daily life examples based on your pattern.</p>';
        }
        
        const quizDataArray = quizData || window.quizData || [];
        const examples = buildDailyLifeExamples(pattern, answers, quizDataArray, firstName, exactAge, relationshipStatus, patternDominance);
        
        return `
            <p class="content-text" style="font-size: 1.1rem; line-height: 1.7; color: #333; margin-bottom: 1.5rem;">
                ${firstName ? `${firstName}, ` : ''}Here are real scenarios showing how your ${pattern.name.toLowerCase()} pattern activates in daily life, based on your specific answers:
            </p>
            
            ${examples}
        `;
    }
    
    // Build daily life examples from user answers
    function buildDailyLifeExamples(pattern, answers, quizData, firstName, exactAge, relationshipStatus, patternDominance) {
        const examples = [];
        const patternName = pattern.name.toLowerCase();
        
        // Parenting examples (if applicable)
        if (exactAge && exactAge >= 25) {
            examples.push(getParentingExample(pattern, answers, quizData));
        }
        
        // Relationship examples
        examples.push(getRelationshipDailyExample(pattern, answers, quizData, relationshipStatus));
        
        // Career examples
        examples.push(getCareerDailyExample(pattern, answers, quizData));
        
        // Finance examples
        examples.push(getFinanceDailyExample(pattern, answers, quizData));
        
        // Health examples
        examples.push(getHealthDailyExample(pattern, answers, quizData));
        
        // Social examples
        examples.push(getSocialDailyExample(pattern, answers, quizData));
        
        // Decision-making examples
        examples.push(getDecisionMakingExample(pattern, answers, quizData));
        
        // Filter out empty examples and return
        const validExamples = examples.filter(ex => ex && ex.trim() !== '');
        
        return validExamples.map((example, index) => `
            <div style="margin-bottom: 1.5rem; padding: 1.25rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px;">
                ${example}
            </div>
        `).join('');
    }
    
    // Helper functions for daily examples
    function getParentingExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const patternExamples = {
            'Fixer': 'Your child has a problem at school. Instead of letting them figure it out, you immediately jump in to solve it—calling the teacher, fixing the situation. <strong>What to notice:</strong> You\'re overfunctioning. Your child needs to learn problem-solving, but your Savior Complex kicks in.',
            'Perfectionist': 'Your child brings home a B+ on a test. You focus on what they could have done better instead of celebrating their effort. <strong>What to notice:</strong> Your Perfectionism Complex is teaching them that "good enough" isn\'t enough.',
            'Pleaser': 'Your child wants to do an activity that exhausts you, but you say yes anyway because you can\'t say no. <strong>What to notice:</strong> Your Codependency Complex is preventing you from setting healthy boundaries with your child.',
            'Performer': 'You push your child to achieve—extra activities, perfect grades, constant improvement. <strong>What to notice:</strong> Your Achievement Complex is teaching them that worth comes from success.',
            'Escaper': 'When your child has big emotions, you distract them or change the subject instead of helping them feel. <strong>What to notice:</strong> Your Avoidance Complex is teaching them to avoid feelings.',
            'Overthinker': 'You analyze every parenting decision endlessly—school choice, activities, discipline—but struggle to act. <strong>What to notice:</strong> Your Analysis Paralysis Complex is preventing confident parenting.',
            'Withdrawer': 'When parenting gets hard, you emotionally withdraw and become distant. <strong>What to notice:</strong> Your Emotional Unavailability Complex is creating distance between you and your child.',
            'Overgiver': 'You give your child everything they want, even when it\'s not good for them, because you fear they\'ll reject you. <strong>What to notice:</strong> Your Martyr Complex is preventing healthy boundaries.'
        };
        
        return patternExamples[pattern.name] || '';
    }
    
    function getRelationshipDailyExample(pattern, answers, quizData, relationshipStatus) {
        if (!answers || answers.length === 0) return '';
        
        const relationshipExamples = {
            'Fixer': 'Your partner shares a work problem. Instead of listening, you immediately jump in with solutions and advice. <strong>What to notice:</strong> Your Savior Complex is preventing you from just being present. They needed empathy, not fixing.',
            'Perfectionist': 'You\'re planning a date and overthink every detail—the restaurant, the time, the conversation topics. <strong>What to notice:</strong> Your Perfectionism Complex is creating anxiety instead of connection.',
            'Pleaser': 'Your partner wants to do something you don\'t want to do, but you say yes anyway. <strong>What to notice:</strong> Your Codependency Complex is preventing you from speaking your truth.',
            'Performer': 'You dress perfectly, say the right things, show your best self—but your partner never sees the real you. <strong>What to notice:</strong> Your Achievement Complex is preventing authentic intimacy.',
            'Escaper': 'When your partner wants to have a difficult conversation, you suddenly "remember" something you need to do. <strong>What to notice:</strong> Your Avoidance Complex is preventing conflict resolution.',
            'Overthinker': 'You analyze every text, every interaction, trying to figure out what your partner "really" means. <strong>What to notice:</strong> Your Analysis Paralysis Complex is creating anxiety instead of connection.',
            'Withdrawer': 'When your partner gets too close, you pull away emotionally. <strong>What to notice:</strong> Your Emotional Unavailability Complex is creating distance.',
            'Overgiver': 'You give your partner everything—time, energy, gifts—hoping they\'ll see your worth and stay. <strong>What to notice:</strong> Your Martyr Complex is preventing balanced giving and receiving.'
        };
        
        return relationshipExamples[pattern.name] || '';
    }
    
    function getCareerDailyExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const careerExamples = {
            'Fixer': 'A coworker has a problem. You immediately jump in to help, even though it\'s not your responsibility. <strong>What to notice:</strong> Your Savior Complex is causing you to overfunction at work.',
            'Perfectionist': 'You spend hours perfecting a project that was already "good enough." <strong>What to notice:</strong> Your Perfectionism Complex is causing burnout and inefficiency.',
            'Pleaser': 'You say yes to every request at work, even when you\'re overwhelmed. <strong>What to notice:</strong> Your Codependency Complex is preventing you from setting boundaries.',
            'Performer': 'You work 60+ hours to prove your worth, but you\'re exhausted and empty. <strong>What to notice:</strong> Your Achievement Complex is tying your worth to work.',
            'Escaper': 'When work gets stressful, you avoid difficult conversations and stay busy with easier tasks. <strong>What to notice:</strong> Your Avoidance Complex is preventing you from addressing real issues.',
            'Overthinker': 'You analyze every decision at work endlessly, missing opportunities while thinking. <strong>What to notice:</strong> Your Analysis Paralysis Complex is preventing action.',
            'Withdrawer': 'You keep your distance from colleagues, avoiding connection at work. <strong>What to notice:</strong> Your Emotional Unavailability Complex is preventing professional relationships.',
            'Overgiver': 'You take on extra work, stay late, do favors—hoping to earn recognition and job security. <strong>What to notice:</strong> Your Martyr Complex is preventing work-life balance.'
        };
        
        return careerExamples[pattern.name] || '';
    }
    
    function getFinanceDailyExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const financeExamples = {
            'Fixer': 'You see someone struggling financially and immediately offer to help, even when you can\'t afford it. <strong>What to notice:</strong> Your Savior Complex is affecting your financial boundaries.',
            'Perfectionist': 'You overthink every financial decision, trying to make the "perfect" choice, and miss opportunities. <strong>What to notice:</strong> Your Perfectionism Complex is causing financial paralysis.',
            'Pleaser': 'You spend money on others to make them happy, even when it strains your budget. <strong>What to notice:</strong> Your Codependency Complex is affecting your financial decisions.',
            'Performer': 'You spend money to look successful—nice car, expensive clothes—to prove your worth. <strong>What to notice:</strong> Your Achievement Complex is driving financial decisions.',
            'Escaper': 'You avoid looking at your finances, hoping problems will resolve themselves. <strong>What to notice:</strong> Your Avoidance Complex is preventing financial responsibility.',
            'Overthinker': 'You research every investment endlessly but never actually invest. <strong>What to notice:</strong> Your Analysis Paralysis Complex is preventing financial growth.',
            'Withdrawer': 'You hoard money, afraid to spend or invest, keeping everything "safe." <strong>What to notice:</strong> Your Emotional Unavailability Complex is creating financial isolation.',
            'Overgiver': 'You give money to others freely, even when you need it yourself. <strong>What to notice:</strong> Your Martyr Complex is affecting your financial security.'
        };
        
        return financeExamples[pattern.name] || '';
    }
    
    function getHealthDailyExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const healthExamples = {
            'Fixer': 'You skip your own self-care to help others with their health problems. <strong>What to notice:</strong> Your Savior Complex is causing you to neglect your own health.',
            'Perfectionist': 'You create perfect workout and meal plans but burn out trying to follow them perfectly. <strong>What to notice:</strong> Your Perfectionism Complex is preventing sustainable health habits.',
            'Pleaser': 'You say yes to plans that exhaust you because you can\'t say no. <strong>What to notice:</strong> Your Codependency Complex is preventing rest and recovery.',
            'Performer': 'You push yourself to extreme workouts to prove your discipline, leading to injury. <strong>What to notice:</strong> Your Achievement Complex is causing health problems.',
            'Escaper': 'You stay busy to avoid feeling difficult emotions, leading to stress and burnout. <strong>What to notice:</strong> Your Avoidance Complex is affecting your physical health.',
            'Overthinker': 'You research every health trend but never commit to a routine. <strong>What to notice:</strong> Your Analysis Paralysis Complex is preventing consistent health habits.',
            'Withdrawer': 'You isolate yourself when you\'re struggling with health, not asking for help. <strong>What to notice:</strong> Your Emotional Unavailability Complex is preventing support.',
            'Overgiver': 'You give your energy to everyone else, leaving nothing for your own health. <strong>What to notice:</strong> Your Martyr Complex is causing self-neglect.'
        };
        
        return healthExamples[pattern.name] || '';
    }
    
    function getSocialDailyExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const socialExamples = {
            'Fixer': 'At social events, you immediately jump in to help with setup, cleanup, solving problems. <strong>What to notice:</strong> Your Savior Complex is preventing you from just enjoying social connection.',
            'Perfectionist': 'You overthink what to wear, what to say, how to act at social events. <strong>What to notice:</strong> Your Perfectionism Complex is creating social anxiety.',
            'Pleaser': 'You say yes to every social invitation, even when you\'re exhausted. <strong>What to notice:</strong> Your Codependency Complex is preventing you from honoring your needs.',
            'Performer': 'You perform at social events—telling impressive stories, showing your best self. <strong>What to notice:</strong> Your Achievement Complex is preventing authentic connection.',
            'Escaper': 'You avoid social events or leave early when things get too real or emotional. <strong>What to notice:</strong> Your Avoidance Complex is preventing deep friendships.',
            'Overthinker': 'You analyze every social interaction afterward, wondering what people "really" thought. <strong>What to notice:</strong> Your Analysis Paralysis Complex is creating social anxiety.',
            'Withdrawer': 'You keep your distance at social events, avoiding deep conversations. <strong>What to notice:</strong> Your Emotional Unavailability Complex is preventing connection.',
            'Overgiver': 'You host, pay, do everything for social events, hoping people will like you. <strong>What to notice:</strong> Your Martyr Complex is preventing balanced friendships.'
        };
        
        return socialExamples[pattern.name] || '';
    }
    
    function getDecisionMakingExample(pattern, answers, quizData) {
        if (!answers || answers.length === 0) return '';
        
        const decisionExamples = {
            'Fixer': 'You make decisions for others, thinking you know what\'s best for them. <strong>What to notice:</strong> Your Savior Complex is preventing others from making their own choices.',
            'Perfectionist': 'You overthink every decision, trying to make the "perfect" choice, and get stuck. <strong>What to notice:</strong> Your Perfectionism Complex is causing decision paralysis.',
            'Pleaser': 'You make decisions based on what others want, not what you want. <strong>What to notice:</strong> Your Codependency Complex is preventing you from knowing what you actually want.',
            'Performer': 'You make decisions based on how they\'ll look to others, not what\'s authentic. <strong>What to notice:</strong> Your Achievement Complex is driving decisions.',
            'Escaper': 'You avoid making decisions, hoping they\'ll resolve themselves. <strong>What to notice:</strong> Your Avoidance Complex is preventing you from taking action.',
            'Overthinker': 'You analyze every decision endlessly, researching and thinking, but never deciding. <strong>What to notice:</strong> Your Analysis Paralysis Complex is preventing action.',
            'Withdrawer': 'You make decisions alone, not asking for input or help. <strong>What to notice:</strong> Your Emotional Unavailability Complex is preventing collaboration.',
            'Overgiver': 'You make decisions that benefit others, even when it costs you. <strong>What to notice:</strong> Your Martyr Complex is preventing you from considering your own needs.'
        };
        
        return decisionExamples[pattern.name] || '';
    }
    
    // Journal UI block for "Your Pattern Reset Workbook" prompts (reused under each journalable li)
    function getJournalUI() {
        return '<div class="journal-ui"><button type="button" class="journal-trigger">Add your answer</button><div class="journal-preview" style="display:none;"><span class="journal-preview-label">Your answer: </span><span class="journal-preview-text"></span> <button type="button" class="journal-edit">Edit</button></div><div class="journal-entry" style="display:none;"><textarea rows="3" placeholder="Type your answer here..."></textarea><div class="journal-actions"><button type="button" class="journal-save">Save</button> <button type="button" class="journal-cancel">Cancel</button></div></div></div>';
    }

    // Pattern Reset Workbook: Before/After Transformation System
    // Core Philosophy: You don't have to wait for life to break you to change. You can choose your moment.
    function getMergedHowToBreakPattern(pattern, firstName, archetype) {
        if (!pattern || !pattern.name) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        const resetFocus = pattern.resetFocus || 'Breaking your pattern';
        const archName = (archetype && archetype.name) ? archetype.name : 'your archetype';
        let jump = PATTERN_JUMPSTART[pattern.name] || PATTERN_JUMPSTART['The ' + (pattern.name || '')];
        if (!jump) {
            const shPart = (pattern.shadow && pattern.shadow.split(' → ')[0]) ? pattern.shadow.split(' → ')[0].toLowerCase() : 'staying stuck';
            const rf = pattern.resetFocus ? pattern.resetFocus.toLowerCase() : 'breaks this pattern';
            jump = {
                whenIPattern: 'when I repeat my pattern', protectingBy: 'repeating my pattern',
                interrupt: 'What am I doing right now? Is it my pattern? What\'s one different choice?',
                enemyHint: 'I need to ___ to feel safe.',
                outsiderConcludes: 'What would someone who only watched your behavior conclude you want?',
                identityToGiveUp: 'I am the type of person who defaults to this pattern when stressed.',
                antiVisionCompressed: 'I refuse to let my life become defined by ' + shPart + '.',
                visionMVP: 'I\'m building toward being someone who ' + rf + '.',
                oneThingThisWeek: 'Choose one small action the person you\'re becoming would do—and do it.'
            };
        }
        const pName = pattern.name.toLowerCase();
        const identityLine = IDENTITY_PHRASES[pattern.resetFocus] || 'I am someone who breaks my pattern.';
        const complexOrDriver = (pattern.complex && pattern.complex.primary) ? ('your ' + pattern.complex.primary) : (ARCHETYPE_DRIVER_PHRASE && archName && ARCHETYPE_DRIVER_PHRASE[archName] ? ('your ' + ARCHETYPE_DRIVER_PHRASE[archName]) : ('your ' + archName));
        const challengesComplex = jump.challengesComplex || 'by focusing you on the shift that breaks the pattern.';
        const challengesLine = (pattern.complex && pattern.complex.primary)
            ? ('Focusing on ' + resetFocus.toLowerCase() + ' directly challenges your ' + pattern.complex.primary + ' ' + challengesComplex)
            : 'This shift is the one that most breaks the pattern.';
        const outsider = jump.outsiderConcludes || 'What would someone who only watched your behavior—not your words—conclude you actually want?';
        const whyInterruptHits = jump.whyInterruptHits || 'This question pulls you out of autopilot and into choice.';
        const whatHelpsHTML = (pattern.complex && pattern.complex.treatmentApproaches && pattern.complex.treatmentApproaches.length)
            ? getTreatmentApproachesHTML((pattern.complex.treatmentApproaches).slice(0, 4))
            : '<ul class="content-list" style="margin: 0 0 1rem;"><li>Use your interrupt when the pattern shows up.</li><li>Practice the identity you want.</li><li>Get support or therapy if you want to go deeper.</li></ul>';
        const breakingFreeHTML = (pattern.complex && pattern.complex.recoveryIndicators && pattern.complex.recoveryIndicators.length)
            ? pattern.complex.recoveryIndicators.map(i => '<li style="margin-bottom: 0.4rem;">' + i + '</li>').join('')
            : '<li>You notice yourself pausing before the old default.</li><li>You choose differently and feel less pulled by the pattern.</li><li>You feel more like the person you\'re becoming.</li>';

        return `
            <!-- Opening Philosophy: Before/After Moment -->
            <div style="margin-bottom: 2.5rem;">
                <h3 class="workbook-main-title">You Don't Have to Wait for Life to Break You to Change</h3>
                <p class="content-text" style="margin-bottom: 1rem; color: #000; font-weight: 500;">Most people only change when life forces them to—through trauma, loss, breakdown, or hitting rock bottom. We carry patterns that drive our lives, keeping us stuck in loops of trauma we haven't processed, problems that repeat, unhappiness that feels unshakeable, and lack of progress in all areas of life.</p>
                <p class="content-text" style="margin-bottom: 1rem;">It feels hopeless because we don't know how to address it or where to start. It feels impossible because the pattern is invisible—we can't fix what we can't see.</p>
                <p class="content-text" style="margin-bottom: 1rem; color: #000; font-weight: 600;">But you don't have to wait for a breakdown to have a breakthrough.</p>
                <p class="content-text" style="margin-bottom: 0; color: #000;">The Pattern Quiz and pattern recognition provide the solution: <strong>awareness</strong> of what's been running your life, <strong>understanding</strong> of why it developed, and the power to <strong>consciously choose</strong> to change—before life forces it. Through awareness + decision + daily repetition, you can transform your life.</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 class="workbook-section-title">Your Pattern Reset Workbook</h3>
                <p class="content-text" style="margin-bottom: 0.75rem;">This workbook is about <strong>choosing your moment</strong>—the line between your "before" and your "after." By answering these questions, you're not fixing your life. You're creating awareness. And awareness is the moment everything shifts.</p>
                <p class="content-text" style="margin-bottom: 0.75rem; color: #ca0013; font-weight: 600;">This is where your after begins.</p>
                <p class="content-text" style="margin-bottom: 0; color: #555; font-style: italic;">Work through each section. Your answers are saved automatically. You can complete this in one focused session, or return anytime to continue your transformation.</p>
            </div>

            <div class="reset-focus-box" style="margin-bottom: 2rem;">
                <h4 class="workbook-focus-title">🎯 Your Primary Shift</h4>
                <p class="workbook-focus-text">${resetFocus}</p>
                <p class="content-text" style="margin: 0; color: #555;">${challengesLine}</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 class="workbook-step-title">✨ How This Works: The Science Behind Transformation</h4>
                <p class="content-text" style="margin-bottom: 0.75rem;">This workbook is grounded in three core principles:</p>
                <ul class="content-list" style="margin: 0.5rem 0 0 1.5rem; line-height: 1.8;">
                    <li><strong>Clarity Creates Focus</strong> — When you know exactly what you want and what's not working, your brain finds the path. Clarity is the starting point of all transformation.</li>
                    <li><strong>Your Brain Rewires Through Repetition</strong> — Every time you choose differently, you weaken the old neural pathway and strengthen a new one. Your brain literally reshapes itself through consistent practice.</li>
                    <li><strong>Identity Drives Behavior</strong> — Change who you believe you are, and your actions follow. When you shift your identity, you shift your entire life.</li>
                </ul>
                <p class="content-text" style="margin: 1rem 0 0; color: #555; font-style: italic;">Neuroscience research shows it takes 21–66 days of consistent practice to rewire neural pathways. This workbook creates the moment of transformation—then gives you the structure to reinforce it through daily repetition.</p>
            </div>
            <!-- THE DECISION: Choosing Your Moment -->
            <div style="margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #ca0013 0%, #a00010 100%); color: #fff; border-radius: 50%; font-weight: 700; font-size: 1.1rem; flex-shrink: 0;" class="workbook-phase-number">0</span>
                    <div>
                        <h4 class="workbook-subsection-title">The Decision: Choosing Your Moment</h4>
                        <p class="workbook-subsection-subtitle">Nothing changes until you choose to change. Patterns change when choices repeat.</p>
                    </div>
                </div>
                <p class="content-text" style="margin-bottom: 1rem; color: #555; padding-left: 3.25rem;">Most people wait for life to force a moment. You're choosing yours right now. By completing this workbook, you're making a decision: <strong>I choose awareness over autopilot. I choose change over staying stuck. I choose my "after" over my "before."</strong></p>
                <p class="content-text" style="margin-bottom: 1rem; color: #ca0013; font-weight: 600; padding-left: 3.25rem;">This decision is the line between who you were and who you're choosing to become.</p>
                <ul class="content-list" style="margin: 0; padding-left: 3.25rem;">
                    <li data-journal-id="p0-intention" style="margin-bottom: 1rem;"><strong>What's Your "After"?</strong> In one sentence, what do you want to create by breaking this pattern? What becomes possible when you choose differently? (Example: "I want to feel free from the need to fix everything, so I can focus on my own growth and have deeper, more equal relationships.") ${getJournalUI()}</li>
                    <li data-journal-id="p0-why" style="margin-bottom: 1rem;"><strong>Why This Matters Now:</strong> What will breaking this pattern unlock in your life? What has staying stuck cost you? What becomes possible when you choose your moment? ${getJournalUI()}</li>
                    <li data-journal-id="p0-commitment" style="margin-bottom: 0;"><strong>Your Commitment:</strong> How will you show up for this transformation? (Example: "I commit to using my interrupt daily and choosing differently when my pattern shows up.") ${getJournalUI()}</li>
                </ul>
            </div>

            <!-- PHASE 1: Your "Before" - Awareness & Pattern Recognition -->
            <div style="margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color: #fff; border-radius: 50%; font-weight: 700; font-size: 1.1rem; flex-shrink: 0;" class="workbook-phase-number">1</span>
                    <div>
                        <h4 class="workbook-subsection-title">Your "Before": Seeing What's Been Running Your Life</h4>
                        <p class="workbook-subsection-subtitle">Awareness is the moment everything shifts. You can't fix what you can't see.</p>
                    </div>
                </div>
                <p class="content-text" style="margin-bottom: 1rem; color: #555; padding-left: 3.25rem;"><strong>Why this works:</strong> You can't change what you don't see. Naming the pattern, its hidden goal, and the limiting belief ("the enemy") reduces its power. Neuroscience research shows that awareness alone weakens automatic responses. This is where your transformation begins—by seeing what's been invisible.</p>
                <p class="content-text" style="margin-bottom: 1.25rem; color: #888; padding-left: 3.25rem; font-style: italic;">💡 <strong>Tip:</strong> You don't need to answer every prompt. Choose 2–3 from each section. Quality over quantity.</p>
                
                <div style="margin-bottom: 1.5rem; padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">Step 1: Name What's Driving It</p>
                    <ul class="content-list" style="margin: 0 0 1.5rem 0;">
                        <li data-journal-id="p1-goal" style="margin-bottom: 1rem;"><strong>Name the hidden goal.</strong> When I ${jump.whenIPattern}, what do I think I'm achieving? What am I really trying to get? ${outsider} ${getJournalUI()}</li>
                        <li data-journal-id="p1-protecting" style="margin-bottom: 1rem;"><strong>What am I protecting?</strong> What am I protecting by ${jump.protectingBy}? What is that protection costing me? ${getJournalUI()}</li>
                        <li data-journal-id="p1-enemy" style="margin-bottom: 0;"><strong>Name the enemy (limiting belief).</strong> The internal pattern or belief: ________. (Not circumstances. Not other people.) Start with: "${jump.enemyHint}" ${getJournalUI()}</li>
                    </ul>
                </div>

                <div style="margin-bottom: 1.5rem; padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">Step 2: Feel the Cost of Your "Before"</p>
                    <p class="content-text" style="margin-bottom: 0.75rem; color: #666;">You need to feel what you're avoiding more than you fear it. This creates the emotional charge to change. What has staying stuck cost you? What will it cost if nothing changes?</p>
                    <ul class="content-list" style="margin: 0 0 1.5rem 0;">
                        <li data-journal-id="p1-avi-1" style="margin-bottom: 1rem;">If nothing changes in 5 years, describe an average Tuesday. What did never breaking this pattern cost? ${getJournalUI()}</li>
                        <li data-journal-id="p1-avi-2" style="margin-bottom: 1rem;">Who is 5–10 years ahead on the same ${pName} path? What do you feel becoming them? ${getJournalUI()}</li>
                        <li data-journal-id="p1-avi-3" style="margin-bottom: 1rem;"><strong>Identity to give up:</strong> "${jump.identityToGiveUp}" What would it cost you socially to no longer be that person? ${getJournalUI()}</li>
                        <li data-journal-id="p1-avi-4" style="margin-bottom: 0;">What's the reason you're most reluctant to admit? What fear or belief has held you back? ${getJournalUI()}</li>
                    </ul>
                </div>

                <div style="padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">Step 3: Create Your "After" - Your Vision</p>
                    <p class="content-text" style="margin-bottom: 0.75rem; color: #666;">Your brain doesn't know the difference between imagination and reality. Vividly imagining your future self—your "after"—rewires your brain. When you know what you want and what's not working, the path becomes clear.</p>
                    <ul class="content-list" style="margin: 0;">
                        <li data-journal-id="p1-vision-1" style="margin-bottom: 1rem;"><strong>Your 3-Year Vision:</strong> Snap your fingers: 3 years from now, what you actually want. Average Tuesday, same detail. Be specific—what does your day look like? ${getJournalUI()}</li>
                        <li data-journal-id="p1-vision-2" style="margin-bottom: 1rem;"><strong>Your New Identity:</strong> What would you have to believe about yourself? Example: "${identityLine}" — write your version. ${getJournalUI()}</li>
                        <li data-journal-id="p1-vision-3" style="margin-bottom: 0;"><strong>One Thing This Week:</strong> One thing you'd do this week if you were already that person: ${jump.oneThingThisWeek} ${getJournalUI()}</li>
                    </ul>
                </div>
            </div>
            <!-- PHASE 2: Drawing the Line - Interrupt & Choose Differently -->
            <div style="margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: #fff; border-radius: 50%; font-weight: 700; font-size: 1.1rem; flex-shrink: 0;" class="workbook-phase-number">2</span>
                    <div>
                        <h4 class="workbook-subsection-title">Drawing the Line: Interrupt &amp; Choose Differently</h4>
                        <p class="workbook-subsection-subtitle">Identity drives behavior. Act like the person you're becoming. Choose differently—every day.</p>
                    </div>
                </div>
                <p class="content-text" style="margin-bottom: 1rem; color: #555; padding-left: 3.25rem;"><strong>Why this works:</strong> Every time you interrupt the pattern and choose differently, you weaken the old neural pathway and strengthen a new one. This is how you draw the line between your "before" and your "after." Repetition rewires your brain. Patterns change when choices repeat.</p>
                
                <div style="margin-bottom: 1.5rem; padding-left: 3.25rem;">
                    <p class="content-text" style="margin-bottom: 0.5rem; font-weight: 600; color: #000;"><strong>Your Pattern Interrupt:</strong></p>
                    <p class="workbook-interrupt-text">"${jump.interrupt}"</p>
                    <p class="content-text" style="margin: 0; color: #555;">${whyInterruptHits}</p>
                </div>

                <div style="padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">How to Use This Daily:</p>
                    <ol class="content-list" style="margin: 0 0 1rem 0; padding-left: 1.5rem;">
                        <li style="margin-bottom: 0.75rem;"><strong>Set 2–3 phone reminders</strong> (e.g., 10am, 2pm, 6pm). When the reminder hits:</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Pause and ask your interrupt:</strong> "${jump.interrupt}"</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Notice what you're doing:</strong> Is it your pattern? What are you avoiding?</li>
                        <li style="margin-bottom: 0;"><strong>Choose one different small action:</strong> What would the person you're becoming do instead?</li>
                    </ol>
                    <p class="content-text" style="margin: 0; color: #888; font-style: italic;">💡 <strong>No need to write during the day.</strong> Just pause, reflect, and choose differently. Capture insights in your Evening practice below.</p>
                </div>
            </div>

            <!-- PHASE 3: Your "After" Begins - Daily Practice & Reinforcement -->
            <div style="margin-bottom: 2.5rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                    <span style="display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); color: #fff; border-radius: 50%; font-weight: 700; font-size: 1.1rem; flex-shrink: 0;" class="workbook-phase-number">3</span>
                    <div>
                        <h4 class="workbook-subsection-title">Your "After" Begins: Daily Practice &amp; Reinforcement</h4>
                        <p class="workbook-subsection-subtitle">Persistence is what transforms the moment into lasting change.</p>
                    </div>
                </div>
                <p class="content-text" style="margin-bottom: 1rem; color: #555; padding-left: 3.25rem;"><strong>Why this works:</strong> The workbook creates the moment of transformation. Daily practice deepens it. Evening reflection consolidates learning and primes your subconscious for tomorrow. Goals as "lenses" (not finish lines) keep you focused on who you're becoming, not just what you're achieving. This is how your "after" becomes your reality.</p>
                
                <div style="margin-bottom: 1.5rem; padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">Evening Reflection (5–10 min):</p>
                    <ul class="content-list" style="margin: 0 0 1.5rem 0;">
                        <li data-journal-id="p3-1" style="margin-bottom: 1rem;">What feels most true about why you've been stuck? ${getJournalUI()}</li>
                        <li data-journal-id="p3-2" style="margin-bottom: 1rem;"><strong>Actual enemy (limiting belief):</strong> Name the internal pattern or belief. Not circumstances. Not other people. Start with: "${jump.enemyHint}" ${getJournalUI()}</li>
                        <li data-journal-id="p3-3" style="margin-bottom: 1rem;">One sentence: what you refuse to let your life become. (e.g. "${jump.antiVisionCompressed}") ${getJournalUI()}</li>
                        <li data-journal-id="p3-4" style="margin-bottom: 1rem;">One sentence: what you're building toward. (e.g. "${jump.visionMVP}") ${getJournalUI()}</li>
                        <li data-journal-id="p3-5" style="margin-bottom: 0;">One moment today when your pattern showed up—or where it usually does—what you were protecting, and what you chose (or would want to choose). ${getJournalUI()}</li>
                    </ul>
                </div>

                <div style="padding-left: 3.25rem;">
                    <p class="workbook-step-title" style="margin-bottom: 0.75rem;">Goals as Lenses:</p>
                    <p class="content-text" style="margin-bottom: 0.75rem; color: #666;">Goals aren't finish lines—they're lenses that change how you see and act. When you know where you're going (your "after"), your brain finds the path. Clarity creates focus, and focus creates results.</p>
                    <ul class="content-list" style="margin: 0;">
                        <li data-journal-id="p3-g-1yr" style="margin-bottom: 1rem;"><strong>1 Year Lens:</strong> One concrete thing that would have to be true for you to know you've broken the ${pName} pattern. ${getJournalUI()}</li>
                        <li data-journal-id="p3-g-1mo" style="margin-bottom: 1rem;"><strong>1 Month Lens:</strong> What would have to be true in one month for that 1-year to stay possible? ${getJournalUI()}</li>
                        <li data-journal-id="p3-g-daily" style="margin-bottom: 0;"><strong>Daily Actions:</strong> What 2–3 actions will you timeblock tomorrow that the person you're becoming would do? (Tomorrow: also use your interrupt when the pattern shows up and choose one different small action.) ${getJournalUI()}</li>
                    </ul>
                </div>
            </div>
            <!-- Additional Support & Resources -->
            <div style="margin-bottom: 2rem;">
                <h4 class="workbook-step-title">What Helps You Break Free</h4>
                ${whatHelpsHTML}
            </div>

            <!-- Progress Indicators -->
            <div style="margin-bottom: 2rem;">
                <h4 class="workbook-step-title" style="color: #4caf50;">How You'll Know You're Breaking Free</h4>
                <ul class="content-list" style="margin: 0 0 1rem 0;">${breakingFreeHTML}</ul>
                <p class="content-text" style="margin: 0; color: #555; font-style: italic;">Slip-ups are part of the process. The goal is practice, not perfection. Every time you choose differently, you're rewiring your brain.</p>
            </div>

            <!-- Closing: Your After Begins -->
            <div style="margin-bottom: 1rem;">
                <h4 class="workbook-step-title" style="font-weight: 700; margin-bottom: 0.75rem;">Your "After" Begins Now</h4>
                <p class="content-text" style="margin-bottom: 0.75rem; color: #ca0013; font-weight: 600;">You've chosen your moment. You've drawn the line between your "before" and your "after."</p>
                <p class="content-text" style="margin-bottom: 0.75rem;">This workbook is your blueprint. Use it daily. Return to it when you need clarity. Your answers are saved automatically—you can always come back and refine your vision, update your goals, or reflect on your progress.</p>
                <p class="content-text" style="margin-bottom: 0.75rem; color: #555;"><strong>Remember:</strong> Transformation isn't linear. Some days you'll feel unstoppable. Other days you'll slip back into the old pattern. That's normal. What matters is that you keep showing up—that's how you reinforce your "after."</p>
                <p class="content-text" style="margin: 0; color: #555; font-weight: 600;">Every practice session rewires your brain. Every choice strengthens the new pathway. Every day you choose differently, you're becoming the person you're meant to be.</p>
                <p class="content-text" style="margin-top: 1rem; color: #000; font-weight: 600;">You don't need a breakdown to have a breakthrough. You chose your moment. Your transformation begins now.</p>
            </div>
        `;
    }
    
    // Solution Merged - Neuroscience + 22-Day Reset (legacy, kept for reference)
    function getSolutionMerged(pattern, nextResetDate, firstName, exactAge, relationshipStatus, patternDominance) {
        if (!pattern || !pattern.name || !pattern.shadow) {
            return '<p>Error: Pattern data incomplete.</p>';
        }
        
        const shadowParts = pattern.shadow ? pattern.shadow.split(' → ') : [];
        const shadowBehavior = shadowParts[0] ? shadowParts[0].toLowerCase() : 'your pattern behavior';
        
        return `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin-bottom: 1rem;">The Science Behind Breaking Patterns</h3>
                <p class="content-text" style="margin-bottom: 1rem;">
                    Research shows that <strong>knowing your pattern doesn't break it</strong>. Your pattern operates on autopilot—it's wired into your brain through years of repetition. 
                    To change, you need to create NEW neural pathways through consistent practice.
                </p>
                <p class="content-text" style="margin-bottom: 1rem;">
                    Neuroscience shows it takes <strong>21-66 days of consistent practice</strong> to rewire your brain. We use 22 days as the minimum effective dose—long enough to create real change, short enough to stay consistent.
                </p>
                <p class="content-text" style="font-style: italic; color: #666; font-size: 0.9rem; margin: 0;">
                    Sources: Doidge (2007), Lally et al. (2009) - Neuroplasticity and habit formation research
                </p>
            </div>
            
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <h3 style="font-size: 1.1rem; font-weight: 600; color: #000; margin-bottom: 1rem;">The 22-Day Pattern Reset</h3>
                <p class="content-text" style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 1rem;">
                    ${firstName ? `${firstName}, ` : ''}You know your pattern. You understand why you're stuck. Now you need a <strong>system to actually break it</strong>.
                </p>
                
                <p class="content-text" style="margin-bottom: 1rem;">
                    The 22-Day Pattern Reset gives you:
                </p>
                <ul class="content-list" style="margin-bottom: 1.5rem;">
                    <li><strong>Daily practice</strong> - Consistent actions to rewire your brain</li>
                    <li><strong>Pattern-specific guidance</strong> - Tailored to your ${pattern.name} pattern</li>
                    <li><strong>Community support</strong> - Accountability and understanding</li>
                    <li><strong>Science-backed system</strong> - Based on neuroscience and behavioral research</li>
                </ul>
                
                <p class="content-text" style="margin-top: 1.5rem; font-weight: 600; color: #ca0013;">
                    Every day you wait, your pattern gets stronger. You need a system, not just willpower.
                </p>
            </div>
        `;
    }
    
    // What This Means & Why You Got This - Merged Seamlessly
    function getWhatThisMeansAndWhyMerged(archetype, pattern, patternDominance, dominantDriver, dominantPercent, answers, quizData, sortedDrivers, driverPercentages, firstName) {
        // Simple explanation of what the pattern means
        const simpleExplanations = {
            'Fixer': `When you feel stressed or uncertain, you default to fixing problems—even when they're not yours to fix.`,
            'Perfectionist': `When you feel stressed or uncertain, you default to analyzing every detail and trying to make the perfect choice.`,
            'Pleaser': `When you feel stressed or uncertain, you default to saying yes and putting others first—even when you're exhausted.`,
            'Performer': `When you feel stressed or uncertain, you default to working hard to impress and earn approval.`,
            'Escaper': `When you feel stressed or uncertain, you default to staying busy and avoiding difficult feelings.`,
            'Overthinker': `When you feel stressed or uncertain, you default to analyzing everything before acting—often getting stuck in your head.`,
            'Withdrawer': `When you feel stressed or uncertain, you default to pulling away and protecting yourself from getting hurt.`,
            'Overgiver': `When you feel stressed or uncertain, you default to giving more than you receive, hoping they'll see your worth.`
        };
        
        const patternExplanation = simpleExplanations[pattern.name] || `Your ${pattern.name.toLowerCase()} pattern shows up when you feel stressed or uncertain.`;
        
        // Get answer examples that show why they got this
        let answerExamples = [];
        if (answers && Array.isArray(answers) && answers.length > 0 && quizData) {
            const domains = [
                { index: 0, name: 'Love' },
                { index: 4, name: 'Money' },
                { index: 8, name: 'Health' },
                { index: 14, name: 'Lifestyle' },
                { index: 20, name: 'Productivity' }
            ];
            
            domains.forEach(domain => {
                if (answers[domain.index] !== undefined && quizData[domain.index] && quizData[domain.index].options && quizData[domain.index].options[answers[domain.index]]) {
                    const option = quizData[domain.index].options[answers[domain.index]];
                    if (option.driver === dominantDriver) {
                        const questionText = quizData[domain.index].question || `${domain.name} question`;
                        const shortQuestion = questionText.length > 50 ? questionText.substring(0, 50) + '...' : questionText;
                        const answerText = option.text.length > 60 ? option.text.substring(0, 60) + '...' : option.text;
                        answerExamples.push({
                            question: shortQuestion,
                            answer: answerText
                        });
                    }
                }
            });
            
            // If no matching answers, get any answers that show the pattern
            if (answerExamples.length === 0) {
                domains.slice(0, 3).forEach(domain => {
                    if (answers[domain.index] !== undefined && quizData[domain.index] && quizData[domain.index].options && quizData[domain.index].options[answers[domain.index]]) {
                        const option = quizData[domain.index].options[answers[domain.index]];
                        const questionText = quizData[domain.index].question || `${domain.name} question`;
                        const shortQuestion = questionText.length > 50 ? questionText.substring(0, 50) + '...' : questionText;
                        const answerText = option.text.length > 60 ? option.text.substring(0, 60) + '...' : option.text;
                        answerExamples.push({
                            question: shortQuestion,
                            answer: answerText
                        });
                    }
                });
            }
        }
        
        // Format examples if we have them
        let examplesHTML = '';
        if (answerExamples.length > 0) {
            examplesHTML = `
                <p class="hero-section-text" style="margin-top: 1rem; font-weight: 500;">
                    Your answers revealed this pattern. For example:
                </p>
                <ul class="answer-examples-list" style="margin-top: 0.75rem; padding-left: 1.5rem; margin-bottom: 0;">
                    ${answerExamples.slice(0, 2).map(ex => `<li style="margin-bottom: 0.5rem; line-height: 1.6; color: #333;"><strong>${ex.question}</strong> "${ex.answer}"</li>`).join('')}
                </ul>
            `;
        }
        
        return `
            <div class="hero-what-this-means-why" style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.02); border-radius: 8px; border-left: 3px solid #ca0013;">
                <h3 class="hero-section-title">What This Means & Why You Got This:</h3>
                <p class="hero-section-text" style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 0.75rem;">
                    ${patternExplanation} This is your dominant pattern, and it influences <strong>${patternDominance}% of your daily decisions</strong> across all areas of your life.
                </p>
                <p class="hero-section-text" style="font-size: 1.05rem; line-height: 1.6; color: #666;">
                    Your answers revealed that you respond to stress through <strong>${dominantDriver} (${dominantPercent}%)</strong>, which makes you <strong>${archetype.name}</strong> and specifically <strong>${pattern.name}</strong>.
                </p>
                ${examplesHTML}
                <p class="hero-section-text" style="margin-top: 1rem; font-style: italic; color: #666; font-size: 0.95rem;">
                    These responses aren't random—they reveal a consistent pattern of how you seek safety when you feel uncertain or stressed.
                </p>
            </div>
        `;
    }
    
    // Your First Step - Actionable Micro-Action
    function getYourFirstStep(pattern, firstName) {
        const firstSteps = {
            'Fixer': `Today: Notice when you jump in to fix something that's not yours to fix. Just observe—don't judge. Awareness is the first step.`,
            'Perfectionist': `Today: Notice when you're overthinking a decision. Ask yourself: "What's the good enough choice?" Just notice—don't force change yet.`,
            'Pleaser': `Today: Notice when you say yes to something you don't want. Just notice the moment—awareness is the first step.`,
            'Performer': `Today: Notice when you're working to impress someone. Just observe—awareness is the first step.`,
            'Escaper': `Today: Notice when you're staying busy to avoid feeling something. Just pause and notice—awareness is the first step.`,
            'Overthinker': `Today: Notice when you're analyzing instead of acting. Just observe the moment—awareness is the first step.`,
            'Withdrawer': `Today: Notice when you pull away from someone getting close. Just observe—awareness is the first step.`,
            'Overgiver': `Today: Notice when you give more than you receive. Just observe the moment—awareness is the first step.`
        };
        
        return `
            <div class="hero-first-step" style="margin-top: 1.5rem; padding: 1.5rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 4px solid #4caf50;">
                <h3 class="hero-section-title" style="color: #4caf50; margin-bottom: 0.75rem;">🎯 Your First Step:</h3>
                <p class="hero-section-text" style="font-size: 1.1rem; line-height: 1.7; font-weight: 500; margin: 0;">
                    ${firstSteps[pattern.name] || `Today: Notice when your ${pattern.name.toLowerCase()} pattern shows up. Just observe—awareness is the first step.`}
                </p>
            </div>
        `;
    }
    
    // Focus On This First - Clear Callout
    function getFocusOnThisFirst(dominantDriver, dominantPercent, sortedDrivers, driverPercentages) {
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        const secondaryDriver = sortedDrivers[1] ? sortedDrivers[1][0] : null;
        const secondaryPercent = sortedDrivers[1] ? driverPercentages[sortedDrivers[1][0]] : 0;
        
        let focusText = `Focus on breaking your <strong>${driverNames[dominantDriver]} driver (${dominantPercent}%)</strong> first. This is your dominant pattern—breaking it will have the biggest impact.`;
        
        if (secondaryDriver && secondaryPercent >= 20) {
            focusText += ` Once you break this ${dominantPercent}% pattern, addressing your secondary ${driverNames[secondaryDriver]} driver (${secondaryPercent}%) becomes easier.`;
        }
        
        return `
            <div class="hero-focus-first" style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(202, 0, 19, 0.08); border-radius: 8px; border-left: 4px solid #ca0013;">
                <h3 class="hero-section-title" style="color: #ca0013; margin-bottom: 0.75rem;">📍 Focus On This First:</h3>
                <p class="hero-section-text" style="font-size: 1.05rem; line-height: 1.7; margin: 0;">
                    ${focusText}
                </p>
            </div>
        `;
    }
    
    // Explain Archetype vs Pattern
    function getArchetypeVsPatternExplanation(archetype, pattern, dominantDriver) {
        const archetypeMeanings = {
            'The Anchor': 'You seek safety through control and stability. When you feel uncertain, you take charge and create structure.',
            'The Catalyst': 'You seek safety through validation and achievement. When you feel uncertain, you perform and earn approval.',
            'The Wanderer': 'You seek safety through avoidance and freedom. When you feel uncertain, you stay mobile and avoid commitment.',
            'The Guardian': 'You seek safety through protection and distance. When you feel uncertain, you keep boundaries and protect yourself.'
        };
        
        const patternMeanings = {
            'Fixer': 'Within The Anchor, you\'re action-oriented—you jump in to solve problems, even when they\'re not yours to fix.',
            'Perfectionist': 'Within The Anchor, you\'re detail-oriented—you analyze every decision, trying to make the perfect choice.',
            'Pleaser': 'Within The Catalyst, you prioritize harmony—you avoid conflict by pleasing others, even at your own expense.',
            'Performer': 'Within The Catalyst, you prioritize achievement—you work to impress and earn approval through success.',
            'Escaper': 'Within The Wanderer, you avoid through distraction—you stay busy, avoid feelings, and keep moving.',
            'Overthinker': 'Within The Wanderer, you avoid through over-analysis—you think through everything before acting.',
            'Withdrawer': 'Within The Guardian, you protect through withdrawal—when people get close, you pull away to stay safe.',
            'Overgiver': 'Within The Guardian, you protect through over-giving—you give everything hoping they\'ll stay, but end up resentful.'
        };
        
        return `
            <div class="hero-archetype-pattern-explanation">
                <h3 class="hero-section-title">What This Means:</h3>
                <div class="explanation-box" style="margin-bottom: 1.5rem;">
                    <p class="explanation-label" style="font-weight: 600; color: #ca0013; margin-bottom: 0.5rem;">Your Archetype: ${archetype.name}</p>
                    <p class="explanation-text">${archetypeMeanings[archetype.name] || 'Your primary way of seeking safety and security.'}</p>
                </div>
                <div class="explanation-box">
                    <p class="explanation-label" style="font-weight: 600; color: #ca0013; margin-bottom: 0.5rem;">Your Pattern: ${pattern.name}</p>
                    <p class="explanation-text">${patternMeanings[pattern.name] || 'Your specific way this archetype shows up in your life.'}</p>
                </div>
            </div>
        `;
    }
    
    // Why They Got This Pattern - Multiple Answer Examples
    function getWhyTheyGotThisPattern(archetype, pattern, answers, quizData, sortedDrivers, driverPercentages, dominantDriver) {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return `
                <div class="hero-why-section">
                    <h3 class="hero-section-title">Why You Got This Pattern:</h3>
                    <p class="hero-section-text">Your answers showed that you respond to stress through ${dominantDriver}, which makes you ${archetype.name} and specifically ${pattern.name}.</p>
                </div>
            `;
        }
        
        const dominantPercent = driverPercentages[dominantDriver];
        let answerExamples = [];
        
        // Get examples from multiple domains - Use actual question text
        const domains = [
            { index: 0, name: 'Love' },
            { index: 4, name: 'Money' },
            { index: 8, name: 'Health' },
            { index: 14, name: 'Lifestyle' },
            { index: 20, name: 'Productivity' }
        ];
        
        domains.forEach(domain => {
            if (answers[domain.index] !== undefined && quizData[domain.index] && quizData[domain.index].options && quizData[domain.index].options[answers[domain.index]]) {
                const option = quizData[domain.index].options[answers[domain.index]];
                // Only show if it matches the dominant driver
                if (option.driver === dominantDriver) {
                    const questionText = quizData[domain.index].question || `${domain.name} question`;
                    // Shorten question if too long
                    const shortQuestion = questionText.length > 50 ? questionText.substring(0, 50) + '...' : questionText;
                    const answerText = option.text.length > 60 ? option.text.substring(0, 60) + '...' : option.text;
                    answerExamples.push({
                        question: shortQuestion,
                        answer: answerText,
                        domain: domain.name
                    });
                }
            }
        });
        
        // If no matching answers with dominant driver, show top 2-3 answers from any domain that show the pattern
        if (answerExamples.length === 0) {
            // Try to find answers that at least show some pattern consistency
            domains.slice(0, 3).forEach(domain => {
                if (answers[domain.index] !== undefined && quizData[domain.index] && quizData[domain.index].options && quizData[domain.index].options[answers[domain.index]]) {
                    const option = quizData[domain.index].options[answers[domain.index]];
                    const questionText = quizData[domain.index].question || `${domain.name} question`;
                    const shortQuestion = questionText.length > 50 ? questionText.substring(0, 50) + '...' : questionText;
                    const answerText = option.text.length > 60 ? option.text.substring(0, 60) + '...' : option.text;
                    answerExamples.push({
                        question: shortQuestion,
                        answer: answerText,
                        domain: domain.name
                    });
                }
            });
        }
        
        // Format examples with actual question text
        let examplesHTML = '';
        if (answerExamples.length > 0) {
            examplesHTML = `<ul class="answer-examples-list" style="margin-top: 1rem; padding-left: 1.5rem;">
                ${answerExamples.slice(0, 3).map(ex => `<li style="margin-bottom: 0.75rem; line-height: 1.6;"><strong>${ex.question}:</strong> "${ex.answer}"</li>`).join('')}
               </ul>`;
        }
        
        return `
            <div class="hero-why-section">
                <h3 class="hero-section-title">Why You Got This Pattern:</h3>
                <p class="hero-section-text">
                    Your answers revealed that you respond to stress through <strong>${dominantDriver} (${dominantPercent}%)</strong>, which makes you <strong>${archetype.name}</strong> and specifically <strong>${pattern.name}</strong>. 
                    Here's how your answers showed this:
                </p>
                ${examplesHTML}
                <p class="hero-section-text" style="margin-top: 1rem; font-style: italic; color: #666;">
                    These answers aren't random—they reveal a consistent pattern of how you seek safety and security when you feel uncertain or stressed.
                </p>
            </div>
        `;
    }
    
    // How It's Unique to Them
    function getPatternUniquenessExplanation(pattern, answers, quizData, firstName, exactAge, relationshipStatus) {
        const uniqueFactors = [];
        
        if (exactAge) {
            if (exactAge < 30) {
                uniqueFactors.push(`At ${exactAge}, this pattern is still forming—which means it's the perfect time to break it.`);
            } else if (exactAge < 40) {
                uniqueFactors.push(`At ${exactAge}, you're at a critical point—this pattern has been running for years, and breaking it now will transform your next decade.`);
            } else {
                uniqueFactors.push(`At ${exactAge}, you've likely seen how this pattern has cost you—and it's not too late to break it.`);
            }
        }
        
        if (relationshipStatus) {
            if (relationshipStatus === 'single') {
                uniqueFactors.push(`As someone who's single, this pattern shows up in how you approach dating and relationships.`);
            } else if (relationshipStatus === 'in a relationship' || relationshipStatus === 'married') {
                uniqueFactors.push(`In your relationship, this pattern shows up in how you handle conflict, intimacy, and connection.`);
            }
        }
        
        // Get a specific answer that makes it unique
        if (answers && answers.length > 0 && quizData[0] && quizData[0].options[answers[0]]) {
            const option = quizData[0].options[answers[0]];
            uniqueFactors.push(`Your specific answer to relationship conflicts (${option.text.substring(0, 50)}...) shows how your ${pattern.name.toLowerCase()} pattern uniquely shows up for you.`);
        }
        
        if (uniqueFactors.length === 0) {
            return '';
        }
        
        return `
            <div class="hero-uniqueness-section">
                <h3 class="hero-section-title">How This Is Unique to You:</h3>
                <ul class="uniqueness-list" style="padding-left: 1.5rem;">
                    ${uniqueFactors.map(factor => `<li style="margin-bottom: 0.75rem; line-height: 1.6;">${factor}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Current State Explanation
    function getCurrentStateExplanation(pattern, patternDominance, firstName, exactAge, relationshipStatus) {
        const currentStateExamples = {
            'Fixer': 'Right now, you\'re likely taking responsibility for things that aren\'t yours to fix—in relationships, work, and daily life. You feel exhausted from overfunctioning.',
            'Perfectionist': 'Right now, you\'re likely overthinking every decision, trying to make the "perfect" choice, and feeling paralyzed by analysis. You\'re exhausted from trying to be flawless.',
            'Pleaser': 'Right now, you\'re likely saying yes to things you don\'t want, putting others first, and losing yourself in relationships. You feel resentful but don\'t know how to stop.',
            'Performer': 'Right now, you\'re likely working hard to impress and earn approval, achieving and succeeding, but feeling empty and exhausted from performing.',
            'Escaper': 'Right now, you\'re likely staying busy, avoiding difficult feelings, and pulling away when things get serious. You feel disconnected and alone.',
            'Overthinker': 'Right now, you\'re likely analyzing every situation, trying to figure out the "right" move, but getting stuck in your head and missing opportunities.',
            'Withdrawer': 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear.',
            'Overgiver': 'Right now, you\'re likely giving more than you receive, hoping they\'ll see your worth, but feeling resentful and drained.'
        };
        
        return `
            <div class="hero-current-state-section">
                <h3 class="hero-section-title">Your Current State:</h3>
                <p class="hero-section-text">${currentStateExamples[pattern.name] || `Right now, your ${pattern.name.toLowerCase()} pattern is running ${patternDominance}% of your life.`}</p>
            </div>
        `;
    }
    
    // Shadow Explanation
    function getShadowExplanation(pattern) {
        if (!pattern.shadow) return '';
        
        const shadowParts = pattern.shadow.split(' → ');
        const shadowBehaviorVerb = getShadowBehaviorVerb(pattern.shadow);
        const shadowBehaviorDisplay = shadowParts[0] || 'your pattern behavior';
        const shadowConsequence = shadowParts[1] ? shadowParts[1].toLowerCase() : 'consequences';
        
        return `
            <div class="hero-shadow-section" style="background: rgba(202, 0, 19, 0.08); padding: 1.25rem; border-radius: 8px; border-left: 4px solid #ca0013; margin-top: 1.5rem;">
                <h3 class="hero-section-title" style="color: #ca0013;">⚠️ Your Shadow Side:</h3>
                <p class="hero-section-text">
                    <strong>${shadowBehaviorDisplay}</strong> → <strong>${shadowConsequence}</strong>
                </p>
                <p class="hero-section-text" style="margin-top: 0.75rem; font-size: 0.95rem; color: #666;">
                    This is what your pattern costs you. Every time you ${shadowBehaviorVerb}, you experience ${shadowConsequence}. This is the cycle you need to break.
                </p>
            </div>
        `;
    }
    
    
    // Urgency Message
    function getUrgencyMessage(pattern, patternDominance, firstName, exactAge) {
        const urgencyMessages = [
            `Every day you don't break this pattern, it gets stronger. Every day you wait, it costs you more—in relationships, opportunities, health, money, and your sense of self.`,
            `This ${pattern.name.toLowerCase()} pattern is running ${patternDominance}% of your life right now. The longer you wait, the harder it becomes to break.`,
            `You've identified your pattern. You understand why you're stuck. Now you need a system to actually break it—before it costs you even more.`
        ];
        
        return `
            <div class="hero-urgency-section" style="background: rgba(202, 0, 19, 0.1); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ca0013; margin-top: 1.5rem;">
                <h3 class="hero-section-title" style="color: #ca0013; font-size: 1.2rem;">⏰ The Urgency:</h3>
                <p class="hero-section-text" style="font-size: 1.1rem; line-height: 1.7; font-weight: 500;">
                    ${urgencyMessages[0]}
                </p>
                <p class="hero-section-text" style="margin-top: 0.75rem; font-size: 1rem;">
                    ${urgencyMessages[1]}
                </p>
                <p class="hero-section-text" style="margin-top: 0.75rem; font-weight: 600; color: #ca0013;">
                    ${urgencyMessages[2]}
                </p>
            </div>
        `;
    }
    
    // Life Areas with Nested Accordion
    function getLifeAreaImpactAccordion(pattern, exactAge, relationshipStatus, firstName, patternDominance, answers) {
        const quizData = window.quizData || [];
        const config = window.QUIZ_CONFIG || {};
        const domains = config.QUESTION_DOMAINS || {
            LOVE: { start: 0, end: 3 },
            MONEY: { start: 4, end: 7 },
            HEALTH: { start: 8, end: 13 },
            LIFESTYLE: { start: 14, end: 17 },
            PHYSICAL: { start: 18, end: 19 },
            PRODUCTIVITY: { start: 20, end: 22 },
            PURPOSE: { start: 23, end: 25 },
            IDENTITY: { start: 26, end: 29 },
            CHILDHOOD: { start: 30, end: 35 },
            RELATIONSHIPS: { start: 36, end: 41 },
            REFLECTION: { start: 42, end: 43 }
        };
        
        // Get answer-specific examples for each domain
        function getAnswerExample(domain, domainName) {
            if (!answers || !quizData || domain.start === undefined) return '';
            
            const domainAnswers = answers.slice(domain.start, domain.end + 1).filter(a => a !== undefined);
            if (domainAnswers.length === 0) return '';
            
            // Get first answer in domain as example
            const firstAnswerIndex = domain.start;
            if (answers[firstAnswerIndex] !== undefined && quizData[firstAnswerIndex] && quizData[firstAnswerIndex].options[answers[firstAnswerIndex]]) {
                const option = quizData[firstAnswerIndex].options[answers[firstAnswerIndex]];
                return `Based on your answers: ${option.text.substring(0, 60)}${option.text.length > 60 ? '...' : ''}`;
            }
            return '';
        }
        
        const lifeAreas = [
            { id: 'love', icon: '💕', title: 'Love & Relationships', domain: domains.LOVE, content: getLoveImpact(pattern, relationshipStatus, exactAge, answers, quizData, domains.LOVE) },
            { id: 'money', icon: '💰', title: 'Money & Finances', domain: domains.MONEY, content: getMoneyImpact(pattern, exactAge, answers, quizData, domains.MONEY) },
            { id: 'health', icon: '🏃', title: 'Health & Habits', domain: domains.HEALTH, content: getHealthImpact(pattern, exactAge, answers, quizData, domains.HEALTH) },
            { id: 'lifestyle', icon: '🍽️', title: 'Lifestyle & Daily Habits', domain: domains.LIFESTYLE, content: getLifestyleImpact(pattern, answers, quizData, domains.LIFESTYLE) },
            { id: 'physical', icon: '💪', title: 'Physical Health & Body', domain: domains.PHYSICAL, content: getPhysicalImpact(pattern, answers, quizData, domains.PHYSICAL) },
            { id: 'productivity', icon: '⏰', title: 'Productivity & Time', domain: domains.PRODUCTIVITY, content: getProductivityImpact(pattern, answers, quizData, domains.PRODUCTIVITY) },
            { id: 'purpose', icon: '🎯', title: 'Purpose & Flow', domain: domains.PURPOSE, content: getPurposeImpact(pattern, answers, quizData, domains.PURPOSE) },
            { id: 'identity', icon: '🎭', title: 'Identity & Self', domain: domains.IDENTITY, content: getIdentityImpact(pattern, exactAge, answers, quizData, domains.IDENTITY) },
            { id: 'childhood', icon: '👶', title: 'Childhood & Origin', domain: domains.CHILDHOOD, content: getChildhoodImpact(pattern, answers, quizData, domains.CHILDHOOD) },
            { id: 'relationships', icon: '💑', title: 'Relationship Patterns', domain: domains.RELATIONSHIPS, content: getRelationshipPatternsImpact(pattern, relationshipStatus, answers, quizData, domains.RELATIONSHIPS) },
            { id: 'reflection', icon: '🔍', title: 'Reflection & Self-Awareness', domain: domains.REFLECTION, content: getReflectionImpact(pattern, answers, quizData, domains.REFLECTION) }
        ];
        
        const lifeAreaItems = lifeAreas.map(area => {
            const example = getAnswerExample(area.domain, area.title);
            const preview = example ? `<span class="life-area-preview">${example}</span>` : '';
            
            return `
                <div class="life-area-accordion-item" data-area="${area.id}">
                    <button class="life-area-header" onclick="toggleLifeArea('${area.id}')">
                        <span class="life-area-icon">${area.icon}</span>
                        <span class="life-area-title">${area.title}</span>
                        <span class="life-area-toggle">▶</span>
                    </button>
                    <div class="life-area-content">
                        ${area.content}
                        ${preview ? `<p class="answer-example" style="margin-top: 1rem; padding: 0.75rem; background: rgba(202, 0, 19, 0.05); border-left: 3px solid #ca0013; font-size: 0.95rem; color: #666;">${preview}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <p class="content-text" style="margin-bottom: 1.5rem;">${firstName ? `${firstName}, ` : ''}Your ${pattern.name} pattern doesn't just show up in one area—it's operating across <strong>every area of your life</strong>. Click each area to see how it's impacting you:</p>
            <div class="life-areas-accordion">
                ${lifeAreaItems}
            </div>
            <div class="life-areas-summary" style="margin-top: 2rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.08); border-radius: 8px; border-left: 4px solid #ca0013;">
                <p class="content-text" style="font-size: 1.15rem; font-weight: 600; color: #ca0013; margin: 0;">
                    <strong>The Pattern Is Everywhere:</strong> Your ${pattern.name.toLowerCase()} pattern influences ${patternDominance}% of your decisions across all these areas. It's not isolated—it's a system-wide pattern that needs a system-wide solution.
                </p>
            </div>
        `;
    }
    
    // Answer-based impact functions for each life area
    function getLoveImpact(pattern, relationshipStatus, exactAge, answers, quizData, domain) {
        const baseContent = getLoveImpactBase(pattern, relationshipStatus, exactAge);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'love');
        return `${baseContent}${answerExample}`;
    }
    
    function getMoneyImpact(pattern, exactAge, answers, quizData, domain) {
        const baseContent = getMoneyImpactBase(pattern, exactAge);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'money');
        return `${baseContent}${answerExample}`;
    }
    
    function getHealthImpact(pattern, exactAge, answers, quizData, domain) {
        const baseContent = getHealthImpactBase(pattern, exactAge);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'health');
        return `${baseContent}${answerExample}`;
    }
    
    function getLifestyleImpact(pattern, answers, quizData, domain) {
        const examples = {
            'Fixer': 'You follow strict routines and feel guilty when you break them. Your relationship with food is rigid and controlled—you follow strict rules and feel guilty when you break them.',
            'Perfectionist': 'You create perfect daily routines but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely.',
            'Pleaser': 'You structure your day around what others need, saying yes to plans that exhaust you and putting everyone else first.',
            'Performer': 'You work out and eat well to look good and impress others, but you\'re exhausted from performing.',
            'Escaper': 'You avoid dealing with routines—staying busy, numbing feelings, avoiding structure. You use distraction to avoid discomfort.',
            'Overthinker': 'You analyze every lifestyle decision endlessly—researching diets, routines, habits—but this paralysis prevents you from taking action.',
            'Withdrawer': 'You protect yourself by keeping distance from wellness support—avoiding communities or routines that require connection.',
            'Overgiver': 'You give your energy to everyone else\'s needs, leaving nothing for your own daily routines and self-care.'
        };
        const baseContent = `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'lifestyle');
        return `${baseContent}${answerExample}`;
    }
    
    function getPhysicalImpact(pattern, answers, quizData, domain) {
        const examples = {
            'Fixer': 'You push through even when exhausted, believing you need to be strong and capable. Your relationship with your body is critical—you\'re constantly trying to fix or improve it.',
            'Perfectionist': 'You create perfect workout plans but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely.',
            'Pleaser': 'You prioritize others\' health needs over your own, leading to burnout and neglecting your own wellbeing.',
            'Performer': 'You work out to look good and impress others, but your health becomes about appearance, not wellbeing.',
            'Escaper': 'You avoid dealing with health issues—staying busy, numbing feelings, avoiding doctors. You disconnect from your body.',
            'Overthinker': 'You analyze every health decision endlessly but this paralysis prevents you from taking action.',
            'Withdrawer': 'You protect yourself by keeping distance from health support—avoiding doctors, therapists, or wellness communities.',
            'Overgiver': 'You give your energy to everyone else, leaving nothing for yourself. You neglect your own health needs.'
        };
        const baseContent = `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'physical');
        return `${baseContent}${answerExample}`;
    }
    
    function getProductivityImpact(pattern, answers, quizData, domain) {
        const examples = {
            'Fixer': 'You step in to solve problems at work, even when they\'re not yours to fix. You take on extra responsibilities, leading to burnout.',
            'Perfectionist': 'You overthink every work decision, trying to make the "perfect" choice. You analyze projects endlessly, leading to paralysis and missed deadlines.',
            'Pleaser': 'You say yes to everything at work, trying to please everyone. You take on extra projects and work late, leading to burnout.',
            'Performer': 'You work hard to impress and earn approval, achieving and succeeding to prove your worth. But you\'re exhausted from performing.',
            'Escaper': 'You avoid difficult conversations, challenging projects, and career risks. You stay busy with tasks that don\'t matter.',
            'Overthinker': 'You analyze every career decision endlessly, trying to figure out the "right" path. This paralysis causes you to miss opportunities.',
            'Withdrawer': 'You protect yourself by keeping distance from colleagues, avoiding networking, and staying isolated.',
            'Overgiver': 'You give your time and energy to everyone else\'s projects, leaving nothing for your own growth.'
        };
        const baseContent = `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'productivity');
        return `${baseContent}${answerExample}`;
    }
    
    function getPurposeImpact(pattern, answers, quizData, domain) {
        const examples = {
            'Fixer': 'You try to control your purpose—planning every step, trying to fix everything. But this prevents you from experiencing flow and authentic purpose.',
            'Perfectionist': 'You overthink your purpose, trying to find the "perfect" calling. This paralysis prevents you from taking action toward what matters.',
            'Pleaser': 'You pursue purposes that will make others proud, losing yourself in what others want for you instead of what you truly want.',
            'Performer': 'You pursue purposes that will earn approval and recognition, but you\'re performing instead of living authentically.',
            'Escaper': 'You avoid committing to a purpose, staying mobile and keeping options open. This prevents you from building something meaningful.',
            'Overthinker': 'You analyze your purpose endlessly, trying to figure out the "right" path. This paralysis prevents you from taking action.',
            'Withdrawer': 'You protect yourself by keeping distance from your purpose, fearing rejection if you pursue what you truly want.',
            'Overgiver': 'You give your time and energy to others\' purposes, leaving nothing for your own calling.'
        };
        const baseContent = `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'purpose');
        return `${baseContent}${answerExample}`;
    }
    
    function getIdentityImpact(pattern, exactAge, answers, quizData, domain) {
        const baseContent = getIdentityImpactBase(pattern, exactAge);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'identity');
        return `${baseContent}${answerExample}`;
    }
    
    function getChildhoodImpact(pattern, answers, quizData, domain) {
        const baseContent = getChildhoodImpactBase(pattern);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'childhood');
        return `${baseContent}${answerExample}`;
    }
    
    function getRelationshipPatternsImpact(pattern, relationshipStatus, answers, quizData, domain) {
        const baseContent = getRelationshipPatternsImpactBase(pattern, relationshipStatus);
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'relationships');
        return `${baseContent}${answerExample}`;
    }
    
    function getReflectionImpact(pattern, answers, quizData, domain) {
        const examples = {
            'Fixer': 'You hold onto control because letting go feels unsafe. Your self-worth depends on how well you manage and perform.',
            'Perfectionist': 'You hold onto perfectionism because being human feels unsafe. Your self-worth depends on being flawless.',
            'Pleaser': 'You hold onto pleasing because saying no feels unsafe. Your self-worth depends on how much others value you.',
            'Performer': 'You hold onto performing because being authentic feels unsafe. Your self-worth depends on what you achieve.',
            'Escaper': 'You hold onto avoiding because facing discomfort feels unsafe. Your self-worth depends on how easy life feels.',
            'Overthinker': 'You hold onto thinking because taking action feels unsafe. Your self-worth depends on how much you analyze.',
            'Withdrawer': 'You hold onto distance because closeness feels unsafe. Your self-worth depends on how protected you keep yourself.',
            'Overgiver': 'You hold onto giving because receiving feels unsafe. Your self-worth depends on how much you give.'
        };
        const baseContent = `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
        const answerExample = getAnswerSpecificExample(answers, quizData, domain, 'reflection');
        return `${baseContent}${answerExample}`;
    }
    
    // Helper to get answer-specific examples
    function getAnswerSpecificExample(answers, quizData, domain, areaName) {
        if (!answers || !quizData || !domain || domain.start === undefined) return '';
        
        const domainAnswers = answers.slice(domain.start, Math.min(domain.end + 1, answers.length)).filter(a => a !== undefined);
        if (domainAnswers.length === 0) return '';
        
        // Get first answer in domain as example
        const firstAnswerIndex = domain.start;
        if (answers[firstAnswerIndex] !== undefined && quizData[firstAnswerIndex] && quizData[firstAnswerIndex].options && quizData[firstAnswerIndex].options[answers[firstAnswerIndex]]) {
            const option = quizData[firstAnswerIndex].options[answers[firstAnswerIndex]];
            return `<p class="answer-insight" style="margin-top: 1rem; padding: 1rem; background: rgba(202, 0, 19, 0.05); border-left: 3px solid #ca0013; border-radius: 4px;"><strong>Based on your answer:</strong> ${option.text}</p>`;
        }
        return '';
    }
    
    // Base impact functions (keep existing logic)
    function getLoveImpactBase(pattern, relationshipStatus, exactAge) {
        const examples = {
            'Fixer': {
                single: 'You jump in to "fix" dates who seem lost or broken, believing if you solve their problems, they\'ll stay. But they pull away when they feel controlled.',
                relationship: 'When your partner has a problem, you immediately jump in to solve it—even when they need to handle it themselves. This creates resentment on both sides.'
            },
            'Perfectionist': {
                single: 'You analyze every potential partner for flaws before committing, waiting for the "perfect" match that never comes.',
                relationship: 'You overthink every decision together, trying to make the "right" choice, which leads to paralysis and missed opportunities.'
            },
            'Pleaser': {
                single: 'You say yes to dates you\'re not interested in, go along with plans you don\'t want, and lose yourself trying to be what they want.',
                relationship: 'You say yes to everything your partner wants, even when you\'re exhausted, leading to resentment and losing yourself.'
            },
            'Performer': {
                single: 'You work hard to impress dates—achieving, succeeding, showing your best self—but they leave when they see the real you.',
                relationship: 'You work hard to be the "perfect" partner, achieving and succeeding to earn their approval, but you\'re exhausted and they don\'t see the real you.'
            },
            'Escaper': {
                single: 'You stay busy, avoid deep conversations, and pull away when things get serious—keeping yourself safe but alone.',
                relationship: 'When conflict arises, you avoid it—staying busy, numbing feelings, or withdrawing—which creates distance and unresolved issues.'
            },
            'Overthinker': {
                single: 'You analyze every text, every date, every interaction, trying to figure out if they\'re "the one" before you even know them.',
                relationship: 'You analyze every interaction, every conversation, trying to figure out what they "really" mean, which creates anxiety and distance.'
            },
            'Withdrawer': {
                single: 'You push people away when they get too close, protecting yourself from rejection but creating the loneliness you fear.',
                relationship: 'When your partner gets too close or vulnerable, you pull away, protecting yourself but creating the distance you fear.'
            },
            'Overgiver': {
                single: 'You give everything—time, energy, attention—hoping they\'ll see your worth, but they take and leave when you need something.',
                relationship: 'You give more than you receive, hoping they\'ll reciprocate, but you end up resentful and they feel smothered.'
            }
        };
        
        const patternData = examples[pattern.name] || examples['Fixer'];
        const context = relationshipStatus === 'single' ? patternData.single : (relationshipStatus === 'married' || relationshipStatus === 'in a relationship') ? patternData.relationship : patternData.single;
        
        return `<p class="content-text">${context}</p>`;
    }
    
    function getMoneyImpactBase(pattern, exactAge) {
        const examples = {
            'Fixer': 'You feel safe only when you\'re fully in control of finances. When money problems hit, you go into "fix mode"—creating plans, tightening systems, trying to solve everything. But this constant control creates stress.',
            'Perfectionist': 'You overthink every financial decision, trying to make the "perfect" choice. You analyze investments, budgets, and opportunities endlessly—but this paralysis causes you to miss opportunities.',
            'Pleaser': 'You spend money to please others—buying gifts, saying yes to expensive plans, trying to show you care through spending. But this leaves you financially drained.',
            'Performer': 'You spend money to impress—buying status symbols, expensive experiences, trying to show your worth through what you own. But this creates financial stress.',
            'Escaper': 'You avoid dealing with money—ignoring bills, avoiding budgets, staying busy so you don\'t have to think about finances. But this creates financial chaos.',
            'Overthinker': 'You analyze every financial decision endlessly, trying to figure out the "right" move. You research, compare, and think—but this paralysis causes you to miss opportunities.',
            'Withdrawer': 'You protect yourself financially by hoarding, avoiding risks, and keeping everything separate. But this prevents you from building wealth.',
            'Overgiver': 'You give money away—loaning to friends, paying for others, trying to show your worth through generosity. But this leaves you financially drained.'
        };
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getHealthImpactBase(pattern, exactAge) {
        const examples = {
            'Fixer': 'You make clear plans and structure your day when overwhelmed, but you struggle to rest because you feel responsible for everything. Your biggest health challenge is overfunctioning leading to burnout.',
            'Perfectionist': 'You create perfect health routines but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely. This all-or-nothing approach prevents consistent health habits.',
            'Pleaser': 'You prioritize others\' health needs over your own, saying yes to plans that exhaust you and putting everyone else first. This leads to burnout and neglecting your own wellbeing.',
            'Performer': 'You work out and eat well to look good and impress others, but you\'re exhausted from performing. Your health becomes about appearance, not wellbeing.',
            'Escaper': 'You avoid dealing with health issues—staying busy, numbing feelings, avoiding doctors. You use distraction to avoid discomfort, but this prevents you from addressing real health concerns.',
            'Overthinker': 'You analyze every health decision endlessly—researching diets, workouts, supplements—but this paralysis prevents you from taking action. You think about health more than you practice it.',
            'Withdrawer': 'You protect yourself by keeping distance from health support—avoiding doctors, therapists, or wellness communities. But this isolation prevents you from getting the help you need.',
            'Overgiver': 'You give your energy to everyone else, leaving nothing for yourself. You neglect your own health needs while taking care of others, leading to exhaustion and burnout.'
        };
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getIdentityImpactBase(pattern, exactAge) {
        const examples = {
            'Fixer': 'You see yourself as the problem-solver, the one who takes charge. Your worth is tied to how much you fix and how capable you are. But this identity prevents you from receiving help and being vulnerable.',
            'Perfectionist': 'You see yourself as someone who does things "right." Your worth is tied to being flawless. But this identity prevents you from taking risks and being human.',
            'Pleaser': 'You see yourself as helpful, caring, the one who puts others first. Your worth is tied to how much you please. But this identity prevents you from knowing who you are outside of serving others.',
            'Performer': 'You see yourself as successful, achieving, impressive. Your worth is tied to what you accomplish. But this identity prevents you from being authentic and vulnerable.',
            'Escaper': 'You see yourself as free, independent, uncommitted. Your worth is tied to staying mobile. But this identity prevents you from building deep connections and stability.',
            'Overthinker': 'You see yourself as thoughtful, analytical, careful. Your worth is tied to how much you think. But this identity prevents you from trusting your instincts and taking action.',
            'Withdrawer': 'You see yourself as independent, self-sufficient, protected. Your worth is tied to how safe you keep yourself. But this identity prevents you from experiencing deep connection and intimacy.',
            'Overgiver': 'You see yourself as generous, giving, needed. Your worth is tied to how much you give. But this identity prevents you from receiving and knowing your worth outside of giving.'
        };
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getChildhoodImpactBase(pattern) {
        const examples = {
            'Fixer': 'You likely grew up in an environment where you learned that taking charge and solving problems kept you safe. Maybe you were the "responsible one" in your family, or you learned that fixing things earned you love and approval. This pattern developed as a survival strategy—and it worked. But now it\'s limiting you.',
            'Perfectionist': 'You likely grew up in an environment where you learned that being perfect kept you safe. Maybe you were praised for doing things "right," or you learned that mistakes led to criticism or rejection. This pattern developed as a way to avoid pain—and it worked. But now it\'s preventing you from taking risks and being human.',
            'Pleaser': 'You likely grew up in an environment where you learned that pleasing others kept you safe. Maybe you were rewarded for being helpful, or you learned that saying no led to conflict or rejection. This pattern developed as a way to maintain connection—and it worked. But now it\'s preventing you from knowing yourself.',
            'Performer': 'You likely grew up in an environment where you learned that achieving and performing earned you love and approval. Maybe you were praised for success, or you learned that your worth was tied to what you accomplished. This pattern developed as a way to feel worthy—and it worked. But now it\'s exhausting you.',
            'Escaper': 'You likely grew up in an environment where you learned that avoiding difficult emotions kept you safe. Maybe you learned to stay busy or numb feelings, or you learned that feeling deeply was dangerous. This pattern developed as a way to protect yourself—and it worked. But now it\'s preventing you from experiencing deep connection.',
            'Overthinker': 'You likely grew up in an environment where you learned that thinking through everything kept you safe. Maybe you were rewarded for being careful, or you learned that acting without thinking led to mistakes or criticism. This pattern developed as a way to feel safe—and it worked. But now it\'s preventing you from taking action.',
            'Withdrawer': 'You likely grew up in an environment where you learned that keeping distance kept you safe. Maybe you learned that closeness led to pain, or you learned that protecting yourself was necessary. This pattern developed as a way to avoid rejection—and it worked. But now it\'s preventing you from experiencing intimacy.',
            'Overgiver': 'You likely grew up in an environment where you learned that giving more kept you safe. Maybe you learned that your worth was tied to how much you gave, or you learned that giving prevented people from leaving. This pattern developed as a way to feel needed—and it worked. But now it\'s leaving you drained and resentful.'
        };
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    function getRelationshipPatternsImpactBase(pattern, relationshipStatus) {
        const examples = {
            'Fixer': 'You struggle with intimacy because you\'re always "fixing." When your partner shares a problem, you jump in to solve it instead of just listening. This prevents deep emotional connection and makes your partner feel like they can\'t be vulnerable without you trying to control the situation.',
            'Perfectionist': 'You struggle with commitment because you\'re waiting for the "perfect" partner. You analyze every potential partner for flaws, trying to ensure you make the "right" choice. But this perfectionism prevents you from taking risks in love and experiencing real connection.',
            'Pleaser': 'You struggle with boundaries because you say yes to everything your partner wants, even when you\'re exhausted. You lose yourself in relationships, trying to be what they want instead of who you are. This prevents authentic connection and leads to resentment.',
            'Performer': 'You struggle with vulnerability because you\'re always performing. You show your best self, achieve, and succeed to earn approval—but your partner never sees the real you. This prevents deep intimacy and leaves you feeling alone even in relationships.',
            'Escaper': 'You struggle with commitment because you avoid difficult conversations and pull away when things get serious. You stay busy, avoid feelings, and keep your options open—but this prevents you from building deep, lasting connections.',
            'Overthinker': 'You struggle with trust because you analyze every interaction, trying to figure out what your partner "really" means. You get stuck in your head instead of your heart, which creates anxiety and distance in relationships.',
            'Withdrawer': 'You struggle with intimacy because you push people away when they get too close. You protect yourself by keeping emotional distance, but this creates the loneliness you fear. Your partner feels rejected, you feel misunderstood.',
            'Overgiver': 'You struggle with receiving love because you give more than you receive. You hope they\'ll see your worth through your generosity, but you end up resentful when they don\'t reciprocate. You don\'t know how to receive love.'
        };
        return `<p class="content-text">${examples[pattern.name] || examples['Fixer']}</p>`;
    }
    
    // Get Dominant Driver Preview - Simplified for Pattern Card
    function getDominantDriverPreview(sortedDrivers, driverPercentages) {
        if (!sortedDrivers || sortedDrivers.length === 0 || !driverPercentages) {
            return '';
        }
        
        // Get top 2 drivers (consistent with quiz modal)
        const top2Drivers = sortedDrivers.slice(0, 2);
        
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        // Build HTML for top 2 drivers
        const driversHTML = top2Drivers.map(([driver, percentage]) => {
            const driverName = driverNames[driver] || 'Emotional Driver';
            const driverPercent = driverPercentages[driver] || percentage || 0;
            return `<span class="driver-preview-name">${driverName}</span> <span class="driver-preview-percentage">${driverPercent}%</span>`;
        }).join(' • ');
        
        return `
            <div class="pattern-dominant-driver">
                <span class="driver-preview-label">Driven by:</span>
                ${driversHTML}
            </div>
        `;
    }
    
    function getAllDriversGrid(sortedDrivers, driverPercentages) {
        if (!sortedDrivers || sortedDrivers.length === 0 || !driverPercentages) {
            return '';
        }
        
        const driverNames = {
            'control': 'Control',
            'avoidance': 'Avoidance',
            'validation': 'Validation',
            'fear-of-rejection': 'Fear of Rejection'
        };
        
        // Ensure we have all 4 drivers
        const allDrivers = ['control', 'avoidance', 'validation', 'fear-of-rejection'].map(driver => {
            const percentage = driverPercentages[driver] || 0;
            return [driver, percentage];
        }).sort((a, b) => b[1] - a[1]);
        
        // Build 2x2 grid
        const driversHTML = allDrivers.map(([driver, percentage]) => {
            const driverName = driverNames[driver] || 'Emotional Driver';
            const driverPercent = Math.round(percentage) || 0;
            const isDominant = sortedDrivers[0] && sortedDrivers[0][0] === driver;
            return `
                <div class="driver-grid-item ${isDominant ? 'dominant' : ''}">
                    <div class="driver-grid-name">${driverName}</div>
                    <div class="driver-grid-percentage">${driverPercent}%</div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="pattern-drivers-grid">
                <div class="driver-preview-label">All 4 Emotional Drivers</div>
                <div class="drivers-grid-container">
                    ${driversHTML}
                </div>
            </div>
        `;
    }
})();

