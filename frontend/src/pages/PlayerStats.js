import React, { useEffect, useState } from "react";
// This uses your actual API function.
import { fetchPlayerStats } from "../api";

const PlayerStats = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'average', direction: 'descending' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- UI Theme and Styles (Unchanged) ---
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
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    listHeader: {
        display: 'grid',
        gridTemplateColumns: '50px 3fr repeat(4, 1fr)',
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
    playerRow: (index) => ({
        display: 'grid',
        gridTemplateColumns: '50px 3fr repeat(4, 1fr)',
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
    playerAverage: {
        fontWeight: 700,
        color: palette.primaryRed,
    },
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

  // --- Hooks and Logic ---

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
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

    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(styleTag);
    }
  }, []);

  useEffect(() => {
    const loadPlayerStats = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayerStats();
        // --- KEY CHANGE: Process data to calculate the average ---
        const processedData = (Array.isArray(data) ? data : []).map(player => {
            // Calculate the average. If outs are 0, the average is technically infinite.
            // We use Infinity for correct sorting (higher is better).
            // If player has 0 runs and 0 outs, average is 0.
            const calculatedAverage = player.totalOuts > 0
                ? (player.totalRuns / player.totalOuts)
                : (player.totalRuns > 0 ? Infinity : 0);

            return {
                ...player,
                average: calculatedAverage // Overwrite the average property with our calculation
            };
        });
        
        sortAndSetData(processedData, sortConfig.key, sortConfig.direction);
      } catch (error) {
        console.error("❌ Error fetching player stats:", error);
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
      // This logic correctly handles numbers and Infinity for sorting
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
    if (sortConfig.key !== key) return " ";
    return sortConfig.direction === 'ascending' ? "▲" : "▼";
  };

  // --- Render Functions for Desktop and Mobile ---

  const renderDesktopList = () => (
    <div style={styles.listContainer}>
        <div style={styles.listHeader}>
            <div style={{...styles.headerCell, textAlign: 'center'}}>#</div>
            <div style={styles.headerCell} onClick={() => requestSort('name')}>
                Player {getSortIcon('name')}
            </div>
            <div style={{...styles.headerCell, textAlign: 'center'}} onClick={() => requestSort('totalRuns')}>
                Runs {getSortIcon('totalRuns')}
            </div>
            <div style={{...styles.headerCell, textAlign: 'center'}} onClick={() => requestSort('totalInnings')}>
                Inns {getSortIcon('totalInnings')}
            </div>
            <div style={{...styles.headerCell, textAlign: 'center'}} onClick={() => requestSort('totalOuts')}>
                Outs {getSortIcon('totalOuts')}
            </div>
            <div style={{...styles.headerCell, textAlign: 'center'}} onClick={() => requestSort('average')}>
                Avg {getSortIcon('average')}
            </div>
        </div>
        {statsData.map((player, index) => {
            // --- KEY CHANGE: Format the average for display ---
            const displayAverage = player.average === Infinity ? 'N/A' : Number(player.average).toFixed(1);
            return (
                <div
                    key={player._id || index}
                    style={styles.playerRow(index)}
                    onMouseOver={e => Object.assign(e.currentTarget.style, styles.playerRowHover)}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${palette.shadow}`;
                    }}
                >
                    <div style={{...styles.rank, textAlign: 'center'}}>{index + 1}</div>
                    <div style={styles.playerName}>{player.name}</div>
                    <div style={styles.playerStat}>{player.totalRuns}</div>
                    <div style={styles.playerStat}>{player.totalInnings}</div>
                    <div style={styles.playerStat}>{player.totalOuts}</div>
                    <div style={{...styles.playerStat, ...styles.playerAverage}}>{displayAverage}</div>
                </div>
            )
        })}
    </div>
  );

  const renderMobileCards = () => (
    <div style={styles.cardsContainer}>
        {statsData.map((player, index) => {
            // --- KEY CHANGE: Format the average for display ---
            const displayAverage = player.average === Infinity ? 'N/A' : Number(player.average).toFixed(1);
            return (
                <div
                    key={player._id || index}
                    style={styles.card(index)}
                    onMouseOver={e => Object.assign(e.currentTarget.style, styles.cardHover)}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${palette.shadow}`;
                    }}
                >
                    <div style={styles.cardRank}>{index + 1}</div>
                    <div style={styles.cardContent}>
                        <div style={styles.cardName}>{player.name}</div>
                        <div style={styles.cardStats}>
                            <div style={styles.statPill}>
                                <span style={styles.statValue}>{player.totalRuns}</span>
                                <span style={styles.statLabel}>Runs</span>
                            </div>
                            <div style={styles.statPill}>
                                <span style={styles.statValue}>{player.totalInnings}</span>
                                <span style={styles.statLabel}>Inns</span>
                            </div>
                            <div style={{...styles.statPill, ...styles.statPillHighlight}}>
                                <span style={{...styles.statValue, ...styles.statValueHighlight}}>{displayAverage}</span>
                                <span style={{...styles.statLabel, ...styles.statLabelHighlight}}>Average</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
  );

  // --- Main Component Return ---

  return (
    <div style={styles.container}>
        <main style={styles.main}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>
                    Batting<span style={styles.headerTitleSpan}>Leaders</span>
                </h1>
                <p style={styles.headerSubtitle}>
                    An interactive leaderboard of player batting performance, ranked by average.
                </p>
            </header>

            {loading ? (
                <div style={styles.loadingContainer}>
                    <div style={styles.loader}></div>
                    <p style={styles.loadingText}>Calculating Averages...</p>
                </div>
            ) : (
                isMobile ? renderMobileCards() : renderDesktopList()
            )}
        </main>
    </div>
  );
};

export default PlayerStats;