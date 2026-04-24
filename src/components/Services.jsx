import React from 'react';
import { motion } from 'framer-motion';
import './Services.css';

import metaIcon from '../assets/service-meta.png';
import googleIcon from '../assets/service-google.png';
import videoIcon from '../assets/service-video.png';
import socialIcon from '../assets/service-social.png';
import brandingIcon from '../assets/service-branding.png';
import seoIcon from '../assets/service-seo.png';

const services = [
  {
    title: 'Meta Ads',
    description: 'Elevate your online presence with strategically crafted meta ads that captivate your audience.',
    icon: metaIcon
  },
  {
    title: 'Google Ads',
    description: 'Unlock the power of Google with targeted campaigns that drive traffic and boost conversions.',
    icon: googleIcon
  },
  {
    title: 'Video Editing',
    description: 'Tell your story in a visually compelling way with our expert video editing services.',
    icon: videoIcon
  },
  {
    title: 'Social Media Management',
    description: 'From content creation to community engagement, weve got your social media presence covered.',
    icon: socialIcon
  },
  {
    title: 'Branding',
    description: 'Make a lasting impression with our innovative branding solutions that set you apart.',
    icon: brandingIcon
  },
  {
    title: 'SEO & Organic Growth',
    description: 'Foster a genuine connection with your audience through our organic growth strategies.',
    icon: seoIcon
  }
];

const Services = () => {
  return (
    <section className="services section" id="services">
      <div className="container">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Services We Offer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We provide a wide range of digital marketing services to help your business grow.
          </motion.p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="service-card glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="service-icon">
                <img src={service.icon} alt={service.title} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
