// === CMS CONTENT LOADER ===
function getCMSData() {
    const saved = localStorage.getItem('grovia_cms');
    if (saved) return JSON.parse(saved);
    return typeof DEFAULTS !== 'undefined' ? DEFAULTS : null;
}

async function initCMS() {
    let cmsData = typeof DEFAULTS !== 'undefined' ? JSON.parse(JSON.stringify(DEFAULTS)) : {};
    
    // 1. Try fetching from Supabase
    if (typeof fetchCMS === 'function') {
        const cloudData = await fetchCMS();
        if (cloudData) {
            cmsData = Object.assign({}, cmsData, cloudData);
            localStorage.setItem('grovia_cms', JSON.stringify(cmsData));
            return cmsData;
        }
    }
    
    // 2. Fallback to LocalStorage
    const saved = localStorage.getItem('grovia_cms');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            cmsData = Object.assign({}, cmsData, parsed);
            return cmsData;
        } catch (e) {}
    }
    
    // 3. Fallback to Defaults
    return cmsData;
}

async function applyCMS() {
    try {
        const cms = await initCMS();
        if (!cms) return;

        // 1. Dynamic SEO Metadata Injection for Current Page
        try {
            if (cms.seo) {
                const fullPath = window.location.pathname.split('/').pop().toLowerCase();
                let pageKey = fullPath.replace('.html', '') || 'index';
                if (pageKey === '') pageKey = 'index';
                const pageSEO = cms.seo[pageKey] || cms.seo.index;
                if (pageSEO) {
                    if (pageSEO.title && !window.location.search.includes('id=')) {
                        document.title = pageSEO.title;
                    }
                    const metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc && pageSEO.description && !window.location.search.includes('id=')) {
                        metaDesc.setAttribute('content', pageSEO.description);
                    }
                    const ogTitle = document.querySelector('meta[property="og:title"]');
                    if (ogTitle && pageSEO.title) ogTitle.setAttribute('content', pageSEO.title);
                    const ogDesc = document.querySelector('meta[property="og:description"]');
                    if (ogDesc && pageSEO.description) ogDesc.setAttribute('content', pageSEO.description);
                    const ogImage = document.querySelector('meta[property="og:image"]');
                    if (ogImage && pageSEO.ogImage) ogImage.setAttribute('content', pageSEO.ogImage);
                }
            }
        } catch (e) {}

        // 2. Global WhatsApp Floating Button
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

        // 3. Navigation Visibility
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

        // 4. General Brand Settings
        if (cms.general) {
            const g = cms.general;
            if (g.brandName) document.querySelectorAll('.nav-logo span').forEach(el => el.textContent = g.brandName);
            if (g.logo) {
                document.querySelectorAll('.nav-logo-img, .loader-logo-img, .footer-logo-img').forEach(el => el.src = g.logo);
            }
            if (g.favicon) {
                let favicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
                if (favicons.length > 0) {
                    favicons.forEach(el => el.href = g.favicon);
                } else {
                    const fav = document.createElement('link');
                    fav.rel = 'icon';
                    fav.href = g.favicon;
                    document.head.appendChild(fav);
                }
            }
            if (g.formspreeId) {
                const forms = document.querySelectorAll('form#contactForm, form#auditForm');
                forms.forEach(f => f.action = `https://formspree.io/f/${g.formspreeId}`);
            }
        }

        // 5. Hero Section (Home)
        if (cms.hero) {
            const h = cms.hero;
            const badge = document.querySelector('.hero-badge');
            if (badge && h.badge) badge.innerHTML = '<span class="badge-dot"></span>' + h.badge;
            const h1 = document.querySelector('.hero h1');
            if (h1 && h.headline) h1.innerHTML = h.headline;
            const sub = document.querySelector('.hero-sub');
            if (sub && h.subheadline) sub.textContent = h.subheadline;
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

        // 6. Why Trust Us
        if (cms.whyTrust) {
            const wt = cms.whyTrust;
            const sec = document.getElementById('why-trust');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && wt.tag) tag.textContent = wt.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && wt.headline) h2.innerHTML = wt.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && wt.description) desc.textContent = wt.description;
                
                const grid = document.getElementById('whyTrustGrid');
                if (grid && wt.items) {
                    grid.innerHTML = wt.items.map((item, i) => `
                        <div class="trust-card glass-card" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                            <div class="trust-card-icon"><i class="${item.icon}"></i></div>
                            <h3>${item.title}</h3>
                            <p>${item.text}</p>
                        </div>
                    `).join('');
                }
            }
        }

        // 7. About Us Section & About Page
        if (cms.about) {
            const a = cms.about;
            const sec = document.getElementById('about');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && a.tag) tag.textContent = a.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && a.headline) h2.innerHTML = a.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && a.description) desc.textContent = a.description;
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

        // 8. Why Choose Us
        if (cms.whyus) {
            const w = cms.whyus;
            const sec = document.getElementById('why-us');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && w.tag) tag.textContent = w.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && w.headline) h2.innerHTML = w.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && w.description) desc.textContent = w.description;
                
                const grid = sec.querySelector('.why-grid');
                if (grid && w.items) {
                    grid.innerHTML = w.items.map((item, i) => `
                        <div class="why-card glass-card" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                            <div class="why-number">${item.number}</div>
                            <h3>${item.title}</h3>
                            <p>${item.text}</p>
                        </div>
                    `).join('');
                }
            }
        }

        // 9. Our Process
        if (cms.process) {
            const pr = cms.process;
            const sec = document.getElementById('process');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && pr.tag) tag.textContent = pr.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && pr.headline) h2.innerHTML = pr.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && pr.description) desc.textContent = pr.description;

                const stepsContainer = document.getElementById('processSteps');
                if (stepsContainer && pr.steps) {
                    stepsContainer.innerHTML = pr.steps.map((item, i) => `
                        <div class="process-step" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                            <div class="process-step-num">${item.step}</div>
                            <div class="process-step-content glass-card">
                                <h3>${item.title}</h3>
                                <p>${item.text}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }

        // 10. Industries We Serve
        if (cms.industries) {
            const ind = cms.industries;
            const sec = document.getElementById('industries');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && ind.tag) tag.textContent = ind.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && ind.headline) h2.innerHTML = ind.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && ind.description) desc.textContent = ind.description;

                const grid = document.getElementById('industriesGrid');
                if (grid && ind.items) {
                    grid.innerHTML = ind.items.map((item, i) => `
                        <div class="industry-card glass-card" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                            <div class="industry-card-icon"><i class="${item.icon}"></i></div>
                            <h3>${item.title}</h3>
                            <p>${item.text}</p>
                        </div>
                    `).join('');
                }
                const calloutText = document.getElementById('industriesCalloutText');
                if (calloutText && ind.callout) {
                    calloutText.textContent = ind.callout;
                }
            }
        }

        // 11. Services Section & Dropdown Navigation
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

        // 12. Audit Section
        if (cms.audit) {
            const au = cms.audit;
            const sec = document.getElementById('audit');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && au.tag) tag.textContent = au.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && au.headline) h2.innerHTML = au.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && au.description) desc.textContent = au.description;
            }
        }

        // 13. Portfolio & Case Studies
        if (cms.portfolio) {
            const p = cms.portfolio;
            const sec = document.getElementById('portfolio');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && p.tag) tag.textContent = p.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && p.headline) h2.innerHTML = p.headline;
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

        // 14. Blog Posts Grid (Filtered by Active Status)
        if (cms.blogs) {
            const grid = document.querySelector('.blog-grid');
            if (grid) {
                const activeBlogs = cms.blogs.filter(b => !b.status || b.status === 'Active' || b.status === 'published');
                grid.innerHTML = activeBlogs.map((post, i) => `
                    <div class="blog-card" data-animate="fade-up" data-delay="${i * 100}">
                        <div class="blog-card-img">
                            <img src="${post.image}" alt="${post.title}">
                            <span class="blog-card-badge">${post.category || 'Marketing'}</span>
                        </div>
                        <div class="blog-card-content">
                            <div class="blog-card-meta">
                                <span><i class="far fa-calendar"></i> ${post.date || 'Recent'}</span>
                                <span><i class="far fa-user"></i> ${post.author || 'Grovia'}</span>
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.smallDescription || post.excerpt || ''}</p>
                            <a href="blog-detail.html?id=${post.id}" class="blog-card-link">Read More <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 15. Testimonials Slider
        if (cms.testimonials) {
            const t = cms.testimonials;
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

        // 16. FAQ Section
        if (cms.faq) {
            const f = cms.faq;
            const sec = document.getElementById('faq');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && f.tag) tag.textContent = f.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && f.headline) h2.innerHTML = f.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && f.description) desc.textContent = f.description;

                const list = sec.querySelector('.faq-list');
                if (list && f.items) {
                    list.innerHTML = f.items.map((item, i) => `
                        <div class="faq-item" data-animate="fade-up" data-delay="${(i + 1) * 50}">
                            <button class="faq-question">
                                <span>${item.question}</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="faq-answer">
                                <p>${item.answer}</p>
                            </div>
                        </div>
                    `).join('');
                    
                    // Bind toggle accordion logic
                    list.querySelectorAll('.faq-question').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const item = btn.parentElement;
                            const active = list.querySelector('.faq-item.active');
                            if (active && active !== item) {
                                active.classList.remove('active');
                            }
                            item.classList.toggle('active');
                        });
                    });
                }
            }
        }

        // 17. Careers Page
        if (cms.careers) {
            const car = cms.careers;
            const jobGrid = document.getElementById('jobGrid');
            if (jobGrid && car.items) {
                jobGrid.innerHTML = car.items.map((item, i) => `
                    <div class="career-card glass-card" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                        <div class="career-badge">${item.type}</div>
                        <h3>${item.title}</h3>
                        <p class="career-loc" style="color: var(--blue-600); font-weight: 500; font-size: 0.9rem; margin-bottom: 10px;"><i class="fas fa-location-dot"></i> ${item.location}</p>
                        <p style="color: var(--gray-600); font-size: 0.95rem; line-height: 1.6;">${item.description}</p>
                        <a href="https://wa.me/${(car.whatsapp || cms.contact?.phone || '917014298350').replace(/\D/g, '')}?text=Hi%20Grovia,%20I%20am%20interested%20in%20the%20${encodeURIComponent(item.title)}%20position." target="_blank" class="btn btn-outline" style="margin-top: 15px; width: 100%; text-align: center; display: inline-block;">Apply via WhatsApp <i class="fab fa-whatsapp"></i></a>
                    </div>
                `).join('');
            }
        }

        // 18. Instagram / Social Feed
        if (cms.socialFeed) {
            const sf = cms.socialFeed;
            const sec = document.getElementById('social-feed');
            if (sec) {
                const tag = sec.querySelector('.section-tag');
                if (tag && sf.tag) tag.textContent = sf.tag;
                const h2 = sec.querySelector('h2');
                if (h2 && sf.headline) h2.innerHTML = sf.headline;
                const desc = sec.querySelector('.section-desc');
                if (desc && sf.description) desc.textContent = sf.description;
                const grid = sec.querySelector('.social-grid');
                if (grid && sf.items) {
                    grid.innerHTML = sf.items.map((item, i) => `
                        <a href="${item.link || '#'}" target="_blank" class="social-item" data-animate="fade-up" data-delay="${(i + 1) * 100}">
                            <img src="${item.image}" alt="Instagram Post">
                            <div class="social-overlay">
                                <i class="fab fa-instagram"></i>
                            </div>
                        </a>
                    `).join('');
                }
            }
        }

        // 19. Contact Section & Details
        if (cms.contact) {
            const c = cms.contact;
            const sec = document.getElementById('contact');
            if (sec) {
                const details = sec.querySelector('.contact-details');
                if (details) {
                    details.innerHTML = `
                        <div class="contact-item"><i class="fas fa-phone"></i>
                            <div><strong>Phone</strong><span><a href="tel:${(c.phone||'').replace(/\s/g, '')}" style="color:inherit;text-decoration:none;">${c.phone || '+91 70142 98350'}</a></span></div>
                        </div>
                        <div class="contact-item"><i class="fas fa-envelope"></i>
                            <div><strong>Email</strong><span><a href="mailto:${c.email||'hello@groviamarketing.com'}" style="color:inherit;text-decoration:none;">${c.email || 'hello@groviamarketing.com'}</a></span></div>
                        </div>
                        <div class="contact-item"><i class="fas fa-location-dot"></i>
                            <div><strong>Address</strong><span>${c.address || 'Jaipur, Rajasthan, India'}</span></div>
                        </div>
                    `;
                }
            }
            document.querySelectorAll('.footer-phone').forEach(el => { el.href = `tel:${(c.phone||'').replace(/\s/g, '')}`; el.innerHTML = `<i class="fas fa-phone"></i> ${c.phone}`; });
            document.querySelectorAll('.footer-email').forEach(el => { el.href = `mailto:${c.email}`; el.innerHTML = `<i class="fas fa-envelope"></i> ${c.email}`; });
            document.querySelectorAll('.footer-address').forEach(el => { el.href = c.mapLink || '#'; el.innerHTML = `<i class="fas fa-location-dot"></i> ${c.address}`; });
        }

        // 20. Social Links Sync (Footer & Header)
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
    initCounter();
    initTestimonialSlider();
    initTiltCards();
    initParallax();
    initContactForm();
    initAnalyticsTracker();

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
    }, { threshold: 0.1 });
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

