'use strict';

(function () {
    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initServiceAccordion() {
        const accordion = document.querySelector('[data-service-accordion]');
        const panels = Array.from(document.querySelectorAll('[data-service-panel]'));

        if (!accordion || !panels.length) return;

        panels.forEach((panel) => {
            const trigger = panel.querySelector('.service-accordion__trigger');

            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isOpen = panel.classList.contains('is-open');

                panels.forEach((item) => {
                    const itemTrigger = item.querySelector('.service-accordion__trigger');

                    item.classList.remove('is-open');
                    itemTrigger?.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    panel.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    function initProviderSwiper() {
        const swiperElement = document.querySelector('[data-provider-swiper]');
        const nextButton = document.querySelector('[data-provider-next]');
        const prevButton = document.querySelector('[data-provider-prev]');

        if (!swiperElement || typeof window.Swiper !== 'function') return;

        return new window.Swiper(swiperElement, {
            slidesPerView: 1,
            spaceBetween: 18,
            speed: 650,
            loop: true,
            grabCursor: true,
            autoHeight: false,
            keyboard: {
                enabled: true
            },
            navigation: {
                nextEl: nextButton,
                prevEl: prevButton
            }
        });
    }

    function initProblemGuideFocus() {
        document.querySelectorAll('.problem-guide__item').forEach((item) => {
            item.addEventListener('focus', () => {
                item.classList.add('is-focused');
            });

            item.addEventListener('blur', () => {
                item.classList.remove('is-focused');
            });
        });
    }

    function initAllServices() {
        initServiceAccordion();
        initProviderSwiper();
        initProblemGuideFocus();
        refreshIcons();

        window.setTimeout(() => {
            if (window.AOS && typeof window.AOS.refreshHard === 'function') {
                window.AOS.refreshHard();
            }
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', initAllServices);
})();