'use strict';

(function () {
    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initLegalNavActiveState() {
        const navLinks = Array.from(document.querySelectorAll('.legal-nav a[href^="#"]'));

        if (!navLinks.length) return;

        const sectionMap = navLinks
            .map((link) => {
                const id = link.getAttribute('href');
                const section = id ? document.querySelector(id) : null;

                return {
                    link,
                    section
                };
            })
            .filter((item) => item.section);

        if (!sectionMap.length) return;

        function clearActive() {
            navLinks.forEach((link) => link.classList.remove('is-active'));
        }

        function setActiveLink(activeLink) {
            clearActive();

            if (activeLink) {
                activeLink.classList.add('is-active');
            }
        }

        const observer = new IntersectionObserver((entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (!visibleEntries.length) return;

            const activeItem = sectionMap.find((item) => item.section === visibleEntries[0].target);

            if (activeItem) {
                setActiveLink(activeItem.link);
            }
        }, {
            root: null,
            threshold: [0.18, 0.28, 0.42],
            rootMargin: '-22% 0px -58% 0px'
        });

        sectionMap.forEach((item) => observer.observe(item.section));

        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                setActiveLink(link);
            });
        });
    }

    function initLegalExternalLinks() {
        document.querySelectorAll('.legal-document a[target="_blank"]').forEach((link) => {
            if (!link.getAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    function initLegalPrintButton() {
        const documentHeader = document.querySelector('.legal-document__header');

        if (!documentHeader || document.querySelector('[data-print-legal]')) return;

        const button = document.createElement('button');

        button.className = 'btn btn--secondary legal-print-btn';
        button.type = 'button';
        button.setAttribute('data-print-legal', '');
        button.innerHTML = `
            Print Page
            <i data-lucide="printer" aria-hidden="true"></i>
        `;

        button.addEventListener('click', () => {
            window.print();
        });

        documentHeader.appendChild(button);
    }

    function initLegalHashFocus() {
        if (!window.location.hash) return;

        const target = document.querySelector(window.location.hash);

        if (!target) return;

        window.setTimeout(() => {
            target.setAttribute('tabindex', '-1');
            target.focus({
                preventScroll: true
            });
        }, 650);
    }

    function initLegalPage() {
        initLegalNavActiveState();
        initLegalExternalLinks();
        initLegalPrintButton();
        initLegalHashFocus();
        refreshIcons();

        window.setTimeout(() => {
            if (window.AOS && typeof window.AOS.refreshHard === 'function') {
                window.AOS.refreshHard();
            }
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', initLegalPage);
})();