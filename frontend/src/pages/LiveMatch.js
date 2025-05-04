import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyardcricket.onrender.com";


const LiveMatch = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [players, setPlayers] = useState([
    "Sathush", "Dulshan", "Yamila", "Madhawa", "Dihindu", "Savindu",
    "Achala", "Shanaka", "Ravindu", "Chanuka", "Farhan", "Nidula",
    "Player 1", "Player 2", "Player 3", "Player 4"
  ]);
  
  const [battingPair, setBattingPair] = useState(["", ""]);
  const [onStrike, setOnStrike] = useState(0); // 0 for batter1, 1 for batter2
  const [currentBowler, setCurrentBowler] = useState("");
  const [matchId, setMatchId] = useState(null);
  const [score, setScore] = useState(null);
  const [ballDetails, setBallDetails] = useState({
    runs: 0,
    ballType: "normal",
    isOut: false,
    outType: "",
  });
  const [toss, setToss] = useState({
    winner: "",
    decision: "", // "bat" or "bowl"
  });
  const [ballsRemaining, setBallsRemaining] = useState(null);
  
  const [matchDetails, setMatchDetails] = useState({
    matchName: "",
    oversLimit: "",
    teamA: "",
    teamB: "",
  });
  const [summary, setSummary] = useState({ batters: {}, bowlers: {} });
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [currentInnings, setCurrentInnings] = useState(1);
  const [target, setTarget] = useState(null);
  const [finishedMatches, setFinishedMatches] = useState([]);

  useEffect(() => {
    fetchFinishedMatches();
    resumeOngoingMatch();
  }, []);

  const resumeOngoingMatch = async () => {
    try {
      const res = await axios.get(`${API_URL}/current-match`);
      const match = res.data.match;
  
      if (match) {
        setMatchId(match._id);
        setScore(match.score);
        setMatchDetails({
          matchName: match.matchName,
          oversLimit: match.oversLimit,
          teamA: match.teamA,
          teamB: match.teamB
        });
        setBattingTeam(match.teamA); // or however you're storing order
        setBowlingTeam(match.teamB);
        setCurrentInnings(match.currentInnings);
      }
    } catch (err) {
      console.error("Failed to resume match:", err);
    }
  };

  const fetchFinishedMatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/finished-matches`);
      
      if (Array.isArray(res.data)) {
        setFinishedMatches(res.data);
      } else {
        console.warn("Expected array but got:", res.data);
        setFinishedMatches([]);
      }
  
    } catch (err) {
      console.error("Error fetching finished matches:", err);
      setFinishedMatches([]);
    }
  };
  

  const startMatch = async () => {
    try {
      const res = await axios.post(`${API_URL}/start-match`, {
        ...matchDetails,
        tossWinner: toss.winner,
        tossDecision: toss.decision,
      });
      setMatchId(res.data.match._id);
      setScore(res.data.match.score);
  
      const batting = toss.decision === "bat"
        ? toss.winner
        : toss.winner === matchDetails.teamA ? matchDetails.teamB : matchDetails.teamA;
  
      const bowling = batting === matchDetails.teamA ? matchDetails.teamB : matchDetails.teamA;
  
      setBattingTeam(batting);
      setBowlingTeam(bowling);
    } catch (err) {
      console.error("Error starting match:", err);
    }
  };
  

  const fetchSummary = async () => {
    if (!matchId) return;
    const res = await axios.get(`${API_URL}/match-summary/${matchId}`);
    setSummary({
      batters: res.data.battersStats,
      bowlers: res.data.bowlersStats,
    });
  };

  const updateScore = async () => {
    try {
      const batter = battingPair[onStrike];
  
      const res = await axios.put(`${API_URL}/update-score/${matchId}`, {
        ...ballDetails,
        batter: ballDetails.ballType === "normal" ? batter : null,
        bowler: currentBowler,
      });
  
      const updatedMatch = res.data.match;
      const [over, ball] = updatedMatch.score.overs.split(".").map(Number);
      const totalBalls = matchDetails.oversLimit * 6;
      const currentBallCount = over * 6 + ball;
  
      setScore(updatedMatch.score);
      fetchSummary();
  
      if (ballDetails.ballType === "normal") {
        if (ballDetails.isOut) {
          setBattingPair((prev) => {
            const newPair = [...prev];
            newPair[onStrike] = ""; // empty spot for dropdown
            return newPair;
          });
        } else {
          if ([1, 3].includes(ballDetails.runs)) {
            setOnStrike(1 - onStrike);
          }
          if (ball === 0) {
            alert("Over completed. Choose a new bowler.");
            setCurrentBowler("");
            setOnStrike(1 - onStrike);
          }
        }
  
        if (currentInnings === 2) {
          setBallsRemaining((prev) => prev - 1);
        }
  
        if (currentBallCount + 1 >= totalBalls) {
          if (currentInnings === 1) {
            setCurrentInnings(2);
            setTarget(updatedMatch.score.runs + 1);
            setBattingTeam(bowlingTeam);
            setBowlingTeam(battingTeam);
            setBallsRemaining(totalBalls);
            alert("Innings over. Start second innings.");
          } else {
            finishMatch();
            alert("🎉 Match finished!");
          }
        }
      }
  
      // reset for next ball
      setBallDetails({ runs: 0, ballType: "normal", isOut: false, outType: "" });
  
    } catch (err) {
      console.error("Error updating score:", err);
      alert("Failed to update score.");
    }
  };
  

  const finishMatch = async () => {
    try {
      const res = await axios.post(`${API_URL}/finish-match/${matchId}`);
      setFinishedMatches([...finishedMatches, res.data.match]);
      setMatchId(null);
      setScore(null);
      setTarget(null);
      setCurrentInnings(1);
      setBattingTeam("");
      setBowlingTeam("");
    } catch (err) {
      console.error("Error finishing match:", err);
    }
  };
  const deleteMatch = async (id) => {
    try {
      await axios.delete(`${API_URL}/matches/${id}`);
      setFinishedMatches((prev) => prev.filter((m) => m._id !== id));
      alert("Match deleted successfully.");
    } catch (err) {
      console.error("Error deleting match:", err);
      alert("Failed to delete match.");
    }
  };
  

  const runsOptions = [0, 1, 2, 3, 4, 6];

  // Custom styles
  const styles = {
    mainContainer: {
      padding: isMobile ? '16px 8px' : '32px 24px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(to bottom, #f9f9f9, #f0f0f0)',
      minHeight: '100vh',
    },
    pageTitle: {
      textAlign: 'center',
      fontWeight: 700,
      color: '#1a237e',
      margin: '0 0 24px 0',
      fontSize: isMobile ? '24px' : '36px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    },
    formContainer: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: isMobile ? '16px' : '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    formField: {
      marginBottom: '16px',
    },
    formTitle: {
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: 600,
      marginBottom: '24px',
      color: '#1a237e',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    startButton: {
      background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
      color: 'white', 
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 600,
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(40, 53, 147, 0.3)',
      margin: '16px 0',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'linear-gradient(45deg, #283593 30%, #1a237e 90%)',
        boxShadow: '0 6px 10px rgba(40, 53, 147, 0.4)',
      }
    },
    scoreCard: {
      padding: '24px',
      background: '#1a237e',
      color: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
      marginBottom: '24px',
    },
    scoreTeams: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: 600,
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
    },
    scoreValue: {
      fontSize: isMobile ? '26px' : '36px',
      fontWeight: 700,
      textAlign: 'center',
      marginBottom: '8px',
    },
    scoreOvers: {
      fontSize: isMobile ? '14px' : '16px',
      textAlign: 'center',
      opacity: 0.9,
    },
    sectionTitle: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 600,
      margin: '24px 0 16px 0',
      color: '#1a237e',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    playerField: {
      margin: '8px 0',
    },
    playersContainer: {
      marginBottom: '24px',
    },
    batterContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    onStrikeIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: '16px',
      background: '#ffc107',
      color: '#333',
      fontSize: '14px',
      fontWeight: 600,
      marginLeft: '8px',
    },
    ballControlsCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
    },
    runsContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px',
    },
    runButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: 'none',
      transition: 'all 0.2s ease',
    },
    runButton0: {
      background: '#f5f5f5',
      color: '#333',
    },
    runButton1: {
      background: '#e3f2fd',
      color: '#0d47a1',
    },
    runButton2: {
      background: '#e8f5e9',
      color: '#2e7d32',
    },
    runButton3: {
      background: '#fff8e1',
      color: '#ff6f00',
    },
    runButton4: {
      background: '#e8eaf6',
      color: '#3f51b5',
    },
    runButton6: {
      background: '#fce4ec',
      color: '#c2185b',
    },
    updateButton: {
      background: 'linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)',
      color: 'white',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 600,
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(46, 125, 50, 0.3)',
      width: '100%',
      margin: '16px 0',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'linear-gradient(45deg, #388e3c 30%, #2e7d32 90%)',
        boxShadow: '0 6px 10px rgba(46, 125, 50, 0.4)',
      }
    },
    outButton: {
      background: ballDetails.isOut 
        ? 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)'
        : 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
      color: 'white',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: 600,
      borderRadius: '8px',
      boxShadow: ballDetails.isOut 
        ? '0 4px 6px rgba(211, 47, 47, 0.3)'
        : '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      width: '100%',
    },
    statsCard: {
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      marginBottom: '16px',
    },
    statHeader: {
      fontSize: '16px',
      fontWeight: 600,
      marginBottom: '12px',
      color: '#1a237e',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    statLine: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px',
    },
    statName: {
      fontWeight: 500,
    },
    statValue: {
      fontWeight: 600,
      color: '#1a237e',
    },
    strikeRotateButton: {
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      background: '#f5f5f5',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      cursor: 'pointer',
      color: '#555',
    },
    ballTypeChip: {
      margin: '0 4px 4px 0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    ballTypesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: '16px',
    },
    outTypeChip: {
      margin: '0 4px 4px 0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    outTypesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '16px',
    },
    selectedChip: {
      background: '#1a237e',
      color: 'white',
    },
    teamVsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    teamName: {
      fontWeight: 600,
      fontSize: '18px',
      color: '#1a237e',
    },
    vsText: {
      fontSize: '14px',
      color: '#757575',
    },
    infoIcon: {
      fontSize: '20px',
      marginRight: '8px',
      color: '#1a237e',
    },
  };

  return (
    <Container style={styles.mainContainer}>
      <Typography variant="h4" style={styles.pageTitle}>
        <SportsCricketIcon fontSize="large" style={{ marginRight: '8px' }} />
        Cricket Scorecard
      </Typography>

      {!matchId ? (
        <>
          <Paper style={styles.formContainer}>
            <Typography style={styles.formTitle}>
              <EmojiEventsIcon style={styles.infoIcon} />
              Start New Match
            </Typography>
            <Grid container spacing={isMobile ? 2 : 3}>
              <Grid item xs={12} sm={6} style={styles.formField}>
                <TextField
                  fullWidth
                  label="Match Name"
                  variant="outlined"
                  value={matchDetails.matchName}
                  onChange={(e) =>
                    setMatchDetails({ ...matchDetails, matchName: e.target.value })
                  }
                  InputProps={{
                    style: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={styles.formField}>
                <TextField
                  fullWidth
                  label="Overs Limit"
                  variant="outlined"
                  value={matchDetails.oversLimit}
                  onChange={(e) =>
                    setMatchDetails({ ...matchDetails, oversLimit: e.target.value })
                  }
                  InputProps={{
                    style: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={styles.formField}>
                <TextField
                  fullWidth
                  label="Team A"
                  variant="outlined"
                  value={matchDetails.teamA}
                  onChange={(e) =>
                    setMatchDetails({ ...matchDetails, teamA: e.target.value })
                  }
                  InputProps={{
                    style: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={styles.formField}>
                <TextField
                  fullWidth
                  label="Team B"
                  variant="outlined"
                  value={matchDetails.teamB}
                  onChange={(e) =>
                    setMatchDetails({ ...matchDetails, teamB: e.target.value })
                  }
                  InputProps={{
                    style: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    select
                    fullWidth
                    label="Toss Winner"
                    value={toss.winner}
                    onChange={(e) => setToss({ ...toss, winner: e.target.value })}
                >
                    {[matchDetails.teamA, matchDetails.teamB].map((team) => (
                    <MenuItem value={team} key={team}>{team}</MenuItem>
                    ))}
                </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    select
                    fullWidth
                    label="Decision"
                    value={toss.decision}
                    onChange={(e) => setToss({ ...toss, decision: e.target.value })}
                >
                    <MenuItem value="bat">Bat</MenuItem>
                    <MenuItem value="bowl">Bowl</MenuItem>
                </TextField>
                </Grid>

              <Grid item xs={12} style={{ textAlign: 'center' }}>
                <Button 
                  onClick={startMatch} 
                  variant="contained" 
                  style={styles.startButton}
                  startIcon={<SportsCricketIcon />}
                >
                  Start Match
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h5" style={{ marginTop: "24px" }}>
            Finished Matches
          </Typography>
          {finishedMatches.map((match, index) => (
  <Card key={index} style={{ marginTop: '16px' }}>
    <CardContent>
      <Typography variant="h6">{match.matchName}</Typography>
      <Typography>{match.teamA} vs {match.teamB}</Typography>
      <Typography>Winner: {match.winner} | Target: {match.target}</Typography>
      <Button
        variant="outlined"
        color="error"
        style={{ marginTop: '8px' }}
        onClick={() => deleteMatch(match._id)}
      >
        Delete Match
      </Button>
    </CardContent>
  </Card>
))}

        </>
      ) : (
        <div>
          <Paper style={styles.scoreCard}>
  <div style={styles.teamVsContainer}>
    <span style={styles.teamName}>{battingTeam}</span>
    <span style={styles.vsText}>vs</span>
    <span style={styles.teamName}>{bowlingTeam}</span>
  </div>

  <Typography style={styles.scoreValue}>
    {score?.runs}/{score?.wickets}
  </Typography>

  <Typography style={styles.scoreOvers}>
    Overs: {score?.overs}
  </Typography>

  {currentInnings === 2 && target && (
    <>
      <Divider style={{ margin: '12px 0', backgroundColor: 'white' }} />
      <Typography variant="subtitle1" align="center" style={{ fontWeight: 600 }}>
        🎯 Target: {target} runs
      </Typography>
      <Typography variant="subtitle2" align="center">
        🏏 Runs Required: {Math.max(target - score?.runs, 0)}
      </Typography>
      <Typography variant="subtitle2" align="center">
        ⏱ Balls Remaining: {ballsRemaining}
      </Typography>
    </>
  )}
</Paper>


          {/* Players Selection */}
          <Paper style={styles.formContainer}>
            <Typography style={styles.sectionTitle}>
              <PersonIcon style={styles.infoIcon} />
              Players
            </Typography>
            <Grid container spacing={2} style={styles.playersContainer}>
              <Grid item xs={12} sm={6} style={styles.playerField}>
                <div style={styles.batterContainer}>
                  <TextField
                    select
                    label="Batter 1"
                    fullWidth
                    variant="outlined"
                    value={battingPair[0]}
                    onChange={(e) =>
                      setBattingPair([e.target.value, battingPair[1]])
                    }
                    InputProps={{
                      style: { borderRadius: '8px' }
                    }}
                  >
                    {players.map((p) => (
                      <MenuItem value={p} key={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                  {onStrike === 0 && (
                    <div style={styles.onStrikeIndicator}>
                      <SportsCricketIcon fontSize="small" style={{ marginRight: '4px' }} />
                      On Strike
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6} style={styles.playerField}>
                <div style={styles.batterContainer}>
                  <TextField
                    select
                    label="Batter 2"
                    fullWidth
                    variant="outlined"
                    value={battingPair[1]}
                    onChange={(e) =>
                      setBattingPair([battingPair[0], e.target.value])
                    }
                    InputProps={{
                      style: { borderRadius: '8px' }
                    }}
                  >
                    {players.map((p) => (
                      <MenuItem value={p} key={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                  {onStrike === 1 && (
                    <div style={styles.onStrikeIndicator}>
                      <SportsCricketIcon fontSize="small" style={{ marginRight: '4px' }} />
                      On Strike
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Bowler"
                  fullWidth
                  variant="outlined"
                  value={currentBowler}
                  onChange={(e) => setCurrentBowler(e.target.value)}
                  InputProps={{
                    style: { borderRadius: '8px' }
                  }}
                >
                  {players.map((p) => (
                    <MenuItem value={p} key={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  style={styles.strikeRotateButton}
                  onClick={() => setOnStrike(1 - onStrike)}
                  startIcon={<SwapHorizIcon />}
                >
                  Rotate Strike
                </Button>
              </Grid>
            </Grid>

            {/* Ball Details */}
            <Divider style={{ margin: '16px 0' }} />
            <Typography style={styles.sectionTitle}>
              <SportsSoccerIcon style={styles.infoIcon} />
              Ball Details
            </Typography>
            
            <Card style={styles.ballControlsCard}>
              <CardContent>
                <Typography variant="subtitle2" style={{ marginBottom: '8px', color: '#555' }}>
                  Runs
                </Typography>
                <div style={styles.runsContainer}>
                  {runsOptions.map((r) => (
                    <button
                      key={r}
                      style={{
                        ...styles.runButton,
                        ...(r === 0 ? styles.runButton0 : {}),
                        ...(r === 1 ? styles.runButton1 : {}),
                        ...(r === 2 ? styles.runButton2 : {}),
                        ...(r === 3 ? styles.runButton3 : {}),
                        ...(r === 4 ? styles.runButton4 : {}),
                        ...(r === 6 ? styles.runButton6 : {}),
                        ...(ballDetails.runs === r ? { transform: 'scale(1.1)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } : {})
                      }}
                      onClick={() => setBallDetails({ ...ballDetails, runs: r })}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                
                <Typography variant="subtitle2" style={{ marginBottom: '8px', color: '#555', marginTop: '16px' }}>
                  Ball Type
                </Typography>
                <div style={styles.ballTypesContainer}>
                  <Chip 
                    label="Normal" 
                    style={{
                      ...styles.ballTypeChip,
                      ...(ballDetails.ballType === 'normal' ? styles.selectedChip : {})
                    }}
                    onClick={() => setBallDetails({ ...ballDetails, ballType: 'normal' })}
                  />
                  <Chip 
                    label="Wide" 
                    style={{
                      ...styles.ballTypeChip,
                      ...(ballDetails.ballType === 'wide' ? styles.selectedChip : {})
                    }}
                    onClick={() => setBallDetails({ ...ballDetails, ballType: 'wide' })}
                  />
                  <Chip 
                    label="No Ball" 
                    style={{
                      ...styles.ballTypeChip,
                      ...(ballDetails.ballType === 'no-ball' ? styles.selectedChip : {})
                    }}
                    onClick={() => setBallDetails({ ...ballDetails, ballType: 'no-ball' })}
                  />
                </div>
                
                <Button
                  variant="contained"
                  style={styles.outButton}
                  onClick={() =>
                    setBallDetails({
                      ...ballDetails,
                      isOut: !ballDetails.isOut,
                    })
                  }
                >
                  {ballDetails.isOut ? "Cancel Out" : "Mark as Out"}
                </Button>

                {ballDetails.isOut && (
                  <div>
                    <Typography variant="subtitle2" style={{ marginBottom: '8px', color: '#555', marginTop: '16px' }}>
                      Out Type
                    </Typography>
                    <div style={styles.outTypesContainer}>
                      <Chip 
                        label="Bowled" 
                        style={{
                          ...styles.outTypeChip,
                          ...(ballDetails.outType === 'bowled' ? styles.selectedChip : {})
                        }}
                        onClick={() => setBallDetails({ ...ballDetails, outType: 'bowled' })}
                      />
                      <Chip 
                        label="Caught" 
                        style={{
                          ...styles.outTypeChip,
                          ...(ballDetails.outType === 'caught' ? styles.selectedChip : {})
                        }}
                        onClick={() => setBallDetails({ ...ballDetails, outType: 'caught' })}
                      />
                      <Chip 
                        label="Run Out" 
                        style={{
                          ...styles.outTypeChip,
                          ...(ballDetails.outType === 'run-out' ? styles.selectedChip : {})
                        }}
                        onClick={() => setBallDetails({ ...ballDetails, outType: 'run-out' })}
                      />
                      <Chip 
                        label="Stumped" 
                        style={{
                          ...styles.outTypeChip,
                          ...(ballDetails.outType === 'stumped' ? styles.selectedChip : {})
                        }}
                        onClick={() => setBallDetails({ ...ballDetails, outType: 'stumped' })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button 
              variant="contained" 
              onClick={updateScore} 
              style={styles.updateButton}
              startIcon={<AddCircleIcon />}
            >
              Update Score
            </Button>
            {ballDetails.isOut && battingPair[onStrike] === "" && (
  <TextField
    select
    fullWidth
    label="Select New Batter"
    value=""
    onChange={(e) => {
      const newPlayer = e.target.value;
      const updatedPair = [...battingPair];
      updatedPair[onStrike] = newPlayer;
      setBattingPair(updatedPair);
    }}
    InputProps={{ style: { borderRadius: '8px', marginTop: '16px' } }}
  >
    {players
      .filter((p) => !battingPair.includes(p))
      .map((p) => (
        <MenuItem key={p} value={p}>
          {p}
        </MenuItem>
      ))}
  </TextField>
)}


            {/* Stats */}
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={12} md={6}>
                <Card style={styles.statsCard}>
                  <Typography style={styles.statHeader}>
                    <PersonIcon style={{ color: '#1a237e' }} />
                    Batters Stats
                  </Typography>
                  {Object.entries(summary.batters).map(([name, stats]) => (
                    <div key={name} style={styles.statLine}>
                      <span style={styles.statName}>{name}</span>
                      <span style={styles.statValue}>
                        {stats.runs} runs ({stats.balls} balls)
                      </span>
                    </div>
                  ))}
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card style={styles.statsCard}>
                  <Typography style={styles.statHeader}>
                    <SportsSoccerIcon style={{ color: '#1a237e' }} />
                    Bowlers Stats
                  </Typography>
                  {Object.entries(summary.bowlers).map(([name, stats]) => (
                    <div key={name} style={styles.statLine}>
                      <span style={styles.statName}>{name}</span>
                      <span style={styles.statValue}>
                        {stats.wickets} wickets, {stats.runsGiven} runs
                      </span>
                    </div>
                  ))}
                </Card>
                <Button 
  variant="contained" 
  color="error" 
  onClick={finishMatch}
  style={{ marginTop: '16px', fontWeight: 'bold' }}
>
  End Match Now
</Button>

              </Grid>
            </Grid>
          </Paper>
        </div>
      )}
    </Container>
  );
};

export default LiveMatch;