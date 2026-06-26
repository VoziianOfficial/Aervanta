'use strict';

(function () {
    function refreshIcons() {
        if (window.Aervanta && typeof window.Aervanta.refreshIcons === 'function') {
            window.Aervanta.refreshIcons();
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function getConfig() {
        return window.AERVANTA_CONFIG || {};
    }

    function setError(form, name, message) {
        const error = form.querySelector(`[data-error-for="${name}"]`);

        if (error) {
            error.textContent = message || '';
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('[data-error-for]').forEach((error) => {
            error.textContent = '';
        });
    }

    function setStatus(form, type, message) {
        const status = form.querySelector('[data-form-status]');

        if (!status) return;

        status.textContent = message;
        status.className = 'form-status is-visible';

        if (type === 'success') {
            status.classList.add('is-success');
        }

        if (type === 'error') {
            status.classList.add('is-error');
        }
    }

    function clearStatus(form) {
        const status = form.querySelector('[data-form-status]');

        if (!status) return;

        status.textContent = '';
        status.className = 'form-status';
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateForm(form) {
        const formData = new FormData(form);

        const fullName = String(formData.get('fullName') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const service = String(formData.get('service') || '').trim();
        const message = String(formData.get('message') || '').trim();
        const privacyConsent = formData.get('privacyConsent');

        let isValid = true;

        clearErrors(form);

        if (fullName.length < 2) {
            setError(form, 'fullName', 'Please enter your full name.');
            isValid = false;
        }

        if (!isValidEmail(email)) {
            setError(form, 'email', 'Please enter a valid email address.');
            isValid = false;
        }

        if (phone.length < 6) {
            setError(form, 'phone', 'Please enter a valid phone number.');
            isValid = false;
        }

        if (!service) {
            setError(form, 'service', 'Please select a service category.');
            isValid = false;
        }

        if (message.length < 10) {
            setError(form, 'message', 'Please add a short request description.');
            isValid = false;
        }

        if (privacyConsent !== 'yes') {
            setError(form, 'privacyConsent', 'Please confirm the request and privacy consent.');
            isValid = false;
        }

        return isValid;
    }

    function populateServiceSelect() {
        const config = getConfig();
        const select = document.querySelector('select[name="service"]');

        if (!select || !Array.isArray(config.services)) return;

        const currentValue = select.value;

        select.innerHTML = `
            <option value="">Select a service path</option>
            ${config.services.map((service) => `
                <option value="${service.title}">${service.title}</option>
            `).join('')}
            <option value="Not sure yet">Not sure yet</option>
        `;

        select.value = currentValue;
    }

    function initFormStartTime() {
        const startedAt = document.querySelector('[data-form-started-at]');

        if (!startedAt) return;

        startedAt.value = String(Date.now());
    }

    function initContactForm() {
        const config = getConfig();
        const form = document.querySelector('[data-contact-form]');

        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            clearStatus(form);

            if (!validateForm(form)) {
                setStatus(form, 'error', config.form?.errorMessage || 'Please check the required fields and try again.');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.innerHTML : '';

            form.classList.add('is-sending');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    Sending
                    <i data-lucide="loader-circle" aria-hidden="true"></i>
                `;
                refreshIcons();
            }

            try {
                const response = await fetch(form.action || 'contact.php', {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json().catch(() => ({
                    success: false,
                    message: config.form?.errorMessage || 'Please check the required fields and try again.'
                }));

                if (!response.ok || !result.success) {
                    throw new Error(result.message || config.form?.errorMessage || 'Please check the required fields and try again.');
                }

                setStatus(form, 'success', result.message || config.form?.successMessage || 'Thank you. Your request has been received.');
                form.reset();
                initFormStartTime();
            } catch (error) {
                setStatus(form, 'error', error.message || config.form?.errorMessage || 'Please check the required fields and try again.');
            } finally {
                form.classList.remove('is-sending');

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    refreshIcons();
                }
            }
        });

        form.addEventListener('input', (event) => {
            const target = event.target;

            if (!target || !target.name) return;

            setError(form, target.name, '');
            clearStatus(form);
        });

        form.addEventListener('change', (event) => {
            const target = event.target;

            if (!target || !target.name) return;

            setError(form, target.name, '');
        });
    }

    function initContact() {
        populateServiceSelect();
        initFormStartTime();
        initContactForm();
        refreshIcons();

        if (window.Aervanta && typeof window.Aervanta.setupCounters === 'function') {
            window.Aervanta.setupCounters(document);
        }
    }

    document.addEventListener('DOMContentLoaded', initContact);
})();
