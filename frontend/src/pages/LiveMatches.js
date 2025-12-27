import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import Navbar from "../components/Navbar";
import "../styles/LiveMatches.css";

const LiveMatches = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time listener for all matches
    const matchesRef = ref(database, "matches");
    
    const unsubscribe = onValue(matchesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchesArray = Object.entries(data).map(([id, matchData]) => ({
          id,
          ...matchData
        }));

        // Separate live and completed matches
        const live = matchesArray.filter(m => !m.matchFinished);
        const completed = matchesArray.filter(m => m.matchFinished);

        // Sort by lastUpdated (most recent first)
        live.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));
        completed.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0));

        setLiveMatches(live);
        setCompletedMatches(completed);
      } else {
        setLiveMatches([]);
        setCompletedMatches([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching matches:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMatchClick = (matchId) => {
    navigate(`/live-match/${matchId}`);
  };

  // Extract team names from battingCardTitle (e.g., "bye - Batting Scorecard" -> "bye")
  const getTeamName = (title) => {
    if (!title) return "Team";
    return title.split(" - ")[0].trim();
  };

  // Parse overs string (e.g., "Overs: 1.2 / 5" -> "1.2")
  const getCurrentOvers = (oversStr) => {
    if (!oversStr) return "0.0";
    const match = oversStr.match(/Overs:\s*([\d.]+)/);
    return match ? match[1] : "0.0";
  };

  // Parse run rate string (e.g., "Run Rate: 21.75" -> "21.75")
  const getRunRate = (rrStr) => {
    if (!rrStr) return "0.00";
    const match = rrStr.match(/Rate:\s*([\d.]+)/);
    return match ? match[1] : "0.00";
  };

  const MatchCard = ({ match }) => {
    const battingTeam = getTeamName(match.battingCardTitle);
    const bowlingTeam = getTeamName(match.bowlingCardTitle);
    const currentOvers = getCurrentOvers(match.overs);
    const runRate = getRunRate(match.runRate);

    return (
      <div
        className="match-card"
        onClick={() => handleMatchClick(match.id)}
      >
        <div className="match-card-header">
          <span className={`match-status ${match.matchFinished ? "finished" : "live"}`}>
            {match.matchFinished ? (
              <><span className="status-dot finished"></span> Finished</>
            ) : (
              <><span className="status-dot live"></span> LIVE</>
            )}
          </span>
          <span className="match-format">{match.id}</span>
        </div>

        <div className="match-title">{battingTeam} vs {bowlingTeam}</div>

        <div className="teams-section">
          {/* Batting Team */}
          <div className="team batting">
            <span className="team-name">{battingTeam}</span>
            <div className="score-display">
              <span className="score">
                {match.score} ({currentOvers})
              </span>
            </div>
          </div>

          <div className="vs-divider">vs</div>

          {/* Bowling Team */}
          <div className="team">
            <span className="team-name">{bowlingTeam}</span>
            <div className="score-display">
              <span className="score">Bowling</span>
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="match-info">
          <div className="status-text">{match.matchStatus}</div>
          {!match.matchFinished && (
            <div className="run-rates">
              <span className="rr">CRR: {runRate}</span>
            </div>
          )}
          {match.leadTrail && (
            <div className={match.matchFinished ? "result-text" : "target-info"}>
              {match.leadTrail}
            </div>
          )}
        </div>

        {match.currentOver && (
          <div className="current-over-display">
            {match.currentOver}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="live-matches-page">
      <Navbar />
      
      <div className="live-matches-container">
        <div className="page-header">
          <h1 className="page-title">🏏 Live Cricket Matches</h1>
          <p className="page-subtitle">Watch matches in real-time with live updates</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "live" ? "active" : ""}`}
            onClick={() => setActiveTab("live")}
          >
            Live Matches {liveMatches.length > 0 && <span className="badge">{liveMatches.length}</span>}
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading matches...</p>
          </div>
        ) : (
          <>
            {activeTab === "live" && (
              <div className="matches-grid">
                {liveMatches.length > 0 ? (
                  liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🏏</div>
                    <h3>No Live Matches</h3>
                    <p>There are no matches being played right now.</p>
                    <p>Check back later or view completed matches.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className="matches-grid">
                {completedMatches.length > 0 ? (
                  completedMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <h3>No Completed Matches</h3>
                    <p>No matches have been completed yet.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
