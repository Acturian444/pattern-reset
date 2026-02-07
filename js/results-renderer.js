// Results Renderer Module
// Extracts all results rendering logic for use in modal overlay
(function() {
    'use strict';
    
    // Make results renderer available globally
    window.ResultsRenderer = {
        // Load and render full results content
        renderFullResults: function(container, data) {
            const { pattern, archetype, patternDominance, dominanceLabel, driverPercentages, totalScore, exactAge, relationshipStatus, firstName, birthDate, sortedDrivers, answers, driverScores } = data;
            
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
                birthDate: birthDate || null,
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
            exactAge, relationshipStatus, answers, driverScores, quizData, birthDate
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
                    <p class="results-subtitle">You're not broken. You've been repeating something you couldn't see until now. Below, your free Pattern Reset Workbook: a self-paced blueprint to break your pattern and transform your life.</p>
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
                ${getComprehensiveHeroContent(archetype, pattern, patternDominance, dominanceLabel, answers, sortedDriversArray, driverPercentagesObj, firstName, exactAge, relationshipStatus, quizData || window.quizData || [], birthDate)}
            
                <!-- Divider + Section intro (matches border-top pattern used in Emotional Drivers, etc.) -->
                <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1); margin-bottom: 2rem;">
                    <h2 class="about-pattern-title" style="margin-bottom: 0.5rem;">Transform Your Life in One Day</h2>
                    <p class="content-text" style="color: #555; font-size: 1rem; font-weight: 400; margin: 0 0 1.5rem 0; line-height: 1.6;">You've seen your pattern. The workbook below is your one-day reset—from autopilot to you choosing who you're becoming.</p>
                    
                    <h4 class="how-developed-title" style="color: #ca0013; font-weight: 700; margin-bottom: 0.75rem;">You Don't Have to Wait for Life to Break You</h4>
                    <p class="content-text" style="margin-bottom: 1rem; color: #000; font-weight: 400; line-height: 1.7;">Most people only change when life forces them to change through trauma, loss, breakdown, or hitting rock bottom. We carry patterns that drive our lives and keep us stuck in loops of trauma we haven't processed, problems that repeat, unhappiness that feels unshakeable, and lack of progress in all areas of life. Until we see it, the pattern runs on autopilot. We can't change what we can't see.</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #000; font-weight: 400; line-height: 1.7;"><strong>You don't have to wait for a breakdown to have a breakthrough.</strong> Instead of letting your pattern run your life, you can choose to interrupt it consciously. This reset is where that happens. You choose the life you want and how you want to live it.</p>
                    <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: #000; font-size: 0.95rem;"><span style="background: rgba(202, 0, 19, 0.06); padding: 0.5rem 1rem; border-radius: 8px; display: inline-block;">Your Before / After</span></p>
                    <p class="content-text" style="margin-bottom: 2rem; color: #000; font-weight: 400; line-height: 1.7;">Moving from before to after requires an identity shift. Get clear on who you want to become, then commit to aligning with that version every day. That's when you reprogram yourself and break free from the loop. The workbook below is your blueprint for reprogramming yourself.</p>
                    
                    <h4 class="how-developed-title" style="color: #ca0013; font-weight: 700; margin-bottom: 0.75rem;">Pattern Interruption</h4>
                    <p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">Your pattern formed in childhood as a survival strategy and became deeply encoded. It runs on autopilot long after it stopped serving you. One decision can truly change your life.</p>
                    <div class="pattern-interrupt-diagram" style="margin-bottom: 1.5rem;">
                        <p style="margin: 0 0 0.75rem 0; font-weight: 700; font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">From Childhood to Autopilot</p>
                        <div style="display: flex; flex-direction: column; gap: 0;">
                            <div style="padding: 1rem 1.25rem; background: #fff; border-radius: 8px 8px 0 0; border: 1px solid rgba(0,0,0,0.06); border-bottom: none; display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">1</span>
                                <div><p style="margin: 0 0 0.35rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Childhood Experience</p><p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #555;">Created a core fear or need (unsafe, unseen, unworthy, out of control)</p></div>
                            </div>
                            <div style="height: 1px; background: #eee; margin: 0 1rem;"></div>
                            <div style="padding: 1rem 1.25rem; background: #fff; border-left: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">2</span>
                                <div><p style="margin: 0 0 0.35rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Emotional Driver Developed</p><p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #555;">Strategy to cope ("If I control things, I'm safe" / "If I get approval, I'm worthy" / etc.)</p></div>
                            </div>
                            <div style="height: 1px; background: #eee; margin: 0 1rem;"></div>
                            <div style="padding: 1rem 1.25rem; background: #fff; border: 1px solid rgba(0,0,0,0.06); border-top: none; border-radius: 0 0 8px 8px; display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">3</span>
                                <div><p style="margin: 0 0 0.35rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Pattern Became Automatic</p><p style="margin: 0; font-size: 0.9rem; line-height: 1.5; color: #555;">Years of repetition wired it in. Your subconscious (95% of behavior) learned: "This is how I survive. This is who I am."</p></div>
                            </div>
                        </div>
                        <div style="margin: 1rem 0; padding: 1.25rem; background: rgba(202, 0, 19, 0.06); border-radius: 8px; border: 1px solid rgba(202, 0, 19, 0.25); text-align: center;">
                            <p style="margin: 0; font-weight: 700; font-size: 1rem; color: #ca0013;">⟳ Pattern Interruption</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #555; line-height: 1.5;">Hits the pause button on autopilot. Creates a moment of awareness—conscious choice where there was only automatic reaction.</p>
                        </div>
                        <p style="margin: 0 0 0.75rem 0; font-weight: 700; font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.5px;">From Awareness to New Default</p>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div style="padding: 1rem 1.25rem; background: #fff; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">1</span>
                                <div><p style="margin: 0 0 0.2rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Awareness</p><p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: #555;">Face your pattern head-on. Notice when the pattern shows up instead of running on autopilot.</p></div>
                            </div>
                            <div style="padding: 1rem 1.25rem; background: #fff; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">2</span>
                                <div><p style="margin: 0 0 0.2rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Conscious Decision</p><p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: #555;">Choose to change. Make the deliberate choice to act differently in that moment.</p></div>
                            </div>
                            <div style="padding: 1rem 1.25rem; background: #fff; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 1rem;">
                                <span style="width: 28px; height: 28px; background: #ca0013; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0;">3</span>
                                <div><p style="margin: 0 0 0.2rem 0; font-weight: 700; color: #ca0013; font-size: 0.9rem;">Daily Practice</p><p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: #555;">Reset through repetition. Repeatedly choose the new way until it becomes your default.</p></div>
                            </div>
                        </div>
                    </div>
                    <p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;"><strong>There is a moment when everything shifts:</strong> when you see the pattern clearly and decide to interrupt it. That moment—that mental shift—is when transformation begins. Not when life breaks you. Not when you've hit rock bottom. When you choose. Clarity plus decision. That's when you draw the line between who you've been and who you're becoming.</p>
                    <p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;"><strong>One decision starts it.</strong> Choosing every day makes it stick. Each time you interrupt the old pattern and choose differently, you strengthen the new pathway. Over time, those choices compound. They stop feeling like effort and start feeling like who you are. That's the <strong>identity shift</strong>: the accumulation of daily choices that rewires what's been running on autopilot—until the new way becomes who you are without trying.</p>
                    <p class="content-text" style="margin-bottom: 2rem; color: #000; font-weight: 600; line-height: 1.7;">You've seen your pattern. That's the clarity. The decision is yours. The workbook supports that choice.</p>

                    <h4 class="how-developed-title" style="color: #ca0013; font-weight: 700; margin-bottom: 0.75rem;">Before Your Reset</h4>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; font-size: 0.95rem; line-height: 1.6;">Things to know before you begin:</p>
                    <ul style="margin: 0 0 2rem 0; padding-left: 1.5rem; line-height: 1.8; color: #333;">
                        <li style="margin-bottom: 0.75rem;"><strong>You're not broken.</strong> There's nothing wrong with you. Your pattern isn't a flaw—it's something you developed to survive.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Self-compassion beats self-criticism.</strong> Criticism fuels shame and keeps you stuck. Compassion builds resilience and supports transformation.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Own who you are. You're already enough.</strong> Stop waiting to be perfect. Worth isn't earned through perfection—it's inherent. When you own who you are now, things become easier.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Step back from the inner critic.</strong> See yourself as a kind observer would: from a distance, with kindness. Radical self-acceptance, not judgment.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Choose to change from self-love.</strong> Make decisions from who you're becoming.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>Keep your word to yourself.</strong> Follow through on what you commit to. Integrity builds self-trust.</li>
                        <li style="margin-bottom: 0.75rem;"><strong>This workbook isn't about fixing you.</strong> It's about becoming who you already are at your core: complete and whole, not defined by the patterns that keep you stuck.</li>
                        <li style="margin-bottom: 0;"><strong>Progress over perfection.</strong> Aligned action is what matters. Change takes time; your brain needs it. You can't rush lasting change. Patience is what makes it stick.</li>
                    </ul>
                    
                    <div style="margin-bottom: 2rem;">
                        <h4 class="how-developed-title" style="color: #ca0013; font-weight: 700; margin-bottom: 0.75rem;">10 Principles for Transformation</h4>
                        <p class="content-text" style="margin-bottom: 0;">These principles explain how transformation works. They draw on neuroscience, psychology, and behavior change research. Expand any to learn why each one matters.</p>
                        <details class="principles-outer">
                            <summary class="principles-trigger">
                                <span>Expand to learn the 10 principles</span>
                                <span class="principle-chevron" aria-hidden="true">▶</span>
                            </summary>
                            <div class="principles-list">
                                <details class="principle-card">
                                    <summary><span>Your Brain Doesn't Know What's Real—It Believes What You Repeat</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">If you keep saying "I'm broke" or "There are no good men out there," your brain goes, I got it—and life keeps proving you right. Understanding this principle helps you notice what you've been repeating so you can choose new patterns.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Feelings Matter More Than Thoughts</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">You don't manifest what you want—you manifest what feels normal to you. If you feel that love is unsafe, you might keep attracting emotionally unavailable people. This is why feeling the cost of your pattern creates the emotional charge needed for real change.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Your Subconscious Runs 95% of Your Life</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">If it's programmed for lack or struggle, logic won't fix it. But repetition plus emotion can rewire it. For example, if you grew up watching financial struggle and your subconscious learned that was normal, you may keep recreating it until you stop that loop and reprogram it. Understanding this principle helps you work with your subconscious, not just logic.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Your Nervous System Decides What You Attract</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">If you're always stressed and in survival mode, you will manifest survival, not abundance. When your nervous system feels calm about what you want, that's when it can draw it in. Understanding this principle helps you see why your pattern interrupt—moving out of survival mode and into choice—matters.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Identity Is the True Magnet</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">Ask yourself: Who would you be if you already had all that you wanted? Who would you be if it had already worked out? If you keep seeing yourself as someone who doesn't get love, that's what you'll manifest more of. Understanding this principle helps you shift your identity first, then act from that place.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Your Brain Learns Through Imagination</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">Your mind rehearses your future. If you keep imagining failure, your brain prepares you for that exactly. If you vividly imagine who you're becoming, your brain prepares for that instead. Understanding this principle helps you see why rehearsing your future matters.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Consistency Beats Intensity</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">One single affirmation won't rewire years of conditioning, but small shifts daily can. If you only focus on change when you're panicking, that stress becomes the pattern in your mind. Understanding this principle helps you see why consistent daily practice—not occasional intensity—rewires neural pathways more effectively.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Doubt Doesn't Stop Transformation. Fear Does.</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">Fear keeps you stuck. If you're scared of being abandoned, you might unconsciously keep pushing people away. Fear activates survival mode, reinforcing the old pattern. Understanding this principle helps you name your fear and choose awareness anyway.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Actions Matter, But Aligned Action</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">Never force anything. Inspired action feels natural, obvious, not exhausting. When you take action from the new version of yourself, it becomes much simpler. But if your actions come from desperation, the results will also come from desperation. Understanding this principle helps you identify what the person you're becoming would do—that's aligned action.</div>
                                </details>
                                <details class="principle-card">
                                    <summary><span>Your Environment Reinforces Your Beliefs</span><span class="principle-chevron" aria-hidden="true">▶</span></summary>
                                    <div class="principle-copy">If your surroundings reflect chaos and lack, your nervous system stays there. If your environment reflects who you're becoming, it reinforces your new identity. Understanding this principle helps you see why your surroundings constantly influence you.</div>
                                </details>
                            </div>
                            <p class="principles-footer">Neuroscience shows 21–66 days of consistent practice rewires neural pathways. These principles are for awareness and education. The workbook gives you a structure to apply them.</p>
                        </details>
                    </div>
            </div>
            
                <!-- Bridge to workbook -->
                <div style="margin-bottom: 3rem;">
                    <div style="margin-bottom: 0; padding: 1.25rem; background: rgba(202, 0, 19, 0.06); border-radius: 8px; border-left: 4px solid rgba(202, 0, 19, 0.3);">
                        <p class="content-text" style="margin-bottom: 0; color: #000; font-weight: 600; line-height: 1.7;"><span style="color: #ca0013;">This is where your transformation begins.</span> The quiz gave you awareness; the workbook gives you the structure. One day, one reset. All it takes is a decision—a choice. Break your pattern. Create your after. The moment is now.</p>
                    </div>
                </div>
                
                <!-- Workbook: visible box, Parts 1–4 collapsible inside -->
                <div class="workbook-outer-box">
                    <h3 class="workbook-outer-title">Your <span style="color: #ca0013;">Pattern Reset</span> Workbook</h3>
                    <div class="workbook-outer-content">
                        ${getMergedHowToBreakPattern(pattern, firstName, archetype, birthDate, exactAge)}
                    </div>
                </div>
                
                <!-- Continue Your Transformation - Modern CTA Section -->
            <div class="cta-section">
                    <div class="cta-header">
                        <h4 class="cta-title">Continue Your Transformation</h4>
                        <p class="cta-description">You've drawn the line. Save your workbook so you can return anytime. When your pattern shows up, use your interrupt and choose differently—every practice builds new habits.</p>
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
                        </div>
                    </div>

                    <div class="cta-invite-container">
                        <div class="cta-invite-card">
                            <span class="cta-invite-icon"><i class="fas fa-paper-plane"></i></span>
                            <div class="cta-invite-content">
                                <p class="cta-invite-title">Invite Someone to Take the Quiz</p>
                                <p class="cta-invite-subtitle">They'll get their own results and workbook.</p>
                            </div>
                            <button type="button" class="cta-invite-btn" id="cta-invite-quiz-btn">
                                <span class="cta-invite-btn-text">Copy Quiz Link</span>
                                <span class="cta-invite-btn-icon"><i class="fas fa-link"></i></span>
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

    // Life-area affirmations (Part 3) — science-backed subconscious rewiring per area
    const PATTERN_ROBOTIC_AFFIRMATIONS_BY_AREA = {
        'The Escaper': { love: 'I am someone who stays present in intimacy. I feel emotions fully and I am safe when I feel.', money: 'I am someone who faces financial reality with calm clarity. I meet what is without fleeing.', health: 'I am someone who stays with my body and its signals. I feel what I feel and I am safe.', career: 'I am someone who shows up for difficult conversations and hard tasks. I face, I don\'t flee.', identity: 'I am worthy of feeling. I am safe when I am present with myself.', purpose: 'I am someone who moves toward what matters instead of numbing. I am aligned.', lifestyle: 'I am someone who chooses presence over escape. I live fully in each moment.' },
        'The Fixer': { love: 'I am someone who listens without fixing. I trust others to own their part.', money: 'I am someone who lets others manage their own finances. I stay out of what isn\'t mine.', health: 'I am someone who cares for myself first. I allow others to handle their own health.', career: 'I am someone who delegates and trusts. I don\'t take over what belongs to others.', identity: 'I am worthy when I don\'t fix. I am safe when others struggle.', purpose: 'I am someone who allows rather than controls. I am aligned.', lifestyle: 'I am someone who receives as much as I give. I live with ease.' },
        'The Perfectionist': { love: 'I am someone who connects without perfecting. Good enough is enough.', money: 'I am someone who makes decisions without endless analysis. I choose and move.', health: 'I am someone who rests without guilt. I am enough as I am.', career: 'I am someone who ships before it\'s perfect. Progress over perfection.', identity: 'I am worthy without achieving. I am enough.', purpose: 'I am someone who accepts and acts. I am aligned.', lifestyle: 'I am someone who chooses self-acceptance over perfection. I live with peace.' },
        'The Overthinker': { love: 'I am someone who acts from the heart. I show up before I have all the answers.', money: 'I am someone who takes informed action. I move before over-analyzing.', health: 'I am someone who acts on my body\'s needs. I don\'t overthink self-care.', career: 'I am someone who does before I know. Action is my teacher.', identity: 'I am worthy when I act. I am safe when I move.', purpose: 'I am someone who acts toward what matters. I am aligned.', lifestyle: 'I am someone who chooses action over analysis. I live fully.' },
        'The Pleaser': { love: 'I am someone who speaks my truth. I say no when I mean no.', money: 'I am someone who sets financial boundaries. I give from choice, not obligation.', health: 'I am someone who honors my limits. I rest when I need to.', career: 'I am someone who declines what doesn\'t serve me. My time has value.', identity: 'I am worthy when I say no. I am safe when I prioritize myself.', purpose: 'I am someone who keeps healthy boundaries. I am aligned.', lifestyle: 'I am someone who chooses honesty over approval. I live authentically.' },
        'The Performer': { love: 'I am someone who shows up as myself. I am loved for who I am, not what I achieve.', money: 'I am someone who creates value without performing. My worth isn\'t tied to recognition.', health: 'I am someone who rests without proving. I don\'t need to earn rest.', career: 'I am someone who works from purpose, not applause. I am enough without the spotlight.', identity: 'I am worthy without achievement. I am enough as I am.', purpose: 'I am someone who chooses authenticity over image. I am aligned.', lifestyle: 'I am someone who lives for myself first. I live freely.' },
        'The Guarded One': { love: 'I am someone who opens up when it\'s safe. I share what I feel.', money: 'I am someone who asks for what I need. I receive support.', health: 'I am someone who lets others in. I don\'t have to carry it alone.', career: 'I am someone who shares my ideas and feelings. I am safe when I\'m seen.', identity: 'I am worthy of being known. I am safe when I\'m vulnerable.', purpose: 'I am someone who opens when it\'s safe. I am aligned.', lifestyle: 'I am someone who chooses connection over protection. I live openly.' },
        'The Overgiver': { love: 'I am someone who receives love fully. I let others give to me.', money: 'I am someone who receives abundance. I am worthy of financial ease.', health: 'I am someone who receives care. I don\'t have to earn rest or support.', career: 'I am someone who accepts help and recognition. I receive as much as I give.', identity: 'I am worthy when I receive. I am enough without overgiving.', purpose: 'I am someone who balances giving and receiving. I am aligned.', lifestyle: 'I am someone who chooses receiving over proving. I live in balance.' }
    };
    PATTERN_ROBOTIC_AFFIRMATIONS_BY_AREA['Withdrawer'] = PATTERN_ROBOTIC_AFFIRMATIONS_BY_AREA['The Guarded One'];

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
            'At work, you keep your distance from colleagues, avoiding deeper connection.',
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
            'At work, you keep your distance from colleagues, avoiding deeper connection.',
            'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
            'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
        ]
    };

    // Get "You said..." mirror line from Love Q0, with fallback to Money Q4 or Identity Q12
    function getMirrorLine(answers, quizData, pattern) {
        if (!answers || !Array.isArray(answers) || !quizData || quizData.length === 0) return '';
        const pName = pattern && pattern.name ? pattern.name : '';
        const mirrorPairs = [
            { qIndex: 0, prompt: 'when someone pulls away you' },
            { qIndex: 5, prompt: 'when a money problem hits you' },
            { qIndex: 12, prompt: 'when you think about your direction in life you' }
        ];
        for (const { qIndex, prompt } of mirrorPairs) {
            if (qIndex >= quizData.length) continue;
            const ans = answers[qIndex];
            if (ans === undefined || !quizData[qIndex] || !quizData[qIndex].options) continue;
            const opt = quizData[qIndex].options[ans];
            if (!opt || !opt.text) continue;
            return `You told us ${prompt} "${opt.text}"—that's your ${pName} pattern in action.`;
        }
        return '';
    }

    // Get connecting-the-dots line: childhood → Love/Money (As a child, I felt safest when)
    // Uses QUESTION_DOMAINS.CHILDHOOD for correct index (index 31 in 47-question quiz, 17 in 28-question quiz)
    function getConnectingDotsLine(answers, quizData, pattern) {
        if (!answers || !Array.isArray(answers) || !quizData || quizData.length === 0) return '';
        const domains = (window.QUIZ_CONFIG && window.QUIZ_CONFIG.QUESTION_DOMAINS) || {};
        const childhoodDomain = domains.CHILDHOOD || { start: 16, end: 21 };
        const candidateIndices = [childhoodDomain.start + 1, 17];
        let qIndex = -1;
        for (const idx of candidateIndices) {
            if (idx < quizData.length && quizData[idx] && quizData[idx].question && quizData[idx].question.indexOf('felt safest when') !== -1) {
                qIndex = idx;
                break;
            }
        }
        if (qIndex === -1) return '';
        const q = quizData[qIndex];
        const ans = answers[qIndex];
        if (ans === undefined || !q.options) return '';
        const opt = q.options[ans];
        if (!opt || !opt.text) return '';
        let text = opt.text
            .replace(/^I was\s/i, 'you were ')
            .replace(/^I could\s/i, 'you could ')
            .replace(/^I am\s/i, 'you are ')
            .replace(/^I need\s/i, 'you need ')
            .replace(/^I needed\s/i, 'you needed ')
            .replace(/^I had\s/i, 'you had ')
            .replace(/^I felt\s/i, 'you felt ')
            .replace(/\bmy\b/gi, 'your');
        if (text.length > 80) text = text.substring(0, 77) + '...';
        const phrase = text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '');
        return `In childhood you felt safest when ${phrase}. Same strategy—now running your relationships, money, and health.`;
    }

    // Build "What it looks like" — POV mirror moment: day-in-the-life, habits, mindset, cost, stuck loop
    // Unique per pattern; no repetition with opening, Behind it, or connecting dots
    function getWhatItLooksLike(pattern, archetype, complex) {
        const pName = pattern && pattern.name ? pattern.name : '';
        const prim = complex && complex.primary ? complex.primary : null;
        const sec = complex && complex.secondary ? complex.secondary : null;
        const archetypeName = archetype && archetype.name ? archetype.name : '';

        const looksLikeByPattern = {
            'Fixer': 'You wake up scanning for problems to solve—someone\'s upset, a project slipping, a friend struggling. You step in, take over, offer advice before they ask. You see people as needing you, and that feels safe. The cost: you\'re exhausted, relationships feel one-sided, and you\'ve lost track of your own dreams because you\'re managing everyone else\'s. The more you fix, the more they rely on you—and the more you burn out. Success and fulfillment get deferred while you overfunction.',
            'Perfectionist': 'You wake up with a mental checklist—every task has to be "right" before you start or finish. You edit, revise, second-guess. You see the world as a judge and yourself as never quite good enough. The cost: opportunities pass while you\'re still preparing; you never feel satisfied; you burn out from the internal pressure. The need to be perfect keeps you paralyzed—acting feels risky, so you analyze instead, and life moves on without you.',
            'Pleaser': 'You wake up attuned to everyone else\'s needs—your partner, your boss, your friend. You shape your day around what they want and say yes when you want to say no. You see people as needing to be kept happy; your own needs feel secondary. The cost: you\'ve lost yourself, resentment builds, relationships feel hollow because they\'re built on a version of you that isn\'t real. The more you please, the more they expect—and the more you resent. Fulfillment gets buried while you perform.',
            'Performer': 'You wake up needing to prove something—today you\'ll achieve, impress, show your worth. You dress for the part, say the right things, grind. You see the world as an audience and yourself as only as valuable as your last win. The cost: you feel exhausted when the applause stops; relationships feel shallow because they love the performance, not the real you; success never satisfies because there\'s always another bar to clear. You\'re stuck because being "ordinary" feels terrifying, so you keep performing, and authentic happiness stays out of reach.',
            'Escaper': 'You wake up and reach for distraction—scroll, busywork, anything but the hard conversation or the difficult feeling. When things get real, you "remember" something else you need to do. You see emotions as dangerous; staying busy feels like safety. The cost: you\'re disconnected from yourself and others; relationships stay surface-level; success stalls because you avoid the hard steps. The more you escape, the more the unresolved piles up—and the more overwhelming it feels. Real fulfillment never lands because you\'re never fully present.',
            'Overthinker': 'You wake up in your head—every decision gets analyzed, every text decoded, every move second-guessed. You see the world as a puzzle to solve and action as risky until you\'ve thought it through. The cost: opportunities pass while you\'re still thinking; relationships suffer from over-analysis; success stalls because you never take the leap. The more you analyze, the more options appear—and the harder it gets to act. You\'re stuck because thinking feels safe and acting feels dangerous, so you stay in your head while life passes you by.',
            'Withdrawer': 'You wake up protective—when someone gets close, you pull back. You keep a safe distance emotionally; connection feels risky. You see people as potential sources of pain; distance feels like safety. The cost: you\'re alone even when you\'re not; relationships stay shallow; success feels hollow without someone to share it with. The more you protect yourself, the lonelier you become—and the more you believe connection is dangerous. You\'re stuck because vulnerability feels life-threatening, so you keep your distance, and the connection you want stays out of reach.',
            'Overgiver': 'You wake up ready to give—time, energy, money, attention. You pour it out, hoping they\'ll see your worth and stay. You see love as something you must earn; yourself as only valuable when you\'re needed. The cost: you\'re depleted and resentful; relationships feel unequal; success and happiness get sacrificed for others. The more you give, the more they take—and the more resentful you become. You\'re stuck because stopping feels like abandonment, so you keep giving, and your own life gets smaller.',
            'The Guarded One': 'You wake up protective—when someone gets close, you pull back. You keep a safe distance emotionally; connection feels risky. You see people as potential sources of pain; distance feels like safety. The cost: you\'re alone even when you\'re not; relationships stay shallow; success feels hollow without someone to share it with. The more you protect yourself, the lonelier you become—and the more you believe connection is dangerous. You\'re stuck because vulnerability feels life-threatening, so you keep your distance, and the connection you want stays out of reach.',
            'Guarded One': 'You wake up protective—when someone gets close, you pull back. You keep a safe distance emotionally; connection feels risky. You see people as potential sources of pain; distance feels like safety. The cost: you\'re alone even when you\'re not; relationships stay shallow; success feels hollow without someone to share it with. The more you protect yourself, the lonelier you become—and the more you believe connection is dangerous. You\'re stuck because vulnerability feels life-threatening, so you keep your distance, and the connection you want stays out of reach.'
        };

        let text = looksLikeByPattern[pName] || looksLikeByPattern['Fixer'];
        if (prim) {
            text += ' Your ' + prim + ' amplifies this—beliefs that drove you then, still driving you now.';
            if (sec) text += ' Your ' + sec + ' adds another layer, making the pattern feel even more automatic.';
        }
        return text;
    }

    // Build "What powers it" text: driver % + short validation/survival line (trimmed for brevity)
    function getWhatPowersItText(pattern, patternInfo, sortedDrivers, driverPercentages, driverNames) {
        const d = sortedDrivers && sortedDrivers.length > 0 ? sortedDrivers[0][0] : 'control';
        const pct = driverPercentages && driverPercentages[d] ? driverPercentages[d] : 0;
        const d2 = sortedDrivers && sortedDrivers.length > 1 ? sortedDrivers[1][0] : null;
        const pct2 = d2 && driverPercentages && driverPercentages[d2] ? driverPercentages[d2] : 0;
        const dn = driverNames || { control: 'Control', avoidance: 'Avoidance', validation: 'Validation', 'fear-of-rejection': 'Fear of Rejection' };
        let opening = `Your ${pattern.name} pattern is powered primarily by ${dn[d]} (${pct}%)`;
        if (d2 && pct2 >= 15) opening += `, with ${dn[d2]} (${pct2}%) also influencing you`;
        else opening += '—your primary emotional driver';
        opening += '. What once kept you safe is now running on autopilot—and limiting you.';
        return opening;
    }

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
                description: 'The need to manage situations and outcomes to feel safe. Activates when things feel chaotic or unpredictable—you take charge instinctively.',
                howItApplies: `As ${archetype.name}, your control driver (${driverPercentages['control'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you take charge and create structure when you feel unsafe.`,
                impact: dominantDriver === 'control' ? 'Primary force behind your pattern.' : `Influences ${driverPercentages['control'] || 0}% of decisions—surfaces when you need to feel in charge.`
            },
            'avoidance': {
                title: 'Avoidance Driver',
                description: 'The need to stay free and avoid discomfort to feel safe. Activates when emotions or commitment feel threatening—you move, numb, or stay flexible.',
                howItApplies: `As ${archetype.name}, your avoidance driver (${driverPercentages['avoidance'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you stay mobile and avoid commitment when you feel unsafe.`,
                impact: dominantDriver === 'avoidance' ? 'Primary force behind your pattern.' : `Influences ${driverPercentages['avoidance'] || 0}% of decisions—surfaces when you need to feel free.`
            },
            'validation': {
                title: 'Validation Driver',
                description: 'The need for approval and recognition to feel worthy. Activates when you feel unseen—you achieve, perform, or please to earn acceptance.',
                howItApplies: `As ${archetype.name}, your validation driver (${driverPercentages['validation'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you perform and earn approval when you feel unsafe.`,
                impact: dominantDriver === 'validation' ? 'Primary force behind your pattern.' : `Influences ${driverPercentages['validation'] || 0}% of decisions—surfaces when you need to feel valued.`
            },
            'fear-of-rejection': {
                title: 'Fear of Rejection Driver',
                description: 'The need to protect yourself from hurt or abandonment. Activates when vulnerability feels dangerous—you distance, perfect, or give to prevent rejection.',
                howItApplies: `As ${archetype.name}, your fear of rejection driver (${driverPercentages['fear-of-rejection'] || 0}%) shows up as ${pattern.name.toLowerCase()}—you keep boundaries and protect yourself when you feel unsafe.`,
                impact: dominantDriver === 'fear-of-rejection' ? 'Primary force behind your pattern.' : `Influences ${driverPercentages['fear-of-rejection'] || 0}% of decisions—surfaces when you need to protect yourself.`
            }
        };
        
        return `
            <div class="emotional-drivers-breakdown">
                <h3 class="drivers-section-title">Your 4 Emotional Drivers & How They Apply to You</h3>
                <p class="drivers-intro">Your 4 emotional drivers are survival strategies—what you learned to do to feel safe. Each one shows up differently in your ${pattern.name} pattern:</p>
                
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
                whatItIs: 'When things feel out of control, you step in—fixing, solving, taking charge, even when it\'s not yours to fix. You believe fixing keeps you safe.',
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
                whatItIs: 'When there\'s a decision to make, you stall—analyzing, perfecting, waiting for the right moment. You believe perfection will protect you, but it keeps you paralyzed.',
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
                whatItIs: 'When someone asks, you say yes—even when you want to say no. You shape yourself around what they want and lose yourself in the process.',
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
                quickDesc: 'You work to impress and achieve so you feel worthy and belong.',
                whatItIs: 'When you feel unseen, you push harder—achieving, impressing, proving your worth. The applause stops and you feel empty.',
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
                whatItIs: 'When things get hard, you move—busy, distracted, anywhere but here. You stay moving so you don\'t have to sit with what you feel.',
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
                whatItIs: 'When there\'s a choice to make, you stay in your head—analyzing, researching, figuring it out. You believe thinking will keep you safe, but it keeps you paralyzed.',
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
                whatItIs: 'When someone gets close, you pull away. You want connection but closeness feels dangerous—so you protect yourself and end up alone.',
                howItsUnique: 'What makes your Withdrawer pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Withdrawer pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding deeper connection.',
                    'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
                    'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
                ]
            },
            'Overgiver': {
                quickDesc: 'You give more than you receive, hoping they\'ll see your worth and stay.',
                whatItIs: 'When you want to be loved, you give everything—time, energy, gifts—hoping they\'ll see your worth. You\'re depleted, resentful, and they still don\'t reciprocate.',
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
                whatItIs: 'When someone gets close, you pull away. You want connection but closeness feels dangerous—so you protect yourself and end up alone.',
                howItsUnique: 'What makes your Guarded One pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Guarded One pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding deeper connection.',
                    'With finances, you hoard money, afraid to spend or invest, keeping everything "safe."',
                    'In your health, you isolate yourself when you\'re struggling with health, not asking for help.'
                ]
            },
            'Guarded One': {
                quickDesc: 'You pull away and protect yourself when someone gets too close.',
                whatItIs: 'When someone gets close, you pull away. You want connection but closeness feels dangerous—so you protect yourself and end up alone.',
                howItsUnique: 'What makes your Guarded One pattern unique is how it shows up in your specific life areas. Your answers revealed that you respond to stress by withdrawing, protecting yourself, and keeping emotional distance. This pattern is powered by your Fear of Rejection driver, which makes you feel safe when you\'re independent and disconnected.',
                whatPowersIt: (driver) => `Your Guarded One pattern is powered by your fear of rejection (${driver} driver). When you feel stressed or uncertain, your Fear of Rejection driver activates, making you pull away to protect yourself. This was a survival strategy that worked—it protected you from hurt—but now it's causing you to isolate and miss deep connections.`,
                origin: 'This pattern likely developed in childhood when you learned that vulnerability was dangerous. Maybe you were rejected when you opened up, or you learned that independence was safer than connection.',
                currentState: 'Right now, you\'re likely pushing people away when they get too close, protecting yourself, but creating the loneliness you fear. You want connection but don\'t know how to open up safely.',
                dailyLifeExamples: [
                    'In relationships, when your partner gets too close, you pull away emotionally.',
                    'At work, you keep your distance from colleagues, avoiding deeper connection.',
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
                    ${(function() {
                        const mirrorLine = getMirrorLine(answers, quizData || window.quizData || [], pattern);
                        return mirrorLine ? `<p class="content-text" style="color: #333; margin: 0 0 1rem 0; font-style: italic;">${mirrorLine}</p>` : '';
                    })()}
                    <!-- Behind it - Top driver percentages + short survival line -->
                    <p class="content-text" style="margin: 0 0 1rem 0;">
                        <strong style="color: #000;">Behind it:</strong> ${getWhatPowersItText(pattern, patternInfo, sortedDrivers, driverPercentages, { control: 'Control', avoidance: 'Avoidance', validation: 'Validation', 'fear-of-rejection': 'Fear of Rejection' })}
                    </p>

                    <!-- What it looks like - day in the life, pattern-specific, personalized with complex -->
                    <p class="content-text" style="margin: 0 0 1rem 0;">
                        <strong style="color: #000;">What it looks like:</strong> ${getWhatItLooksLike(pattern, archetype, complex)}
                    </p>
                    ${(function() {
                        const dotsLine = getConnectingDotsLine(answers, quizData || window.quizData || [], pattern);
                        return dotsLine ? `<p class="content-text" style="color: #333; margin: 0 0 1rem 0; font-weight: 500;">${dotsLine}</p>` : '';
                    })()}
                    <!-- Where you'll see it (pointer to How This Impacts Your Life) -->
                    <p class="content-text" style="color: #555; margin: 1rem 0 0 0;">
                        Seeing it clearly is the first step. Open <strong>How This Impacts Your Life</strong> below for where it hits hardest in each area.
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
                                As ${archetype.name}, your pattern is ${pattern.name}—the way your ${archetypeDriverPhrase} shows up in daily life.
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
                                That pathway strengthened with repetition—and it can rewire with consistent new practice.
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

        // How Everything Connects - box only + caption (per user: only keep the box, add caption if needed)
        let explanation = '';
        explanation += `<div style="margin: 1rem 0; padding: 1rem; background: rgba(0, 0, 0, 0.02); border-radius: 6px; border-left: 3px solid #ca0013;">`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Emotional Drivers</strong> (${driverListText}) are what you learned to do to feel safe. They're your survival strategies.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Complexes</strong> (${complex.primary || 'complex'}${complex.secondary ? ' + ' + complex.secondary : ''}) are the beliefs that developed from those strategies. They're like the "rules" your brain follows.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0 0 0.5rem 0; line-height: 1.6;"><strong>Your Pattern</strong> (${pattern.name}) is what you actually do—the behavior that shows up when you're triggered.</p>`;
        explanation += `<p style="font-size: 0.95rem; color: #555; margin: 0; line-height: 1.6;"><strong>Your Archetype</strong> is your style—how all of this shows up in your life.</p>`;
        explanation += `</div>`;
        explanation += `<p style="font-size: 0.9rem; color: #666; margin: 0.75rem 0 0 0; line-height: 1.6; font-style: italic;">Understanding this flow helps you see why interrupting your pattern requires working with your drivers and complexes—not just changing surface behavior.</p>`;

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
    function getComprehensiveHeroContent(archetype, pattern, patternDominance, dominanceLabel, answers, sortedDrivers, driverPercentages, firstName, exactAge, relationshipStatus, quizData, birthDate) {
        const dominantDriver = sortedDrivers[0][0];
        const dominantPercent = driverPercentages[dominantDriver];
        const complex = pattern.complex || {};
        
        return `
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid rgba(0, 0, 0, 0.1);">
                <!-- Strengths, Triggers, Consequences -->
                ${getStrengthsTriggersConsequences(pattern, archetype, complex)}
                
                <!-- How It Impacts Your Life -->
                ${getHowItImpactsYourLife(pattern, archetype, complex, patternDominance, firstName, sortedDrivers, driverPercentages, exactAge, relationshipStatus, birthDate)}
                
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
    function getHowItImpactsYourLife(pattern, archetype, complex, patternDominance, firstName, sortedDrivers, driverPercentages, exactAge, relationshipStatus, birthDate) {
        // Get dominant driver info
        const dominantDriver = sortedDrivers && sortedDrivers[0] ? sortedDrivers[0][0] : 'control';
        const dominantPercent = driverPercentages && driverPercentages[dominantDriver] ? driverPercentages[dominantDriver] : 30;
        
        // Life areas with icons and detailed impact
        const lifeAreas = [
            {
                id: 'love',
                icon: '💕',
                title: 'Love & Relationships',
                getImpact: () => getLifeAreaImpact('love', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'money',
                icon: '💰',
                title: 'Money & Finances',
                getImpact: () => getLifeAreaImpact('money', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'health',
                icon: '🏃',
                title: 'Health & Habits',
                getImpact: () => getLifeAreaImpact('health', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'career',
                icon: '💼',
                title: 'Career & Work',
                getImpact: () => getLifeAreaImpact('career', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'identity',
                icon: '🎭',
                title: 'Identity & Self-Worth',
                getImpact: () => getLifeAreaImpact('identity', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'purpose',
                icon: '🎯',
                title: 'Purpose & Goals',
                getImpact: () => getLifeAreaImpact('purpose', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'lifestyle',
                icon: '🌱',
                title: 'Lifestyle & Daily Habits',
                getImpact: () => getLifeAreaImpact('lifestyle', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
            },
            {
                id: 'productivity',
                icon: '⏰',
                title: 'Productivity & Time',
                getImpact: () => getLifeAreaImpact('productivity', pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate)
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
    
    // Optional one-sentence insight from birthdate (Sun/Moon). No astrology mentioned on front end.
    function getLifeAreaInsight(area, birthDate) {
        if (!birthDate || !window.AstrologyUtils) return '';
        var moonSign = window.AstrologyUtils.getMoonSign(birthDate);
        var sunSign = window.AstrologyUtils.getSunSign(birthDate);
        var moonAreas = ['love', 'money', 'health', 'lifestyle', 'productivity'];
        var sunAreas = ['identity', 'purpose', 'career'];
        if (moonAreas.indexOf(area) !== -1 && moonSign) return window.AstrologyUtils.getMoonInsight(moonSign) || '';
        if (sunAreas.indexOf(area) !== -1 && sunSign) return window.AstrologyUtils.getSunInsight(sunSign) || '';
        return '';
    }
    
    // Helper function to generate condensed impact format
    function generateCondensedImpact(summary, challenge, benefit, solution) {
        const solutionBlock = solution ? `<p class="solution-text" style="margin-top: 1rem; padding: 1rem; background: #fffcf1; border-left: 3px solid #d4a84b; border-radius: 4px; font-size: 0.95rem; line-height: 1.6;"><strong style="color: #000;">How to overcome:</strong> ${solution}</p>` : '';
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${summary}</p>
                    ${solutionBlock}
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
    
    // Generate detailed impact for each life area (birthDate optional for Sun/Moon insight)
    function getLifeAreaImpact(area, pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate) {
        const impactData = {
            love: getLoveImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate),
            money: getMoneyImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            health: getHealthImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            career: getCareerImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            identity: getIdentityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            purpose: getPurposeImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            lifestyle: getLifestyleImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate),
            productivity: getProductivityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate)
        };
        
        return impactData[area] || '<p>Impact data not available for this area.</p>';
    }
    
    // Condensed impact functions - Summary = behavior + consequence; Challenge = belief, cost, or loop only (no repeat of summary)
    function getImpactLookupName(patternName) {
        return (patternName === 'The Guarded One' || patternName === 'Guarded One') ? 'Withdrawer' : patternName;
    }
    function getLoveImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, relationshipStatus, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: relationshipStatus === 'single' 
                    ? 'Your ' + pattern.name + ' pattern makes you jump in to "fix" dates who seem lost, believing solving their problems will make them stay. They pull away when they feel controlled, leaving you confused about why relationships don\'t work.'
                    : 'Your ' + pattern.name + ' pattern makes you immediately solve your partner\'s problems—even when they need to handle it themselves. Resentment builds: you feel unappreciated, they feel controlled.',
                challenge: 'A part of you believes you\'re only valuable when you\'re fixing things—so stepping back feels like losing your role.',
                benefit: 'You stop fixing and start listening. Balanced partnership replaces overfunctioning—both of you show up, support each other, and feel seen. The relationship deepens because you\'re no longer carrying it alone; trust and intimacy grow when you let them step in.',
                solution: (p, arch, cplx, rel) => 'Use the "pause-and-ask" rule: when your partner or a date shares a problem (their job stress, family conflict, anything they\'re struggling with), pause before offering solutions. Say: "Do you want my help figuring this out, or do you just need me to listen?" Most people want to be heard first—when you listen and reflect back ("That sounds really frustrating"), they feel seen. That builds intimacy faster than fixing. Your Anchor need for control is satisfied when you choose when to step in; stepping back when they want listening teaches your brain that connection can happen without you solving everything.'
            },
            'Perfectionist': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you analyze every potential partner for flaws and overthink every text and date. You end up alone because no one meets your standards.'
                    : 'Your ' + pattern.name + ' pattern makes you overthink every decision together, trying to make the "right" choice. Paralysis and missed opportunities follow; your partner feels they can\'t measure up.',
                challenge: 'You never feel safe enough to choose, so you stay in analysis instead of connection.',
                benefit: 'You choose instead of analyze. Real connection replaces the chase for "perfect"—you show up as you are, accept them as they are, and build a relationship based on presence, not impossible standards. The paralysis lifts; love becomes possible.',
                solution: (p, arch, cplx, rel) => 'Set a "good enough" deadline: 3 dates or 3 weeks, then decide. Example: if you\'re dating, after date 3, ask yourself "Do I enjoy being with them?"—not "Are they perfect?" If you\'re in a relationship and stuck on a decision (where to live, how to spend the weekend), give yourself 48 hours, then pick the "good enough" option. Why it works: your brain is wired to find flaws when you analyze endlessly; committing to a timeframe forces you to feel instead of judge. The more you practice choosing despite imperfection, the less paralysis controls your love life.'
            },
            'Pleaser': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you say yes to dates you\'re not interested in and shape yourself to what they want. They leave when they realize it\'s not the real you.'
                    : 'Your ' + pattern.name + ' pattern makes you say yes to everything your partner wants, even when exhausted. Resentment grows and you lose yourself; you don\'t know who you are outside of pleasing them.',
                challenge: 'The more you please to feel safe, the less they know the real you—and the more you need their approval to feel okay.',
                benefit: 'You say no without guilt and yes from desire. The real you shows up—attracting people who love who you actually are. Mutual respect replaces people-pleasing; you feel valued for your authenticity, not your compliance.',
                solution: (p, arch, cplx, rel) => 'Before saying yes to anything—a date, a plan, a request—say: "Let me check my schedule" or "I need to think about it." Buy yourself 24 hours. Then ask: "Do I want this, or am I saying yes to avoid their disappointment?" Examples: say no to one date you\'re not excited about; decline one plan that exhausts you. Your People-Pleasing Complex makes you believe "no" will cause rejection—but the opposite is true. When you say no to what doesn\'t serve you, you attract people who respect boundaries and want the real you, not the version you perform.'
            },
            'Performer': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you work hard to impress dates—achieving, succeeding, showing your best self. They leave when they see the real you; you\'re exhausted from performing.'
                    : 'Your ' + pattern.name + ' pattern makes you work hard to be the "perfect" partner, achieving to earn approval. You\'re exhausted and they don\'t see the real you—performing, not connecting.',
                challenge: 'A part of you believes you\'re only worthy when you\'re impressive—so showing your vulnerable self feels dangerous.',
                benefit: 'You stop performing and start connecting. Others see and love the real you—beyond achievements. Intimacy replaces exhaustion; you feel worthy for who you are, not what you accomplish. The mask comes off; the relationship deepens.',
                solution: (p, arch, cplx, rel) => 'Share one small imperfection or uncertainty per week. Examples: "I was nervous before our date," "I\'m not sure how this will go," "I messed up at work today and it\'s bothering me." Your Catalyst drive for validation makes you hide anything that might reduce your worth—but people bond over shared vulnerability, not polished performance. When you share something imperfect, you give them permission to be real too. The relationship deepens because they finally see you, not the version you\'re performing.'
            },
            'Escaper': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you stay busy, avoid deep conversations, and pull away when things get serious. You want connection but can\'t let yourself have it; intimacy feels threatening.'
                    : 'Your ' + pattern.name + ' pattern makes you avoid conflict—staying busy, numbing feelings, or withdrawing. Distance and unresolved issues grow; your partner feels you\'re not present.',
                challenge: 'Avoiding discomfort keeps you from the very closeness you want, so you stay alone inside the relationship.',
                benefit: 'You stay present through hard conversations instead of escaping. Deep, secure relationships replace surface connections. Partners feel you\'re fully there; you finally feel seen, chosen, and able to receive love without shutting down. The intimacy you\'ve been avoiding becomes real.',
                solution: (p, arch, cplx, rel) => 'When you feel the urge to leave—check your phone, change the subject, or physically exit—commit to staying 5 more minutes. Say: "I need a moment, but I\'m not leaving." Sit with the discomfort. Your Wanderer tendency is to escape when feelings get intense; small doses of "stay" rewire that habit. Start with low-stakes moments: when a conversation gets deep, when your partner shares something emotional. The more you practice staying through discomfort, the less your brain treats intimacy as a threat. Connection becomes possible because you stop running.'
            },
            'Overthinker': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you analyze every text and date, trying to figure out if they\'re "the one" before you know them. You get stuck in analysis paralysis and miss opportunities.'
                    : 'Your ' + pattern.name + ' pattern makes you analyze every interaction, trying to figure out what they "really" mean. Anxiety and distance build; you\'re in your head instead of your heart.',
                challenge: 'Figuring it out feels safer than feeling it—so you stay in your head instead of your heart.',
                benefit: 'You trust your gut and act from your heart. Overthinking gives way to presence—you connect instead of analyze, feel instead of figure out. Relationships feel alive; you move toward what you want instead of staying stuck in your head.',
                solution: (p, arch, cplx, rel) => 'When you catch yourself analyzing ("What did that text mean?" "Are we compatible?"), switch the question: "What do I feel right now?" Place your hand on your chest or belly and name the sensation—anxious, excited, scared, hopeful. Your brain defaults to thinking because it feels safer than feeling; grounding in your body interrupts that loop. In conversation, when you\'re tempted to decode their words, ask instead: "Can you tell me more?" Let them clarify instead of you guessing. Your Wanderer mind wants certainty—but love grows through presence, not analysis.'
            },
            'Withdrawer': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you push people away when they get too close, protecting yourself from rejection but creating the loneliness you fear.'
                    : 'Your ' + pattern.name + ' pattern makes you pull away when your partner gets too close or vulnerable, creating the distance you fear. They feel rejected; you feel misunderstood.',
                challenge: 'Closeness feels like it leads to hurt—so you leave before you can be left.',
                benefit: 'You open up instead of pulling away. Vulnerability becomes possible—you let people in, stay present when they get close, and build the deep connections you\'ve been protecting yourself from. Loneliness ends; real intimacy begins.',
                solution: (p, arch, cplx, rel) => 'Share one small true feeling or need before you pull away. Examples: "I felt hurt when you said that," "I need some space but I\'ll be back," "I\'m scared of getting too close." Your Guardian instinct is to protect through distance—but your Emotional Unavailability Complex keeps you lonelier the more you protect. Small disclosures feel risky, yet they build trust. When you share something real and they stay, your brain learns that closeness doesn\'t always lead to hurt. Start with one sentence per day; the compound effect rewires your avoidance.'
            },
            'Overgiver': {
                summary: relationshipStatus === 'single'
                    ? 'Your ' + pattern.name + ' pattern makes you give everything—time, energy, attention—hoping they\'ll see your worth. They take and leave when you need something; you\'re left resentful and alone.'
                    : 'Your ' + pattern.name + ' pattern makes you give more than you receive, hoping they\'ll reciprocate. You end up resentful and they feel smothered; you don\'t know how to receive love.',
                challenge: 'If you give enough, they\'ll stay and you\'ll finally feel worthy—but the more you give from that place, the more depleted you become.',
                benefit: 'Giving and receiving balance—you receive as much as you give, and feel valued for who you are, not what you provide. Resentment dissolves; the relationship deepens because you\'re no longer depleting yourself to earn love.',
                solution: (p, arch, cplx, rel) => 'Accept one offer of help or care per week—even small ones. When they say "Let me get that," "I\'ll drive," or "What do you need?"—say yes. Don\'t deflect or repay immediately. Your Guardian pattern ties worth to giving; receiving feels like weakness or debt. But allowing them to give does two things: it teaches your brain you\'re worthy of care without earning it, and it deepens the bond because they get to contribute. Start with tiny accepts: "Yes, thank you." The more you practice receiving, the less you need to overgive to feel loved.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const summaryText = data.summary;
        const insight = getLifeAreaInsight('love', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, relationshipStatus) : (data.solution || '');
        const solutionBlock = solutionText ? `<p class="solution-text" style="margin-top: 1rem; padding: 1rem; background: #fffcf1; border-left: 3px solid #d4a84b; border-radius: 4px; font-size: 0.95rem; line-height: 1.6;"><strong style="color: #000;">How to overcome:</strong> ${solutionText}</p>` : '';
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${summaryText}</p>
                    ${solutionBlock}
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${challengeText}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getMoneyImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you feel safe only when fully in control of finances. When money problems hit, you go into "fix mode"—creating plans, tightening systems. The constant control creates stress and prevents you from trusting the process.',
                challenge: 'A part of you believes that if you\'re not in control, things will fall apart—so relaxing around money feels dangerous.',
                benefit: 'Money flows without you micromanaging. Healthy systems replace constant control; you trust the process, delegate, and build security through clarity, not anxiety. Real wealth grows when you stop trying to fix everything yourself.',
                solution: (p, arch, cplx, rel) => 'Pick one financial task that causes the most anxiety—checking statements, paying bills, tracking spending—and automate or delegate it. Examples: set up auto-pay, use a budgeting app that syncs automatically, or have a trusted partner or advisor handle one area. Your Anchor need for control makes you believe you must fix everything yourself—but when you delegate one piece and nothing falls apart, your brain learns that systems can hold without you. Start small; the proof builds trust.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you overthink every financial decision, trying to make the "perfect" choice. You analyze investments and budgets endlessly; paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'Waiting for perfect conditions means you never take the leap—so opportunities pass while you\'re still analyzing.',
                benefit: 'You make confident financial decisions instead of endless analysis. Calculated risks replace paralysis; opportunities no longer pass you by. Wealth builds through action, not perfection—the "right" move becomes the move you take.',
                solution: (p, arch, cplx, rel) => 'Give yourself 48 hours to research any financial decision—then decide. Example: when choosing an investment, savings account, or budget approach, set a timer. At 48 hours, pick the "good enough" option—the one that meets your core needs, not the perfect one. Why it works: more analysis past a point increases anxiety and decreases satisfaction; you end up second-guessing anyway. Your perfectionism keeps you stuck; a deadline forces action. Wealth builds through consistent "good enough" choices, not one perfect move.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you spend money to please others—buying gifts, saying yes to expensive plans, showing you care through spending. You end up financially drained and resentful when others don\'t reciprocate.',
                challenge: 'The more you spend to earn approval, the less you have for yourself—and the more you need their approval to feel okay.',
                benefit: 'Money aligns with your values—you spend on what matters and say no to what doesn\'t. Boundaries replace people-pleasing; you build wealth and give from abundance, not depletion. Your finances reflect who you really are.',
                solution: (p, arch, cplx, rel) => 'Before any social spend—dinner, gifts, group plans—script: "I\'m being mindful about my spending right now, so I\'ll need to pass" or "I\'d love to join for coffee instead of the full dinner." Say it once, clearly. Your Catalyst drive makes you believe saying no will cost you connection—but people respect boundaries more than they resent them. When you decline from a place of self-respect, you attract people who value you, not your wallet. Start with one decline per week.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you spend money to impress—status symbols, expensive experiences, showing your worth through what you own. Financial stress grows and real wealth stays out of reach.',
                challenge: 'Your worth can feel tied to what you have—so spending to look successful feels necessary.',
                benefit: 'Spending stops being performance—you build real wealth aligned with who you are, not who you\'re trying to impress. Value comes from within; you feel worthy without needing to prove it through possessions. Financial freedom replaces exhaustion.',
                solution: (p, arch, cplx, rel) => 'For any purchase over $100, wait 48 hours before buying. During that time, ask: "Am I buying this because I need or love it, or because I want to look successful?" Your Catalyst pattern ties worth to what you have; the cooling-off period separates impulse from intention. Examples: the luxury item, the expensive dinner to impress, the upgrade you don\'t need. When the urge passes, you\'ll often realize you were performing—and that realization weakens the pattern.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you avoid dealing with money—ignoring bills, avoiding budgets, staying busy so you don\'t have to think about finances. Financial chaos grows and security never builds.',
                challenge: 'Opening the statements or making a plan feels overwhelming—so you put it off and the mess grows.',
                benefit: 'You face finances instead of avoiding them. Clarity replaces chaos—sustainable budgets, real security, and the freedom that comes from knowing exactly where you stand. The avoidance ends; the stability begins.',
                solution: (p, arch, cplx, rel) => 'Spend 5 minutes every day on one money task—check your balance, open one bill, or log one expense. Set a daily alarm. Your Wanderer tendency is to stay busy so you don\'t have to feel the discomfort of facing money—but 5 minutes is too small to trigger full escape. Micro-actions build momentum: once you\'ve looked at your balance 7 days in a row, the dread drops. Clarity replaces chaos because you\'re no longer avoiding; you\'re building a habit of presence.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you analyze every financial decision endlessly, trying to figure out the "right" move. You research and compare; paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'Research feels safer than deciding—so you never place the bet and never move forward.',
                benefit: 'You decide and act instead of analyze forever. Confident financial decisions replace paralysis—you take action despite uncertainty and build wealth through consistent choices. The research phase ends; the results phase begins.',
                solution: (p, arch, cplx, rel) => 'Set a "research cap": 2 hours or 3 sources max for any financial decision—then decide. Example: choosing a savings account, investment, or budget tool—give yourself a limit, then pick. Your Wanderer mind believes more information means more safety; but past a point, more info increases anxiety and decreases satisfaction. You end up comparing forever. The cap forces action. Why it works: you\'ll never have perfect certainty; acting despite uncertainty is how wealth builds. The move you take beats the move you never make.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you protect yourself financially by hoarding, avoiding risks, and keeping everything separate. You stay safe but miss building wealth and real partnerships.',
                challenge: 'Trusting others with money feels risky—so you go it alone and limit your options.',
                benefit: 'You take calculated risks instead of hoarding in fear. Wealth builds through smart investments and partnerships; trust replaces isolation. Financial security grows when you stop protecting yourself from opportunity.',
                solution: (p, arch, cplx, rel) => 'Share one financial goal with a trusted friend or advisor this week. Examples: "I\'m trying to save for X," "I\'m nervous about investing," "I\'d like help understanding my options." Your Guardian pattern keeps everything separate because trust feels dangerous—but going it alone caps your growth. Small disclosure is a trust experiment: when you share and they don\'t judge or betray, your brain learns that collaboration can be safe. Start with one person; the compound effect opens doors you\'ve been closing.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you give money away—loaning to friends, paying for others, showing your worth through generosity. You end up financially drained and resentful when others don\'t reciprocate.',
                challenge: 'If you give enough, they\'ll value you—but giving from that place depletes you and attracts takers.',
                benefit: 'You give from abundance, not depletion—boundaries protect your wealth while generosity flows when it truly serves. You attract reciprocity instead of takers; your finances support you instead of draining you.',
                solution: (p, arch, cplx, rel) => 'When tempted to give money—a loan, covering dinner, buying a gift—give 10% of what you\'re tempted to give. Example: tempted to lend $500? Offer $50 or a non-monetary form of help. Your Guardian pattern ties worth to generosity; depletion feels like proof you\'re needed. But depletion attracts takers and repels reciprocity. Giving less, intentionally, teaches your brain that you can be valued without emptying your account. When you give from overflow instead of depletion, you sustain yourself and attract people who give back.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('money', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        const solutionBlock = solutionText ? `<p class="solution-text" style="margin-top: 1rem; padding: 1rem; background: #fffcf1; border-left: 3px solid #d4a84b; border-radius: 4px; font-size: 0.95rem; line-height: 1.6;"><strong style="color: #000;">How to overcome:</strong> ${solutionText}</p>` : '';
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${data.summary}</p>
                    ${solutionBlock}
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${challengeText}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getHealthImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you create clear plans and structure your day when overwhelmed, but you struggle to rest because you feel responsible for everything. Overfunctioning leads to burnout and exhaustion.',
                challenge: 'A part of you believes that if you stop, everything will fall apart—so rest feels selfish or dangerous.',
                benefit: 'Rest becomes part of the plan—you prioritize your wellbeing without guilt. Sustainable habits replace burnout; you build health through balance, not overfunctioning. Energy returns when you stop carrying everyone else\'s load.',
                solution: (p, arch, cplx, rel) => 'Schedule rest as a "non-negotiable appointment"—20 minutes daily, same time every day. Put it in your calendar like a meeting. Examples: morning coffee alone, afternoon walk, evening wind-down. Your Anchor need for control makes you believe rest is optional or selfish—but when you treat it like an obligation, your brain stops fighting it. Why it works: rest isn\'t the absence of doing; it\'s an active choice. By scheduling it, you prove that you can stop and nothing falls apart—and that proof rewires the belief.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you create perfect health routines but struggle to stick with them because they\'re too rigid. When you "fail," you give up entirely. All-or-nothing prevents consistent habits.',
                challenge: 'Perfect or quit—so one slip means abandoning the whole routine instead of adjusting.',
                benefit: '"Good enough" replaces perfect—flexible, sustainable routines replace all-or-nothing cycles. Consistency wins; one slip no longer means quitting. Your health improves because you show up, not because you\'re flawless.',
                solution: (p, arch, cplx, rel) => 'Aim for 80% of your plan—never 100%. Examples: planned 5 workouts? Do 4. Planned a perfect meal? Eat 80% healthy, 20% flexible. When you "fail," adjust instead of quit: "I did 2 workouts instead of 5—that\'s still 2 more than zero." Your perfectionism collapses when one slip triggers all-or-nothing—but 80% is built-in failure that doesn\'t collapse. Why it works: consistency beats intensity. Showing up imperfectly for months beats perfect execution for a week.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you prioritize others\' health needs over your own and say yes to plans that exhaust you. Burnout, stress, and neglected wellbeing follow.',
                challenge: 'Putting everyone else first means your body pays the price—you\'re last on your own list.',
                benefit: 'Your health becomes a priority—you set boundaries around your energy and build sustainable habits that support you. Burnout ends; vitality returns. You\'re no longer last on your own list.',
                solution: (p, arch, cplx, rel) => 'Do one thing for your health before doing anything for anyone else. Examples: 10-minute walk before checking messages, eat breakfast before helping kids, stretch before running errands. Put your oxygen mask on first—literally. Your Catalyst pattern puts everyone else first; when you prioritize yourself first, you prove that your body matters. Why it works: you can\'t pour from an empty cup. When you replenish first, you have more to give—and you model self-care instead of self-sacrifice.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you work out and eat well to look good and impress others; you\'re exhausted from performing. Health becomes about appearance, not wellbeing.',
                challenge: 'Your value can feel tied to how you look—so rest and "good enough" feel like failure.',
                benefit: 'Health becomes about wellbeing, not performance—you rest without guilt, build sustainable habits, and feel worthy beyond how you look. The performing ends; the authentic wellness begins.',
                solution: (p, arch, cplx, rel) => 'Before choosing movement or rest, ask: "How do I feel?"—not "How do I look?" Examples: skip the punishing workout when exhausted; eat for energy, not aesthetics; rest when your body asks. Your Catalyst drive ties worth to appearance; shifting to internal attunement breaks that link. Why it works: performance-based health exhausts you because it\'s never enough. When you move and rest based on how you feel, you build sustainable habits—and worth that doesn\'t depend on the mirror.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you avoid dealing with health issues—staying busy, numbing feelings, avoiding doctors. Distraction prevents you from addressing real concerns.',
                challenge: 'Sitting with your body or booking the appointment feels scary—so you stay in motion and small issues grow.',
                benefit: 'You face health instead of escaping—proactive habits replace avoidance, concerns get addressed before they grow. Clarity replaces chaos; your body becomes a priority instead of something you numb or ignore.',
                solution: (p, arch, cplx, rel) => 'Spend 5 minutes daily sitting still and checking in with your body. No phone, no distraction. Ask: "What do I feel? Where do I feel it?" Scan from head to toe. Your Wanderer tendency keeps you in motion so you don\'t have to feel—but 5 minutes of presence breaks the escape habit. Once you can sit with your body, booking that appointment or addressing that concern becomes easier. Why it works: avoidance grows the dread; presence shrinks it. Small doses of feeling build capacity.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you analyze every health decision endlessly—diets, workouts, supplements—but paralysis prevents you from taking action. You think about health more than you practice it.',
                challenge: 'Planning feels safer than starting—so you never take the first step and never improve.',
                benefit: 'You act on health instead of endlessly researching—confident decisions replace paralysis, consistent habits build through practice. The first step happens; progress replaces perfectionism.',
                solution: (p, arch, cplx, rel) => 'Set a 1-hour cap on health research—then pick one tiny action and do it. Examples: researched diets for an hour? Eat one vegetable today. Researched workouts? Do 2 push-ups. Your Wanderer mind believes more planning equals more safety—but action breaks paralysis. Why it works: tiny actions bypass analysis. You can\'t overthink 2 push-ups. Once you start, momentum builds—and the habit matters more than the perfect plan.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you keep distance from health support—avoiding doctors, therapists, or wellness communities. Isolation prevents you from getting the help you need.',
                challenge: 'Underneath is a belief that needing help is weak—so you go it alone and suffer in silence.',
                benefit: 'You seek support instead of isolating—doctors, therapists, community. Wellness becomes collaborative; you get the help you need without suffering alone. Connection heals what isolation was hiding.',
                solution: (p, arch, cplx, rel) => 'Take one small step this week: book one checkup, schedule one therapy session, or join one wellness group. Your Guardian pattern keeps you isolated because needing help feels dangerous—but going it alone keeps you stuck. When you ask for help, you prove that support is possible and that vulnerability doesn\'t always lead to hurt. Why it works: connection heals what isolation hides. Your Emotional Unavailability Complex keeps you alone—small steps toward support rewire that belief.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you give your energy to everyone else, leaving nothing for yourself. You neglect your own health while taking care of others; exhaustion and burnout follow.',
                challenge: 'If you take care of everyone else, you\'ll be needed and valued—but you end up depleted and invisible to yourself.',
                benefit: 'Self-care balances giving—you prioritize your own health and build sustainable habits. Depletion ends; you give from overflow instead of emptiness. Your body stops being last on your list.',
                solution: (p, arch, cplx, rel) => 'Make "energy deposits" before "energy withdrawals": eat, sleep, or move before caregiving. Examples: eat lunch before helping kids; sleep 7 hours before a big day of giving; take a 10-minute walk before visiting family. Your Guardian pattern depletes you because you believe you\'re only worthy when you\'re giving—but depletion helps no one. When you replenish first, you give from overflow. Why it works: you can\'t sustain giving from emptiness. Deposits before withdrawals keep you full.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('health', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        const solutionBlock = solutionText ? `<p class="solution-text" style="margin-top: 1rem; padding: 1rem; background: #fffcf1; border-left: 3px solid #d4a84b; border-radius: 4px; font-size: 0.95rem; line-height: 1.6;"><strong style="color: #000;">How to overcome:</strong> ${solutionText}</p>` : '';
        
        return `
            <div class="life-area-detail-condensed">
                <div class="impact-summary">
                    <p class="summary-text">${data.summary}</p>
                    ${solutionBlock}
                </div>
                
                <div class="challenge-benefit">
                    <div class="challenge-box">
                        <h4 class="challenge-title">Your Challenge:</h4>
                        <p class="challenge-text">${challengeText}</p>
                    </div>
                    
                    <div class="benefit-box">
                        <h4 class="benefit-title">When You Break Free:</h4>
                        <p class="benefit-text">${data.benefit}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    function getCareerImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you step in to solve problems at work, even when they\'re not yours to fix. You take on extra responsibilities, believing if you solve everything, you\'ll be safe. Burnout follows and others don\'t grow.',
                challenge: 'Underneath is a belief that your value at work depends on being the problem-solver—so stepping back feels like losing your place.',
                benefit: 'You focus on your lane—others solve their problems while you advance your career. Burnout ends; leadership grows when you stop fixing everyone else. Your advancement becomes the priority.',
                solution: (p, arch, cplx, rel) => 'When a colleague shares a work problem, wait 24 hours before offering help. Say: "I hear you—let me know if you want to brainstorm." Your Anchor need for control makes you jump in immediately; waiting teaches your brain that you\'re still valuable when you\'re not fixing. Why it works: when you step back, they learn to solve it—and you prove that your worth isn\'t tied to solving their problems. Your impact grows when others grow; fixing everything keeps everyone small.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you overthink every work decision, trying to make the "perfect" choice. You analyze projects endlessly; paralysis and missed deadlines follow. Perfectionism blocks risks and advancement.',
                challenge: 'Waiting for perfect conditions means you never ship—so opportunities go to those who act while you\'re still polishing.',
                benefit: 'You ship instead of polish—confident decisions replace endless analysis, calculated risks replace paralysis. Opportunities no longer go to others while you\'re still perfecting. Career advancement accelerates.',
                solution: (p, arch, cplx, rel) => 'Set a "ship date" before starting any project: decide when you\'ll deliver, then work backward. Example: "This report ships Friday"—then build the minimum viable version. Your perfectionism waits for perfect conditions; a deadline forces action. Why it works: done is better than perfect. Opportunities go to those who ship; those who polish miss the moment. Your career advances when you finish, not when you perfect.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you say yes to everything at work, trying to please everyone. You take on extra projects, work late, and prioritize others\' needs over your own. Burnout follows and what matters gets lost.',
                challenge: 'The more you say yes to please others, the less time you have for your own goals—and the more you need their approval to feel okay.',
                benefit: 'Boundaries replace people-pleasing—you prioritize your career goals and focus on what truly matters. Burnout ends; advancement begins when you stop saying yes to everyone else\'s priorities.',
                solution: (p, arch, cplx, rel) => 'Before saying yes to any request, say: "I need to check my priorities—I\'ll get back to you." Give yourself 24 hours. Then ask: "Does this align with my goals, or am I saying yes to earn approval?" Your Catalyst pattern says yes automatically; the pause breaks that reflex. Why it works: people respect boundaries more than they resent them. When you protect your priorities, you advance—and you attract respect instead of more requests.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you work hard to impress and earn approval, achieving and succeeding to prove your worth. You\'re exhausted from performing and don\'t know how to work authentically without recognition.',
                challenge: 'Underneath is a belief that your worth is tied to recognition—so working without applause feels pointless.',
                benefit: 'You work from authenticity instead of performance—advancement comes from true value, not applause. Worthiness no longer depends on recognition; the mask comes off and your career deepens.',
                solution: (p, arch, cplx, rel) => 'Do one valuable task per week without telling anyone. Examples: draft a report no one asked for, help a colleague quietly, improve a process and don\'t announce it. Your Catalyst drive ties worth to recognition; invisible work breaks that link. Why it works: when you work without applause, you discover what you actually value—and that internal drive sustains careers longer than external validation. The recognition will come; first, prove to yourself that you matter without it.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you avoid difficult conversations, challenging projects, and career risks. You stay busy with tasks that don\'t matter, avoiding the work that would actually advance your career.',
                challenge: 'Stepping into the hard conversation or the big project feels risky—so you stay in safe tasks and stay stuck.',
                benefit: 'You face challenges instead of escaping—difficult conversations, big projects, career risks. Stuck becomes unstuck; advancement happens when you stop avoiding what scares you. The hard work pays off.',
                solution: (p, arch, cplx, rel) => 'Schedule one "hard thing" per week: one difficult conversation (asking for a raise, giving feedback) or one stretch project (the one you\'ve been avoiding). Put it on your calendar. Your Wanderer tendency keeps you busy with safe tasks; scheduling the hard thing forces you to show up. Why it works: avoidance grows the dread; small doses of "do it anyway" shrink it. Each time you face the hard thing, your brain learns it\'s survivable—and advancement follows.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you analyze every career decision endlessly, trying to figure out the "right" path. You research and compare; paralysis causes you to miss opportunities and stay stuck.',
                challenge: 'Weighing options feels safer than choosing—so you never pick a path and never move up.',
                benefit: 'You choose and act instead of analyze forever—confident career decisions, action despite uncertainty. Advancement comes through consistent choices; paralysis ends when you stop waiting for certainty.',
                solution: (p, arch, cplx, rel) => 'For any big career choice—job offer, project, direction—give yourself 1 week max to decide, then act. Example: "I\'ll decide by Friday." Your Wanderer mind believes more analysis means more safety—but past a point, more analysis increases anxiety and decreases satisfaction. Why it works: you\'ll never have perfect certainty. Advancement comes from acting despite uncertainty. The move you make beats the move you never make.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you keep distance from colleagues, avoid networking, and stay isolated. You stay safe but miss the relationships that advance careers.',
                challenge: 'Underneath is a belief that getting close at work will leave you exposed or hurt—so you go it alone and cap your growth.',
                benefit: 'Connection replaces isolation—you build professional relationships, network authentically, and advance through collaboration. Career growth accelerates when you stop going it alone. The cap lifts.',
                solution: (p, arch, cplx, rel) => 'Reach out to one person per week: invite someone for coffee, send a thank-you note, or ask a question. Your Guardian pattern keeps you isolated because closeness feels dangerous—but careers advance through relationships. Why it works: most opportunities come through weak ties—people you know but aren\'t close to. Small outreach compounds. When you connect, you open doors you didn\'t know existed. Your Emotional Unavailability Complex keeps you safe—and stuck.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you give your time and energy to everyone else\'s projects, leaving nothing for your own growth. You help others succeed but neglect your own career advancement.',
                challenge: 'If you help everyone else succeed, you\'ll be valued—but you end up invisible when it comes to your own advancement.',
                benefit: 'Your advancement becomes visible—you balance helping others with your own growth and succeed without neglecting yourself. Invisibility ends; you get the recognition you\'ve been giving away.',
                solution: (p, arch, cplx, rel) => 'Block 2 hours weekly for "your project" before helping anyone else. Put it in your calendar—first thing Monday, or whatever slot works. Your Guardian pattern gives first and leaves nothing for you; blocking your time first reverses that. Why it works: when you protect your priorities before saying yes to others, you advance without burning bridges. You still help—but from overflow, not depletion. Invisibility ends when you make your growth visible.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('career', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        return generateCondensedImpact(data.summary, challengeText, data.benefit, solutionText);
    }
    
    function getIdentityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const shadowPart = pattern.shadow ? pattern.shadow.split(' → ')[1] : 'overfunctioning and burnout';
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by what you can fix and solve. You believe "' + (pattern.coreBelief || 'If I solve it, I\'m safe') + '," which gives you strength (' + (pattern.strength || 'responsible & capable') + ') but also creates ' + shadowPart + '.',
                challenge: 'Underneath is a belief that you\'re only valuable when you\'re useful—so being "just you" without fixing feels like having no worth.',
                benefit: 'Worth comes from who you are, not what you fix—you define yourself beyond your usefulness and feel valuable without solving everything. The exhaustion ends; identity expands.',
                solution: (p, arch, cplx, rel) => 'Ask "Who am I when I\'m not fixing?" once a day—during your morning routine, commute, or before bed. Write or say one answer: "I am someone who…" without mentioning helping or solving. Your Anchor identity is tied to usefulness; this question creates space for identity beyond fixing. Why it works: you are more than your role. When you name who you are without solving, you prove to yourself that worth exists beyond usefulness—and that proof weakens the belief that you only matter when you\'re fixing.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by being flawless and doing things right. You believe "' + (pattern.coreBelief || 'If I do it right, I\'ll be loved') + '," which gives you strength (' + (pattern.strength || 'disciplined & driven') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'shame and rigidity') + '.',
                challenge: 'You never feel good enough, so you chase an impossible standard and never rest in who you are.',
                benefit: 'You accept yourself as you are—worth no longer depends on perfection. Identity expands beyond flawlessness; you feel valuable without being flawless. The chase ends; peace begins.',
                solution: (p, arch, cplx, rel) => 'When you catch self-criticism ("I should have…" "Why can\'t I…"), pause and say: "I\'m enough as I am." Say it out loud or in your head. Your perfectionism ties worth to flawlessness; self-compassion breaks that link. Why it works: shame grows when you criticize yourself; self-compassion shrinks it. When you treat yourself like a friend—with kindness, not perfection—you build identity that doesn\'t depend on being flawless.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by keeping others happy. You believe "' + (pattern.coreBelief || 'If they\'re happy, I\'m okay') + '," which gives you strength (' + (pattern.strength || 'empathetic & kind') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'disconnection from your true self') + '.',
                challenge: 'The more you shape yourself to others\' wants, the less you know who you are—and the more you need their approval to feel real.',
                benefit: 'Your true identity emerges—you define yourself by who you are, not who others want you to be. Authenticity replaces people-pleasing; you feel valuable as your real self. The mask comes off.',
                solution: (p, arch, cplx, rel) => 'Spend 10 minutes daily answering "What do I want?"—without considering anyone else. Write or speak: "I want…" and fill in the blank. Your People-Pleasing Complex defines you by others\' wants; this question reconnects you to your own. Why it works: when you please others constantly, you lose touch with your desires. Reconnecting to "I want" rebuilds identity from the inside out—and you attract people who want the real you, not the version you perform.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by achievements and recognition. You believe "' + (pattern.coreBelief || 'If I impress, I belong') + '," which gives you strength (' + (pattern.strength || 'charismatic & motivated') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'burnout and emptiness') + '.',
                challenge: 'Underneath is a belief that without achievement you\'re nothing—so stillness and "enough" feel like death.',
                benefit: 'Worth comes from who you are, not what you achieve—identity expands beyond performance. You feel valuable without constant achievement; stillness no longer feels like death. The emptiness fills.',
                solution: (p, arch, cplx, rel) => 'Do one activity per week with no goal or audience: walk, create, rest—for its own sake. No posting, no sharing, no metric. Your Catalyst drive ties worth to achievement; invisible activities break that link. Why it works: when you do something for its own sake, you prove to yourself that you matter without accomplishing. Identity expands beyond performance—and the emptiness fills because you\'re no longer chasing applause to feel real.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by freedom and independence. You believe "' + (pattern.coreBelief || 'If I don\'t feel it, it can\'t hurt me') + '," which gives you strength (' + (pattern.strength || 'free & creative') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'disconnection from yourself') + '.',
                challenge: 'Avoiding feelings means you never fully know yourself—so you stay free but empty.',
                benefit: 'You connect with your authentic self—identity expands beyond freedom and avoidance. All emotions become acceptable; you feel valuable with feeling, not in spite of it. The emptiness fills.',
                solution: (p, arch, cplx, rel) => 'Name one feeling per day without acting on it. When you notice an emotion—anxiety, sadness, anger, joy—say: "I feel [X]." Don\'t fix it, escape it, or analyze it. Just name it. Your Wanderer tendency avoids feeling; naming builds emotional self-knowledge. Why it works: avoidance keeps you disconnected from yourself; labeling emotions creates space for them without escape. The more you name, the more you know who you are—beyond freedom and mobility.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by your intelligence and analysis. You believe "' + (pattern.coreBelief || 'If I analyze enough, I\'ll feel safe') + '," which gives you strength (' + (pattern.strength || 'insightful & intelligent') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'paralysis and anxiety') + '.',
                challenge: 'Underneath is a belief that if you think hard enough, you\'ll be safe—so not knowing feels terrifying.',
                benefit: 'Worth comes from who you are, not how much you think—identity expands beyond analysis. You feel valuable without constant figuring out; action replaces paralysis. The head quiets; the heart speaks.',
                solution: (p, arch, cplx, rel) => 'When stuck in rumination ("What if…" "Why did they…"), ask: "What would I do if I already knew?" Then do that. Your Wanderer mind believes thinking will bring certainty—but action precedes certainty. Why it works: you\'ll never figure everything out. When you act from your values instead of waiting for clarity, you prove that worth comes from doing, not analyzing. The head quiets when the body moves.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by independence and protection. You believe "' + (pattern.coreBelief || 'If I don\'t open up, I won\'t get hurt') + '," which gives you strength (' + (pattern.strength || 'independent') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'isolation and loneliness') + '.',
                challenge: 'Closeness feels like it leads to hurt—so you stay safe alone but never get to be fully known.',
                benefit: 'Worth includes connection—you define yourself by who you are with others, not just alone. Isolation ends; you feel valuable in relationships. The protection lifts; intimacy becomes possible.',
                solution: (p, arch, cplx, rel) => 'Share one small truth about yourself weekly with someone safe. Examples: "I felt hurt when…" "I\'m scared of…" "I need…" Your Guardian pattern defines you by protection; disclosure expands identity beyond walls. Why it works: when you share something real and they stay, your brain learns that closeness doesn\'t always lead to hurt. Your Emotional Unavailability Complex keeps you safe—and alone. Small disclosures rewire that belief.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you define yourself by giving and generosity. You believe "' + (pattern.coreBelief || 'If I give more, they won\'t leave') + '," which gives you strength (' + (pattern.strength || 'loyal & generous') + ') but also creates ' + (pattern.shadow ? pattern.shadow.split(' → ')[1] : 'self-neglect') + '.',
                challenge: 'Underneath is a belief that you\'re only worthy when you\'re giving—so receiving or saying no feels like losing your value.',
                benefit: 'Worth comes from who you are, not what you give—identity expands beyond generosity. You feel valuable without constant giving; receiving becomes possible. The depletion ends; reciprocity begins.',
                solution: (p, arch, cplx, rel) => 'Accept one offer of help or care per week without reciprocating immediately. When they say "Let me get that" or "I\'ll help"—say "Thank you" and receive. Don\'t pay back right away. Your Guardian pattern ties worth to giving; receiving breaks that link. Why it works: when you allow others to give, you prove to yourself that you\'re worthy of care without earning it. Identity expands beyond generosity—and relationships deepen because reciprocity flows both ways.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('identity', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        return generateCondensedImpact(data.summary, challengeText, data.benefit, solutionText);
    }
    
    function getPurposeImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you find purpose in helping others; you lose yourself in others\' goals. You take on their problems as your purpose and stop pursuing your authentic goals.',
                challenge: 'Underneath is a belief that your purpose is to fix others—so pursuing your own dreams feels selfish or wrong.',
                benefit: 'Your authentic purpose emerges—you pursue your own goals and help others without losing yourself. Fixing others\' problems no longer defines you; your purpose becomes yours. The clarity arrives.',
                solution: (p, arch, cplx, rel) => 'Write: "What would I pursue if no one needed me?" Take 10 minutes and answer without editing. Your Anchor purpose gets lost in fixing others; this question separates your desires from others\' needs. Why it works: when you name what you\'d pursue without obligation, you reveal authentic purpose. The clarity often surprises you—and that clarity guides action.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you wait for perfect conditions before pursuing purpose; paralysis follows. You analyze and plan endlessly but never take action because it\'s not "perfect" yet.',
                challenge: 'Waiting for the perfect moment means you never start—so purpose stays in your head instead of your life.',
                benefit: 'You pursue purpose despite imperfection—action replaces endless planning. Purpose builds through practice, not perfection; the perfect moment never arrives, but progress does. Paralysis ends.',
                solution: (p, arch, cplx, rel) => 'Start with the "worst viable version": the smallest action you\'d take toward purpose today. Example: want to write? Write one paragraph. Want to build something? Do one step. Your perfectionism waits for the perfect moment; the worst viable version forces action. Why it works: purpose builds through practice, not planning. The perfect moment never arrives—but progress does when you start imperfectly.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you find purpose in pleasing others and lose your own direction. You adapt your purpose to what others want; your authentic goals get lost.',
                challenge: 'The more you align with others\' expectations, the less you know what you actually want—and the more you need their approval to feel on track.',
                benefit: 'Your authentic purpose emerges—direction aligns with who you really are, not others\' expectations. Purpose becomes yours; you pursue your own goals without needing approval to feel on track. The clarity arrives.',
                solution: (p, arch, cplx, rel) => 'Ask "What matters to me?" once a week—without considering others\' expectations. Write or speak: "What matters to me is…" Your People-Pleasing Complex aligns purpose with others\' wants; this question reconnects you to your own. Why it works: when you pursue purpose from approval, you lose direction. Intrinsic goals sustain you; extrinsic approval exhausts you. The clarity arrives when you stop asking "What do they want?" and start asking "What do I want?"'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you find purpose in achievement, but you feel empty after reaching goals. You pursue purpose through success and recognition; deeper meaning stays out of reach.',
                challenge: 'Underneath is a belief that purpose is something you earn through achievement—so when the applause stops, you feel lost.',
                benefit: 'Purpose expands beyond achievement—deeper meaning replaces the need for applause. Goals fulfill you beyond recognition; when the applause stops, purpose remains. The emptiness fills.',
                solution: (p, arch, cplx, rel) => 'Define one purpose-driven activity that has no audience or metric—something you do for its own sake. Examples: walk, create, learn, serve quietly. Your Catalyst drive ties purpose to achievement; invisible purpose breaks that link. Why it works: when purpose depends on applause, you feel empty when it stops. Meaning comes from values, not recognition. When you pursue something for its own sake, purpose remains even when no one\'s watching.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you avoid committing to purpose, staying mobile and free. You avoid defining your purpose to stay flexible; meaningful goals never get pursued.',
                challenge: 'Choosing one path feels like closing the door on others—so you stay uncommitted and unfocused.',
                benefit: 'You commit to purpose instead of staying uncommitted—meaningful goals replace endless flexibility. Life aligns with your values; freedom and direction coexist. The focus arrives.',
                solution: (p, arch, cplx, rel) => 'Commit to one purpose experiment for 30 days—then reassess. Pick one direction, take small steps, and decide at day 30: continue, adjust, or release. Your Wanderer tendency avoids commitment; a time-bound experiment feels safer. Why it works: choosing one path doesn\'t close all doors—it opens one. Short-term commitment reduces fear of being trapped; you can always adjust. Purpose emerges through doing, not deciding forever.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you analyze purpose endlessly but never take action. You think about your purpose constantly; paralysis prevents you from pursuing your goals.',
                challenge: 'Thinking about purpose feels safer than choosing one—so you never commit and never live it.',
                benefit: 'You act on purpose instead of analyzing—action replaces paralysis, goals get pursued despite uncertainty. Purpose builds through practice; thinking ends, living begins. The momentum builds.',
                solution: (p, arch, cplx, rel) => 'Set a "purpose deadline": pick one action and do it within 48 hours. Example: "I will [write one page / reach out to one person / take one class] by [date]." Your Wanderer mind analyzes forever; a deadline forces action. Why it works: overthinking purpose keeps you stuck; action breaks paralysis. You discover purpose by doing—not by deciding. The 48-hour window is small enough to feel safe, big enough to matter.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you protect yourself from purpose, avoiding commitment. You avoid defining your purpose to prevent disappointment; meaningful goals stay out of reach.',
                challenge: 'Underneath is a belief that hoping for something will only lead to hurt—so you don\'t dare want too much.',
                benefit: 'You dare to want—commitment replaces protection, meaningful goals replace fear of disappointment. Life aligns with your values; hoping becomes possible again. The risk pays off.',
                solution: (p, arch, cplx, rel) => 'Write one "daring desire" weekly—something you want but fear wanting. "I want to…" and fill in the blank. Your Guardian pattern protects you from hope; naming desires breaks that protection. Why it works: when you protect yourself from wanting, you avoid disappointment—and purpose. Naming what you want reduces the fear of wanting it. Hope becomes possible again when you dare to want.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you find purpose in giving but neglect your own goals. You pursue purpose through serving others; your authentic goals get sidelined.',
                challenge: 'Your purpose can feel like it\'s only to serve others—so wanting something for yourself feels wrong or greedy.',
                benefit: 'Your purpose becomes visible—you pursue your own goals while still serving others. Giving balances with receiving; your life serves both you and them. Invisibility ends; your purpose gets a seat.',
                solution: (p, arch, cplx, rel) => 'Block 1 hour weekly for "my purpose project" before serving others. Put it in your calendar—first thing Monday, or whatever works. Your Guardian pattern gives first and leaves nothing for you; blocking your purpose first reverses that. Why it works: when you protect your purpose before saying yes to others, you sustain both giving and self. Your purpose gets a seat; depletion ends.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('purpose', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        return generateCondensedImpact(data.summary, challengeText, data.benefit, solutionText);
    }
    
    function getLifestyleImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you fill your days solving others\' problems, leaving no time for yourself. You create structured routines, but they\'re focused on fixing, not living.',
                challenge: 'Underneath is a belief that your time is only valid when it\'s spent on others—so time for yourself feels indulgent or wrong.',
                benefit: 'Time for yourself becomes non-negotiable—you balance fixing with living and build routines that support your wellbeing. Your schedule reflects your priorities; indulgence becomes self-care. The guilt ends.',
                solution: (p, arch, cplx, rel) => 'Block 15 minutes for yourself before doing anything for anyone else—same time every day. Examples: morning coffee alone, afternoon walk, evening wind-down. Put it in your calendar. Your Anchor pattern fills your days fixing others; blocking "me time" first proves your time is valid when spent on you. Why it works: when you anchor personal time to a fixed slot, it sticks. The guilt drops because you\'ve already "earned" it by putting it first.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you create rigid routines that you can\'t maintain, leading to all-or-nothing cycles. You plan perfect days; when you "fail," you give up entirely.',
                challenge: 'Perfect or quit—so one slip means abandoning the whole day instead of adjusting.',
                benefit: 'Flexible routines replace rigid plans—one slip no longer means abandoning the day. Sustainable habits build; imperfection is accepted. Consistency wins over perfection. The cycle breaks.',
                solution: (p, arch, cplx, rel) => 'Aim for 80% of your plan—never 100%. Planned 5 tasks? Do 4. Planned a perfect morning? Hit 80%. When you "fail," adjust instead of quit: "I did 3 of 5—that\'s still progress." Your perfectionism collapses when one slip triggers all-or-nothing; 80% is built-in flexibility. Why it works: consistency beats intensity. Showing up imperfectly for months beats perfect execution for a week. The cycle breaks when one slip no longer means abandoning the day.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you say yes to everything, filling your schedule with others\' priorities. You create a lifestyle around pleasing others; your own needs get no time.',
                challenge: 'Your schedule reflects everyone else\'s priorities—so your own life never gets a slot.',
                benefit: 'Your priorities get a slot—boundaries protect your time; daily routines support your wellbeing. Your schedule reflects you, not everyone else. Burnout ends; balance arrives. The slot opens.',
                solution: (p, arch, cplx, rel) => 'Block your priorities in your calendar before accepting any requests. Put "my time" in first—workout, meal prep, rest—then fill the rest. When someone asks, say: "Let me check my schedule." Your People-Pleasing Complex fills your schedule with others\' priorities; blocking yours first prevents automatic yes. Why it works: when your priorities are already in the calendar, saying no to others is easier. Your schedule reflects you, not everyone else.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you maintain a busy, achievement-focused lifestyle that exhausts you. You create routines around performing and achieving; rest gets no time.',
                challenge: 'Underneath is a belief that rest is laziness—so slowing down feels like failing.',
                benefit: 'Rest becomes part of the plan—achievement balances with authentic living. Daily routines support wellbeing; exhaustion no longer defines success. Slowing down feels like winning. The performing ends.',
                solution: (p, arch, cplx, rel) => 'Schedule rest as a "performance requirement"—20 minutes daily, same time. Put it in your calendar: "Recovery block." Your Catalyst drive ties worth to productivity; reframing rest as strategic—not lazy—reduces guilt. Why it works: rest isn\'t the opposite of performance; it\'s part of it. When you treat rest as a requirement, your brain stops fighting it. Exhaustion drops; sustainable achievement rises.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you avoid routine and stay busy to avoid feelings. You create a lifestyle of distraction and mobility; consistent habits never form.',
                challenge: 'Routine means facing yourself—so you escape into busyness and never build a stable foundation.',
                benefit: 'Consistent routines replace escape—stable habits form; you face feelings instead of staying busy. Routine means landing, not avoiding. The foundation builds; the running stops.',
                solution: (p, arch, cplx, rel) => 'Start with one 5-minute "anchor habit"—something you do at the same time every day. Examples: morning coffee alone, evening wind-down, 5-minute stretch. Your Wanderer tendency avoids routine because routine means facing yourself; micro-habits feel safe. Why it works: tiny routines build stability without triggering escape. Once you have one anchor, you can stack others. Routine stops meaning "trapped" and starts meaning "grounded."'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you overthink daily decisions, causing paralysis. You analyze your lifestyle endlessly; action and consistent habits stay out of reach.',
                challenge: 'Deciding feels risky—so you stay in analysis and never build the life you want.',
                benefit: 'You decide and act instead of analyze—confident daily decisions replace paralysis. Lifestyle habits build through practice; the life you want becomes the life you live. The analysis ends; the living begins.',
                solution: (p, arch, cplx, rel) => 'For small daily choices—what to eat, what to wear, what to do next—give yourself 2 minutes max, then act. Set a timer if needed. Your Wanderer mind analyzes to avoid deciding; a cap forces action. Why it works: most daily choices don\'t deserve deliberation. Limiting decision time frees mental energy for what matters. The life you want becomes the life you live when you stop overthinking the small stuff.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you maintain isolated, protective daily habits. You create a lifestyle of distance and protection; connections and community stay out of reach.',
                challenge: 'Underneath is a belief that connection is risky—so you build a life that keeps others at arm\'s length.',
                benefit: 'Connection becomes part of life—community builds; daily habits support both independence and intimacy. Distance no longer protects; connection heals. The isolation ends; the belonging begins.',
                solution: (p, arch, cplx, rel) => 'Add one small connection habit: weekly coffee with a friend, or daily text to someone you care about. Your Guardian pattern keeps you isolated; micro-connections break that habit. Why it works: connection heals what isolation hides. Regular small touchpoints reduce loneliness and build belonging. Your Emotional Unavailability Complex keeps you safe—and alone. One coffee, one text—the compound effect rewires the belief that connection is risky.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you give your time to everyone else, leaving nothing for yourself. You create a lifestyle around giving; habits that support your own wellbeing never get built.',
                challenge: 'If you give your time to others, you\'ll be needed—but you end up with no time or energy for yourself.',
                benefit: 'Self-care balances giving—your needs get a slot; daily habits support both you and others. Depletion ends; you give from overflow. Your life includes you. The neglect ends.',
                solution: (p, arch, cplx, rel) => 'Add "me first" to one routine: eat, rest, or move before caregiving. Examples: eat breakfast before helping kids, take a 10-minute walk before visiting family. Your Guardian pattern gives first; putting yourself first reverses that. Why it works: you can\'t pour from an empty cup. When you replenish before giving, you sustain both—and you model self-care instead of self-sacrifice. Depletion ends; giving from overflow begins.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('lifestyle', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        return generateCondensedImpact(data.summary, challengeText, data.benefit, solutionText);
    }
    
    function getProductivityImpactDetailed(pattern, archetype, complex, dominantDriver, dominantPercent, exactAge, birthDate) {
        const impactSummaries = {
            'Fixer': {
                summary: 'Your ' + pattern.name + ' pattern makes you spend time solving others\' problems, leaving no time for your own goals. You\'re productive, but your productivity is focused on fixing, not your own priorities.',
                challenge: 'Underneath is a belief that your time is only "well spent" when it\'s on others—so your own goals never get the slot.',
                benefit: 'Your goals get the slot—productivity focuses on your priorities; helping others balances with your own. Time goes where it matters; exhaustion from fixing everyone else ends. Your time becomes yours.',
                solution: (p, arch, cplx, rel) => 'Block your top priority first—before fixing anyone else. Put it in your calendar: "My most important task"—same time every day. Your Anchor pattern fills your time fixing others; blocking your goal first proves your time is valid when spent on you. Why it works: when you protect your most important task before saying yes to others, you advance without burning bridges. Productivity serves what matters; exhaustion from fixing everyone else ends.'
            },
            'Perfectionist': {
                summary: 'Your ' + pattern.name + ' pattern makes you waste time perfecting instead of taking action. You\'re productive at perfecting; completing tasks and moving forward stay out of reach.',
                challenge: 'Perfecting feels productive, but it\'s a way to avoid finishing—so you never ship.',
                benefit: 'You ship instead of perfect—action replaces endless polishing, tasks get completed. Productivity moves you forward; perfecting no longer blocks finishing. The block lifts; progress begins.',
                solution: (p, arch, cplx, rel) => 'Set a "done is better" deadline before starting any task: decide when you\'ll stop and ship. Example: "This draft ships Friday at 5pm." Your perfectionism polishes forever; a deadline forces completion. Why it works: done is better than perfect. Shipping imperfect work often beats endless polishing—because shipped work moves you forward; perfect work stays in your head. The block lifts when you decide when to stop.'
            },
            'Pleaser': {
                summary: 'Your ' + pattern.name + ' pattern makes you say yes to everything, filling your time with others\' priorities. You\'re productive at pleasing; your own goals never get the slot.',
                challenge: 'The more you say yes to others\' priorities, the less time you have for yours—and the more you need their approval to feel productive.',
                benefit: 'Your goals get the slot—boundaries protect your time; productivity serves what truly matters. People-pleasing ends; your priorities get the focus. The exhaustion ends; the impact grows.',
                solution: (p, arch, cplx, rel) => 'Before saying yes to any request, say: "I need to check my schedule—I\'ll get back to you." Give yourself 24 hours. Then ask: "Does this align with my priorities?" Your People-Pleasing Complex says yes automatically; the pause breaks that reflex. Why it works: when you pause before saying yes, you protect your priorities without damaging relationships. People respect boundaries more than they resent them. Your goals get the focus; exhaustion ends.'
            },
            'Performer': {
                summary: 'Your ' + pattern.name + ' pattern makes you work constantly to prove your worth, never resting. You\'re productive at performing; sustainable productivity and rest stay out of reach.',
                challenge: 'Underneath is a belief that rest is unearned—so you run until you crash.',
                benefit: 'Sustainable productivity replaces burnout—rest becomes part of the plan. You use time productively without constant performance; exhaustion no longer defines worth. The running stops; the balance arrives.',
                solution: (p, arch, cplx, rel) => 'Schedule rest as a "productivity block"—20 minutes between deep work. Put it in your calendar: "Recovery." Your Catalyst drive ties worth to output; reframing rest as strategic—not lazy—reduces guilt. Why it works: rest isn\'t the opposite of productivity; it\'s part of it. Rest intervals improve focus and output. When you treat rest as a block, your brain stops fighting it. The running stops; sustainable productivity arrives.'
            },
            'Escaper': {
                summary: 'Your ' + pattern.name + ' pattern makes you stay busy to avoid feelings, wasting time on distractions. You\'re productive at staying busy; what truly matters never gets the focus.',
                challenge: 'Staying busy feels productive—but it\'s a way to avoid feeling, so you never land on what actually matters.',
                benefit: 'Focus replaces escape—productivity lands on what truly matters. You face feelings instead of distracting; time moves you forward. Busyness ends; impact begins. The avoidance stops; the progress starts.',
                solution: (p, arch, cplx, rel) => 'Do one "priority task" before distractions each day. Before checking email, social media, or busywork—do one thing that actually matters. Your Wanderer tendency stays busy to avoid feeling; starting with meaning reduces escape. Why it works: when you start with what matters, momentum builds. Avoidance shrinks because you\'ve already landed on something meaningful. Busyness ends; impact begins.'
            },
            'Overthinker': {
                summary: 'Your ' + pattern.name + ' pattern makes you spend time analyzing instead of acting. You\'re productive at thinking; action and completing tasks stay out of reach.',
                challenge: 'Thinking feels productive—but it keeps you from doing, so tasks never get done.',
                benefit: 'You act instead of analyze—action replaces paralysis; tasks get completed. Productivity moves you forward; overthinking no longer blocks doing. The thinking ends; the doing begins.',
                solution: (p, arch, cplx, rel) => 'Use the "2-minute rule": if a task takes under 2 minutes, do it now. Don\'t add it to a list; don\'t analyze it. Just do it. Your Wanderer mind analyzes to avoid doing; immediate action bypasses overthinking for small tasks. Why it works: you can\'t overthink a 2-minute task. When you act immediately on small things, you build momentum for bigger ones. The thinking ends; the doing begins.'
            },
            'Withdrawer': {
                summary: 'Your ' + pattern.name + ' pattern makes you isolate and protect your time, missing opportunities. You\'re productive alone; collaboration and productivity through connection stay out of reach.',
                challenge: 'Underneath is a belief that involving others will slow you down or expose you—so you go it alone and cap your impact.',
                benefit: 'Collaboration joins solo work—productivity grows through connection. You use time productively alone and with others; isolation no longer caps impact. The cap lifts; the results grow.',
                solution: (p, arch, cplx, rel) => 'Add one collaboration per week: ask for input on a project, delegate a task, or co-work with someone. Your Guardian pattern keeps you isolated; collaboration breaks that habit. Why it works: productivity grows through connection. When you involve others, you often get better results—and you cap your isolation. Your Emotional Unavailability Complex keeps you safe—and caps your impact. Small collaborations rewire that belief.'
            },
            'Overgiver': {
                summary: 'Your ' + pattern.name + ' pattern makes you give your time to everyone else, leaving nothing for yourself. You\'re productive at giving; your own goals never get the slot.',
                challenge: 'If you give your time to others\' goals, you\'ll be valued—but you end up with no time for your own.',
                benefit: 'Your goals get the slot—giving balances with your priorities. Time serves both you and others; depletion ends. Productivity includes you. The invisibility ends; your goals get the focus.',
                solution: (p, arch, cplx, rel) => 'Block 2 hours weekly for "my goal" before helping others. Put it in your calendar—first thing Monday, or whatever works. Your Guardian pattern gives first; blocking your goal first reverses that. Why it works: when you protect your priorities before saying yes to others, you sustain both giving and productivity. Your goals get a seat; depletion ends. Invisibility ends when you make your growth visible.'
            }
        };
        
        const data = impactSummaries[getImpactLookupName(pattern.name)] || impactSummaries['Fixer'];
        const insight = getLifeAreaInsight('productivity', birthDate);
        const challengeText = data.challenge + (insight ? ' ' + insight : '');
        const solutionText = typeof data.solution === 'function' ? data.solution(pattern, archetype, complex, undefined) : (data.solution || '');
        return generateCondensedImpact(data.summary, challengeText, data.benefit, solutionText);
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

        // Section 1: The Emotional Driver Foundation (no percentages—see Behind it in About Your Pattern)
        developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">Your <strong>${driverNames[dominantDriver]}</strong> driver—which drives your ${pattern.name.toLowerCase()} pattern—developed as a learned response when you needed to navigate uncertainty, threat, or emotional overwhelm.`;
        if (secondaryDriver && secondaryPercent >= 20) {
            developmentStory += ` Your <strong>${driverNames[secondaryDriver]}</strong> driver also influences you, adding another layer to how this shows up.`;
        }
        developmentStory += `</p>`;

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

        // Section 4: Secondary complex (when user has multiple complexes)
        if (complex.secondary) {
            developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">You also carry the <strong>${complex.secondary}</strong>—another belief layer that developed from your early experiences. Together, ${complex.primary} and ${complex.secondary} reinforce each other, which is why your ${pattern.name} pattern can feel so automatic and hard to interrupt.</p>`;
        }

        // Section 5: Why It Persists (neuroscience + psychology)
        if (exactAge) {
            developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">At ${exactAge}, this pattern has been running for ${exactAge >= 30 ? 'decades' : 'years'}. Research in neuroscience shows that <strong>repetition literally rewires your brain</strong>—the more you repeat a behavior, the stronger the neural pathway becomes. Your ${complex.primary.toLowerCase()} isn't just a habit; it's a <strong>deeply wired survival strategy</strong> that operates on autopilot.</p>`;
        } else {
            developmentStory += `<p class="content-text" style="margin-bottom: 1rem; line-height: 1.7;">Research in neuroscience shows that <strong>repetition literally rewires your brain</strong>—the more you repeat a behavior, the stronger the neural pathway becomes. Your ${complex.primary.toLowerCase()} isn't just a habit; it's a <strong>deeply wired survival strategy</strong> that operates on autopilot.</p>`;
        }

        // Section 5: The Hope (because it was learned, it can change)
        developmentStory += `<p class="content-text" style="margin-bottom: 0; line-height: 1.7; color: #333;">Here's what matters most: <strong style="color: #ca0013;">Because this pattern was learned, it can be unlearned.</strong> Your brain can rewire itself through new experiences and consistent practice. Repetition and reinforcement created this pattern; the same mechanism can create new patterns that serve you better.</p>`;

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
    // Always visible - no trigger button needed
    function getJournalUI(placeholder) {
        var ph = placeholder || 'Type your answer here...';
        return '<div class="journal-ui"><div class="journal-entry"><textarea rows="3" placeholder="' + ph.replace(/"/g, '&quot;') + '" class="journal-textarea"></textarea><div class="journal-saved-indicator" style="display:none;"><span class="journal-saved-text">Saved</span></div></div></div>';
    }

    // Pattern-specific pain points for merged "What's not working" workbook question (general fallback)
    function getPatternPainOptions(patternName) {
        var name = (patternName === 'The Guarded One' || patternName === 'Guarded One') ? 'Withdrawer' : (patternName || 'Fixer');
        var opts = {
            'Fixer': ['Fixing everyone else\'s problems', 'Taking on too much', 'Burnout from overdoing', 'Can\'t let others solve their own issues', 'Exhausted from always being in charge'],
            'Perfectionist': ['All-or-nothing thinking', 'Paralysis from perfectionism', 'Giving up when I "fail"', 'Rigid routines that don\'t stick', 'Fear of making mistakes'],
            'Pleaser': ['Saying yes when I mean no', 'Putting others first always', 'Losing myself in relationships', 'Resentment from people-pleasing', 'Exhausted from absorbing others\' needs'],
            'Performer': ['Exhausted from performing', 'Fear they\'ll see the real me', 'Achieving to impress', 'Empty after the applause', 'Can\'t show up authentically'],
            'Escaper': ['Avoiding hard conversations', 'Staying busy to avoid feelings', 'Pulling away when things get serious', 'Numbing with distractions', 'Can\'t sit with discomfort'],
            'Overthinker': ['Paralyzed by analysis', 'Can\'t stop overthinking', 'Missing opportunities while deciding', 'Anxiety from endless thinking', 'Stuck in my head instead of acting'],
            'Withdrawer': ['Keeping emotional distance', 'Pushing people away', 'Staying isolated', 'Can\'t open up', 'Lonely even when I\'m not alone'],
            'Overgiver': ['Giving more than I receive', 'Exhausted from overgiving', 'Resentful when others don\'t reciprocate', 'Can\'t receive', 'Feeling used']
        };
        return opts[name] || opts['Fixer'];
    }
    window.getPatternPainOptions = getPatternPainOptions;

    // Universal human challenges/pains per life area - not pattern-specific
    var UNIVERSAL_PAINS_BY_AREA = {
        'Love': ['Loneliness', 'Fear of rejection', 'Communication breakdown', 'Trust issues', 'Unmet needs', 'Feeling unseen'],
        'Money': ['Constant worry', 'Never enough feeling', 'Scarcity mindset', 'Comparison with others', 'Financial anxiety', 'Feeling stuck'],
        'Health': ['Low energy', 'Neglecting self-care', 'Stress and burnout', 'Inconsistent habits', 'Body disconnect', 'Procrastinating on health'],
        'Career': ['Unfulfilled at work', 'Fear of failure', 'Imposter syndrome', 'Burnout', 'Missing purpose', 'Stuck in comfort zone'],
        'Identity': ['Not knowing who I am', 'People-pleasing', 'Comparison with others', 'Self-doubt', 'Fear of being seen', 'Living for others'],
        'Purpose': ['Feeling lost', 'Lack of direction', 'Waiting for clarity', 'Fear of wrong path', 'Existential emptiness', 'Stuck in survival mode'],
        'Lifestyle': ['No time for myself', 'Overwhelm', 'Out of balance', 'Rushing through life', 'Exhausted', 'No boundaries'],
        'How I feel about myself': ['Not enough', 'Self-criticism', 'Shame', 'Comparing to others', 'Harsh inner critic', 'Feeling unworthy']
    };

    // Combined universal + pattern-specific pains per area. Exposed for initWorkbookPills.
    window.getCombinedPainsByArea = function(area, patternName) {
        var universal = UNIVERSAL_PAINS_BY_AREA[area] || [];
        var patternSpecific = window.getPatternPainOptionsByArea ? window.getPatternPainOptionsByArea(area, patternName) : [];
        var seen = {};
        var out = [];
        universal.forEach(function(p) {
            if (!seen[p]) { seen[p] = true; out.push(p); }
        });
        (patternSpecific || []).forEach(function(p) {
            if (!seen[p]) { seen[p] = true; out.push(p); }
        });
        return out;
    };

    // Pattern-specific pain points BY life area
    // Exposed on window for results-modal.js to call when area selection changes
    window.getPatternPainOptionsByArea = function(area, patternName) {
        var name = (patternName === 'The Guarded One' || patternName === 'Guarded One') ? 'Withdrawer' : (patternName || 'Fixer');
        var byArea = {
            'Love': {
                'Fixer': ['Fixing partner\'s problems', 'Taking charge in relationships', 'Can\'t let them own their part', 'Jumping in to solve their issues', 'Exhausted from always fixing'],
                'Perfectionist': ['Waiting for the perfect partner', 'Analyzing every flaw before committing', 'Giving up when it\'s not "right"', 'Paralyzed by dating decisions', 'Can\'t show imperfections'],
                'Pleaser': ['Saying yes when I mean no', 'Losing myself in the relationship', 'Putting their needs always first', 'Resentment from people-pleasing', 'Exhausted from absorbing their needs'],
                'Performer': ['Exhausted from impressing them', 'Fear they\'ll see the real me', 'Achieving to earn their approval', 'Empty when the performance ends', 'Can\'t show up authentically'],
                'Escaper': ['Avoiding hard conversations', 'Pulling away when things get serious', 'Staying busy to avoid feelings', 'Numbing with distractions', 'Can\'t sit with emotional discomfort'],
                'Overthinker': ['Analyzing every text and interaction', 'Paralyzed by "what do they mean?"', 'Missing moments while overthinking', 'Anxiety from endless analysis', 'Stuck in my head instead of connecting'],
                'Withdrawer': ['Keeping emotional distance', 'Pushing them away when they get close', 'Staying isolated in the relationship', 'Can\'t open up', 'Lonely even when together'],
                'Overgiver': ['Giving more than I receive', 'Exhausted from overgiving', 'Resentful when they don\'t reciprocate', 'Can\'t receive love', 'Feeling used']
            },
            'Money': {
                'Fixer': ['Controlling every financial detail', 'Fixing others\' money problems', 'Can\'t trust the process', 'Burnout from managing everything', 'Exhausted from always being in charge'],
                'Perfectionist': ['Overthinking every financial decision', 'Paralysis from "perfect" choices', 'Missing opportunities while deciding', 'Giving up when plans "fail"', 'Rigid budgets that don\'t stick'],
                'Pleaser': ['Spending to please others', 'Saying yes to expensive plans', 'Financially drained from generosity', 'Resentful when others don\'t reciprocate', 'Can\'t say no to money requests'],
                'Performer': ['Spending to impress', 'Buying status to feel worthy', 'Financial stress from performing', 'Empty after the purchase', 'Can\'t build real wealth'],
                'Escaper': ['Avoiding budgets and bills', 'Ignoring money to avoid anxiety', 'Staying busy so I don\'t think about finances', 'Financial chaos from avoidance', 'Can\'t face my financial reality'],
                'Overthinker': ['Analyzing every financial move endlessly', 'Paralyzed by "right" investment', 'Missing opportunities while researching', 'Anxiety from endless comparison', 'Stuck analyzing instead of acting'],
                'Withdrawer': ['Hoarding money, avoiding risk', 'Keeping finances separate from others', 'Can\'t build financial partnerships', 'Isolated from financial support', 'Protecting by not investing'],
                'Overgiver': ['Giving money away to feel needed', 'Loaning to friends, not getting back', 'Financially drained from overgiving', 'Resentful when others don\'t reciprocate', 'Can\'t receive or invest in myself']
            },
            'Health': {
                'Fixer': ['Overfunctioning with health routines', 'Taking charge of everyone\'s wellbeing', 'Burnout from overdoing', 'Can\'t rest when others need help', 'Exhausted from always being responsible'],
                'Perfectionist': ['Perfect routines that don\'t stick', 'Giving up when I "fail" a workout', 'All-or-nothing with diet', 'Paralyzed by perfect health choices', 'Rigid habits that collapse'],
                'Pleaser': ['Prioritizing others\' health over mine', 'Saying yes to plans that exhaust me', 'Burnout from putting everyone first', 'Neglecting my own wellbeing', 'Resentful from self-neglect'],
                'Performer': ['Working out to impress', 'Health as appearance, not wellbeing', 'Exhausted from performing fitness', 'Can\'t sustain when no one\'s watching', 'Empty when the performance ends'],
                'Escaper': ['Avoiding health issues', 'Staying busy to avoid discomfort', 'Numbing instead of addressing pain', 'Avoiding doctors and checkups', 'Distraction instead of real care'],
                'Overthinker': ['Researching diets and workouts endlessly', 'Paralyzed by "perfect" health plan', 'Thinking about health more than doing it', 'Anxiety from endless analysis', 'Stuck researching instead of acting'],
                'Withdrawer': ['Keeping distance from health support', 'Avoiding doctors and therapists', 'Isolated when struggling', 'Can\'t ask for help', 'Protecting by staying alone'],
                'Overgiver': ['Giving energy to everyone else', 'Neglecting my own health needs', 'Exhausted from caring for others', 'Burnout from overgiving', 'Can\'t receive care']
            },
            'Career': {
                'Fixer': ['Fixing everyone\'s work problems', 'Taking on others\' responsibilities', 'Burnout from overdoing', 'Can\'t let others grow', 'Exhausted from always solving'],
                'Perfectionist': ['Overthinking every work decision', 'Paralysis from "perfect" choice', 'Missing deadlines from perfectionism', 'Giving up when projects "fail"', 'Can\'t take risks'],
                'Pleaser': ['Saying yes to everything at work', 'Prioritizing others\' needs over mine', 'Burnout from people-pleasing', 'Can\'t focus on what matters', 'Resentful from overcommitting'],
                'Performer': ['Exhausted from impressing at work', 'Achieving to earn approval', 'Can\'t work authentically', 'Empty after the recognition', 'Performing instead of creating'],
                'Escaper': ['Avoiding difficult conversations', 'Staying busy with low-impact tasks', 'Avoiding career risks', 'Withdrawing from challenging projects', 'Numbing instead of facing challenges'],
                'Overthinker': ['Analyzing every career move endlessly', 'Paralyzed by "right" path', 'Missing opportunities while deciding', 'Anxiety from endless research', 'Stuck in analysis instead of action'],
                'Withdrawer': ['Keeping distance from colleagues', 'Avoiding networking', 'Staying isolated at work', 'Can\'t build relationships that advance', 'Protecting by staying disconnected'],
                'Overgiver': ['Giving time to others\' projects', 'Neglecting my own career growth', 'Helping others succeed, not myself', 'Exhausted from overgiving', 'Can\'t receive opportunities']
            },
            'Identity': {
                'Fixer': ['Seeing myself only as problem-solver', 'Worth tied to fixing', 'Can\'t receive help', 'Can\'t be vulnerable', 'Exhausted from always being capable'],
                'Perfectionist': ['Worth tied to being flawless', 'Can\'t take risks', 'Can\'t be human', 'Fear of making mistakes', 'Identity as "the one who gets it right"'],
                'Pleaser': ['Worth tied to pleasing', 'Can\'t know who I am outside serving', 'Identity as helper', 'Losing myself in others', 'Can\'t put myself first'],
                'Performer': ['Worth tied to achievement', 'Can\'t be authentic', 'Can\'t be vulnerable', 'Identity as success', 'Empty when not performing'],
                'Escaper': ['Worth tied to staying mobile', 'Can\'t build deep connections', 'Avoiding commitment = avoiding knowing myself', 'Avoiding stability', 'Can\'t sit with who I am'],
                'Overthinker': ['Worth tied to thinking', 'Can\'t trust instincts', 'Can\'t take action', 'Identity as "the thoughtful one"', 'Stuck in my head'],
                'Withdrawer': ['Worth tied to staying safe', 'Can\'t experience intimacy', 'Identity as independent', 'Lonely from protecting', 'Can\'t open up'],
                'Overgiver': ['Worth tied to giving', 'Can\'t receive', 'Can\'t know worth outside giving', 'Identity as needed', 'Resentful from overgiving']
            },
            'Purpose': {
                'Fixer': ['Fixing instead of finding purpose', 'Taking charge of others\' paths', 'Burnout from overdoing', 'Can\'t let purpose emerge', 'Exhausted from controlling'],
                'Perfectionist': ['Waiting for perfect purpose', 'Paralyzed by "right" path', 'Can\'t start until it\'s perfect', 'Giving up when it\'s not "right"', 'Fear of wrong choice'],
                'Pleaser': ['Purpose defined by others', 'Losing my path to please', 'Can\'t pursue what I want', 'Resentful from following others', 'Exhausted from absorbing their goals'],
                'Performer': ['Purpose as achievement', 'Pursuing what impresses', 'Empty when recognition fades', 'Can\'t find authentic purpose', 'Performing instead of becoming'],
                'Escaper': ['Avoiding purpose to avoid feeling', 'Staying busy to avoid the question', 'Pulling away from commitment', 'Numbing instead of facing', 'Can\'t sit with what I want'],
                'Overthinker': ['Analyzing purpose endlessly', 'Paralyzed by "right" path', 'Missing action while thinking', 'Anxiety from endless analysis', 'Stuck analyzing instead of doing'],
                'Withdrawer': ['Keeping purpose at distance', 'Protecting from rejection', 'Can\'t pursue what scares me', 'Isolated from support', 'Staying safe instead of alive'],
                'Overgiver': ['Purpose as serving others', 'Giving instead of receiving', 'Can\'t pursue my own path', 'Resentful from overgiving', 'Exhausted from others\' purpose']
            },
            'Lifestyle': {
                'Fixer': ['Controlling daily routines', 'Fixing everyone\'s schedule', 'Burnout from overdoing', 'Can\'t let go of structure', 'Exhausted from managing'],
                'Perfectionist': ['Perfect routines that collapse', 'All-or-nothing daily habits', 'Giving up when I "fail"', 'Rigid lifestyle that doesn\'t stick', 'Paralyzed by perfect choices'],
                'Pleaser': ['Lifestyle built around others', 'Saying yes to plans that drain', 'No time for myself', 'Resentful from overcommitting', 'Exhausted from others\' schedule'],
                'Performer': ['Lifestyle as performance', 'Exhausted from keeping up image', 'Can\'t relax authentically', 'Empty when alone', 'Performing in daily life'],
                'Escaper': ['Avoiding structure', 'Staying busy to avoid stillness', 'Numbing with distractions', 'Can\'t establish routines', 'Fleeing instead of building'],
                'Overthinker': ['Overthinking daily choices', 'Paralyzed by "right" routine', 'Analysis instead of action', 'Anxiety from endless planning', 'Stuck thinking instead of living'],
                'Withdrawer': ['Keeping life separate', 'Avoiding shared activities', 'Isolated in daily routine', 'Can\'t open up to connection', 'Protecting by staying alone'],
                'Overgiver': ['Giving time to everyone else', 'No time for my own life', 'Exhausted from overgiving', 'Resentful from neglect', 'Can\'t receive support']
            },
            'How I feel about myself': {
                'Fixer': ['Worth tied to fixing', 'Can\'t receive', 'Shame when not needed', 'Exhausted from proving capability', 'Can\'t be vulnerable'],
                'Perfectionist': ['Worth tied to perfection', 'Shame when I fail', 'Can\'t accept mistakes', 'Fear of being seen', 'Harsh self-criticism'],
                'Pleaser': ['Worth tied to pleasing', 'Can\'t prioritize myself', 'Shame when I say no', 'Exhausted from absorbing', 'Losing sense of self'],
                'Performer': ['Worth tied to achievement', 'Shame when not impressive', 'Can\'t show real me', 'Empty when not performing', 'Fear of being ordinary'],
                'Escaper': ['Worth tied to staying free', 'Shame when I feel', 'Can\'t sit with myself', 'Avoiding self-reflection', 'Numbing self-doubt'],
                'Overthinker': ['Worth tied to thinking', 'Shame when I act wrong', 'Can\'t trust myself', 'Anxiety from self-doubt', 'Stuck in self-analysis'],
                'Withdrawer': ['Worth tied to safety', 'Shame when I need', 'Can\'t ask for love', 'Lonely from protecting', 'Fear of being seen'],
                'Overgiver': ['Worth tied to giving', 'Shame when I receive', 'Can\'t prioritize myself', 'Resentful from overgiving', 'Fear of not being needed']
            }
        };
        var areaData = byArea[area];
        if (!areaData) return getPatternPainOptions(patternName);
        return areaData[name] || getPatternPainOptions(patternName);
    };

    // Personalized insight for Primary Shift when user shared birth date.
    // Picks Moon or Sun insight that best fits the pattern; closing is pattern-specific, not repetitive.
    function getPrimaryShiftPersonalization(resetFocus, pattern, birthDate) {
        if (!birthDate || !window.AstrologyUtils) return '';
        var moonInsight = window.AstrologyUtils.getMoonInsight(window.AstrologyUtils.getMoonSign(birthDate));
        var sunInsight = window.AstrologyUtils.getSunInsight(window.AstrologyUtils.getSunSign(birthDate));
        if (!moonInsight && !sunInsight) return '';
        var insight = pickBestInsightForPattern(moonInsight, sunInsight, pattern);
        if (!insight) return '';
        var closing = getPatternClosing(pattern);
        return '<p class="workbook-primary-shift-insight">' + insight + ' ' + closing + '</p>';
    }
    function pickBestInsightForPattern(moonInsight, sunInsight, pattern) {
        if (!moonInsight) return sunInsight;
        if (!sunInsight) return moonInsight;
        var rf = (pattern.resetFocus || '').toLowerCase();
        var moonScore = 0, sunScore = 0;
        var moonLower = (moonInsight || '').toLowerCase();
        var sunLower = (sunInsight || '').toLowerCase();
        if (rf.indexOf('emotion') >= 0 || rf.indexOf('flee') >= 0 || rf.indexOf('face') >= 0) {
            if (moonLower.indexOf('emotion') >= 0 || moonLower.indexOf('feel') >= 0 || moonLower.indexOf('flee') >= 0 || moonLower.indexOf('distance') >= 0 || moonLower.indexOf('freedom') >= 0) moonScore++;
            if (sunLower.indexOf('emotion') >= 0 || sunLower.indexOf('feel') >= 0 || sunLower.indexOf('freedom') >= 0 || sunLower.indexOf('detach') >= 0) sunScore++;
        }
        if (rf.indexOf('boundary') >= 0 || rf.indexOf('honesty') >= 0 || rf.indexOf('please') >= 0) {
            if (moonLower.indexOf('harmony') >= 0 || moonLower.indexOf('absorb') >= 0 || moonLower.indexOf('boundary') >= 0 || moonLower.indexOf('receive') >= 0 || moonLower.indexOf('give') >= 0) moonScore++;
            if (sunLower.indexOf('balance') >= 0 || sunLower.indexOf('boundary') >= 0 || sunLower.indexOf('partnership') >= 0) sunScore++;
        }
        if (rf.indexOf('rest') >= 0 || rf.indexOf('acceptance') >= 0 || rf.indexOf('perfect') >= 0) {
            if (moonLower.indexOf('rest') >= 0 || moonLower.indexOf('right') >= 0 || moonLower.indexOf('self-criticism') >= 0) moonScore++;
            if (sunLower.indexOf('rest') >= 0 || sunLower.indexOf('standard') >= 0 || sunLower.indexOf('improve') >= 0) sunScore++;
        }
        if (rf.indexOf('vulnerab') >= 0 || rf.indexOf('open') >= 0) {
            if (moonLower.indexOf('guard') >= 0 || moonLower.indexOf('trust') >= 0 || moonLower.indexOf('depth') >= 0) moonScore++;
            if (sunLower.indexOf('vulnerab') >= 0 || sunLower.indexOf('depth') >= 0 || sunLower.indexOf('transform') >= 0) sunScore++;
        }
        if (rf.indexOf('authentic') >= 0 || rf.indexOf('image') >= 0 || rf.indexOf('perform') >= 0) {
            if (moonLower.indexOf('seen') >= 0 || moonLower.indexOf('valued') >= 0) moonScore++;
            if (sunLower.indexOf('seen') >= 0 || sunLower.indexOf('recognition') >= 0) sunScore++;
        }
        if (rf.indexOf('act') >= 0 || rf.indexOf('analy') >= 0) {
            if (moonLower.indexOf('unexamined') >= 0 || moonLower.indexOf('feeling') >= 0) moonScore++;
            if (sunLower.indexOf('scatter') >= 0 || sunLower.indexOf('focus') >= 0) sunScore++;
        }
        if (rf.indexOf('own') >= 0 || rf.indexOf('allow') >= 0 || rf.indexOf('delegate') >= 0) {
            if (moonLower.indexOf('receive') >= 0 || moonLower.indexOf('give') >= 0) moonScore++;
            if (sunLower.indexOf('delegate') >= 0 || sunLower.indexOf('wait') >= 0) sunScore++;
        }
        if (rf.indexOf('balance') >= 0 || rf.indexOf('self-worth') >= 0) {
            if (moonLower.indexOf('receive') >= 0 || moonLower.indexOf('give') >= 0 || moonLower.indexOf('boundary') >= 0) moonScore++;
            if (sunLower.indexOf('boundary') >= 0 || sunLower.indexOf('self-interest') >= 0) sunScore++;
        }
        return sunScore > moonScore ? sunInsight : moonInsight;
    }
    function getPatternClosing(pattern) {
        var name = (pattern && pattern.name) ? pattern.name.replace(/^The /, '') : '';
        var closings = {
            'Escaper': 'When you feel the urge to flee, pause—that\'s your moment to stay and feel.',
            'Overthinker': 'When you catch yourself looping in analysis, that\'s your cue to take one small action instead.',
            'Pleaser': 'When you feel the pull to absorb others\' needs, honor your own first.',
            'Overgiver': 'When you\'re about to give past your limit, pause and ask what you need.',
            'Fixer': 'When you\'re about to step in and fix, pause—let them own it.',
            'Perfectionist': 'When you feel the pull to get it perfect, choose good enough.',
            'Performer': 'When you\'re about to perform, show up as you are instead.',
            'Guarded One': 'When you feel the walls go up, lean into one small moment of vulnerability.'
        };
        return closings[name] || 'When you notice this pull, pause—that\'s your cue to choose differently.';
    }

    // Foundation Section: Self-Acceptance & How Your Mind Works
    // Integrates self-acceptance philosophy and 10 neuroscience principles
    function getFoundationSection() {
        return `
            <!-- Foundation: Self-Acceptance & How Your Mind Works -->
            <div style="margin-bottom: 2.5rem;">
                <h3 class="workbook-main-title">The Foundation: You're Not Broken</h3>
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(202, 0, 19, 0.05); border-radius: 8px; border-left: 4px solid #ca0013;">
                    <p class="content-text" style="margin-bottom: 1rem; color: #000; font-weight: 500; line-height: 1.7;">Your life will change completely the minute you understand: <strong>there's nothing wrong with you.</strong> You're not broken, and you don't need to heal yourself in order to experience abundance, wealth, freedom, richness, and love.</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #000; line-height: 1.7;">The paradox? It's the opposite: when you own and accept who you are, and learn to love yourself—not perfect, but complete—things become easy. You become magnetic. <strong>So stop fixing yourself. Allow yourself to naturally love and appreciate who you are, as you are, regardless of what you have or don't have.</strong></p>
                    <p class="content-text" style="margin-bottom: 0; color: #000; line-height: 1.7; font-style: italic;">This workbook isn't about fixing you. It's about becoming who you already are at your core: complete and whole, not defined by the patterns that keep you stuck.</p>
                </div>

                <div style="margin-bottom: 2rem;">
                    <h4 class="workbook-step-title">🧠 How Your Mind Actually Works: 10 Principles</h4>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555;">Understanding how your mind works is the foundation of the one-day reset. These principles map to Before → Line → After. Each Part applies specific principles—the protocol is designed to work with your brain, not against it.</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                        <!-- Principle 1 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #2196F3;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">1. Your Brain Creates Reality Through Repetition</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Your brain doesn't distinguish between what's "real" and what you repeat. Neural pathways strengthen with every repeated thought, feeling, or action. If you keep saying "I'm broke" or "I'm not enough," your brain believes it. You can't change what you don't see. <strong>Applied in Part 1 (Before)</strong>: naming what drives you, and in Part 3 (The Line): each interrupt weakens the old pathway, each choice strengthens the new one.</p>
                        </div>

                        <!-- Principle 2 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #4caf50;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">2. Feelings Matter More Than Thoughts</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Your nervous system responds to emotional states, not just thoughts. You attract what feels normal and familiar. If love feels unsafe, you'll keep attracting it that way. You need to <strong>feel</strong> the cost of staying stuck more than you fear it—that creates the charge to change. <strong>Applied in Part 1 (Before)</strong>: "Feel the Cost" creates the emotional momentum for the line.</p>
                        </div>

                        <!-- Principle 3 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #9C27B0;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">3. Your Subconscious Runs 95% of Your Life</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Patterns operate below conscious awareness. Logic alone won't rewire years of conditioning. Repetition plus emotion will. This is why one day creates the <em>line</em>—the decision, the clarity—but <strong>Part 4 (Your After)</strong> daily practice is what rewires the subconscious. Consistency beats intensity. Small daily shifts reprogram what runs on autopilot.</p>
                        </div>

                        <!-- Principle 4 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #ff9800;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">4. Your Nervous System Decides What You Attract</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">In survival mode, you attract survival—not the life you want. The pattern interrupt pulls you out of survival and into choice. When you pause and ask the interrupt, you create a gap where your nervous system can regulate. <strong>Applied in Part 2 (The Line)</strong>: spoken commitment charges the nervous system; <strong>Part 3 (The Line)</strong>: the interrupt itself creates that pause.</p>
                        </div>

                        <!-- Principle 5 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #ca0013;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">5. Identity Is the True Magnet</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Transformation isn't about getting—it's about becoming. Change who you believe you are, and your actions follow. <strong>Applied in Part 1 (Before)</strong>: "Create Your Vision: Who You're Becoming" and the new identity statement. <strong>Part 4 (Your After)</strong>: acting like the person you're becoming daily. Identity drives behavior.</p>
                        </div>

                        <!-- Principle 6 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #00bcd4;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">6. Your Brain Learns Through Imagination</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Your mind rehearses your future. Vividly imagining your After rewires your brain—you're literally rehearsing it. If you can't visualize, use another sense: What would it FEEL like? SOUND like? <strong>Applied in Part 1 (Before)</strong>: the vision exercise, the 3-year vision, closing your eyes and feeling the version of you who's already there.</p>
                        </div>

                        <!-- Principle 7 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #795548;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">7. Consistency Beats Intensity</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">One day draws the line. Days 2 and beyond build the After. Small daily shifts rewire neural pathways more effectively than occasional intensity. <strong>Applied in Part 4 (Your After)</strong>: evening reflection, daily reminders, goals as lenses. Neuroplasticity requires repetition—21–66 days of practice. This day is the start.</p>
                        </div>

                        <!-- Principle 8 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #607d8b;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">8. Doubt Doesn't Stop Transformation. Fear Does.</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">You can doubt and still move forward. Fear keeps you stuck—it activates survival mode and reinforces the old pattern. <strong>Applied in Part 2 (The Line)</strong>: name your fear, then choose awareness anyway. The decision to draw the line happens despite fear, not after it's gone.</p>
                        </div>

                        <!-- Principle 9 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #e91e63;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">9. Actions Matter. But Aligned Action.</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Inspired action comes from identity, not force. Ask: What would the person I'm becoming do? <strong>Applied in Part 1 (Before)</strong>: "One thing this week" and "Decision from who you're becoming." <strong>Part 4 (Your After)</strong>: daily actions timeblocked from your new identity. Aligned action feels natural; forced action exhausts.</p>
                        </div>

                        <!-- Principle 10 -->
                        <div style="padding: 1rem; background: #ffffff; border-radius: 6px; border-left: 3px solid #673ab7;">
                            <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">10. Your Environment Reinforces Your Beliefs</p>
                            <p class="content-text" style="margin: 0; color: #555; line-height: 1.6;">Your phone, room, routines—they reprogram you. If your environment reflects chaos, your nervous system stays in survival mode. If it reflects who you're becoming, it reinforces your new identity. <strong>Applied in Part 4 (Your After)</strong>: environment design. One change tomorrow so the new identity is obvious.</p>
                        </div>
                    </div>

                    <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(202, 0, 19, 0.06); border-radius: 6px; border-left: 4px solid #ca0013;">
                        <p class="content-text" style="margin: 0 0 0.5rem 0; color: #000; font-weight: 600; line-height: 1.7;">One-Day Reset Protocol</p>
                        <p class="content-text" style="margin: 0; color: #555; line-height: 1.7;"><strong>Before</strong> (Part 1): See the pattern. Name it. Feel its cost. Create your vision. — <strong>The Line</strong> (Parts 2 + 3): Decide. Interrupt. Choose differently. — <strong>Your After</strong> (Part 4): Evening reflection. Daily practice. Consciously choose every day. This workbook applies all 10 principles across that structure.</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Life-in-weeks illustration: 104 cols × 40 rows = 4,160 weeks (average lifetime)
     * Red circle position = user's age (weeks lived). Default 35 if no age.
     */
    function getLifeInWeeksIllustration(exactAge) {
        var cols = 104, rows = 40;
        var age = (exactAge != null && !isNaN(parseFloat(exactAge))) ? Math.min(80, Math.max(0, Math.floor(parseFloat(exactAge)))) : 35;
        var weeksLived = age * 52;
        var weekIndex = Math.min(weeksLived, cols * rows - 1);
        var redRow = Math.floor(weekIndex / cols);
        var redCol = weekIndex % cols;
        var cfg = {
            cols: cols,
            rows: rows,
            redRow: redRow,
            redCol: redCol,
            r: 0.7,
            gap: 0.12,
            pad: 0.6,
            livedFill: '#999',
            remainingStroke: '#ddd',
            remainingFill: 'transparent',
            brandRed: '#ca0013',
            strokeWidth: 0.45
        };
        var cell = cfg.r * 2 + cfg.gap;
        var contentW = (cfg.cols - 1) * cell + cfg.r * 2;
        var contentH = (cfg.rows - 1) * cell + cfg.r * 2;
        var w = cfg.pad * 2 + contentW;
        var h = cfg.pad * 2 + contentH;
        var circles = [];
        for (var row = 0; row < cfg.rows; row++) {
            for (var col = 0; col < cfg.cols; col++) {
                var cx = cfg.pad + cfg.r + col * cell;
                var cy = cfg.pad + cfg.r + row * cell;
                var weekIdx = row * cfg.cols + col;
                var isRed = weekIdx === weekIndex;
                var isLived = weekIdx < weekIndex;
                if (isRed) {
                    circles.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + cfg.r + '" fill="' + cfg.brandRed + '" stroke="none"/>');
                } else if (isLived) {
                    circles.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + cfg.r + '" fill="' + cfg.livedFill + '" stroke="none"/>');
                } else {
                    circles.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + cfg.r + '" fill="' + cfg.remainingFill + '" stroke="' + cfg.remainingStroke + '" stroke-width="' + cfg.strokeWidth + '"/>');
                }
            }
        }
        return '<div class="pattern-reset-illo" aria-hidden="true"><svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" class="pattern-reset-illo-svg">' + circles.join('') + '</svg></div>';
    }

    // Pattern Reset Workbook: Before/After Transformation System
    // Core Philosophy: You don't have to wait for life to break you to change. You can choose your moment.
    function getMergedHowToBreakPattern(pattern, firstName, archetype, birthDate, exactAge) {
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

        var illoAge = (exactAge != null && !isNaN(parseFloat(exactAge))) ? Math.min(80, Math.max(0, Math.floor(parseFloat(exactAge)))) : null;
        var illoWeeksLived = illoAge != null ? illoAge * 52 : 1820;
        var illoWeeksAhead = Math.max(0, 4160 - illoWeeksLived);
        var illoNote = illoAge != null ? ' At ' + illoAge + ', the red circle is you—now. That\'s ' + illoWeeksLived + ' weeks lived, ' + illoWeeksAhead + ' ahead.' : '';

        function getLifeAreaAffirmationsHTML(p) {
            const areaAffirmations = PATTERN_ROBOTIC_AFFIRMATIONS_BY_AREA[p.name] || PATTERN_ROBOTIC_AFFIRMATIONS_BY_AREA['The Escaper'];
            const areas = [{ key: 'love', label: 'Love & connection' }, { key: 'money', label: 'Money' }, { key: 'health', label: 'Health' }, { key: 'career', label: 'Career' }, { key: 'identity', label: 'Identity & self-worth' }, { key: 'purpose', label: 'Purpose' }, { key: 'lifestyle', label: 'Lifestyle' }];
            return areas.filter(a => areaAffirmations[a.key]).map(a => '<div style="margin-bottom: 0.75rem;"><p class="content-text" style="margin: 0 0 0.25rem 0; font-size: 0.8rem; color: #ca0013; font-weight: 600;">' + a.label + '</p><p class="content-text" style="margin: 0; font-size: 0.95rem; color: #333;"><strong style="color: #ca0013;">' + areaAffirmations[a.key] + '</strong></p></div>').join('');
        }

        return `
            <div class="workbook-v2">
            <div class="workbook-intro" style="margin-top: 1.5rem;">
                ${getLifeInWeeksIllustration(exactAge)}
                <p class="content-text" style="margin-bottom: 1rem; color: #555; font-size: 0.95rem;">Each circle is one week—4,160 in an average lifetime. Each week holds 7 days.${illoNote} You have a finite number; you can't add more. The only thing you control is making each one count. Your reset happens in one day: today. The red circle is that moment—the day you choose differently. Every week, every day that passes without it is time your pattern keeps running.</p>
                <p class="workbook-intro-lead" style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 700; color: #ca0013; line-height: 1.5;">Make the decision. Interrupt your pattern. Step out of autopilot. Transform your life.</p>
                <p class="content-text" style="margin-bottom: 1rem;">Today you draw the line between <strong>Your Before</strong> and <strong>Your After</strong>. <strong>Your Before</strong> is the pattern that's been running your life—the survival strategy that got you to today, the autopilot that protected you but also kept you stuck. <strong>This moment</strong> is the turning point: clarity, courage, the choice to become better. <strong>Your After</strong> is who you're becoming—built through daily practice and conscious choice, not autopilot.</p>
                <p class="content-text" style="margin-bottom: 1rem;"><strong>Full accountability</strong>—no blame, no excuses. Each day is precious. Every time you choose differently instead of your pattern, you move forward. That's how change happens. Who you're becoming gets built one choice at a time.</p>
                <p class="content-text" style="margin: 0; font-weight: 600; color: #000;">The more honest you are, the more this works.</p>
            </div>

            <div class="workbook-primary-shift">
                <h4 class="workbook-primary-shift-title"><i class="fas fa-bullseye" style="color: #000; font-size: 1rem; margin-right: 0.4rem;"></i><strong>The Shift That Breaks Your Pattern</strong></h4>
                <p class="workbook-primary-shift-focus">${resetFocus}</p>
                ${pattern.coreBelief ? '<p class="workbook-primary-shift-belief">"' + pattern.coreBelief + '"</p>' : ''}
                <p class="workbook-primary-shift-why">${challengesLine}</p>
                <p class="workbook-pill-label" style="margin: 1rem 0 0.5rem 0;">How your ${pattern.name} pattern keeps you stuck</p>
                <div class="workbook-pills workbook-primary-shift-pills">
                    ${getPatternPainOptions(pattern.name).map(function(p){ return '<span class="workbook-pill workbook-pill-display">' + p + '</span>'; }).join('')}
                </div>
                ${getPrimaryShiftPersonalization(resetFocus, pattern, birthDate)}
            </div>

            <div class="workbook-part-divider"></div>
            <details class="workbook-part-details" data-part="1">
                <summary class="workbook-part-summary">
                    <span class="workbook-part-number part-1">1</span>
                    <div class="workbook-part-summary-text">
                        <span class="workbook-part-label">Part 1 — Your Before</span>
                        <h4 class="workbook-part-title">Life Assessment</h4>
                        <p class="workbook-part-subtitle">Your current life—what you love, what you're not happy with, and the cost of staying stuck.</p>
                    </div>
                    <span class="workbook-part-chevron" aria-hidden="true">▶</span>
                </summary>
                <div class="workbook-part-content">
                <p class="workbook-why-line">Honest assessment of where you are. No judgment—just clarity. What's working. What's not. How your pattern reinforces it.</p>

                <div style="margin-bottom: 2rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.75rem;">1. What you love about your life</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">Name what's working. What do you value? What are you grateful for? (Relationships, health, work, creativity, freedom—whatever matters to you.)</p>
                    <div data-journal-id="p1-life-love" style="margin-bottom: 0;">${getJournalUI('e.g., My relationships, my health, my creative work. The freedom to choose.')}</div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.75rem;">2. What you're not happy with</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">What areas are you unhappy with? Click the areas that apply.</p>
                    <div class="workbook-pill-group" data-journal-id="p1-life-pattern-merged">
                        <p class="workbook-pill-label">Where is it not working?</p>
                        <div class="workbook-pills" data-pill-group="areas">
                            ${['Love', 'Money', 'Health', 'Career', 'Identity', 'Purpose', 'Lifestyle', 'How I feel about myself'].map(function(a){ return '<button type="button" class="workbook-pill" data-value="' + a.replace(/"/g, '&quot;') + '">' + a + '</button>'; }).join('')}
                        </div>
                        <div class="workbook-pains-display-container" data-pattern-name="${pattern.name}" style="display: none; margin-top: 1.25rem;">
                            <p class="workbook-pill-label workbook-pains-display-label">Challenges in <span class="workbook-pains-area-names"></span></p>
                            <div class="workbook-pills workbook-pains-display-pills"></div>
                            <div class="workbook-pains-summary" aria-live="polite"></div>
                        </div>
                        <div data-journal-id="p1-life-pattern-merged-extra" class="workbook-pill-extra" style="margin-top: 1rem;"><p class="workbook-pill-extra-label">Go deeper (optional): In one area you selected, what specifically hurts? One sentence.</p>${getJournalUI('e.g., In Love: I keep choosing people who can\'t choose me. In Money: I\'m always one emergency away from collapse.')}</div>
                    </div>
                </div>

                <div style="margin-bottom: 2rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.75rem;">3. Consequences if nothing changes</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">If nothing changes—what does life look like in 5 years? Pick one moment that hurts the most to imagine. Describe it in detail. Let yourself feel it for a few seconds—where do you notice it in your body? Self-compassion, not shame. That feeling is what you're choosing to interrupt.</p>
                    <div data-journal-id="p1-avi-1" style="margin-bottom: 0;">${getJournalUI('e.g., I\'m 40, alone on a Sunday, scrolling. Same loop. I feel it in my chest—the heaviness. That\'s what I\'m interrupting.')}</div>
                </div>
                </div>
            </details>

            <div class="workbook-part-divider"></div>
            <details class="workbook-part-details" data-part="2">
                <summary class="workbook-part-summary">
                    <span class="workbook-part-number part-2">2</span>
                    <div class="workbook-part-summary-text">
                        <span class="workbook-part-label">Part 2 — Draw The Line</span>
                        <h4 class="workbook-part-title">Pattern Interruption</h4>
                        <p class="workbook-part-subtitle">Gain clarity. Choose what you want. Radical honesty about what's keeping you stuck.</p>
                    </div>
                    <span class="workbook-part-chevron" aria-hidden="true">▶</span>
                </summary>
                <div class="workbook-part-content">
                <p class="workbook-why-line">This is the moment. You've assessed your Before. Now: radical honesty, burning desire, the decision, and your pattern interrupt. Write your answers; it makes a difference.</p>
                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">1. Radical honesty — What identity do you need to address?</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">If someone filmed your life and watched all your actions, habits, decisions, and reactions—who would they say you turn into when you're stressed or scared?</p>
                    <div data-journal-id="p2-stuck" style="margin-bottom: 0;">${getJournalUI('e.g., Someone who escapes and numbs out when things get hard. Someone who needs to please everyone to feel safe. Someone who withdraws and shuts down.')}</div>
                    </div>
                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">2. Anti-vision — What you refuse to let your life become</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">Write a single sentence that captures what you refuse to let your life become. It should make you feel something when you read it.</p>
                    <div data-journal-id="p2-anti-vision" style="margin-bottom: 0;">${getJournalUI('e.g., I refuse to let my life become another decade of escaping when things get hard—numbing out, staying busy, never really showing up.')}</div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">3. Actions to timeblock tomorrow</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">What are 2–3 actions you can timeblock tomorrow that the person you're becoming would simply do?</p>
                    <div data-journal-id="p2-actions-timeblock" style="margin-bottom: 0;">${getJournalUI('e.g., 9am: 10 min walk—no phone. 2pm: One difficult conversation I\'ve been avoiding. 7pm: Read my interrupt question and choose one aligned action.')}</div>
                </div>
                <div style="margin-bottom: 1.5rem; padding: 1rem 1.25rem; background: rgba(0, 0, 0, 0.03); border-radius: 6px; border-left: 4px solid #000;">
                    <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">This is how you consciously force a pattern break daily</p>
                    <p class="content-text" style="margin: 0 0 1rem 0; color: #555; font-size: 0.95rem;">When your ${pattern.name} pattern shows up, pause and ask: <strong>"${jump.interrupt}"</strong></p>
                    <p class="content-text" style="margin: 0 0 0.75rem 0; color: #555; font-size: 0.9rem;">You need to consciously create pattern breaks. Take a few minutes now: create 2–3 reminders or calendar events in your phone. Include your interrupt question in each one. Schedule them at random times during the day—the more unexpected, the better. Best times: when you're commuting, walking, or have a free moment.</p>
                    <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #333; font-size: 0.9rem;">Optional questions to add (or use anytime):</p>
                    <ul class="content-list" style="margin: 0; padding-left: 1rem; line-height: 1.8; font-size: 0.9rem;">
                        <li style="margin-bottom: 0.5rem;"><strong style="color: #ca0013;">Where in my life am I trading aliveness for safety?</strong></li>
                        <li style="margin-bottom: 0.5rem;"><strong style="color: #ca0013;">What would change if I stopped needing people to see me as the identity I'm trying to leave behind?</strong></li>
                        <li style="margin-bottom: 0;"><strong style="color: #ca0013;">What's the smallest version of the person I want to become that I could be tomorrow?</strong></li>
                    </ul>
                </div>
                <div style="margin-bottom: 1.5rem; padding: 1.25rem 1.5rem; background: rgba(202, 0, 19, 0.06); border-radius: 8px; border: 2px solid #ca0013;">
                    <p class="content-text" style="margin: 0 0 0.75rem 0; font-weight: 700; color: #000; font-size: 1rem;">Your Definite Chief Aim</p>
                    <p class="content-text" style="margin: 0 0 1rem 0; color: #555; font-size: 0.9rem; line-height: 1.6;">Write one clear statement. Be specific. Vague plans lead to vague results. Include: (1) <strong>What</strong> you want—the identity you're becoming / the ${pName} pattern you're breaking. (2) <strong>When</strong>—a specific date by which you'll have made the shift. (3) <strong>What you'll give in return</strong>—the daily practice, service, or commitment (e.g., using your interrupt, aligning with your new identity). Read aloud twice daily—morning and night—with emotion and faith until it saturates your subconscious.</p>
                    <p class="content-text" style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.85rem; font-style: italic;">Example structure: &ldquo;By [date], I will have broken my ${pName} pattern and become someone who ${resetFocus.toLowerCase()}. In return, I will [your commitment—e.g., use my interrupt daily, choose one aligned action, read this statement twice daily].&rdquo;</p>
                    <div data-journal-id="p1-definite-aim" style="margin-top: 1rem;">${getJournalUI('e.g., By Dec 31, 2025, I will have broken my Escaper pattern and become someone who faces emotions instead of fleeing. In return, I will use my interrupt daily, choose one aligned action, and read this statement morning and night.')}</div>
                </div>
                    <p class="content-text" style="margin: 0 0 0.75rem 0; color: #666; font-size: 0.9rem;">Slip-ups are part of the process. The goal is practice, not perfection.</p>
                    <p class="content-text" style="margin: 0; font-weight: 600; color: #000;">I'm drawing the line. I'm choosing to change.</p>
                </div>
            </details>

            <div class="workbook-part-divider"></div>
            <details class="workbook-part-details" data-part="3">
                <summary class="workbook-part-summary">
                    <span class="workbook-part-number part-3">3</span>
                    <div class="workbook-part-summary-text">
                        <span class="workbook-part-label">Part 3 — Your After</span>
                        <h4 class="workbook-part-title">Identity Shift Protocol</h4>
                        <p class="workbook-part-subtitle">Science-backed identity recoding: life areas, goals, habits, and affirmations aligned with who you're becoming.</p>
                    </div>
                    <span class="workbook-part-chevron" aria-hidden="true">▶</span>
                </summary>
                <div class="workbook-part-content">
                <p class="workbook-why-line">Using what you wrote in Part 2, this section helps you define who you're becoming and the habits that make it real. Neuroscience shows neurons that fire together wire together. Identity-based habits prove behavior follows who you believe you are. This section rewires your ${pattern.name} pattern into the identity you're choosing—through visualization, repetition, and aligned action.</p>

                <div style="margin-bottom: 1.25rem; padding: 1rem 1.25rem; background: rgba(0, 0, 0, 0.03); border-radius: 6px; border-left: 4px solid #000;">
                    <p class="content-text" style="margin: 0; font-weight: 600; color: #000; font-size: 0.95rem;">No overthinking. No second-guessing. No comparing. No judging. No self-sabotage. Hyper-focus on the identity you are rehearsing. Feel it, speak it, act from it.</p>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">1. Identity blueprint — Life areas reimagined</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">Describe the you who has already broken the ${pattern.name} pattern. Pick one or two areas that matter most (love &amp; connection, money &amp; work, health &amp; habits, relationships, self-worth). What do you believe? How do you feel? What would someone close to you notice? Add sensory detail—it helps your brain treat it as real. If this feels hard, start with one area.</p>
                    <div data-journal-id="p3-identity-areas" style="margin-bottom: 0;">${getJournalUI('e.g., In Love: I believe I can be close and stay. I feel calm. Someone close would notice I show up. In Money: I trust the process. I feel grounded.')}</div>
                    </div>

                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">2. One-year proof — What would have to be true?</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">What will your life look like in one year when the old pattern is broken? What would have to be true—behaviors, relationships, decisions—for you to know the shift happened?</p>
                    <div data-journal-id="p3-one-year-proof" style="margin-bottom: 0;">${getJournalUI('e.g., I stay in hard conversations instead of fleeing. I choose one aligned action daily. Someone close tells me I seem calmer. I no longer reach for escape when stressed.')}</div>
                    </div>

                <div style="margin-bottom: 1.5rem;">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.5rem;">3. Desired outcomes + habit stack</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">Pick one outcome and one habit that moves you toward it. Tie it to a cue in your day: <em>When [cue], I will [action].</em> Example: “When I finish my morning coffee, I review my ${pattern.name} interrupt and choose one aligned action.” Start small—specificity and repetition wire the new habit faster.</p>
                    <div data-journal-id="p3-goals-habits" style="margin-bottom: 0;">${getJournalUI('e.g., Outcome: deeper connection. When I finish morning coffee, I check in with one person. Or: Outcome: peace. When I sit down, I review my interrupt.')}</div>
                    </div>

                <div style="margin-bottom: 1.5rem; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, rgba(202, 0, 19, 0.03) 0%, rgba(202, 0, 19, 0.08) 100%); border-radius: 8px; border: 2px solid rgba(202, 0, 19, 0.25);">
                    <p class="how-developed-title" style="font-size: 1rem; margin-bottom: 0.25rem; color: #000; font-weight: 700;">Your vision board list</p>
                    <p class="content-text" style="margin: 0 0 0.75rem 0; color: #ca0013; font-size: 0.9rem; font-weight: 600;">Dream big. Your brain can't tell the difference between a vividly imagined experience and a real one.</p>
                    <p class="content-text" style="margin-bottom: 1rem; color: #555; line-height: 1.6;">From the identity you've defined, list the things, experiences, and qualities you want. Write as if you're already living them—add sensory detail: what do you see, feel, experience? Elevated emotion (gratitude, joy, inspiration) primes your nervous system into a new future. Mental rehearsal wires your brain toward what you focus on.</p>
                    <div data-journal-id="p3-vision-list" style="margin-bottom: 0;">${getJournalUI('e.g., A morning routine where I feel calm and present. A relationship where I\'m seen and safe. Financial freedom that lets me create without worry. A body I feel at home in. Experiences that fill me with awe.')}</div>
                    </div>

                <div style="margin-top: 1.5rem; padding: 1rem 1.25rem; background: rgba(202, 0, 19, 0.06); border-radius: 6px; border-left: 4px solid #ca0013;">
                    <p class="content-text" style="margin: 0 0 0.5rem 0; font-weight: 600; color: #000;">Life-area affirmations — recite daily (morning + night)</p>
                    <p class="content-text" style="margin: 0 0 0.75rem 0; color: #555; font-size: 0.95rem;">Science-backed subconscious rewiring by life area. Speak with intention and feeling. Repetition with emotion rewires the brain.</p>
                    ${getLifeAreaAffirmationsHTML(pattern)}
                    <p class="content-text" style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.85rem; font-style: italic;">Add your own affirmations below, using the desires you wrote in Part 2:</p>
                    <div data-journal-id="p3-my-affirmations" style="margin-top: 0.25rem;">${getJournalUI('e.g., I am worthy of connection. I choose courage over comfort today.')}</div>
                    </div>

                <p class="content-text" style="margin-top: 1.25rem; margin-bottom: 0; font-weight: 600; color: #000;">Who you're becoming is built by repetition + emotion + action. Rehearse it daily. The more honest and consistent you are, the faster the shift.</p>
                </div>
            </details>

            <div class="workbook-part-divider"></div>

            <div class="workbook-conclusion">
                <h4 class="workbook-conclusion-title" style="font-weight: 800; font-size: 1.2rem;">After Day 1: Live With Intention</h4>
                <p class="workbook-conclusion-lead">You've drawn the line. The rest is what you do with it.</p>
                <p class="workbook-conclusion-copy">Recommendation: treat today as day one of a new loop. Each morning, reconnect with your Definite Chief Aim and your interrupt. When your ${pattern.name} pattern shows up, pause—ask your question, choose differently. One decision started this; daily alignment makes it stick. Neuroscience is clear: repeated choice rewires the brain. You don't need more time; you need to make the time you have count.</p>
                <p class="workbook-conclusion-copy">Your potential isn't locked in the past. It's in every moment you choose who you're becoming over who you've been. Live with intention. Seek daily alignment. Use the remaining time you have to reinforce the identity you're building—not the pattern that was running you. You've seen it. You've named it. Now you get to choose it, again and again.</p>
                <p class="workbook-conclusion-close"><strong>The workbook gave you the structure. The rest is yours.</strong></p>
            </div>

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
