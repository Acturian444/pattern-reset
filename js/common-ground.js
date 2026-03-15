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
            description: 'A relaxed walk through the city, coffee after, and small group conversations that rotate so everyone meets. Low-pressure and easy.',
            capacity: 14,
            badge: '⭐ Best for First Time',
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
            description: 'A shared table, great food, and small group conversations that unfold naturally. An easy, low-pressure way to meet new people without awkward small talk.',
            capacity: 10,
            badge: '🍽 Intimate Dinner',
        },
        {
            id: 'music-movement',
            name: 'Friday Flow',
            subtitle: 'Music · Social',
            image: 'https://images.unsplash.com/photo-1714972383523-7c636d2f0e9b?w=200&h=200&fit=crop',
            imageAlt: 'Friday Flow',
            city: 'Mountain View',
            schedule: 'Every Friday · 7pm',
            venue: 'Pacific Ballet Academy',
            venueLocation: 'Mountain View',
            venueDetail: 'Dance studio · Marley floor · Sound',
            description: 'Music, movement, and a room full of people open to connecting. No choreography, no pressure — just a playlist, good energy, and strangers slowly becoming familiar faces.',
            capacity: 14,
            badge: '🎶 Social Energy',
        },
    ];

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
            relationshipStatus: form.querySelector('#cg-relationshipStatus')?.value || '',
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

    function validateStep(stepNum) {
        const form = document.getElementById('cg-apply-form');
        if (!form) return null;
        if (stepNum === 1) {
            const firstName = form.querySelector('#cg-firstName')?.value?.trim();
            const lastName = form.querySelector('#cg-lastName')?.value?.trim();
            const email = form.querySelector('#cg-email')?.value?.trim();
            const city = form.querySelector('#cg-city')?.value?.trim();
            const ageRange = form.querySelector('#cg-ageRange')?.value;
            if (!firstName) return 'Please enter your first name.';
            if (!lastName) return 'Please enter your last name.';
            if (!email) return 'Please enter your email.';
            if (!city) return 'Please enter your city.';
            if (!ageRange) return 'Please select your age range.';
        } else if (stepNum === 2) {
            const clubs = form.querySelectorAll('input[name="clubs"]:checked');
            const lifeStage = form.querySelectorAll('input[name="lifeStage"]:checked');
            const availability = form.querySelectorAll('input[name="availability"]:checked');
            if (clubs.length === 0) return 'Please select at least one club.';
            if (lifeStage.length === 0) return 'Please select at least one option for "Which best describes you right now."';
            if (availability.length === 0) return 'Please select when you\'re typically free.';
        }
        return null;
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
                    const currentStep = next === 2 ? 1 : 2;
                    const err = validateStep(currentStep);
                    if (err) {
                        alert(err);
                        return;
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
