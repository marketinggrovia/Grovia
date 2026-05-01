const DEFAULTS = {
  general: {
    brandName: "Grovia",
    fullName: "Grovia Marketing",
    logo: "logo.jpeg"
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
  settings: { password: "grovia2026" },
  blogs: [
    {
      id: 1,
      title: "10 Digital Marketing Trends to Watch in 2026",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      date: "May 1, 2026",
      author: "Admin",
      category: "Trends",
      excerpt: "Stay ahead of the curve with our comprehensive guide to the most impactful marketing trends of the coming year.",
      content: "Full blog content goes here. You can use HTML tags for formatting."
    },
    {
      id: 2,
      title: "Maximizing ROI with Targeted PPC Campaigns",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      date: "April 25, 2026",
      author: "Admin",
      category: "PPC",
      excerpt: "Learn the secrets of high-converting pay-per-click strategies that deliver results without breaking the bank.",
      content: "Full blog content goes here."
    }
  ],
  seo: {
    index: { title: "Grovia Marketing | Grow Smarter with Digital Excellence", description: "Grovia Marketing is a premium digital marketing agency specializing in SEO, PPC, social media, and more." },
    about: { title: "About Us | Grovia Marketing", description: "Learn about the mission and values behind Grovia Marketing." },
    services: { title: "Our Services | Expert Digital Solutions", description: "Explore our range of digital marketing services from SEO to Web Development." },
    portfolio: { title: "Our Portfolio | Success Stories", description: "See how we've helped brands achieve remarkable growth." },
    blog: { title: "Blog | Insights & Trends", description: "Latest digital marketing insights and news from our experts." },
    contact: { title: "Contact Us | Get a Strategy Call", description: "Ready to grow? Contact Grovia Marketing for a free strategy consultation." }
  }
};
