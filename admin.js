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
  await supabaseClient.auth.signOut();
  location.reload();
}

async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    await loadData();
    loadSection('hero');
  }
}

// Check auth on load
document.addEventListener('DOMContentLoaded', checkAuth);

// === TOAST ===
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// === SAVE ===
async function saveAll() {
  const section = currentSection;
  const fields = document.querySelectorAll('[data-field]');
  fields.forEach(f => {
    const path = f.dataset.field.split('.');
    let obj = data[section];
    if (!obj) { data[section] = JSON.parse(JSON.stringify(DEFAULTS[section])); obj = data[section]; }
    for (let i = 0; i < path.length - 1; i++) {
      const key = isNaN(path[i]) ? path[i] : parseInt(path[i]);
      obj = obj[key];
    }
    const lastKey = isNaN(path[path.length-1]) ? path[path.length-1] : parseInt(path[path.length-1]);
    if (f.type === 'checkbox') {
        obj[lastKey] = f.checked;
    } else {
        obj[lastKey] = f.type === 'number' ? Number(f.value) : f.value;
    }
  });
  
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    showToast('Changes saved to cloud successfully!');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
}

async function resetSection() {
  if (confirm('Reset this section to defaults?')) {
    data[currentSection] = JSON.parse(JSON.stringify(DEFAULTS[currentSection]));
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
  document.getElementById('sectionTitle').textContent = {
    hero:'Hero Section', about:'About', services:'Services', whyus:'Why Choose Us',
    portfolio:'Portfolio', testimonials:'Testimonials', contact:'Contact', footer:'Footer',
    general: 'General Settings', navigation: 'Menu Visibility', socials: 'Social Media', settings:'Security', blogs: 'Blog Posts',
    seo: 'SEO Settings', careers: 'Careers Page', faq: 'FAQ Section', socialFeed: 'Instagram Feed',
    billing: 'Billing & Invoices', quotations: 'Quotations', audit: 'Audit Section'
  }[section];
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.section === section));
  const area = document.getElementById('contentArea');
  const d = getData(section);
  if (!data[section]) data[section] = JSON.parse(JSON.stringify(d));

  const renderers = {
    hero: renderHero, about: renderAbout, services: renderServices, whyus: renderWhyUs,
    portfolio: renderPortfolio, testimonials: renderTestimonials, contact: renderContact,
    footer: renderFooter, settings: renderSettings, general: renderGeneral, socials: renderSocials,
    blogs: renderBlogs, seo: renderSEO, careers: renderCareers, faq: renderFAQ, socialFeed: renderSocialFeed,
    navigation: renderNavigation, billing: renderBilling, quotations: renderQuotations, audit: renderAudit
  };
  area.innerHTML = renderers[section] ? renderers[section](d) : '<p>Section not found</p>';
}

function fieldHTML(label, fieldPath, value, type='text', extra='') {
  if (type === 'textarea') return `<div class="field-group"><label>${label}</label><textarea data-field="${fieldPath}" rows="3" ${extra}>${value||''}</textarea></div>`;
  if (type === 'checkbox') return `
    <div class="field-group" style="flex-direction:row; align-items:center; gap:10px; margin-bottom:10px;">
      <input type="checkbox" data-field="${fieldPath}" ${value ? 'checked' : ''} style="width:auto; margin:0;">
      <label style="margin:0; cursor:pointer;">${label}</label>
    </div>`;
  return `<div class="field-group"><label>${label}</label><input type="${type}" data-field="${fieldPath}" value="${(value||'').toString().replace(/"/g,'&quot;')}" ${extra}></div>`;
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

function renderBlogs(d) {
  const blogs = data.blogs || [];
  return `
    <div class="admin-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3><i class="fas fa-newspaper"></i> Manage Blog Posts</h3>
        <button class="btn-primary btn-sm" onclick="addBlog()"><i class="fas fa-plus"></i> New Post</button>
      </div>
      <div class="blogs-list">
        ${blogs.length === 0 ? '<p>No blog posts found. Create your first post!</p>' : ''}
        ${blogs.map((b, i) => `
          <div class="repeater-item">
            <div class="item-header">
              <h4>${b.title}</h4>
              <div style="display:flex;gap:8px">
                <button class="btn-danger btn-sm" onclick="removeItem('blogs','',${i})"><i class="fas fa-trash"></i></button>
              </div>
            </div>
            <div class="field-row">
              ${fieldHTML('Title', `${i}.title`, b.title)}
              ${fieldHTML('Category', `${i}.category`, b.category)}
            </div>
            <div class="field-row">
              ${fieldHTML('Date', `${i}.date`, b.date)}
              ${fieldHTML('Author', `${i}.author`, b.author)}
            </div>
            ${fieldHTML('Image URL', `${i}.image`, b.image)}
            ${fieldHTML('Excerpt', `${i}.excerpt`, b.excerpt, 'textarea')}
            ${fieldHTML('Full Content (HTML allowed)', `${i}.content`, b.content, 'textarea', 'rows="10"')}
          </div>
        `).join('')}
      </div>
    </div>`;
}

async function addBlog() {
  await saveAll();
  if (!data.blogs) data.blogs = [];
  data.blogs.unshift({
    id: Date.now(),
    title: "New Blog Post",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: "Admin",
    category: "General",
    excerpt: "Summary of the post...",
    content: "Full content goes here..."
  });
  const result = await updateCMS(data);
  if (result.success) {
    localStorage.setItem('grovia_cms', JSON.stringify(data));
    loadSection('blogs');
    showToast('New blog post added!');
  } else {
    showToast('Cloud Error: ' + result.message, 'error');
  }
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
