// === DEFAULT DATA ===
const DEFAULTS = {
  hero: {
    badge: "#1 Digital Marketing Agency",
    headline: 'Grow <span class="gradient-text">Smarter</span> with<br>Grovia Marketing',
    subheadline: "We craft data-driven digital strategies that amplify your brand, accelerate growth, and deliver measurable results. Transform your online presence with our expert team.",
    btn1Text: "Get Started", btn2Text: "View Services",
    stats: [
      { number: 150, suffix: "+", label: "Happy Clients" },
      { number: 300, suffix: "+", label: "Projects Done" },
      { number: 98, suffix: "%", label: "Success Rate" }
    ]
  },
  about: {
    tag: "Who We Are",
    headline: 'Real People Delivering <span class="gradient-text">Real Results</span>',
    description: "We are a dynamic marketing agency blending cutting-edge technology with creative expertise to shape unparalleled digital experiences.",
    cards: [
      { icon: "fas fa-lightbulb", title: "Innovation First", text: "We stay ahead of trends, leveraging the latest tools and technologies to give your brand a competitive edge in the digital landscape." },
      { icon: "fas fa-palette", title: "Creative Excellence", text: "Our team of creative minds crafts compelling narratives and stunning visuals that captivate audiences and drive engagement." },
      { icon: "fas fa-chart-line", title: "Data-Driven", text: "Every strategy is backed by analytics and insights, ensuring your marketing budget delivers maximum ROI and measurable growth." }
    ],
    counters: [
      { number: 150, suffix: "+", label: "Clients Served" },
      { number: 500, suffix: "+", label: "Campaigns Launched" },
      { number: 3, suffix: "x", label: "Avg. ROI Increase" },
      { number: 12, suffix: "+", label: "Years Experience" }
    ]
  },
  services: {
    tag: "Our Services",
    headline: 'Solutions That <span class="gradient-text">Drive Growth</span>',
    description: "From strategy to execution, we provide end-to-end digital marketing solutions tailored to your business goals.",
    items: [
      { icon: "fas fa-search", title: "SEO Optimization", text: "Dominate search rankings with our proven SEO strategies. We optimize every aspect of your online presence for maximum visibility." },
      { icon: "fas fa-bullseye", title: "PPC Advertising", text: "Maximize your ad spend with targeted pay-per-click campaigns that deliver instant traffic, qualified leads, and measurable conversions." },
      { icon: "fas fa-share-nodes", title: "Social Media Marketing", text: "Build a thriving community and amplify your brand voice across all major social platforms with engaging content strategies." },
      { icon: "fas fa-pen-nib", title: "Content Marketing", text: "Captivate your audience with compelling content that tells your story, establishes authority, and drives organic engagement." },
      { icon: "fas fa-wand-magic-sparkles", title: "Branding & Identity", text: "Create a distinctive brand identity that resonates with your target audience and sets you apart from the competition." },
      { icon: "fas fa-code", title: "Web Development", text: "Build stunning, high-performance websites that convert visitors into customers with modern design and seamless functionality." }
    ]
  },
  whyus: {
    tag: "Why Grovia",
    headline: 'Why Brands <span class="gradient-text">Choose Us</span>',
    description: "We combine strategy, creativity, and technology to deliver results that exceed expectations.",
    items: [
      { number: "01", title: "Proven Results", text: "Our track record speaks for itself—consistent growth, higher conversions, and measurable ROI for every client we serve." },
      { number: "02", title: "Expert Strategists", text: "Highly qualified specialists with deep expertise in digital marketing, certified across all major platforms and tools." },
      { number: "03", title: "Custom Solutions", text: "No cookie-cutter approaches. We craft personalized strategies that align with your unique business goals and budget." },
      { number: "04", title: "24/7 Support", text: "Round-the-clock assistance ensures quick and reliable solutions to all your queries, providing unmatched support anytime." }
    ]
  },
  portfolio: {
    tag: "Our Work",
    headline: 'Featured <span class="gradient-text">Case Studies</span>',
    description: "Real results from real campaigns. See how we've helped brands grow their digital presence.",
    items: [
      { category: "SEO Campaign", title: "E-Commerce Growth", metric1: "+340%", metric1Label: "Traffic", metric2: "+180%", metric2Label: "Revenue", gradient: "linear-gradient(135deg, #0a4da2, #38bdf8)" },
      { category: "Social Media", title: "Brand Awareness", metric1: "+500%", metric1Label: "Reach", metric2: "+250%", metric2Label: "Engagement", gradient: "linear-gradient(135deg, #1e3a6e, #60a5fa)" },
      { category: "PPC Campaign", title: "Lead Generation", metric1: "+220%", metric1Label: "Leads", metric2: "-40%", metric2Label: "CPA", gradient: "linear-gradient(135deg, #0f4c81, #7dd3fc)" },
      { category: "Branding", title: "Startup Launch", metric1: "50K+", metric1Label: "Impressions", metric2: "+300%", metric2Label: "Followers", gradient: "linear-gradient(135deg, #1a365d, #93c5fd)" }
    ]
  },
  testimonials: {
    tag: "Testimonials",
    headline: 'What Our <span class="gradient-text">Clients Say</span>',
    description: "Hear from the businesses we've helped transform and grow.",
    items: [
      { stars: 5, text: "Grovia Marketing transformed our online presence completely. Our organic traffic increased by 340% in just 6 months. Their SEO expertise is unmatched!", name: "Rahul Kumar", role: "CEO, TechStart India", initials: "RK" },
      { stars: 5, text: "The social media campaigns they created were phenomenal. Our brand engagement skyrocketed and we saw a real impact on our bottom line. Highly recommend!", name: "Priya Sharma", role: "Founder, StyleHive", initials: "PS" },
      { stars: 5, text: "Working with Grovia was a game-changer. Their data-driven approach to PPC reduced our cost per acquisition by 40% while doubling our lead volume.", name: "Arjun Mehta", role: "Director, CloudNine Solutions", initials: "AM" },
      { stars: 5, text: "Exceptional branding work! They captured our vision perfectly and delivered a brand identity that truly resonates with our target market. Outstanding creativity.", name: "Neha Kapoor", role: "MD, GreenLeaf Organics", initials: "NK" }
    ]
  },
  contact: {
    tag: "Get In Touch",
    headline: 'Let\'s Build Something <span class="gradient-text">Amazing</span>',
    description: "Ready to take your digital presence to the next level? Get in touch for a free strategy consultation.",
    phone: "+91 90018 18495", email: "hello@groviamarketing.com", address: "Jaipur, Rajasthan, India",
    formTitle: "Get Free Strategy Call"
  },
  footer: {
    brandText: "Empowering brands with innovative digital marketing solutions that drive real, measurable growth.",
    copyright: "© 2026 Grovia Marketing. All rights reserved."
  },
  settings: { password: "grovia2026" }
};

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
    portfolio:'Portfolio', testimonials:'Testimonials', contact:'Contact', footer:'Footer', settings:'Settings'
  }[section];
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.section === section));
  const area = document.getElementById('contentArea');
  const d = getData(section);
  if (!data[section]) data[section] = JSON.parse(JSON.stringify(d));

  const renderers = { hero: renderHero, about: renderAbout, services: renderServices, whyus: renderWhyUs, portfolio: renderPortfolio, testimonials: renderTestimonials, contact: renderContact, footer: renderFooter, settings: renderSettings };
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
      ${fieldHTML('Form Title',`formTitle`,d.formTitle)}
    </div>`;
}

function renderFooter(d) {
  return `
    <div class="admin-card"><h3><i class="fas fa-columns"></i> Footer Content</h3>
      ${fieldHTML('Brand Description',`brandText`,d.brandText,'textarea')}
      ${fieldHTML('Copyright Text',`copyright`,d.copyright)}
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

function removeItem(section, arrayKey, index) {
  if (!confirm('Delete this item?')) return;
  saveAll();
  data[section][arrayKey].splice(index, 1);
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
