// === CMS CONTENT LOADER ===
function getCMSData() {
    const saved = localStorage.getItem('grovia_cms');
    if (saved) return JSON.parse(saved);
    return typeof DEFAULTS !== 'undefined' ? DEFAULTS : null;
}

async function initCMS() {
    // 1. Try fetching from Supabase
    if (typeof fetchCMS === 'function') {
        const cloudData = await fetchCMS();
        if (cloudData) {
            localStorage.setItem('grovia_cms', JSON.stringify(cloudData));
            return cloudData;
        }
    }
    
    // 2. Fallback to LocalStorage
    const saved = localStorage.getItem('grovia_cms');
    if (saved) return JSON.parse(saved);
    
    // 3. Fallback to Defaults
    return typeof DEFAULTS !== 'undefined' ? DEFAULTS : null;
}

async function applyCMS() {
    try {
        const cms = await initCMS();
        if (!cms) return;

        // Global WhatsApp Floating Button
        try {
            if (cms.contact && cms.contact.phone && !document.querySelector('.whatsapp-float')) {
                const waBtn = document.createElement('a');
                waBtn.className = 'whatsapp-float';
                waBtn.target = '_blank';
                waBtn.href = `https://wa.me/${cms.contact.phone.replace(/\D/g, '')}?text=Hi%20Grovia%20Marketing,%20I'm%20interested%20in%20your%20services.`;
                waBtn.innerHTML = `<i class="fab fa-whatsapp"></i><span>Chat on WhatsApp</span>`;
                document.body.appendChild(waBtn);
            }
        } catch (e) {}

        // Navigation Visibility
        try {
            if (cms.navigation) {
                const n = cms.navigation;
                const linksToToggle = [
                    { key: 'about', hrefs: ['about.html', '#about'] },
                    { key: 'services', hrefs: ['services.html', '#services'] },
                    { key: 'portfolio', hrefs: ['portfolio.html', '#portfolio'] },
                    { key: 'blog', hrefs: ['blog.html', '#blog'] },
                    { key: 'careers', hrefs: ['careers.html'] },
                    { key: 'contact', hrefs: ['contact.html', '#contact'] },
                    { key: 'audit', hrefs: ['audit.html', '#audit'] }
                ];

                linksToToggle.forEach(item => {
                    if (n[item.key] === false) {
                        item.hrefs.forEach(href => {
                            document.querySelectorAll(`a[href*="${href}"]`).forEach(link => {
                                if (!link.classList.contains('nav-logo')) link.style.display = 'none';
                            });
                        });
                    } else {
                         item.hrefs.forEach(href => {
                            document.querySelectorAll(`a[href*="${href}"]`).forEach(link => {
                                if (!link.classList.contains('nav-logo')) link.style.display = '';
                            });
                        });
                    }
                });
            }
        } catch (e) {}

        // General
        if (cms.general) {
            const g = cms.general;
            document.querySelectorAll('.nav-logo span').forEach(el => el.textContent = g.brandName);
            document.querySelectorAll('.nav-logo-img, .loader-logo-img').forEach(el => el.src = g.logo);
        }

        // Hero
        if (cms.hero) {
            const h = cms.hero;
            const badge = document.querySelector('.hero-badge');
            if (badge) badge.innerHTML = '<span class="badge-dot"></span>' + h.badge;
            const h1 = document.querySelector('.hero h1');
            if (h1) h1.innerHTML = h.headline;
            const sub = document.querySelector('.hero-sub');
            if (sub) sub.textContent = h.subheadline;
            if (h.stats) {
                const statsContainer = document.querySelector('.hero-stats');
                if (statsContainer) {
                    statsContainer.innerHTML = h.stats.map((s, i) =>
                        `<div class="hero-stat"><span class="stat-number" data-count="${s.number}">0</span><span class="stat-suffix">${s.suffix}</span><span class="stat-label">${s.label}</span></div>` +
                        (i < h.stats.length - 1 ? '<div class="hero-stat-divider"></div>' : '')
                    ).join('');
                }
            }
        }

        // About
        if (cms.about) {
            const a = cms.about;
            const sec = document.getElementById('about');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag) tag.textContent = a.tag;
                const h2 = sec.querySelector('h2');
                if (h2) h2.innerHTML = a.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc) desc.textContent = a.description;
                if (a.cards) {
                    const grid = sec.querySelector('.about-grid');
                    if (grid) {
                        grid.innerHTML = a.cards.map((c, i) =>
                            `<div class="about-card glass-card" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                                <div class="about-icon"><i class="${c.icon}"></i></div>
                                <h3>${c.title}</h3><p>${c.text}</p></div>`
                        ).join('');
                    }
                }
                if (a.counters) {
                    const counters = sec.querySelector('.about-counters');
                    if (counters) {
                        counters.innerHTML = a.counters.map(c =>
                            `<div class="counter-item"><span class="counter-number" data-count="${c.number}">0</span><span class="counter-suffix">${c.suffix}</span><span class="counter-label">${c.label}</span></div>`
                        ).join('');
                    }
                }
            }
        }

        // Services
        if (cms.services) {
            const s = cms.services;
            const sec = document.getElementById('services');
            const dropdown = document.getElementById('servicesDropdown');
            if (s.items) {
                if (dropdown) {
                    dropdown.innerHTML = s.items.map(item => {
                        const sId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
                        return `<a href="service-detail.html?id=${sId}" class="dropdown-item">${item.title}</a>`;
                    }).join('');
                }
                const grid = sec ? sec.querySelector('.services-grid') : null;
                if (grid) {
                    grid.innerHTML = s.items.map((item, i) => {
                        const sId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
                        return `<div class="service-card tilt-card" data-animate="fade-up" data-delay="${100 + i * 50}">
                            <div class="service-icon-wrap"><i class="${item.icon}"></i></div>
                            <h3>${item.title}</h3><p>${item.text}</p>
                            <a href="service-detail.html?id=${sId}" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a></div>`;
                    }).join('');
                }
            }
        }

        // Audit
        if (cms.audit) {
            const au = cms.audit;
            const sec = document.getElementById('audit');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag) tag.textContent = au.tag;
                const h2 = sec.querySelector('h2');
                if (h2) h2.innerHTML = au.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc) desc.textContent = au.description;
            }
        }

        // Portfolio
        if (cms.portfolio) {
            const p = cms.portfolio;
            const sec = document.getElementById('portfolio');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag) tag.textContent = p.tag;
                const h2 = sec.querySelector('h2');
                if (h2) h2.innerHTML = p.headline;
                if (p.items) {
                    const grid = sec.querySelector('.portfolio-grid');
                    if (grid) {
                        grid.innerHTML = p.items.map((item, i) => `
                            <div class="portfolio-card" data-animate="fade-up" data-delay="${i * 100}">
                                <div class="portfolio-img" style="background: ${item.color || 'var(--gradient)'};">
                                    <div class="portfolio-overlay">
                                        <span class="portfolio-cat">${item.category}</span>
                                        <h3>${item.title}</h3>
                                        <div class="portfolio-metrics">
                                            ${item.metrics ? item.metrics.map(m => `<div class="metric"><span>${m.value}</span> ${m.label}</div>`).join('') : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            }
        }

        // Blog
        if (cms.blog && cms.blog.items) {
            const grid = document.querySelector('.blog-grid');
            if (grid) {
                grid.innerHTML = cms.blog.items.map((post, i) => `
                    <div class="blog-card" data-animate="fade-up" data-delay="${i * 100}">
                        <div class="blog-card-img">
                            <img src="${post.image}" alt="${post.title}">
                            <span class="blog-card-badge">${post.category}</span>
                        </div>
                        <div class="blog-card-content">
                            <div class="blog-card-meta">
                                <span><i class="far fa-calendar"></i> ${post.date}</span>
                                <span><i class="far fa-user"></i> ${post.author}</span>
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.excerpt}</p>
                            <a href="blog-detail.html?id=${post.id}" class="blog-card-link">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Testimonials
        if (cms.testimonials) {
            const t = cms.testimonials;
            const sec = document.getElementById('testimonials');
            if (sec) {
                const track = document.getElementById('testimonialTrack');
                if (track && t.items) {
                    track.innerHTML = t.items.map(item => `
                        <div class="testimonial-card glass-card">
                            <div class="testimonial-stars">${'<i class="fas fa-star"></i>'.repeat(item.stars || 5)}</div>
                            <p>"${item.text}"</p>
                            <div class="testimonial-author">
                                <div class="author-avatar">${item.initials || 'A'}</div>
                                <div><strong>${item.name}</strong><span>${item.role}</span></div>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }

        // Socials & Footer Sync
        if (cms.socials) {
            const s = cms.socials;
            const socialMap = { '.social-fb': s.facebook, '.social-ig': s.instagram, '.social-li': s.linkedin, '.social-tw': s.twitter, '.social-pn': s.pinterest, '.social-gmb': s.gmb };
            Object.entries(socialMap).forEach(([selector, url]) => {
                document.querySelectorAll(selector).forEach(link => {
                    if (url) { link.href = url; link.style.display = ''; } 
                    else { link.style.display = 'none'; }
                });
            });
        }
        if (cms.contact) {
            const c = cms.contact;
            document.querySelectorAll('.footer-phone').forEach(el => { el.href = `tel:${c.phone.replace(/\s/g, '')}`; el.innerHTML = `<i class="fas fa-phone"></i> ${c.phone}`; });
            document.querySelectorAll('.footer-email').forEach(el => { el.href = `mailto:${c.email}`; el.innerHTML = `<i class="fas fa-envelope"></i> ${c.email}`; });
            document.querySelectorAll('.footer-address').forEach(el => { el.href = c.mapLink || '#'; el.innerHTML = `<i class="fas fa-location-dot"></i> ${c.address}`; });
        }
        
    } catch (err) {
        console.error('applyCMS Error:', err);
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Static Initializers
    initNav();
    initSmoothScroll();
    initAuditForm();

    // 2. Dynamic Content
    await applyCMS();

    // 3. Post-load Initializers
    initAnimations();
    initTestimonialSlider();
    initTiltCards();
    initParallax();
    initContactForm();

    // Hide Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1000);
    }
});

// === AUDIT FORM ===
function initAuditForm() {
    const form = document.getElementById('auditForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = document.getElementById('auditUrl').value;
        const status = document.getElementById('auditStatus');
        const progress = status.querySelector('.audit-progress');
        const text = document.getElementById('auditStatusText');
        const results = document.getElementById('auditResults');
        const btn = form.querySelector('button');

        btn.disabled = true;
        status.classList.remove('hidden');
        results.classList.add('hidden');
        
        const steps = [
            { p: 20, t: "Fetching website content..." },
            { p: 40, t: "Analyzing meta tags and headers..." },
            { p: 60, t: "Checking page load speed and performance..." },
            { p: 80, t: "Evaluating mobile responsiveness..." },
            { p: 100, t: "Finalizing audit report..." }
        ];

        for (const step of steps) {
            progress.style.width = step.p + '%';
            text.textContent = step.t;
            await new Promise(r => setTimeout(r, 800));
        }

        setTimeout(() => {
            status.classList.add('hidden');
            results.classList.remove('hidden');
            document.getElementById('resUrl').textContent = url.replace(/^https?:\/\//, '');
            btn.disabled = false;
        }, 500);
    });
}

// === NAVBAR ===
function initNav() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('.')) {
            document.querySelectorAll('section[id]').forEach(section => {
                const top = section.offsetTop - 200;
                const id = section.getAttribute('id');
                const link = document.querySelector(`.nav-link[href="#${id}"]`);
                if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < top + section.offsetHeight);
            });
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });

    // Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                const content = dropdown.querySelector('.dropdown-content');
                if (content) {
                    content.style.display = content.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
    });
}

// === SCROLL ANIMATIONS ===
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('animated'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function initCounter() {
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-count]').forEach(el => {
                    const target = parseInt(el.dataset.count);
                    const start = performance.now();
                    (function update(now) {
                        const progress = Math.min((now - start) / 2000, 1);
                        el.textContent = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
                        if (progress < 1) requestAnimationFrame(update);
                    })(start);
                });
                counterObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.hero-stats, .about-counters').forEach(el => counterObs.observe(el));
}

// === TESTIMONIAL SLIDER ===
function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track || !dotsContainer) return;

    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    let current = 0;
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(i) {
        current = i;
        track.style.transform = `translateX(-${i * 100}%)`;
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
    }

    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if (prev) prev.addEventListener('click', () => goTo(current > 0 ? current - 1 : cards.length - 1));
    if (next) next.addEventListener('click', () => goTo(current < cards.length - 1 ? current + 1 : 0));
    
    setInterval(() => goTo(current < cards.length - 1 ? current + 1 : 0), 5000);
}

// === 3D TILT ===
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const rotX = ((e.clientY - r.top) / r.height - 0.5) * -16;
            const rotY = ((e.clientX - r.left) / r.width - 0.5) * 16;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// === PARALLAX ===
function initParallax() {
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.shape').forEach((shape, i) => {
            shape.style.transform = `translateY(${window.scrollY * (i + 1) * 0.03}px)`;
        });
    });
}

// === CONTACT FORM ===
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const cms = getCMSData();
    const formspreeId = (cms && cms.general && cms.general.formspreeId) ? cms.general.formspreeId : 'xvonzvze';
    form.action = `https://formspree.io/f/${formspreeId}`;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                form.reset();
            } else { throw new Error(); }
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            btn.style.background = '#ef4444';
        }
        setTimeout(() => { btn.disabled = false; btn.innerHTML = originalHTML; btn.style.background = ''; }, 3000);
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}
