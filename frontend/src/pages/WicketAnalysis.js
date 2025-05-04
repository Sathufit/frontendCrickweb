// WicketAnalysis.js with inline styles
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";

const WicketAnalysis = () => {
  const [wicketsData, setWicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rate', direction: 'descending' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/wickets`);
        const data = response.data;

        // Group by bowler and aggregate
        const analysisMap = {};
        data.forEach(w => {
          const key = w.bowler_name;
          if (!analysisMap[key]) {
            analysisMap[key] = { wickets: 0, innings: 0 };
          }
          analysisMap[key].wickets += Number(w.wickets);
          analysisMap[key].innings += Number(w.innings);
        });

        // Convert to array and calculate rate
        const analysisArray = Object.entries(analysisMap).map(([name, stats]) => ({
          bowler_name: name,
          total_wickets: stats.wickets,
          total_innings: stats.innings,
          rate: stats.innings === 0 ? 0 : (stats.wickets / stats.innings).toFixed(2),
        }));

        // Sort by rate
        sortData(analysisArray, 'rate', 'descending');
        setWicketsData(analysisArray);
      } catch (err) {
        console.error("❌ Error fetching wicket analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWickets();
  }, []);

  const sortData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'bowler_name') {
        return direction === 'ascending' 
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else {
        return direction === 'ascending' 
          ? parseFloat(a[key]) - parseFloat(b[key])
          : parseFloat(b[key]) - parseFloat(a[key]);
      }
    });
    
    setWicketsData(sortedData);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortData(wicketsData, key, direction);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === 'ascending' ? "↑" : "↓";
  };

  // Styles object containing all the CSS
  const styles = {
    wicketAnalysis: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    headerTitle: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 700,
      color: '#0f2c5c',
      marginBottom: '0.5rem',
      position: 'relative',
      display: 'inline-block',
      paddingBottom: '15px'
    },
    headerTitleAfter: {
      content: '""',
      position: 'absolute',
      left: '0',
      bottom: '0',
      width: '100%',
      height: '4px',
      background: 'linear-gradient(90deg, #4caf50, #2196f3)',
      borderRadius: '2px'
    },
    subtitle: {
      color: '#666',
      fontSize: isMobile ? '1rem' : '1.1rem',
      marginTop: '1rem'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    },
    cricketLoader: {
      position: 'relative',
      width: '80px',
      height: '80px'
    },
    cricketBall: {
      position: 'absolute',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(45deg, #e53935, #e53935)',
      borderRadius: '50%',
      top: '20px',
      left: '20px',
      animation: 'cricketSpin 1.5s infinite cubic-bezier(0.65, 0.05, 0.36, 1)'
    },
    loadingText: {
      marginTop: '1.5rem',
      color: '#666',
      fontSize: '1rem'
    },
    tableContainer: {
      width: '100%',
      overflowX: 'auto',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      borderRadius: '10px',
      backgroundColor: 'white'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '1rem'
    },
    tableHeader: {
      backgroundColor: '#f5f7fa',
      padding: '1rem',
      textAlign: 'left',
      fontWeight: 600,
      color: '#0f2c5c',
      borderBottom: '2px solid #e1e5eb',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'background-color 0.2s'
    },
    tableHeaderHover: {
      backgroundColor: '#e9f0f7'
    },
    rankColumn: {
      width: '60px',
      textAlign: 'center'
    },
    tableRow: (index) => ({
      transition: 'background-color 0.2s, transform 0.2s',
      animation: 'fadeIn 0.5s ease-out forwards',
      opacity: 0,
      animationDelay: `${index * 0.05}s`,
      backgroundColor: index % 2 === 1 ? '#f9fafc' : 'transparent'
    }),
    tableRowHover: {
      backgroundColor: '#f0f7ff',
      transform: 'translateY(-2px)'
    },
    tableCell: {
      padding: '1rem',
      borderBottom: '1px solid #e1e5eb'
    },
    rateColumn: {
      fontWeight: 600,
      color: '#2e7d32'
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem'
    },
    card: (index) => ({
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      animation: 'fadeIn 0.5s ease-out forwards',
      opacity: 0,
      animationDelay: `${index * 0.1}s`,
      borderLeft: '4px solid #4caf50'
    }),
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)'
    },
    cardHeader: {
      padding: '1rem',
      background: 'linear-gradient(135deg, #f5f7fa, #e9f0f7)',
      display: 'flex',
      alignItems: 'center'
    },
    cardRank: {
      width: '30px',
      height: '30px',
      background: '#0f2c5c',
      borderRadius: '50%',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      marginRight: '10px'
    },
    cardName: {
      color: '#0f2c5c',
      margin: 0,
      fontSize: '1.2rem',
      fontWeight: 600
    },
    cardStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      padding: '1rem'
    },
    stat: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.5rem'
    },
    statHighlight: {
      backgroundColor: '#f9fff9',
      borderRadius: '8px'
    },
    statValue: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#333'
    },
    statValueHighlight: {
      color: '#2e7d32'
    },
    statLabel: {
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '4px'
    }
  };

  // Adding keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cricketSpin {
        0% { transform: rotate(0deg) translateX(0); }
        25% { transform: rotate(90deg) translateX(15px); }
        50% { transform: rotate(180deg) translateX(0); }
        75% { transform: rotate(270deg) translateX(-15px); }
        100% { transform: rotate(360deg) translateX(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderPlayerCards = () => {
    return (
      <div style={styles.cardsContainer}>
        {wicketsData.map((bowler, index) => (
          <div 
            key={index}
            style={styles.card(index)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = styles.cardHover.transform;
              e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.cardRank}>{index + 1}</div>
              <h3 style={styles.cardName}>{bowler.bowler_name}</h3>
            </div>
            <div style={styles.cardStats}>
              <div style={styles.stat}>
                <span style={styles.statValue}>{bowler.total_wickets}</span>
                <span style={styles.statLabel}>Wickets</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statValue}>{bowler.total_innings}</span>
                <span style={styles.statLabel}>Innings</span>
              </div>
              <div style={{...styles.stat, ...styles.statHighlight}}>
                <span style={{...styles.statValue, ...styles.statValueHighlight}}>{bowler.rate}</span>
                <span style={styles.statLabel}>Rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.tableHeader, ...styles.rankColumn}}>#</th>
              <th 
                style={styles.tableHeader}
                onClick={() => requestSort('bowler_name')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableHeaderHover.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.tableHeader.backgroundColor}
              >
                Bowler {getSortIcon('bowler_name')}
              </th>
              <th 
                style={styles.tableHeader}
                onClick={() => requestSort('total_wickets')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableHeaderHover.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.tableHeader.backgroundColor}
              >
                Wickets {getSortIcon('total_wickets')}
              </th>
              <th 
                style={styles.tableHeader}
                onClick={() => requestSort('total_innings')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableHeaderHover.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.tableHeader.backgroundColor}
              >
                Innings {getSortIcon('total_innings')}
              </th>
              <th 
                style={styles.tableHeader}
                onClick={() => requestSort('rate')}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.tableHeaderHover.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.tableHeader.backgroundColor}
              >
                Rate {getSortIcon('rate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {wicketsData.map((bowler, index) => (
              <tr 
                key={index} 
                style={styles.tableRow(index)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                  e.currentTarget.style.transform = styles.tableRowHover.transform;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 1 ? '#f9fafc' : 'transparent';
                  e.currentTarget.style.transform = '';
                }}
              >
                <td style={{...styles.tableCell, ...styles.rankColumn}}>{index + 1}</td>
                <td style={styles.tableCell}>{bowler.bowler_name}</td>
                <td style={styles.tableCell}>{bowler.total_wickets}</td>
                <td style={styles.tableCell}>{bowler.total_innings}</td>
                <td style={{...styles.tableCell, ...styles.rateColumn}}>{bowler.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.wicketAnalysis}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          Wicket Rate Analysis
          <div style={styles.headerTitleAfter}></div>
        </h1>
        <p style={styles.subtitle}>
          Comparing bowlers based on wickets taken per innings
        </p>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.cricketLoader}>
            <div style={styles.cricketBall}></div>
          </div>
          <p style={styles.loadingText}>Loading analysis...</p>
        </div>
      ) : (
        <div>
          {isMobile ? renderPlayerCards() : renderTable()}
        </div>
      )}
    </div>
  );
};

export default WicketAnalysis;