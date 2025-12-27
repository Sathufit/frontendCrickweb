import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0C0C0C',
    paddingBottom: '80px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 16px 60px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(200, 255, 58, 0.2)',
    borderTopColor: '#C8FF3A',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  btnBack: {
    marginTop: '20px',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #C8FF3A 0%, #B4FF00 100%)',
    color: '#0C0C0C',
    border: 'none',
    borderRadius: '50px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    padding: 'clamp(16px, 3vw, 24px)',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    gap: '16px',
    flexWrap: 'wrap',
  },
  btnBackSmall: {
    padding: '8px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    color: '#F2F2F2',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  titleSection: {
    flex: 1,
    textAlign: 'center',
    minWidth: '200px',
  },
  matchTitle: {
    fontSize: 'clamp(20px, 4vw, 32px)',
    fontWeight: '800',
    color: '#F2F2F2',
    marginBottom: '6px',
  },
  matchTeams: {
    fontSize: 'clamp(14px, 2.5vw, 18px)',
    color: '#999999',
    fontWeight: '500',
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(200, 255, 58, 0.15)',
    color: '#C8FF3A',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pulseDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#C8FF3A',
    boxShadow: '0 0 10px #C8FF3A',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  statusBanner: {
    padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
    background: 'linear-gradient(135deg, rgba(200, 255, 58, 0.1) 0%, rgba(180, 255, 0, 0.1) 100%)',
    border: '1px solid rgba(200, 255, 58, 0.2)',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    color: '#C8FF3A',
    fontWeight: '600',
  },
  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '28px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  tab: {
    padding: 'clamp(12px, 2vw, 16px) clamp(20px, 3vw, 32px)',
    background: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#999999',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    color: '#C8FF3A',
    borderBottomColor: '#C8FF3A',
  },
  scorePanel: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: 'clamp(20px, 3vw, 32px)',
    marginBottom: '20px',
  },
  scoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  scoreMain: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  runsWickets: {
    fontSize: '56px',
    fontWeight: '900',
    color: '#F2F2F2',
    letterSpacing: '-0.02em',
  },
  oversDisplay: {
    fontSize: '18px',
    color: '#999999',
    marginTop: '8px',
  },
  runRateInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  rateItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: '14px',
    color: '#666666',
    fontWeight: '600',
  },
  rateValue: {
    fontSize: '16px',
    color: '#C8FF3A',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: '14px',
    color: '#999999',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginBottom: '12px',
  },
  item: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    color: '#F2F2F2',
    fontSize: '15px',
    marginBottom: '8px',
  },
  ballsContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  ball: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontSize: '14px',
    fontWeight: '700',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#F2F2F2',
  },
  ballDot: {
    background: 'rgba(153, 153, 153, 0.2)',
    color: '#999999',
  },
  ballFour: {
    background: 'rgba(200, 255, 58, 0.15)',
    border: '1px solid #C8FF3A',
    color: '#C8FF3A',
  },
  ballSix: {
    background: 'linear-gradient(135deg, #C8FF3A 0%, #B4FF00 100%)',
    color: '#0C0C0C',
  },
  ballWicket: {
    background: 'rgba(255, 82, 82, 0.15)',
    border: '1px solid #FF5252',
    color: '#FF5252',
  },
  ballExtra: {
    background: 'rgba(255, 193, 7, 0.15)',
    border: '1px solid #FFC107',
    color: '#FFC107',
  },
  statsSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
  },
  statsTable: {
    width: '100%',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr repeat(5, 1fr)',
    gap: '16px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px 8px 0 0',
    fontSize: '13px',
    fontWeight: '700',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr repeat(5, 1fr)',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '15px',
    color: '#F2F2F2',
  },
  tableRowActive: {
    background: 'rgba(200, 255, 58, 0.05)',
  },
  colName: {
    fontWeight: '600',
  },
  colStat: {
    textAlign: 'center',
    color: '#999999',
  },
  battingBadge: {
    display: 'inline-block',
    marginLeft: '8px',
    padding: '2px 6px',
    background: '#C8FF3A',
    color: '#0C0C0C',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '32px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: '15px',
    color: '#666666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '15px',
    color: '#F2F2F2',
    fontWeight: '600',
  },
  infoResult: {
    color: '#C8FF3A',
    fontWeight: '700',
  },
};

