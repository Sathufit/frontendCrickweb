import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchPlayerStats } from "../api";
import "../styles/AnalyticsImproved.css";

const PlayerStats = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'average', direction: 'descending' });

  const playerMilestones = {
    mostCenturies: [
      { name: "Yamila Dilhara", centuries: "7" },
      { name: "Sathush Nanayakkara", centuries: "4" },
      { name: "Chanuka de Silva", centuries: "2" },
      { name: "Achala Shashvika", centuries: "1" }
    ],
    mostFifties: [
      { name: "Yamila Dilhara", fifties: "31" },
      { name: "Sathush Nanayakkara", fifties: "22" },
      { name: "Chanuka de Silva", fifties: "13" },
      { name: "Achala Shashvika", fifties: "11" },
      { name: "Dulshan Thanoj", fifties: "9" },
      { name: "Dinal Chamith", fifties: "7" },
      { name: "Savindu Weerarathna", fifties: "4" },
      { name: "Nidula Hansaja", fifties: "4" },
      { name: "Farhan Navufal", fifties: "1" },
      { name: "Dihindu Nimsath", fifties: "1" },
      { name: "Ravindu Nanayakkara", fifties: "1" },
      { name: "Ayesh Jeewantha", fifties: "1" },
      { name: "Reshan Kavinga", fifties: "1" }
    ]
  };

  useEffect(() => {
    const loadPlayerStats = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayerStats();
        const processedData = (Array.isArray(data) ? data : []).map(player => {
          const calculatedAverage = player.totalOuts > 0
            ? (player.totalRuns / player.totalOuts)
            : (player.totalRuns > 0 ? Infinity : 0);

          const centuriesData = playerMilestones.mostCenturies.find(p => p.name === player.name);
          const fiftiesData = playerMilestones.mostFifties.find(p => p.name === player.name);

          return {
            ...player,
            average: calculatedAverage,
            centuries: centuriesData ? centuriesData.centuries : "0",
            fifties: fiftiesData ? fiftiesData.fifties : "0"
          };
        });
        
        sortAndSetData(processedData, sortConfig.key, sortConfig.direction);
      } catch (error) {
        console.error("Error fetching player stats:", error);
        setStatsData([]);
      } finally {
        setLoading(false);
      }
    };
    loadPlayerStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortAndSetData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'name') {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      const valA = a[key];
      const valB = b[key];
      if (valA < valB) return direction === 'ascending' ? -1 : 1;
      if (valA > valB) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setStatsData(sortedData);
  };

  const requestSort = (key) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'descending' ? 'ascending' : 'descending';
    setSortConfig({ key, direction: newDirection });
    sortAndSetData(statsData, key, newDirection);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === 'ascending' ? " ↑" : " ↓";
  };

  const topBatsman = statsData[0];
  const totalRuns = statsData.reduce((sum, p) => sum + (p.totalRuns || 0), 0);
  const totalCenturies = statsData.reduce((sum, p) => sum + (parseInt(p.centuries) || 0), 0);
  const totalFifties = statsData.reduce((sum, p) => sum + (parseInt(p.fifties) || 0), 0);

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h1 className="analytics-title">
            Player <span className="highlight">Statistics</span>
          </h1>
          <p className="analytics-subtitle">
            Interactive leaderboard of player batting performance
          </p>
        </div>

        {loading ? (
          <div className="loading-analytics">
            <div className="loading-spinner-large"></div>
            <p className="loading-text">Loading player statistics...</p>
          </div>
        ) : (
          <>
            <div className="stats-overview">
              <div className="stat-card-analytics">
                <div className="stat-card-header">
                  <div className="stat-card-icon">👑</div>
                </div>
                <div className="stat-card-value">{topBatsman ? topBatsman.name.split(' ')[0] : '-'}</div>
                <div className="stat-card-label">Top Batsman</div>
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
                <div className="stat-card-value">{totalRuns}</div>
                <div className="stat-card-label">Total Runs</div>
              </div>

              <div className="stat-card-analytics">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                      <path d="M4 22h16"/>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                    </svg>
                  </div>
                </div>
                <div className="stat-card-value">{totalCenturies}</div>
                <div className="stat-card-label">Centuries</div>
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
                <div className="stat-card-value">{totalFifties}</div>
                <div className="stat-card-label">Half Centuries</div>
              </div>
            </div>

            <div className="leaderboard-section">
              <div className="leaderboard-header">
                <h2 className="leaderboard-title">Batting Leaders</h2>
                <div className="leaderboard-tabs">
                  <button className="tab-button active">All Players</button>
                </div>
              </div>

              <div className="chart-card">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.1)' }}>
                        <th style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', width: '60px' }}>#</th>
                        <th onClick={() => requestSort('name')} style={{ padding: '16px', textAlign: 'left', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Player{getSortIcon('name')}
                        </th>
                        <th onClick={() => requestSort('totalRuns')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Runs{getSortIcon('totalRuns')}
                        </th>
                        <th onClick={() => requestSort('totalInnings')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Inns{getSortIcon('totalInnings')}
                        </th>
                        <th onClick={() => requestSort('totalOuts')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Outs{getSortIcon('totalOuts')}
                        </th>
                        <th onClick={() => requestSort('average')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Avg{getSortIcon('average')}
                        </th>
                        <th onClick={() => requestSort('fifties')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          50s{getSortIcon('fifties')}
                        </th>
                        <th onClick={() => requestSort('centuries')} style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          100s{getSortIcon('centuries')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statsData.map((player, index) => {
                        const displayAverage = player.average === Infinity ? 'N/A' : Number(player.average).toFixed(1);
                        return (
                          <tr 
                            key={player._id || index} 
                            style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.05)', transition: 'background 0.2s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200, 255, 58, 0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 700 }}>{index + 1}</td>
                            <td style={{ padding: '16px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{player.name}</td>
                            <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-primary)', fontWeight: 600 }}>{player.totalRuns}</td>
                            <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{player.totalInnings}</td>
                            <td style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{player.totalOuts}</td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: 'rgba(200, 255, 58, 0.1)',
                                border: '1px solid var(--color-accent-primary)',
                                borderRadius: '6px',
                                color: 'var(--color-accent-primary)',
                                fontWeight: 700,
                                fontSize: '0.875rem'
                              }}>
                                {displayAverage}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '32px',
                                height: '32px',
                                lineHeight: '32px',
                                borderRadius: '50%',
                                background: parseInt(player.fifties) > 0 ? 'rgba(200, 255, 58, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                                border: `1px solid ${parseInt(player.fifties) > 0 ? 'var(--color-accent-primary)' : 'rgba(160, 160, 160, 0.3)'}`,
                                color: parseInt(player.fifties) > 0 ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                                fontWeight: 700,
                                fontSize: '0.875rem'
                              }}>
                                {player.fifties}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '32px',
                                height: '32px',
                                lineHeight: '32px',
                                borderRadius: '50%',
                                background: parseInt(player.centuries) > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                                border: `1px solid ${parseInt(player.centuries) > 0 ? '#22c55e' : 'rgba(160, 160, 160, 0.3)'}`,
                                color: parseInt(player.centuries) > 0 ? '#22c55e' : 'var(--color-text-secondary)',
                                fontWeight: 700,
                                fontSize: '0.875rem'
                              }}>
                                {player.centuries}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerStats;
