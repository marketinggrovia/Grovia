// === CMS CONTENT LOADER ===
function getCMSData() {
    const saved = localStorage.getItem('grovia_cms');
    return saved ? JSON.parse(saved) : null;
}

function applyCMS() {
    const cms = getCMSData();
    if (!cms) return;

    // Hero
    if (cms.hero) {
        const h = cms.hero;
        const badge = document.querySelector('.hero-badge');
        if (badge) badge.innerHTML = '<span class="badge-dot"></span>' + h.badge;
        const h1 = document.querySelector('.hero h1');
        if (h1) h1.innerHTML = h.headline;
        const sub = document.querySelector('.hero-sub');
        if (sub) sub.textContent = h.subheadline;
        const btns = document.querySelectorAll('.hero-buttons .btn');
        if (btns[0]) btns[0].innerHTML = h.btn1Text + ' <i class="fas fa-arrow-right"></i>';
        if (btns[1]) btns[1].innerHTML = h.btn2Text + ' <i class="fas fa-chevron-down"></i>';
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
                        `<div class="about-card glass-card" data-animate="fade-up" data-delay="${(i+1)*100}">
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
        if (sec) {
            const tag = sec.querySelector('.section-tag');
            if (tag) tag.textContent = s.tag;
            const h2 = sec.querySelector('h2');
            if (h2) h2.innerHTML = s.headline;
            const desc = sec.querySelector('.section-desc');
            if (desc) desc.textContent = s.description;
            if (s.items) {
                const grid = sec.querySelector('.services-grid');
                if (grid) {
                    grid.innerHTML = s.items.map((item, i) =>
                        `<div class="service-card tilt-card" data-animate="fade-up" data-delay="${100+i*50}">
                            <div class="service-icon-wrap"><i class="${item.icon}"></i></div>
                            <h3>${item.title}</h3><p>${item.text}</p>
                            <a href="#contact" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a></div>`
                    ).join('');
                }
            }
        }
    }

    // Why Us
    if (cms.whyus) {
        const w = cms.whyus;
        const sec = document.getElementById('why-us');
        if (sec) {
            const tag = sec.querySelector('.section-tag');
            if (tag) tag.textContent = w.tag;
            const h2 = sec.querySelector('h2');
            if (h2) h2.innerHTML = w.headline;
            const desc = sec.querySelector('.section-desc');
            if (desc) desc.textContent = w.description;
            if (w.items) {
                const grid = sec.querySelector('.why-grid');
                if (grid) {
                    grid.innerHTML = w.items.map((item, i) =>
                        `<div class="why-card glass-card" data-animate="fade-up" data-delay="${(i+1)*100}">
                            <div class="why-number">${item.number}</div>
                            <h3>${item.title}</h3><p>${item.text}</p></div>`
                    ).join('');
                }
            }
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
            const desc = sec.querySelector('.section-desc');
            if (desc) desc.textContent = p.description;
            if (p.items) {
                const grid = sec.querySelector('.portfolio-grid');
                if (grid) {
                    grid.innerHTML = p.items.map((item, i) =>
                        `<div class="portfolio-card" data-animate="fade-up" data-delay="${(i+1)*100}">
                            <div class="portfolio-img" style="background: ${item.gradient};">
                                <div class="portfolio-overlay">
                                    <span class="portfolio-cat">${item.category}</span>
                                    <h3>${item.title}</h3>
                                    <div class="portfolio-metrics">
                                        <div class="metric"><span>${item.metric1}</span> ${item.metric1Label}</div>
                                        <div class="metric"><span>${item.metric2}</span> ${item.metric2Label}</div>
                                    </div></div></div></div>`
                    ).join('');
                }
            }
        }
    }

    // Testimonials
    if (cms.testimonials) {
        const t = cms.testimonials;
        const sec = document.getElementById('testimonials');
        if (sec) {
            const tag = sec.querySelector('.section-tag');
            if (tag) tag.textContent = t.tag;
            const h2 = sec.querySelector('h2');
            if (h2) h2.innerHTML = t.headline;
            const desc = sec.querySelector('.section-desc');
            if (desc) desc.textContent = t.description;
            if (t.items) {
                const track = document.getElementById('testimonialTrack');
                if (track) {
                    track.innerHTML = t.items.map(item =>
                        `<div class="testimonial-card glass-card">
                            <div class="testimonial-stars">${'<i class="fas fa-star"></i>'.repeat(item.stars)}</div>
                            <p>"${item.text}"</p>
                            <div class="testimonial-author">
                                <div class="author-avatar">${item.initials}</div>
                                <div><strong>${item.name}</strong><span>${item.role}</span></div>
                            </div></div>`
                    ).join('');
                }
            }
        }
    }

    // Contact
    if (cms.contact) {
        const c = cms.contact;
        const sec = document.getElementById('contact');
        if (sec) {
            const tag = sec.querySelector('.section-tag');
            if (tag) tag.textContent = c.tag;
            const h2 = sec.querySelector('.contact-info h2');
            if (h2) h2.innerHTML = c.headline;
            const desc = sec.querySelector('.contact-info > p');
            if (desc) desc.textContent = c.description;
            const items = sec.querySelectorAll('.contact-item span');
            if (items[0]) items[0].textContent = c.phone;
            if (items[1]) items[1].textContent = c.email;
            if (items[2]) items[2].textContent = c.address;
            const formTitle = sec.querySelector('.contact-form h3');
            if (formTitle) formTitle.textContent = c.formTitle;
        }
    }

    // Footer
    if (cms.footer) {
        const f = cms.footer;
        const footerBrandP = document.querySelector('.footer-brand > p');
        if (footerBrandP) footerBrandP.textContent = f.brandText;
        const copyright = document.querySelector('.footer-bottom p');
        if (copyright) copyright.innerHTML = f.copyright;
    }
}

// === LOADER ===
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2200);
});

// === APPLY CMS ON DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
    applyCMS();
    initAnimations();
    initNav();
    initTestimonialSlider();
    initTiltCards();
    initParallax();
    initContactForm();
    initSmoothScroll();
});

// === NAVBAR ===
function initNav() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        // Active link
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop - 200;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) link.classList.toggle('active', window.scrollY >= top && window.scrollY < top + section.offsetHeight);
        });
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinks.classList.remove('open');
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
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Counters
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

    document.getElementById('prevBtn').addEventListener('click', () => goTo(current > 0 ? current - 1 : cards.length - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goTo(current < cards.length - 1 ? current + 1 : 0));
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
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        setTimeout(() => {
            btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            btn.style.background = '';
            form.reset();
        }, 3000);
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
