import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <motion.div 
          className="navbar-pill glass"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="navbar-logo">
            <span className="logo-text">Groo<span className="primary-color">via</span></span>
          </div>

          <div className="navbar-links desktop-only">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="navbar-actions">
            <button className="search-btn"><Search size={20} /></button>
            <a href="#consultation" className="btn-primary desktop-only">Free Consultation</a>
            <button 
              className="mobile-menu-btn mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu glass"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#portfolio" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            <a href="#consultation" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Free Consultation</a>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
