'use strict';

(function () {
    const snapshotData = {
        installation: [
            {
                label: 'System planning',
                title: 'System upgrade request path',
                text: 'This request path may fit homeowners comparing HVAC installation, system replacement, or comfort upgrade options. Aervanta helps organize request details, while participating providers supply final equipment options, pricing, scheduling, warranty terms, and service agreements.'
            },
            {
                label: 'Replacement notes',
                title: 'Aging equipment can shape the request',
                text: 'Homeowners often use this category when existing equipment feels outdated, comfort is inconsistent, or they want to compare replacement options. Aervanta does not install systems or recommend equipment directly.'
            },
            {
                label: 'Provider options',
                title: 'Participating providers may review project details',
                text: 'Providers may consider property size, current equipment, access areas, comfort goals, timing, and local requirements before discussing final terms.'
            },
            {
                label: 'Final terms',
                title: 'Final scope comes from providers',
                text: 'Pricing, installation details, equipment availability, warranties, permits, schedules, licenses, insurance, and service outcomes are provided by participating independent providers.'
            }
        ],

        cooling: [
            {
                label: 'Cooling issue',
                title: 'Cooling request path',
                text: 'This request path may fit AC-related concerns such as warm air from vents, uneven cooling, or cooling system service needs. Aervanta does not diagnose AC problems or perform repair work directly.'
            },
            {
                label: 'System service',
                title: 'Share what you notice',
                text: 'Useful request details may include when the cooling issue appears, which rooms are affected, system age if known, and whether the request feels urgent.'
            },
            {
                label: 'Provider options',
                title: 'Compare available cooling providers',
                text: 'Participating providers may review your cooling request and decide whether they can discuss availability, scope, quote details, and next steps.'
            },
            {
                label: 'Final terms',
                title: 'Provider terms stay separate',
                text: 'Any final pricing, scheduling, service agreement, warranty, license, insurance, or repair outcome is provided by the participating independent provider.'
            }
        ],

        heating: [
            {
                label: 'Heating issue',
                title: 'Heating request path',
                text: 'This request path may fit furnace or heating-related concerns such as cold rooms, uneven warmth, winter readiness, or heating system service requests. Aervanta does not repair furnaces or diagnose heating systems.'
            },
            {
                label: 'Warmth notes',
                title: 'Describe the comfort pattern',
                text: 'Homeowners may describe which rooms feel cold, whether heating feels uneven, when the issue started, and what type of heating equipment they have if known.'
            },
            {
                label: 'Provider options',
                title: 'Review available heating provider options',
                text: 'Participating providers may consider system type, property layout, access, timing, and local availability before discussing final scope or terms.'
            },
            {
                label: 'Final terms',
                title: 'Final details come from providers',
                text: 'Scheduling, pricing, warranties, service terms, licenses, insurance, and outcomes are determined by participating independent providers.'
            }
        ],

        heatpump: [
            {
                label: 'Heat pump path',
                title: 'Heat pump request category',
                text: 'This request path may fit heat pump installation, replacement, or service-related requests. Aervanta helps organize the request, but does not install, repair, inspect, or guarantee heat pump performance.'
            },
            {
                label: 'System option',
                title: 'Heating and cooling comfort may be part of the request',
                text: 'Heat pump requests may involve comfort goals, equipment age, property needs, current system type, and interest in comparing system options.'
            },
            {
                label: 'Provider options',
                title: 'Providers may review project fit',
                text: 'Participating providers may consider property size, equipment access, local requirements, scheduling, and provider-specific terms before discussing options.'
            },
            {
                label: 'Final terms',
                title: 'No guaranteed savings claims',
                text: 'Aervanta does not guarantee savings, eligibility, equipment performance, pricing, or availability. Final terms are supplied by participating providers.'
            }
        ],

        maintenance: [
            {
                label: 'Seasonal care',
                title: 'Maintenance request path',
                text: 'This request path may fit seasonal HVAC maintenance or tune-up requests before heavy heating or cooling use. Aervanta does not inspect equipment or perform maintenance directly.'
            },
            {
                label: 'Tune-up notes',
                title: 'Share basic system and timing details',
                text: 'Homeowners may include system type, last known maintenance timing, comfort concerns, and preferred timing for provider follow-up.'
            },
            {
                label: 'Provider options',
                title: 'Compare maintenance availability',
                text: 'Participating providers may review availability, service scope, system category, access details, and provider-specific tune-up terms.'
            },
            {
                label: 'Final terms',
                title: 'Provider defines the maintenance scope',
                text: 'Final tune-up scope, pricing, scheduling, warranties, service terms, licenses, insurance, and outcomes come from participating independent providers.'
            }
        ],

        airquality: [
            {
                label: 'Airflow comfort',
                title: 'Indoor air and ventilation request path',
                text: 'This request path may fit airflow, ventilation, filtration, humidity comfort, or indoor air comfort requests. Aervanta does not provide medical advice or health claims.'
            },
            {
                label: 'Ventilation notes',
                title: 'Describe airflow and comfort concerns',
                text: 'Useful details may include weak airflow, stuffy rooms, uneven ventilation, filtration interests, or general indoor comfort concerns.'
            },
            {
                label: 'Provider options',
                title: 'Providers may review ventilation details',
                text: 'Participating providers may consider property layout, duct or vent access, equipment type, airflow notes, and provider-specific terms.'
            },
            {
                label: 'Final terms',
                title: 'Final options depend on provider review',
                text: 'Any ventilation, filtration, airflow, or indoor comfort option is discussed and provided by participating independent providers, not by Aervanta.'
            }
        ]
    };

    function getPageKey() {
        return document.body.dataset.serviceKey || document.querySelector('[data-service-page]')?.dataset.servicePage || 'installation';
    }

    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initSnapshotTabs() {
        const tabs = Array.from(document.querySelectorAll('[data-snapshot-tab]'));
        const card = document.querySelector('[data-snapshot-card]');
        const label = document.querySelector('[data-snapshot-label]');
        const title = document.querySelector('[data-snapshot-title]');
        const text = document.querySelector('[data-snapshot-text]');
        const pageKey = getPageKey();
        const items = snapshotData[pageKey] || snapshotData.installation;

        if (!tabs.length || !card || !label || !title || !text) return;

        function updateSnapshot(index) {
            const item = items[index];

            if (!item) return;

            tabs.forEach((tab, tabIndex) => {
                const isActive = tabIndex === index;

                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', String(isActive));
                tab.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            card.classList.add('is-changing');

            window.setTimeout(() => {
                label.textContent = item.label;
                title.textContent = item.title;
                text.textContent = item.text;
            }, 110);

            window.setTimeout(() => {
                card.classList.remove('is-changing');
            }, 340);
        }

        tabs.forEach((tab, index) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', tab.classList.contains('is-active') ? 'true' : 'false');
            tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');

            tab.addEventListener('click', () => updateSnapshot(index));

            tab.addEventListener('keydown', (event) => {
                const currentIndex = tabs.indexOf(tab);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabs.length;
                }

                if (event.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                }

                if (nextIndex !== currentIndex) {
                    event.preventDefault();
                    tabs[nextIndex].focus();
                    updateSnapshot(nextIndex);
                }
            });
        });
    }

    function initServiceFaq() {
        if (window.Aervanta && typeof window.Aervanta.setupAccordions === 'function') {
            window.Aervanta.setupAccordions(document);
        }
    }

    function initServiceIconStrip() {
        if (window.Aervanta && typeof window.Aervanta.renderDarkServiceIconStrips === 'function') {
            window.Aervanta.renderDarkServiceIconStrips();
        }
    }

    function initServices() {
        initSnapshotTabs();
        initServiceFaq();
        initServiceIconStrip();
        refreshIcons();
    }

    document.addEventListener('DOMContentLoaded', initServices);
})();
