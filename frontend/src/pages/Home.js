import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navbar = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    gap: 1.5rem;
  }
`;

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
      color: "#111827",
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
    }}>
      {/* Navbar */}
      <header style={{
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}>
          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.75rem" }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4f46e5" strokeWidth="2" />
              <path d="M12 8V12L15 15" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1 style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #4f46e5 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}>
              FrontyardCricket
            </h1>
          </div>

          {/* Desktop Navigation */}
          <Navbar>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/view-runs">Runs</NavLink>
            <NavLink to="/view-wickets">Wickets</NavLink>
            <NavLink to="/analyst">Analysis</NavLink>
            <NavLink to="/wicket-analysis">Wicket Analysis</NavLink>
            <NavLink to="/stats">Batting Stats</NavLink>
            <NavLink to="/live-match">Live Match</NavLink> {/* Added Live Match link */}
          </Navbar>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "24px",
              height: "18px",
              background: "none",
              border: "none",
              cursor: "pointer",
              '@media (min-width: 768px)': {
                display: "none",
              },
            }}
          >
            <span style={{
              width: "100%",
              height: "2px",
              backgroundColor: "#4f46e5",
              borderRadius: "2px",
              transition: "transform 0.3s ease",
              transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <span style={{
              width: "100%",
              height: "2px",
              backgroundColor: "#4f46e5",
              borderRadius: "2px",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
            }} />
            <span style={{
              width: "100%",
              height: "2px",
              backgroundColor: "#4f46e5",
              borderRadius: "2px",
              transition: "transform 0.3s ease",
              transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            backgroundColor: "#ffffff",
            padding: "1rem 1.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            '@media (min-width: 768px)': {
              display: "none",
            },
          }}>
            <nav style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
              <MobileNavLink to="/view-runs" onClick={toggleMenu}>Runs</MobileNavLink>
              <MobileNavLink to="/view-wickets" onClick={toggleMenu}>Wickets</MobileNavLink>
              <MobileNavLink to="/analyst" onClick={toggleMenu}>Analysis</MobileNavLink>
              <MobileNavLink to="/wicket-analysis" onClick={toggleMenu}>Wicket Analysis</MobileNavLink>
              <MobileNavLink to="/stats" onClick={toggleMenu}>Batting Analysis</MobileNavLink>
              <MobileNavLink to="/live-match" onClick={toggleMenu}>Live Match</MobileNavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
        padding: "4rem 1.5rem",
        textAlign: "center",
        color: "#ffffff",
      }}>
        <div style={{
          maxWidth: "1024px",
          margin: "0 auto",
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "1.5rem",
          }}>
            Welcome to Cricket Info
          </h1>
          <p style={{
            fontSize: "1.125rem",
            maxWidth: "640px",
            margin: "0 auto 2rem",
            opacity: 0.9,
          }}>
            Track runs, wickets, and all your cricket statistics in one place with our intuitive dashboard.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}>
            <Link to="/stats" style={{
              backgroundColor: "#ffffff",
              color: "#4f46e5",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              View Statistics
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/add-runs" style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backdropFilter: "blur(12px)",
            }}>
              Add New Entry
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: "1280px",
        margin: "4rem auto",
        padding: "0 1.5rem",
      }}>
        <h2 style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "3rem",
        }}>
          Easy Cricket Statistics Management
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
        }}>
          <FeatureCard 
            title="Track Runs" 
            description="Record and analyze batting performances with detailed run statistics."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L12 12M12 12L16 8M12 12L8 8M12 12L16 16M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <FeatureCard 
            title="Monitor Wickets" 
            description="Keep track of bowling performances and wicket-taking abilities."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <FeatureCard 
            title="Manage Data" 
            description="Easily update, edit, and maintain your cricket statistics."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#f3f4f6",
        padding: "2rem 1.5rem",
        borderTop: "1px solid #e5e7eb",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "0.5rem" }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4f46e5" strokeWidth="2" />
              <path d="M12 8V12L15 15" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #4f46e5 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}>
              FriendSpehere Cricket
            </h3>
          </div>
          <p style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}>
            © 2025 Cricket Info. All rights reserved.
          </p>
          <div style={{
            display: "flex",
            gap: "1.5rem",
          }}>
            <a href="#" style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}>Privacy Policy</a>
            <a href="#" style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}>Terms of Service</a>
            <a href="#" style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              textDecoration: "none",
            }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component for desktop navigation links
const NavLink = ({ to, children }) => (
  <Link to={to} style={{
    color: "#4b5563",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1rem",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    transition: "color 0.2s ease",
    '&:hover': {
      color: "#4f46e5",
    },
  }}>
    {children}
  </Link>
);

// Component for mobile navigation links
const MobileNavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} style={{
      color: "#4b5563",
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "1rem",
      padding: "0.75rem 0.5rem",
      borderRadius: "0.25rem",
      transition: "color 0.2s ease",
      '&:hover': {
        color: "#4f46e5",
      },
    }}>
      {children}
    </Link>
  );
  
  // Component for feature cards
  const FeatureCard = ({ title, description, icon }) => (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}>
      <div style={{
        backgroundColor: "#f3f4f6",
        borderRadius: "50%",
        width: "64px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1rem",
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: "1.25rem",
        fontWeight: 600,
        marginBottom: "0.75rem",
      }}>
        {title}
      </h3>
      <p style={{
        color: "#6b7280",
        fontSize: "0.875rem",
      }}>
        {description}
      </p>
    </div>
  );
  
  export default Home;