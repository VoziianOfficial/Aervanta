'use strict';

(function () {
    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
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
        initProviderSwiper();
        initProblemGuideFocus();
        refreshIcons();
    }

    document.addEventListener('DOMContentLoaded', initAllServices);
})();
