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
  const [matchId, setMatchId] = useState(null); // Store the match ID from the backend

  const fetchPastMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/live-match-stats`);
      if (Array.isArray(response.data)) {
        setPastMatches(response.data);
      } else {
        console.error("⚠️ Invalid data format from server:", response.data);
        setPastMatches([]);
      }
    } catch (error) {
      console.error("❌ Error fetching past matches:", error);
      setPastMatches([]);
    }
  };
  
useEffect(() => {
  fetchPastMatches();
}, []);

  const [allPlayers, setAllPlayers] = useState([
    "Sathush", "Dulshan", "Savindu", "Yamila", "Madhawa", "Chanuka",
    "Dihindu", "Farhan", "Shalom", "Achala", "Shanaka", "Ravindu",
    "Nidula", "Player 14", "Player 15"
  ]);

  const [playersTeamA, setPlayersTeamA] = useState([]);
  const [playersTeamB, setPlayersTeamB] = useState([]);

  // Match progress states
  const [matchStarted, setMatchStarted] = useState(false);
  const [innings, setInnings] = useState(1);
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [target, setTarget] = useState(null);

  // Current innings state
  const [currentBatters, setCurrentBatters] = useState([0, 1]); // Player indices
  const [onStrike, setOnStrike] = useState(0); // 0 or 1, index in currentBatters
  const [currentBowler, setCurrentBowler] = useState(null); // Player index
  const [batterStats, setBatterStats] = useState([]); // For current innings
  const [bowlerStats, setBowlerStats] = useState([]); // For current innings

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
      const match = response.data;
  
      // Set the summary and result state
      setMatchSummary({
        innings1: {
          battingTeam: match.teamA,
          runs: match.batters.reduce((sum, b) => sum + b.runs, 0),
          wickets: match.batters.filter(b => b.outs > 0).length,
          overs: 'N/A', // You can calculate if stored
          batters: match.batters.map(b => ({
            name: b.name,
            runs: b.runs,
            ballsFaced: b.balls,
            fours: 0,
            sixes: 0,
            isOut: b.outs > 0,
            outType: b.outs > 0 ? "out" : "",
            outBowler: ""
          })),
          bowlers: match.bowlers.map(b => ({
            name: b.name,
            balls: 0, // Optional
            runs: b.runsGiven,
            wickets: b.wickets
          }))
        },
        innings2: {
          battingTeam: match.teamB,
          runs: 0,
          wickets: 0,
          overs: "0.0",
          batters: [],
          bowlers: []
        },
        result: match.result
      });
  
      // Show the summary screen
      setMatchStarted(false);
    } catch (error) {
      console.error("❌ Error fetching match summary:", error);
      alert("Could not load match summary.");
    }
  };
  

  const deletePastMatch = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this match summary?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_URL}/api/live-match-stats/${id}`);
      alert("✅ Match deleted successfully");
      fetchPastMatches(); // Refresh list
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
      fetchPastMatches(); // Refresh past matches after backend auto-save
    } catch (error) {
      console.error("❌ Error updating UI after match:", error);
    }
  
    // Optional: reset local match summary state if needed
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

      setMatchId(response.data.match._id); // Store the match ID
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

      // Set first two batters
      setCurrentBatters([0, 1]);
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
      // Reset out details if not out
      ...(!field === "isOut" && !value ? { outType: "" } : {})
    }));
  };


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
  
      setOvers(updatedMatch.score.overs);
      const [oversPart, ballsPart] = updatedMatch.score.overs.split(".");
      setBalls(parseInt(oversPart) * 6 + parseInt(ballsPart));
  
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
        const nextBatterIndex = Math.max(...currentBatters) + 1;
        if (nextBatterIndex < currentPlayers.length) {
          setCurrentBatters((prev) => [
            ...prev.filter((b) => b !== currentBatters[onStrike]),
            nextBatterIndex,
          ]);
        }
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

  // Helper function to handle new batsman (to be implemented elsewhere)
  const handleNewBatter = () => {
    // Logic to add new batsman
    // This function should be implemented elsewhere in your code
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
  
    setCurrentBatters([0, 1]);
    setOnStrike(0);
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

    // Save current innings to match summary
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
        // Setup second innings
        setTarget(score.runs + 1);
        setInnings(2);

        // Swap teams
        setBattingTeam(bowlingTeam);
        setBowlingTeam(battingTeam);

        // Reset stats for second innings
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

        setCurrentBatters([0, 1]);
        setOnStrike(0);
        setCurrentBowler(null);

        setScore({ runs: 0, wickets: 0, extras: 0 });
        setOvers(0);
        setBalls(0);
        setBallHistory([]);
    } else {
        // End match
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

        // Refresh past matches
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
    <div className="cricket-match-container">
      {!matchStarted ? (
        // Match Setup Form
        <div className="match-setup">
          <h1>Cricket Match Setup</h1>

          <div className="match-details-form">
            <h2>Match Details</h2>
            <div>
              <input
                type="text"
                placeholder="Match Name"
                name="matchName"
                value={matchDetails.matchName}
                onChange={handleMatchDetailsChange}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Overs Limit"
                name="oversLimit"
                value={matchDetails.oversLimit}
                onChange={handleMatchDetailsChange}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Team A Name"
                name="teamA"
                value={matchDetails.teamA}
                onChange={handleMatchDetailsChange}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Team B Name"
                name="teamB"
                value={matchDetails.teamB}
                onChange={handleMatchDetailsChange}
              />
            </div>
          </div>

          <div className="teams-container">
            <div className="team-players">
              <h2>{matchDetails.teamA || "Team A"} Players</h2>
              <ul>
                {playersTeamA.map((player, index) => (
                  <li key={index}>
                    {player}{" "}
                    <button onClick={() => handleRemovePlayerFromTeam("A", player)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <select
                onChange={(e) => handleAddPlayerToTeam("A", e.target.value)}
                value=""
              >
                <option value="" disabled>
                  Add Player
                </option>
                {allPlayers.map((player, index) => (
                  <option key={index} value={player}>
                    {player}
                  </option>
                ))}
              </select>
            </div>

            <div className="team-players">
              <h2>{matchDetails.teamB || "Team B"} Players</h2>
              <ul>
                {playersTeamB.map((player, index) => (
                  <li key={index}>
                    {player}{" "}
                    <button onClick={() => handleRemovePlayerFromTeam("B", player)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <select
                onChange={(e) => handleAddPlayerToTeam("B", e.target.value)}
                value=""
              >
                <option value="" disabled>
                  Add Player
                </option>
                {allPlayers.map((player, index) => (
                  <option key={index} value={player}>
                    {player}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="start-match-btn" onClick={startMatch}>
            Start Match
          </button>

          {/* Past Matches Section */}
          <div className="past-matches">
  <h2>Past Matches</h2>
  {pastMatches.length > 0 ? (
    pastMatches.map((match) => {
      const innings1 = match.innings1 || {
        battingTeam: "Team A",
        runs: 0,
        wickets: 0,
        overs: "0.0",
        batters: [],
        bowlers: [],
      };
      const innings2 = match.innings2 || {
        battingTeam: "Team B",
        runs: 0,
        wickets: 0,
        overs: "0.0",
        batters: [],
        bowlers: [],
      };

      return (
        <div
          key={match._id}
          className="past-match-summary"
          onClick={() =>
            setMatchSummary({
              innings1,
              innings2,
              result: match.result || "No result available",
            })
          }
          style={{ cursor: "pointer", position: "relative" }}
        >
          <h3>{match.innings1?.battingTeam || "Team A"} vs {match.innings2?.battingTeam || "Team B"}</h3>
          <p>Result: {match.result || "No result"}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deletePastMatch(match._id);
            }}
            className="delete-match-btn"
          >
            Delete
          </button>
        </div>
      );
    })
  ) : (
    <p>No past matches available.</p>
  )}
</div>
        </div>
      ) : matchSummary.result ? (
        // Match Summary Display
        <div className="match-summary">
          <h1>{matchDetails.matchName} - Match Summary</h1>
          
          <div className="match-result">
            <h2>Result: {matchSummary.result}</h2>
          </div>
          
          <div className="innings-summary">
            <h2>1st Innings: {matchSummary.innings1.battingTeam}</h2>
            <h3>{matchSummary.innings1.runs}/{matchSummary.innings1.wickets} ({matchSummary.innings1.overs} overs)</h3>
            
            <h4>Batting</h4>
            <table>
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {matchSummary.innings1.batters.map((batter, i) => (
                  <tr key={`i1-batter-${i}`}>
                    <td>{batter.name}</td>
                    <td>{batter.runs}</td>
                    <td>{batter.ballsFaced}</td>
                    <td>{batter.fours}</td>
                    <td>{batter.sixes}</td>
                    <td>{batter.ballsFaced > 0 ? ((batter.runs / batter.ballsFaced) * 100).toFixed(2) : 0}</td>
                    <td>{batter.isOut ? `${batter.outType} ${batter.outBowler ? `b ${batter.outBowler}` : ''}` : 'not out'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h4>Bowling</h4>
            <table>
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                {matchSummary.innings1.bowlers.map((bowler, i) => (
                  <tr key={`i1-bowler-${i}`}>
                    <td>{bowler.name}</td>
                    <td>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="innings-summary">
            <h2>2nd Innings: {matchSummary.innings2.battingTeam}</h2>
            <h3>{matchSummary.innings2.runs}/{matchSummary.innings2.wickets} ({matchSummary.innings2.overs} overs)</h3>
            <p>Target: {target}</p>
            
            <h4>Batting</h4>
            <table>
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {matchSummary.innings2.batters.map((batter, i) => (
                  <tr key={`i2-batter-${i}`}>
                    <td>{batter.name}</td>
                    <td>{batter.runs}</td>
                    <td>{batter.ballsFaced}</td>
                    <td>{batter.fours}</td>
                    <td>{batter.sixes}</td>
                    <td>{batter.ballsFaced > 0 ? ((batter.runs / batter.ballsFaced) * 100).toFixed(2) : 0}</td>
                    <td>{batter.isOut ? `${batter.outType} ${batter.outBowler ? `b ${batter.outBowler}` : ''}` : 'not out'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h4>Bowling</h4>
            <table>
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                {matchSummary.innings2.bowlers.map((bowler, i) => (
                  <tr key={`i2-bowler-${i}`}>
                    <td>{bowler.name}</td>
                    <td>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{bowler.balls > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button onClick={saveMatchSummary}>Save Match</button>
          <button onClick={() => {
            setMatchStarted(false);
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
          }}>New Match</button>
        </div>
      ) : (
        // Live Match Display
        <div className="live-match">
          <h1>{matchDetails.matchName}</h1>
          
          <div className="match-info">
            <h2>Innings {innings} - {battingTeam} batting</h2>
            <div className="score-display">
              <span className="score">{score.runs}/{score.wickets}</span>
              <span className="overs">({overs} overs)</span>
              {innings === 2 && <span className="target">Target: {target}</span>}
            </div>
            
            <div className="innings-info">
              {innings === 2 ? (
                <p>Need {target - score.runs} runs from {oversRemaining} overs</p>
              ) : (
                <p>{ballsRemaining / 6} overs remaining</p>
              )}
            </div>
          </div>
          
          <div className="batters-info">
            <div className={`batter ${onStrike === 0 ? 'on-strike' : ''}`}>
              <span>{getBatterName(0)} {getBatterStats(0)}</span>
              {onStrike === 0 && <span>*</span>}
            </div>
            <div className={`batter ${onStrike === 1 ? 'on-strike' : ''}`}>
              <span>{getBatterName(1)} {getBatterStats(1)}</span>
              {onStrike === 1 && <span>*</span>}
            </div>
          </div>
          
          <div className="bowler-info">
            <h3>Bowler: 
              {currentBowler === null ? (
                <select 
                  value="" 
                  onChange={(e) => setCurrentBowler(Number(e.target.value))}
                >
                  <option value="" disabled>Select Bowler</option>
                  {(innings === 1 ? playersTeamB : playersTeamA)
                    .filter((p, i) => p.trim() !== "")
                    .map((player, i) => (
                      <option key={`bowler-${i}`} value={i}>
                        {player}
                      </option>
                    ))
                  }
                </select>
              ) : (
                getBowlerName()
              )}
            </h3>
            {currentBowler !== null && bowlerStats.find(b => b.playerIndex === currentBowler) && (
              <p>
                {Math.floor(bowlerStats.find(b => b.playerIndex === currentBowler).balls / 6)}.
                {bowlerStats.find(b => b.playerIndex === currentBowler).balls % 6} - 
                {bowlerStats.find(b => b.playerIndex === currentBowler).runs} - 
                {bowlerStats.find(b => b.playerIndex === currentBowler).wickets}
              </p>
            )}
          </div>
          
          <div className="ball-input">
            <h3>Ball Details</h3>
            
            <div className="input-section">
              <label>
                Runs:
                <select
                  value={ballDetails.runs}
                  onChange={(e) => handleBallDetailsChange('runs', Number(e.target.value))}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </label>
              
              <label>
                Ball Type:
                <select
                  value={ballDetails.ballType}
                  onChange={(e) => handleBallDetailsChange('ballType', e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="dot">Dot Ball</option>
                  <option value="yorker">Yorker</option>
                  <option value="bouncer">Bouncer</option>
                </select>
              </label>
            </div>
            
            <div className="input-section">
              <label>
                <input 
                  type="checkbox" 
                  checked={ballDetails.isOut}
                  onChange={(e) => handleBallDetailsChange('isOut', e.target.checked)}
                />
                Wicket
              </label>
              
              {ballDetails.isOut && (
                <select
                  value={ballDetails.outType}
                  onChange={(e) => handleBallDetailsChange('outType', e.target.value)}
                >
                  <option value="bowled">Bowled</option>
                  <option value="caught">Caught</option>
                  <option value="lbw">LBW</option>
                  <option value="run out">Run Out</option>
                  <option value="stumped">Stumped</option>
                </select>
              )}
            </div>
            
            <div className="input-section">
              <label>
                <input 
                  type="checkbox"
                  checked={ballDetails.isExtra}
                  onChange={(e) => handleBallDetailsChange('isExtra', e.target.checked)}
                />
                Extra
              </label>
              
              {ballDetails.isExtra && (
                <>
                  <select
                    value={ballDetails.extraType}
                    onChange={(e) => handleBallDetailsChange('extraType', e.target.value)}
                  >
                    <option value="wide">Wide</option>
                    <option value="noBall">No Ball</option>
                    <option value="bye">Bye</option>
                    <option value="legBye">Leg Bye</option>
                  </select>
                  
                  <select
                    value={ballDetails.extraRuns}
                    onChange={(e) => handleBallDetailsChange('extraRuns', Number(e.target.value))}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </>
              )}
            </div>
            
            <button onClick={processBall}>Record Ball</button>
            <button className="end-match-btn" onClick={endMatchManually}>
              End Match Now
            </button>
            <button onClick={endInnings}>End Innings</button> {/* New button */}
          </div>
          
          <div className="ball-history">
            <h3>Recent Balls</h3>
            <div className="history-display">
              {ballHistory.slice(-12).map((ball, i) => (
                <div key={`ball-${i}`} className="ball-record">
                  <span className={`
                    ${ball.isOut ? 'wicket' : ''} 
                    ${ball.runs === 4 ? 'four' : ''} 
                    ${ball.runs === 6 ? 'six' : ''} 
                    ${ball.isExtra ? 'extra' : ''}
                  `}>
                    {ball.isOut ? 'W' : ball.isExtra ? `${ball.extraType.charAt(0)}` : ball.runs}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="stats-display">
  <div className="batting-stats">
    <h3>Batting Stats</h3>
    <table>
      <thead>
        <tr>
          <th>Batter</th>
          <th>R</th>
          <th>B</th>
          <th>4s</th>
          <th>6s</th>
          <th>SR</th>
        </tr>
      </thead>
      <tbody>
        {batterStats?.map((batter, i) => {
          const isOnField = currentBatters.includes(batter.playerIndex);
          const isOnStrike = onStrike === currentBatters.indexOf(batter.playerIndex);
          return (
            <tr key={`batter-${i}`} className={batter.isOut ? 'out' : ''}>
              <td>
                {batter.name}
                {isOnField ? (isOnStrike ? ' *' : '') : ''}
              </td>
              <td>{batter.runs}</td>
              <td>{batter.ballsFaced}</td>
              <td>{batter.fours}</td>
              <td>{batter.sixes}</td>
              <td>
                {batter.ballsFaced > 0
                  ? ((batter.runs / batter.ballsFaced) * 100).toFixed(2)
                  : '0.00'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  <div className="bowling-stats">
    <h3>Bowling Stats</h3>
    <table>
      <thead>
        <tr>
          <th>Bowler</th>
          <th>O</th>
          <th>R</th>
          <th>W</th>
          <th>Econ</th>
        </tr>
      </thead>
      <tbody>
        {bowlerStats?.map((bowler, i) => (
          <tr
            key={`bowler-${i}`}
            className={bowler.playerIndex === currentBowler ? 'current' : ''}
          >
            <td>{bowler.name}</td>
            <td>
              {Math.floor(bowler.balls / 6)}.{bowler.balls % 6}
            </td>
            <td>{bowler.runs}</td>
            <td>{bowler.wickets}</td>
            <td>
              {bowler.balls > 0
                ? (bowler.runs / (bowler.balls / 6)).toFixed(2)
                : '0.00'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
      )}
    </div>
  );
};

export default LiveMatch;