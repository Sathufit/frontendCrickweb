import React from 'react';
import { Link } from "react-router-dom";

const Analyst = () => {
  // Sample data for the cricket analytics
  const playerStats = {
    topPerformance: {
      name: "Dulshan Thanoj",
      achievement: "Most dropped catches in a single match",
      value: "6",
      image: "/images/1.4.JPG",
      color: "#FF6B6B" // Red shade
    },
    highestRuns: {
      name: "Chanuka de Silva",
      runs: "132*",
      image: "/images/1.2.JPG",
      color: "#4ECDC4" // Teal shade
    },
    awayPerformance: {
      name: "Yamila Dilhara",
      fifties: "2",
      image: "/images/5.JPG",
      color: "#6A0572" // Purple shade
    },
    highestPartnership: {
      players: "Yamila Dilhara and Dulshan Thanoj",
      runs: "147",
      image: "/images/5.JPG",
      color: "#1A936F" // Green shade
    },
    mostCenturies: [
      { name: "Sathush Nanayakkara", centuries: "4", image: "/images/2.png", color: "#3A86FF" }, // Blue shade
      { name: "Chanuka de Silva", centuries: "2", image: "/images/1.2.JPG", color: "#FF006E" }, // Pink shade
      { name: "Yamila Dilhara", centuries: "2", image: "/images/5.JPG", color: "#8338EC" }, // Purple shade
      { name: "Achala Shashvika", centuries: "1", image: "/images/8.png", color: "#FB5607" } // Orange shade
    ],
    mostFifties: [
      { name: "Yamila Dilhara", fifties: "25", image: "/images/5.JPG", color: "#06D6A0" }, // Mint shade
      { name: "Sathush Nanayakkara", fifties: "16", image: "/images/2.png", color: "#118AB2" }, // Blue shade
      { name: "Achala Shashvika", fifties: "8", image: "/images/8.png", color: "#06D6A0" }, // Mint shade
      { name: "Chanuka de Silva", fifties: "8", image: "/images/1.2.JPG", color: "#EF476F" }, // Pink shade
      { name: "Shanaka", fifties: "4", image: "https://via.placeholder.com/150", color: "#FF6B6B" }, // Red shade
      { name: "Dulshan Thanoj", fifties: "4", image: "/images/1.4.JPG", color: "#073B4C" }, // Dark blue shade
      { name: "Savindu Weerarathna", fifties: "3", image: "/images/3.jpeg", color: "#FFD166" }, // Yellow shade
      { name: "Farhan Navufal", fifties: "1", image: "/images/7.jpg", color: "#9B5DE5" },
      { name: "Dihindu Nimsath", fifties: "1", image: "/images/1.3.jpg", color: "#9B5DE5" }
    ] 
  };

  // Player card component with colorful styling
  const PlayerCard = ({ image, name, statTitle, statValue, color }) => (
    <div style={{
      display: 'flex',
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
      alignItems: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      borderLeft: `6px solid ${color}`,
    }} className="player-card" 
       onMouseOver={(e) => {
         e.currentTarget.style.transform = 'translateY(-5px)';
         e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.15)`;
       }} 
       onMouseOut={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.1)`;
       }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        overflow: 'hidden',
        marginRight: '16px',
        flexShrink: 0,
        border: `3px solid ${color}`,
      }}>
        <img src={image} alt={name} style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }} />
      </div>
      <div>
        <h3 style={{
          margin: '0 0 8px 0',
          color: '#2c3e50',
          fontSize: '16px',
          fontWeight: 'bold',
        }}>{name}</h3>
        <p style={{
          margin: '0',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ 
            backgroundColor: color,
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            marginRight: '8px',
            fontSize: '12px',
          }}>{statTitle}</span>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: color,
          }}>{statValue}</span>
        </p>
      </div>
    </div>
  );

  // Section component for consistent styling with color themes
  const StatsSection = ({ title, children, color }) => (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
      }}></div>
      <h2 style={{
        color: color,
        fontSize: '20px',
        marginTop: '8px',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #f0f0f0',
        fontWeight: 'bold',
      }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        background: 'linear-gradient(90deg, #2c3e50 0%, #4c6279 100%)',
        padding: '20px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '28px',
          margin: '0',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
        }}>Cricket Team Analytics</h1>
        <div style={{
          background: 'linear-gradient(90deg, #3498db 0%, #2980b9 100%)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
        }} onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        }} onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        }}>
          Export Report
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px',
      }}>
        <StatsSection title="Top Performance" color={playerStats.topPerformance.color}>
          <PlayerCard 
            image={playerStats.topPerformance.image}
            name={playerStats.topPerformance.name}
            statTitle={playerStats.topPerformance.achievement}
            statValue={playerStats.topPerformance.value}
            color={playerStats.topPerformance.color}
          />
        </StatsSection>

        <StatsSection title="Highest Runs" color={playerStats.highestRuns.color}>
          <PlayerCard 
            image={playerStats.highestRuns.image}
            name={playerStats.highestRuns.name}
            statTitle="Runs"
            statValue={playerStats.highestRuns.runs}
            color={playerStats.highestRuns.color}
          />
        </StatsSection>

        <StatsSection title="Away Performance" color={playerStats.awayPerformance.color}>
          <PlayerCard 
            image={playerStats.awayPerformance.image}
            name={playerStats.awayPerformance.name}
            statTitle="50s"
            statValue={playerStats.awayPerformance.fifties}
            color={playerStats.awayPerformance.color}
          />
        </StatsSection>

        <StatsSection title="Highest Partnership" color={playerStats.highestPartnership.color}>
          <PlayerCard 
            image={playerStats.highestPartnership.image}
            name={playerStats.highestPartnership.players}
            statTitle="Total Runs"
            statValue={playerStats.highestPartnership.runs}
            color={playerStats.highestPartnership.color}
          />
        </StatsSection>

        <StatsSection title="Most Centuries" color="#3A86FF">
          {playerStats.mostCenturies.map((player, index) => (
            <PlayerCard 
              key={`century-${index}`}
              image={player.image}
              name={player.name}
              statTitle="100s"
              statValue={player.centuries}
              color={player.color}
            />
          ))}
        </StatsSection>

        <StatsSection title="Most Fifties" color="#06D6A0" style={{ gridColumn: '1 / -1' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {playerStats.mostFifties.map((player, index) => (
              <PlayerCard 
                key={`fifty-${index}`}
                image={player.image}
                name={player.name}
                statTitle="50s"
                statValue={player.fifties}
                color={player.color}
              />
            ))}
          </div>
        </StatsSection>
      </div>
    </div>
  );
};

export default Analyst;