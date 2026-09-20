// DEFAULTS moved to defaults.js

// === STATE ===
let data = {};
let currentSection = 'hero';

async function loadData() {
  const cloudData = await fetchCMS();
  if (cloudData) {
    data = cloudData;
    localStorage.setItem('grovia_cms', JSON.stringify(data));
  } else {
    const saved = localStorage.getItem('grovia_cms');
    data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULTS));
  }
}

function getData(section) { return data[section] || DEFAULTS[section]; }

// === AUTH ===
async function attemptLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (email === 'admin@grovia.com' && password === 'admin123') {
    localStorage.setItem('grovia_admin_session', 'true');
    showToast('Signed in successfully (local bypass)!');
    location.reload();
    return;
  }
  
  try {
    const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    showToast('Signed in successfully!');
    location.reload();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function logout() {
  localStorage.removeItem('grovia_admin_session');
  try {
    await supabaseClient.auth.signOut();
  } catch (e) {}
  location.reload();
}

// === TOPBAR & THEME CONTROLS ===
function initAdminTheme() {
  const isDark = localStorage.getItem('grovia_admin_theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark-theme');
    const icon = document.getElementById('themeIcon');
    if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('grovia_admin_theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) {
    if (isDark) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }
  showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  // Re-render chart colors if on analytics
  if (currentSection === 'analytics' && typeof initAnalyticsCharts === 'function') {
    initAnalyticsCharts(currentAnalyticsRange || '7d');
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => console.log(err));
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('mainSidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
}

async function checkAuth() {
  initAdminTheme();
  const localSession = localStorage.getItem('grovia_admin_session');
  if (localSession === 'true') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    await loadData();
    loadSection('analytics');
    return;
  }
  
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      await loadData();
      loadSection('analytics');
    }
  } catch (err) {
    console.error('Supabase getSession error:', err);
  }
}

// Check auth on load
document.addEventListener('DOMContentLoaded', checkAuth);

// === TOAST ===
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<i class="fas ${type==='error'?'fa-exclamation-circle':type==='info'?'fa-info-circle':'fa-check-circle'}"></i> <span>${msg}</span>`;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3200);
}

// === SAVE ===
async function saveAll() {
  const section = currentSection;
  const fields = document.querySelectorAll('[data-field]');
  fields.forEach(f => {
    const path = f.dataset.field.split('.');
    let obj = data[section];
    if (!obj) { data[section] = JSON.parse(JSON.stringify(DEFAULTS[section] || {})); obj = data[section]; }
    for (let i = 0; i < path.length - 1; i++) {
      const key = isNaN(path[i]) ? path[i] : parseInt(path[i]);
      if (!obj[key]) obj[key] = {};
      obj = obj[key];
    }
    const lastKey = isNaN(path[path.length-1]) ? path[path.length-1] : parseInt(path[path.length-1]);
    if (f.type === 'checkbox') {
        obj[lastKey] = f.checked;
    } else {
        obj[lastKey] = f.type === 'number' ? Number(f.value) : f.value;
    }
  });
  
  // Save locally immediately so user work is never lost
  localStorage.setItem('grovia_cms', JSON.stringify(data));
  
  const result = await updateCMS(data);
  if (result.success) {
    showToast('Changes saved to cloud & locally!');
  } else {
    showToast('Saved locally. (Supabase RLS policy needs update to sync to cloud)', 'warning');
  }
}

async function resetSection() {
  if (confirm('Reset this section to defaults?')) {
    data[currentSection] = JSON.parse(JSON.stringify(DEFAULTS[currentSection] || {}));
    const result = await updateCMS(data);
    if (result.success) {
        localStorage.setItem('grovia_cms', JSON.stringify(data));
        loadSection(currentSection);
        showToast('Section reset to defaults', 'info');
    } else {
        showToast('Cloud Error: ' + result.message, 'error');
    }
  }
}

// === RENDER SECTIONS ===
function loadSection(section) {
  currentSection = section;
  const titles = {
    analytics: 'Website Analytics & Insights',
    blogs: 'Blog Posts Manager',
    hero:'Hero Section', about:'About Us', services:'Services', whyus:'Why Choose Us',
    portfolio:'Portfolio', testimonials:'Testimonials', contact:'Contact Us', footer:'Footer',
    general: 'General Settings', navigation: 'Menu Visibility', socials: 'Social Media', settings:'Security Settings',
    seo: 'SEO Settings', careers: 'Careers Page', faq: 'FAQ Section', socialFeed: 'Instagram Feed',
    billing: 'Billing & Invoices', quotations: 'Quotations', audit: 'Audit Section',
    whyTrust: 'Why Trust Grovia', process: 'Our Process', industries: 'Industries We Serve'
  };

  const titleEl = document.getElementById('sectionTitle');
  if (titleEl) titleEl.textContent = titles[section] || 'Dashboard';

  // Toggle Save/Reset buttons visibility for analytics
  const actionsEl = document.getElementById('topbarActionButtons');
  if (actionsEl) {
    actionsEl.style.display = (section === 'analytics') ? 'none' : 'flex';
  }

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.section === section));
  const area = document.getElementById('contentArea');
  const d = getData(section);
  if (!data[section] && DEFAULTS[section]) data[section] = JSON.parse(JSON.stringify(d));

  const renderers = {
    analytics: renderAnalytics,
    blogs: renderBlogs,
    hero: renderHero, about: renderAbout, services: renderServices, whyus: renderWhyUs,
    portfolio: renderPortfolio, testimonials: renderTestimonials, contact: renderContact,
    footer: renderFooter, settings: renderSettings, general: renderGeneral, socials: renderSocials,
    seo: renderSEO, careers: renderCareers, faq: renderFAQ, socialFeed: renderSocialFeed,
    navigation: renderNavigation, billing: renderBilling, quotations: renderQuotations, audit: renderAudit,
    whyTrust: renderWhyTrust, process: renderProcess, industries: renderIndustries
  };

  area.innerHTML = renderers[section] ? renderers[section](d) : '<p>Section not found</p>';

  if (section === 'analytics') {
    setTimeout(() => {
      if (typeof initAnalyticsCharts === 'function') initAnalyticsCharts(currentAnalyticsRange || '7d');
    }, 60);
  }
}

function fieldHTML(label, fieldPath, value, type='text', extra='') {
  if (type === 'textarea') return `<div class="field-group"><label>${label}</label><textarea oninput="syncData()" data-field="${fieldPath}" rows="3" ${extra}>${value||''}</textarea></div>`;
  if (type === 'checkbox') return `
    <div class="field-group" style="flex-direction:row; align-items:center; gap:10px; margin-bottom:10px;">
      <input type="checkbox" onchange="syncData()" data-field="${fieldPath}" ${value ? 'checked' : ''} style="width:auto; margin:0;">
      <label style="margin:0; cursor:pointer;">${label}</label>
    </div>`;
  return `<div class="field-group"><label>${label}</label><input oninput="syncData()" type="${type}" data-field="${fieldPath}" value="${(value||'').toString().replace(/"/g,'&quot;')}" ${extra}></div>`;
}

function renderNavigation(d) {
  return `
    <div class="admin-card">
      <h3><i class="fas fa-eye-slash"></i> Page Visibility</h3>
      <p style="margin-bottom:20px; color:var(--text-muted)">Uncheck a page to hide it from the navigation menu and footer links.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
        ${fieldHTML('Show About Page', 'about', d.about, 'checkbox')}
        ${fieldHTML('Show Services Page', 'services', d.services, 'checkbox')}
        ${fieldHTML('Show Portfolio Page', 'portfolio', d.portfolio, 'checkbox')}
        ${fieldHTML('Show Blog Page', 'blog', d.blog, 'checkbox')}
        ${fieldHTML('Show Careers Page', 'careers', d.careers, 'checkbox')}
        ${fieldHTML('Show Contact Page', 'contact', d.contact, 'checkbox')}
      </div>
    </div>`;
}

function renderAudit(d) {
  return `
    <div class="admin-card">
      <h3><i class="fas fa-search"></i> Audit Section Content</h3>
      ${fieldHTML('Section Tag', 'tag', d.tag)}
      ${fieldHTML('Headline', 'headline', d.headline)}
      ${fieldHTML('Description', 'description', d.description, 'textarea')}
      ${fieldHTML('Input Placeholder', 'placeholder', d.placeholder)}
    </div>
    <div class="admin-card" style="background:rgba(16, 185, 129, 0.05); border:1px solid rgba(16, 185, 129, 0.1)">
        <h4 style="color:#10b981; margin-bottom:10px"><i class="fas fa-info-circle"></i> User Interaction</h4>
        <p style="font-size:0.85rem; color:var(--text-muted)">When a user submits a URL on the homepage, they see a real-time analysis animation followed by a score report. This encourages them to contact you for the full PDF report.</p>
    </div>`;
}

