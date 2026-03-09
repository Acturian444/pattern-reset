/**
 * Common Ground Social Club — Form, events, dual submission
 * Firestore (primary) + Google Form (spreadsheet)
 */

(function() {
    'use strict';

    // Club data — recurring clubs with weekly rhythm
    // Full venue/address kept for invite emails; only city shown on site
    const CLUBS = [
        {
            id: 'saturday-social-walk',
            name: 'Saturday Social Walk',
            subtitle: 'Walk · Coffee',
            image: 'https://images.unsplash.com/photo-1634600336477-9f2377942a4d?w=200&h=200&fit=crop',
            imageAlt: 'Saturday Social Walk',
            city: 'Mountain View',
            schedule: 'Every Saturday · 9am',
            venue: 'Shoreline Park',
            venueLocation: '3070 N. Shoreline Blvd, Mountain View',
            venueDetail: 'Main entrance · Near kite-flying area',
            description: 'The easiest way in. A walk, coffee, rotating conversations. Same time every week so faces become familiar.',
            capacity: 14,
            badge: 'Best for first-time members',
        },
        {
            id: 'sunday-dinner',
            name: 'Sunday Supper',
            subtitle: 'Dinner · Stories',
            image: 'https://images.unsplash.com/photo-1653860468798-6e1b03654ff1?w=200&h=200&fit=crop',
            imageAlt: 'Sunday Dinner Club',
            city: 'Mountain View',
            schedule: 'Every Sunday · 6pm',
            venue: 'Il Fornaio',
            venueAddress: 'Mountain View',
            venueDetail: 'Sala del Vino private room · Rotating restaurant',
            description: 'Shared table, great food, real stories. Small groups where strangers become people you know.',
            capacity: 10,
            badge: 'Premium experience',
        },
        {
            id: 'music-movement',
            name: 'Friday Flow',
            subtitle: 'Music · Movement',
            image: 'https://images.unsplash.com/photo-1714972383523-7c636d2f0e9b?w=200&h=200&fit=crop',
            imageAlt: 'Friday Flow',
            city: 'Mountain View',
            schedule: 'Every Friday · 7pm',
            venue: 'Pacific Ballet Academy',
            venueLocation: 'Mountain View',
            venueDetail: 'Dance studio · Marley floor · Sound',
            description: 'Music, movement, no judgment. No choreography — just a playlist and people who want to connect.',
            capacity: 14,
            badge: 'Most fun',
        },
    ];

    // Google Form — REPLACE with your form ID and entry IDs after creating the form
    const GOOGLE_FORM = {
        formId: 'YOUR_FORM_ID', // e.g. 1FAIpQLSe...
        entries: {
            firstName: 'entry.XXXXX',
            lastName: 'entry.XXXXX',
            email: 'entry.XXXXX',
            phone: 'entry.XXXXX',
            city: 'entry.XXXXX',
            ageRange: 'entry.XXXXX',
            instagram: 'entry.XXXXX',
            interests: 'entry.XXXXX',
            clubs: 'entry.XXXXX',
            lifeStage: 'entry.XXXXX',
            availability: 'entry.XXXXX',
            peopleEnergize: 'entry.XXXXX',
            whyJoin: 'entry.XXXXX',
            eventInterest: 'entry.XXXXX',
            attendPreference: 'entry.XXXXX',
            musicMovementVariant: 'entry.XXXXX',
            guidelinesAgreed: 'entry.XXXXX',
            contactShareConsent: 'entry.XXXXX',
        },
    };

    function renderClubs() {
        const container = document.getElementById('cg-clubs-container');
        if (!container) return;

        container.innerHTML = CLUBS.map(club => `
            <div class="cg-club-card" data-club-id="${club.id}">
                ${club.image ? `<div class="cg-club-photo-wrap"><img src="${club.image}" alt="${club.imageAlt || club.name}" class="cg-club-photo" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ''}
                <h3>${club.name}</h3>
                <p class="cg-club-subtitle">${club.subtitle}</p>
                ${club.badge ? `<span class="cg-club-badge">${club.badge}</span>` : ''}
                <div class="cg-club-meta">
                    <span class="cg-club-schedule">${club.schedule}</span>
                </div>
                <p class="cg-club-desc">${club.description}</p>
                <a href="#apply" class="cg-btn cg-apply-club" data-club-id="${club.id}">Apply to Join</a>
            </div>
        `).join('');

        // Scroll to form and set club interest when clicking Apply
        container.querySelectorAll('.cg-apply-club').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const clubId = this.getAttribute('data-club-id');
                const eventInput = document.getElementById('cg-eventInterest');
                if (eventInput) eventInput.value = clubId;
                const clubCheckbox = document.querySelector(`input[name="clubs"][value="${clubId}"]`);
                if (clubCheckbox) clubCheckbox.checked = true;
                document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                goToStep(2);
            });
        });
    }

    function getFormData() {
        const form = document.getElementById('cg-apply-form');
        if (!form) return null;

        const clubs = Array.from(form.querySelectorAll('input[name="clubs"]:checked')).map(cb => cb.value);
        const interests = clubs.length ? clubs.join(', ') : '';
        const lifeStage = Array.from(form.querySelectorAll('input[name="lifeStage"]:checked')).map(cb => cb.value);
        const availability = Array.from(form.querySelectorAll('input[name="availability"]:checked')).map(cb => cb.value);

        return {
            firstName: form.querySelector('#cg-firstName')?.value?.trim() || '',
            lastName: form.querySelector('#cg-lastName')?.value?.trim() || '',
            email: form.querySelector('#cg-email')?.value?.trim() || '',
            phone: form.querySelector('#cg-phone')?.value?.trim() || '',
            city: form.querySelector('#cg-city')?.value?.trim() || '',
            ageRange: form.querySelector('#cg-ageRange')?.value || '',
            instagram: form.querySelector('#cg-instagram')?.value?.trim() || '',
            clubs: clubs,
            interests: interests,
            lifeStage: lifeStage,
            lifeStageStr: lifeStage.join(', '),
            availability: availability,
            availabilityStr: availability.join(', '),
            whyJoin: form.querySelector('#cg-whyJoin')?.value?.trim() || '',
            eventInterest: form.querySelector('#cg-eventInterest')?.value || '',
            attendPreference: form.querySelector('input[name="attendPreference"]:checked')?.value || '',
            guidelinesAgreed: form.querySelector('#cg-guidelines')?.checked || false,
            contactShareConsent: form.querySelector('#cg-contactShare')?.checked || false,
        };
    }

    function validateForm(data) {
        if (!data.firstName || !data.lastName || !data.email || !data.city || !data.ageRange) {
            return 'Please fill in all required fields.';
        }
        if (!data.clubs || data.clubs.length === 0) {
            return 'Please select at least one club.';
        }
        if (!data.lifeStage || data.lifeStage.length === 0) {
            return 'Please select at least one option for "Which best describes you right now."';
        }
        if (!data.availability || data.availability.length === 0) {
            return 'Please select when you\'re typically free.';
        }
        if (!data.attendPreference || !data.whyJoin || !data.guidelinesAgreed) {
            return 'Please fill in all required fields and agree to the Community Guidelines.';
        }
        return null;
    }

    async function saveToFirestore(data) {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            throw new Error('Firebase not loaded');
        }
        const db = firebase.firestore();
        const doc = {
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        const ref = await db.collection('commonGroundApplications').add(doc);
        return ref.id;
    }

    function submitToGoogleForm(data) {
        if (!GOOGLE_FORM.formId || GOOGLE_FORM.formId === 'YOUR_FORM_ID') {
            return Promise.resolve(); // Skip if not configured
        }
        const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM.formId}/formResponse`;
        const params = new URLSearchParams();
        const entries = GOOGLE_FORM.entries;
        if (entries.firstName) params.append(entries.firstName, data.firstName);
        if (entries.lastName) params.append(entries.lastName, data.lastName);
        if (entries.email) params.append(entries.email, data.email);
        if (entries.phone) params.append(entries.phone, data.phone);
        if (entries.city) params.append(entries.city, data.city);
        if (entries.ageRange) params.append(entries.ageRange, data.ageRange);
        if (entries.instagram) params.append(entries.instagram, data.instagram);
        if (entries.interests) params.append(entries.interests, data.interests);
        if (entries.clubs) params.append(entries.clubs, data.clubs ? data.clubs.join(', ') : '');
        if (entries.lifeStage) params.append(entries.lifeStage, data.lifeStageStr || '');
        if (entries.availability) params.append(entries.availability, data.availabilityStr || '');
        if (entries.peopleEnergize) params.append(entries.peopleEnergize, data.peopleEnergize || '');
        if (entries.whyJoin) params.append(entries.whyJoin, data.whyJoin);
        if (entries.eventInterest) params.append(entries.eventInterest, data.eventInterest);
        if (entries.attendPreference) params.append(entries.attendPreference, data.attendPreference);
        if (entries.guidelinesAgreed) params.append(entries.guidelinesAgreed, data.guidelinesAgreed ? 'Yes' : 'No');
        if (entries.contactShareConsent) params.append(entries.contactShareConsent, data.contactShareConsent ? 'Yes' : 'No');

        const url = `${baseUrl}?${params.toString()}`;
        return fetch(url, {
            method: 'GET',
            mode: 'no-cors',
        }).catch(() => {}); // Fire-and-forget, don't block
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const data = getFormData();
        if (!data) return;

        const err = validateForm(data);
        if (err) {
            alert(err);
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Submitting...';
        }

        try {
            await saveToFirestore(data);
            await submitToGoogleForm(data);

            document.getElementById('cg-apply-form').classList.add('hidden');
            document.getElementById('cg-success').classList.add('show');
        } catch (err) {
            console.error('Application error:', err);
            alert('Something went wrong. Please try again or contact us at support@mypatternreset.com');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Submit Application';
            }
        }
    }

    function runExperiencesAbTest() {
        const container = document.querySelector('[data-ab-variants]');
        if (!container) return;
        const variants = container.querySelectorAll('.cg-experiences-variant');
        if (variants.length === 0) return;
        const storageKey = 'cg_experiences_ab';
        let variant = null;
        try {
            variant = localStorage.getItem(storageKey);
            if (!variant) {
                variant = Math.random() < 0.5 ? 'a' : 'b';
                localStorage.setItem(storageKey, variant);
            }
        } catch (_) {
            variant = Math.random() < 0.5 ? 'a' : 'b';
        }
        const chosen = container.querySelector(`[data-variant="${variant}"]`);
        if (chosen) chosen.classList.add('cg-ab-active');
    }

    function goToStep(stepNum) {
        const form = document.getElementById('cg-apply-form');
        if (!form) return;
        form.querySelectorAll('.cg-form-step').forEach(s => {
            s.classList.toggle('active', parseInt(s.dataset.step) === stepNum);
        });
        form.querySelectorAll('.cg-form-progress-dot').forEach((dot, i) => {
            const d = parseInt(dot.dataset.step);
            dot.classList.toggle('active', d === stepNum);
            dot.classList.toggle('complete', d < stepNum);
        });
    }

    function init() {
        renderClubs();
        runExperiencesAbTest();

        const form = document.getElementById('cg-apply-form');
        if (form) {
            form.addEventListener('submit', handleSubmit);
            form.querySelectorAll('.cg-form-next').forEach(btn => {
                btn.addEventListener('click', function() {
                    const next = parseInt(this.dataset.next);
                    if (next === 3) {
                        const clubs = form.querySelectorAll('input[name="clubs"]:checked');
                        const lifeStage = form.querySelectorAll('input[name="lifeStage"]:checked');
                        const availability = form.querySelectorAll('input[name="availability"]:checked');
                        if (clubs.length === 0) {
                            alert('Please select at least one club.');
                            return;
                        }
                        if (lifeStage.length === 0) {
                            alert('Please select at least one option for "Which best describes you right now."');
                            return;
                        }
                        if (availability.length === 0) {
                            alert('Please select when you\'re typically free.');
                            return;
                        }
                    }
                    goToStep(next);
                });
            });
            form.querySelectorAll('.cg-form-prev').forEach(btn => {
                btn.addEventListener('click', function() {
                    goToStep(parseInt(this.dataset.prev));
                });
            });
        }

        // Smooth scroll for hero CTA
        document.querySelectorAll('a[href="#apply"]').forEach(a => {
            a.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#apply') {
                    e.preventDefault();
                    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
