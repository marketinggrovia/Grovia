import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import './About.css';

const About = () => {
  const points = [
    "Expert Team of Digital Strategists",
    "Tailored Solutions for Every Business",
    "Data-Driven Approach & ROI Focused",
    "End-to-End Campaign Management"
  ];

  return (
    <section className="about section" id="about">
      <div className="container about-container">
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="subtitle">Who We Are</span>
          <h2>Why Choose Groovia?</h2>
          <p>
            At Groovia, we believe in results. Our team of passionate experts is dedicated 
            to navigating the ever-evolving digital landscape on your behalf. We don't 
            just deliver services; we provide tailored solutions designed to meet your 
            unique goals.
          </p>
          <div className="points-grid">
            {points.map((point, index) => (
              <div key={index} className="point-item">
                <CheckCircle className="point-icon" size={20} />
                <span>{point}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary">Learn More About Us</button>
        </motion.div>
        
        <motion.div 
          className="about-stats"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="stat-card glass">
            <h3>500+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat-card glass">
            <h3>150+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-card glass">
            <h3>5+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-card glass">
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
