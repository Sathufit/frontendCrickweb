import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0C0C0C',
    paddingBottom: '80px',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '120px 24px 60px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #C8FF3A 0%, #B4FF00 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: 'clamp(14px, 2.5vw, 18px)',
    color: '#999999',
    fontWeight: '400',
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '50px',
    color: '#999999',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #C8FF3A 0%, #B4FF00 100%)',
    color: '#0C0C0C',
    border: 'none',
    boxShadow: '0 8px 32px rgba(200, 255, 58, 0.4)',
  },
  badge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeActive: {
    background: 'rgba(12, 12, 12, 0.3)',
  },
  matchesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
    gap: '24px',
  },
  matchCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    position: 'relative',
  },
  matchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statusLive: {
    background: 'rgba(200, 255, 58, 0.15)',
    color: '#C8FF3A',
  },
  statusFinished: {
    background: 'rgba(153, 153, 153, 0.15)',
    color: '#999999',
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
  },
  matchFormat: {
    fontSize: '12px',
    color: '#666666',
    fontWeight: '600',
    padding: '4px 10px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  matchTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#F2F2F2',
    marginBottom: '20px',
    textAlign: 'center',
    letterSpacing: '-0.01em',
  },
  team: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '10px',
  },
  teamBatting: {
    background: 'linear-gradient(135deg, rgba(200, 255, 58, 0.1) 0%, rgba(180, 255, 0, 0.1) 100%)',
    borderColor: 'rgba(200, 255, 58, 0.2)',
  },
  teamName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#F2F2F2',
  },
  score: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#F2F2F2',
    letterSpacing: '-0.02em',
  },
  vsDivider: {
    textAlign: 'center',
    color: '#666666',
    fontWeight: '600',
    fontSize: '13px',
    padding: '6px 0',
  },
  matchInfo: {
    padding: '14px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statusText: {
    fontSize: '13px',
    color: '#999999',
    marginBottom: '8px',
    textAlign: 'center',
  },
  runRates: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '12px',
    color: '#666666',
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  resultBox: {
    marginTop: '8px',
    padding: '8px 14px',
    background: 'linear-gradient(135deg, #C8FF3A 0%, #B4FF00 100%)',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#0C0C0C',
    fontWeight: '700',
  },
  liveStatusBox: {
    marginTop: '8px',
    padding: '8px 12px',
    background: 'rgba(200, 255, 58, 0.1)',
    border: '1px solid rgba(200, 255, 58, 0.2)',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#C8FF3A',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyTitle: {
    fontSize: 'clamp(20px, 4vw, 28px)',
    color: '#F2F2F2',
    marginBottom: '12px',
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    color: '#999999',
  },
  loadingState: {
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
  loadingText: {
    color: '#999999',
    fontSize: '15px',
  },
};

