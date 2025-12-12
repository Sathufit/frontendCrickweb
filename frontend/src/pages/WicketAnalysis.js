import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/AnalyticsImproved.css";

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5001"
  : "https://frontyard.sathush.dev";

const WicketAnalysis = () => {
  const [wicketsData, setWicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rate', direction: 'descending' });

  useEffect(() => {
    const fetchWickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/wickets`);
        const data = response.data;
        const analysisMap = {};
        
        data.forEach(w => {
          const key = w.bowler_name;
          if (!analysisMap[key]) {
            analysisMap[key] = { wickets: 0, innings: 0 };
          }
          analysisMap[key].wickets += Number(w.wickets || 0);
          analysisMap[key].innings += Number(w.innings || 0);
        });
        
        const analysisArray = Object.entries(analysisMap).map(([name, stats]) => ({
          bowler_name: name,
          total_wickets: stats.wickets,
          total_innings: stats.innings,
          rate: stats.innings === 0 ? 0 : (stats.wickets / stats.innings).toFixed(2),
        }));
        
        setWicketsData(analysisArray);
      } catch (err) {
        console.error("Error fetching wicket analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWickets();
  }, []);

  const sortedWickets = React.useMemo(() => {
    let sortable = [...wicketsData];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = Number(a[sortConfig.key]) || 0;
        const bVal = Number(b[sortConfig.key]) || 0;
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [wicketsData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const totalWickets = wicketsData.reduce((sum, w) => sum + (w.total_wickets || 0), 0);
  const totalBowlers = wicketsData.length;
  const avgWicketsPerInnings = wicketsData.length > 0 
    ? (totalWickets / wicketsData.reduce((sum, w) => sum + w.total_innings, 0)).toFixed(2) 
    : 0;

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h1 className="analytics-title">
            Bowler <span className="highlight">Statistics</span>
          </h1>
          <p className="analytics-subtitle">
            Comprehensive bowling statistics and performance metrics
          </p>
        </div>

        {/* Summary Stats */}
        <div className="stats-overview">
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
            <div className="stat-card-value">{totalWickets}</div>
            <div className="stat-card-label">Total Wickets</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{totalBowlers}</div>
            <div className="stat-card-label">Bowlers</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9"/>
                  <path d="M13 17V5"/>
                  <path d="M8 17v-3"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{avgWicketsPerInnings}</div>
            <div className="stat-card-label">Avg per Innings</div>
          </div>
        </div>

        {/* Bowling Statistics Table */}
        {loading ? (
          <div className="loading-analytics">
            <div className="loading-spinner-large"></div>
            <p className="loading-text">Loading bowling analysis...</p>
          </div>
        ) : sortedWickets.length === 0 ? (
          <div className="loading-analytics">
            <p className="loading-text">No bowling data found</p>
          </div>
        ) : (
          <div className="chart-card" style={{ marginTop: '2rem' }}>
            <div className="chart-header">
              <h3 className="chart-title">Bowler Performance</h3>
              <p className="chart-subtitle">{sortedWickets.length} bowlers analyzed</p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.1)' }}>
                    <th onClick={() => requestSort('bowler_name')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Bowler {sortConfig.key === 'bowler_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('total_wickets')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Wickets {sortConfig.key === 'total_wickets' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('total_innings')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Innings {sortConfig.key === 'total_innings' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => requestSort('rate')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Strike Rate {sortConfig.key === 'rate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedWickets.map((bowler, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.05)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200, 255, 58, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{bowler.bowler_name}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: bowler.total_wickets >= 20 ? 'rgba(34, 197, 94, 0.1)' : bowler.total_wickets >= 10 ? 'rgba(200, 255, 58, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                          border: `1px solid ${bowler.total_wickets >= 20 ? '#22c55e' : bowler.total_wickets >= 10 ? 'var(--color-accent-primary)' : 'rgba(160, 160, 160, 0.3)'}`,
                          borderRadius: '6px',
                          color: bowler.total_wickets >= 20 ? '#22c55e' : bowler.total_wickets >= 10 ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                          fontWeight: 700,
                          fontSize: '0.875rem'
                        }}>
                          {bowler.total_wickets}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{bowler.total_innings}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 600 }}>{bowler.rate}</td>
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

export default WicketAnalysis;