// === CLIENT-SIDE WEBSITE ANALYTICS TRACKER ===
function initAnalyticsTracker() {
    try {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        if (path.includes('admin')) return; // Do not track admin panel visits

        // 1. Get or create visitor ID
        let vid = localStorage.getItem('grovia_visitor_id');
        if (!vid) {
            vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
            localStorage.setItem('grovia_visitor_id', vid);
        }

        // 2. Identify device type
        let device = 'Desktop';
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua) || (window.innerWidth <= 1024 && window.innerWidth > 768)) {
            device = 'Tablet';
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua) || window.innerWidth <= 768) {
            device = 'Mobile';
        }

        // 3. Referral source
        let referrer = document.referrer ? (new URL(document.referrer)).hostname : 'Direct';
        if (referrer.includes(window.location.hostname)) referrer = 'Internal Navigation';
        else if (referrer.includes('google')) referrer = 'Google Search (Organic)';
        else if (referrer.includes('instagram') || referrer.includes('facebook') || referrer.includes('linkedin')) referrer = 'Social Media';

        // 4. Record event
        const pageTitle = document.title.replace(' | Grovia Marketing', '').replace(' | Grovia', '');
        const eventItem = {
            id: Date.now() + Math.random().toString(36).substring(2, 5),
            visitorId: vid,
            page: path + (window.location.search || ''),
            pageTitle: pageTitle,
            referrer: referrer,
            device: device,
            timestamp: new Date().toISOString()
        };

        const logs = JSON.parse(localStorage.getItem('grovia_pageviews_log') || '[]');
        logs.unshift(eventItem);
        if (logs.length > 300) logs.pop();
        localStorage.setItem('grovia_pageviews_log', JSON.stringify(logs));

        // 5. Update live active heartbeat
        localStorage.setItem('grovia_last_active_ping', Date.now().toString());
    } catch (e) {
        console.warn('Analytics logging notice:', e);
    }
}
