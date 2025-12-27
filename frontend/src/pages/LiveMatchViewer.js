import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import Navbar from "../components/Navbar";
import "../styles/LiveMatchViewer.css";

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

    // Real-time listener for specific match
    const matchRef = ref(database, `matches/${matchId}`);
    const unsubscribe = onValue(
      matchRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setMatch({ id: matchId, ...snapshot.val() });
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
      <div className="live-match-viewer">
        <Navbar />
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading match data...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="live-match-viewer">
        <Navbar />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>{error || "Match not found"}</h2>
          <button className="btn-back" onClick={() => navigate("/live-matches")}>
            ← Back to Matches
          </button>
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
    if (b === 'W') return "ball wicket";
    if (b === '4') return "ball four";
    if (b === '6') return "ball six";
    if (b.includes('WD') || b.includes('NB')) return "ball extra";
    if (b === '0') return "ball dot";
    return "ball";
  };

  const battingTeam = getTeamName(match.battingCardTitle);
  const bowlingTeam = getTeamName(match.bowlingCardTitle);
  const currentOvers = getCurrentOvers(match.overs);
  const runRate = getRunRate(match.runRate);
  const currentBatsmen = parseBatsmen(match.batsman1, match.batsman2);
  const overBalls = parseCurrentOver(match.currentOver);

  const ScoreboardTab = () => (
    <div className="scorecard-section">
      {/* Current Score */}
      <div className="current-score-panel">
        <div className="score-header">
          <h2>{battingTeam}</h2>
          {!match.matchFinished && (
            <span className="live-indicator">
              <span className="live-dot"></span> LIVE
            </span>
          )}
        </div>
        
        <div className="score-main">
          <div className="runs-wickets">
            {match.score || "0/0"}
          </div>
          <div className="overs-display">
            ({currentOvers} overs)
          </div>
        </div>

        <div className="run-rate-info">
          <div className="rate-item">
            <span className="rate-label">Run Rate:</span>
            <span className="rate-value">{runRate}</span>
          </div>
        </div>

        {/* Current Batsmen */}
        {currentBatsmen.length > 0 && (
          <div className="current-batsmen">
            <h4>At Crease:</h4>
            {currentBatsmen.map((batsman, idx) => (
              <div key={idx} className="batsman-item">
                {batsman}
              </div>
            ))}
          </div>
        )}

        {/* Current Bowler */}
        {match.bowler && (
          <div className="current-bowler">
            <h4>Bowling:</h4>
            <div className="bowler-item">{match.bowler}</div>
          </div>
        )}

        {/* Current Over */}
        {overBalls.length > 0 && (
          <div className="current-over">
            <h4>This Over:</h4>
            <div className="balls-container">
              {overBalls.map((ball, idx) => (
                <span key={idx} className={getBallClass(ball)}>
                  {ball}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Batsmen Stats */}
      {match.battingStats && match.battingStats.length > 0 && (
        <div className="batsmen-section">
          <h3>Batsmen</h3>
          <div className="stats-table">
            <div className="table-header">
              <div className="col-name">Batsman</div>
              <div className="col-stat">R</div>
              <div className="col-stat">B</div>
              <div className="col-stat">4s/6s</div>
              <div className="col-stat">SR</div>
              <div className="col-stat">Out</div>
            </div>
            {match.battingStats.map((batter, idx) => (
              <div key={idx} className={`table-row ${!batter.out ? "active" : ""}`}>
                <div className="col-name">
                  {batter.playerName}
                  {!batter.out && <span className="batting-badge">*</span>}
                </div>
                <div className="col-stat">{batter.runs}</div>
                <div className="col-stat">{batter.balls}</div>
                <div className="col-stat">{batter.boundaries}</div>
                <div className="col-stat">{batter.strikeRate}</div>
                <div className="col-stat">{batter.out ? "✓" : "-"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bowlers Stats */}
      {match.bowlingStats && match.bowlingStats.length > 0 && (
        <div className="bowlers-section">
          <h3>Bowlers</h3>
          <div className="stats-table">
            <div className="table-header">
              <div className="col-name">Bowler</div>
              <div className="col-stat">O</div>
              <div className="col-stat">R</div>
              <div className="col-stat">W</div>
              <div className="col-stat">Econ</div>
            </div>
            {match.bowlingStats.map((bowler, idx) => (
              <div key={idx} className="table-row">
                <div className="col-name">{bowler.playerName}</div>
                <div className="col-stat">{bowler.overs}</div>
                <div className="col-stat">{bowler.runs}</div>
                <div className="col-stat">{bowler.wickets}</div>
                <div className="col-stat">{bowler.economy}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MatchInfoTab = () => (
    <div className="match-info-section">
      <div className="info-card">
        <h3>Match Details</h3>
        <div className="info-row">
          <span className="info-label">Match ID:</span>
          <span className="info-value">{match.id}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Teams:</span>
          <span className="info-value">{battingTeam} vs {bowlingTeam}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Status:</span>
          <span className="info-value">{match.matchStatus}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Current Score:</span>
          <span className="info-value">{match.score}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Overs:</span>
          <span className="info-value">{match.overs}</span>
        </div>
        {match.leadTrail && (
          <div className="info-row result-row">
            <span className="info-label">Situation:</span>
            <span className="info-value result">{match.leadTrail}</span>
          </div>
        )}
        {match.matchFinished && (
          <div className="info-row">
            <span className="info-label">Match Result:</span>
            <span className="info-value result">Match Completed</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="live-match-viewer">
      <Navbar />

      <div className="match-viewer-container">
        {/* Header */}
        <div className="match-header">
          <button className="btn-back-small" onClick={() => navigate("/live-matches")}>
            ← Back
          </button>
          <div className="match-title-section">
            <h1>{match.id}</h1>
            <div className="match-teams">{battingTeam} vs {bowlingTeam}</div>
          </div>
          {!match.matchFinished && (
            <span className="live-badge">
              <span className="pulse-dot"></span> LIVE
            </span>
          )}
        </div>

        {/* Match Status Banner */}
        {match.leadTrail && (
          <div className="match-status-banner">
            {match.leadTrail}
          </div>
        )}

        {/* Tabs */}
        <div className="viewer-tabs">
          <button
            className={`viewer-tab ${activeTab === "scorecard" ? "active" : ""}`}
            onClick={() => setActiveTab("scorecard")}
          >
            Scorecard
          </button>
          <button
            className={`viewer-tab ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Match Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "scorecard" && <ScoreboardTab />}
          {activeTab === "info" && <MatchInfoTab />}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchViewer;
