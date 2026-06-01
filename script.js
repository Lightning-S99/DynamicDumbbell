/* ═══════════════════════════════════════════
   DYNAMIC DUMBBELL — Landing Page Scripts
   Modular, clean, no 3D dependencies
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ══════════════════════════════════════
    // NAVIGATION
    // ══════════════════════════════════════
    const navbar = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (navLinks) navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ══════════════════════════════════════
    // WEIGHT SIMULATOR (Image-Based)
    // ══════════════════════════════════════
    const weightSlider = document.getElementById('weight-slider');
    const weightNumber = document.getElementById('weight-number');
    const sliderFill = document.getElementById('slider-fill');
    const shippingWeight = document.getElementById('shipping-weight');
    const co2Saving = document.getElementById('co2-saving');
    const fillAmount = document.getElementById('fill-amount');
    const fillIcon = document.getElementById('fill-icon');
    const simWeightBig = document.getElementById('sim-weight-big');
    const simProductImg = document.getElementById('sim-product-img');
    const simFillIndicator = document.getElementById('sim-fill-indicator');

    // Fill type colors
    const fillColors = {
        water: { bg: 'rgba(34, 211, 238, 0.3)', indicator: '#22d3ee' },
        sand: { bg: 'rgba(245, 158, 11, 0.3)', indicator: '#f59e0b' },
        stone: { bg: 'rgba(156, 163, 175, 0.3)', indicator: '#9ca3af' }
    };

    // Fill type images (v=3 cache bust for updated images)
    const fillImages = {
        water: 'images/su.png?v=3',
        sand: 'images/kum.png?v=3',
        stone: 'images/tas.png?v=3'
    };

    let currentFillType = 'water';

    function updateWeightUI(val) {
        const weight = parseInt(val);
        if (weightNumber) weightNumber.textContent = weight;
        if (simWeightBig) simWeightBig.textContent = weight;

        const percent = ((weight - 4) / 20) * 100;
        if (sliderFill) sliderFill.style.width = percent + '%';

        // Image stays fixed — no scale effect on weight change

        // Fill indicator in the simulator visual
        if (simFillIndicator) {
            const fillPercent = percent * 0.55;
            const color = fillColors[currentFillType] || fillColors.water;
            simFillIndicator.style.height = fillPercent + '%';
            simFillIndicator.style.background = `linear-gradient(to top, ${color.bg}, transparent)`;
        }

        // Update info cards
        if (shippingWeight) shippingWeight.textContent = '1000 gr';
        if (co2Saving) co2Saving.textContent = `~${(weight * 0.38).toFixed(1)} kg`;

        const activeFill = document.querySelector('.fill-option.active');
        const ft = activeFill ? activeFill.dataset.fill : 'water';
        const base = weight - 0.2;
        // Density: water=1 kg/L, sand=1.6 kg/L, stone=2.5 kg/L
        const vol = ft === 'water' ? base : ft === 'sand' ? base / 1.6 : base / 2.5;
        if (fillAmount) fillAmount.textContent = `~${vol.toFixed(1)} L`;
        if (fillIcon) fillIcon.textContent = ft === 'water' ? '💧' : ft === 'sand' ? '🏜️' : '🪨';
    }

    if (weightSlider) {
        weightSlider.addEventListener('input', (e) => updateWeightUI(e.target.value));
        updateWeightUI(weightSlider.value);
    }

    // Fill type selector
    document.querySelectorAll('.fill-option').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.fill-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFillType = btn.dataset.fill;
            // Switch simulator image based on fill type
            if (simProductImg && fillImages[currentFillType]) {
                simProductImg.src = fillImages[currentFillType];
                simProductImg.alt = currentFillType === 'water' ? 'Su Dolgulu Dumbbell Simülasyonu'
                    : currentFillType === 'sand' ? 'Kum Dolgulu Dambıl Simülasyonu'
                        : 'Taş Dolgulu Dambıl Simülasyonu';
            }
            updateWeightUI(weightSlider ? weightSlider.value : 4);
        });
    });

    // ══════════════════════════════════════
    // PRE-ORDER MODAL (Native <dialog>)
    // ══════════════════════════════════════
    const modal = document.getElementById('preorder-modal');
    const form = document.getElementById('preorder-form');
    const modalSuccess = document.getElementById('modal-success');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalSuccessCloseBtn = document.getElementById('modal-success-close');

    // All buttons that should open the modal
    const preorderTriggers = [
        document.getElementById('cta-preorder-hero'),
        document.getElementById('cta-preorder-bottom'),
        document.getElementById('nav-cta-preorder')
    ];

    function openModal() {
        if (!modal) return;
        // Reset form & success state
        if (form) {
            form.style.display = '';
            form.reset();
            clearFormErrors();
        }
        if (modalSuccess) modalSuccess.hidden = true;
        modal.showModal();
    }

    function closeModal() {
        if (modal) modal.close();
    }

    preorderTriggers.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalSuccessCloseBtn) modalSuccessCloseBtn.addEventListener('click', closeModal);

    // Light-dismiss fallback for browsers without closedby support
    if (modal && !('closedBy' in HTMLDialogElement.prototype)) {
        modal.addEventListener('click', (event) => {
            if (event.target !== modal) return;
            const rect = modal.getBoundingClientRect();
            const isDialogContent = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (isDialogContent) return;
            modal.close();
        });
    }

    // ══════════════════════════════════════
    // FORM VALIDATION
    // ══════════════════════════════════════
    const fields = {
        firstname: {
            el: document.getElementById('preorder-firstname'),
            error: document.getElementById('error-firstname'),
            validate: (val) => {
                if (!val.trim()) return 'İsim alanı zorunludur.';
                if (val.trim().length < 2) return 'İsim en az 2 karakter olmalıdır.';
                return '';
            }
        },
        lastname: {
            el: document.getElementById('preorder-lastname'),
            error: document.getElementById('error-lastname'),
            validate: (val) => {
                if (!val.trim()) return 'Soyisim alanı zorunludur.';
                if (val.trim().length < 2) return 'Soyisim en az 2 karakter olmalıdır.';
                return '';
            }
        },
        email: {
            el: document.getElementById('preorder-email'),
            error: document.getElementById('error-email'),
            validate: (val) => {
                if (!val.trim()) return 'E-posta alanı zorunludur.';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val.trim())) return 'Geçerli bir e-posta adresi giriniz.';
                return '';
            }
        }
    };

    // Real-time validation on blur
    Object.values(fields).forEach(field => {
        if (!field.el) return;
        field.el.addEventListener('blur', () => {
            const msg = field.validate(field.el.value);
            setFieldError(field, msg);
        });
        field.el.addEventListener('input', () => {
            if (field.el.classList.contains('error')) {
                const msg = field.validate(field.el.value);
                setFieldError(field, msg);
            }
        });
    });

    function setFieldError(field, message) {
        if (message) {
            field.el.classList.add('error');
            field.el.classList.remove('valid');
            if (field.error) {
                field.error.textContent = message;
                field.error.classList.add('visible');
            }
        } else {
            field.el.classList.remove('error');
            if (field.el.value.trim()) field.el.classList.add('valid');
            if (field.error) {
                field.error.textContent = '';
                field.error.classList.remove('visible');
            }
        }
    }

    function clearFormErrors() {
        Object.values(fields).forEach(field => {
            if (field.el) {
                field.el.classList.remove('error', 'valid');
            }
            if (field.error) {
                field.error.textContent = '';
                field.error.classList.remove('visible');
            }
        });
    }

    function validateAllFields() {
        let isValid = true;
        Object.values(fields).forEach(field => {
            if (!field.el) return;
            const msg = field.validate(field.el.value);
            setFieldError(field, msg);
            if (msg) isValid = false;
        });
        return isValid;
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateAllFields()) {
                // Focus first error field
                const firstError = form.querySelector('.form-input.error');
                if (firstError) firstError.focus();
                return;
            }

            const formData = {
                firstName: fields.firstname.el.value.trim(),
                lastName: fields.lastname.el.value.trim(),
                email: fields.email.el.value.trim()
            };

            // ── Backend'e ön sipariş verisi gönder ──
            const submitBtn = document.getElementById('preorder-submit');
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

            // Butonu loading durumuna al
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-text">Gönderiliyor...</span><span class="btn-spinner"></span>';
            }

            // Gönderilecek URL'yi göreceli hale getiriyoruz (Hem lokal hem sunucu için çalışır)
            fetch('/api/preorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showSuccess();
                        showToast('Ön siparişiniz alındı! 🎉', 'success');
                    } else {
                        showToast(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                        // Butonu geri getir
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnHTML;
                        }
                    }
                })
                .catch(error => {
                    console.error('[DD] Ön sipariş hatası:', error);
                    showToast('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.', 'error');
                    // Butonu geri getir
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHTML;
                    }
                });
        });
    }

    function showSuccess() {
        if (form) form.style.display = 'none';
        if (modalSuccess) modalSuccess.hidden = false;
    }

    // ══════════════════════════════════════
    // TOAST NOTIFICATION SYSTEM
    // ══════════════════════════════════════
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'info', duration = 5000) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';

        const iconSVGs = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `
            <div class="toast-icon ${type}">${iconSVGs[type] || iconSVGs.info}</div>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }

    // ══════════════════════════════════════
    // NEWSLETTER FORM
    // ══════════════════════════════════════
    const nForm = document.getElementById('newsletter-form');
    if (nForm) {
        nForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('newsletter-btn');
            const inp = document.getElementById('newsletter-email');

            if (!inp.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
                showToast('Lütfen geçerli bir e-posta adresi giriniz.', 'error');
                return;
            }

            btn.innerHTML = '<span>✓ Kaydedildi!</span>';
            btn.style.background = '#22c55e';
            inp.value = '';
            showToast('Bültenimize başarıyla abone oldunuz! 📬', 'success');

            setTimeout(() => {
                btn.innerHTML = '<span>Abone Ol</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                btn.style.background = '';
            }, 3000);
        });
    }

    // ══════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ══════════════════════════════════════
    function initRevealAnimations() {
        const revealConfig = [
            ['hero-badge', 0], ['hero-title', 100], ['hero-slogan', 200],
            ['hero-desc', 300], ['hero-ctas', 400], ['hero-stats', 500],
            ['hero-image-wrap', 300],
            ['detail-header', 0], ['product-detail-image', 100], ['product-detail-info', 200],
            ['sim-header', 0],
            ['feat-header', 0],
            ['how-header', 0],
            ['cta-content', 0],
            ['feature-card-1', 0], ['feature-card-2', 150], ['feature-card-3', 300]
        ];

        revealConfig.forEach(([id, delay]) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.add('reveal');
            el.style.transitionDelay = delay + 'ms';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // How-it-works steps
        const howElements = [
            ...document.querySelectorAll('.how-step'),
            ...document.querySelectorAll('.how-connector')
        ];
        howElements.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = (i * 120) + 'ms';
            observer.observe(el);
        });

        // Spec cards
        document.querySelectorAll('.detail-spec-card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = (i * 100) + 'ms';
            observer.observe(el);
        });
    }

    // ══════════════════════════════════════
    // COUNTER ANIMATION FOR HERO STATS
    // ══════════════════════════════════════
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    let current = 0;
                    const step = Math.max(1, Math.floor(target / 30));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        entry.target.textContent = current;
                    }, 40);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    }

    // ══════════════════════════════════════
    // PARALLAX-LITE (subtle movement on hero)
    // ══════════════════════════════════════
    function initParallaxLite() {
        const heroImg = document.querySelector('.hero-image-frame');
        const heroBgGlow = document.querySelector('.hero-bg-glow');

        if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 12;
                const y = (e.clientY / window.innerHeight - 0.5) * 12;
                heroImg.style.transform = `translate(${x}px, ${y}px)`;
                if (heroBgGlow) {
                    heroBgGlow.style.transform = `translate(${-x * 2}px, ${-y * 2}px)`;
                }
                ticking = false;
            });
        });
    }

    // ══════════════════════════════════════
    // INITIALIZE
    // ══════════════════════════════════════
    function init() {
        initRevealAnimations();
        animateCounters();
        initParallaxLite();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
