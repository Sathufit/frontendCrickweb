import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./HomeStyles.css";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clubStats, setClubStats] = useState({ 
    totalRuns: 0, 
    totalInnings: 0, 
    totalWickets: 0 
  });
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Parallax effect for hero
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
      
      // Fade in stats on scroll
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          statsRef.current.classList.add('visible');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    if (window.innerWidth > 1024) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);
  
  // Lock body scroll when mobile menu is open
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

  // Fetch club data
  useEffect(() => {
    const fetchClubData = async () => {
      setLoading(true);
      try {
        await new Promise(res => setTimeout(res, 1500)); 
        
        setClubStats({
          totalRuns: 12457,
          totalInnings: 312,
          totalWickets: 289,
        });
      } catch (error) {
        console.error("Failed to fetch club stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, []);

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
    <div className="home-page">
      {/* Custom Cursor - Desktop Only */}
      {window.innerWidth > 1024 && (
        <>
          <div 
            className="custom-cursor"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`
            }}
          />
          <div 
            className="custom-cursor-ring"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`
            }}
          />
        </>
      )}
      
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" ref={heroRef}>
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=2400&q=80" 
            alt="Cricket Stadium"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content container">
          <h1 className="hero-title">
            <span className="stagger-1">FRONTYARD</span>
            <span className="stagger-2">CRICKET</span>
            <span className="stagger-3">CLUB</span>
          </h1>
          <p className="hero-subtitle stagger-4">
            Where champions are made, legends are born, and every match tells a story
          </p>
          <div className="hero-cta stagger-5">
            <NavLink to="/live-match" className="btn-primary">
              <span>Watch Live Match</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </NavLink>
            <NavLink to="/stats" className="btn-secondary">
              View Statistics
            </NavLink>
          </div>
        </div>
      </section>

      {/* Club Statistics Section */}
      <section className="stats-section section" ref={statsRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Performance</span>
            <h2 className="section-title">Club At a Glance</h2>
            <p className="section-subtitle">
              Numbers that define our journey and celebrate our achievements
            </p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading statistics...</p>
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <div className="stat-value">{clubStats.totalRuns.toLocaleString()}</div>
                <div className="stat-label">Total Runs</div>
                <div className="stat-growth">+12.5% from last season</div>
              </div>
              
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div className="stat-value">{clubStats.totalInnings.toLocaleString()}</div>
                <div className="stat-label">Innings Played</div>
                <div className="stat-growth">Across all formats</div>
              </div>
              
              <div className="stat-card glass-card">
                <div className="stat-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="stat-value">{clubStats.totalWickets.toLocaleString()}</div>
                <div className="stat-label">Wickets Taken</div>
                <div className="stat-growth">By our bowlers</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">What We Offer</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-number">01</div>
              <h3 className="feature-title">Live Match Tracking</h3>
              <p className="feature-description">
                Real-time ball-by-ball updates with comprehensive scorecards and player statistics
              </p>
              <NavLink to="/live-match" className="feature-link">
                Explore →
              </NavLink>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-number">02</div>
              <h3 className="feature-title">Player Analytics</h3>
              <p className="feature-description">
                Deep dive into player performance with advanced metrics and visualization
              </p>
              <NavLink to="/stats" className="feature-link">
                Explore →
              </NavLink>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-number">03</div>
              <h3 className="feature-title">Match Analysis</h3>
              <p className="feature-description">
                Detailed post-match analysis with insights and key performance indicators
              </p>
              <NavLink to="/analyst" className="feature-link">
                Explore →
              </NavLink>
            </div>
            
            <div className="feature-card glass-card">
              <div className="feature-number">04</div>
              <h3 className="feature-title">Historical Data</h3>
              <p className="feature-description">
                Access complete records of runs, wickets, and match history
              </p>
              <NavLink to="/view-runs" className="feature-link">
                Explore →
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Live Cricket?</h2>
            <p className="cta-text">
              Join thousands of fans tracking their favorite team in real-time
            </p>
            <NavLink to="/live-match" className="btn-primary btn-large">
              <span>Start Watching Now</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 13.5c0 2-2.5 3.5-2.5 5h-2c0-1.5-2.5-3-2.5-5 0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5zm-2.5 6.5h-2v2h2v-2z"/>
              </svg>
              <span>FRONTYARD CRICKET CLUB</span>
            </div>
            
            <div className="footer-links">
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/privacy">Privacy</NavLink>
              <NavLink to="/terms">Terms</NavLink>
            </div>
            
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
            
            <div className="footer-bottom">
              <p>© 2024 Frontyard Cricket Club. All rights reserved.</p>
              <p>Designed with passion for the game</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
