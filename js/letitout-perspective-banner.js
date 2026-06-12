/**
 * Let It Out — slim header banner → perspective email capture modal.
 */
(function () {
    const STORAGE_KEY =
        window.LeadCaptureService?.LEAD_STORAGE_KEYS?.perspective ||
        'letitout_perspective_lead_submitted';

    function showLeadFormSuccess(panel, success) {
        if (panel) panel.hidden = true;
        if (success) success.hidden = false;
    }

    function showLeadError(message) {
        const supportEmail =
            window.LeadCaptureService?.SUPPORT_EMAIL || 'resetmypattern@gmail.com';
        const text =
            message ||
            `Something went wrong. Please try again or email ${supportEmail}.`;
        if (window.LeadCaptureService?.showLeadSubmitError) {
            window.LeadCaptureService.showLeadSubmitError(text);
            return;
        }
        if (window.LetItOutUtils?.showError) {
            window.LetItOutUtils.showError(text);
            return;
        }
        alert(text);
    }

    function mountPerspectiveModal() {
        document.querySelector('.support-modal-overlay')?.remove();

        const overlay = document.createElement('div');
        overlay.className = 'support-modal-overlay';
        overlay.innerHTML = `
            <div class="support-modal support-modal--connect support-modal--perspective">
                <button type="button" class="support-modal-close" aria-label="Close">&times;</button>
                <h3 class="support-modal-title">Looking for perspective?</h3>
                <p class="support-modal-body">Leave your email and I&rsquo;ll share reflections and perspectives that may help you make sense of what you&rsquo;re carrying.</p>
                <div class="support-modal-connect-panel" id="perspective-connect-panel">
                    <form class="support-modal-connect-form" id="perspective-connect-form" novalidate>
                        <label class="support-modal-connect-label" for="perspective-connect-email">Email</label>
                        <input type="email" class="support-modal-connect-input" id="perspective-connect-email" name="email" autocomplete="email" inputmode="email" required maxlength="320" placeholder="Where can I reach you?">
                        <button type="submit" class="support-modal-btn support-modal-connect-submit" id="perspective-connect-submit">Send</button>
                    </form>
                </div>
                <div class="support-modal-connect-success" id="perspective-connect-success" hidden role="status" aria-live="polite">
                    <p class="support-modal-connect-success-text">Got it &mdash; I&rsquo;ll reach out soon.</p>
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
        const input = overlay.querySelector('#perspective-connect-email');
        const submit = overlay.querySelector('#perspective-connect-submit');

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = (input?.value || '').trim();
            if (!input?.checkValidity() || !email || email.length > 320) {
                input?.setAttribute('aria-invalid', 'true');
                if (input) input.style.borderColor = '#f10000';
                input?.focus();
                return;
            }

            if (input) {
                input.style.borderColor = '';
                input.removeAttribute('aria-invalid');
            }

            if (
                window.LeadCaptureService?.hasRecentLeadSubmission?.(STORAGE_KEY, email)
            ) {
                showLeadFormSuccess(panel, success);
                return;
            }

            if (!window.LeadCaptureService?.submitPerspectiveBanner) {
                showLeadError();
                return;
            }

            if (submit) {
                submit.disabled = true;
                submit.textContent = 'Sending…';
            }

            try {
                await window.LeadCaptureService.submitPerspectiveBanner(email);
                window.LeadCaptureService.markLeadSubmitted?.(STORAGE_KEY, email);
                showLeadFormSuccess(panel, success);
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', { method: 'letitout_perspective_banner' });
                }
            } catch (err) {
                console.error('Perspective banner submit failed', err);
                input?.setAttribute('aria-invalid', 'true');
                if (input) {
                    input.style.borderColor = '#f10000';
                    input.focus();
                }
                if (submit) {
                    submit.disabled = false;
                    submit.textContent = 'Send';
                }
                showLeadError();
            }
        });

        input?.focus();
    }

    function initPerspectiveBanner() {
        const btn = document.getElementById('letitout-perspective-banner-btn');
        if (!btn) return;
        btn.addEventListener('click', mountPerspectiveModal);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerspectiveBanner);
    } else {
        initPerspectiveBanner();
    }
})();
