import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/AnalyticsImproved.css';

// Player statistics data
export const playerStats = {
  topPerformance: {
    name: "Yamila Dilhara, Dinal Chamith, Dulshan Thanoj, Savindu Weerarathna, Ravindu Nanayakkara",
    achievement: "Highest Runs in a Single Inning",
    value: "237",
  },
  highestRuns: {
    name: "Chanuka de Silva",
    runs: "132*",
    image: "/images/1.2.JPG",
  },
  awayPerformance: {
    name: "Yamila Dilhara",
    fifties: "2",
    image: "/images/5.JPG",
  },
  highestPartnership: {
    players: "Yamila Dilhara and Dulshan Thanoj",
    runs: "149",
    image: "/images/partnership.jpg", 
  },
  mostCenturies: [
    { name: "Yamila Dilhara", centuries: "7", image: "/images/5.JPG" },
    { name: "Sathush Nanayakkara", centuries: "4", image: "/images/2.png" },
    { name: "Chanuka de Silva", centuries: "2", image: "/images/1.2.JPG" },
    { name: "Achala Shashvika", centuries: "1", image: "/images/8.png" },
  ],
  mostFifties: [
    { name: "Yamila Dilhara", fifties: "31", image: "/images/5.JPG" },
    { name: "Sathush Nanayakkara", fifties: "22", image: "/images/2.png" },
    { name: "Chanuka de Silva", fifties: "13", image: "/images/1.2.JPG" },
    { name: "Achala Shashvika", fifties: "11", image: "/images/8.png" },
    { name: "Dulshan Thanoj", fifties: "9", image: "/images/1.4.JPG" },
    { name: "Shanaka", fifties: "7", image: "/images/12.jpeg" },
    { name: "Savindu Weerarathna", fifties: "4", image: "/images/3.jpeg" },
    { name: "Nidula Lokuge", fifties: "4", image: "/images/" },
    { name: "Farhan Navufal", fifties: "1", image: "/images/7.jpg" },
    { name: "Dihindu Nimsath", fifties: "1", image: "/images/1.3.jpg" },
    { name: "Ravindu Nanayakkara", fifties: "1", image: "/images/" },
    { name: "Ayesh Jeewantha", fifties: "1", image: "/images/" },
    { name: "Reshan Kavinga", fifties: "1" }
  ]
};

const Analyst = () => {
  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h1 className="analytics-title">
            Player <span className="highlight">Analysis</span>
          </h1>
          <p className="analytics-subtitle">
            Comprehensive statistics and milestone achievements
          </p>
        </div>

        {/* Top Performance Card */}
        <div className="chart-card" style={{ marginBottom: '2rem' }}>
          <div className="chart-header">
            <h3 className="chart-title">Top Performance</h3>
            <p className="chart-subtitle">{playerStats.topPerformance.achievement}</p>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-accent-primary)', marginBottom: '1rem' }}>
              {playerStats.topPerformance.value}
            </div>
            <div style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
              {playerStats.topPerformance.name}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-overview" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Highest Runs */}
          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            {playerStats.highestRuns.image && (
              <img 
                src={playerStats.highestRuns.image} 
                alt={playerStats.highestRuns.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '1rem auto', display: 'block', border: '3px solid var(--color-accent-primary)' }}
              />
            )}
            <div className="stat-card-value">{playerStats.highestRuns.runs}</div>
            <div className="stat-card-label">Highest Individual Score</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {playerStats.highestRuns.name}
            </div>
          </div>

          {/* Away Performance */}
          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
            </div>
            {playerStats.awayPerformance.image && (
              <img 
                src={playerStats.awayPerformance.image} 
                alt={playerStats.awayPerformance.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '1rem auto', display: 'block', border: '3px solid var(--color-accent-primary)' }}
              />
            )}
            <div className="stat-card-value">{playerStats.awayPerformance.fifties}</div>
            <div className="stat-card-label">Away Fifties</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {playerStats.awayPerformance.name}
            </div>
          </div>

          {/* Partnership */}
          <div className="stat-card-analytics">
            <div className="stat-card-header">
              <div className="stat-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>
                </svg>
              </div>
            </div>
            <div className="stat-card-value">{playerStats.highestPartnership.runs}</div>
            <div className="stat-card-label">Highest Partnership</div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {playerStats.highestPartnership.players}
            </div>
          </div>
        </div>

        {/* Centuries Leaderboard */}
        <div className="leaderboard-section" style={{ marginTop: '3rem' }}>
          <div className="chart-header">
            <h3 className="chart-title">Most Centuries</h3>
            <p className="chart-subtitle">{playerStats.mostCenturies.length} players</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {playerStats.mostCenturies.map((player, index) => (
              <div key={index} className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(200, 255, 58, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                  {player.image && (
                    <img 
                      src={player.image} 
                      alt={player.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200, 255, 58, 0.3)' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{player.name}</div>
                  </div>
                  <div style={{ 
                    padding: '0.5rem 1rem',
                    background: 'rgba(200, 255, 58, 0.1)',
                    border: '1px solid var(--color-accent-primary)',
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: 'var(--color-accent-primary)'
                  }}>
                    {player.centuries}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fifties Leaderboard */}
        <div className="leaderboard-section" style={{ marginTop: '3rem' }}>
          <div className="chart-header">
            <h3 className="chart-title">Most Fifties</h3>
            <p className="chart-subtitle">{playerStats.mostFifties.length} players</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {playerStats.mostFifties.map((player, index) => (
              <div key={index} className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(200, 255, 58, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                  {player.image && (
                    <img 
                      src={player.image} 
                      alt={player.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200, 255, 58, 0.3)' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{player.name}</div>
                  </div>
                  <div style={{ 
                    padding: '0.5rem 1rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    fontWeight: 700,
                    color: '#22c55e'
                  }}>
                    {player.fifties}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyst;
