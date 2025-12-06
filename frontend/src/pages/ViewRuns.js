import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchRuns } from "../api";
import "../styles/AnalyticsImproved.css";

const ViewRuns = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'runs', direction: 'descending' });
  const [filterVenue, setFilterVenue] = useState('all');
  const [filterInnings, setFilterInnings] = useState('all');

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    setLoading(true);
    try {
      const data = await fetchRuns();
      console.log("Runs API response:", data);
      
      // Ensure we always set an array
      if (Array.isArray(data)) {
        setRuns(data);
      } else if (data && Array.isArray(data.runs)) {
        setRuns(data.runs);
      } else {
        console.error("Invalid runs data format:", data);
        setRuns([]);
      }
    } catch (error) {
      console.error("Error fetching runs:", error);
      setRuns([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const sortedRuns = React.useMemo(() => {
    // Ensure runs is always an array
    if (!Array.isArray(runs)) {
      console.warn("runs is not an array:", runs);
      return [];
    }
    
    let sortableRuns = [...runs];
    
    // Apply filters
    if (filterVenue !== 'all') {
      sortableRuns = sortableRuns.filter(run => run.venue === filterVenue);
    }
    if (filterInnings !== 'all') {
      sortableRuns = sortableRuns.filter(run => run.innings === filterInnings);
    }

    // Apply sorting
    if (sortConfig.key) {
      sortableRuns.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableRuns;
  }, [runs, sortConfig, filterVenue, filterInnings]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const venues = Array.isArray(runs) ? [...new Set(runs.map(run => run.venue))] : [];
  const totalRuns = sortedRuns.reduce((sum, run) => sum + (run.runs || 0), 0);
  const highestScore = sortedRuns.length > 0 ? Math.max(...sortedRuns.map(r => r.runs || 0)) : 0;
  const centuries = sortedRuns.filter(run => run.runs >= 100).length;
  const fifties = sortedRuns.filter(run => run.runs >= 50 && run.runs < 100).length;

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <h1 className="analytics-title">
            Batting <span className="highlight">Records</span>
          </h1>
          <p className="analytics-subtitle">
            Complete batting statistics and performance records
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{totalRuns}</div>
            <div className="stat-card-label">Total Runs</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{highestScore}</div>
            <div className="stat-card-label">Highest Score</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{centuries}</div>
            <div className="stat-card-label">Centuries</div>
          </div>

          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{fifties}</div>
            <div className="stat-card-label">Half Centuries</div>
          </div>
        </div>

        {/* Filters */}
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

        {/* Data Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading batting records...</p>
          </div>
        ) : sortedRuns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3 className="empty-state-title">No Records Found</h3>
            <p className="empty-state-text">No batting records match your current filters</p>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className={`sortable ${sortConfig.key === 'batter_name' ? `sorted-${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''}`} onClick={() => requestSort('batter_name')}>
                    Batsman
                  </th>
                  <th className={`sortable ${sortConfig.key === 'runs' ? `sorted-${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''}`} onClick={() => requestSort('runs')}>
                    Runs
                  </th>
                  <th className={`sortable ${sortConfig.key === 'venue' ? `sorted-${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''}`} onClick={() => requestSort('venue')}>
                    Venue
                  </th>
                  <th className={`sortable ${sortConfig.key === 'innings' ? `sorted-${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''}`} onClick={() => requestSort('innings')}>
                    Innings
                  </th>
                  <th className={`sortable ${sortConfig.key === 'date' ? `sorted-${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}` : ''}`} onClick={() => requestSort('date')}>
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRuns.map((run, index) => (
                  <tr key={index}>
                    <td>{run.batter_name}</td>
                    <td>
                      {run.runs >= 100 ? (
                        <span className="highlight-badge">{run.runs}*</span>
                      ) : run.runs >= 50 ? (
                        <span className="highlight-badge" style={{background: 'rgba(200, 255, 58, 0.1)', borderColor: 'rgba(200, 255, 58, 0.2)'}}>{run.runs}</span>
                      ) : (
                        <span style={{fontWeight: 600}}>{run.runs}</span>
                      )}
                    </td>
                    <td>{run.venue}</td>
                    <td>{run.innings}</td>
                    <td>{new Date(run.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRuns;
