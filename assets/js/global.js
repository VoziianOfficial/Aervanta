'use strict';

(function () {
    const config = window.AERVANTA_CONFIG || {};

    const SELECTORS = {
        header: '.site-header',
        preHeader: '.pre-header',
        mobileMenu: '.mobile-menu',
        menuToggle: '.menu-toggle',
        dropdownTrigger: '.site-nav__trigger',
        cookieBanner: '.cookie-banner',
        accordion: '[data-accordion]',
        counter: '[data-counter]'
    };

    const state = {
        mobileMenuOpen: false,
        dropdownTimer: null
    };

    function getValue(path, fallback = '') {
        if (!path || typeof path !== 'string') return fallback;

        return path.split('.').reduce((source, key) => {
            if (source && Object.prototype.hasOwnProperty.call(source, key)) {
                return source[key];
            }

            return undefined;
        }, config) ?? fallback;
    }

    function safeText(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function safeUrl(value) {
        const url = String(value ?? '').trim();

        if (!url) return '#';

        if (
            url.startsWith('http://') ||
            url.startsWith('https://') ||
            url.startsWith('mailto:') ||
            url.startsWith('tel:') ||
            url.startsWith('#') ||
            url.endsWith('.html') ||
            url.endsWith('.php') ||
            url.startsWith('assets/')
        ) {
            return url;
        }

        return '#';
    }

    function icon(name, extraClass = '') {
        return `<i data-lucide="${safeText(name)}" class="${safeText(extraClass)}" aria-hidden="true"></i>`;
    }

    function getCurrentPageName() {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return file;
    }

    function isCurrentUrl(url) {
        const current = getCurrentPageName();
        const target = String(url || '').split('/').pop();

        if (current === '' && target === 'index.html') return true;
        return current === target;
    }

    function serviceLinksMarkup(className, includeIcons = true) {
        const services = Array.isArray(config.services) ? config.services : [];

        return services.map((service) => {
            const iconMarkup = includeIcons ? icon(service.icon || 'circle-arrow-right') : '';
            return `
                <a class="${className}" href="${safeUrl(service.file)}">
                    ${includeIcons ? iconMarkup : ''}
                    <span>${safeText(service.title)}</span>
                    ${includeIcons ? icon('arrow-up-right') : ''}
                </a>
            `;
        }).join('');
    }

    function buildHeader() {
        if (document.querySelector(SELECTORS.preHeader) || document.querySelector(SELECTORS.header)) {
            return;
        }

        const headerMarkup = `
            <div class="pre-header" data-site-preheader>
                <div class="container-wide pre-header__inner">
                    <div class="pre-header__group">
                        <a class="pre-header__item" href="tel:${safeText(config.contact?.phoneRaw)}">
                            ${icon('phone')}
                            <span data-config="contact.phoneDisplay">${safeText(config.contact?.phoneDisplay)}</span>
                        </a>

                        <a class="pre-header__item pre-header__item--hide-mobile" href="mailto:${safeText(config.contact?.email)}">
                            ${icon('mail')}
                            <span data-config="contact.email">${safeText(config.contact?.email)}</span>
                        </a>
                    </div>

                    <div class="pre-header__group">
                        <span class="pre-header__item">
                            ${icon('map-pin')}
                            <span data-config="company.serviceArea">${safeText(config.company?.serviceArea)}</span>
                        </span>

                        <span class="pre-header__item">
                            ${icon('clock-3')}
                            <span data-config="contact.supportHours">${safeText(config.contact?.supportHours)}</span>
                        </span>
                    </div>
                </div>
            </div>

            <header class="site-header" data-site-header>
                <div class="container-wide site-header__inner">
                    <a class="brand-link" href="index.html" aria-label="${safeText(config.brand?.name)} home">
                        <img class="brand-link__logo" src="${safeUrl(config.brand?.logo)}" alt="${safeText(config.brand?.logoAlt)}" width="56" height="56">
                        <span class="brand-link__text">
                            <span class="brand-link__name" data-config="brand.name">${safeText(config.brand?.name)}</span>
                            <span class="brand-link__tagline" data-config="brand.tagline">${safeText(config.brand?.tagline)}</span>
                        </span>
                    </a>

                    <nav class="site-nav" aria-label="Primary navigation">
                        <a class="site-nav__link" href="index.html">Home</a>
                        <a class="site-nav__link" href="about.html">About</a>

                        <div class="site-nav__item">
                            <a class="site-nav__trigger" href="all-services.html" aria-expanded="false">
                                <span>Services</span>
                                ${icon('chevron-down')}
                            </a>

                            <div class="services-dropdown" aria-label="HVAC service links">
                                ${serviceLinksMarkup('services-dropdown__link', true)}
                            </div>
                        </div>

                        <a class="site-nav__link" href="contact.html">Contact</a>
                    </nav>

                    <div class="header-actions">
                        <a class="header-icon-btn" href="tel:${safeText(config.contact?.phoneRaw)}" aria-label="Call ${safeText(config.brand?.name)}">
                            ${icon('phone')}
                        </a>

                        <a class="header-icon-btn header-icon-btn--email" href="mailto:${safeText(config.contact?.email)}" aria-label="Email ${safeText(config.brand?.name)}">
                            ${icon('mail')}
                        </a>

                        <button class="menu-toggle" type="button" aria-label="Open mobile menu" aria-expanded="false" aria-controls="mobile-menu">
                            ${icon('menu')}
                        </button>
                    </div>
                </div>
            </header>

            <aside class="mobile-menu" id="mobile-menu" aria-hidden="true">
                <div class="mobile-menu__panel">
                    <nav class="mobile-menu__top" aria-label="Mobile navigation">
                        <a class="mobile-menu__link" href="index.html">
                            <span>Home</span>
                            ${icon('arrow-up-right')}
                        </a>

                        <a class="mobile-menu__link" href="about.html">
                            <span>About</span>
                            ${icon('arrow-up-right')}
                        </a>

                        <a class="mobile-menu__link" href="all-services.html">
                            <span>Services</span>
                            ${icon('arrow-up-right')}
                        </a>

                        <a class="mobile-menu__link" href="contact.html">
                            <span>Contact</span>
                            ${icon('arrow-up-right')}
                        </a>
                    </nav>

                    <div class="mobile-menu__services">
                        <p class="mobile-menu__label">HVAC service paths</p>
                        <div class="mobile-menu__service-grid">
                            ${(Array.isArray(config.services) ? config.services : []).map((service) => `
                                <a class="mobile-menu__service" href="${safeUrl(service.file)}">
                                    ${icon(service.icon || 'circle')}
                                    <span>${safeText(service.shortTitle || service.title)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>

                    <div class="mobile-menu__contact">
                        <a href="tel:${safeText(config.contact?.phoneRaw)}">
                            ${icon('phone')}
                            <span data-config="contact.phoneDisplay">${safeText(config.contact?.phoneDisplay)}</span>
                        </a>

                        <a href="mailto:${safeText(config.contact?.email)}">
                            ${icon('mail')}
                            <span data-config="contact.email">${safeText(config.contact?.email)}</span>
                        </a>

                        <span>
                            ${icon('map-pin')}
                            <span data-config="company.address">${safeText(config.company?.address)}</span>
                        </span>
                    </div>
                </div>
            </aside>
        `;

        document.body.insertAdjacentHTML('afterbegin', headerMarkup);
    }

    function buildFooter() {
        if (document.querySelector('.site-footer')) return;

        const footerMarkup = `
            <footer class="site-footer">
                <div class="container-wide">
                    <div class="site-footer__top">
                        <div class="footer-brand">
                            <a class="footer-brand__link" href="index.html" aria-label="${safeText(config.brand?.name)} home">
                                <img class="footer-brand__logo" src="${safeUrl(config.brand?.logo)}" alt="${safeText(config.brand?.logoAlt)}" width="74" height="74">
                                <span>
                                    <span class="footer-brand__name" data-config="brand.name">${safeText(config.brand?.name)}</span>
                                    <span class="footer-brand__tagline" data-config="brand.tagline">${safeText(config.brand?.tagline)}</span>
                                </span>
                            </a>

                            <p class="footer-brand__description" data-config="footer.description">
                                ${safeText(config.footer?.description)}
                            </p>

                            <p class="footer-disclaimer" data-config="legal.disclaimer">
                                ${safeText(config.legal?.disclaimer)}
                            </p>
                        </div>

                        <div class="footer-grid">
                            <div class="footer-column">
                                <h3>Navigate</h3>
                                <div class="footer-links">
                                    <a href="index.html">${icon('arrow-up-right')} Home</a>
                                    <a href="about.html">${icon('arrow-up-right')} About</a>
                                    <a href="all-services.html">${icon('arrow-up-right')} Services</a>
                                    <a href="contact.html">${icon('arrow-up-right')} Contact</a>
                                </div>
                            </div>

                            <div class="footer-column">
                                <h3>Service paths</h3>
                                <div class="footer-links">
                                    ${(Array.isArray(config.services) ? config.services : []).map((service) => `
                                        <a href="${safeUrl(service.file)}">
                                            ${icon(service.icon || 'circle-arrow-right')}
                                            <span>${safeText(service.shortTitle || service.title)}</span>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="footer-column">
                                <h3>Contact & legal</h3>
                                <div class="footer-links">
                                    <a href="tel:${safeText(config.contact?.phoneRaw)}">
                                        ${icon('phone')}
                                        <span data-config="contact.phoneDisplay">${safeText(config.contact?.phoneDisplay)}</span>
                                    </a>

                                    <a href="mailto:${safeText(config.contact?.email)}">
                                        ${icon('mail')}
                                        <span data-config="contact.email">${safeText(config.contact?.email)}</span>
                                    </a>

                                    <span>
                                        ${icon('map-pin')}
                                        <span data-config="company.address">${safeText(config.company?.address)}</span>
                                    </span>

                                    <span>
                                        ${icon('badge-check')}
                                        <span data-config="company.companyId">${safeText(config.company?.companyId)}</span>
                                    </span>

                                    <a href="privacy-policy.html">${icon('shield')} Privacy Policy</a>
                                    <a href="terms-of-service.html">${icon('file-text')} Terms of Service</a>
                                    <a href="cookie-policy.html">${icon('cookie')} Cookie Policy</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="site-footer__bottom">
                        <p data-config="footer.copyright">${safeText(config.footer?.copyright)}</p>

                        <div class="site-footer__bottom-links">
                            <a href="privacy-policy.html">Privacy</a>
                            <a href="terms-of-service.html">Terms</a>
                            <a href="cookie-policy.html">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        document.body.insertAdjacentHTML('beforeend', footerMarkup);
    }

    function buildCookieBanner() {
        if (document.querySelector(SELECTORS.cookieBanner)) return;

        const bannerMarkup = `
            <div class="cookie-banner" data-cookie-banner role="dialog" aria-live="polite" aria-label="Cookie consent">
                <div class="cookie-banner__inner">
                    <p>
                        ${safeText(config.cookie?.message)}
                        <a href="privacy-policy.html">Privacy Policy</a>,
                        <a href="cookie-policy.html">Cookie Policy</a>,
                        and <a href="terms-of-service.html">Terms</a>.
                    </p>

                    <div class="cookie-banner__actions">
                        <button class="btn btn--primary" type="button" data-cookie-accept>
                            ${safeText(config.cookie?.acceptLabel || 'Accept')}
                        </button>

                        <button class="btn btn--ghost-light" type="button" data-cookie-decline>
                            ${safeText(config.cookie?.declineLabel || 'Decline')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerMarkup);
    }

    function buildSharedFinalCta() {
        const main = document.querySelector('main');
        const footer = document.querySelector('.site-footer');

        if (!main || document.querySelector('.shared-final-cta')) return;

        const cta = config.sharedCta || {};

        const ctaMarkup = `
            <section class="shared-final-cta" aria-labelledby="shared-final-cta-title">
                <div class="container-wide">
                    <div class="shared-final-cta__card shine-surface">
                        <div class="shared-final-cta__bg" aria-hidden="true">
                            <img src="${safeUrl(cta.image || 'assets/images/cta-hvac.jpg')}" alt="" loading="lazy" width="1380" height="520">
                        </div>

                        <div class="shared-final-cta__content">
                            <p class="section-kicker section-kicker--light">Independent provider matching</p>
                            <h2 id="shared-final-cta-title">${safeText(cta.title || 'Compare HVAC Provider Options')}</h2>
                            <p>${safeText(cta.text || '')}</p>
                        </div>

                        <div class="shared-final-cta__actions">
                            <a class="btn btn--primary" href="${safeUrl(cta.primaryButton?.url || 'contact.html')}">
                                ${safeText(cta.primaryButton?.label || 'Start a Request')}
                                ${icon('arrow-up-right')}
                            </a>

                            <a class="btn btn--ghost-light" href="${safeUrl(cta.secondaryButton?.url || 'all-services.html')}">
                                ${safeText(cta.secondaryButton?.label || 'View Services')}
                                ${icon('layout-grid')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;

        if (footer) {
            footer.insertAdjacentHTML('beforebegin', ctaMarkup);
        } else {
            main.insertAdjacentHTML('afterend', ctaMarkup);
        }
    }

    function buildSharedHeroCards() {
        document.querySelectorAll('[data-hero-cards]').forEach((target) => {
            if (target.dataset.rendered === 'true') return;

            const cards = Array.isArray(config.sharedHeroCards) ? config.sharedHeroCards : [];

            target.innerHTML = cards.map((card) => {
                const tag = card.isAction ? 'a' : 'article';
                const href = card.isAction ? ` href="${safeUrl(card.url)}"` : '';
                const actionClass = card.isAction ? ' hero-card--action' : '';

                return `
                    <${tag} class="hero-card${actionClass}"${href}>
                        <div class="hero-card__icon">
                            ${icon(card.icon || 'circle')}
                        </div>

                        <div class="hero-card__content">
                            <h3 class="hero-card__title">${safeText(card.title)}</h3>
                            <p class="hero-card__text">${safeText(card.text)}</p>
                        </div>
                    </${tag}>
                `;
            }).join('');

            target.dataset.rendered = 'true';
        });
    }

    function injectConfigValues() {
        document.querySelectorAll('[data-config]').forEach((element) => {
            const value = getValue(element.dataset.config, element.textContent);
            element.textContent = value;
        });

        document.querySelectorAll('[data-config-href]').forEach((element) => {
            const type = element.dataset.configHref;
            const value = getValue(element.dataset.configValue || '', '');

            if (type === 'phone') {
                element.setAttribute('href', `tel:${value}`);
            }

            if (type === 'email') {
                element.setAttribute('href', `mailto:${value}`);
            }

            if (type === 'map') {
                element.setAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`);
                element.setAttribute('target', '_blank');
                element.setAttribute('rel', 'noopener');
            }
        });

        document.querySelectorAll('[data-phone-link]').forEach((element) => {
            element.setAttribute('href', `tel:${config.contact?.phoneRaw || ''}`);
        });

        document.querySelectorAll('[data-email-link]').forEach((element) => {
            element.setAttribute('href', `mailto:${config.contact?.email || ''}`);
        });
    }

    function updateHeaderState() {
        const header = document.querySelector(SELECTORS.header);
        if (!header) return;

        header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    function setActiveNavigation() {
        const current = getCurrentPageName();

        document.querySelectorAll('.site-nav__link, .mobile-menu__link').forEach((link) => {
            const href = link.getAttribute('href') || '';
            const target = href.split('/').pop();

            link.classList.toggle('is-active', target === current || (current === '' && target === 'index.html'));
        });
    }

    function setupDropdown() {
        const trigger = document.querySelector(SELECTORS.dropdownTrigger);
        const dropdown = document.querySelector('.services-dropdown');

        if (!trigger || !dropdown) return;

        function openDropdown() {
            window.clearTimeout(state.dropdownTimer);
            dropdown.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
            state.dropdownTimer = window.setTimeout(() => {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }, 260);
        }

        trigger.addEventListener('mouseenter', openDropdown);
        dropdown.addEventListener('mouseenter', openDropdown);
        trigger.addEventListener('mouseleave', closeDropdown);
        dropdown.addEventListener('mouseleave', closeDropdown);

        trigger.addEventListener('focus', openDropdown);
        dropdown.addEventListener('focusin', openDropdown);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                dropdown.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function setMobileMenu(open) {
        const header = document.querySelector(SELECTORS.header);
        const menu = document.querySelector(SELECTORS.mobileMenu);
        const toggle = document.querySelector(SELECTORS.menuToggle);

        if (!menu || !toggle) return;

        state.mobileMenuOpen = open;

        document.body.classList.toggle('menu-open', open);
        menu.classList.toggle('is-open', open);
        header?.classList.toggle('is-menu-open', open);

        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close mobile menu' : 'Open mobile menu');

        const iconElement = toggle.querySelector('[data-lucide]');
        if (iconElement) {
            iconElement.setAttribute('data-lucide', open ? 'x' : 'menu');
            refreshIcons();
        }
    }

    function setupMobileMenu() {
        const toggle = document.querySelector(SELECTORS.menuToggle);
        const menu = document.querySelector(SELECTORS.mobileMenu);

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            setMobileMenu(!state.mobileMenuOpen);
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setMobileMenu(false));
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setMobileMenu(false);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1180 && state.mobileMenuOpen) {
                setMobileMenu(false);
            }
        });
    }

    function setupCookieBanner() {
        const banner = document.querySelector('[data-cookie-banner]');
        const acceptButton = document.querySelector('[data-cookie-accept]');
        const declineButton = document.querySelector('[data-cookie-decline]');
        const storageKey = config.cookie?.storageKey || 'aervantaCookieChoice';

        if (!banner || !acceptButton || !declineButton) return;

        const savedChoice = localStorage.getItem(storageKey);

        if (!savedChoice) {
            window.setTimeout(() => {
                banner.classList.add('is-visible');
            }, 650);
        }

        function saveChoice(choice) {
            localStorage.setItem(storageKey, choice);
            banner.classList.remove('is-visible');
        }

        acceptButton.addEventListener('click', () => saveChoice('accepted'));
        declineButton.addEventListener('click', () => saveChoice('declined'));
    }

    function setupAccordions(root = document) {
        root.querySelectorAll(SELECTORS.accordion).forEach((accordion) => {
            const triggers = accordion.querySelectorAll('[data-accordion-trigger]');

            triggers.forEach((trigger) => {
                const panelId = trigger.getAttribute('aria-controls');
                const panel = panelId ? document.getElementById(panelId) : null;

                if (!panel) return;

                trigger.addEventListener('click', () => {
                    const allowMultiple = accordion.dataset.accordion === 'multiple';
                    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

                    if (!allowMultiple) {
                        triggers.forEach((otherTrigger) => {
                            const otherPanelId = otherTrigger.getAttribute('aria-controls');
                            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;

                            otherTrigger.setAttribute('aria-expanded', 'false');
                            otherPanel?.classList.remove('is-open');
                        });
                    }

                    trigger.setAttribute('aria-expanded', String(!isOpen));
                    panel.classList.toggle('is-open', !isOpen);
                });
            });
        });
    }

    function setupCounters(root = document) {
        const counters = Array.from(root.querySelectorAll(SELECTORS.counter));

        if (!counters.length) return;

        const animateCounter = (element) => {
            if (element.dataset.counted === 'true') return;

            const target = Number(element.dataset.counter || '0');
            const suffix = element.dataset.counterSuffix || '';
            const duration = Number(element.dataset.counterDuration || '1200');
            const start = performance.now();

            element.dataset.counted = 'true';

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * eased);

                element.textContent = `${value}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
        };

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35
        });

        counters.forEach((counter) => observer.observe(counter));
    }

    function setupSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const id = link.getAttribute('href');

                if (!id || id === '#') return;

                const target = document.querySelector(id);

                if (!target) return;

                event.preventDefault();

                const offset = 118;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            });
        });
    }

    function renderSectionNavFromData() {
        document.querySelectorAll('[data-section-nav]').forEach((nav) => {
            if (nav.dataset.rendered === 'true') return;

            let links = [];

            try {
                links = JSON.parse(nav.dataset.sectionNav || '[]');
            } catch (error) {
                links = [];
            }

            if (!links.length) return;

            nav.innerHTML = `
                <div class="container-wide section-nav-strip__inner no-scrollbar">
                    ${links.map((item) => `
                        <a class="section-nav-strip__link" href="${safeUrl(item.href)}">
                            ${icon(item.icon || 'circle')}
                            <span>${safeText(item.label)}</span>
                        </a>
                    `).join('')}
                </div>
            `;

            nav.dataset.rendered = 'true';
        });
    }

    function renderDarkServiceIconStrips() {
        document.querySelectorAll('[data-service-icon-strip]').forEach((strip) => {
            if (strip.dataset.rendered === 'true') return;

            strip.innerHTML = `
                <div class="container-wide">
                    <nav class="dark-icon-strip__grid" aria-label="Service page navigation">
                        ${(Array.isArray(config.services) ? config.services : []).map((service) => `
                            <a class="dark-icon-strip__link" href="${safeUrl(service.file)}" aria-label="${safeText(service.title)}">
                                ${icon(service.icon || 'circle')}
                            </a>
                        `).join('')}
                    </nav>
                </div>
            `;

            strip.dataset.rendered = 'true';
        });
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({
                attrs: {
                    'stroke-width': 1.8
                }
            });
        }
    }

    function initAos() {
        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 720,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                mirror: false
            });

            window.setTimeout(() => {
                if (typeof window.AOS.refreshHard === 'function') {
                    window.AOS.refreshHard();
                }
            }, 450);
        }
    }

    function exposeHelpers() {
        window.Aervanta = {
            config,
            getValue,
            safeText,
            safeUrl,
            icon,
            refreshIcons,
            setupAccordions,
            setupCounters,
            renderDarkServiceIconStrips,
            renderSectionNavFromData
        };
    }

    function init() {
        buildHeader();
        buildFooter();
        buildSharedFinalCta();
        buildCookieBanner();

        injectConfigValues();
        buildSharedHeroCards();
        renderSectionNavFromData();
        renderDarkServiceIconStrips();

        updateHeaderState();
        setActiveNavigation();

        setupDropdown();
        setupMobileMenu();
        setupCookieBanner();
        setupAccordions();
        setupCounters();
        setupSmoothAnchors();

        refreshIcons();
        initAos();
        exposeHelpers();

        window.addEventListener('scroll', updateHeaderState, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