function LiveMatches() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const matchesQuery = query(
      collection(db, "matches"),
      orderBy("lastUpdated", "desc")
    );
    
    const unsubscribe = onSnapshot(matchesQuery, 
      (snapshot) => {
        const matchesArray = [];
        snapshot.forEach((doc) => {
          matchesArray.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Determine match status - check multiple indicators for completion
        // First, filter out stopped/inaccessible matches
        const activeMatches = matchesArray.filter(m => !isMatchStopped(m));
        
        const live = activeMatches.filter(m => {
          // Match is completed if any of these are true
          const hasResult = m.result && m.result.trim() !== "";
          const hasWonMessage = m.leadTrail && (m.leadTrail.includes("won") || m.leadTrail.includes("Won") || m.leadTrail.includes("WON"));
          const matchStatusComplete = m.matchStatus && (m.matchStatus.toLowerCase().includes("match complete") || m.matchStatus.toLowerCase().includes("completed"));
          const isFinished = m.matchFinished === true || m.status === "finished" || m.status === "completed";
          
          // Only show in live if NONE of the completion indicators are present
          return !hasResult && !hasWonMessage && !matchStatusComplete && !isFinished;
        });
        
        const completed = activeMatches.filter(m => {
          // Match is completed if ANY of these are true
          const hasResult = m.result && m.result.trim() !== "";
          const hasWonMessage = m.leadTrail && (m.leadTrail.includes("won") || m.leadTrail.includes("Won") || m.leadTrail.includes("WON"));
          const matchStatusComplete = m.matchStatus && (m.matchStatus.toLowerCase().includes("match complete") || m.matchStatus.toLowerCase().includes("completed"));
          const isFinished = m.matchFinished === true || m.status === "finished" || m.status === "completed";
          
          return hasResult || hasWonMessage || matchStatusComplete || isFinished;
        });

        setLiveMatches(live);
        setCompletedMatches(completed);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching matches:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
    const match = rrStr.match(/Rate:\s*([\d.]+)/);
    return match ? match[1] : "0.00";
  };

  const isMatchStopped = (match) => {
    // Match is stopped if it has no recent activity and isn't completed
    const hasNoScore = !match.score || match.score === "0/0" || match.score.trim() === "";
    const hasNoStatus = !match.matchStatus || match.matchStatus.trim() === "";
    const hasNoResult = !match.result || match.result.trim() === "";
    const hasNoLeadTrail = !match.leadTrail || match.leadTrail.trim() === "";
    
    // If match has no meaningful data, it's likely stopped/inaccessible
    return hasNoScore && hasNoStatus && hasNoResult && hasNoLeadTrail;
  };

  const getWinnerInfo = (match) => {
    // Extract winner from result or leadTrail
    if (match.result && match.result.trim() !== "") {
      return match.result;
    }
    if (match.leadTrail && (match.leadTrail.includes("won") || match.leadTrail.includes("Won") || match.leadTrail.includes("WON"))) {
      return match.leadTrail;
    }
    if (match.matchStatus && match.matchStatus.toLowerCase().includes("won")) {
      return match.matchStatus;
    }
    return "Match Completed";
  };

  const MatchCard = ({ match }) => {
    const [isHovered, setIsHovered] = useState(false);
    const battingTeam = getTeamName(match.battingCardTitle);
    const bowlingTeam = getTeamName(match.bowlingCardTitle);
    const currentOvers = getCurrentOvers(match.overs);
    const runRate = getRunRate(match.runRate);
    
    const hasResult = match.result && match.result.trim() !== "";
    const hasWonMessage = match.leadTrail && (match.leadTrail.includes("won") || match.leadTrail.includes("Won") || match.leadTrail.includes("WON"));
    const matchStatusComplete = match.matchStatus && (match.matchStatus.toLowerCase().includes("match complete") || match.matchStatus.toLowerCase().includes("completed"));
    const isFinished = match.matchFinished === true || match.status === "finished" || match.status === "completed";
    const isLive = !hasResult && !hasWonMessage && !matchStatusComplete && !isFinished;

    const cardStyle = {
      ...styles.matchCard,
      ...(isHovered && {
        borderColor: '#C8FF3A',
        boxShadow: '0 20px 60px rgba(200, 255, 58, 0.25)',
        background: 'rgba(255, 255, 255, 0.05)',
        transform: 'translateY(-8px)',
      }),
    };

    return (
      <div 
        style={cardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/live-match/${match.id}`)}
      >
        <div style={styles.matchHeader}>
          <div style={{
            ...styles.statusBadge,
            ...(isLive ? styles.statusLive : styles.statusFinished),
          }}>
            <span style={{
              ...styles.statusDot,
              background: isLive ? '#C8FF3A' : '#999999',
              boxShadow: isLive ? '0 0 10px #C8FF3A' : 'none',
            }}></span>
            <span>{isLive ? 'LIVE' : 'FINISHED'}</span>
          </div>
          <div style={styles.matchFormat}>{match.matchFormat || 'T20'}</div>
        </div>

        <div style={styles.matchTitle}>{match.id}</div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            ...styles.team,
            ...(isLive && styles.teamBatting),
          }}>
            <span style={styles.teamName}>{battingTeam}</span>
            <span style={styles.score}>{match.score || "0/0"}</span>
          </div>

          <div style={styles.vsDivider}>vs</div>

          <div style={styles.team}>
            <span style={styles.teamName}>{bowlingTeam}</span>
          </div>
        </div>

        <div style={styles.matchInfo}>
          <div style={styles.statusText}>
            {match.matchStatus || "In Progress"}
          </div>
          
          <div style={styles.runRates}>
            <span>Overs: {currentOvers}</span>
            <span>•</span>
            <span>RR: {runRate}</span>
          </div>

          {!isLive && (
            <div style={{
              ...styles.resultBox,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>🏆</span>
              <span>{getWinnerInfo(match)}</span>
            </div>
          )}
          
          {isLive && match.leadTrail && (
            <div style={styles.liveStatusBox}>
              {match.leadTrail}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading matches...</p>
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

  const displayMatches = activeTab === "live" ? liveMatches : completedMatches;

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Live Cricket Matches</h1>
          <p style={styles.subtitle}>
            Real-time scores and updates from ongoing matches
          </p>
        </div>

        <div style={styles.tabsContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "live" && styles.tabActive),
            }}
            onClick={() => setActiveTab("live")}
          >
            <span style={{
              ...styles.statusDot,
              background: activeTab === "live" ? '#0C0C0C' : '#666666',
            }}></span>
            <span>Live Matches</span>
            {liveMatches.length > 0 && (
              <span style={{
                ...styles.badge,
                ...(activeTab === "live" && styles.badgeActive),
              }}>
                {liveMatches.length}
              </span>
            )}
          </button>
          
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "completed" && styles.tabActive),
            }}
            onClick={() => setActiveTab("completed")}
          >
            <span>Completed</span>
            {completedMatches.length > 0 && (
              <span style={{
                ...styles.badge,
                ...(activeTab === "completed" && styles.badgeActive),
              }}>
                {completedMatches.length}
              </span>
            )}
          </button>
        </div>

        <div style={styles.matchesGrid}>
          {displayMatches.length === 0 ? (
            <div style={{ ...styles.emptyState, gridColumn: '1 / -1' }}>
              <h3 style={styles.emptyTitle}>
                No {activeTab} matches
              </h3>
              <p style={styles.emptyText}>
                Check back later for updates
              </p>
            </div>
          ) : (
            displayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          body {
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}

export default LiveMatches;
