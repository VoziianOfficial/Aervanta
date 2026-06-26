'use strict';

(function () {
    const comfortData = {
        cooling: {
            title: 'Air Conditioning Services',
            text: 'This request may fit cooling-related provider options if your home feels warm, your AC system is not keeping up, or certain rooms feel uneven. A participating provider may review your details before offering final scope, availability, scheduling, pricing, and terms.',
            image: 'assets/images/service-2.jpg',
            imageAlt: 'Modern air conditioning vent in a clean interior',
            link: 'air-conditioning-services.html'
        },
        heating: {
            title: 'Heating & Furnace Services',
            text: 'This request may fit heating-related provider options if rooms feel cold, your heating system is not keeping up, or you want to prepare before colder weather. Aervanta does not diagnose heating equipment; participating providers supply final recommendations and terms.',
            image: 'assets/images/service-3.jpg',
            imageAlt: 'Warm home interior with heating control',
            link: 'heating-furnace-services.html'
        },
        replacement: {
            title: 'HVAC Installation & Replacement',
            text: 'This request may fit system upgrade or replacement provider options if your equipment is aging, comfort is inconsistent, or you want to compare new HVAC system paths. Final equipment options, pricing, scheduling, warranties, and installation terms come from participating providers.',
            image: 'assets/images/service-1.jpg',
            imageAlt: 'HVAC equipment prepared for system replacement request',
            link: 'hvac-installation-replacement.html'
        },
        maintenance: {
            title: 'HVAC Maintenance & Tune-Ups',
            text: 'This request may fit seasonal maintenance provider options if you want to prepare before heavy heating or cooling use. Participating providers may review your system type, maintenance scope, access details, and availability before offering final service terms.',
            image: 'assets/images/service-5.jpg',
            imageAlt: 'HVAC maintenance checklist and indoor comfort controls',
            link: 'hvac-maintenance-tune-ups.html'
        },
        airflow: {
            title: 'Indoor Air Quality & Ventilation',
            text: 'This request may fit airflow or ventilation provider options if some rooms feel stuffy, air movement feels weak, or comfort varies throughout the property. A participating provider may review your details before discussing possible ventilation, duct, filtration, or airflow-related options.',
            image: 'assets/images/service-6.jpg',
            imageAlt: 'Ventilation grille in a bright modern interior',
            link: 'indoor-air-quality-ventilation.html'
        },
        'air-quality': {
            title: 'Indoor Air Quality & Ventilation',
            text: 'This request may fit indoor air comfort provider options if you want to compare ventilation, filtration, humidity comfort, or airflow-related service paths. Aervanta does not make medical or health claims; final options depend on participating provider review and availability.',
            image: 'assets/images/hero-air-quality.jpg',
            imageAlt: 'Clean indoor air and ventilation detail in a modern home',
            link: 'indoor-air-quality-ventilation.html'
        }
    };

    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initComfortSelector() {
        const options = Array.from(document.querySelectorAll('[data-comfort-option]'));
        const image = document.querySelector('[data-comfort-image]');
        const visual = image?.closest('.home-comfort__visual');
        const answer = document.querySelector('.home-comfort__answer');
        const title = document.querySelector('[data-comfort-title]');
        const text = document.querySelector('[data-comfort-text]');
        const link = document.querySelector('[data-comfort-link]');

        if (!options.length || !image || !title || !text || !link) return;

        function updateComfort(key) {
            const item = comfortData[key];

            if (!item) return;

            options.forEach((option) => {
                const isActive = option.dataset.comfortOption === key;
                option.classList.toggle('is-active', isActive);
                option.setAttribute('aria-pressed', String(isActive));
            });

            visual?.classList.add('is-changing');
            answer?.classList.add('is-changing');

            window.setTimeout(() => {
                image.src = item.image;
                image.alt = item.imageAlt;
                title.textContent = item.title;
                text.textContent = item.text;
                link.href = item.link;
            }, 120);

            window.setTimeout(() => {
                visual?.classList.remove('is-changing');
                answer?.classList.remove('is-changing');
            }, 360);
        }

        options.forEach((option) => {
            option.setAttribute('aria-pressed', option.classList.contains('is-active') ? 'true' : 'false');

            option.addEventListener('click', () => {
                updateComfort(option.dataset.comfortOption);
            });
        });
    }

    function initSeasonalSwiper() {
        const swiperElement = document.querySelector('[data-seasonal-swiper]');
        const nextButton = document.querySelector('[data-seasonal-next]');
        const prevButton = document.querySelector('[data-seasonal-prev]');

        if (!swiperElement || typeof window.Swiper !== 'function') return;

        const swiper = new window.Swiper(swiperElement, {
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

        return swiper;
    }

    function initPathCardKeyboard() {
        document.querySelectorAll('.home-path-card').forEach((card) => {
            card.addEventListener('focus', () => {
                card.classList.add('is-focused');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('is-focused');
            });
        });
    }

    function initHome() {
        initComfortSelector();
        initSeasonalSwiper();
        initPathCardKeyboard();
        refreshIcons();
    }

    document.addEventListener('DOMContentLoaded', initHome);
})();
