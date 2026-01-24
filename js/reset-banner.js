(function() {
    const banner = document.querySelector('.global-reset-banner');
    const countdownEl = document.getElementById('reset-countdown');
    if (!banner || !countdownEl) return;

    function pad(value) {
        return String(value).padStart(2, '0');
    }

    function getNextResetDate() {
        const now = new Date();
        let target = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        if (now >= target) {
            target = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
        }
        return target;
    }

    function updateBodyOffset() {
        if (!document.body.classList.contains('has-reset-banner')) return;
        document.body.style.setProperty('--reset-banner-height', `${banner.offsetHeight}px`);
    }

    function renderCountdown(days, hours, minutes) {
        const segments = [
            { value: pad(days), unit: 'Days' },
            { value: pad(hours), unit: 'Hours' },
            { value: pad(minutes), unit: 'Minutes' }
        ];
        countdownEl.innerHTML = segments.map(segment => `
            <span class="count-segment">
                <span class="count-value">${segment.value}</span>
                <span class="count-unit">${segment.unit}</span>
            </span>
        `).join('');
        updateBodyOffset();
    }

    function updateCountdown() {
        const now = new Date();
        const target = getNextResetDate();
        const diff = target - now;

        if (diff <= 0) {
            renderCountdown(0, 0, 0);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        renderCountdown(days, hours, minutes);
    }

    updateCountdown();
    updateBodyOffset();
    setInterval(updateCountdown, 60000);
    window.addEventListener('resize', updateBodyOffset);
    window.addEventListener('orientationchange', updateBodyOffset);
})();



