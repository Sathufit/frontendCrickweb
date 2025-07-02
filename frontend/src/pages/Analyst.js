import React from 'react';
// We'll use a popular icon library for a professional look.
// Make sure to run: npm install react-icons
import {
  FaTrophy,
  FaRegChartBar,
  FaUserFriends,
  FaPlaneDeparture,
  FaStar,
  FaListOl,
  FaDownload
} from 'react-icons/fa';

// --- Data remains the same ---
const playerStats = {
  topPerformance: {
    name: "Dulshan Thanoj",
    achievement: "Most dropped catches in a single match",
    value: "6",
    image: "/images/1.4.JPG",
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
    runs: "147",
    image: "/images/partnership.jpg", // A generic image for partnership
  },
  mostCenturies: [
    { name: "Sathush Nanayakkara", centuries: "4", image: "/images/2.png" },
    { name: "Chanuka de Silva", centuries: "2", image: "/images/1.2.JPG" },
    { name: "Yamila Dilhara", centuries: "2", image: "/images/5.JPG" },
    { name: "Achala Shashvika", centuries: "1", image: "/images/8.png" },
  ],
  mostFifties: [
    { name: "Yamila Dilhara", fifties: "25", image: "/images/5.JPG" },
    { name: "Sathush Nanayakkara", fifties: "16", image: "/images/2.png" },
    { name: "Chanuka de Silva", fifties: "10", image: "/images/1.2.JPG" },
    { name: "Achala Shashvika", fifties: "8", image: "/images/8.png" },
    { name: "Shanaka", fifties: "4", image: "/images/12.jpeg" },
    { name: "Dulshan Thanoj", fifties: "4", image: "/images/1.4.JPG" },
    { name: "Savindu Weerarathna", fifties: "4", image: "/images/3.jpeg" },
    { name: "Farhan Navufal", fifties: "1", image: "/images/7.jpg" },
    { name: "Dihindu Nimsath", fifties: "1", image: "/images/1.3.jpg" },
  ]
};

// --- Reusable UI Components ---

// A clean, modern card for highlighting a key statistic.
const StatCard = ({ icon, title, value, footerText, playerImage }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-title">{title}</div>
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-footer">
      <img src={playerImage} alt={footerText} className="stat-card-player-img" />
      <span>{footerText}</span>
    </div>
  </div>
);

// A compact list item for player rankings.
const PlayerListItem = ({ rank, image, name, statValue, statLabel }) => (
  <div className="player-list-item">
    <div className="player-info">
      <span className="player-rank">{rank}</span>
      <img src={image} alt={name} className="player-img" />
      <span className="player-name">{name}</span>
    </div>
    <div className="player-stat">
      {statValue} <span className="stat-label">{statLabel}</span>
    </div>
  </div>
);

// A simple, clean section container.
const Section = ({ title, icon, children, gridColumn }) => (
  <div className="section" style={{ gridColumn }}>
    <h2 className="section-title">
      {icon}
      <span>{title}</span>
    </h2>
    <div className="section-content">
      {children}
    </div>
  </div>
);


// --- Main Analyst Component ---

