import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LiveMatch.css";
import { toast } from "react-toastify";
import MatchSummary from "../components/MatchSummary";
import PastMatches from "../components/PastMatches";
import SummaryModal from "../components/SummaryModal";



const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5001"
  : "https://frontyardcricket.onrender.com";

const LiveMatch = () => {
  const [matchDetails, setMatchDetails] = useState({
    matchName: "",
    oversLimit: 0,
    teamA: "",
    teamB: "",
    tossWinner: "",
    tossDecision: "",
  });
  const [pastMatches, setPastMatches] = useState([]);
  const [matchId, setMatchId] = useState(null);
  const [lastBowlerIndex, setLastBowlerIndex] = useState(null);
  const [selectedMatchName, setSelectedMatchName] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [openersSelected, setOpenersSelected] = useState(false);
  const [showBoundaryAnimation, setShowBoundaryAnimation] = useState(false);
  const [boundaryType, setBoundaryType] = useState(null);
  const [showWicketAnimation, setShowWicketAnimation] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Disable animations on mobile devices for better performance
    const isMobile = window.innerWidth <= 768;
    setShouldAnimate(!isMobile);
  }, []);

  useEffect(() => {
  const fetchOngoingMatch = async () => {
    const savedMatchId = localStorage.getItem("liveMatchId");

    if (!savedMatchId || savedMatchId === "null") {
      console.warn("❌ No valid match ID found.");
      toast.error("No ongoing match found. Please start a new match.", {
        position: "top-center",
      });
      return;
    }

    try {
      // ✅ Fetch match data from backend
      const res = await axios.get(`${API_URL}/api/live-match/${savedMatchId}`);
      const match = res.data;

      if (!match) {
        console.warn("❌ Match data not found.");
        return;
      }

      console.log("✅ Match data fetched successfully", match);

      // ✅ Set basic match details
      setMatchId(match.matchId);
      localStorage.setItem("liveMatchId", match.matchId);
      setMatchDetails({
        matchName: match.matchName ?? "",
        oversLimit: match.oversLimit ?? 0,
        teamA: match.teamA ?? "",
        teamB: match.teamB ?? "",
        tossWinner: match.tossWinner ?? "",
        tossDecision: match.tossDecision ?? "",
      });

      // ✅ Determine Batting and Bowling teams
      const battingTeam =
        match.tossWinner === match.teamA && match.tossDecision === "bat"
          ? match.teamA
          : match.tossWinner === match.teamB && match.tossDecision === "bat"
          ? match.teamB
          : match.tossWinner === match.teamA
          ? match.teamB
          : match.teamA;

      const bowlingTeam = battingTeam === match.teamA ? match.teamB : match.teamA;

      setBattingTeam(battingTeam);
      setBowlingTeam(bowlingTeam);

      // ✅ Set player lists
      setPlayersTeamA(match.teamAPlayers ?? []);
      setPlayersTeamB(match.teamBPlayers ?? []);

      // ✅ Restore Batters and Bowlers
      setBatterStats(match.batterStats ?? []);
      setBowlerStats(match.bowlerStats ?? []);

      if (Array.isArray(match.currentBatters) && match.currentBatters.length > 0) {
        console.log("✅ Restoring current batters from backend state", match.currentBatters);
      
        const teamList = battingTeam === match.teamA ? match.teamAPlayers : match.teamBPlayers;
        const validBatters = match.currentBatters.map((batter) =>
          teamList.findIndex((player) => player === batter.name)
        );
      
        setCurrentBatters(validBatters);
        setOpenersSelected(true);
      } else {
        console.warn("❌ Current Batters not found, setting to manual selection.");
        setCurrentBatters([null, null]);
        setOpenersSelected(false);
      }
      

      // ✅ Restore current bowler
      if (match.currentBowler) {
        setCurrentBowler(match.currentBowler.index ?? null);
      } else {
        setCurrentBowler(null);
      }

      // ✅ Restore other state
      setOnStrike(match.onStrike ?? 0);

      // ✅ Restore Ball History
      setBallHistory(Array.isArray(match.score?.balls) ? match.score.balls : []);

      // ✅ Restore Score, Overs, and Balls
      const oversStr = match.score?.overs ?? "0.0";
      setOvers(oversStr);
      const [oversPart, ballsPart] = oversStr.split(".");
      const totalBalls = parseInt(oversPart || "0") * 6 + parseInt(ballsPart || "0");
      setBalls(totalBalls);
      setScore(match.score ?? { runs: 0, wickets: 0, extras: 0 });

      // ✅ Set match started state
      setMatchStarted(!match.isFinished);

      // ✅ Restore local state if present
      restoreMatchStateFromLocalStorage();

      // ✅ Success notification
      toast.success("Match data restored successfully!", { position: "top-center" });
    } catch (error) {
      console.error("❌ Failed to fetch ongoing match details", error.message);
      toast.error("Error restoring match. Please try again.", {
        position: "top-center",
      });
      localStorage.removeItem("liveMatchId");
    }
  };

  /**
   * ✅ Restore State from LocalStorage
   */
  const restoreMatchStateFromLocalStorage = () => {
    try {
      const savedState = JSON.parse(localStorage.getItem("liveMatchState"));
      if (savedState) {
        setCurrentBatters(savedState.currentBatters ?? [null, null]);
        setCurrentBowler(savedState.currentBowler ?? null);
        setBatterStats(savedState.batterStats ?? []);
        setBowlerStats(savedState.bowlerStats ?? []);
        setBallHistory(savedState.ballHistory ?? []);
        setOnStrike(savedState.onStrike ?? 0);
        setBalls(savedState.balls ?? 0);
        setOvers(savedState.overs ?? "0.0");
        setInnings(savedState.innings ?? 1);
        setBattingTeam(savedState.battingTeam ?? "");
        setBowlingTeam(savedState.bowlingTeam ?? "");
        setPlayersTeamA(savedState.playersTeamA ?? []);
        setPlayersTeamB(savedState.playersTeamB ?? []);
        setMatchDetails(savedState.matchDetails ?? {});
        setMatchId(savedState.matchId ?? null);
        setScore(savedState.score ?? { runs: 0, wickets: 0, extras: 0 });
        setTarget(savedState.target ?? null);
        setShowChangeBowler(savedState.showChangeBowler ?? false);

        console.log("✅ Match state restored successfully from localStorage");
      }
    } catch (error) {
      console.error("❌ Error restoring match state from localStorage:", error.message);
    }
  };

  // ✅ Execute fetch
  fetchOngoingMatch();
  fetchPastMatches();
}, []);


  const handleSelectOpener = (playerName) => {
    setCurrentBatters((prev) => {
      const [first, second] = prev;
      if (first === null) {
        return [playerName, second];
      } else if (second === null) {
        return [first, playerName];
      }
      return prev;
    });
  
    // Check if both batters are selected
    const updatedBatters = currentBatters.filter((b) => b !== null);
    if (updatedBatters.length === 2) {
      setOpenersSelected(true);
      saveMatchStateToLocalStorage();
    }
  };
  
  
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
      if (!matchId || matchId === "undefined" || matchId === null) {
        console.error("❌ Invalid Match ID received:", matchId);
        toast.error("Invalid match ID. Please try again.", {
          position: "top-center",
        });
        return;
      }
  
      console.log("🚀 Fetching match summary for ID:", matchId);
  
      // ✅ Check the URL structure
      const requestUrl = `${API_URL}/api/live-match/${matchId}`;
      console.log("🌐 API Call to:", requestUrl);
  
      // ✅ Make the API call
      const response = await axios.get(requestUrl);
  
      if (response.status === 200 && response.data) {
        // ✅ Update the state with the response data
        setMatchSummary(response.data);
        setSelectedMatchId(matchId);  
        setSelectedMatchName(`${response.data.teamA} vs ${response.data.teamB}`);
  
        // ✅ Display the modal after a small delay
        setTimeout(() => setShowSummaryModal(true), 50);
        console.log("✅ Match summary loaded successfully");
      } else {
        console.warn("⚠️ Match summary not found");
        toast.error("Match summary not found. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("❌ Failed to fetch match summary:", error.message);
      toast.error("Failed to fetch match summary. Please try again.", {
        position: "top-center",
      });
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
  const determineTeamsAfterToss = (tossWinner, tossDecision, teamA, teamB, playersA, playersB) => {
    // 🚀 Set Batting and Bowling Teams based on the decision
    const battingTeam = tossDecision === "bat" ? tossWinner : (tossWinner === teamA ? teamB : teamA);
    const bowlingTeam = battingTeam === teamA ? teamB : teamA;
  
    // ✅ Set the Player Lists Correctly
    const battingPlayers = battingTeam === teamA ? playersA : playersB;
    const bowlingPlayers = bowlingTeam === teamA ? playersA : playersB;
  
    // ✅ Update State Correctly
    setBattingTeam(battingTeam);
    setBowlingTeam(bowlingTeam);
  
    console.log(`🏏 Batting Team: ${battingTeam} | Bowling Team: ${bowlingTeam}`);
    
    // Return the data for further use
    return { battingTeam, bowlingTeam, battingPlayers, bowlingPlayers };
  };  
  
  const startMatch = async () => {
    if (
      !matchDetails.matchName ||
      matchDetails.oversLimit <= 0 ||
      !matchDetails.teamA ||
      !matchDetails.teamB ||
      !matchDetails.tossWinner ||
      !matchDetails.tossDecision
    ) {
      alert("❌ Please fill all match details including toss info!");
      return;
    }
  
    try {
      // ✅ Send match setup to backend
      const response = await axios.post(`${API_URL}/api/live-match`, {
        matchName: matchDetails.matchName,
        oversLimit: matchDetails.oversLimit,
        teamA: matchDetails.teamA,
        teamB: matchDetails.teamB,
        playersTeamA,
        playersTeamB,
        tossWinner: matchDetails.tossWinner,
        tossDecision: matchDetails.tossDecision,
      });
  
      const createdMatch = response.data.match;
  
      // ✅ Set match details in the state and localStorage
      setMatchId(createdMatch._id);
      localStorage.setItem("liveMatchId", createdMatch._id);
      setMatchStarted(true);
      setInnings(1);
  
      // ✅ Determine batting and bowling teams using the function
      const {
        battingTeam,
        bowlingTeam,
        battingPlayers,
        bowlingPlayers
      } = determineTeamsAfterToss(
        matchDetails.tossWinner,
        matchDetails.tossDecision,
        matchDetails.teamA,
        matchDetails.teamB,
        playersTeamA,
        playersTeamB
      );
  
      // ✅ Set the player lists correctly
      setPlayersTeamA(battingTeam === matchDetails.teamA ? battingPlayers : bowlingPlayers);
      setPlayersTeamB(bowlingTeam === matchDetails.teamA ? battingPlayers : bowlingPlayers);
  
      // ✅ Initialize Batter and Bowler Stats
      const initialBatterStats = battingPlayers.map((player, index) => ({
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
  
      const initialBowlerStats = bowlingPlayers.map((player, index) => ({
        playerIndex: index,
        name: player,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
        economy: 0,
      }));
  
      setBatterStats(initialBatterStats);
      setBowlerStats(initialBowlerStats);
  
      // ✅ Wait for manual selection of openers
      setCurrentBatters([null, null]);
      setOpenersSelected(false);
  
      // ✅ Initialize Match State
      setOnStrike(0);
      setScore({ runs: 0, wickets: 0, extras: 0 });
      setOvers("0.0");
      setBalls(0);
      setBallHistory([]);
  
      // ✅ Save the initial state to LocalStorage
      saveMatchStateToLocalStorage();
  
      toast.success("✅ Match Started Successfully!", { position: "top-center" });
  
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

  const triggerAnimation = (type, runs) => {
    if (type === 'boundary') {
      setBoundaryType(runs);
      setShowBoundaryAnimation(true);
      setTimeout(() => setShowBoundaryAnimation(false), 1500);
    } else if (type === 'wicket') {
      setShowWicketAnimation(true);
      setTimeout(() => setShowWicketAnimation(false), 2000);
    }
  };

  const processBall = async () => {
    if (currentBowler === null) {
      toast.error("Please select a bowler first!", { position: "top-center" });
      return;
    }
  
    if (!matchId) {
      console.error("❌ Error: Match ID is not defined");
      toast.error("Match ID is not available. Please refresh and try again.", { position: "top-center" });
      return;
    }
  
    // 🚀 Determine the current teams
    const currentPlayers = innings === 1 ? playersTeamA : playersTeamB;
    const currentBowlingPlayers = innings === 1 ? playersTeamB : playersTeamA;
    const striker = currentBatters[onStrike];
  
    // 🚀 Ensure valid batter and bowler selections
    if (striker === null || !currentPlayers[striker]) {
      toast.error("Please select a valid batter before proceeding.", { position: "top-center" });
      console.error("❌ No batter found for the current striker index.");
      return;
    }
  
    if (!currentBowlingPlayers[currentBowler]) {
      toast.error("Invalid bowler selected. Please choose a valid bowler.", { position: "top-center" });
      console.error("❌ No bowler found for the current bowler index.");
      return;
    }
  
    // ✅ Build the ball record for backend submission
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
  
    console.log("📦 Sending ball record to backend:", ballRecord);
  
    try {
      // Add animations based on the ball outcome
      if (ballDetails.runs === 4 || ballDetails.runs === 6) {
        triggerAnimation('boundary', ballDetails.runs);
      }
      if (ballDetails.isOut) {
        triggerAnimation('wicket');
      }

      // ✅ Save state before processing the ball
      saveMatchStateToLocalStorage();
  
      // ✅ Send the ball data to the backend
      const response = await axios.post(
        `${API_URL}/api/live-match/${matchId}/ball`,
        ballRecord
      );
  
      if (response.status !== 200) {
        console.error("❌ Backend Error: ", response.data);
        toast.error("Failed to process ball. Backend error occurred.");
        return;
      }
  
      const updatedMatch = response.data.match;
  
      // ✅ Update score and overs
      setScore({
        runs: updatedMatch.score.runs,
        wickets: updatedMatch.score.wickets,
        extras: updatedMatch.score.extras || 0,
      });
  
      // ✅ Restore Ball History
      setBallHistory(updatedMatch.score.balls);
  
      const oversStr = updatedMatch.score.overs || "0.0";
      setOvers(oversStr);
  
      const [oversPart, ballsPart] = oversStr.split(".");
      const totalBalls = parseInt(oversPart || "0") * 6 + parseInt(ballsPart || "0");
      setBalls(totalBalls);
  
      // ✅ Show change bowler option if over is complete
      if (oversStr.endsWith(".0")) {
        toast.info("📝 Over complete! Please select a new bowler.");
        setShowChangeBowler(true);
      }
  
      // ✅ Update batter and bowler stats
      setBatterStats(updatedMatch.batterStats);
      setBowlerStats(updatedMatch.bowlerStats);
  
      // ✅ Check if it's a legal delivery
      const isLegalDelivery = !(
        ballRecord.isExtra &&
        (ballRecord.extraType === "wide" || ballRecord.extraType === "noBall")
      );
  
      const totalRunsForBall =
        ballRecord.runs + (ballRecord.isExtra ? ballRecord.extraRuns : 0);
  
      // 🏏 **Last Man Stands Logic**
      const teamSize = innings === 1 ? playersTeamA.length : playersTeamB.length;
      const lastManStands = updatedMatch.score.wickets === teamSize - 1;
  
      if (lastManStands) {
        toast.warning("⚠️ Last batter remains. No more wickets left!", {
          position: "top-center",
          autoClose: 3000,
        });
  
        if (isLegalDelivery && totalRunsForBall % 2 === 1) {
          toast.info("🔄 Last batter switches ends!");
        }
      } else {
        // ✅ Normal switching logic
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
      }
  
      // ✅ Handle the out scenario
      if (ballRecord.isOut) {
        setCurrentBatters((prevBatters) => {
          const updated = [...prevBatters];
          updated[onStrike] = null;
          return updated;
        });
  
        if (lastManStands) {
          toast.error("💀 Last man is out! Innings ends.");
          endInnings();
        }
      }
  
     // ✅ Update Backend with Current Players
      const updatedBatters = currentBatters.map((index) => ({
        name: innings === 1 ? playersTeamA[index] : playersTeamB[index],
        index,
      }));

      const updatedBowler = {
        name: innings === 1 ? playersTeamB[currentBowler] : playersTeamA[currentBowler],
        index: currentBowler,
      };

      await axios.put(`${API_URL}/api/live-match/${matchId}/update-current-players`, {
        currentBatters: updatedBatters,
        currentBowler: updatedBowler,
      });

      // ✅ Save State to Local Storage
      saveMatchStateToLocalStorage();
  
      // ✅ Match finishes
      if (updatedMatch.isFinished) {
        setMatchStarted(false);
        setMatchSummary({
          innings1: updatedMatch.innings1 || {},
          innings2: updatedMatch.innings2 || {},
          result: updatedMatch.result || "Match Finished",
        });
        fetchPastMatches();
        localStorage.removeItem("liveMatchId");
        setMatchId(null);
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
      console.error("❌ Error processing ball:", error.response?.data || error.message);
      toast.error(`Failed to process ball: ${error.response?.data?.message || error.message}`);
    } finally {
      // ✅ Reset the ball details after each delivery
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
  
  const saveMatchStateToLocalStorage = () => {
    try {
      const state = {
        currentBatters,
        currentBowler,
        batterStats,
        bowlerStats,
        ballHistory,
        onStrike,
        balls,
        overs,
        innings,
        battingTeam,
        bowlingTeam,
        playersTeamA,
        playersTeamB,
        matchDetails,
        matchId,
        score,
        target,
        showChangeBowler,
      };
      
      localStorage.setItem("liveMatchState", JSON.stringify(state));
      console.log("✅ Match state saved successfully to localStorage");
    } catch (error) {
      console.error("❌ Error saving match state to localStorage:", error.message);
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
  
  const endInnings = async () => {
    // Get the current players and the innings key
    const currentPlayers = innings === 1 ? playersTeamA : playersTeamB;
    const currentInningsKey = innings === 1 ? "innings1" : "innings2";
    const currentOvers = `${Math.floor(balls / 6)}.${balls % 6}`;
  
    // 📝 Update the match summary state
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
  
    // ✅ Save the current innings to the backend
    try {
      await axios.put(`${API_URL}/api/live-match/${matchId}/update-innings`, {
        innings: currentInningsKey,
        battingTeam,
        runs: score.runs,
        wickets: score.wickets,
        extras: score.extras,
        overs: currentOvers,
        batters: batterStats,
        bowlers: bowlerStats,
        ballByBall: ballHistory,
      });
      console.log("Innings data successfully saved to the database.");
    } catch (error) {
      console.error("Failed to save innings data to the backend", error);
    }
  
    // 🌟 If it's the first innings
    if (innings === 1) {
      toast.info(`End of Innings 1. Target set to ${score.runs + 1}`, {
        position: "top-center",
      });
  
      // 🎯 Set the target for the second innings
      setTarget(score.runs + 1);
      setInnings(2);
  
      // 🏏 Switch the teams for the second innings
      setBattingTeam(bowlingTeam);
      setCurrentBatters([null, null]);
      setBowlingTeam(battingTeam);
  
      // 📝 Initialize the new batter and bowler stats
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
  
      // 🔄 Reset the state for the new innings
      setOnStrike(0);
      setCurrentBowler(null);
  
      setScore({ runs: 0, wickets: 0, extras: 0 });
      setOvers("0.0");
      setBalls(0);
      setBallHistory([]);
  
      toast.success("Second Innings Started!", { position: "top-center" });
      
      // ✅ Save the new state to local storage
      saveMatchStateToLocalStorage();
  
    } else {
      // 🔚 If it's the end of the second innings
      const teamAWon = score.runs >= target;
      const runsDifference = Math.abs(target - score.runs);
  
      let result = "";
      if (score.runs === target) {
        result = "Match Tied!";
        toast.info("🏏 Match Tied!", { position: "top-center" });
      } else if (teamAWon) {
        result = `${battingTeam} won by ${
          playersTeamB.length - score.wickets - 1
        } wickets`;
        toast.success(`${battingTeam} Wins!`, { position: "top-center" });
      } else {
        result = `${bowlingTeam} won by ${runsDifference} runs`;
        toast.error(`${bowlingTeam} Wins!`, { position: "top-center" });
      }
  
      // 📝 Update the match summary with the result
      setMatchSummary((prev) => ({
        ...prev,
        result,
      }));
  
      // ✅ Save the full match result to the backend
      try {
        await axios.put(`${API_URL}/api/live-match/${matchId}/update-result`, {
          result: result,
          innings1: matchSummary.innings1,
          innings2: matchSummary.innings2,
        });
        console.log("Match result successfully saved to the database.");
      } catch (error) {
        console.error("Failed to save match result to the backend", error);
      }
  
      // 🔄 Match is finished
      setMatchStarted(false);
      fetchPastMatches();
      localStorage.removeItem("liveMatchId");
      setMatchId(null);
    }
  };
  
  const ballsRemaining = (Number(matchDetails?.oversLimit || 0) * 6) - (balls || 0);
  const oversRemaining = ballsRemaining > 0 ? (ballsRemaining / 6).toFixed(1) : "0.0";  

  const getBatterName = (index) => {
    const teamList = battingTeam === matchDetails.teamA ? playersTeamA : playersTeamB;
    const batterIndex = currentBatters[index];
    return batterIndex !== null ? teamList[batterIndex] : "Select Batsman";
  };
  
const getBowlerName = () => {
  const players = innings === 1 ? playersTeamB : playersTeamA;
  return currentBowler !== null && players[currentBowler]
    ? players[currentBowler]
    : "Select Bowler";
};
  
  // Get batter stats display
  const getBatterStats = (index) => {
    const playerName = getBatterName(index);
    const batter = batterStats.find((b) => b.name === playerName);
    
    if (batter) {
      return `${batter.runs} (${batter.ballsFaced})`;
    }
    return "";
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
      localStorage.removeItem("liveMatchId");
      setMatchId(null);
    } catch (err) {
      console.error("❌ Failed to end match manually:", err);
      alert("Could not end match. Try again.");
    }
  };
  const resumeMatch = async () => {
    const savedMatchId = localStorage.getItem("liveMatchId");
    if (!savedMatchId) return;
  
    try {
      const res = await axios.get(`${API_URL}/api/live-match/${savedMatchId}`);
      const match = res.data;
  
      setMatchId(match.matchId);
      setMatchDetails({
        matchName: match.matchName,
        oversLimit: match.oversLimit,
        teamA: match.teamA,
        teamB: match.teamB,
        tossWinner: match.tossWinner,
        tossDecision: match.tossDecision,
      });
  
      setPlayersTeamA(match.playersTeamA || []);
      setPlayersTeamB(match.playersTeamB || []);
      setBattingTeam(match.battingTeam);
      setBowlingTeam(match.bowlingTeam);
      setInnings(match.innings);
      setScore(match.score);
      setOvers(match.score?.overs || 0);
      setBalls(match.score?.balls || 0);
      setBatterStats(match.batterStats || []);
      setBowlerStats(match.bowlerStats || []);
      setCurrentBatters(match.currentBatters || [null, null]);
      setOnStrike(match.onStrike ?? 0);
      setBallHistory(match.ballHistory || []);
      setMatchStarted(true);
    } catch (err) {
      console.error("❌ Failed to resume match:", err);
      alert("Could not resume match. Try again.");
      localStorage.removeItem("liveMatchId");
    }
  };
  const handleSelectBatter = async (playerName) => {
    const teamList = battingTeam === matchDetails.teamA ? playersTeamA : playersTeamB;
    const playerIndex = teamList.indexOf(playerName);
  
    if (playerIndex !== -1) {
      setCurrentBatters((prev) => {
        if (prev[0] === null) {
          return [playerIndex, prev[1]];
        } else if (prev[1] === null) {
          return [prev[0], playerIndex];
        }
        return prev;
      });
  
      const updatedBatters = currentBatters.filter((b) => b !== null);
      if (updatedBatters.length === 2) {
        setOpenersSelected(true);
  
        // 🔄 Update backend
        await axios.put(`${API_URL}/api/live-match/${matchId}/update-current-players`, {
          currentBatters: [
            { name: teamList[updatedBatters[0]], index: updatedBatters[0] },
            { name: teamList[updatedBatters[1]], index: updatedBatters[1] }
          ],
          currentBowler,
        });
  
        saveMatchStateToLocalStorage();
      }
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
            <div className="form-group">
              <label htmlFor="tossWinner">Toss Winner</label>
              <select
                name="tossWinner"
                value={matchDetails.tossWinner}
                onChange={handleMatchDetailsChange}
                className="form-input"
              >
                <option value="">Select Toss Winner</option>
                <option value={matchDetails.teamA}>{matchDetails.teamA || "Team A"}</option>
                <option value={matchDetails.teamB}>{matchDetails.teamB || "Team B"}</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tossDecision">Toss Decision</label>
              <select
                name="tossDecision"
                value={matchDetails.tossDecision}
                onChange={handleMatchDetailsChange}
                className="form-input"
              >
                <option value="">Select Decision</option>
                <option value="bat">Bat</option>
                <option value="bowl">Bowl</option>
              </select>
            </div>
            {!matchId && localStorage.getItem("liveMatchId") && (
            <button className="secondary-btn" onClick={resumeMatch}>
              Resume Live Match
            </button>
          )}

            <button className="primary-btn" onClick={startMatch}>
              Start Match
            </button>
          </div>
          
          <PastMatches 
            pastMatches={pastMatches} 
            viewMatchSummary={(match) => viewMatchSummary(match.matchId)}
            deletePastMatch={deletePastMatch}
          />


          <SummaryModal
            isVisible={showSummaryModal}
            setIsVisible={setShowSummaryModal}
            matchSummary={matchSummary}
            selectedMatchName={selectedMatchName}
          />

        </div>
      ) : (
        <div className="live-match-container">
          <div className="match-header">
            <h1>{matchDetails.matchName}</h1>
            <div className="match-info-pills">
              <span className="pill">{innings === 1 ? "1st" : "2nd"} Innings</span>
              <span className="pill">{battingTeam} batting</span>
              {matchDetails.tossWinner && matchDetails.tossDecision && (
                  <p>
                    🏏 {matchDetails.tossWinner} won the toss and chose to{" "}
                    {matchDetails.tossDecision === "bat" ? "bat first" : "bowl first"}.
                  </p>
                )}
            </div>
          </div>

          <div className="scoreboard">
            <div className="score-display">
            {matchDetails.score?.wickets === (innings === 1 ? playersTeamA.length : playersTeamB.length) - 1 && (
                <div className="last-man-warning">
                  🏏 Last Man Standing!
                </div>
              )}
              <div className="main-score">
                <span className="runs">{score.runs}</span>
                <span className="wickets">/{score.wickets}</span>
                {showChangeBowler && (
                  <div className="select-new-bowler">
                    <h3>Please Select a New Bowler for the Next Over</h3>
                  </div>
                )}
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
                {getBatterName(0)}
              </div>
            </div>
            <div className={`batter-card ${onStrike === 1 ? 'on-strike' : ''}`}>
              <div className="batter-name">
                {getBatterName(1)}
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
          {!matchStarted && (
            <MatchSummary matchSummary={matchSummary} />
          )}
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
              <button 
                className="primary-btn" 
                onClick={processBall}
                disabled={showChangeBowler}
              >
                Record Ball
              </button>
            </div>
          </div>
            <div className="player-selection-area">
              {/* 🏏 Select Openers */}
              {!openersSelected && (
                <div className="selection-card">
                  <h3>Select Openers</h3>
                  <div className="player-grid">
                  {
                    (battingTeam === matchDetails.teamA ? playersTeamA : playersTeamB).map((player) => {
                      const teamList = battingTeam === matchDetails.teamA ? playersTeamA : playersTeamB;
                      const playerIndex = teamList.indexOf(player);
                      const isBatting = currentBatters.includes(playerIndex);
                      const playerStats = batterStats.find((b) => b.name === player) || {};
                      const isOut = playerStats?.isOut;
                      const isDisabled = isBatting || isOut;

                      return (
                        <button
                          key={player}
                          className={`player-btn ${isDisabled ? 'disabled' : ''}`}
                          onClick={() => {
                            if (!isDisabled) {
                              handleSelectBatter(player);
                            }
                          }}
                          disabled={isDisabled}
                        >
                          {player}
                        </button>
                      );
                    })
                  }
                  </div>
                </div>
              )}
            {/* 🏏 Select Bowler */}
              {(currentBowler === null || showChangeBowler) && (
                <div className="selection-card">
                  <h3>Select Bowler</h3>
                  <div className="player-grid">
                    {
                      // ✅ Corrected Logic: Use the correct team for the second innings
                      (innings === 1
                        ? (battingTeam === matchDetails.teamA ? playersTeamB : playersTeamA)
                        : (battingTeam === matchDetails.teamA ? playersTeamB : playersTeamA)
                      ).map((player, index) => {
                        // ✅ Prevent selecting the same bowler for consecutive overs
                        const isSameBowlerAsPrevious = index === lastBowlerIndex;
                        const playerStats = bowlerStats.find((b) => b.name === player) || {};
                        const isBowling = currentBowler === index;

                        // ✅ Disable if it's the same as the last one or if it's already the current bowler
                        const isDisabled = isSameBowlerAsPrevious || isBowling;

                        return (
                          <button
                            key={player}
                            className={`player-btn ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => {
                              if (!isDisabled) {
                                // ✅ Select the bowler and update state
                                setCurrentBowler(index);
                                setLastBowlerIndex(index);
                                setShowChangeBowler(false); // <-- Reset flag after choosing

                                // ✅ Save to localStorage
                                saveMatchStateToLocalStorage();
                              }
                            }}
                            disabled={isDisabled}
                          >
                            {player}
                          </button>
                        );
                      })
                    }
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
          {showBoundaryAnimation && (
            <div className="boundary-animation">
              {boundaryType === 4 ? (
                <div className="boundary-four">FOUR!</div>
              ) : (
                <div className="boundary-six">SIX!</div>
              )}
            </div>
          )}

          {showWicketAnimation && (
            <div className="wicket-animation wicket-fall">
              WICKET!
            </div>
          )}
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