const LiveMatchViewer = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scorecard");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) {
      setError("Match ID not provided");
      setLoading(false);
      return;
    }

    // Real-time listener for specific match document
    const matchDoc = doc(db, "matches", matchId);
    
    const unsubscribe = onSnapshot(
      matchDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          setMatch({ id: docSnap.id, ...docSnap.data() });
          setLoading(false);
        } else {
          setError("Match not found");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching match:", err);
        setError("Failed to load match data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [matchId]);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={{ color: '#999999', fontSize: '16px' }}>Loading match data...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <h2 style={{ fontSize: '28px', color: '#F2F2F2', marginBottom: '12px' }}>
              {error || "Match not found"}
            </h2>
            <button 
              style={styles.btnBack}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => navigate("/live-matches")}
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper functions
  const getTeamName = (title) => {
    if (!title) return "Team";
    return title.split(" - ")[0].trim();
  };

  const getCurrentOvers = (oversStr) => {
    if (!oversStr) return "0.0";
    const match = oversStr.match(/Overs:\s*([\d.]+)/);
    return match ? match[1] : "0.0";
  };

  const getRunRate = (rrStr) => {
    if (!rrStr) return "0.00";
    const matchResult = rrStr.match(/Rate:\s*([\d.]+)/);
    return matchResult ? matchResult[1] : "0.00";
  };

  const parseBatsmen = (batsman1, batsman2) => {
    const batsmen = [];
    if (batsman1) batsmen.push(batsman1);
    if (batsman2) batsmen.push(batsman2);
    return batsmen;
  };

  const parseCurrentOver = (overStr) => {
    if (!overStr) return [];
    // "This Over: 0 4 0 3" -> ["0", "4", "0", "3"]
    const match = overStr.match(/This Over:\s*(.+)/);
    if (match) {
      return match[1].trim().split(/\s+/);
    }
    return [];
  };

  const getBallClass = (ball) => {
    const b = ball.toUpperCase();
    if (b === 'W') return { ...styles.ball, ...styles.ballWicket };
    if (b === '4') return { ...styles.ball, ...styles.ballFour };
    if (b === '6') return { ...styles.ball, ...styles.ballSix };
    if (b.includes('WD') || b.includes('NB')) return { ...styles.ball, ...styles.ballExtra };
    if (b === '0') return { ...styles.ball, ...styles.ballDot };
    return styles.ball;
  };

  const battingTeam = getTeamName(match.battingCardTitle);
  const bowlingTeam = getTeamName(match.bowlingCardTitle);
  const currentOvers = getCurrentOvers(match.overs);
  const runRate = getRunRate(match.runRate);
  const currentBatsmen = parseBatsmen(match.batsman1, match.batsman2);
  const overBalls = parseCurrentOver(match.currentOver);

  const ScoreboardTab = () => {
    const hasResult = match.result && match.result.trim() !== "";
    const hasWonMessage = match.leadTrail && (match.leadTrail.includes("won") || match.leadTrail.includes("Won"));
    const isLive = !hasResult && !hasWonMessage;

    return (
      <div>
        {/* Current Score */}
        <div style={styles.scorePanel}>
          <div style={styles.scoreHeader}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#F2F2F2', margin: 0 }}>
              {battingTeam}
            </h2>
            {isLive && (
              <span style={styles.liveBadge}>
                <span style={styles.pulseDot}></span> LIVE
              </span>
            )}
          </div>
          
          <div style={styles.scoreMain}>
            <div style={styles.runsWickets}>
              {match.score || "0/0"}
            </div>
            <div style={styles.oversDisplay}>
              ({currentOvers} overs)
            </div>
          </div>

          <div style={styles.runRateInfo}>
            <div style={styles.rateItem}>
              <span style={styles.rateLabel}>Run Rate:</span>
              <span style={styles.rateValue}>{runRate}</span>
            </div>
          </div>

          {/* Current Batsmen */}
          {currentBatsmen.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={styles.sectionTitle}>At Crease:</h4>
              {currentBatsmen.map((batsman, idx) => (
                <div key={idx} style={styles.item}>
                  {batsman}
                </div>
              ))}
            </div>
          )}

          {/* Current Bowler */}
          {match.bowler && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={styles.sectionTitle}>Bowling:</h4>
              <div style={styles.item}>{match.bowler}</div>
            </div>
          )}

          {/* Current Over */}
          {overBalls.length > 0 && (
            <div>
              <h4 style={styles.sectionTitle}>This Over:</h4>
              <div style={styles.ballsContainer}>
                {overBalls.map((ball, idx) => (
                  <span key={idx} style={getBallClass(ball)}>
                    {ball}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Batsmen Stats */}
        {match.battingStats && match.battingStats.length > 0 && (
          <div style={styles.statsSection}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F2F2F2', marginBottom: '20px' }}>
              Batsmen
            </h3>
            <div style={styles.statsTable}>
              <div style={styles.tableHeader}>
                <div style={styles.colName}>Batsman</div>
                <div style={styles.colStat}>R</div>
                <div style={styles.colStat}>B</div>
                <div style={styles.colStat}>4s/6s</div>
                <div style={styles.colStat}>SR</div>
                <div style={styles.colStat}>Out</div>
              </div>
              {match.battingStats.map((batter, idx) => (
                <div key={idx} style={{
                  ...styles.tableRow,
                  ...(!batter.out && styles.tableRowActive),
                }}>
                  <div style={styles.colName}>
                    {batter.playerName}
                    {!batter.out && <span style={styles.battingBadge}>*</span>}
                  </div>
                  <div style={styles.colStat}>{batter.runs}</div>
                  <div style={styles.colStat}>{batter.balls}</div>
                  <div style={styles.colStat}>{batter.boundaries}</div>
                  <div style={styles.colStat}>{batter.strikeRate}</div>
                  <div style={styles.colStat}>{batter.out ? "✓" : "-"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bowlers Stats */}
        {match.bowlingStats && match.bowlingStats.length > 0 && (
          <div style={styles.statsSection}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F2F2F2', marginBottom: '20px' }}>
              Bowlers
            </h3>
            <div style={styles.statsTable}>
              <div style={{ ...styles.tableHeader, gridTemplateColumns: '2fr repeat(4, 1fr)' }}>
                <div style={styles.colName}>Bowler</div>
                <div style={styles.colStat}>O</div>
                <div style={styles.colStat}>R</div>
                <div style={styles.colStat}>W</div>
                <div style={styles.colStat}>Econ</div>
              </div>
              {match.bowlingStats.map((bowler, idx) => (
                <div key={idx} style={{ ...styles.tableRow, gridTemplateColumns: '2fr repeat(4, 1fr)' }}>
                  <div style={styles.colName}>{bowler.playerName}</div>
                  <div style={styles.colStat}>{bowler.overs}</div>
                  <div style={styles.colStat}>{bowler.runs}</div>
                  <div style={styles.colStat}>{bowler.wickets}</div>
                  <div style={styles.colStat}>{bowler.economy}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const MatchInfoTab = () => (
    <div>
      <div style={styles.infoCard}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#F2F2F2', marginBottom: '24px' }}>
          Match Details
        </h3>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Match ID:</span>
          <span style={styles.infoValue}>{match.id}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Teams:</span>
          <span style={styles.infoValue}>{battingTeam} vs {bowlingTeam}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Status:</span>
          <span style={styles.infoValue}>{match.matchStatus}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Current Score:</span>
          <span style={styles.infoValue}>{match.score}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Overs:</span>
          <span style={styles.infoValue}>{match.overs}</span>
        </div>
        {match.leadTrail && (
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Situation:</span>
            <span style={{ ...styles.infoValue, ...styles.infoResult }}>{match.leadTrail}</span>
          </div>
        )}
        {match.result && (
          <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
            <span style={styles.infoLabel}>Match Result:</span>
            <span style={{ ...styles.infoValue, ...styles.infoResult }}>{match.result}</span>
          </div>
        )}
      </div>
    </div>
  );

  const hasResult = match.result && match.result.trim() !== "";
  const hasWonMessage = match.leadTrail && (match.leadTrail.includes("won") || match.leadTrail.includes("Won"));
  const isLive = !hasResult && !hasWonMessage;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button 
            style={styles.btnBackSmall}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C8FF3A';
              e.currentTarget.style.color = '#C8FF3A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#F2F2F2';
            }}
            onClick={() => navigate("/live-matches")}
          >
            ← Back
          </button>
          <div style={styles.titleSection}>
            <h1 style={styles.matchTitle}>{match.id}</h1>
            <div style={styles.matchTeams}>{battingTeam} vs {bowlingTeam}</div>
          </div>
          {isLive && (
            <span style={styles.liveBadge}>
              <span style={styles.pulseDot}></span> LIVE
            </span>
          )}
        </div>

        {/* Match Status Banner */}
        {match.leadTrail && (
          <div style={styles.statusBanner}>
            {match.leadTrail}
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "scorecard" && styles.tabActive),
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "scorecard") e.currentTarget.style.color = '#F2F2F2';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "scorecard") e.currentTarget.style.color = '#999999';
            }}
            onClick={() => setActiveTab("scorecard")}
          >
            Scorecard
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "info" && styles.tabActive),
            }}
            onMouseEnter={(e) => {
              if (activeTab !== "info") e.currentTarget.style.color = '#F2F2F2';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "info") e.currentTarget.style.color = '#999999';
            }}
            onClick={() => setActiveTab("info")}
          >
            Match Info
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "scorecard" && <ScoreboardTab />}
          {activeTab === "info" && <MatchInfoTab />}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px #C8FF3A; }
          50% { opacity: 0.7; box-shadow: 0 0 20px #C8FF3A; }
        }
        @media (max-width: 768px) {
          .table-header, .table-row {
            font-size: 12px;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveMatchViewer;