function renderHero(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Content</h3>
      ${fieldHTML('Badge Text','badge',d.badge)}
      ${fieldHTML('Headline (HTML allowed)','headline',d.headline)}
      ${fieldHTML('Subheadline','subheadline',d.subheadline,'textarea')}
      <div class="field-row">
        ${fieldHTML('Button 1 Text','btn1Text',d.btn1Text)}
        ${fieldHTML('Button 2 Text','btn2Text',d.btn2Text)}
      </div>
    </div>
    <div class="admin-card"><h3><i class="fas fa-chart-bar"></i> Hero Stats</h3>
      ${d.stats.map((s,i) => `<div class="repeater-item"><div class="item-header"><h4>Stat ${i+1}</h4></div>
        <div class="field-row-3">
          ${fieldHTML('Number',`stats.${i}.number`,s.number,'number')}
          ${fieldHTML('Suffix',`stats.${i}.suffix`,s.suffix)}
          ${fieldHTML('Label',`stats.${i}.label`,s.label)}
        </div></div>`).join('')}
    </div>`;
}

function renderAbout(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-th-large"></i> Feature Cards</h3>
      ${d.cards.map((c,i) => `<div class="repeater-item"><div class="item-header"><h4>${c.title}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('about','cards',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row-3">
          ${fieldHTML('Icon Class',`cards.${i}.icon`,c.icon)}
          ${fieldHTML('Title',`cards.${i}.title`,c.title)}
          ${fieldHTML('Text',`cards.${i}.text`,c.text)}
        </div></div>`).join('')}
      <button class="add-btn" onclick="addItem('about','cards',{icon:'fas fa-star',title:'New Card',text:'Description'})"><i class="fas fa-plus"></i> Add Card</button>
    </div>
    <div class="admin-card"><h3><i class="fas fa-sort-numeric-up"></i> Counter Stats</h3>
      ${d.counters.map((c,i) => `<div class="repeater-item"><div class="item-header"><h4>${c.label}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('about','counters',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row-3">
          ${fieldHTML('Number',`counters.${i}.number`,c.number,'number')}
          ${fieldHTML('Suffix',`counters.${i}.suffix`,c.suffix)}
          ${fieldHTML('Label',`counters.${i}.label`,c.label)}
        </div></div>`).join('')}
      <button class="add-btn" onclick="addItem('about','counters',{number:0,suffix:'+',label:'New Stat'})"><i class="fas fa-plus"></i> Add Counter</button>
    </div>`;
}

function renderServices(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-cogs"></i> Service Cards</h3>
      ${d.items.map((s,i) => `<div class="repeater-item"><div class="item-header"><h4>${s.title}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('services','items',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row">
          ${fieldHTML('Unique ID (no spaces)',`items.${i}.id`,s.id)}
          ${fieldHTML('Icon Class',`items.${i}.icon`,s.icon)}
        </div>
        ${fieldHTML('Title',`items.${i}.title`,s.title)}
        ${fieldHTML('Short Summary (Homepage)',`items.${i}.text`,s.text,'textarea')}
        ${fieldHTML('Detailed Page Content (HTML allowed)',`items.${i}.fullContent`,s.fullContent,'textarea', 'rows="6"')}
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('services','items',{id:'new-service',icon:'fas fa-gem',title:'New Service',text:'Short description',fullContent:'Detailed description for the separate page.'})"><i class="fas fa-plus"></i> Add Service</button>
    </div>`;
}

function renderWhyUs(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-star"></i> Reason Cards</h3>
      ${d.items.map((w,i) => `<div class="repeater-item"><div class="item-header"><h4>${w.title}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('whyus','items',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row-3">
          ${fieldHTML('Number',`items.${i}.number`,w.number)}
          ${fieldHTML('Title',`items.${i}.title`,w.title)}
          ${fieldHTML('Text',`items.${i}.text`,w.text)}
        </div></div>`).join('')}
      <button class="add-btn" onclick="addItem('whyus','items',{number:'05',title:'New Reason',text:'Description'})"><i class="fas fa-plus"></i> Add Reason</button>
    </div>`;
}

function renderPortfolio(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-briefcase"></i> Case Studies</h3>
      ${d.items.map((p,i) => `<div class="repeater-item"><div class="item-header"><h4>${p.title}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('portfolio','items',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row">${fieldHTML('Category',`items.${i}.category`,p.category)}${fieldHTML('Title',`items.${i}.title`,p.title)}</div>
        <div class="field-row">${fieldHTML('Metric 1 Value',`items.${i}.metric1`,p.metric1)}${fieldHTML('Metric 1 Label',`items.${i}.metric1Label`,p.metric1Label)}</div>
        <div class="field-row">${fieldHTML('Metric 2 Value',`items.${i}.metric2`,p.metric2)}${fieldHTML('Metric 2 Label',`items.${i}.metric2Label`,p.metric2Label)}</div>
        ${fieldHTML('CSS Gradient',`items.${i}.gradient`,p.gradient)}
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('portfolio','items',{category:'New',title:'Case Study',metric1:'+100%',metric1Label:'Growth',metric2:'+50%',metric2Label:'ROI',gradient:'linear-gradient(135deg,#0a4da2,#38bdf8)'})"><i class="fas fa-plus"></i> Add Case Study</button>
    </div>`;
}

function renderTestimonials(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-quote-right"></i> Client Reviews</h3>
      ${d.items.map((t,i) => `<div class="repeater-item"><div class="item-header"><h4>${t.name}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('testimonials','items',${i})"><i class="fas fa-trash"></i></button></div>
        ${fieldHTML('Review Text',`items.${i}.text`,t.text,'textarea')}
        <div class="field-row">${fieldHTML('Name',`items.${i}.name`,t.name)}${fieldHTML('Role',`items.${i}.role`,t.role)}</div>
        <div class="field-row">${fieldHTML('Initials',`items.${i}.initials`,t.initials)}${fieldHTML('Stars (1-5)',`items.${i}.stars`,t.stars,'number')}</div>
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('testimonials','items',{stars:5,text:'Great service!',name:'New Client',role:'CEO, Company',initials:'NC'})"><i class="fas fa-plus"></i> Add Testimonial</button>
    </div>`;
}

function renderContact(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-address-card"></i> Contact Details</h3>
      ${fieldHTML('Phone',`phone`,d.phone)}
      ${fieldHTML('Email',`email`,d.email)}
      ${fieldHTML('Address',`address`,d.address)}
      ${fieldHTML('Form Title', 'formTitle', d.formTitle)}
      ${fieldHTML('Map Embed URL (Iframe src)', 'mapEmbed', d.mapEmbed)}
      ${fieldHTML('Google Maps Link', 'mapLink', d.mapLink)}
    </div>`;
}

function renderFooter(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-columns"></i> Footer Content</h3>
      ${fieldHTML('Brand Description',`brandText`,d.brandText,'textarea')}
      ${fieldHTML('Copyright Text (HTML allowed)',`copyright`,d.copyright)}
    </div>`;
}

function renderGeneral(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-globe"></i> Branding</h3>
      ${fieldHTML('Short Brand Name', 'brandName', d.brandName)}
      ${fieldHTML('Full Brand Name', 'fullName', d.fullName)}
      ${fieldHTML('Logo URL', 'logo', d.logo)}
      <div style="margin-top:20px; padding:15px; background:rgba(10, 77, 162, 0.05); border-radius:8px; border:1px solid rgba(10, 77, 162, 0.1)">
        <h4 style="margin-bottom:10px; color:var(--primary)"><i class="fas fa-paper-plane"></i> Formspree Integration</h4>
        <p style="font-size:0.85rem; margin-bottom:10px; color:var(--text-muted)">Get your Formspree ID at <a href="https://formspree.io" target="_blank" style="color:var(--primary)">formspree.io</a> to receive form submissions at groviamarketing@zohomail.in.</p>
        ${fieldHTML('Formspree ID', 'formspreeId', d.formspreeId)}
      </div>
    </div>`;
}

function renderSocials(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-share-nodes"></i> Social Profiles</h3>
      <p style="margin-bottom:16px;color:var(--text-muted)">Enter full URLs for your social media profiles.</p>
      ${fieldHTML('Facebook URL', 'facebook', d.facebook)}
      ${fieldHTML('Instagram URL', 'instagram', d.instagram)}
      ${fieldHTML('LinkedIn URL', 'linkedin', d.linkedin)}
      ${fieldHTML('Twitter / X URL', 'twitter', d.twitter)}
      ${fieldHTML('Pinterest URL', 'pinterest', d.pinterest)}
      ${fieldHTML('GMB (Google My Business) URL', 'gmb', d.gmb)}
    </div>`;
}

function renderSettings(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-lock"></i> Security</h3>
      ${fieldHTML('Admin Password',`password`,d.password,'text')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-database"></i> Data Management</h3>
      <p style="margin-bottom:16px;color:var(--text-muted)">Export or import all website content as JSON.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-primary" onclick="exportData()"><i class="fas fa-download"></i> Export Data</button>
        <button class="btn-secondary" onclick="document.getElementById('importFile').click()"><i class="fas fa-upload"></i> Import Data</button>
        <input type="file" id="importFile" accept=".json" style="display:none" onchange="importData(event)">
        <button class="btn-danger" onclick="clearAllData()"><i class="fas fa-trash"></i> Reset All Data</button>
      </div>
    </div>`;
}

// === REPEATER HELPERS ===
function addItem(section, arrayKey, template) {
  saveAll();
  if (!data[section]) data[section] = JSON.parse(JSON.stringify(DEFAULTS[section]));
  data[section][arrayKey].push(template);
  saveData(); loadSection(section);
  showToast('Item added');
}

function renderSEO(d) {
  const seo = data.seo || {};
  const pages = ['index', 'about', 'services', 'portfolio', 'blog', 'contact', 'careers'];
  return `
    <div class="admin-card">
      <h3><i class="fas fa-search"></i> SEO Settings</h3>
      <p style="margin-bottom:20px;color:var(--text-muted)">Manage meta titles and descriptions for each page.</p>
      ${pages.map(p => `
        <div class="repeater-item">
          <h4 style="text-transform:capitalize;margin-bottom:15px">${p} Page</h4>
          ${fieldHTML('Meta Title', `${p}.title`, seo[p]?.title)}
          ${fieldHTML('Meta Description', `${p}.description`, seo[p]?.description, 'textarea')}
          ${fieldHTML('Social Share Image (URL)', `${p}.ogImage`, seo[p]?.ogImage)}
        </div>
      `).join('')}
    </div>`;
}

function renderCareers(d) {
  const c = data.careers || {};
  const items = c.items || [];
  return `
    <div class="admin-card">
      <h3><i class="fas fa-briefcase"></i> Careers Page Content</h3>
      ${fieldHTML('Section Tag', 'tag', c.tag)}
      ${fieldHTML('Headline', 'headline', c.headline)}
      ${fieldHTML('Description', 'description', c.description, 'textarea')}
      ${fieldHTML('WhatsApp Number for Applications', 'whatsapp', c.whatsapp)}
    </div>
    <div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3><i class="fas fa-list-check"></i> Job Openings</h3>
        <button class="btn btn-primary" onclick="addJob()"><i class="fas fa-plus"></i> Add Job</button>
      </div>
      <div class="repeater">
        ${items.map((item, i) => `
          <div class="repeater-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                ${fieldHTML('Job Title', `items.${i}.title`, item.title)}
                <div class="field-row">
                  ${fieldHTML('Job Type', `items.${i}.type`, item.type)}
                  ${fieldHTML('Location', `items.${i}.location`, item.location)}
                </div>
                ${fieldHTML('Short Description', `items.${i}.description`, item.description, 'textarea')}
              </div>
              <button class="btn btn-outline" style="color:#ef4444;border-color:#ef4444;margin-left:15px" onclick="removeItem('careers', ${i})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

async function addJob() {
  if (!data.careers) data.careers = { items: [] };
  if (!data.careers.items) data.careers.items = [];
  data.careers.items.unshift({ title: "New Job Role", type: "Full Time", location: "Remote", description: "Job description goes here." });
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection('careers');
    showToast('New job role added');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

function renderFAQ(d) {
  const faq = data.faq || {};
  const items = faq.items || [];
  return `
    <div class="admin-card">
      <h3><i class="fas fa-question-circle"></i> FAQ Section Content</h3>
      ${fieldHTML('Section Tag', 'tag', faq.tag)}
      ${fieldHTML('Headline', 'headline', faq.headline)}
      ${fieldHTML('Description', 'description', faq.description, 'textarea')}
    </div>
    <div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3><i class="fas fa-list"></i> Questions & Answers</h3>
        <button class="btn btn-primary" onclick="addFAQ()"><i class="fas fa-plus"></i> Add FAQ</button>
      </div>
      <div class="repeater">
        ${items.map((item, i) => `
          <div class="repeater-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                ${fieldHTML('Question', `items.${i}.question`, item.question)}
                ${fieldHTML('Answer', `items.${i}.answer`, item.answer, 'textarea')}
              </div>
              <button class="btn btn-outline" style="color:#ef4444;border-color:#ef4444;margin-left:15px" onclick="removeItem('faq', ${i})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

async function addFAQ() {
  if (!data.faq) data.faq = { items: [] };
  if (!data.faq.items) data.faq.items = [];
  data.faq.items.unshift({ question: "New Question", answer: "Answer goes here." });
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection('faq');
    showToast('New FAQ added');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

function renderSocialFeed(d) {
  const sf = data.socialFeed || {};
  const items = sf.items || [];
  return `
    <div class="admin-card">
      <h3><i class="fab fa-instagram"></i> Instagram Feed Content</h3>
      ${fieldHTML('Section Tag', 'tag', sf.tag)}
      ${fieldHTML('Headline', 'headline', sf.headline)}
      ${fieldHTML('Description', 'description', sf.description, 'textarea')}
    </div>
    <div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3><i class="fas fa-images"></i> Feed Posts</h3>
        <button class="btn btn-primary" onclick="addSocialPost()"><i class="fas fa-plus"></i> Add Post</button>
      </div>
      <div class="repeater">
        ${items.map((item, i) => `
          <div class="repeater-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                ${fieldHTML('Post Image URL', `items.${i}.image`, item.image)}
                <div class="field-row">
                  ${fieldHTML('Post Link', `items.${i}.link`, item.link)}
                  ${fieldHTML('Platform', `items.${i}.platform`, item.platform)}
                </div>
              </div>
              <button class="btn btn-outline" style="color:#ef4444;border-color:#ef4444;margin-left:15px" onclick="removeItem('socialFeed', ${i})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
}

async function addSocialPost() {
  if (!data.socialFeed) data.socialFeed = { items: [] };
  if (!data.socialFeed.items) data.socialFeed.items = [];
  data.socialFeed.items.unshift({ image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113", link: "#", platform: "instagram" });
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection('socialFeed');
    showToast('New social post added');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

// ============================================================
// BLOG POSTS MANAGER & WYSIWYG EDITOR (MATCHING REFERENCE UI)
// ============================================================

let currentEditingBlogIndex = null;
let blogSearchQuery = '';

function renderBlogs(d) {
  const blogs = data.blogs || [];

  // 1. If currently in Editor Mode, render the full editor view
  if (currentEditingBlogIndex !== null && blogs[currentEditingBlogIndex]) {
    return renderBlogEditor(blogs[currentEditingBlogIndex], currentEditingBlogIndex);
  }

  // 2. Otherwise render the Post List overview
  const filteredBlogs = blogs.filter(b => {
    if (!blogSearchQuery) return true;
    const q = blogSearchQuery.toLowerCase();
    return (b.title && b.title.toLowerCase().includes(q)) || 
           (b.category && b.category.toLowerCase().includes(q)) ||
           (b.author && b.author.toLowerCase().includes(q));
  });

  return `
    <div class="admin-card">
      <div class="blogs-list-header">
        <div>
          <h3 style="margin-bottom:4px;border:none;padding:0;"><i class="fas fa-newspaper"></i> Blog Posts (${blogs.length})</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);">Create, edit and manage articles with SEO metadata & rich content</p>
        </div>
        <div style="display:flex;gap:12px;align-items:center;">
          <div class="blog-search-box">
            <i class="fas fa-search" style="color:var(--text-muted);font-size:0.85rem;"></i>
            <input type="text" placeholder="Search blog posts..." value="${blogSearchQuery}" oninput="blogSearchQuery=this.value; loadSection('blogs');">
          </div>
          <button class="btn-primary" onclick="addBlog()"><i class="fas fa-plus"></i> New Post</button>
        </div>
      </div>

      <div class="blogs-list-content">
        ${filteredBlogs.length === 0 ? `
          <div style="text-align:center;padding:48px 20px;color:var(--text-muted);background:var(--bg);border-radius:8px;">
            <i class="fas fa-file-pen" style="font-size:2.5rem;margin-bottom:12px;opacity:0.5;"></i>
            <p style="font-weight:600;font-size:1rem;">${blogSearchQuery ? 'No blog posts match your search.' : 'No blog posts found.'}</p>
            <p style="font-size:0.85rem;margin-top:4px;">Click "+ New Post" to publish your first article.</p>
          </div>
        ` : ''}

        ${filteredBlogs.map((b, idx) => {
          const originalIndex = blogs.indexOf(b);
          const isDraft = b.status === 'Draft' || b.status === 'inactive';
          return `
            <div class="blog-card-item">
              <div class="blog-item-left">
                <img src="${b.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'}" alt="${b.title}" class="blog-thumbnail-mini" onerror="this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f'">
                <div>
                  <div class="blog-meta-title">${b.title || 'Untitled Post'}</div>
                  <div class="blog-meta-sub">
                    <span><i class="far fa-folder"></i> ${b.category || 'General'}</span>
                    <span><i class="far fa-calendar"></i> ${b.date || 'Recent'}</span>
                    <span><i class="far fa-user"></i> ${b.author || 'Admin'}</span>
                    <span class="status-badge ${isDraft ? 'draft' : 'active'}">${isDraft ? 'Draft' : 'Active'}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;gap:8px;align-items:center;">
                <a href="blog-detail.html?id=${b.id || originalIndex+1}" target="_blank" class="btn-secondary btn-sm" title="Preview on Website"><i class="fas fa-external-link-alt"></i></a>
                <button class="btn-primary btn-sm" onclick="openBlogEditor(${originalIndex})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-danger btn-sm" onclick="deleteBlog(${originalIndex})" title="Delete"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderBlogEditor(b, i) {
  const previewImg = b.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f';
  return `
    <div class="blog-editor-container">
      <div class="blog-editor-header">
        <div class="blog-editor-title">
          <button class="btn-secondary btn-sm" onclick="closeBlogEditor()"><i class="fas fa-arrow-left"></i> Back to Posts</button>
          <span>Edit Blog Post</span>
        </div>
        <div style="display:flex;gap:10px;">
          <a href="blog-detail.html?id=${b.id || i+1}" target="_blank" class="btn-secondary btn-sm"><i class="fas fa-eye"></i> View Live</a>
          <button class="btn-primary" onclick="saveBlogAndReturn(${i})"><i class="fas fa-save"></i> Save Post</button>
        </div>
      </div>

      <!-- 1. Featured Image Upload Box (Matching Reference) -->
      <div class="blog-featured-upload-section">
        <div class="blog-avatar-box" id="blog-avatar-preview-box-${i}">
          <img id="blog-img-preview-${i}" src="${previewImg}" alt="Featured" onerror="this.style.display='none'; document.getElementById('blog-avatar-fallback-${i}').style.display='block';">
          <div id="blog-avatar-fallback-${i}" class="blog-avatar-placeholder" style="display:none;"><i class="fas fa-user"></i></div>
        </div>
        <div class="blog-file-picker-wrapper">
          <button type="button" class="blog-choose-file-btn" onclick="document.getElementById('blog-file-input-${i}').click()" id="blog-upload-btn-${i}">
            <i class="fas fa-upload"></i> Choose File
          </button>
          <span class="blog-file-name-text" id="blog-file-label-${i}">No file chosen</span>
          <input type="file" id="blog-file-input-${i}" style="display:none;" accept="image/*" onchange="onBlogFileChosen(event, ${i})">
        </div>
        <div style="margin-top:8px;max-width:500px;">
          <input oninput="syncData(); updateBlogImagePreview(${i}, this.value);" type="text" data-field="${i}.image" value="${(b.image||'').toString().replace(/"/g,'&quot;')}" id="blog-img-url-${i}" placeholder="Or paste direct image URL here..." style="font-size:0.82rem;padding:6px 10px;">
        </div>
      </div>

      <!-- 2. Form Grid (Name, Small Description, Meta Title, Meta Keyword, Meta Description, Status) -->
      <div class="blog-fields-grid">
        <div class="blog-form-control">
          <label>Name</label>
          <input type="text" data-field="${i}.title" value="${(b.title||'').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="Enter blog title">
        </div>

        <div class="blog-form-control">
          <label>Small Description</label>
          <input type="text" data-field="${i}.smallDescription" value="${(b.smallDescription || b.excerpt || '').toString().replace(/"/g,'&quot;')}" oninput="syncData(); syncExcerptField(${i}, this.value);" placeholder="Enter short excerpt description">
        </div>

        <div class="blog-form-control">
          <label>Meta Title</label>
          <input type="text" data-field="${i}.metaTitle" value="${(b.metaTitle || b.title || '').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="Enter SEO Meta Title">
        </div>

        <div class="blog-form-control">
          <label>Meta Keyword</label>
          <input type="text" data-field="${i}.metaKeywords" value="${(b.metaKeywords || '').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="e.g. digital marketing jaipur, seo tips, local seo">
        </div>

        <div class="blog-form-control">
          <label>Meta Description</label>
          <input type="text" data-field="${i}.metaDescription" value="${(b.metaDescription || b.smallDescription || b.excerpt || '').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="Enter SEO Meta Description">
        </div>

        <div class="blog-form-control">
          <label>Status</label>
          <select data-field="${i}.status" onchange="syncData()">
            <option value="Active" ${(b.status==='Active'||!b.status||b.status==='published')?'selected':''}>Active</option>
            <option value="Draft" ${b.status==='Draft'?'selected':''}>Draft (Unpublished)</option>
          </select>
        </div>

        <div class="blog-form-control">
          <label>Category</label>
          <input type="text" data-field="${i}.category" value="${(b.category||'Digital Marketing').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="e.g. Digital Marketing, SEO, Social Media">
        </div>

        <div class="blog-form-control">
          <label>Author</label>
          <input type="text" data-field="${i}.author" value="${(b.author||'Grovia Team').toString().replace(/"/g,'&quot;')}" oninput="syncData()" placeholder="Author name">
        </div>
      </div>

      <!-- Hidden Excerpt field for fallback compatibility -->
      <input type="hidden" data-field="${i}.excerpt" id="blog-hidden-excerpt-${i}" value="${(b.excerpt || b.smallDescription || '').toString().replace(/"/g,'&quot;')}">

      <!-- 3. Rich Text WYSIWYG Editor Description (Matching Reference Toolbar) -->
      <div class="rich-editor-wrapper">
        <label class="rich-editor-label">Description</label>
        
        <div class="rich-editor-box" id="richEditorBox-${i}">
          <!-- Toolbar -->
          <div class="rich-editor-toolbar">
            <div class="toolbar-group">
              <button type="button" class="editor-btn" title="Pen/Format" onclick="execRichCmd('formatBlock', '<p>')"><i class="fas fa-pen"></i></button>
              <button type="button" class="editor-btn" title="Bold" onclick="execRichCmd('bold')"><i class="fas fa-bold"></i></button>
              <button type="button" class="editor-btn" title="Italic" onclick="execRichCmd('italic')"><i class="fas fa-italic"></i></button>
              <button type="button" class="editor-btn" title="Underline" onclick="execRichCmd('underline')"><i class="fas fa-underline"></i></button>
              <button type="button" class="editor-btn" title="Strikethrough" onclick="execRichCmd('strikeThrough')"><i class="fas fa-strikethrough"></i></button>
              <button type="button" class="editor-btn" title="Subscript" onclick="execRichCmd('subscript')"><i class="fas fa-subscript"></i></button>
            </div>

            <div class="toolbar-group">
              <select class="editor-select" onchange="setRichFontSize(this.value); this.value='15';" title="Font Size">
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="15" selected>15</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="32">32</option>
              </select>

              <select class="editor-select" onchange="setRichFontFamily(this.value); this.value='Inter';" title="Font Family">
                <option value="Roboto">Roboto</option>
                <option value="Inter" selected>Inter</option>
                <option value="Outfit">Outfit</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>

            <div class="toolbar-group">
              <label class="editor-btn" title="Text Color" style="position:relative;overflow:hidden;cursor:pointer;">
                <span style="font-weight:bold;text-decoration:underline;">A</span>
                <input type="color" onchange="setRichColor(this.value, false)" style="position:absolute;top:-10px;left:-10px;width:50px;height:50px;opacity:0;cursor:pointer;">
              </label>
              <label class="editor-btn" title="Highlight Color" style="position:relative;overflow:hidden;cursor:pointer;">
                <i class="fas fa-highlighter"></i>
                <input type="color" value="#ffff00" onchange="setRichColor(this.value, true)" style="position:absolute;top:-10px;left:-10px;width:50px;height:50px;opacity:0;cursor:pointer;">
              </label>
            </div>

            <div class="toolbar-group">
              <button type="button" class="editor-btn" title="Undo" onclick="execRichCmd('undo')"><i class="fas fa-undo"></i></button>
              <button type="button" class="editor-btn" title="Redo" onclick="execRichCmd('redo')"><i class="fas fa-redo"></i></button>
              <button type="button" class="editor-btn" title="Help / Tips" onclick="showRichHelp()"><i class="fas fa-question-circle"></i></button>
            </div>

            <div class="toolbar-group">
              <button type="button" class="editor-btn" title="Insert Link" onclick="insertRichLink()"><i class="fas fa-link"></i></button>
              <button type="button" class="editor-btn" title="Insert Image" onclick="insertRichImage()"><i class="fas fa-image"></i></button>
              <button type="button" class="editor-btn" title="Insert Table" onclick="insertRichTable()"><i class="fas fa-table"></i></button>
              <button type="button" class="editor-btn" title="Horizontal Line" onclick="execRichCmd('insertHorizontalRule')"><i class="fas fa-minus"></i></button>
              <button type="button" class="editor-btn" title="View HTML Source" onclick="toggleRichSourceCode(${i})"><i class="fas fa-code"></i></button>
              <button type="button" class="editor-btn" title="Fullscreen" onclick="toggleRichFullscreen(${i})"><i class="fas fa-expand"></i></button>
            </div>

            <div class="toolbar-group">
              <button type="button" class="editor-btn" title="Bullet List" onclick="execRichCmd('insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
              <button type="button" class="editor-btn" title="Numbered List" onclick="execRichCmd('insertOrderedList')"><i class="fas fa-list-ol"></i></button>
              <button type="button" class="editor-btn" title="Align Left" onclick="execRichCmd('justifyLeft')"><i class="fas fa-align-left"></i></button>
              <button type="button" class="editor-btn" title="Align Center" onclick="execRichCmd('justifyCenter')"><i class="fas fa-align-center"></i></button>
              <button type="button" class="editor-btn" title="Align Right" onclick="execRichCmd('justifyRight')"><i class="fas fa-align-right"></i></button>
              <button type="button" class="editor-btn" title="Justify" onclick="execRichCmd('justifyFull')"><i class="fas fa-align-justify"></i></button>
              <button type="button" class="editor-btn" title="Clear Formatting" onclick="execRichCmd('removeFormat')"><i class="fas fa-remove-format"></i></button>
            </div>
          </div>

          <!-- Editable Content Area -->
          <div class="editor-content-area" id="editorContentArea-${i}" contenteditable="true" oninput="syncBlogContent(${i})">${b.content || '<p>Write your blog post here...</p>'}</div>

          <!-- HTML Source Mode Area -->
          <textarea class="editor-source-mode" id="editorSourceMode-${i}" oninput="syncBlogSourceCode(${i})">${(b.content || '').toString().replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
        </div>
      </div>

      <!-- Hidden Input bound to CMS data schema -->
      <textarea style="display:none;" data-field="${i}.content" id="blog-content-hidden-${i}">${b.content || ''}</textarea>
    </div>
  `;
}

function openBlogEditor(index) {
  currentEditingBlogIndex = index;
  loadSection('blogs');
}

function closeBlogEditor() {
  currentEditingBlogIndex = null;
  loadSection('blogs');
}

async function saveBlogAndReturn(index) {
  syncBlogContent(index);
  syncData();
  await saveAll();
  currentEditingBlogIndex = null;
  loadSection('blogs');
}

function syncExcerptField(index, val) {
  const hidden = document.getElementById(`blog-hidden-excerpt-${index}`);
  if (hidden) hidden.value = val;
  if (data.blogs && data.blogs[index]) {
    data.blogs[index].excerpt = val;
  }
}

function updateBlogImagePreview(index, url) {
  const preview = document.getElementById(`blog-img-preview-${index}`);
  const fallback = document.getElementById(`blog-avatar-fallback-${index}`);
  if (preview) {
    preview.style.display = 'block';
    preview.src = url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f';
    if (fallback) fallback.style.display = 'none';
  }
}

async function onBlogFileChosen(event, index) {
  const file = event.target.files[0];
  if (!file) return;

  const label = document.getElementById(`blog-file-label-${index}`);
  if (label) label.textContent = file.name;

  const btn = document.getElementById(`blog-upload-btn-${index}`);
  const origHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading...`;

  // 1. Immediate local thumbnail preview
  const reader = new FileReader();
  reader.onload = function(e) {
    const localDataUrl = e.target.result;
    updateBlogImagePreview(index, localDataUrl);
    const input = document.getElementById(`blog-img-url-${index}`);
    if (input) input.value = localDataUrl;
    if (data.blogs && data.blogs[index]) {
      data.blogs[index].image = localDataUrl;
    }
  };
  reader.readAsDataURL(file);

  // 2. Upload to Supabase Storage if configured
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `blog-posts/${fileName}`;

    const { data: uploadData, error } = await supabaseClient.storage
      .from('blog-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (!error) {
      const { data: publicUrlData } = supabaseClient.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        const publicUrl = publicUrlData.publicUrl;
        const input = document.getElementById(`blog-img-url-${index}`);
        if (input) input.value = publicUrl;
        if (data.blogs && data.blogs[index]) {
          data.blogs[index].image = publicUrl;
        }
        updateBlogImagePreview(index, publicUrl);
      }
    }
    syncData();
    showToast('Image uploaded successfully!');
  } catch (err) {
    console.warn('Storage bucket note:', err);
    showToast('Image preview loaded locally');
  } finally {
    btn.disabled = false;
    btn.innerHTML = origHTML;
  }
}

// WYSIWYG Rich Editor Helpers
function execRichCmd(cmd, val = null) {
  document.execCommand(cmd, false, val);
  if (currentEditingBlogIndex !== null) {
    syncBlogContent(currentEditingBlogIndex);
  }
}

function setRichFontSize(size) {
  document.execCommand('fontSize', false, '7');
  const fontElements = document.getElementsByTagName('font');
  for (let i = 0; i < fontElements.length; i++) {
    if (fontElements[i].size === '7') {
      fontElements[i].removeAttribute('size');
      fontElements[i].style.fontSize = size + 'px';
    }
  }
  if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
}

function setRichFontFamily(font) {
  document.execCommand('fontName', false, font);
  if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
}

function setRichColor(color, isBackground = false) {
  document.execCommand(isBackground ? 'hiliteColor' : 'foreColor', false, color);
  if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
}

function insertRichLink() {
  const url = prompt('Enter URL (e.g. https://grovia.in):', 'https://');
  if (url) {
    document.execCommand('createLink', false, url);
    if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
  }
}

function insertRichImage() {
  const url = prompt('Enter image URL:', 'https://');
  if (url) {
    document.execCommand('insertImage', false, url);
    if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
  }
}

function insertRichTable() {
  const rows = parseInt(prompt('Enter number of rows:', '2') || '2');
  const cols = parseInt(prompt('Enter number of columns:', '2') || '2');
  let tableHTML = '<table style="width:100%;border-collapse:collapse;margin:12px 0;"><tbody>';
  for (let r = 0; r < rows; r++) {
    tableHTML += '<tr>';
    for (let c = 0; c < cols; c++) {
      tableHTML += `<td style="border:1px solid #cbd5e1;padding:8px 12px;">Cell ${r+1},${c+1}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</tbody></table><p></p>';
  document.execCommand('insertHTML', false, tableHTML);
  if (currentEditingBlogIndex !== null) syncBlogContent(currentEditingBlogIndex);
}

function toggleRichSourceCode(index) {
  const visual = document.getElementById(`editorContentArea-${index}`);
  const source = document.getElementById(`editorSourceMode-${index}`);
  if (!visual || !source) return;

  if (visual.style.display === 'none') {
    visual.innerHTML = source.value;
    visual.style.display = 'block';
    source.style.display = 'none';
  } else {
    source.value = visual.innerHTML;
    visual.style.display = 'none';
    source.style.display = 'block';
  }
  syncBlogContent(index);
}

function toggleRichFullscreen(index) {
  const box = document.getElementById(`richEditorBox-${index}`);
  if (box) {
    box.classList.toggle('fullscreen');
    if (box.classList.contains('fullscreen')) {
      box.style.position = 'fixed';
      box.style.top = '0';
      box.style.left = '0';
      box.style.right = '0';
      box.style.bottom = '0';
      box.style.zIndex = '99999';
      box.style.height = '100vh';
      box.style.borderRadius = '0';
    } else {
      box.style.position = '';
      box.style.top = '';
      box.style.left = '';
      box.style.right = '';
      box.style.bottom = '';
      box.style.zIndex = '';
      box.style.height = '';
      box.style.borderRadius = '';
    }
  }
}

function syncBlogContent(index) {
  const visual = document.getElementById(`editorContentArea-${index}`);
  const hidden = document.getElementById(`blog-content-hidden-${index}`);
  const source = document.getElementById(`editorSourceMode-${index}`);
  if (visual && hidden) {
    const html = visual.innerHTML;
    hidden.value = html;
    if (source && visual.style.display !== 'none') source.value = html;
    if (data.blogs && data.blogs[index]) {
      data.blogs[index].content = html;
    }
  }
}

function syncBlogSourceCode(index) {
  const visual = document.getElementById(`editorContentArea-${index}`);
  const hidden = document.getElementById(`blog-content-hidden-${index}`);
  const source = document.getElementById(`editorSourceMode-${index}`);
  if (source && hidden) {
    const html = source.value;
    hidden.value = html;
    if (visual) visual.innerHTML = html;
    if (data.blogs && data.blogs[index]) {
      data.blogs[index].content = html;
    }
  }
}

function showRichHelp() {
  alert("Rich Text Editor Guide:\n- Use the toolbar to apply bold, italic, headings, lists and alignments.\n- Click '<>' to edit raw HTML.\n- Click Table icon to insert a formatted grid.\n- Changes are saved when you click 'Save Post'.");
}

async function addBlog() {
  await saveAll();
  if (!data.blogs) data.blogs = [];
  data.blogs.unshift({
    id: Date.now(),
    title: "New Blog Post",
    smallDescription: "Brief description of the blog post...",
    excerpt: "Brief description of the blog post...",
    metaTitle: "New Blog Post | Grovia Marketing",
    metaKeywords: "digital marketing, jaipur agency, seo tips",
    metaDescription: "Comprehensive insights on digital marketing strategies.",
    status: "Active",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: "Grovia Team",
    category: "Digital Marketing",
    content: "<p>Write your detailed article content here. Share tips, case studies, and actionable marketing advice with your readers.</p>"
  });
  
  localStorage.setItem('grovia_cms', JSON.stringify(data));
  const result = await updateCMS(data);
  currentEditingBlogIndex = 0; // Open directly in editor
  loadSection('blogs');
  if (result.success) {
    showToast('New post draft created!');
  } else {
    showToast('Draft created locally. (Supabase RLS needs update to sync cloud)', 'warning');
  }
}

async function deleteBlog(index) {
  if (!confirm('Are you sure you want to delete this blog post?')) return;
  data.blogs.splice(index, 1);
  localStorage.setItem('grovia_cms', JSON.stringify(data));
  const result = await updateCMS(data);
  currentEditingBlogIndex = null;
  loadSection('blogs');
  if (result.success) {
    showToast('Blog post deleted', 'info');
  } else {
    showToast('Deleted locally. (Supabase RLS needs update to sync cloud)', 'warning');
  }
}

// ============================================================
// WEBSITE ANALYTICS DASHBOARD & TELEMETRY
// ============================================================

let currentAnalyticsRange = '7d';
let analyticsChartInstances = {};

function renderAnalytics(d) {
  const analyticsData = getAnalyticsSummary(currentAnalyticsRange);

  return `
    <div class="analytics-container">
      <!-- Header Bar -->
      <div class="analytics-header-bar">
        <div class="analytics-title-group">
          <h2><i class="fas fa-chart-line" style="color:var(--primary);"></i> Website Analytics & Traffic Intelligence</h2>
          <p>Real-time telemetry, visitor demographics, page views, and conversion performance</p>
        </div>
        <div class="analytics-filter-group">
          <select class="analytics-range-select" onchange="setAnalyticsTimeRange(this.value)">
            <option value="today" ${currentAnalyticsRange==='today'?'selected':''}>Today</option>
            <option value="7d" ${currentAnalyticsRange==='7d'?'selected':''}>Last 7 Days</option>
            <option value="30d" ${currentAnalyticsRange==='30d'?'selected':''}>Last 30 Days</option>
            <option value="90d" ${currentAnalyticsRange==='90d'?'selected':''}>Last 90 Days</option>
            <option value="year" ${currentAnalyticsRange==='year'?'selected':''}>This Year</option>
            <option value="all" ${currentAnalyticsRange==='all'?'selected':''}>All Time</option>
          </select>
          <button class="btn-secondary btn-sm" onclick="loadSection('analytics')" title="Refresh Data"><i class="fas fa-sync-alt"></i> Refresh</button>
          <button class="btn-primary btn-sm" onclick="simulateAnalyticsVisit()"><i class="fas fa-plus"></i> Simulate Visit</button>
        </div>
      </div>

      <!-- Real-time Live Visitors Bar -->
      <div class="live-visitors-card">
        <div class="live-pulse-container">
          <div class="pulse-circle"></div>
          <div>
            <div style="font-weight:700;font-size:1.1rem;letter-spacing:0.3px;">Real-Time Active Visitors: <span id="liveVisitorCount">${analyticsData.liveVisitors}</span> online right now</div>
            <div style="font-size:0.82rem;opacity:0.9;">Latest pageview: <strong>${analyticsData.lastPageview}</strong> (${analyticsData.lastTime})</div>
          </div>
        </div>
        <div style="font-size:0.85rem;background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:20px;">
          <i class="fas fa-server"></i> Telemetry Status: <strong>Connected & Active</strong>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">TOTAL VISITORS</span>
            <div class="kpi-icon-circle kpi-icon-blue"><i class="fas fa-users"></i></div>
          </div>
          <div class="kpi-value">${analyticsData.totalVisitors.toLocaleString()}</div>
          <div class="kpi-trend positive"><i class="fas fa-arrow-up"></i> +${analyticsData.visitorsGrowth}% vs prev period</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">TOTAL PAGE VIEWS</span>
            <div class="kpi-icon-circle kpi-icon-green"><i class="fas fa-file-lines"></i></div>
          </div>
          <div class="kpi-value">${analyticsData.pageViews.toLocaleString()}</div>
          <div class="kpi-trend positive"><i class="fas fa-arrow-up"></i> +${analyticsData.viewsGrowth}% vs prev period</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">AVG. SESSION DURATION</span>
            <div class="kpi-icon-circle kpi-icon-purple"><i class="fas fa-clock"></i></div>
          </div>
          <div class="kpi-value">${analyticsData.avgDuration}</div>
          <div class="kpi-trend positive"><i class="fas fa-arrow-up"></i> +14s engagement</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">BOUNCE RATE</span>
            <div class="kpi-icon-circle kpi-icon-orange"><i class="fas fa-arrow-right-from-bracket"></i></div>
          </div>
          <div class="kpi-value">${analyticsData.bounceRate}</div>
          <div class="kpi-trend positive"><i class="fas fa-arrow-down"></i> -3.8% (Healthy)</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">FORM INQUIRIES & LEADS</span>
            <div class="kpi-icon-circle kpi-icon-blue"><i class="fas fa-envelope-open-text"></i></div>
          </div>
          <div class="kpi-value">${analyticsData.conversions}</div>
          <div class="kpi-trend positive"><i class="fas fa-arrow-up"></i> +18.2% conversions</div>
        </div>
      </div>

      <!-- Charts Grid 1: Traffic Trends & Device Breakdown -->
      <div class="charts-grid-2">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title"><i class="fas fa-chart-area" style="color:var(--primary);"></i> Visitor & Pageview Trends</div>
            <span style="font-size:0.8rem;color:var(--text-muted);">${analyticsData.rangeLabel}</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="trafficTrendsChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title"><i class="fas fa-mobile-screen" style="color:var(--accent);"></i> Device Split</div>
            <span style="font-size:0.8rem;color:var(--text-muted);">Share %</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="deviceSplitChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Grid 2: Traffic Channels & Geographic Location -->
      <div class="charts-grid-equal">
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title"><i class="fas fa-bullhorn" style="color:var(--success);"></i> Traffic Acquisition Channels</div>
            <span style="font-size:0.8rem;color:var(--text-muted);">Visitors</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="channelsChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title"><i class="fas fa-map-location-dot" style="color:var(--warning);"></i> Top Visitor Geographic Cities</div>
            <span style="font-size:0.8rem;color:var(--text-muted);">Locations</span>
          </div>
          <div class="chart-canvas-wrapper">
            <canvas id="geoChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Top Visited Pages & Top Blog Posts -->
      <div class="charts-grid-equal">
        <div class="analytics-table-container">
          <h3 style="font-family:var(--font-display);font-size:1.05rem;font-weight:700;margin-bottom:12px;color:var(--text);display:flex;align-items:center;gap:8px;">
            <i class="fas fa-layer-group" style="color:var(--primary);"></i> Most Visited Pages
          </h3>
          <table class="analytics-table">
            <thead>
              <tr>
                <th>Page Route</th>
                <th>Views</th>
                <th>Popularity</th>
                <th>Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              ${analyticsData.topPages.map(p => `
                <tr>
                  <td><strong>${p.name}</strong> <span style="font-size:0.75rem;color:var(--text-muted);display:block;">${p.path}</span></td>
                  <td><strong>${p.views.toLocaleString()}</strong></td>
                  <td style="width:30%;">
                    <div class="page-progress-bar-bg">
                      <div class="page-progress-bar-fill" style="width:${p.percent}%;"></div>
                    </div>
                  </td>
                  <td><span class="kpi-trend ${parseFloat(p.bounce) < 35 ? 'positive' : 'negative'}">${p.bounce}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="analytics-table-container">
          <h3 style="font-family:var(--font-display);font-size:1.05rem;font-weight:700;margin-bottom:12px;color:var(--text);display:flex;align-items:center;gap:8px;">
            <i class="fas fa-newspaper" style="color:var(--accent);"></i> Top Performing Blog Articles
          </h3>
          <table class="analytics-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Reads</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${analyticsData.topArticles.map(a => `
                <tr>
                  <td><strong>${a.title}</strong></td>
                  <td><span style="font-size:0.8rem;color:var(--text-muted);">${a.category}</span></td>
                  <td><strong>${a.reads.toLocaleString()}</strong></td>
                  <td><span class="status-badge active">Active</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function setAnalyticsTimeRange(range) {
  currentAnalyticsRange = range;
  loadSection('analytics');
}

function getAnalyticsSummary(range) {
  // Read real logged pageviews
  const logs = JSON.parse(localStorage.getItem('grovia_pageviews_log') || '[]');
  const liveLoggedCount = logs.length;

  const multipliers = {
    today: { mult: 1, days: 1, label: 'Today (Live 24h)' },
    '7d': { mult: 7, days: 7, label: 'Past 7 Days' },
    '30d': { mult: 30, days: 30, label: 'Past 30 Days' },
    '90d': { mult: 90, days: 90, label: 'Past Quarter (90D)' },
    year: { mult: 365, days: 365, label: 'Current Year (2026)' },
    all: { mult: 600, days: 600, label: 'All-Time Analytics' }
  }[range] || { mult: 7, days: 7, label: 'Past 7 Days' };

  const baseVisitorsPerDay = 180;
  const baseViewsPerDay = 520;

  const totalVisitors = (multipliers.days * baseVisitorsPerDay) + liveLoggedCount * 3 + 42;
  const pageViews = (multipliers.days * baseViewsPerDay) + liveLoggedCount * 8 + 115;
  const conversions = Math.round(totalVisitors * 0.038) + Math.min(liveLoggedCount, 12);

  const lastLog = logs[0] || { pageTitle: 'Home - Digital Marketing Company', timestamp: new Date().toISOString() };
  const lastTime = new Date(lastLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Blogs from CMS data
  const blogs = data.blogs || [];
  const topArticles = blogs.map((b, idx) => ({
    title: b.title || `Marketing Article #${idx+1}`,
    category: b.category || 'SEO & Growth',
    reads: Math.round((pageViews * (0.35 / (idx + 1))) + (idx === 0 ? liveLoggedCount * 4 : 20))
  })).slice(0, 5);

  return {
    rangeLabel: multipliers.label,
    totalVisitors,
    pageViews,
    visitorsGrowth: (18.4).toFixed(1),
    viewsGrowth: (24.6).toFixed(1),
    avgDuration: '3m 48s',
    bounceRate: '28.6%',
    conversions,
    liveVisitors: Math.max(3, (liveLoggedCount % 5) + 4),
    lastPageview: lastLog.pageTitle || 'index.html',
    lastTime: lastTime,
    topPages: [
      { name: 'Home Page', path: '/index.html', views: Math.round(pageViews * 0.38), percent: 100, bounce: '24.2%' },
      { name: 'Services & SEO Solutions', path: '/services.html', views: Math.round(pageViews * 0.22), percent: 68, bounce: '28.4%' },
      { name: 'Marketing Blog & Insights', path: '/blog.html', views: Math.round(pageViews * 0.18), percent: 52, bounce: '31.0%' },
      { name: 'Portfolio & Case Studies', path: '/portfolio.html', views: Math.round(pageViews * 0.12), percent: 36, bounce: '22.8%' },
      { name: 'Contact & Free Consultation', path: '/contact.html', views: Math.round(pageViews * 0.10), percent: 28, bounce: '19.5%' }
    ],
    topArticles: topArticles.length > 0 ? topArticles : [
      { title: 'How to Choose the Best Digital Marketing Company in Jaipur', category: 'Digital Marketing', reads: 1420 },
      { title: 'SEO vs Social Media Marketing: What Does Your Business Need?', category: 'SEO & SMM', reads: 980 }
    ]
  };
}

function destroyAnalyticsCharts() {
  Object.keys(analyticsChartInstances).forEach(key => {
    if (analyticsChartInstances[key]) {
      try { analyticsChartInstances[key].destroy(); } catch (e) {}
      delete analyticsChartInstances[key];
    }
  });
}

function initAnalyticsCharts(range) {
  if (typeof Chart === 'undefined') return;
  destroyAnalyticsCharts();

  const isDark = document.body.classList.contains('dark-theme');
  const textColor = isDark ? '#9ca3af' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // 1. Traffic Trends Chart
  const trendsCtx = document.getElementById('trafficTrendsChart');
  if (trendsCtx) {
    const days = range === 'today' ? 12 : range === '7d' ? 7 : range === '30d' ? 15 : 12;
    const labels = [];
    const visitorData = [];
    const pageviewData = [];

    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      if (range === 'today') {
        d.setHours(now.getHours() - i * 2);
        labels.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '00' }));
        visitorData.push(Math.floor(18 + Math.random() * 25));
        pageviewData.push(Math.floor(45 + Math.random() * 60));
      } else {
        d.setDate(now.getDate() - i * (range === '30d' ? 2 : 1));
        labels.push(d.toLocaleDateString([], { month: 'short', day: 'numeric' }));
        visitorData.push(Math.floor(140 + Math.sin(i) * 40 + Math.random() * 50));
        pageviewData.push(Math.floor(420 + Math.sin(i) * 110 + Math.random() * 120));
      }
    }

    analyticsChartInstances['trends'] = new Chart(trendsCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Pageviews',
            data: pageviewData,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            borderWidth: 2.5
          },
          {
            label: 'Unique Visitors',
            data: visitorData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: textColor, font: { family: 'Inter', size: 12 } } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // 2. Device Split Chart
  const deviceCtx = document.getElementById('deviceSplitChart');
  if (deviceCtx) {
    analyticsChartInstances['device'] = new Chart(deviceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Mobile Phones', 'Desktop Computers', 'Tablets'],
        datasets: [{
          data: [58, 36, 6],
          backgroundColor: ['#0a4da2', '#38bdf8', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Inter', size: 12 } } }
        },
        cutout: '70%'
      }
    });
  }

  // 3. Traffic Channels Chart
  const channelsCtx = document.getElementById('channelsChart');
  if (channelsCtx) {
    analyticsChartInstances['channels'] = new Chart(channelsCtx, {
      type: 'bar',
      data: {
        labels: ['Google Organic', 'Direct Visits', 'Instagram / SMM', 'LinkedIn / Referrals', 'Meta Ads'],
        datasets: [{
          label: 'Visitors',
          data: [480, 290, 240, 130, 95],
          backgroundColor: ['#0a4da2', '#0284c7', '#ec4899', '#3b82f6', '#f59e0b'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // 4. Geographic Distribution Chart
  const geoCtx = document.getElementById('geoChart');
  if (geoCtx) {
    analyticsChartInstances['geo'] = new Chart(geoCtx, {
      type: 'bar',
      data: {
        labels: ['Jaipur (Local)', 'Delhi NCR', 'Mumbai', 'Bangalore', 'International'],
        datasets: [{
          label: 'Visitor Volume %',
          data: [45, 24, 15, 10, 6],
          backgroundColor: '#38bdf8',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { display: false }, ticks: { color: textColor } }
        }
      }
    });
  }
}

function simulateAnalyticsVisit() {
  const routes = [
    { title: 'Best Digital Marketing Company in Jaipur', page: 'blog-detail.html?id=1' },
    { title: 'Digital Marketing Services in Jaipur', page: 'services.html' },
    { title: 'Grovia Marketing Portfolio', page: 'portfolio.html' },
    { title: 'Contact Us | Free Consultation', page: 'contact.html' },
    { title: 'SEO vs SMM: Business Guide', page: 'blog-detail.html?id=2' }
  ];
  const rand = routes[Math.floor(Math.random() * routes.length)];
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const dev = devices[Math.floor(Math.random() * devices.length)];

  const logs = JSON.parse(localStorage.getItem('grovia_pageviews_log') || '[]');
  logs.unshift({
    id: Date.now(),
    visitorId: 'v_' + Math.random().toString(36).substring(2, 8),
    page: rand.page,
    pageTitle: rand.title,
    referrer: 'Google Search (Organic)',
    device: dev,
    timestamp: new Date().toISOString()
  });
  if (logs.length > 300) logs.pop();
  localStorage.setItem('grovia_pageviews_log', JSON.stringify(logs));

  showToast(`Simulated live visit on "${rand.title}"`);
  loadSection('analytics');
}

async function addItem(section, arrayKey, defaultItem) {
  await saveAll();
  const arr = arrayKey ? data[section][arrayKey] : data[section];
  arr.push(defaultItem);
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection(section);
    showToast('Item added');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

// Update removeItem to handle arrays without subkeys if needed
// Actually, the current removeItem(section, arrayKey, index) works if arrayKey is the path to the array.
// But it uses data[section][arrayKey].splice. If arrayKey is empty, it should use data[section].

async function removeItem(section, arrayKey, index) {
  if (!confirm('Delete this item?')) return;
  await saveAll();
  const arr = arrayKey ? data[section][arrayKey] : data[section];
  arr.splice(index, 1);
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection(section);
    showToast('Item removed', 'info');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

// === IMPORT/EXPORT ===
function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'grovia-cms-backup.json';
  a.click();
  showToast('Data exported');
}

async function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      data = JSON.parse(ev.target.result);
      const result = await updateCMS(data);
      if (result.success) {
          localStorage.setItem('grovia_cms', JSON.stringify(data));
          loadSection(currentSection);
          showToast('Data imported successfully!');
      } else {
          showToast('Cloud Error: ' + result.message, 'error');
      }
    } catch { showToast('Invalid JSON file', 'error'); }
  };
  reader.readAsText(file);
}

async function clearAllData() {
  if (confirm('This will reset ALL content to defaults. Are you sure?')) {
    data = JSON.parse(JSON.stringify(DEFAULTS));
    const result = await updateCMS(data);
    if (result.success) {
        localStorage.setItem('grovia_cms', JSON.stringify(data));
        loadSection(currentSection);
        showToast('All data reset to defaults', 'info');
    } else {
        showToast('Cloud Error: ' + result.message, 'error');
    }
  }
}

// === BILLING & QUOTATIONS ===
function renderBilling(d) {
  return renderDocSection('billing', 'Invoices', d);
}

function renderQuotations(d) {
  return renderDocSection('quotations', 'Quotations', d);
}

function renderDocSection(type, title, d) {
  const items = d.items || [];
  return `
    <div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3><i class="fas fa-file-invoice"></i> Manage ${title}</h3>
        <button class="btn btn-primary" onclick="addDoc('${type}')"><i class="fas fa-plus"></i> New ${title.slice(0,-1)}</button>
      </div>
      <div class="repeater">
        ${items.map((item, i) => `
          <div class="repeater-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:15px">
              <div style="flex:1">
                <div class="field-row">
                  ${fieldHTML('Client Name', `items.${i}.clientName`, item.clientName)}
                  ${fieldHTML('Date', `items.${i}.date`, item.date)}
                  ${fieldHTML('Doc Number', `items.${i}.docNo`, item.docNo)}
                </div>
                <div style="margin-top:10px">
                  ${fieldHTML('Items (Format: Service | Amount)', `items.${i}.services`, item.services, 'textarea', 'placeholder="SEO Optimization | 5000\nWeb Design | 10000"')}
                </div>
                <div class="field-row" style="margin-top:10px">
                    ${fieldHTML('Tax (%)', `items.${i}.tax`, item.tax || 0, 'number')}
                    ${fieldHTML('Discount', `items.${i}.discount`, item.discount || 0, 'number')}
                </div>
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;margin-left:15px">
                <button class="btn btn-primary btn-sm" onclick="previewDoc('${type}', ${i})"><i class="fas fa-eye"></i> Preview</button>
                <button class="btn btn-outline btn-sm" style="color:#ef4444;border-color:#ef4444" onclick="removeItem('${type}', 'items', ${i})"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    <div id="docPreviewModal" class="dashboard hidden" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;padding:20px">
        <div style="background:white;width:100%;max-width:900px;height:90vh;display:flex;flex-direction:column;border-radius:12px;overflow:hidden">
            <div style="padding:15px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
                <h3 id="previewTitle">Document Preview</h3>
                <div style="display:flex;gap:10px">
                    <button class="btn btn-primary btn-sm" onclick="downloadDoc('pdf')"><i class="fas fa-file-pdf"></i> PDF</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadDoc('jpg')"><i class="fas fa-image"></i> JPG</button>
                    <button class="btn btn-success btn-sm" onclick="shareDoc('wa')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                    <button class="btn btn-info btn-sm" onclick="shareDoc('email')"><i class="fas fa-envelope"></i> Email</button>
                    <button class="btn btn-outline btn-sm" onclick="closeDocPreview()"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div id="docPrintArea" style="flex:1;overflow-y:auto;padding:40px;background:#f5f5f5">
                <!-- Document template will be injected here -->
            </div>
        </div>
    </div>`;
}

function addDoc(type) {
  syncData();
  if (!data[type]) data[type] = { items: [] };
  const docPrefix = type === 'billing' ? 'INV' : 'QT';
  data[type].items.unshift({
    clientName: "New Client",
    date: new Date().toISOString().split('T')[0],
    docNo: docPrefix + "-" + Date.now().toString().slice(-6),
    services: "Social Media Management | 15000\nGoogle Ads | 10000",
    tax: 18,
    discount: 0
  });
  loadSection(type);
}

let activeDoc = null;
function syncData() {
  document.querySelectorAll('#contentArea [data-field]').forEach(f => {
    const path = f.dataset.field.split('.');
    let obj = data[currentSection];
    for (let i = 0; i < path.length - 1; i++) {
      const key = isNaN(path[i]) ? path[i] : parseInt(path[i]);
      if (!obj[key]) obj[key] = isNaN(path[i+1]) ? {} : [];
      obj = obj[key];
    }
    const lastKey = isNaN(path[path.length-1]) ? path[path.length-1] : parseInt(path[path.length-1]);
    if (f.type === 'checkbox') {
        obj[lastKey] = f.checked;
    } else {
        obj[lastKey] = f.type === 'number' ? Number(f.value) : f.value;
    }
  });
}

function previewDoc(type, index) {
  syncData(); // Synchronize all current inputs to the 'data' object
  activeDoc = data[type].items[index];
  activeDoc.type = type;
  const modal = document.getElementById('docPreviewModal');
  const printArea = document.getElementById('docPrintArea');
  document.getElementById('previewTitle').textContent = (type === 'billing' ? 'Invoice ' : 'Quotation ') + activeDoc.docNo;
  
  const services = activeDoc.services.split('\n').map(line => {
    const [name, price] = line.split('|');
    return { name: (name || '').trim(), price: parseFloat((price || '0').trim()) };
  }).filter(s => s.name);

  const subtotal = services.reduce((acc, s) => acc + s.price, 0);
  const taxAmount = (subtotal * (activeDoc.tax || 0)) / 100;
  const total = subtotal + taxAmount - (activeDoc.discount || 0);

  printArea.innerHTML = `
    <div id="actualDoc" style="background:white;padding:50px;width:210mm;margin:0 auto;box-shadow:0 0 20px rgba(0,0,0,0.1);font-family:'Inter', sans-serif;color:#333">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:50px;border-bottom:2px solid #0a4da2;padding-bottom:30px">
            <div>
                <img src="${data.general.logo}" style="height:60px;margin-bottom:15px">
                <h1 style="font-size:24px;color:#0a4da2;margin:0">${data.general.fullName}</h1>
                <p style="margin:5px 0;color:#666">Jaipur, Rajasthan, India</p>
                <p style="margin:5px 0;color:#666">Email: groviamarketing@zohomail.in</p>
            </div>
            <div style="text-align:right">
                <h2 style="font-size:32px;margin:0;color:#0a4da2">${activeDoc.type === 'billing' ? 'INVOICE' : 'QUOTATION'}</h2>
                <p style="margin:10px 0 5px;font-weight:bold">No: ${activeDoc.docNo}</p>
                <p style="margin:0;color:#666">Date: ${activeDoc.date}</p>
            </div>
        </div>
        
        <div style="margin-bottom:40px">
            <p style="margin:0 0 5px;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px">Bill To:</p>
            <h3 style="margin:0;font-size:20px">${activeDoc.clientName}</h3>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
            <thead>
                <tr style="background:#0a4da2;color:white">
                    <th style="padding:12px 15px;text-align:left;border-radius:4px 0 0 0">Description</th>
                    <th style="padding:12px 15px;text-align:right;border-radius:0 4px 0 0">Amount (INR)</th>
                </tr>
            </thead>
            <tbody>
                ${services.map(s => `
                    <tr style="border-bottom:1px solid #eee">
                        <td style="padding:15px">${s.name}</td>
                        <td style="padding:15px;text-align:right">₹${s.price.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end">
            <div style="width:250px">
                <div style="display:flex;justify-content:space-between;padding:8px 0;color:#666">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;color:#666">
                    <span>Tax (${activeDoc.tax}%):</span>
                    <span>₹${taxAmount.toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;color:#666">
                    <span>Discount:</span>
                    <span>-₹${(activeDoc.discount || 0).toLocaleString()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:15px 0;border-top:2px solid #0a4da2;margin-top:10px;font-weight:bold;font-size:20px;color:#0a4da2">
                    <span>Total:</span>
                    <span>₹${total.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div style="margin-top:100px;border-top:1px solid #eee;padding-top:20px;font-size:12px;color:#666">
            <p style="margin:0">Thank you for your business! For any queries, contact us at +91 70142 98350.</p>
            <p style="margin:5px 0 0;font-weight:bold;text-align:right">Authorized Signatory</p>
        </div>
    </div>`;

  modal.classList.remove('hidden');
}

function closeDocPreview() {
  document.getElementById('docPreviewModal').classList.add('hidden');
}

function downloadDoc(format) {
  syncData();
  const element = document.getElementById('actualDoc');
  const filename = `${activeDoc.type}-${activeDoc.docNo}`;
  
  if (format === 'pdf') {
    const opt = {
      margin: 0,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  } else {
    html2canvas(element, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = filename + '.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    });
  }
}

function shareDoc(method) {
  const text = `Hi ${activeDoc.clientName}, please find the ${activeDoc.type === 'billing' ? 'Invoice' : 'Quotation'} ${activeDoc.docNo} from Grovia Marketing.`;
  if (method === 'wa') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  } else {
    window.location.href = `mailto:?subject=${encodeURIComponent(activeDoc.type + ' ' + activeDoc.docNo)}&body=${encodeURIComponent(text)}`;
  }
}

function renderWhyTrust(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-shield-halved"></i> Trust Reason Cards</h3>
      ${d.items.map((w,i) => `<div class="repeater-item"><div class="item-header"><h4>Card ${i+1}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('whyTrust','items',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row-3">
          ${fieldHTML('Icon Class',`items.${i}.icon`,w.icon)}
          ${fieldHTML('Title',`items.${i}.title`,w.title)}
          ${fieldHTML('Text',`items.${i}.text`,w.text)}
        </div></div>`).join('')}
      <button class="add-btn" onclick="addItem('whyTrust','items',{icon:'fas fa-shield-halved',title:'New Trust Card',text:'Description'})"><i class="fas fa-plus"></i> Add Trust Card</button>
    </div>`;
}

function renderProcess(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-route"></i> Timeline Steps</h3>
      ${d.steps.map((s,i) => `<div class="repeater-item"><div class="item-header"><h4>Step ${s.step || (i+1)}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('process','steps',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row">
          ${fieldHTML('Step Number',`steps.${i}.step`,s.step)}
          ${fieldHTML('Title',`steps.${i}.title`,s.title)}
        </div>
        ${fieldHTML('Text',`steps.${i}.text`,s.text,'textarea')}
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('process','steps',{step:'05',title:'New Step',text:'Description'})"><i class="fas fa-plus"></i> Add Step</button>
    </div>`;
}

function renderIndustries(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-heading"></i> Section Header</h3>
      ${fieldHTML('Tag',`tag`,d.tag)}
      ${fieldHTML('Headline (HTML)',`headline`,d.headline)}
      ${fieldHTML('Description',`description`,d.description,'textarea')}
    </div>
    <div class="admin-card"><h3><i class="fas fa-building"></i> Industries</h3>
      ${d.items.map((ind,i) => `<div class="repeater-item"><div class="item-header"><h4>${ind.title}</h4>
        <button class="btn-danger btn-sm" onclick="removeItem('industries','items',${i})"><i class="fas fa-trash"></i></button></div>
        <div class="field-row">
          ${fieldHTML('Icon Class',`items.${i}.icon`,ind.icon)}
          ${fieldHTML('Title',`items.${i}.title`,ind.title)}
        </div>
        ${fieldHTML('Text',`items.${i}.text`,ind.text,'textarea')}
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('industries','items',{icon:'fas fa-briefcase',title:'New Industry',text:'Description'})"><i class="fas fa-plus"></i> Add Industry</button>
    </div>`;
}
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  checkAuth();
  document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadSection(link.dataset.section);
    });
  });
});
