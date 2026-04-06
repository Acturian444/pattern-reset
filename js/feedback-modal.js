// Feedback Modal - Questions or feedback about pattern analysis results
// Sends via Apps Script Web App proxy (avoids 400 from direct Google Form POST)
(function() {
    'use strict';

    // CONFIG: After deploying FeedbackTab.gs as Web App, paste the URL here (ends with /exec)
    const FEEDBACK_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxj1FjfKq97xh6pBdMGKxizfYavB2M5U-EclIX6ri_vdnBdrJrmQj0eqUM-R28XI-7R/exec';
    const FEEDBACK_ENTRY_ID = 'entry.206451738';
    const FORM_ACTION = FEEDBACK_WEB_APP_URL || 'https://docs.google.com/forms/d/e/1FAIpQLSfv4rmCtd2JDVeFfjy8a6cDMtQanHzAIwu39H2v-heZVlGYcg/formResponse';
    const IFRAME_NAME = 'feedback-hidden-iframe';

    function closeFeedbackModal() {
        const overlay = document.getElementById('feedback-modal-overlay');
        if (overlay) overlay.classList.remove('feedback-modal-open');
    }

    function submitFeedback() {
        const messageEl = document.getElementById('feedback-message');
        if (!messageEl || !messageEl.value.trim()) return;

        const msg = messageEl.value.trim();
        const btn = document.querySelector('.feedback-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

        try {
            const state = JSON.parse(localStorage.getItem('patternResetQuizState') || '{}');
            const driverScores = state.driverScores || { control: 0, avoidance: 0, validation: 0, 'fear-of-rejection': 0 };
            const totalScore = state.totalScore || 0;
            let patternKey = state.patternKey;

            const sortedDrivers = Object.entries(driverScores).sort((a, b) => b[1] - a[1]);
            if (!patternKey) {
                const relKeys = ['hot-cold-cycle', 'breadcrumb-dynamic', 'commitment-avoidance', 'emotional-distance', 'mixed-signals-loop', 'one-sided-investment'];
                const isRel = sortedDrivers[0] && relKeys.includes(sortedDrivers[0][0]);
                patternKey = isRel ? sortedDrivers[0][0] : ({ control: 'fixer', validation: 'performer', avoidance: 'escaper', 'fear-of-rejection': 'guarded-one' }[sortedDrivers[0][0]] || 'fixer');
            }

            const keyMap = { 'guarded-one': 'withdrawer', 'pleaser': 'people-pleaser', 'escaper': 'avoider', 'overgiver': 'perfectionist' };
            const pattern = (window.relationshipPatterns && window.relationshipPatterns[patternKey]) || (window.personalityPatterns || {})[keyMap[patternKey]] || (window.personalityPatterns || {})[patternKey];
            const archetype = (window.archetypeCategories || {})[sortedDrivers[0][0]] || (pattern && { name: pattern.name });
            const patternDominance = totalScore > 0 ? Math.round((sortedDrivers[0][1] / totalScore) * 100) : 0;

            let exactAge = '';
            let sunSign = '';
            const birthDate = state.birthDate || '';
            if (window.quizExactAge != null) {
                exactAge = String(window.quizExactAge);
            } else if (birthDate && typeof window.calculateExactAge === 'function') {
                const age = window.calculateExactAge(birthDate);
                if (age != null) exactAge = String(age);
            }
            if (birthDate && typeof window.parseBirthDate === 'function' && typeof window.getSunSign === 'function' && typeof window.getElement === 'function') {
                const parsed = window.parseBirthDate(birthDate);
                if (parsed) {
                    sunSign = window.getElement(window.getSunSign(parsed.month, parsed.day)) || '';
                }
            }

            const name = (state.userName || window.quizUserName || '').trim() || 'Feedback submission';
            const email = (state.userEmail || '').trim() || 'feedback@patternreset.com';
            const phone = (state.userPhone || '').trim() || '-';

            const addHidden = (form, name, value) => {
                if (value === undefined || value === null) return;
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = String(value);
                form.appendChild(input);
            };

            const tempForm = document.createElement('form');
            tempForm.action = FORM_ACTION;
            tempForm.method = 'POST';
            tempForm.target = IFRAME_NAME;
            tempForm.style.display = 'none';

            addHidden(tempForm, 'entry.582121306', name);
            addHidden(tempForm, 'entry.1024132954', email);
            addHidden(tempForm, 'entry.479336729', phone);
            addHidden(tempForm, 'entry.1669029656', archetype ? archetype.name : '');
            addHidden(tempForm, 'entry.1636500525', pattern ? pattern.name : '');
            addHidden(tempForm, 'entry.2023467530', patternDominance);
            addHidden(tempForm, 'entry.592148584', pattern && pattern.complex ? pattern.complex.primary : '');
            addHidden(tempForm, 'entry.2142135160', pattern && pattern.complex ? pattern.complex.secondary : '');
            addHidden(tempForm, 'entry.1276258241', birthDate);
            addHidden(tempForm, 'entry.170864257', exactAge);
            addHidden(tempForm, 'entry.1863926933', sunSign);
            addHidden(tempForm, 'entry.231449018', state.relationshipStatus || '');
            addHidden(tempForm, 'entry.1799985826', JSON.stringify(driverScores));
            addHidden(tempForm, 'entry.2066312398', window.quizSecondaryPattern || '');
            addHidden(tempForm, 'entry.2064418059', window.quizSecondaryDriverPercentage !== undefined ? String(window.quizSecondaryDriverPercentage) : '');
            addHidden(tempForm, FEEDBACK_ENTRY_ID, msg);

            document.body.appendChild(tempForm);
            tempForm.submit();
            document.body.removeChild(tempForm);

            messageEl.value = '';
            const c = document.getElementById('feedback-char-num');
            if (c) c.textContent = '0';
            document.getElementById('feedback-form-view').style.display = 'none';
            document.getElementById('feedback-success-view').style.display = 'block';
            setTimeout(closeFeedbackModal, 2000);
        } catch (err) {
            console.error('Feedback submit error:', err);
            if (typeof alert === 'function') alert('Something went wrong. Please try again.');
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Send Feedback'; }
    }

    function createFeedbackModal() {
        if (document.getElementById('feedback-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'feedback-modal-overlay';
        overlay.className = 'feedback-modal-overlay';

        overlay.innerHTML = `
            <div class="feedback-modal-container">
                <button type="button" class="feedback-modal-close" aria-label="Close">&times;</button>
                <div id="feedback-form-view">
                    <h3 class="feedback-modal-title">Questions or Feedback?</h3>
                    <p class="feedback-modal-subtitle">We'd love to hear from you. Your feedback helps us improve the pattern analysis experience.</p>
                    <form id="feedback-form" class="feedback-form">
                        <textarea id="feedback-message" name="feedback" placeholder="Your message, questions, or suggestions..." rows="5" required maxlength="2000"></textarea>
                        <span class="feedback-char-count"><span id="feedback-char-num">0</span>/2000</span>
                        <button type="submit" class="feedback-submit-btn">Send Feedback</button>
                    </form>
                </div>
                <div id="feedback-success-view" class="feedback-success-view" style="display: none;">
                    <div class="feedback-success-icon"><i class="fas fa-check-circle"></i></div>
                    <h3 class="feedback-success-title">Thank you!</h3>
                    <p class="feedback-success-message">Your feedback has been sent. We appreciate you taking the time to help us improve.</p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        if (!document.querySelector('iframe[name="' + IFRAME_NAME + '"]')) {
            const iframe = document.createElement('iframe');
            iframe.name = IFRAME_NAME;
            iframe.style.cssText = 'display:none;';
            document.body.appendChild(iframe);
        }

        overlay.querySelector('.feedback-modal-close').onclick = closeFeedbackModal;
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeFeedbackModal();
        });

        const textarea = document.getElementById('feedback-message');
        const charCount = document.getElementById('feedback-char-num');
        if (textarea && charCount) {
            textarea.addEventListener('input', function() {
                charCount.textContent = this.value.length;
            });
        }

        document.getElementById('feedback-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitFeedback();
        });
    }

    window.showFeedbackModal = function() {
        createFeedbackModal();
        const formView = document.getElementById('feedback-form-view');
        const successView = document.getElementById('feedback-success-view');
        if (formView) formView.style.display = '';
        if (successView) successView.style.display = 'none';
        const overlay = document.getElementById('feedback-modal-overlay');
        if (overlay) overlay.classList.add('feedback-modal-open');
    };
    window.closeFeedbackModal = closeFeedbackModal;
})();
