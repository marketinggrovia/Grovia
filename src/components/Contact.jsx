import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact section" id="contact">
      <div className="container">
        <div className="section-header">
          <h2>Ready to Grow?</h2>
          <p>Get in touch with us today for a free consultation and let's start your journey to success.</p>
        </div>
        
        <div className="contact-grid">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="info-item">
              <div className="info-icon glass"><Mail size={24} /></div>
              <div>
                <h4>Email Us</h4>
                <p>contact@dpixels.in</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon glass"><Phone size={24} /></div>
              <div>
                <h4>Call Us</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon glass"><MapPin size={24} /></div>
              <div>
                <h4>Visit Us</h4>
                <p>Jaipur, Rajasthan, India</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form-wrapper glass"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <select required>
                  <option value="" disabled selected>Select Service</option>
                  <option value="meta">Meta Ads</option>
                  <option value="google">Google Ads</option>
                  <option value="seo">SEO</option>
                  <option value="branding">Branding</option>
                </select>
              </div>
              <div className="form-group">
                <textarea placeholder="Tell us about your project" rows="4"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Message <Send size={18} style={{marginLeft: '8px'}} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
