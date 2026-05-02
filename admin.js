// DEFAULTS moved to defaults.js

// === STATE ===
let data = {};
let currentSection = 'hero';

function loadData() {
  const saved = localStorage.getItem('grovia_cms');
  data = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULTS));
}
function saveData() { localStorage.setItem('grovia_cms', JSON.stringify(data)); }
function getData(section) { return data[section] || DEFAULTS[section]; }

// === AUTH ===
function attemptLogin() {
  const pw = document.getElementById('loginPassword').value;
  const correctPw = getData('settings').password || 'grovia2026';
  if (pw === correctPw) {
    sessionStorage.setItem('grovia_auth', '1');
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadSection('hero');
  } else { showToast('Incorrect password', 'error'); }
}
function logout() { sessionStorage.removeItem('grovia_auth'); location.reload(); }
function checkAuth() {
  if (sessionStorage.getItem('grovia_auth') === '1') {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadSection('hero');
  }
}

// === TOAST ===
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// === SAVE ===
function saveAll() {
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
    obj[lastKey] = f.type === 'number' ? Number(f.value) : f.value;
  });
  saveData();
  showToast('Changes saved successfully!');
}

function resetSection() {
  if (confirm('Reset this section to defaults?')) {
    data[currentSection] = JSON.parse(JSON.stringify(DEFAULTS[currentSection]));
    saveData();
    loadSection(currentSection);
    showToast('Section reset to defaults', 'info');
  }
}

// === RENDER SECTIONS ===
function loadSection(section) {
  currentSection = section;
  document.getElementById('sectionTitle').textContent = {
    hero:'Hero Section', about:'About', services:'Services', whyus:'Why Choose Us',
    portfolio:'Portfolio', testimonials:'Testimonials', contact:'Contact', footer:'Footer',
    general: 'General Settings', socials: 'Social Media', settings:'Security', blogs: 'Blog Posts',
    seo: 'SEO Settings', careers: 'Careers Page', faq: 'FAQ Section', socialFeed: 'Instagram Feed'
  }[section];
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.section === section));
  const area = document.getElementById('contentArea');
  const d = getData(section);
  if (!data[section]) data[section] = JSON.parse(JSON.stringify(d));

  const renderers = {
    hero: renderHero, about: renderAbout, services: renderServices, whyus: renderWhyUs,
    portfolio: renderPortfolio, testimonials: renderTestimonials, contact: renderContact,
    footer: renderFooter, settings: renderSettings, general: renderGeneral, socials: renderSocials,
    blogs: renderBlogs, seo: renderSEO, careers: renderCareers, faq: renderFAQ, socialFeed: renderSocialFeed
  };
  area.innerHTML = renderers[section] ? renderers[section](d) : '<p>Section not found</p>';
}

function fieldHTML(label, fieldPath, value, type='text', extra='') {
  if (type === 'textarea') return `<div class="field-group"><label>${label}</label><textarea data-field="${fieldPath}" rows="3" ${extra}>${value||''}</textarea></div>`;
  return `<div class="field-group"><label>${label}</label><input type="${type}" data-field="${fieldPath}" value="${(value||'').toString().replace(/"/g,'&quot;')}" ${extra}></div>`;
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
        ${fieldHTML('Icon Class',`items.${i}.icon`,s.icon)}
        ${fieldHTML('Title',`items.${i}.title`,s.title)}
        ${fieldHTML('Description',`items.${i}.text`,s.text,'textarea')}
      </div>`).join('')}
      <button class="add-btn" onclick="addItem('services','items',{icon:'fas fa-gem',title:'New Service',text:'Description here'})"><i class="fas fa-plus"></i> Add Service</button>
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

function addJob() {
  if (!data.careers) data.careers = { items: [] };
  if (!data.careers.items) data.careers.items = [];
  data.careers.items.unshift({ title: "New Job Role", type: "Full Time", location: "Remote", description: "Job description goes here." });
  loadSection('careers');
  showToast('New job role added');
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

function addFAQ() {
  if (!data.faq) data.faq = { items: [] };
  if (!data.faq.items) data.faq.items = [];
  data.faq.items.unshift({ question: "New Question", answer: "Answer goes here." });
  loadSection('faq');
  showToast('New FAQ added');
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

function addSocialPost() {
  if (!data.socialFeed) data.socialFeed = { items: [] };
  if (!data.socialFeed.items) data.socialFeed.items = [];
  data.socialFeed.items.unshift({ image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113", link: "#", platform: "instagram" });
  loadSection('socialFeed');
  showToast('New social post added');
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

function addBlog() {
  saveAll();
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
  saveData();
  loadSection('blogs');
  showToast('New blog post added!');
}

// Update removeItem to handle arrays without subkeys if needed
// Actually, the current removeItem(section, arrayKey, index) works if arrayKey is the path to the array.
// But it uses data[section][arrayKey].splice. If arrayKey is empty, it should use data[section].

function removeItem(section, arrayKey, index) {
  if (!confirm('Delete this item?')) return;
  saveAll();
  const arr = arrayKey ? data[section][arrayKey] : data[section];
  arr.splice(index, 1);
  saveData(); loadSection(section);
  showToast('Item removed', 'info');
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

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      data = JSON.parse(ev.target.result);
      saveData(); loadSection(currentSection);
      showToast('Data imported successfully!');
    } catch { showToast('Invalid JSON file', 'error'); }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (confirm('This will reset ALL content to defaults. Are you sure?')) {
    localStorage.removeItem('grovia_cms');
    data = JSON.parse(JSON.stringify(DEFAULTS));
    loadSection(currentSection);
    showToast('All data reset to defaults', 'info');
  }
}

// === INIT ===
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
