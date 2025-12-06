import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/AnalyticsImproved.css";

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5001"
  : "https://frontyard.sathush.dev";

const ViewWickets = () => {
  const [wickets, setWickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'wickets', direction: 'descending' });
  const [filterVenue, setFilterVenue] = useState('all');
  const [filterInnings, setFilterInnings] = useState('all');

  useEffect(() => {
    loadWickets();
  }, []);

  const loadWickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/wickets`);
      console.log("Wickets API response:", response.data);
      
      // Ensure we always set an array
      if (Array.isArray(response.data)) {
        setWickets(response.data);
      } else if (response.data && Array.isArray(response.data.wickets)) {
        setWickets(response.data.wickets);
      } else {
        console.error("Invalid wickets data format:", response.data);
        setWickets([]);
      }
    } catch (error) {
      console.error("Error fetching wickets:", error);
      setWickets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const sortedWickets = React.useMemo(() => {
    // Ensure wickets is always an array
    if (!Array.isArray(wickets)) {
      console.warn("wickets is not an array:", wickets);
      return [];
    }
    
    let sortableWickets = [...wickets];
    
    if (filterVenue !== 'all') {
      sortableWickets = sortableWickets.filter(w => w.venue === filterVenue);
    }
    if (filterInnings !== 'all') {
      sortableWickets = sortableWickets.filter(w => w.innings === filterInnings);
    }

    if (sortConfig.key) {
      sortableWickets.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableWickets;
  }, [wickets, sortConfig, filterVenue, filterInnings]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const venues = Array.isArray(wickets) ? [...new Set(wickets.map(w => w.venue))] : [];
  const totalWickets = sortedWickets.reduce((sum, w) => sum + (w.wickets || 0), 0);
  const bestFigures = sortedWickets.length > 0 ? Math.max(...sortedWickets.map(w => w.wickets || 0)) : 0;
  const fiveWickets = sortedWickets.filter(w => w.wickets >= 5).length;
  const threeWickets = sortedWickets.filter(w => w.wickets >= 3 && w.wickets < 5).length;

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h1 className="analytics-title">
            Bowling <span className="highlight">Records</span>
          </h1>
          <p className="analytics-subtitle">
            Complete bowling statistics and wicket records
          </p>
        </div>

        <div className="stats-overview">
          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8M12 8v8"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{totalWickets}</div>
            <div className="stat-card-label">Total Wickets</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{bestFigures}</div>
            <div className="stat-card-label">Best Figures</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{fiveWickets}</div>
            <div className="stat-card-label">5 Wicket Hauls</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{threeWickets}</div>
            <div className="stat-card-label">3+ Wickets</div>
          </div>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <label className="filter-label">Venue</label>
            <select 
              className="filter-select" 
              value={filterVenue} 
              onChange={(e) => setFilterVenue(e.target.value)}
            >
              <option value="all">All Venues</option>
              {venues.map(venue => (
                <option key={venue} value={venue}>{venue}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Innings</label>
            <select 
              className="filter-select" 
              value={filterInnings} 
              onChange={(e) => setFilterInnings(e.target.value)}
            >
              <option value="all">All Innings</option>
              <option value="1st">1st Innings</option>
              <option value="2nd">2nd Innings</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-analytics">
            <div className="loading-spinner-large"></div>
            <p className="loading-text">Loading bowling records...</p>
          </div>
        ) : sortedWickets.length === 0 ? (
          <div className="loading-analytics">
            <p className="loading-text">No records found</p>
          </div>
        ) : (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">All Bowling Records</h3>
              <p className="chart-subtitle">{sortedWickets.length} performances</p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.1)' }}>
                    <th onClick={() => requestSort('bowlerName')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Bowler {sortConfig.key === 'bowlerName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('wickets')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Wickets {sortConfig.key === 'wickets' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('venue')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Venue {sortConfig.key === 'venue' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('innings')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Innings {sortConfig.key === 'innings' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('date')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWickets.map((wicket, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.05)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200, 255, 58, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{wicket.bowlerName}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: wicket.wickets >= 5 ? 'rgba(34, 197, 94, 0.1)' : wicket.wickets >= 3 ? 'rgba(200, 255, 58, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                          border: `1px solid ${wicket.wickets >= 5 ? '#22c55e' : wicket.wickets >= 3 ? 'var(--color-accent-primary)' : 'rgba(160, 160, 160, 0.3)'}`,
                          borderRadius: '6px',
                          color: wicket.wickets >= 5 ? '#22c55e' : wicket.wickets >= 3 ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}>
                          {wicket.wickets}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>{wicket.venue}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{wicket.innings}</td>
                      <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{new Date(wicket.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewWickets;
