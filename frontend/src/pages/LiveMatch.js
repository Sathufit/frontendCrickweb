import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LiveMatch.css";

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5001"
  : "https://frontyardcricket.onrender.com";

const LiveMatch = () => {
  // Match setup states
  const [matchDetails, setMatchDetails] = useState({
    matchName: "",
    oversLimit: 0,
    teamA: "",
    teamB: "",
  });

  const [pastMatches, setPastMatches] = useState([]);
  const [matchId, setMatchId] = useState(null);
  const [lastBowlerIndex, setLastBowlerIndex] = useState(null);
  const [selectedMatchName, setSelectedMatchName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    fetchPastMatches();
  }, []);
  
  const fetchPastMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/live-match-stats`);
      if (Array.isArray(response.data)) {
        setPastMatches(response.data.reverse());
      } else {
        console.error("⚠️ Invalid data format from server:", response.data);
        setPastMatches([]);
      }
    } catch (error) {
      console.error("❌ Error fetching past matches:", error);
    }
  };
  
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const [allPlayers, setAllPlayers] = useState([
    "Sathush", "Dulshan", "Savindu", "Yamila", "Madhawa", "Chanuka",
    "Dihindu", "Farhan", "Shalom", "Achala", "Shanaka", "Ravindu",
    "Nidula", "Player 14", "Player 15"
  ]);

  const [playersTeamA, setPlayersTeamA] = useState([]);
  const [playersTeamB, setPlayersTeamB] = useState([]);
  const [currentBatters, setCurrentBatters] = useState([null, null]);

  // Match progress states
  const [matchStarted, setMatchStarted] = useState(false);
  const [innings, setInnings] = useState(1);
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [target, setTarget] = useState(null);

  // Current innings state
  const [onStrike, setOnStrike] = useState(0);
  const [currentBowler, setCurrentBowler] = useState(null);
  const [batterStats, setBatterStats] = useState([]);
  const [bowlerStats, setBowlerStats] = useState([]);

  // Score and ball tracking
  const [score, setScore] = useState({ runs: 0, wickets: 0, extras: 0 });
  const [overs, setOvers] = useState(0);
  const [balls, setBalls] = useState(0);
  const [ballHistory, setBallHistory] = useState([]);

  // Ball input state
  const [ballDetails, setBallDetails] = useState({
    runs: 0,
    ballType: "normal",
    isOut: false,
    outType: "bowled",
    isExtra: false,
    extraType: "wide",
    extraRuns: 1
  });
  
  // Match summary
  const [matchSummary, setMatchSummary] = useState({
    innings1: {
      battingTeam: "",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      batters: [],
      bowlers: [],
      ballByBall: []
    },
    innings2: {
      battingTeam: "",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      batters: [],
      bowlers: [],
      ballByBall: []
    },
    result: ""
  });

  const viewMatchSummary = async (matchId) => {
    try {
      const response = await axios.get(`${API_URL}/api/live-match-stats/${matchId}`);
      setMatchSummary(response.data);
      setSelectedMatchId(matchId);
      setSelectedMatchName(`${response.data.innings1?.battingTeam || "Team A"} vs ${response.data.innings2?.battingTeam || "Team B"}`);
      setTimeout(() => setShowSummaryModal(true), 50);
    } catch (error) {
      console.error("Failed to fetch match summary:", error);
    }
  };
  
  const deletePastMatch = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this match summary?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_URL}/api/live-match-stats/${id}`);
      alert("✅ Match deleted successfully");
      fetchPastMatches();
    } catch (error) {
      console.error("❌ Error deleting past match:", error);
      alert("❌ Failed to delete match. Please try again.");
    }
  };
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const saveMatchSummary = async () => {
    try {
      setSnackbar({
        open: true,
        message: "✅ Match summary auto-saved by backend!",
        severity: "success",
      });
      fetchPastMatches();
    } catch (error) {
      console.error("❌ Error updating UI after match:", error);
    }
  
    setMatchSummary({
      innings1: {
        battingTeam: "",
        runs: 0,
        wickets: 0,
        overs: "0.0",
        batters: [],
        bowlers: [],
        ballByBall: []
      },
      innings2: {
        battingTeam: "",
        runs: 0,
        wickets: 0,
        overs: "0.0",
        batters: [],
        bowlers: [],
        ballByBall: []
      },
      result: ""
    });
  };

  // Match setup handlers
  const handleMatchDetailsChange = (e) => {
    const { name, value } = e.target;
    setMatchDetails((prev) => ({
      ...prev,
      [name]: name === "oversLimit" ? Number(value) : value,
    }));
  };

  // Handle adding players to teams
  const handleAddPlayerToTeam = (team, player) => {
    if (team === "A") {
      if (!playersTeamA.includes(player)) {
        setPlayersTeamA([...playersTeamA, player]);
        setAllPlayers(allPlayers.filter((p) => p !== player));
      }
    } else if (team === "B") {
      if (!playersTeamB.includes(player)) {
        setPlayersTeamB([...playersTeamB, player]);
        setAllPlayers(allPlayers.filter((p) => p !== player));
      }
    }
  };

  // Handle removing players from teams
  const handleRemovePlayerFromTeam = (team, player) => {
    if (team === "A") {
      setPlayersTeamA(playersTeamA.filter((p) => p !== player));
      setAllPlayers([...allPlayers, player]);
    } else if (team === "B") {
      setPlayersTeamB(playersTeamB.filter((p) => p !== player));
      setAllPlayers([...allPlayers, player]);
    }
  };

  // Initialize match
  const startMatch = async () => {
    // Validate inputs
    if (!matchDetails.matchName || matchDetails.oversLimit <= 0 || 
        !matchDetails.teamA || !matchDetails.teamB) {
      alert("Please fill all match details!");
      return;
    }

    if (!playersTeamA.length || !playersTeamB.length) {
      alert("Please add at least one player to each team!");
      return;
    }

    try {
      // Send match details to the backend
      const response = await axios.post(`${API_URL}/api/live-match`, {
        matchName: matchDetails.matchName,
        oversLimit: matchDetails.oversLimit,
        teamA: matchDetails.teamA,
        teamB: matchDetails.teamB,
        playersTeamA,
        playersTeamB,
      });

      setMatchId(response.data.match._id);
      setMatchStarted(true);

      // Initialize first innings
      setBattingTeam(matchDetails.teamA);
      setBowlingTeam(matchDetails.teamB);
      setInnings(1);

      // Initialize batter and bowler stats
      const initialBatterStats = playersTeamA.map((player, index) => ({
        playerIndex: index,
        name: player,
        runs: 0,
        ballsFaced: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        outType: "",
        outBowler: "",
      }));
      setBatterStats(initialBatterStats);

      const initialBowlerStats = playersTeamB.map((player, index) => ({
        playerIndex: index,
        name: player,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
        economy: 0,
      }));
      setBowlerStats(initialBowlerStats);

      setOnStrike(0);

      // Reset score and ball tracking
      setScore({ runs: 0, wickets: 0, extras: 0 });
      setOvers(0);
      setBalls(0);
      setBallHistory([]);
    } catch (error) {
      console.error("❌ Error starting match:", error);
      alert("Failed to start match. Please try again.");
    }
  };

  // Ball input handlers
  const handleBallDetailsChange = (field, value) => {
    setBallDetails(prev => ({
      ...prev,
      [field]: field === "runs" || field === "extraRuns" ? Number(value) : value,
      ...(!field === "isOut" && !value ? { outType: "" } : {})
    }));
  };

  const [showChangeBowler, setShowChangeBowler] = useState(false);
  // Get current teams based on innings
  const currentPlayers = innings === 1 ? playersTeamA : playersTeamB;
  const currentBowlingPlayers = innings === 1 ? playersTeamB : playersTeamA;
  const striker = currentBatters[onStrike];

  const processBall = async () => {
    if (currentBowler === null) {
      alert("Please select a bowler first!");
      return;
    }
  
    const currentPlayers = innings === 1 ? playersTeamA : playersTeamB;
    const currentBowlingPlayers = innings === 1 ? playersTeamB : playersTeamA;
    const striker = currentBatters[onStrike];
  
    const ballRecord = {
      runs: parseInt(ballDetails.runs || 0),
      ballType: ballDetails.ballType,
      isOut: ballDetails.isOut,
      outType: ballDetails.isOut ? ballDetails.outType : "",
      isExtra: ballDetails.isExtra,
      extraType: ballDetails.isExtra ? ballDetails.extraType : "",
      extraRuns: ballDetails.isExtra ? parseInt(ballDetails.extraRuns || 0) : 0,
      batter: currentPlayers[striker],
      bowler: currentBowlingPlayers[currentBowler],
    };
  
    try {
      const response = await axios.post(
        `${API_URL}/api/live-match/${matchId}/ball`,
        ballRecord
      );
      const updatedMatch = response.data.match;
  
      setScore({
        runs: updatedMatch.score.runs,
        wickets: updatedMatch.score.wickets,
        extras: updatedMatch.score.extras || 0,
      });
  
      const oversStr = updatedMatch.score.overs || "0.0";
      setOvers(oversStr);
      const [oversPart, ballsPart] = oversStr.split(".");
      const totalBalls = parseInt(oversPart || "0") * 6 + parseInt(ballsPart || "0");
      setBalls(totalBalls);
  
      if (oversStr.endsWith(".0")) {
        setShowChangeBowler(true);
      }
  
      setBallHistory(updatedMatch.score.balls);
      setBatterStats(updatedMatch.batterStats);
      setBowlerStats(updatedMatch.bowlerStats);
  
      const isLegalDelivery = !(
        ballRecord.isExtra &&
        (ballRecord.extraType === "wide" || ballRecord.extraType === "noBall")
      );
      const totalRunsForBall =
        ballRecord.runs + (ballRecord.isExtra ? ballRecord.extraRuns : 0);
  
      if (
        (isLegalDelivery && totalRunsForBall % 2 === 1) ||
        (ballRecord.isExtra &&
          ballRecord.extraType === "noBall" &&
          totalRunsForBall % 2 === 1)
      ) {
        setOnStrike((prev) => (prev === 0 ? 1 : 0));
      }
  
      if (
        isLegalDelivery &&
        updatedMatch.currentBall === 0 &&
        updatedMatch.currentOver > 0
      ) {
        setOnStrike((prev) => (prev === 0 ? 1 : 0));
      }
  
      if (ballRecord.isOut) {
        setCurrentBatters((prevBatters) => {
          const updated = [...prevBatters];
          updated[onStrike] = null;
          return updated;
        });
      }
  
      if (updatedMatch.isFinished) {
        setMatchStarted(false);
        setMatchSummary({
          innings1: updatedMatch.innings1 || {},
          innings2: updatedMatch.innings2 || {},
          result: updatedMatch.result || "Match Finished",
        });
        fetchPastMatches();
      } else if (updatedMatch.currentInnings !== innings) {
        setInnings(updatedMatch.currentInnings);
        setTarget(updatedMatch.target);
        setBattingTeam(updatedMatch.score.team);
        setBowlingTeam(
          innings === 1 ? matchDetails.teamA : matchDetails.teamB
        );
        setCurrentBatters([null, null]);
        resetInningsState();
      }
      
    } catch (error) {
      console.error("❌ Error processing ball:", error);
      alert(
        `Failed to process ball: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setBallDetails({
        runs: 0,
        ballType: "normal",
        isOut: false,
        outType: "bowled",
        isExtra: false,
        extraType: "wide",
        extraRuns: 1,
      });
    }
  };
  
  const resetInningsState = () => {
    const battingTeam = innings === 1 ? playersTeamB : playersTeamA;
    const bowlingTeam = innings === 1 ? playersTeamA : playersTeamB;
  
    const initialBatterStats = battingTeam.map((player, index) => ({
      playerIndex: index,
      name: player,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: "",
      outBowler: "",
    }));
    setBatterStats(initialBatterStats);
  
    const initialBowlerStats = bowlingTeam.map((player, index) => ({
      playerIndex: index,
      name: player,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      maidens: 0,
      economy: 0,
    }));
    setBowlerStats(initialBowlerStats);
  
    setOnStrike(0);
    setCurrentBatters([null, null]);
    setCurrentBowler(null);
  
    setScore({ runs: 0, wickets: 0, extras: 0 });
    setOvers("0.0");
    setBalls(0);
    setBallHistory([]);
  
    setBattingTeam(battingTeam);
    setBowlingTeam(bowlingTeam);
  };
  
  // End current innings and setup next innings or end match
  const endInnings = () => {
    const currentPlayers = innings === 1 ? playersTeamA : playersTeamB;
    const currentInningsKey = innings === 1 ? "innings1" : "innings2";
    const currentOvers = `${Math.floor(balls / 6)}.${balls % 6}`;

    setMatchSummary((prev) => ({
        ...prev,
        [currentInningsKey]: {
            battingTeam: battingTeam,
            runs: score.runs,
            wickets: score.wickets,
            extras: score.extras,
            overs: currentOvers,
            batters: [...batterStats],
            bowlers: [...bowlerStats],
            ballByBall: [...ballHistory],
        },
    }));

    if (innings === 1) {
        setTarget(score.runs + 1);
        setInnings(2);

        setBattingTeam(bowlingTeam);
        setCurrentBatters([null, null]);
        setBowlingTeam(battingTeam);

        const initialBatterStats = playersTeamB.map((player, index) => ({
            playerIndex: index,
            name: player,
            runs: 0,
            ballsFaced: 0,
            fours: 0,
            sixes: 0,
            isOut: false,
            outType: "",
            outBowler: "",
        }));
        setBatterStats(initialBatterStats);

        const initialBowlerStats = playersTeamA.map((player, index) => ({
            playerIndex: index,
            name: player,
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0,
            maidens: 0,
            economy: 0,
        }));
        setBowlerStats(initialBowlerStats);

        setOnStrike(0);
        setCurrentBowler(null);

        setScore({ runs: 0, wickets: 0, extras: 0 });
        setOvers("0.0");
        setBalls(0);
        setBallHistory([]);
    } else {
        const teamAWon = score.runs >= target;
        const result = teamAWon
            ? `${battingTeam} won by ${
                  playersTeamB.length - score.wickets - 1
              } wickets`
            : `${bowlingTeam} won by ${target - score.runs - 1} runs`;

        setMatchSummary((prev) => ({
            ...prev,
            result,
        }));

        setMatchStarted(false);
        fetchPastMatches();
    }
  };

  // Calculate balls remaining in current innings
  const ballsRemaining = matchDetails.oversLimit * 6 - balls;
  const oversRemaining = (ballsRemaining / 6).toFixed(1);
  
  // Get current batting pair names
  const getBatterName = (index) => {
    const players = innings === 1 ? playersTeamA : playersTeamB;
    return currentBatters[index] !== undefined && players[currentBatters[index]] 
      ? players[currentBatters[index]]
      : "Unknown";
  };
  
  // Get current bowler name
  const getBowlerName = () => {
    const players = innings === 1 ? playersTeamB : playersTeamA;
    return currentBowler !== null && players[currentBowler]
      ? players[currentBowler]
      : "Select Bowler";
  };
  
  // Get batter stats display
  const getBatterStats = (batterIndex) => {
    const playerName = getBatterName(batterIndex);
    const batter = batterStats.find(b => b.name === playerName);
    if (!batter) return "";
    return `${batter.runs} (${batter.ballsFaced})`;
  };
  
  const endMatchManually = async () => {
    if (!matchId) return;
  
    const confirmEnd = window.confirm("Are you sure you want to end the match early?");
    if (!confirmEnd) return;
  
    try {
      const response = await axios.put(`${API_URL}/api/live-match/${matchId}/end`);
      const updatedMatch = response.data.match;
  
      setMatchStarted(false);
      setMatchSummary((prev) => ({
        ...prev,
        innings1: updatedMatch.innings1 || {},
        innings2: updatedMatch.innings2 || {},
        result: updatedMatch.result || "Match ended manually",
      }));
      fetchPastMatches();
    } catch (err) {
      console.error("❌ Failed to end match manually:", err);
      alert("Could not end match. Try again.");
    }
  };
  
  return (
    <div className="app-container">
      {!matchStarted ? (
        <div className="setup-container">
          <div className="header">
            <h1>Cricket Match Setup</h1>
          </div>

          <div className="setup-form-container">
            <div className="setup-card">
              <h2>Match Details</h2>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Match Name"
                  name="matchName"
                  value={matchDetails.matchName}
                  onChange={handleMatchDetailsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Overs Limit"
                  name="oversLimit"
                  value={matchDetails.oversLimit}
                  onChange={handleMatchDetailsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Team A Name"
                  name="teamA"
                  value={matchDetails.teamA}
                  onChange={handleMatchDetailsChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Team B Name"
                  name="teamB"
                  value={matchDetails.teamB}
                  onChange={handleMatchDetailsChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="teams-setup">
              <div className="team-card">
                <h2>{matchDetails.teamA || "Team A"}</h2>
                <div className="player-list">
                  {playersTeamA.map((player, index) => (
                    <div key={index} className="player-item">
                      <span>{player}</span>
                      <button 
                        className="remove-player-btn" 
                        onClick={() => handleRemovePlayerFromTeam("A", player)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="player-selector">
                  <select
                    className="player-select"
                    onChange={(e) => handleAddPlayerToTeam("A", e.target.value)}
                    value=""
                  >
                    <option value="" disabled>Add Player</option>
                    {allPlayers.map((player, index) => (
                      <option key={index} value={player}>
                        {player}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="team-card">
                <h2>{matchDetails.teamB || "Team B"}</h2>
                <div className="player-list">
                  {playersTeamB.map((player, index) => (
                    <div key={index} className="player-item">
                      <span>{player}</span>
                      <button 
                        className="remove-player-btn"
                        onClick={() => handleRemovePlayerFromTeam("B", player)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="player-selector">
                  <select
                    className="player-select"
                    onChange={(e) => handleAddPlayerToTeam("B", e.target.value)}
                    value=""
                  >
                    <option value="" disabled>Add Player</option>
                    {allPlayers.map((player, index) => (
                      <option key={index} value={player}>
                        {player}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button className="primary-btn" onClick={startMatch}>
              Start Match
            </button>
          </div>

          <div className="past-matches-section">
            <h2>Past Matches</h2>
            <div className="past-matches-grid">
              {pastMatches.length > 0 ? (
                pastMatches.map((match) => (
                  <div
                    key={match._id}
                    className="match-card"
                    onClick={() => viewMatchSummary(match._id)}
                  >
                    <h3>{match.teamA} vs {match.teamB}</h3>
                    <p className="match-result">{match.result || "No result"}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePastMatch(match._id);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-matches">No past matches available.</p>
              )}
            </div>
          </div>

          {showSummaryModal && matchSummary && (
            <div className="modal-overlay" onClick={() => setShowSummaryModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{selectedMatchName}</h2>
                  <button className="close-btn" onClick={() => setShowSummaryModal(false)}>×</button>
                </div>
                
                <div className="modal-body">
                  <div className="result-banner">
                    <h3>{matchSummary.result || "No result"}</h3>
                  </div>
                  
                  <div className="summary-section">
                    <h4>Batting</h4>
                    <div className="summary-table">
                      <div className="table-header">
                        <span>Batter</span>
                        <span>Runs</span>
                        <span>Balls</span>
                        <span>SR</span>
                      </div>
                      {matchSummary.innings1?.batters?.map((b, i) => (
                        <div key={i} className="table-row">
                          <span>{b.name}</span>
                          <span>{b.runs}</span>
                          <span>{b.ballsFaced}</span>
                          <span>{b.ballsFaced > 0 ? ((b.runs / b.ballsFaced) * 100).toFixed(1) : '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h4>Bowling</h4>
                    <div className="summary-table">
                      <div className="table-header">
                        <span>Bowler</span>
                        <span>O</span>
                        <span>R</span>
                        <span>W</span>
                        <span>Econ</span>
                      </div>
                      {matchSummary.innings1?.bowlers?.map((b, i) => (
                        <div key={i} className="table-row">
                          <span>{b.name}</span>
                          <span>{Math.floor(b.balls / 6)}.{b.balls % 6}</span>
                          <span>{b.runs}</span>
                          <span>{b.wickets}</span>
                          <span>{b.balls > 0 ? (b.runs / (b.balls / 6)).toFixed(1) : '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="live-match-container">
          <div className="match-header">
            <h1>{matchDetails.matchName}</h1>
            <div className="match-info-pills">
              <span className="pill">{innings === 1 ? "1st" : "2nd"} Innings</span>
              <span className="pill">{battingTeam} batting</span>
            </div>
          </div>

          <div className="scoreboard">
            <div className="score-display">
              <div className="main-score">
                <span className="runs">{score.runs}</span>
                <span className="wickets">/{score.wickets}</span>
              </div>
              <div className="score-details">
                <span className="overs">{overs} overs</span>
                {innings === 2 && <span className="target">Target: {target}</span>}
              </div>
            </div>
            
            <div className="match-status">
              {innings === 2 ? (
                <div className="chase-status">
                  <span className="runs-needed">Need {target - score.runs} runs</span>
                  <span className="balls-left">from {ballsRemaining} balls</span>
                </div>
              ) : (
                <span className="overs-left">{oversRemaining} overs remaining</span>
              )}
            </div>
          </div>

          <div className="batsmen-area">
            <div className={`batter-card ${onStrike === 0 ? 'on-strike' : ''}`}>
            <div className="batter-name">
                {currentBatters[0] !== null
                  ? getBatterName(0)
                  : "Select Batsman"}
              </div>
              <div className="batter-stats">
                {currentBatters[0] !== null ? getBatterStats(0) : ""}
              </div>
            </div>

            <div className={`batter-card ${onStrike === 1 ? 'on-strike' : ''}`}>
              <div className="batter-name">
                {currentBatters[1] !== null
                  ? getBatterName(1)
                  : "Select Batsman"}
              </div>
              <div className="batter-stats">
                {currentBatters[1] !== null ? getBatterStats(1) : ""}
              </div>
            </div>
          </div>

          <div className="bowler-area">
            <div className="bowler-card">
              <div className="bowler-name">{getBowlerName()}</div>
              <div className="bowler-stats">
                {currentBowler !== null &&
                  `${bowlerStats.find(b => b.name === getBowlerName())?.wickets}-${
                    bowlerStats.find(b => b.name === getBowlerName())?.runs
                  } (${Math.floor(bowlerStats.find(b => b.name === getBowlerName())?.balls / 6)}.${
                    bowlerStats.find(b => b.name === getBowlerName())?.balls % 6
                  })`}
              </div>
            </div>
          </div>

          <div className="ball-input-area">
            <div className="ball-input-card">
              <h3>Record Ball</h3>
              
              <div className="input-section">
                <label>Runs</label>
                <div className="runs-btns">
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <button
                      key={run}
                      className={`run-btn ${ballDetails.runs === run ? 'selected' : ''}`}
                      onClick={() => handleBallDetailsChange('runs', run)}
                    >
                      {run}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="input-section">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isExtra"
                    checked={ballDetails.isExtra}
                    onChange={(e) => handleBallDetailsChange('isExtra', e.target.checked)}
                  />
                  <label htmlFor="isExtra">Extra</label>
                </div>
                
                {ballDetails.isExtra && (
                  <div className="extra-section">
                    <div className="select-group">
                      <select
                        value={ballDetails.extraType}
                        onChange={(e) => handleBallDetailsChange('extraType', e.target.value)}
                      >
                        <option value="wide">Wide</option>
                        <option value="noBall">No Ball</option>
                        <option value="bye">Bye</option>
                        <option value="legBye">Leg Bye</option>
                      </select>
                    </div>
                    <div className="extra-runs">
                      <label>Extra Runs</label>
                      <div className="runs-btns">
                        {[1, 2, 3, 4, 5].map((run) => (
                          <button
                            key={run}
                            className={`run-btn ${ballDetails.extraRuns === run ? 'selected' : ''}`}
                            onClick={() => handleBallDetailsChange('extraRuns', run)}
                          >
                            {run}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="input-section">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isOut"
                    checked={ballDetails.isOut}
                    onChange={(e) => handleBallDetailsChange('isOut', e.target.checked)}
                  />
                  <label htmlFor="isOut">Wicket</label>
                </div>
                
                {ballDetails.isOut && (
                  <div className="wicket-section">
                    <div className="select-group">
                      <select
                        value={ballDetails.outType}
                        onChange={(e) => handleBallDetailsChange('outType', e.target.value)}
                      >
                        <option value="bowled">Bowled</option>
                        <option value="caught">Caught</option>
                        <option value="lbw">LBW</option>
                        <option value="runOut">Run Out</option>
                        <option value="stumped">Stumped</option>
                        <option value="hitWicket">Hit Wicket</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="primary-btn" onClick={processBall}>
                Record Ball
              </button>
            </div>
          </div>

          <div className="player-selection-area">
            {(currentBatters[0] === null || currentBatters[1] === null) && (
              <div className="selection-card">
                <h3>Select Batsman</h3>
                <div className="player-grid">
                  {(innings === 1 ? playersTeamA : playersTeamB).map((player, index) => {
                    const isBatting = currentBatters.includes(index);
                    const playerStats = batterStats.find(b => b.name === player);
                    const isOut = playerStats?.isOut;
                    
                    if (!isBatting && !isOut) {
                      return (
                        <button
                          key={index}
                          className="player-btn"
                          onClick={() => {
                            if (currentBatters[0] === null) {
                              setCurrentBatters([index, currentBatters[1]]);
                            } else {
                              setCurrentBatters([currentBatters[0], index]);
                            }
                          }}
                        >
                          {player}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
            
            {(currentBowler === null || showChangeBowler) && (
              <div className="selection-card">
                <h3>Select Bowler</h3>
                <div className="player-grid">
                  {(innings === 1 ? playersTeamB : playersTeamA).map((player, index) => {
                    // Prevent selecting the same bowler for consecutive overs
                    const isSameBowlerAsPrevious = index === lastBowlerIndex;
                    
                    if (!isSameBowlerAsPrevious || currentBowler === null) {
                      return (
                        <button
                          key={index}
                          className="player-btn"
                          onClick={() => {
                            setCurrentBowler(index);
                            setLastBowlerIndex(index);
                            setShowChangeBowler(false);
                          }}
                        >
                          {player}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="ball-history">
            <h3>Ball History</h3>
            <div className="history-list">
              {ballHistory.slice().reverse().slice(0, 12).map((ball, index) => {
                let displayText = "";
                
                if (ball.isExtra) {
                  if (ball.extraType === "wide" || ball.extraType === "noBall") {
                    displayText = ball.extraType === "wide" ? "WD" : "NB";
                    if (ball.extraRuns > 1) {
                      displayText += `+${ball.extraRuns - 1}`;
                    }
                  } else {
                    displayText = ball.extraType === "bye" ? "BYE" : "LB";
                    displayText += `+${ball.extraRuns}`;
                  }
                } else if (ball.isOut) {
                  displayText = "W";
                } else {
                  displayText = ball.runs.toString();
                }
                
                return (
                  <div key={index} className={`ball-item ${getBallClass(ball)}`}>
                    {displayText}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="action-buttons">
            <button className="secondary-btn" onClick={endInnings}>
              {innings === 1 ? "End Innings" : "End Match"}
            </button>
            <button className="danger-btn" onClick={endMatchManually}>
              End Match Early
            </button>
          </div>

          {/* Team summary sections */}
          <div className="team-summaries">
            <div className="team-summary">
              <h3>Batting Summary</h3>
              <div className="summary-table">
                <div className="table-header">
                  <span className="batter-col">Batter</span>
                  <span>R</span>
                  <span>B</span>
                  <span>4s</span>
                  <span>6s</span>
                  <span>SR</span>
                </div>
                {batterStats.map((batter, index) => {
                  if (batter.ballsFaced > 0 || currentBatters.includes(batter.playerIndex)) {
                    return (
                      <div key={index} className="table-row">
                        <span className="batter-col">
                          {batter.name}
                          {currentBatters[onStrike] === batter.playerIndex && " *"}
                          {currentBatters.includes(batter.playerIndex) && 
                           currentBatters[onStrike] !== batter.playerIndex && " "}
                        </span>
                        <span>{batter.runs}</span>
                        <span>{batter.ballsFaced}</span>
                        <span>{batter.fours}</span>
                        <span>{batter.sixes}</span>
                        <span>
                          {batter.ballsFaced > 0
                            ? ((batter.runs / batter.ballsFaced) * 100).toFixed(1)
                            : "-"}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            
            <div className="team-summary">
              <h3>Bowling Summary</h3>
              <div className="summary-table">
                <div className="table-header">
                  <span className="bowler-col">Bowler</span>
                  <span>O</span>
                  <span>M</span>
                  <span>R</span>
                  <span>W</span>
                  <span>Econ</span>
                </div>
                {bowlerStats.map((bowler, index) => {
                  if (bowler.balls > 0) {
                    return (
                      <div key={index} className="table-row">
                        <span className="bowler-col">
                          {bowler.name}
                          {currentBowler === bowler.playerIndex && " *"}
                        </span>
                        <span>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</span>
                        <span>{bowler.maidens}</span>
                        <span>{bowler.runs}</span>
                        <span>{bowler.wickets}</span>
                        <span>
                          {bowler.balls > 0
                            ? (bowler.runs / (bowler.balls / 6)).toFixed(1)
                            : "-"}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Snackbar for notifications */}
      {snackbar.open && (
        <div className={`snackbar ${snackbar.severity}`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

// Helper function to determine ball display class
const getBallClass = (ball) => {
  if (ball.isOut) return "wicket";
  if (ball.isExtra) return "extra";
  if (ball.runs === 4) return "boundary-four";
  if (ball.runs === 6) return "boundary-six";
  return "";
};

export default LiveMatch;