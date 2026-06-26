'use strict';

(function () {
    const trustData = {
        guarantees: {
            title: 'No fake guarantees',
            text: 'Aervanta does not promise lowest pricing, same-day service, guaranteed outcomes, or approved contractor performance, because every request depends on independent provider availability, property conditions, timing, and the exact scope the homeowner wants to discuss. Users compare available provider options, review the details that matter to their situation, and decide how to continue only after considering the provider terms, communication quality, and the information shared during the request process.'
        },
        contractor: {
            title: 'No direct contractor wording',
            text: 'Aervanta is not positioned as an HVAC contractor, installer, technician team, inspector, manufacturer, retailer, or official service provider, and the site language is written to reflect that separation clearly across service descriptions, request flows, and supporting legal pages. The platform helps organize homeowner requests for independent provider matching so users can compare next-step options without mistaking Aervanta for the company that would ultimately inspect, quote, schedule, or perform the work.'
        },
        terms: {
            title: 'Transparent provider terms',
            text: 'Final pricing, scheduling, warranties, licenses, insurance, availability, and service terms are supplied by participating independent providers, not by Aervanta, because those details can change based on service area coverage, system type, calendar capacity, and the provider policies attached to a specific job. Homeowners are encouraged to read every quote, timeline, warranty note, and service condition carefully so the final decision is based on the provider’s actual terms instead of broad assumptions made before direct follow-up begins.'
        },
        verify: {
            title: 'Homeowner verifies provider credentials',
            text: 'Before choosing any provider, the homeowner is responsible for reviewing provider credentials, license information, insurance details, quote terms, warranty terms, and service agreement details, especially when comparing options for larger repairs, replacements, or ongoing maintenance arrangements. That verification step helps the homeowner confirm that the provider aligns with the project expectations, communication standards, and documentation requirements that matter before any service visit, purchase, or agreement moves forward.'
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
