'use strict';

window.AERVANTA_CONFIG = {
    brand: {
        name: 'Aervanta',
        tagline: 'Independent HVAC Provider Matching',
        logo: 'assets/images/logo.svg',
        logoAlt: 'Aervanta premium HVAC fan icon'
    },

    company: {
        name: 'Aervanta',
        legalName: 'Aervanta',
        companyId: 'AER-HVAC-2048',
        address: 'USA Service Area',
        serviceArea: 'Independent HVAC provider.',
    },

    contact: {
        phoneRaw: '+18885550148',
        phoneDisplay: '(888) 555-0148',
        email: 'hello@aervanta.com',
        supportHours: 'Mon–Fri, 8:00 AM–7:00 PM',
        phoneButtonText: 'Start Request'
    },

    form: {
        endpoint: 'contact.php',
        recipientLabel: 'Aervanta request desk',
        successMessage: 'Thank you. Your request has been received.',
        errorMessage: 'Please check the required fields and try again.',
        disclaimer: 'Submitting this form does not create a service agreement. You may be contacted by participating independent providers.'
    },

    footer: {
        description: 'Aervanta helps homeowners organize HVAC-related requests and compare available local provider options before deciding how to continue.',
        copyright: '© 2026 Aervanta. All rights reserved.'
    },

    legal: {
        privacyUrl: 'privacy-policy.html',
        termsUrl: 'terms-of-service.html',
        cookieUrl: 'cookie-policy.html',
        disclaimer: 'Disclaimer: This site is a free service to assist homeowners in connecting with local service providers. All contractors/providers are independent and this site does not warrant or guarantee any work performed. It is the responsibility of the homeowner to verify that the hired contractor furnishes the necessary license and insurance required for the work being performed. All persons depicted in a photo or video are actors or models and not contractors listed on this site.'
    },

    pages: {
        home: {
            file: 'index.html',
            label: 'Home',
            hero: {
                eyebrow: 'Independent HVAC provider-matching platform',
                title: 'Comfort Match',
                text: 'Submit HVAC project details and compare available local provider options for heating, cooling, ventilation, maintenance, and comfort-related requests.',
                image: 'assets/images/hero-home.jpg'
            }
        },
        about: {
            file: 'about.html',
            label: 'About',
            hero: {
                eyebrow: 'A clearer way to compare HVAC provider options',
                title: 'About Aervanta',
                text: 'Aervanta helps organize HVAC requests so homeowners can review provider options without confusing direct-service claims.',
                image: 'assets/images/hero-about.jpg'
            }
        },
        services: {
            file: 'all-services.html',
            label: 'Services',
            hero: {
                eyebrow: 'Explore HVAC request paths',
                title: 'Service Paths',
                text: 'Review heating, cooling, maintenance, ventilation, and system replacement categories before submitting your request.',
                image: 'assets/images/hero-services.jpg'
            }
        },
        contact: {
            file: 'contact.html',
            label: 'Contact',
            hero: {
                eyebrow: 'Start with your project details',
                title: 'Request Access',
                text: 'Share your HVAC request details and choose whether to continue with participating independent providers.',
                image: 'assets/images/hero-contact.jpg'
            }
        }
    },

    services: [
        {
            title: 'HVAC Installation & Replacement',
            shortTitle: 'Installation',
            file: 'hvac-installation-replacement.html',
            icon: 'air-vent',
            image: 'assets/images/service-1.jpg',
            heroImage: 'assets/images/hero-hvac-installation.jpg',
            heroTitle: 'System Upgrade',
            description: 'Compare local provider options for HVAC installation, system replacement, and comfort upgrades.',
            focus: 'New HVAC system requests, replacement of aging equipment, comfort upgrades, and provider comparison.'
        },
        {
            title: 'Air Conditioning Services',
            shortTitle: 'Cooling',
            file: 'air-conditioning-services.html',
            icon: 'snowflake',
            image: 'assets/images/service-2.jpg',
            heroImage: 'assets/images/hero-air-conditioning.jpg',
            heroTitle: 'Cooling Options',
            description: 'Find provider options for AC-related requests, cooling concerns, and air conditioning service needs.',
            focus: 'Cooling issues, AC service requests, warm air from vents, uneven cooling, and AC-related provider options.'
        },
        {
            title: 'Heating & Furnace Services',
            shortTitle: 'Heating',
            file: 'heating-furnace-services.html',
            icon: 'flame',
            image: 'assets/images/service-3.jpg',
            heroImage: 'assets/images/hero-heating.jpg',
            heroTitle: 'Heating Match',
            description: 'Compare available providers for heating systems, furnace service requests, and home warmth concerns.',
            focus: 'Heating service requests, furnace concerns, cold rooms, uneven heating, and winter readiness.'
        },
        {
            title: 'Heat Pump Services',
            shortTitle: 'Heat Pumps',
            file: 'heat-pump-services.html',
            icon: 'refresh-cw',
            image: 'assets/images/service-4.jpg',
            heroImage: 'assets/images/hero-heat-pump.jpg',
            heroTitle: 'Heat Pumps',
            description: 'Connect with provider options for heat pump installation, replacement, or service-related projects.',
            focus: 'Heat pump installation, replacement, service requests, and heating or cooling system options.'
        },
        {
            title: 'HVAC Maintenance & Tune-Ups',
            shortTitle: 'Maintenance',
            file: 'hvac-maintenance-tune-ups.html',
            icon: 'settings',
            image: 'assets/images/service-5.jpg',
            heroImage: 'assets/images/hero-maintenance.jpg',
            heroTitle: 'System Care',
            description: 'Submit a maintenance request and review local HVAC provider options for seasonal tune-ups.',
            focus: 'Seasonal maintenance, tune-up requests, pre-season readiness, and provider availability comparison.'
        },
        {
            title: 'Indoor Air Quality & Ventilation',
            shortTitle: 'Air Quality',
            file: 'indoor-air-quality-ventilation.html',
            icon: 'wind',
            image: 'assets/images/service-6.jpg',
            heroImage: 'assets/images/hero-air-quality.jpg',
            heroTitle: 'Air Quality',
            description: 'Explore provider options for ventilation, airflow, filtration, and indoor air comfort needs.',
            focus: 'Airflow, ventilation, filtration, humidity comfort, and indoor air provider options without medical claims.'
        }
    ],

    sharedHeroCards: [
        {
            title: 'Independent Platform',
            text: 'Explore independent HVAC paths.',
            icon: 'shield-check'
        },
        {
            title: 'Provider Terms',
            text: 'Review pricing and schedule details.',
            icon: 'file-check-2'
        },
        {
            title: 'Start Request',
            text: 'Share your comfort project details.',
            icon: 'send',
            url: 'contact.html',
            isAction: true
        },
        {
            title: 'View Services',
            text: 'Compare heating, cooling, and air.',
            icon: 'layout-grid',
            url: 'all-services.html',
            isAction: true
        }
    ],

    sharedCta: {
        title: 'Compare HVAC Provider Options',
        text: 'Aervanta helps organize your HVAC request so you can compare independent local provider options before deciding how to continue.',
        image: 'assets/images/cta-hvac.jpg',
        primaryButton: {
            label: 'Start a Request',
            url: 'contact.html'
        },
        secondaryButton: {
            label: 'View Services',
            url: 'all-services.html'
        }
    },

    socialProof: {
        requestCategories: 50,
        matchingDetails: 120,
        requestAccess: 24
    },

    cookie: {
        storageKey: 'aervantaCookieChoice',
        message: 'Aervanta uses essential cookies and localStorage to improve site functionality, remember consent choices, and support request form usability.',
        acceptLabel: 'Accept',
        declineLabel: 'Decline'
    }
};
