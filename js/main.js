

        lucide.createIcons();
        document.addEventListener('touchmove', function (event) {
            if (event.scale !== 1 || event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
        document.addEventListener('wheel', function(event) {
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
            }
        }, { passive: false });
        document.addEventListener('keydown', function(event) {
            if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=')) {
                event.preventDefault();
            }
        });
        let isTransitioning = false;
        function runScreenTransition(onCompleteCallback) {
            if (isTransitioning) return;
            isTransitioning = true;
            
            const preloader = document.getElementById('language-preloader');
            const progress = document.getElementById('language-progress');
            if (preloader && progress) {
                preloader.classList.remove('pointer-events-none');
                preloader.style.opacity = '1';
                
                progress.style.transition = 'none';
                progress.style.width = '0%';
                void progress.offsetWidth; 
                
                setTimeout(() => {
                    progress.style.transition = 'width 2.2s ease-in-out';
                    progress.style.width = '100%';
                }, 50);
                setTimeout(() => {
                    if (typeof onCompleteCallback === 'function') onCompleteCallback();
                    preloader.style.opacity = '0';
                    preloader.classList.add('pointer-events-none');
                    setTimeout(() => { isTransitioning = false; }, 500);
                }, 2500);
            } else {
                if (typeof onCompleteCallback === 'function') onCompleteCallback();
                isTransitioning = false;
            }
        }

        function toggleLanguage() {
            runScreenTransition(() => {
                currentLang = currentLang === 'ar' ? 'en' : 'ar';
                document.documentElement.lang = currentLang;
                document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
                document.title = currentLang === 'ar' ? 'اكيتو | akitu' : 'akitu | اكيتو';
                updateWizardVisuals();
            });
        }
        document.body.addEventListener('click', function(e) {
            const clickable = e.target.closest('button, a, .magnetic-btn, .touch-active');
            if (clickable) {
                if (clickable.classList.contains('spam-cooldown')) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
                clickable.classList.add('spam-cooldown');
                clickable.style.pointerEvents = 'none';
                setTimeout(() => {
                    clickable.classList.remove('spam-cooldown');
                    clickable.style.pointerEvents = '';
                }, 1000); 
            }
        }, { capture: true });
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        const canvas = document.getElementById('ambient-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            const maxParticles = 30; 
            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            class Particle {
                constructor() {
                    this.reset(true);
                }
                reset(initial = false) {
                    this.x = Math.random() * canvas.width;
                    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
                    this.size = Math.random() * 2 + 0.5; 
                    this.speedY = Math.random() * 0.8 + 0.2; 
                    this.opacity = (Math.random() * 0.4 + 0.1) * 0.5; 
                    this.angle = Math.random() * Math.PI * 2; 
                    this.driftSpeed = Math.random() * 0.02 + 0.01; 
                    this.driftAmplitude = Math.random() * 0.5 + 0.2; 
                }
                update() {
                    this.y -= this.speedY;
                    this.angle += this.driftSpeed;
                    this.x += Math.sin(this.angle) * this.driftAmplitude;
                    if (this.y < -10) {
                        this.reset();
                    }
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(168, 123, 63, ${this.opacity})`;
                    ctx.fill();
                }
            }
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }
        let currentLang = 'ar';
        function toggleLanguage() {
            const preloader = document.getElementById('language-preloader');
            const progress = document.getElementById('language-progress');
            if (preloader && progress) {
                preloader.classList.remove('pointer-events-none');
                preloader.style.opacity = '1';
                progress.style.transition = 'none';
                progress.style.width = '0%';
                setTimeout(() => {
                    progress.style.transition = 'width 2.8s ease-in-out';
                    progress.style.width = '100%';
                }, 50);
                setTimeout(() => {
                    currentLang = currentLang === 'ar' ? 'en' : 'ar';
                    document.documentElement.lang = currentLang;
                    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
                    document.title = currentLang === 'ar' ? 'اكيتو | akitu' : 'akitu | اكيتو';
                    updateWizardVisuals();
                    preloader.style.opacity = '0';
                    preloader.classList.add('pointer-events-none');
                }, 3000);
            } else {
                currentLang = currentLang === 'ar' ? 'en' : 'ar';
                document.documentElement.lang = currentLang;
                document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
                document.title = currentLang === 'ar' ? 'اكيتو | akitu' : 'akitu | اكيتو';
                updateWizardVisuals();
            }
        }
        const cursorOuter = document.getElementById('cursorOuter');
        const cursorDot = document.getElementById('cursorDot');
        const cursorText = document.getElementById('cursorText');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile && cursorOuter && cursorDot) {
            let mouseX = 0, mouseY = 0;
            window.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                gsap.to(cursorOuter, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power3.out' });
                gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power3.out' });
                gsap.to(cursorText, { x: mouseX, y: mouseY + 28, duration: 0.35, ease: 'power3.out' });
            });
            function setCursorState(type) {
                switch (type) {
                    case 'button':
                        gsap.to(cursorOuter, { scale: 0.6, borderColor: '#a87b3f', backgroundColor: 'rgba(168,123,63,0.25)', duration: 0.3 });
                        gsap.to(cursorDot, { scale: 0, duration: 0.2 });
                        break;
                    case 'card':
                        gsap.to(cursorOuter, { width: 70, height: 70, borderColor: 'rgba(168,123,63,0.4)', backgroundColor: 'rgba(168,123,63,0.06)', duration: 0.35 });
                        cursorText.textContent = 'Explore';
                        gsap.to(cursorText, { opacity: 1, duration: 0.2 });
                        break;
                    case 'link':
                        gsap.to(cursorOuter, { scale: 1.5, borderColor: '#a87b3f', backgroundColor: 'rgba(168,123,63,0.08)', duration: 0.25 });
                        break;
                    default:
                        gsap.to(cursorOuter, { scale: 1, width: 36, height: 36, borderColor: '#a87b3f', backgroundColor: 'transparent', duration: 0.3 });
                        gsap.to(cursorDot, { scale: 1, duration: 0.2 });
                        gsap.to(cursorText, { opacity: 0, duration: 0.2 });
                }
            }
            document.querySelectorAll('.magnetic-btn').forEach(btn => {
                btn.addEventListener('mousemove', e => {
                    const rect = btn.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const dx = (e.clientX - cx) * 0.25;
                    const dy = (e.clientY - cy) * 0.25;
                    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
                });
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
                });
            });
            document.querySelectorAll('button, [role="button"]').forEach(el => {
                el.addEventListener('mouseenter', () => setCursorState('button'));
                el.addEventListener('mouseleave', () => setCursorState('default'));
            });
            document.querySelectorAll('.service-card, .supplier-item').forEach(el => {
                el.addEventListener('mouseenter', () => setCursorState('card'));
                el.addEventListener('mouseleave', () => setCursorState('default'));
            });
            document.querySelectorAll('a').forEach(el => {
                el.addEventListener('mouseenter', () => setCursorState('link'));
                el.addEventListener('mouseleave', () => setCursorState('default'));
            });
        }
        if (isMobile || 'ontouchstart' in window) {
            document.querySelectorAll('.ripple-container').forEach(el => {
                el.addEventListener('touchstart', function(e) {
                    const ripple = document.createElement('div');
                    ripple.classList.add('ripple-effect');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    ripple.style.width = ripple.style.height = size + 'px';
                    const touch = e.touches[0];
                    ripple.style.left = (touch.clientX - rect.left - size / 2) + 'px';
                    ripple.style.top = (touch.clientY - rect.top - size / 2) + 'px';
                    this.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }, { passive: true });
            });
        }
        if (!isMobile) {
            document.querySelectorAll('[data-tilt]').forEach(card => {
                const shine = card.querySelector('.tilt-shine');
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;
                    gsap.to(card, {
                        rotateX: rotateX,
                        rotateY: rotateY,
                        scale: 1.03,
                        boxShadow: '0 25px 50px -12px rgba(168,123,63,0.15)',
                        borderColor: '#a87b3f',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                    if (shine) {
                        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(168,123,63,0.3) 0%, transparent 60%)`;
                    }
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        rotateX: 0, rotateY: 0, scale: 1,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        borderColor: 'rgba(168,123,63,0.15)',
                        duration: 0.6, ease: 'elastic.out(1, 0.5)'
                    });
                });
            });
        }
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            const title = document.getElementById('preloader-title');
            const subtitle = document.getElementById('preloader-subtitle');
            const key = document.getElementById('preloader-key');
            const loadingBar = document.getElementById('loading-bar');
            const loadingText = document.getElementById('loading-text');
            const glow = document.getElementById('lock-glow');
            setTimeout(() => {
                if(title) title.style.opacity = '1';
                if(subtitle) subtitle.style.opacity = '1';
            }, 300);
            let progress = 0;
            const loadDuration = 4500; 
            const interval = 45; 
            const step = (100 / (loadDuration / interval));
            setTimeout(() => {
                if(key) {
                    key.style.opacity = '1';
                    const isMobilePreloader = window.innerWidth <= 768;
                    const descendValue = isMobilePreloader ? '122px' : '130px'; 
                    key.style.transform = `translateY(${descendValue})`; 
                }
            }, 800);
            const loaderInterval = setInterval(() => {
                progress += step;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(loaderInterval);
                    finishLoading();
                }
                if(loadingBar) loadingBar.style.width = `${progress}%`;
                if(loadingText) loadingText.innerText = `${Math.floor(progress)}%`;
            }, interval);
            function finishLoading() {
                if(key) {
                    key.style.transition = 'transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    const isMobilePreloader = window.innerWidth <= 768;
                    const descendValue = isMobilePreloader ? '122px' : '130px';
                    key.style.transform = `translateY(${descendValue}) rotate(90deg)`; 
                }
                setTimeout(() => {
                    if(glow) glow.style.opacity = '1';
                }, 400);
                setTimeout(() => {
                    if(preloader) {
                        preloader.style.opacity = '0';
                        preloader.style.pointerEvents = 'none';
                    }
                    gsap.from('.reveal-up', {
                        y: 50, opacity: 0, duration: 1,
                        stagger: 0.15, delay: 0.1,
                        ease: 'power3.out'
                    });
                    setTimeout(() => {
                        if(preloader) preloader.style.display = 'none';
                    }, 1500); 
                }, 1500); 
            }
        });
        const navContainer = document.getElementById('nav-interactive-container');
        const navCentralTrigger = document.getElementById('nav-central-trigger');
        const navLinkGroups = document.querySelectorAll('.nav-link-group');
        const langSwitcher = document.getElementById('lang-switcher-wrapper');
        let islandExpanded = false;
        let islandTimeout;
        let islandAnimating = false;
        function checkIsMobile() {
            return window.innerWidth <= 768;
        }
        function expandDynamicIsland() {
            if (islandExpanded || islandAnimating) return;
            islandAnimating = true;
            islandExpanded = true;
            clearTimeout(islandTimeout);
            navContainer.classList.add('expanded');
            setTimeout(() => { islandAnimating = false; }, 1000);
            gsap.to(navContainer, {
                width: checkIsMobile() ? '95vw' : '640px',
                duration: 1.2,
                ease: 'elastic.out(1, 0.6)',
                overwrite: 'auto'
            });
            if (checkIsMobile() && langSwitcher) {
                gsap.to(langSwitcher, { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.out', pointerEvents: 'none' });
            }
            gsap.to('#logo-text-main', { letterSpacing: checkIsMobile() ? '0.3em' : '0.4em', color: 'var(--burnt-orange)', duration: 0.8, ease: 'power3.out' });
            navLinkGroups.forEach(group => group.classList.add('is-visible'));
            gsap.fromTo('.nav-link-item', 
                { opacity: 0, scale: 0.9, y: 10, filter: 'blur(4px)' }, 
                { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: { amount: 0.25, from: 'edges' }, ease: 'power3.out', delay: 0.1, overwrite: true }
            );
        }
        window.closeDynamicIsland = function() {
            if (!islandExpanded || islandAnimating) return;
            islandAnimating = true;
            islandExpanded = false;
            setTimeout(() => { islandAnimating = false; }, 1300);
            if (checkIsMobile() && langSwitcher) {
                gsap.to(langSwitcher, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', pointerEvents: 'auto', delay: 1.3 });
            }
            gsap.to('.nav-link-item', { 
                opacity: 0, 
                scale: 0.95, 
                y: -5, 
                filter: 'blur(2px)', 
                duration: 0.4, 
                stagger: { amount: 0.15, from: 'center' }, 
                ease: 'power2.inOut', 
                overwrite: true 
            });
            islandTimeout = setTimeout(() => {
                navLinkGroups.forEach(group => group.classList.remove('is-visible'));
                navContainer.classList.remove('expanded');
                gsap.to(navContainer, {
                    width: '140px',
                    duration: 0.8,
                    ease: 'power3.inOut',
                    overwrite: 'auto'
                });
                gsap.to('#logo-text-main', { letterSpacing: '0.25em', color: 'var(--gold)', duration: 0.6, ease: 'power3.out' });
            }, 450);
        }
        navContainer.addEventListener('mouseenter', () => {
            if (!checkIsMobile()) expandDynamicIsland();
        });
        navContainer.addEventListener('mouseleave', () => {
            if (!checkIsMobile()) closeDynamicIsland();
        });
        navCentralTrigger.addEventListener('click', (e) => {
            if (checkIsMobile()) {
                e.stopPropagation();
                islandExpanded ? closeDynamicIsland() : expandDynamicIsland();
            }
        });
        document.addEventListener('click', (e) => {
            if (checkIsMobile() && islandExpanded && !navContainer.contains(e.target)) {
                closeDynamicIsland();
            }
        });
        let lastScrollY = 0;
        const mainHeader = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY && currentY > 120) {
                gsap.to(mainHeader, { yPercent: -100, duration: 0.35, ease: 'power2.out' });
            } else {
                gsap.to(mainHeader, { yPercent: 0, duration: 0.35, ease: 'power2.out' });
            }
            lastScrollY = currentY;
        });
        const scrollerWax = document.getElementById('scroller-wax');
        const candleScroller = document.getElementById('candle-scroller');
        const footerSection = document.getElementById('footer-section');
        function getMaxWaxHeight() {
            if (window.innerWidth <= 640) return 70;
            if (window.innerWidth <= 1024) return 110;
            return 150;
        }
        function handleScrollCandle() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);
            const maxH = getMaxWaxHeight();
            const minH = 15;
            const newWaxHeight = maxH - (scrollPercent * (maxH - minH));
            if (scrollerWax) {
                scrollerWax.style.height = `${Math.max(newWaxHeight, minH)}px`;
            }
            if (footerSection) {
                const footerRect = footerSection.getBoundingClientRect();
                if (footerRect.bottom <= window.innerHeight + 40) {
                    candleScroller.classList.add('candle-out');
                } else {
                    candleScroller.classList.remove('candle-out');
                }
            }
        }
        window.addEventListener('scroll', handleScrollCandle, { passive: true });
        window.addEventListener('resize', handleScrollCandle);
        handleScrollCandle();
        const serviceCards = document.querySelectorAll('.service-card');
        const servicesSection = document.getElementById('services');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const targetColor = card.getAttribute('data-bg-color');
                gsap.to(servicesSection, { backgroundColor: targetColor, duration: 0.8, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(servicesSection, { backgroundColor: '#fedbe2', duration: 0.8, ease: 'power2.out' });
            });
        });
        const supplierItems = document.querySelectorAll('.supplier-item');
        supplierItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                supplierItems.forEach(sib => {
                    if (sib !== item) gsap.to(sib, { opacity: 0.3, duration: 0.3 });
                });
            });
            item.addEventListener('mouseleave', () => {
                supplierItems.forEach(sib => {
                    gsap.to(sib, { opacity: 1, duration: 0.3 });
                });
            });
        });
        let activeOccasion = 'wedding';
        let wizardSelectedServices = [false, false, false, false, false];
        function setOccasion(type) {
            activeOccasion = type;
            document.querySelectorAll('.occasion-btn').forEach(btn => {
                btn.classList.remove('bg-peach/40', 'border-gold');
            });
            const arBtn = document.getElementById(`btn-${type}-ar`);
            const enBtn = document.getElementById(`btn-${type}-en`);
            if (arBtn) arBtn.classList.add('bg-peach/40', 'border-gold');
            if (enBtn) enBtn.classList.add('bg-peach/40', 'border-gold');

            const honeymoonBtn = document.getElementById('ws-4');
            if (type === 'wedding') {
                if (honeymoonBtn) honeymoonBtn.style.display = 'flex';
            } else {
                if (honeymoonBtn) honeymoonBtn.style.display = 'none';
                wizardSelectedServices[4] = false;
                const dot = document.getElementById('ws-dot-4');
                if (dot) dot.classList.add('grayscale', 'opacity-50');
                if (honeymoonBtn) honeymoonBtn.classList.remove('border-gold', 'bg-peach/20');
            }
            updateWizardVisuals();
        }
        function toggleWizardService(index) {
            wizardSelectedServices[index] = !wizardSelectedServices[index];
            const btn = document.getElementById(`ws-${index}`);
            const dot = document.getElementById(`ws-dot-${index}`);
            if (wizardSelectedServices[index]) {
                btn.classList.add('border-gold', 'bg-peach/20');
                if(dot) {
                    dot.classList.remove('grayscale', 'opacity-50');
                    dot.classList.add('grayscale-0', 'opacity-100');
                }
            } else {
                btn.classList.remove('border-gold', 'bg-peach/20');
                if(dot) {
                    dot.classList.remove('grayscale-0', 'opacity-100');
                    dot.classList.add('grayscale', 'opacity-50');
                }
            }
            updateWizardVisuals();
        }
        const budgetValues = [];
        for (let i = 100; i <= 10000; i += 100) budgetValues.push(i);
        for (let i = 15000; i <= 250000; i += 5000) budgetValues.push(i);
        function updateBudget(index) {
            const el = document.getElementById('budget-val');
            const actualValue = budgetValues[index];
            if (el && actualValue !== undefined) {
                el.innerText = `$${actualValue.toLocaleString()}+`;
            }
        }
        function updateWizardVisuals() {
            const requiredCount = activeOccasion === 'wedding' ? 5 : 4;
            const activeCount = wizardSelectedServices.filter(Boolean).length;
            const percentage = (activeCount / requiredCount) * 276.4;
            const newOffset = 276.4 - percentage;
            const ring = document.getElementById('wizard-ring');
            if (ring) ring.style.strokeDashoffset = newOffset;
            const textAr = document.getElementById('wiz-progress-text');
            const textEn = document.getElementById('wiz-progress-text-en');
            if (activeCount === requiredCount) {
                gsap.to('#wizard-portal-key', { rotation: 360, scale: 1.25, filter: 'drop-shadow(0px 0px 15px rgba(224, 98, 76, 0.8)) brightness(1.2)', duration: 0.6, ease: 'power2.out' });
                if (textAr) textAr.innerText = 'تم بناء هيكلية مناسبتك بالكامل، البوابة جاهزة للفتح';
                if (textEn) textEn.innerText = 'Blueprint complete, locks are fully aligned for deployment';
            } else {
                gsap.to('#wizard-portal-key', { rotation: 0, scale: 1, filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1)) brightness(1)', duration: 0.6, ease: 'power2.out' });
                if (textAr) textAr.innerText = `المشروع قيد البناء (${activeCount}/${requiredCount} ركائز منتقاة)`;
                if (textEn) textEn.innerText = `Blueprint construction in progress (${activeCount}/${requiredCount} elements active)`;
            }
        }
        function handleWizardSubmit(e) {
            e.preventDefault();
            
            
            const nameInput = document.getElementById('wizard-name');
            const phoneInput = document.getElementById('wizard-phone');
            const budgetVal = document.getElementById('budget-val');
            
            const name = nameInput ? nameInput.value : '';
            const phone = phoneInput ? phoneInput.value : '';
            const budget = budgetVal ? budgetVal.innerText : '';
            const occasion = activeOccasion;
            
            const serviceNames = ['إدارة القاعات (Venue Advisory)', 'المطبخ والضيافة (Luxury Dining)', 'تصوير فني (Master Capture)', 'التصميم الصوتي (Sound Scapes)', 'شهر العسل (Honeymoon Flight)'];
            const selectedServicesStr = wizardSelectedServices
                .map((isSelected, index) => isSelected ? serviceNames[index] : null)
                .filter(Boolean)
                .join(' + ');
                
            const services = selectedServicesStr || 'لا توجد خدمات إضافية محددة';

            const url = "https://script.google.com/macros/s/AKfycby776n1IsmetDg2NC_AQxVqBcCE1_UryRyD_PzbPLW79B32DNf4CIJp5bj4ZNIpUAyi/exec";
            const formData = new URLSearchParams();
            formData.append('formType', 'booking');
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('occasion', occasion);
            formData.append('services', services);
            formData.append('budget', budget);

            fetch(url, { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => console.log('CRM Success:', data))
                .catch(err => console.error('CRM Error:', err));

            
            const formPanel = document.getElementById('journey-form-panel');
            const successPanel = document.getElementById('journey-success-panel');
            const formChildren = formPanel.children;
            gsap.to(Array.from(formChildren), {
                y: -30, opacity: 0, duration: 0.5,
                stagger: 0.08, ease: 'power3.in',
                onComplete: () => {
                    formPanel.style.display = 'none';
                    successPanel.classList.add('is-active');
                    gsap.fromTo(successPanel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
                    const circle = document.getElementById('checkmark-circle');
                    const check = document.getElementById('checkmark-check');
                    gsap.to(circle, {
                        strokeDashoffset: 0, duration: 1.0,
                        delay: 0.3, ease: 'power2.inOut'
                    });
                    gsap.to(check, {
                        strokeDashoffset: 0, duration: 0.5,
                        delay: 1.0, ease: 'power2.out'
                    });
                    gsap.to('#wizard-portal-key', {
                        rotation: 720, scale: 1.4, filter: 'drop-shadow(0px 0px 20px rgba(142, 186, 160, 0.9)) brightness(1.3)',
                        duration: 1.2, ease: 'power4.out'
                    });
                }
            });
        }
        const footerClock = document.getElementById('footer-clock');
        function updateBaghdadTime() {
            if (!footerClock) return;
            const now = new Date();
            const baghdadTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (3600000 * 3));
            const hours = String(baghdadTime.getHours()).padStart(2, '0');
            const minutes = String(baghdadTime.getMinutes()).padStart(2, '0');
            const seconds = String(baghdadTime.getSeconds()).padStart(2, '0');
            footerClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
        setInterval(updateBaghdadTime, 1000);
        updateBaghdadTime();
        function handleNewsletterSubmit(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput ? emailInput.value : '';
            
            const url = "https://script.google.com/macros/s/AKfycby776n1IsmetDg2NC_AQxVqBcCE1_UryRyD_PzbPLW79B32DNf4CIJp5bj4ZNIpUAyi/exec";
            const formData = new URLSearchParams();
            formData.append('formType', 'newsletter');
            formData.append('email', email);

            fetch(url, { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => console.log('Newsletter Success:', data))
                .catch(err => console.error('Newsletter Error:', err));
                
            gsap.to('#footer-newsletter', {
                opacity: 0, y: -10, duration: 0.4,
                onComplete: () => {
                    document.getElementById('footer-newsletter').style.visibility = 'hidden';
                }
            });
            const success = document.getElementById('newsletter-success');
            gsap.to(success, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });
        }
        function smoothScrollTo(target) {
            if (typeof target === 'string' && target.startsWith('#')) {
                history.pushState(null, null, target.replace('#', '/'));
            } else if (target === 0) {
                history.pushState(null, null, '/');
            }
            gsap.to(window, {
                duration: 1.2,
                scrollTo: { y: target, offsetY: 80 },
                ease: 'power3.inOut'
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    smoothScrollTo(targetId);
                }
            });
        });
        gsap.utils.toArray('.reveal-up').forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    gsap.to(el, {
                        opacity: 1, y: 0, duration: 0.9,
                        ease: 'power3.out'
                    });
                    el.classList.add('is-revealed');
                }
            });
        });
        gsap.utils.toArray('[data-parallax-speed]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed'));
            gsap.to(el, {
                yPercent: speed * 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.closest('section') || el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        });
        function updateLiveClock() {
            const clockEl = document.getElementById('footer-clock');
            if (clockEl) {
                const now = new Date();
                clockEl.innerText = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
            }
        }
        setInterval(updateLiveClock, 1000);
        updateLiveClock();
        ScrollTrigger.create({
            trigger: '#services',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.fromTo('.service-card', 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', onComplete: function() {
                        document.querySelectorAll('.service-card').forEach(el => el.classList.add('gsap-loaded'));
                    }}
                );
            }
        });
        ScrollTrigger.batch('.reveal-up', {
            start: 'top 92%',
            once: true,
            onEnter: batch => {
                gsap.to(batch, {
                    opacity: 1, y: 0, duration: 0.8,
                    stagger: 0.08, ease: 'power3.out', onComplete: () => {
                        batch.forEach(el => el.classList.add('gsap-loaded'));
                    }
                });
            }
        });
        (function initCinematicSlider() {
            let currentSlide = 0;
            const slides = document.querySelectorAll('.cinematic-slide');
            const progressBars = document.querySelectorAll('.cinematic-progress');
            const slideDuration = 5000;
            if(slides.length === 0) return;
            function goToSlide(index) {
                slides.forEach((slide, i) => {
                    if(i === index) {
                        slide.style.opacity = '1';
                    } else {
                        slide.style.opacity = '0';
                    }
                });
                progressBars.forEach((pb, i) => {
                    if (i === index) {
                        const isRtl = document.documentElement.dir === 'rtl';
                        pb.style.transition = 'none';
                        pb.style.opacity = '1';
                        pb.style.clipPath = isRtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
                        void pb.offsetWidth;
                        pb.style.transition = `clip-path ${slideDuration}ms linear`;
                        pb.style.clipPath = 'inset(0 0 0 0)';
                    } else {
                        pb.style.transition = 'opacity 0.8s ease-in-out';
                        pb.style.opacity = '0';
                        setTimeout(() => {
                            pb.style.transition = 'none';
                            const isRtl = document.documentElement.dir === 'rtl';
                            pb.style.clipPath = isRtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
                        }, 800);
                    }
                });
            }
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                goToSlide(currentSlide);
            }
            setTimeout(() => {
                goToSlide(0);
                setInterval(nextSlide, slideDuration);
            }, 1000); 
        })();
        (function initCandle() {
            const maxH = getMaxWaxHeight();
            if (scrollerWax) scrollerWax.style.height = maxH + 'px';
        })();

        
        
        
        const policiesData = {
            ar: {
                terms: {
                    title: "الشروط والأحكام",
                    content: [
                        "1. الالتزام بالتميز: نضمن تقديم خدمات إدارية وتصميمية بمعايير عالمية ترقى لعلامة أكيتو الفاخرة.",
                        "2. التعاقد والمسؤولية: تمثل شركتنا الجهة الوحيدة المسؤولة أمام العميل عن جميع التفاصيل التنفيذية.",
                        "3. السرية المطلقة: نلتزم بالحفاظ التام على خصوصية عملائنا وتفاصيل مناسباتهم الحصرية.",
                        "4. الشفافية المالية: تقدم عروضنا المالية بدقة ووضوح خالية من أي رسوم خفية.",
                        "5. المرونة والتعديل: نتيح لعملائنا مرونة التعديل وفق جدول زمني يضمن عدم تأثر جودة التنفيذ.",
                        "6. حقوق الملكية الفكرية: جميع التصاميم والأفكار المقدمة هي ملكية فكرية حصرية لشركة أكيتو.",
                        "7. معايير السلامة: نطبق أعلى معايير السلامة والأمان في كافة مواقع الفعاليات.",
                        "8. إلغاء التعاقد: تخضع سياسة الإلغاء لشروط تعاقدية مرنة تضمن حقوق الطرفين بمهنية.",
                        "9. التوافق القانوني: تخضع هذه الشروط والأحكام للقوانين والأنظمة المعمول بها."
                    ]
                },
                privacy: {
                    title: "سياسة الخصوصية",
                    content: [
                        "1. جمع البيانات: نجمع البيانات الشخصية الضرورية فقط لتقديم تجربة مخصصة واستثنائية.",
                        "2. استخدام المعلومات: تُستخدم معلوماتك حصرياً لتنسيق وتصميم الفعاليات الخاصة بك.",
                        "3. أمن البيانات: نطبق أحدث بروتوكولات التشفير لحماية بياناتك من أي وصول غير مصرح به.",
                        "4. مشاركة الأطراف الثالثة: لا نشارك بياناتك مع أي طرف ثالث إلا في حدود تنفيذ خدماتنا وبموافقتك.",
                        "5. ملفات الارتباط (Cookies): نستخدم ملفات الارتباط لتحسين تجربة تصفحك لموقعنا الرقمي.",
                        "6. حقوق العميل: يحق لك في أي وقت طلب الوصول أو تعديل أو حذف بياناتك الشخصية.",
                        "7. التحديثات: قد نقوم بتحديث هذه السياسة، وسيتم إشعارك بأي تغيير جوهري.",
                        "8. التواصل: لأي استفسار يتعلق بالخصوصية، يمكنك التواصل معنا مباشرة عبر واتساب: <a href='https://wa.me/9647742777077' target='_blank' class='font-medium hover:underline touch-active'>07742777077</a>"
                    ]
                }
            },
            en: {
                terms: {
                    title: "Terms & Conditions",
                    content: [
                        "1. Commitment to Excellence: We guarantee world-class administrative and design services befitting the AKITU luxury brand.",
                        "2. Centralized Liability: AKITU acts as your sole point of contact and is entirely accountable for all execution details.",
                        "3. Absolute Discretion: We strictly adhere to uncompromising confidentiality regarding our exclusive clientele and their events.",
                        "4. Financial Transparency: Our financial proposals are presented with absolute clarity, free from hidden fees.",
                        "5. Agility & Modifications: We offer modification flexibility within a precise timeframe to ensure flawless execution.",
                        "6. Intellectual Property: All concepts and designs presented remain the exclusive intellectual property of AKITU.",
                        "7. Safety Protocols: We enforce the highest standards of safety and security across all event venues.",
                        "8. Cancellation Policy: Cancellations are subject to refined, professional terms that safeguard mutual interests.",
                        "9. Legal Compliance: These terms are governed by and construed in accordance with applicable corporate laws."
                    ]
                },
                privacy: {
                    title: "Privacy Policy",
                    content: [
                        "1. Data Collection: We collect only essential personal data required to curate a bespoke and exceptional experience.",
                        "2. Information Utilization: Your information is utilized exclusively for coordinating and designing your private events.",
                        "3. Data Security: We deploy state-of-the-art encryption protocols to shield your data from unauthorized access.",
                        "4. Third-Party Sharing: Your data is never shared with third parties, except strictly as required for service execution with your consent.",
                        "5. Digital Footprint (Cookies): We utilize cookies to refine and elevate your digital browsing experience.",
                        "6. Client Rights: You reserve the right to request access, modification, or deletion of your personal data at any time.",
                        "7. Policy Revisions: We may periodically update this policy, ensuring you are notified of any material changes.",
                        "8. Direct Concierge: For any privacy inquiries, connect directly with our concierge via WhatsApp: <a href='https://wa.me/9647742777077' target='_blank' class='font-medium hover:underline touch-active'>07742777077</a>"
                    ]
                }
            }
        };

        function openPolicyModal(type) {
            runScreenTransition(() => {
                const data = policiesData[currentLang][type];
                document.getElementById('policy-modal-title').innerHTML = data.title;
                
                let bodyHtml = '<div class="' + (currentLang === 'ar' ? 'font-arabic' : 'font-english') + ' flex flex-col space-y-4">';
                data.content.forEach(item => {
                    bodyHtml += '<p>' + item + '</p>';
                });
                bodyHtml += '</div>';
                
                const modalBody = document.getElementById('policy-modal-body');
                modalBody.innerHTML = bodyHtml;
                modalBody.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
                
                
                const modal = document.getElementById('policy-modal');
                modal.classList.remove('pointer-events-none');
                gsap.to(modal, { opacity: 1, duration: 0.8, ease: "power2.out" });
                
                
                if(window.lucide) lucide.createIcons();
            });
        }

        function closePolicyModal() {
            const modal = document.getElementById('policy-modal');
            gsap.to(modal, { 
                opacity: 0, 
                duration: 0.6, 
                ease: "power2.inOut",
                onComplete: () => {
                    modal.classList.add('pointer-events-none');
                }
            });
        }
