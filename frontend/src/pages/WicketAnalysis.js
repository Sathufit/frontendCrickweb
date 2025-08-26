import React, { useEffect, useState } from "react";
import axios from "axios";

// Import the player stats data from Analyst component
import { playerStats } from "./Analyst";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyard.sathush.dev";

const WicketAnalysis = () => {
  const [wicketsData, setWicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rate', direction: 'descending' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Get the centuries and fifties data
  const [battingMilestones, setBattingMilestones] = useState([]);

  useEffect(() => {
    // Process the centuries and fifties data from Analyst
    const processMilestones = () => {
      const milestoneData = [];
      
      // Process centuries data
      if (playerStats && playerStats.mostCenturies) {
        playerStats.mostCenturies.forEach(player => {
          const existingPlayer = milestoneData.find(p => p.name === player.name);
          if (existingPlayer) {
            existingPlayer.centuries = player.centuries;
          } else {
            milestoneData.push({
              name: player.name,
              centuries: player.centuries,
              fifties: "0"
            });
          }
        });
      }
      
      // Process fifties data
      if (playerStats && playerStats.mostFifties) {
        playerStats.mostFifties.forEach(player => {
          const existingPlayer = milestoneData.find(p => p.name === player.name);
          if (existingPlayer) {
            existingPlayer.fifties = player.fifties;
          } else {
            milestoneData.push({
              name: player.name,
              centuries: "0",
              fifties: player.fifties
            });
          }
        });
      }
      
      setBattingMilestones(milestoneData);
    };
    
    processMilestones();
  }, []);

  // --- Data Fetching and Sorting Logic (Unchanged) ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          analysisMap[key].wickets += Number(w.wickets);
          analysisMap[key].innings += Number(w.innings);
        });
        const analysisArray = Object.entries(analysisMap).map(([name, stats]) => ({
          bowler_name: name,
          total_wickets: stats.wickets,
          total_innings: stats.innings,
          rate: stats.innings === 0 ? 0 : (stats.wickets / stats.innings).toFixed(2),
        }));
        sortAndSetData(analysisArray, 'rate', 'descending');
      } catch (err) {
        console.error("❌ Error fetching wicket analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWickets();
  }, []);

  const sortAndSetData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'bowler_name') {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      return direction === 'ascending' ? parseFloat(a[key]) - parseFloat(b[key]) : parseFloat(b[key]) - parseFloat(a[key]);
    });
    setWicketsData(sortedData);
  };

  const requestSort = (key) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'descending' ? 'ascending' : 'descending';
    setSortConfig({ key, direction: newDirection });
    sortAndSetData(wicketsData, key, newDirection);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return " ";
    return sortConfig.direction === 'ascending' ? "▲" : "▼";
  };

  // --- New UI Styles ---
  const palette = {
    primaryRed: '#D32F2F',
    primaryWhite: '#FFFFFF',
    background: '#F8F9FA',
    darkText: '#1a1a1a',
    lightText: '#6c757d',
    borderColor: '#e9ecef',
    shadow: 'rgba(211, 47, 47, 0.15)',
    hoverShadow: 'rgba(211, 47, 47, 0.25)',
  };

  const styles = {
    container: {
      backgroundColor: palette.background,
      minHeight: '100vh',
      padding: isMobile ? '1.5rem 1rem' : '3rem 2rem',
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    main: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    headerTitle: {
      fontSize: isMobile ? '2.5rem' : '3.5rem',
      fontWeight: 800,
      color: palette.darkText,
      letterSpacing: '-2px',
    },
    headerTitleSpan: {
      color: palette.primaryRed,
    },
    headerSubtitle: {
      color: palette.lightText,
      fontSize: isMobile ? '1rem' : '1.15rem',
      marginTop: '0.5rem',
      maxWidth: '500px',
      margin: '0.5rem auto 0',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem',
    },
    loader: {
        width: '50px',
        height: '50px',
        border: `5px solid ${palette.borderColor}`,
        borderTopColor: palette.primaryRed,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: palette.lightText,
        fontWeight: 500,
    },
    // Desktop List View Styles
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    listHeader: {
        display: 'grid',
        gridTemplateColumns: '50px 3fr 1fr 1fr 1fr',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        color: palette.lightText,
        fontWeight: 600,
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    headerCell: {
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color 0.2s ease',
    },
    headerCellHover: {
        color: palette.darkText,
    },
    playerRow: (index) => ({
        display: 'grid',
        gridTemplateColumns: '50px 3fr 1fr 1fr 1fr',
        alignItems: 'center',
        backgroundColor: palette.primaryWhite,
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: `0 4px 15px ${palette.shadow}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
        animationDelay: `${index * 0.05}s`,
    }),
    playerRowHover: {
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: `0 8px 25px ${palette.hoverShadow}`,
    },
    rank: {
        fontSize: '1rem',
        fontWeight: 700,
        color: palette.lightText,
    },
    playerName: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: palette.darkText,
    },
    playerStat: {
        fontSize: '1.1rem',
        fontWeight: 500,
        color: palette.darkText,
        textAlign: 'center',
    },
    playerRate: {
        fontWeight: 700,
        color: palette.primaryRed,
    },
    // Mobile Card View Styles
    cardsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    card: (index) => ({
        display: 'flex',
        backgroundColor: palette.primaryWhite,
        borderRadius: '12px',
        boxShadow: `0 4px 15px ${palette.shadow}`,
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
        animationDelay: `${index * 0.08}s`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }),
    cardHover: {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 25px ${palette.hoverShadow}`,
    },
    cardRank: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '60px',
        backgroundColor: palette.primaryRed,
        color: palette.primaryWhite,
        fontSize: '1.5rem',
        fontWeight: 700,
    },
    cardContent: {
        padding: '1rem',
        width: '100%',
    },
    cardName: {
        fontSize: '1.2rem',
        fontWeight: 700,
        color: palette.darkText,
        marginBottom: '1rem',
    },
    cardStats: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
    },
    statPill: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 0.75rem',
        borderRadius: '20px',
        backgroundColor: palette.borderColor,
        flex: 1,
    },
    statPillHighlight: {
        backgroundColor: palette.primaryRed,
    },
    statValue: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: palette.darkText,
    },
    statValueHighlight: {
        color: palette.primaryWhite,
    },
    statLabel: {
        fontSize: '0.7rem',
        fontWeight: 500,
        color: palette.lightText,
        textTransform: 'uppercase',
    },
    statLabelHighlight: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
  };

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  const renderDesktopList = () => (
    <div style={styles.listContainer}>
        <div style={styles.listHeader}>
            <div style={{...styles.headerCell, textAlign: 'center'}}>#</div>
            <div 
                style={styles.headerCell} 
                onClick={() => requestSort('bowler_name')} 
                onMouseOver={e => e.currentTarget.style.color = palette.darkText}
                onMouseOut={e => e.currentTarget.style.color = palette.lightText}
            >
                Bowler {getSortIcon('bowler_name')}
            </div>
            <div 
                style={{...styles.headerCell, textAlign: 'center'}} 
                onClick={() => requestSort('total_wickets')}
                onMouseOver={e => e.currentTarget.style.color = palette.darkText}
                onMouseOut={e => e.currentTarget.style.color = palette.lightText}
            >
                Wickets {getSortIcon('total_wickets')}
            </div>
            <div 
                style={{...styles.headerCell, textAlign: 'center'}} 
                onClick={() => requestSort('total_innings')}
                onMouseOver={e => e.currentTarget.style.color = palette.darkText}
                onMouseOut={e => e.currentTarget.style.color = palette.lightText}
            >
                Innings {getSortIcon('total_innings')}
            </div>
            <div 
                style={{...styles.headerCell, textAlign: 'center'}} 
                onClick={() => requestSort('rate')}
                onMouseOver={e => e.currentTarget.style.color = palette.darkText}
                onMouseOut={e => e.currentTarget.style.color = palette.lightText}
            >
                Rate {getSortIcon('rate')}
            </div>
        </div>
        {wicketsData.map((bowler, index) => (
            <div 
                key={index} 
                style={styles.playerRow(index)}
                onMouseOver={e => Object.assign(e.currentTarget.style, styles.playerRowHover)}
                onMouseOut={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${palette.shadow}`;
                }}
            >
                <div style={{...styles.rank, textAlign: 'center'}}>{index + 1}</div>
                <div style={styles.playerName}>{bowler.bowler_name}</div>
                <div style={styles.playerStat}>{bowler.total_wickets}</div>
                <div style={styles.playerStat}>{bowler.total_innings}</div>
                <div style={{...styles.playerStat, ...styles.playerRate}}>{bowler.rate}</div>
            </div>
        ))}
    </div>
  );

  const renderMobileCards = () => (
    <div style={styles.cardsContainer}>
        {wicketsData.map((bowler, index) => (
            <div 
                key={index}
                style={styles.card(index)}
                onMouseOver={e => Object.assign(e.currentTarget.style, styles.cardHover)}
                onMouseOut={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${palette.shadow}`;
                }}
            >
                <div style={styles.cardRank}>{index + 1}</div>
                <div style={styles.cardContent}>
                    <div style={styles.cardName}>{bowler.bowler_name}</div>
                    <div style={styles.cardStats}>
                        <div style={styles.statPill}>
                            <span style={styles.statValue}>{bowler.total_wickets}</span>
                            <span style={styles.statLabel}>Wkts</span>
                        </div>
                        <div style={styles.statPill}>
                            <span style={styles.statValue}>{bowler.total_innings}</span>
                            <span style={styles.statLabel}>Inns</span>
                        </div>
                        <div style={{...styles.statPill, ...styles.statPillHighlight}}>
                            <span style={{...styles.statValue, ...styles.statValueHighlight}}>{bowler.rate}</span>
                            <span style={{...styles.statLabel, ...styles.statLabelHighlight}}>Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div style={styles.container}>
        <main style={styles.main}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>
                    Wicket<span style={styles.headerTitleSpan}>Leaders</span>
                </h1>
                <p style={styles.headerSubtitle}>
                    An interactive leaderboard of bowler performance, ranked by wicket-taking rate.
                </p>
            </header>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.loader}></div>
                    <p style={styles.loadingText}>Calculating Rates...</p>
                </div>
            ) : (
                isMobile ? renderMobileCards() : renderDesktopList()
            )}
        </main>
    </div>
  );
};

export default WicketAnalysis;