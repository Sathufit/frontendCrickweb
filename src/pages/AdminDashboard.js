import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Header animation on scroll
    const handleScroll = () => setAnimateHeader(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);


  // Menu items for dynamic rendering
  const menuItems = [
    { section: "Statistics", items: [
      { path: "add-runs", label: "Add Runs", icon: <path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,17H7V7H17V17M15,15H9V9H15V15M13,13H11V11H13V13Z" /> },
      { path: "add-wickets", label: "Add Wickets", icon: <path fill="currentColor" d="M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z" /> }
    ]},
    { section: "Management", items: [
      { path: "manage-runs", label: "Manage Runs", icon: <path fill="currentColor" d="M7,13H21V11H7M7,19H21V17H7M7,7H21V5H7M2,11H5V13H2M2,5H5V7H2M2,17H5V19H2V17Z" /> },
      { path: "manage-wickets", label: "Manage Wickets", icon: <path fill="currentColor" d="M21,9H3V11H21V9M21,5H3V7H21V5M3,19H10V17H3V19M3,15H14V13H3V15Z" /> }
    ]},
    { section: "Analytics", items: [
      { path: "performance", label: "Performance", icon: <path fill="currentColor" d="M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17M19,19H5V5H19V19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" /> },
      { path: "daily-report", label: "Reports", icon: <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M9,13V19H7V13H9M15,15V19H17V15H15M11,13V19H13V13H11Z" /> }
    ]}
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className={`dashboard-header ${animateHeader ? 'animated' : ''}`}>
        <div className="header-left">
          <div className="header-logo">
            <svg className="header-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,12A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 7.5,15A1.5,1.5 0 0,1 6,13.5A1.5,1.5 0 0,1 7.5,12M16.5,12A1.5,1.5 0 0,1 18,13.5A1.5,1.5 0 0,1 16.5,15A1.5,1.5 0 0,1 15,13.5A1.5,1.5 0 0,1 16.5,12Z" />
            </svg>
            <div className="logo-pulse"></div>
          </div>
          <h1>CricketSphere <span className="accent">Pro</span></h1>
        </div>
        
        <div className="header-right">
          <div className="time-display">
            <div className="time">{currentTime.toLocaleTimeString()}</div>
            <div className="date">{currentTime.toLocaleDateString()}</div>
          </div>
          <div className="user-profile">
            <div className="profile-avatar">
              <span>AD</span>
            </div>
          </div>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <nav className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Management Console</h2>
            <button 
              className="close-mobile-menu" 
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
            <div className="sidebar-divider"></div>
          </div>
          
          <ul className="sidebar-menu">
            {menuItems.map((section, index) => (
              <React.Fragment key={index}>
                <li className="menu-section">
                  <span className="section-title">{section.section}</span>
                </li>
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="menu-link" onClick={toggleMobileMenu}>
                      <svg className="menu-icon" viewBox="0 0 24 24">
                        {item.icon}
                      </svg>
                      <span>{item.label}</span>
                      <div className="hover-indicator"></div>
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
          
          <div className="sidebar-footer">
            <Link to="settings" className="settings-link" onClick={toggleMobileMenu}>
              <svg className="settings-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
              </svg>
              <span>Settings</span>
            </Link>
            <Link to="logout" className="logout-link" onClick={toggleMobileMenu}>
              <svg className="logout-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h2 className="page-title">Cricket Statistics</h2>
            <div className="quick-actions">
              <button className="action-button">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                <span>New Entry</span>
              </button>
              <button className="action-button">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
                </svg>
                <span>Reports</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Toggle Button */}
          <div className="mobile-toggle-container">
            <button className="mobile-toggle-button" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? "Hide Menu" : "Show Menu"}
            </button>
          </div>
          
          {/* Content Area for Routes */}
          <div className="content-area">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'show' : ''}`} 
        onClick={toggleMobileMenu}
      ></div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>CricketSphere Pro Administration System © {new Date().getFullYear()}</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        /* Base Styles */
        * {
          box-sizing: border-box;
          transition: all 0.2s ease-in-out;
        }
        
        .dashboard-container {
          font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
          margin: 0;
          padding: 0;
          background-color: #f7faff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: #334155;
        }
        
        /* Header Styles */
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          box-shadow: 0 4px 20px rgba(148, 163, 184, 0.1);
          margin-bottom: 1.5rem;
          border-radius: 0 0 20px 20px;
          position: relative;
          z-index: 10;
          transform: translateY(-5px);
          opacity: 0.9;
        }
        
        .dashboard-header.animated {
          transform: translateY(0);
          opacity: 1;
        }
        
        .header-left {
          display: flex;
          align-items: center;
        }
        
        .header-logo {
          position: relative;
          margin-right: 1rem;
        }
        
        .header-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #3b82f6;
          z-index: 2;
          position: relative;
        }
        
        .logo-pulse {
          position: absolute;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          top: 0;
          left: 0;
          z-index: 1;
          animation: pulse 3s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        
        .dashboard-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(45deg, #3b82f6, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.025em;
        }
        
        .accent {
          font-weight: 300;
          opacity: 0.7;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .time-display {
          text-align: right;
          background: rgba(255, 255, 255, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          backdrop-filter: blur(5px);
        }
        
        .time {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          color: #1e40af;
        }
        
        .date {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
        }
        
        .profile-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #93c5fd, #60a5fa);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          border: 2px solid white;
          box-shadow: 0 2px 10px rgba(148, 163, 184, 0.2);
        }
        
        /* Mobile menu button */
        .mobile-menu-button {
          background: transparent;
          border: none;
          cursor: pointer;
          display: none;
          padding: 0.5rem;
          color: #3b82f6;
        }
        
        .mobile-menu-button svg {
          width: 1.5rem;
          height: 1.5rem;
        }
        
        /* Content Styles */
        .dashboard-content {
          display: flex;
          flex: 1;
          gap: 1.5rem;
          padding: 0 1.5rem;
        }
        
        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
          height: fit-content;
          min-height: 80vh;
        }
        
        .sidebar-header {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .sidebar-title {
          font-size: 0.875rem;
          margin: 0;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        .close-mobile-menu {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 0.5rem;
        }
        
        .close-mobile-menu svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .sidebar-divider {
          height: 2px;
          background: linear-gradient(90deg, #e2e8f0, transparent);
          margin: 0.75rem 0;
          border-radius: 1px;
        }
        
        .sidebar-menu {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        
        .menu-section {
          padding: 0.75rem 0 0.5rem;
        }
        
        .section-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #94a3b8;
          padding-left: 1rem;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #475569;
          border-radius: 8px;
          font-weight: 500;
          position: relative;
          overflow: hidden;
          font-size: 0.875rem;
        }
        
        .menu-link:hover {
          background-color: rgba(248, 250, 252, 0.8);
          color: #3b82f6;
        }
        
        .menu-link:hover .hover-indicator {
          transform: translateX(0);
          opacity: 1;
        }
        
        .hover-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #3b82f6, #2563eb);
          border-radius: 0 4px 4px 0;
          transform: translateX(-4px);
          opacity: 0;
          transition: all 0.2s ease;
        }
        
        .menu-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
          color: #64748b;
        }
        
        .menu-link:hover .menu-icon {
          color: #3b82f6;
          transform: scale(1.1);
        }
        
        .sidebar-footer {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
          font-size: 0.875rem;
        }
        
        .settings-link, .logout-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: #64748b;
          transition: all 0.2s ease;
        }
        
        .settings-link:hover, .logout-link:hover {
          background-color: rgba(248, 250, 252, 0.8);
          color: #3b82f6;
        }
        
        .settings-icon, .logout-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
        }
        
        .logout-link {
          color: #ef4444;
        }
        
        .logout-link:hover {
          color: #dc2626;
          background-color: rgba(254, 242, 242, 0.8);
        }
        
        /* Main Content Styles */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(148, 163, 184, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .page-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #334155;
        }
        
        .quick-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #3b82f6;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .action-button:hover {
          background: #f0f9ff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }
        
        .action-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        /* Dashboard Cards */
        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .dashboard-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          position: relative;
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.8);
          overflow: hidden;
        }
        
        .dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(148, 163, 184, 0.1);
        }
        
        .card-icon {
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .card-icon svg {
          width: 1.75rem;
          height: 1.75rem;
        }
        
        .card-icon.runs {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        
        .card-icon.wickets {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .card-icon.matches {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }
        
        .card-icon.players {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
        }
        
        .card-content {
          flex: 1;
        }
        
        .card-content h3 {
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .card-value {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #334155;
        }
        
        .card-trend {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        
        .card-trend svg {
          width: 1rem;
          height: 1rem;
          margin-right: 0.25rem;
        }
        
        .card-trend.up {
          color: #10b981;
          background-color: rgba(16, 185, 129, 0.1);
        }
        
        .card-trend.down {
          color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
        }
        
        /* Content Area */
        .content-area {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.8);
          flex: 1;
        }
        
        /* Mobile Menu */
        .mobile-toggle-container {
          display: none;
          margin-bottom: 1rem;
        }
        
        .mobile-toggle-button {
          width: 100%;
          padding: 0.75rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
        }
        
        .mobile-toggle-button:hover {
          background: #f8fafc;
          color: #3b82f6;
        }
        
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .mobile-menu-overlay.show {
          opacity: 1;
          pointer-events: auto;
        }
        
        /* Footer */
        .dashboard-footer {
          margin-top: auto;
          padding: 1rem 2rem;
          background: white;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 20px rgba(148, 163, 184, 0.05);
          border-top: 1px solid #f1f5f9;
          margin-top: 1.5rem;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #64748b;
        }
        
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .footer-links a {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .footer-links a:hover {
          color: #3b82f6;
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .dashboard-cards {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
          
          .time-display {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 0;
          }
          
          .dashboard-header {
            padding: 1rem;
            border-radius: 0;
          }
          
          .dashboard-content {
            padding: 0 1rem;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: -280px;
            height: 100vh;
            z-index: 100;
            border-radius: 0 16px 16px 0;
            transition: left 0.3s ease;
            padding: 2rem 1rem;
          }
          
          .sidebar.mobile-open {
            left: 0;
          }
          
          .close-mobile-menu {
            display: block;
          }
          
          .mobile-menu-button {
            display: block;
          }
          
          .mobile-toggle-container {
            display: block;
          }
          
          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .quick-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .action-button {
            flex: 1;
            justify-content: center;
          }
          
          .dashboard-cards {
            grid-template-columns: 1fr;
          }
          
          .dashboard-footer {
            padding: 1rem;
            border-radius: 0;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .footer-links {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;