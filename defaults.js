const DEFAULTS = {
  general: {
    brandName: "Grovia",
    fullName: "Grovia Marketing",
    logo: "logo.jpeg",
    formspreeId: "xvonzvze"
  },
  navigation: {
    about: true,
    services: true,
    portfolio: true,
    blog: true,
    careers: true,
    contact: true,
    audit: true
  },
  socials: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    twitter: "#",
    pinterest: "#",
    gmb: "#"
  },
  hero: {
    badge: "#1 Digital Marketing Agency in Jaipur",
    headline: 'Grovia - Trusted Digital marketing company in Jaipur',
    subheadline: 'Grovia is a digital marketing company in Jaipur offering customised digital marketing services as per your business type and budget. Our services include SEO, social media marketing, Google ads and Meta ads, website development, branding, content writing and many more services to help your business grow online. Looking for trusted digital marketing company in jaipur? Contact us today and tell us about your requirements. We will work together to provide you with the best digital marketing solutions according to your business needs.',
    btn1Text: "Get Started",
    btn2Text: "View Services",
    stats: [
      { number: 150, suffix: "+", label: "Happy Clients" },
      { number: 300, suffix: "+", label: "Projects Done" },
      { number: 98, suffix: "%", label: "Success Rate" }
    ]
  },
  whyTrust: {
    tag: "Why Trust Grovia",
    headline: 'Credibility Built on <span class="gradient-text">Performance & Transparency</span>',
    description: "We don't just promise results; we hold ourselves accountable. Here is why leading companies trust us with their growth.",
    items: [
      { icon: "fas fa-sliders", title: "Customised Solutions", text: "Tailored digital marketing strategies crafted specifically for your business model and budget." },
      { icon: "fas fa-handshake", title: "Affordable Prices", text: "No rigid packages. We discuss your unique requirements and provide flexible pricing options." },
      { icon: "fas fa-chart-line", title: "Result-Driven Work", text: "Focused on organic traffic, visibility, and high-quality lead generation for long-term growth." },
      { icon: "fas fa-shield-halved", title: "Complete Agency Services", text: "End-to-end expertise in SEO, SMM, Meta/Google Ads, Web Dev, Content, WhatsApp & Email marketing." }
    ]
  },
  about: {
    tag: "About Grovia",
    headline: 'Helping Businesses Grow Their <span class="gradient-text">Online Presence</span>',
    description: "Grovia is a digital marketing company in jaipur helping businesses grow their business and make their presence on search engines and social platforms through our customized digital marketing services in jaipur. Our digital marketing agency in jaipur works with start ups, local businesses and growing brands as per their budgets and business needs. We focus on strong online presence and long term growth of business.",
    cards: [
      { icon: "fas fa-rocket", title: "For Startups & Local Brands", text: "We work closely with startups, local businesses, and growing brands tailored to their specific budgets." },
      { icon: "fas fa-bullseye", title: "Customized Growth Plans", text: "No generic templates. Every strategy is designed around your unique business goals and audience." },
      { icon: "fas fa-chart-pie", title: "Long-Term Growth Focus", text: "We prioritize building a sustained online presence that drives continuous traffic, leads, and sales." }
    ],
    counters: [
      { number: 150, suffix: "+", label: "Clients Served" },
      { number: 500, suffix: "+", label: "Campaigns Launched" },
      { number: 3, suffix: "x", label: "Avg. ROI Increase" },
      { number: 100, suffix: "%", label: "Client Commitment" }
    ]
  },
  services: {
    tag: "Our Services",
    headline: 'Customised Digital Marketing <span class="gradient-text">Services</span>',
    description: "If you are searching for the best digital marketing services in Jaipur for your business within your budget then get in touch with us today and discuss your requirements with us.",
    items: [
      {
        id: "seo",
        icon: "fas fa-search",
        title: "Search Engine Optimization (SEO)",
        text: "Want to rank your website in google search results? Then you are at the right place. We offer On page seo, Off page seo, Technical seo and Local seo services generating organic traffic, higher google rankings, more sales and leads.",
        fullContent: "Want to rank your website in google search results? Then you are at the right place. We are a professional SEO company in Jaipur that offers On page seo, Off page seo, Technical seo and Local seo services generating organic traffic, higher google rankings, more sales and leads."
      },
      {
        id: "smm",
        icon: "fas fa-share-nodes",
        title: "Social Media Marketing",
        text: "Every business needs a strong presence on social media platforms to grow and build trust. We provide SMM services as per your business type and help you achieve long-term growth.",
        fullContent: "Every business needs a strong presence on social media platforms to grow, make people aware of its business and brand. It also builds trust and increases brand awareness and customer engagement. At Grovia we provide SMM services as per your business type and help you achieve long-term growth."
      },
      {
        id: "ppc",
        icon: "fas fa-bullseye",
        title: "Meta and Google Ads",
        text: "Reach high-intent customers instantly with laser-targeted ad campaigns on Google Search, Meta (Facebook & Instagram) optimized for maximum ROI and lead generation.",
        fullContent: "Reach high-intent customers instantly with laser-targeted ad campaigns on Google Search, Meta (Facebook & Instagram) optimized for maximum ROI, lead generation, and lower cost per acquisition."
      },
      {
        id: "whatsapp-email",
        icon: "fas fa-comments",
        title: "WhatsApp & Email Marketing",
        text: "Connect with your customers by sending targeted messages, discounts, offers and important updates through WhatsApp and Emails, enhancing business growth and sales.",
        fullContent: "At Grovia we help you connect with your customers by sending them your targeted messages and making them aware of discounts, offers and important updates through whatsapp and Emails, enhancing your business growth and sales."
      },
      {
        id: "branding-content",
        icon: "fas fa-pen-nib",
        title: "Branding & Content Writing",
        text: "A well written content makes a website more informative, impressive and user friendly. We provide SEO optimized content writing services in Jaipur improving readability, SEO, and user experience.",
        fullContent: "A well written content makes a website more informative, impressive and user friendly. We provide seo optimised content writing services in jaipur for your websites improving content readability, SEO, and user experience."
      },
      {
        id: "webdev",
        icon: "fas fa-code",
        title: "Website Development",
        text: "We build fully customised custom coded and WordPress websites according to your preference. Our websites are mobile-responsive, user friendly and improve user experience.",
        fullContent: "If you want your customers to get in touch with you through a professional website. Contact us today, We build fully customised both custom coded and Wordpress websites, according to your preference and choice. Our websites are mobile-responsive, user friendly and improves user experience."
      }
    ]
  },
  whyus: {
    tag: "Why Choose Us",
    headline: 'Why Choose <span class="gradient-text">Grovia</span>',
    description: "As a Digital marketing agency in jaipur we believe every business is different and want to acheive different goals. That's why we discuss the needs and requirements of our clients and guide them with customised digital marketing solutions as per their business types.",
    items: [
      {
        number: "01",
        title: "Customised digital marketing services",
        text: "As a Digital marketing agency in jaipur we believe every business is different and want to acheive different goals. That's why we discuss the needs and requirements of our clients and guide them with customised digital marketing solutions as per their business types."
      },
      {
        number: "02",
        title: "Affordable prices",
        text: "There are no fixed packages for any services. We will conduct a meeting to discuss the requirements and proceed further for the pricing."
      },
      {
        number: "03",
        title: "Result-Driven Work",
        text: "We focus more on results rather than just working on a project. We aim to generate organic traffic, increase your online visibility and generate leads making a strong presence of your business in search engines and social media."
      },
      {
        number: "04",
        title: "Complete digital marketing services",
        text: "We provide complete digital marketing services in Jaipur including SEO, Social media marketing (SMM), Meta ads, Google ads, website development, content writing and branding Whatsapp and email marketing."
      },
      {
        number: "05",
        title: "Timely delivery",
        text: "We aim to deliver every project on time without compromising on the quality of work."
      }
    ]
  },
  process: {
    tag: "Our Process",
    headline: 'Our 5-Step <span class="gradient-text">Process</span>',
    description: "From initial contact to project completion, we ensure seamless communication and timely delivery.",
    steps: [
      {
        step: "01",
        title: "Contact us",
        text: "You can get in touch with us through our website through whatsapp, email or call."
      },
      {
        step: "02",
        title: "Free consultation",
        text: "After you contact us we will schedule a meeting with you and discuss the business types, goals and service you require."
      },
      {
        step: "03",
        title: "Budget decision",
        text: "As per your requirements we will recommned you the right digital marketing solution, discuss the budget and provide you the prices as per the service you choose."
      },
      {
        step: "04",
        title: "Start working on project",
        text: "Once you approve the pricing and pay advance as a token amount we will discuss the proper details and plans with you and start working on the project."
      },
      {
        step: "05",
        title: "Timely delivery",
        text: "We will complete the project with an agreed date."
      }
    ]
  },
  industries: {
    tag: "Industries We Serve",
    headline: 'Tailored Marketing for <span class="gradient-text">Your Sector</span>',
    description: "We understand that every business has different goals, customers and challenges. As a best digital marketing company in jaipur we provide customised digital marketing strategies that match your industry not using the same approach for every industry we serve. From increasing online traffic, to building your social media presence, increasing leads, organic traffic and sales, Our digital marketing agency aims to grow your business online.",
    callout: "If you want digital marketing services for your business and increase your sales, leads, profits, enquiries or bookings connect with our digital marketing company in jaipur today and get the best digital marketing solutions tailored to your business.",
    items: [
      {
        icon: "fas fa-user-doctor",
        title: "Health care",
        text: "Help more patients discover your clinic or healthcare services through your professional website, SEO, Social media, Google ads and meta ads. Our goal is to increase your patients enquiries and attract more customers."
      },
      {
        icon: "fas fa-building",
        title: "Real Estate",
        text: "Receive more property enquiries with marketing campaigns, lead generation, social media advertising and help your project reach the right property buyers."
      },
      {
        icon: "fas fa-shirt",
        title: "Clothing brands",
        text: "Whether you sell your clothes online or offline, we would help to increase brand awareness through creative content, social media advertising and other marketing solutions helping you increase your sales and profit."
      },
      {
        icon: "fas fa-couch",
        title: "Interior designers",
        text: "Get more qualified leads and show your portfolio to the right audience with the help of SEO, Social media advertising, Content creation, Google ads and increase your clients with your strong online presence."
      },
      {
        icon: "fas fa-calendar-check",
        title: "Event planners",
        text: "Get in touch with people who want events for their weddings, parties, functions and celebrations through your websites, social media platforms and other digital marketing solutions to increase enquiries and bookings."
      }
    ]
  },
  portfolio: {
    tag: "Our Work",
    headline: 'Featured <span class="gradient-text">Case Studies</span>',
    description: "Real results from real campaigns. See how we've helped brands grow their digital presence.",
    items: [
      { category: "SEO Campaign", title: "Local Healthcare Clinic SEO", color: "linear-gradient(135deg, #0a4da2, #38bdf8)", metrics: [{ value: "+280%", label: "Organic Traffic" }, { value: "3.5x", label: "Patient Enquiries" }] },
      { category: "Real Estate PPC", title: "Luxury Property Lead Gen", color: "linear-gradient(135deg, #1e3a6e, #60a5fa)", metrics: [{ value: "140+", label: "Qualified Buyers" }, { value: "-35%", label: "Cost Per Lead" }] },
      { category: "Clothing Brand SMM", title: "Fashion Apparel Sales", color: "linear-gradient(135deg, #0f4c81, #7dd3fc)", metrics: [{ value: "4.2x", label: "ROAS" }, { value: "+180%", label: "Online Sales" }] },
      { category: "Interior Design", title: "Custom Web & Branding", color: "linear-gradient(135deg, #1a365d, #93c5fd)", metrics: [{ value: "#1", label: "Google Ranking" }, { value: "+210%", label: "Bookings" }] }
    ]
  },
  faq: {
    tag: "FAQ",
    headline: 'Frequently <span class="gradient-text">Asked Questions</span>',
    description: "Find clear answers to common questions about our customized digital marketing services in Jaipur.",
    items: [
      {
        question: "What digital marketing services do you offer?",
        answer: "We offer customised digital marketing solutions including Search Engine Optimization(SEO), Social Media marketing, Google ads and Meta ads, Email marketing, WhatsApp marketing, content writing, branding and website development as per your business needs and requirements."
      },
      {
        question: "How much does your digital marketing services cost?",
        answer: "Our pricing depends on the service you choose and your business type and your requirements. You can contact us to schedule a meeting and we will provide you with a customized quotation that fits your budget."
      },
      {
        question: "Will I get updates and reports about my project?",
        answer: "Yes you will get updates and monthly reports about your project."
      },
      {
        question: "How long will it take to get results in SEO, Google ads and all other services?",
        answer: "Pay-Per-Click (PPC) ad campaigns on Google Ads and Meta Ads start driving instant traffic and leads within 24 to 48 hours. Search Engine Optimization (SEO) is an organic strategy where initial ranking improvements are visible in 2-3 months, with steady growth over 4-6 months."
      },
      {
        question: "Do you work with local businesses and start ups?",
        answer: "Yes, our digital marketing agency in Jaipur works with local businesses and startups to help them build their strong online presence and grow their business."
      }
    ]
  },
  contact: {
    tag: "Contact Us Now",
    headline: 'Looking for digital marketing services <span class="gradient-text">near me?</span>',
    description: "Let’s grow your business together with customised digital marketing solutions and plans. Feel free to contact us today.",
    phone: "+91 70142 98350",
    email: "hello@groviamarketing.com",
    address: "Jaipur, Rajasthan, India",
    formTitle: "Contact Us Now",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14232.46321287!2d75.76023!3d26.91243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4145749f7b1%3A0x6b772412891b00e!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1714570000000!5m2!1sen!2sin",
    mapLink: "https://goo.gl/maps/Jaipur"
  },
  footer: {
    brandText: "Empowering startups and growing brands with customised digital marketing solutions that drive real online growth.",
    copyright: "© 2026 Grovia Marketing. All rights reserved."
  },
  billing: { items: [] },
  quotations: { items: [] },
  audit: {
    tag: "Free SEO Audit",
    headline: 'Analyze Your <span class="gradient-text">Website Performance</span>',
    description: "Enter your website URL below to get a comprehensive SEO and performance audit report instantly.",
    placeholder: "https://yourwebsite.com"
  },
  socialFeed: {
    tag: "Instagram Connect",
    headline: 'Our <span class="gradient-text">Instagram</span> Feed',
    description: "Follow us @groviamarketing for latest updates, tips, and behind-the-scenes.",
    items: [
      { image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" },
      { image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" },
      { image: "https://images.unsplash.com/photo-1611162618071-b39a2ad055fb?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" },
      { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" },
      { image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" },
      { image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80", link: "#", platform: "instagram" }
    ]
  },
  careers: {
    tag: "Join Our Team",
    headline: 'Build Your Career with <span class="gradient-text">Grovia</span>',
    description: "We are looking for passionate, creative, and data-driven individuals to join our mission of transforming brands.",
    whatsapp: "+91 90018 18495",
    items: [
      { title: "SEO Specialist", type: "Full Time", location: "Remote / Jaipur", description: "Help our clients dominate search rankings with expert SEO strategies." },
      { title: "Content Writer", type: "Part Time", location: "Remote", description: "Craft compelling stories and high-converting copy for diverse industries." },
      { title: "Social Media Manager", type: "Full Time", location: "Jaipur", description: "Build and manage thriving online communities for global brands." }
    ]
  },
  seo: {
    index: { title: "Grovia - Trusted Digital marketing company in Jaipur", description: "Grovia is a digital marketing company in Jaipur offering customised digital marketing services as per your business type and budget. Contact us today!", ogImage: "logo.jpeg" },
    about: { title: "About Us | Grovia Marketing Jaipur", description: "Learn about Grovia - Digital marketing agency in Jaipur helping startups and local businesses grow online.", ogImage: "logo.jpeg" },
    services: { title: "Digital Marketing Services in Jaipur | Grovia", description: "Explore our customised digital marketing services: SEO, SMM, Meta & Google Ads, Web Development & Content Writing.", ogImage: "logo.jpeg" },
    portfolio: { title: "Our Work & Case Studies | Grovia Marketing", description: "See real results achieved for healthcare, real estate, clothing brands, interior designers & event planners.", ogImage: "logo.jpeg" },
    blog: { title: "Blog & Marketing Insights | Grovia", description: "Latest digital marketing trends, strategies and tips for business growth in Jaipur.", ogImage: "logo.jpeg" },
    contact: { title: "Contact Us | Digital Marketing Services Near Me | Grovia", description: "Contact Grovia today for customized digital marketing solutions in Jaipur tailored to your budget.", ogImage: "logo.jpeg" },
    careers: { title: "Careers | Join Grovia Marketing", description: "Explore career opportunities at Grovia Marketing in Jaipur.", ogImage: "logo.jpeg" }
  },
  settings: { password: "grovia2026" },
  blogs: [
    {
      id: 1,
      title: "How to Choose the Best Digital Marketing Company in Jaipur",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      date: "May 1, 2026",
      author: "Admin",
      category: "Digital Marketing",
      excerpt: "Learn how customized digital marketing strategies tailored to your industry can transform your local business online presence.",
      content: "Full blog content goes here."
    },
    {
      id: 2,
      title: "SEO vs Social Media Marketing: What Does Your Business Need?",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      date: "April 25, 2026",
      author: "Admin",
      category: "SEO & SMM",
      excerpt: "Discover the differences between organic search engine optimization and targeted social media marketing for local Jaipur brands.",
      content: "Full blog content goes here."
    }
  ]
};
