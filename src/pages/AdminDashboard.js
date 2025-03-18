import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <svg className="header-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" />
          </svg>
          <h1>Cricket Admin</h1>
        </div>
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
          </svg>
        </button>
      </header>

      <div className="dashboard-content">
        <nav className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <h2 className="sidebar-title">Management Tools</h2>
          <ul className="sidebar-menu">
            <li>
              <Link to="add-runs" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Add Runs
              </Link>
            </li>
            <li>
              <Link to="add-wickets" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Add Wickets
              </Link>
            </li>
            <li>
              <Link to="manage-runs" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                </svg>
                Manage Runs
              </Link>
            </li>
            <li>
              <Link to="manage-wickets" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                <svg className="menu-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                </svg>
                Manage Wickets
              </Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <div className="info-banner">
            <p>Select an option from the menu to manage cricket statistics</p>
          </div>
          
          <div className="mobile-toggle-container">
            <button
              className="mobile-toggle-button"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "Hide Menu" : "Show Menu"}
            </button>
          </div>
          
          <Outlet />
        </main>
      </div>

      <footer className="dashboard-footer">
        <p>Cricket Administration System © {new Date().getFullYear()}</p>
      </footer>

      <style jsx>{`
        /* Base Styles */
        .dashboard-container {
          font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
          min-height: 100vh;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 20px;
          background-color: #1e40af;
          border-radius: 6px;
          color: white;
        }
        
        .header-title {
          display: flex;
          align-items: center;
        }
        
        .header-icon {
          width: 32px;
          height: 32px;
          margin-right: 15px;
        }
        
        .dashboard-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        
        .dashboard-content {
          display: flex;
          gap: 30px;
        }
        
        .sidebar {
          width: 250px;
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        
        .sidebar-title {
          font-size: 18px;
          margin: 0 0 20px 0;
          color: #4b5563;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }
        
        .sidebar-menu {
          list-style-type: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .menu-link {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          text-decoration: none;
          color: #4b5563;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s ease;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
        }
        
        .menu-link:hover {
          background-color: #e5e7eb;
        }
        
        .menu-icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        
        .main-content {
          flex: 1;
          background-color: white;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        
        .info-banner {
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 6px;
          margin-bottom: 20px;
          border-left: 4px solid #1e40af;
        }
        
        .info-banner p {
          margin: 0;
          color: #4b5563;
        }
        
        .dashboard-footer {
          margin-top: 30px;
          padding: 15px;
          text-align: center;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
        }
        
        .dashboard-footer p {
          margin: 0;
          font-size: 14px;
        }
        
        /* Mobile menu button (hidden by default) */
        .mobile-menu-button {
          background: transparent;
          border: none;
          cursor: pointer;
          display: none;
          padding: 8px;
        }
        
        .mobile-menu-button svg {
          width: 24px;
          height: 24px;
        }
        
        .mobile-toggle-container {
          display: none;
        }
        
        .mobile-toggle-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 10px;
          background-color: #1e40af;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-bottom: 20px;
        }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 10px;
          }
          
          .dashboard-header h1 {
            font-size: 20px;
          }
          
          .mobile-menu-button {
            display: block;
          }
          
          .dashboard-content {
            flex-direction: column;
            gap: 20px;
          }
          
          .sidebar {
            width: 100%;
            display: none;
            padding: 15px;
          }
          
          .sidebar.mobile-open {
            display: block;
          }
          
          .main-content {
            padding: 15px;
          }
          
          .mobile-toggle-container {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;