import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';
import heroImg from '../assets/hero-illustration.png';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container hero-container">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            At Grovia, <br />
            <span className="gradient-text">We Cure Your Business Health</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Welcome to Grovia, where digital dreams take flight! As a premier digital marketing agency, 
            we specialize in transforming businesses into online success stories. We understand the 
            dynamic landscape of the digital world and craft strategies that ensure your brand 
            not only stands out but thrives.
          </motion.p>
          
          <motion.div 
            className="hero-btns"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a href="#services" className="btn-primary">Explore Services</a>
            <a href="#portfolio" className="btn-secondary">View Our Work</a>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <img src={heroImg} alt="Grovia Marketing Illustration" />
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
