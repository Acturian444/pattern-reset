/**
 * Let It Out — series story form (banner + Write footer).
 * Same fields as the bio link "The Things We Don't Say" form.
 */
(function (g) {
    const STORAGE_KEY =
        g.LeadCaptureService?.LEAD_STORAGE_KEYS?.perspective ||
        'letitout_perspective_lead_submitted';

    const KIND_OPTIONS = [
        'Something I never told anyone',
        'Something I did',
        'Something they did',
        'Something I regret',
        'Something I can\'t explain',
        'Something else',
    ];

    function showLeadFormSuccess(overlay, panel, success) {
        const title = overlay?.querySelector('.support-modal-title');
        const body = overlay?.querySelector('.support-modal-body');
        if (title) title.hidden = true;
        if (body) body.hidden = true;
        if (panel) panel.hidden = true;
        if (success) success.hidden = false;
    }

    function showLeadError(message) {
        const supportEmail =
            g.LeadCaptureService?.SUPPORT_EMAIL || 'resetmypattern@gmail.com';
        const text =
            message ||
            `Something went wrong. Please try again or email ${supportEmail}.`;
        if (g.LeadCaptureService?.showLeadSubmitError) {
            g.LeadCaptureService.showLeadSubmitError(text);
            return;
        }
        if (g.LetItOutUtils?.showError) {
            g.LetItOutUtils.showError(text);
            return;
        }
        alert(text);
    }

    function markInvalid(el) {
        if (!el) return;
        el.setAttribute('aria-invalid', 'true');
        el.style.borderColor = '#f10000';
        el.focus();
    }

    function clearInvalid(el) {
        if (!el) return;
        el.style.borderColor = '';
        el.removeAttribute('aria-invalid');
    }

    function mountSeriesModal() {
        document.querySelector('.support-modal-overlay')?.remove();

        const options = KIND_OPTIONS.map(
            (label) => `<option>${label}</option>`
        ).join('');

        const overlay = document.createElement('div');
        overlay.className = 'support-modal-overlay';
        overlay.innerHTML = `
            <div class="support-modal support-modal--connect support-modal--perspective" role="dialog" aria-modal="true" aria-labelledby="series-story-title">
                <button type="button" class="support-modal-close" aria-label="Close">&times;</button>
                <h3 class="support-modal-title" id="series-story-title">The Things We Don&rsquo;t Say</h3>
                <p class="support-modal-body">Have something you never told anyone, something you did, something they did, something you regret, or something you can&rsquo;t explain? Submit it here for a chance to be featured in a video. You can stay completely anonymous!</p>
                <div class="support-modal-connect-panel" id="perspective-connect-panel">
                    <form class="support-modal-connect-form" id="perspective-connect-form" novalidate>
                        <label class="support-modal-connect-label" for="perspective-story-kind">What is this?</label>
                        <select class="support-modal-connect-input support-modal-connect-select" id="perspective-story-kind" name="kind" required>
                            <option value="" selected disabled>Choose one</option>
                            ${options}
                        </select>
                        <label class="support-modal-connect-label" for="perspective-story-text">Your story</label>
                        <textarea class="support-modal-connect-input support-modal-connect-textarea" id="perspective-story-text" name="story" required maxlength="10000" placeholder="Start with what happened…"></textarea>
                        <label class="support-modal-connect-label" for="perspective-connect-email">Email</label>
                        <input type="email" class="support-modal-connect-input" id="perspective-connect-email" name="email" autocomplete="email" inputmode="email" required maxlength="320" placeholder="Where can I reach you?">
                        <button type="submit" class="support-modal-btn support-modal-connect-submit" id="perspective-connect-submit">Submit</button>
                        <p class="support-modal-series-note">By submitting, you agree this is your own experience, you&rsquo;re 18 or over, and I may tell it anonymously in a video for The Things We Don&rsquo;t Say, with no names.</p>
                    </form>
                </div>
                <div class="support-modal-connect-success" id="perspective-connect-success" hidden role="status" aria-live="polite">
                    <p class="support-modal-connect-success-title">Thank you for trusting me with this.</p>
                    <p class="support-modal-connect-success-text">I read every story. I don&rsquo;t feature them all. If I need more detail, or if yours may be one I tell, I may email you.</p>
                    <p class="support-modal-connect-success-close">You&rsquo;re not carrying this alone anymore.</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('visible'), 10);

        const closeModal = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.support-modal-close')?.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        const form = overlay.querySelector('#perspective-connect-form');
        const panel = overlay.querySelector('#perspective-connect-panel');
        const success = overlay.querySelector('#perspective-connect-success');
        const kindEl = overlay.querySelector('#perspective-story-kind');
        const storyEl = overlay.querySelector('#perspective-story-text');
        const input = overlay.querySelector('#perspective-connect-email');
        const submit = overlay.querySelector('#perspective-connect-submit');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const kind = (kindEl?.value || '').trim();
            const story = (storyEl?.value || '').trim();
            const email = (input?.value || '').trim();

            if (!kind) {
                markInvalid(kindEl);
                return;
            }
            clearInvalid(kindEl);

            if (!story || story.length < 3 || story.length > 10000) {
                markInvalid(storyEl);
                return;
            }
            clearInvalid(storyEl);

            if (!input?.checkValidity() || !email || email.length > 320) {
                markInvalid(input);
                return;
            }
            clearInvalid(input);

            if (g.LeadCaptureService?.hasRecentLeadSubmission?.(STORAGE_KEY, email)) {
                showLeadFormSuccess(overlay, panel, success);
                return;
            }

            if (!g.LeadCaptureService?.submitSeriesStory) {
                showLeadError();
                return;
            }

            if (submit) {
                submit.disabled = true;
                submit.textContent = 'Submitting…';
            }

            try {
                await g.LeadCaptureService.submitSeriesStory({ email, kind, story });
                g.LeadCaptureService.markLeadSubmitted?.(STORAGE_KEY, email);
                showLeadFormSuccess(overlay, panel, success);
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', { method: 'letitout_series_story' });
                }
            } catch (err) {
                console.error('Series story submit failed', err);
                markInvalid(input);
                if (submit) {
                    submit.disabled = false;
                    submit.textContent = 'Submit';
                }
                showLeadError();
            }
        });

        kindEl?.focus();
    }

    function initPerspectiveBanner() {
        const btn = document.getElementById('letitout-perspective-banner-btn');
        if (!btn) return;
        btn.addEventListener('click', mountSeriesModal);
    }

    g.LetItOutSeriesForm = { open: mountSeriesModal };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerspectiveBanner);
    } else {
        initPerspectiveBanner();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window);
