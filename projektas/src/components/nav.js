// src/components/nav.js

export function initNavbar() {
    const nav = document.querySelector('nav');
    const scrollBtn = document.getElementById('scrollTopBtn');
    const menuToggleBtn = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const menu = document.getElementById('navbar-sticky');

    let lastScrollTop = 0;

    if (!nav) return;

    // SCROLL LOGIKA
    window.addEventListener('scroll', () => {
        const y = window.scrollY || document.documentElement.scrollTop;

        // nav elgsena
        if (y <= 10) {
            nav.classList.add('transparent');
            nav.classList.remove('hidden', 'visible');
        } else if (y > lastScrollTop) {
            // scrollinam žemyn
            nav.classList.remove('visible', 'transparent');
            nav.classList.add('hidden');
        } else {
            // scrollinam aukštyn
            nav.classList.remove('hidden', 'transparent');
            nav.classList.add('visible');
        }

        lastScrollTop = y;

        // scroll-to-top mygtuko rodymas
        if (scrollBtn) {
            if (y > 50) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        }
    });

    // SCROLL TO TOP
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // MOBILUS MENIU (tavo HTML jau turi data-collapse-toggle)
    if (menuToggleBtn && menu) {
        menuToggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}
