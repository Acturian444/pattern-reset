document.addEventListener('DOMContentLoaded', () => {
    // Use .nav-hamburger to target the open button specifically (avoids matching close btn)
    const hamburger = document.querySelector('.nav-hamburger') || document.querySelector('.hamburger:not(.menu-overlay .hamburger)');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeBtn = document.querySelector('.menu-overlay .close-btn');

    const openMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    // Expose globally for inline onclick handlers
    window.openMenu = openMenu;
    window.closeMenu = closeMenu;

    const toggleMenu = (e) => {
        if (e) e.preventDefault();
        if (menuOverlay && menuOverlay.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on the overlay background
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }

    // Close menu when clicking on a menu link
    const menuLinks = document.querySelectorAll('.menu-overlay nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}); 