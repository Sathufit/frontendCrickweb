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
    { to: "/stats", label: "Batting Stats" },
    { to: "/wicket-analysis", label: "Wicket Stats" },
    { to: "/analyst", label: "Analysis" },
    { to: "/view-runs", label: "Runs" },
    { to: "/view-wickets", label: "Wickets" },
  ];

  return (
    <>
      {/* Navbar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <nav className="navbar-container">
          <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
            </svg>
            <span>FRONTYARD</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="navbar-nav-desktop">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger */}
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

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <div className="mobile-sidebar-overlay" onClick={closeMenu}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="mobile-sidebar-logo">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
            </svg>
            <span>FRONTYARD</span>
          </div>
          <button className="mobile-sidebar-close" onClick={closeMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="mobile-sidebar-nav">
          {navLinks.map((link, index) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="mobile-nav-icon">
                {link.label === 'Home' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                )}
                {link.label === 'Stats' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                )}
                {link.label === 'Analysis' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
                  </svg>
                )}
                {link.label === 'Runs' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/>
                  </svg>
                )}
                {link.label === 'Wickets' && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
                  </svg>
                )}
              </span>
              <span className="mobile-nav-text">{link.label}</span>
              <svg className="mobile-nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </NavLink>
          ))}
        </nav>

        <div className="mobile-sidebar-footer">
          <div className="mobile-sidebar-divider"></div>
          <p className="mobile-sidebar-info">FRONTYARD CRICKET CLUB</p>
          <p className="mobile-sidebar-year">Est. 2024</p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