const Analyst = () => {
  const primaryRed = '#D92121';

  return (
    <>
      {/* 
        This <style> tag is a clean way to include component-specific CSS, 
        including responsiveness (media queries) and hover effects, all within 
        a single file as requested. It's more powerful and maintainable than
        inline styles for complex UI.
      */}
      <style>{`
        :root {
          --primary-red: ${primaryRed};
          --soft-red: #FFEBEB;
          --white: #FFFFFF;
          --background-gray: #F9FAFB;
          --text-dark: #1A1A1A;
          --text-light: #666666;
          --border-color: #EAEAEA;
        }

        .analyst-dashboard {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--background-gray);
          color: var(--text-dark);
          padding: 24px;
        }

        /* --- Header --- */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px 24px 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .dashboard-title {
          font-size: 28px;
          font-weight: 700;
        }
        .export-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--primary-red);
          color: var(--white);
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .export-button:hover {
          background-color: #b81c1c;
          transform: translateY(-2px);
        }

        /* --- Main Grid Layout --- */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        /* --- Section Styling --- */
        .section {
          background-color: var(--white);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07);
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px 0;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .section-title svg {
          color: var(--primary-red);
        }

        /* --- Stat Card Styling --- */
        .stat-card {
          background-color: var(--white);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
        }
        .stat-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-card-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          background-color: var(--soft-red);
          color: var(--primary-red);
          border-radius: 8px;
          font-size: 18px;
        }
        .stat-card-title {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-light);
        }
        .stat-card-value {
          font-size: 48px;
          font-weight: 700;
          color: var(--primary-red);
          line-height: 1;
        }
        .stat-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dark);
          margin-top: auto;
        }
        .stat-card-player-img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }
        
        /* --- Player List Item Styling --- */
        .player-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          transition: background-color 0.2s ease;
          border-radius: 8px;
        }
        .player-list-item:not(:last-child) {
          border-bottom: 1px solid var(--border-color);
        }
        .player-list-item:hover {
          background-color: var(--background-gray);
        }
        .player-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .player-rank {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-light);
          width: 20px;
          text-align: center;
        }
        .player-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .player-name {
          font-weight: 600;
        }
        .player-stat {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary-red);
          background-color: var(--soft-red);
          padding: 6px 12px;
          border-radius: 20px;
        }
        .player-stat .stat-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--primary-red);
          margin-left: 4px;
        }

        /* --- Responsive Design for Mobile --- */
        @media (max-width: 768px) {
          .analyst-dashboard {
            padding: 16px;
          }
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .dashboard-title {
            font-size: 24px;
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .section {
            padding: 16px;
          }
        }
      `}</style>
      
      <div className="analyst-dashboard">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Cricket Team Analytics</h1>
          <button className="export-button">
            <FaDownload />
            Export Report
          </button>
        </header>

        <main className="dashboard-grid">
          {/* Highlighted Single Stat Cards */}
          <StatCard
            icon={<FaTrophy />}
            title={playerStats.topPerformance.achievement}
            value={playerStats.topPerformance.value}
            footerText={playerStats.topPerformance.name}
            playerImage={playerStats.topPerformance.image}
          />
          <StatCard
            icon={<FaRegChartBar />}
            title="Highest Individual Score"
            value={playerStats.highestRuns.runs}
            footerText={playerStats.highestRuns.name}
            playerImage={playerStats.highestRuns.image}
          />
          <StatCard
            icon={<FaUserFriends />}
            title="Highest Partnership Runs"
            value={playerStats.highestPartnership.runs}
            footerText={playerStats.highestPartnership.players}
            playerImage={playerStats.highestPartnership.image}
          />
          <StatCard
            icon={<FaPlaneDeparture />}
            title="Most Fifties (Away)"
            value={playerStats.awayPerformance.fifties}
            footerText={playerStats.awayPerformance.name}
            playerImage={playerStats.awayPerformance.image}
          />

          {/* List-based Sections */}
          <Section title="Most Centuries" icon={<FaStar />}>
            {playerStats.mostCenturies.map((player, index) => (
              <PlayerListItem
                key={`century-${index}`}
                rank={index + 1}
                image={player.image}
                name={player.name}
                statValue={player.centuries}
                statLabel="100s"
              />
            ))}
          </Section>
          
          <Section title="Most Fifties" icon={<FaListOl />} gridColumn="1 / -1">
            {playerStats.mostFifties.map((player, index) => (
              <PlayerListItem
                key={`fifty-${index}`}
                rank={index + 1}
                image={player.image}
                name={player.name}
                statValue={player.fifties}
                statLabel="50s"
              />
            ))}
          </Section>
        </main>
      </div>
    </>
  );
};

export default Analyst;