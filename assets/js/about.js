'use strict';

(function () {
    const trustData = {
        guarantees: {
            title: 'No fake guarantees',
            text: 'Aervanta does not promise lowest pricing, same-day service, guaranteed outcomes, or approved contractor performance. Users compare available provider options and decide how to continue.'
        },
        contractor: {
            title: 'No direct contractor wording',
            text: 'Aervanta is not positioned as an HVAC contractor, installer, technician team, inspector, manufacturer, retailer, or official service provider. The platform helps organize requests for independent provider matching.'
        },
        terms: {
            title: 'Transparent provider terms',
            text: 'Final pricing, scheduling, warranties, licenses, insurance, availability, and service terms are supplied by participating independent providers, not by Aervanta.'
        },
        verify: {
            title: 'Homeowner verifies provider credentials',
            text: 'Before choosing any provider, the homeowner is responsible for reviewing provider credentials, license information, insurance details, quote terms, warranty terms, and service agreement details.'
        }
    };

    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initTrustSwitcher() {
        const buttons = Array.from(document.querySelectorAll('[data-trust-key]'));
        const title = document.querySelector('[data-trust-title]');
        const text = document.querySelector('[data-trust-text]');
        const panel = document.querySelector('.about-trust__panel');

        if (!buttons.length || !title || !text) return;

        function updateTrust(key) {
            const item = trustData[key];

            if (!item) return;

            buttons.forEach((button) => {
                const isActive = button.dataset.trustKey === key;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            panel?.classList.add('is-changing');

            window.setTimeout(() => {
                title.textContent = item.title;
                text.textContent = item.text;
            }, 120);

            window.setTimeout(() => {
                panel?.classList.remove('is-changing');
            }, 320);
        }

        buttons.forEach((button) => {
            button.setAttribute('aria-pressed', button.classList.contains('is-active') ? 'true' : 'false');

            button.addEventListener('click', () => {
                updateTrust(button.dataset.trustKey);
            });
        });
    }

    function initAbout() {
        initTrustSwitcher();
        refreshIcons();

        if (window.Aervanta && typeof window.Aervanta.setupCounters === 'function') {
            window.Aervanta.setupCounters(document);
        }

        window.setTimeout(() => {
            if (window.AOS && typeof window.AOS.refreshHard === 'function') {
                window.AOS.refreshHard();
            }
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', initAbout);
})();