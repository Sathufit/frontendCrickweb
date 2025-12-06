import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../pages/HomeStyles.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/stats", label: "Stats" },
    { to: "/analyst", label: "Analysis" },
    { to: "/view-runs", label: "Runs" },
    { to: "/view-wickets", label: "Wickets" },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
          </svg>
          <span>FRONTYARD</span>
        </NavLink>

        <div className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link, index) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              style={{ '--index': index }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button 
          className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
