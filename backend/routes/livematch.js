const express = require("express");
const mongoose = require("mongoose");
const LiveMatchStat = require("../models/LiveMatchStatSchema");
// Firebase sync removed - frontend connects directly to Firebase Realtime Database

const router = express.Router();

const LiveMatchSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: mongoose.Types.ObjectId,
  },
  matchName: String,
  oversLimit: Number,
  currentInnings: { type: Number, default: 1 },
  currentOver: { type: Number, default: 0 },
  currentBall: { type: Number, default: 0 },
  teamA: String,
  teamB: String,
  teamAPlayers: [String],
  teamBPlayers: [String],
  tossWinner: String,
  tossDecision: String,
  currentBatters: {
    type: Array,
    default: [null, null],
  },
  currentBowler: {
    type: Object,
    default: null,
  },
  score: {
    team: { type: String, default: "" },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: String, default: "0.0" },
    balls: {
      type: [
        {
          runs: Number,
          ballType: String,
          batter: String,
          bowler: String,
          isOut: Boolean,
          outType: String,
          isExtra: Boolean,
          extraType: String,
          extraRuns: Number,
        },
      ],
      default: [],
    },
  },
  batterStats: { type: Array, default: [] },
  bowlerStats: { type: Array, default: [] },
  isFinished: { type: Boolean, default: false },
  target: { type: Number, default: 0 },
  innings1: {
    type: Object,
    default: () => ({
      team: "",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      balls: [],
      batterStats: [],
      bowlerStats: [],
    }),
  },
  innings2: {
    type: Object,
    default: () => ({
      team: "",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      balls: [],
      batterStats: [],
      bowlerStats: [],
    }),
  },
  result: { type: String, default: "" },
});

const LiveMatch = mongoose.model("LiveMatch", LiveMatchSchema);

// ✅ Updated match creation endpoint
router.post("/live-match", async (req, res) => {
  try {
    const {
      matchName,
      oversLimit,
      teamA,
      teamB,
      playersTeamA,
      playersTeamB,
      tossWinner,
      tossDecision,
    } = req.body;

    // ✅ Input Validation
    if (
      !matchName ||
      !oversLimit ||
      !teamA ||
      !teamB ||
      !playersTeamA.length ||
      !playersTeamB.length ||
      !tossWinner ||
      !tossDecision
    ) {
      return res.status(400).json({ message: "❌ All match details are required including toss info" });
    }

    // ✅ Validate Teams and Toss Selection
    if (![teamA, teamB].includes(tossWinner)) {
      return res.status(400).json({ message: "❌ Toss winner must be either Team A or Team B" });
    }

    if (!["bat", "bowl"].includes(tossDecision)) {
      return res.status(400).json({ message: "❌ Toss decision must be 'bat' or 'bowl'" });
    }

    // ✅ Determine Batting and Bowling Teams
    const battingFirst =
      (tossWinner === teamA && tossDecision === "bat") ||
      (tossWinner === teamB && tossDecision === "bowl")
        ? teamA
        : teamB;

    const bowlingFirst = battingFirst === teamA ? teamB : teamA;
    const battingPlayers = battingFirst === teamA ? playersTeamA : playersTeamB;
    const bowlingPlayers = battingFirst === teamA ? playersTeamB : playersTeamA;

    // ✅ Map Players with Index
    const battingMapped = battingPlayers.map((name, index) => ({ name, index }));
    const bowlingMapped = bowlingPlayers.map((name, index) => ({ name, index }));

    // ✅ Initialize Batter Stats
    const batterStats = battingMapped.map(({ name }) => ({
      name,
      runs: 0,
      ballsFaced: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      outType: "",
      outBowler: "",
    }));

    // ✅ Initialize Bowler Stats
    const bowlerStats = bowlingMapped.map(({ name }) => ({
      name,
      balls: 0,
      runs: 0,
      wickets: 0,
      maidens: 0,
      economy: 0,
    }));

    // ✅ Initialize Score Object
    const scoreObject = {
      team: battingFirst,
      runs: 0,
      wickets: 0,
      overs: "0.0",
      balls: [],
    };

    // ✅ Initialize Innings Structure
    const innings1Structure = {
      team: battingFirst,
      runs: 0,
      wickets: 0,
      overs: "0.0",
      balls: [],
      batterStats: [],
      bowlerStats: [],
    };

    const innings2Structure = {
      team: bowlingFirst,
      runs: 0,
      wickets: 0,
      overs: "0.0",
      balls: [],
      batterStats: [],
      bowlerStats: [],
    };

    const newMatch = new LiveMatch({
      matchName,
      oversLimit,
      teamA,
      teamB,
      teamAPlayers: playersTeamA,
      teamBPlayers: playersTeamB,
      tossWinner,
      tossDecision,
      score: scoreObject,
      batters: battingMapped,
      bowlers: bowlingMapped,
      currentInnings: 1,
      currentOver: 0,
      currentBall: 0,
      target: 0,
      innings1: innings1Structure,
      innings2: innings2Structure,
      result: "",
      matchId: new mongoose.Types.ObjectId() // <-- Add this line
    });
    

    // ✅ Save to Database
    await newMatch.save();
    
    // Note: Frontend connects directly to Firebase Realtime Database for live updates
    
    console.log("✅ New match created successfully.");
    return res.status(201).json({ message: "✅ Match created", match: newMatch });

  } catch (err) {
    console.error("❌ Server error during match creation:", err.message);
    return res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});



// ✅ Get all matches
router.get("/live-matches", async (req, res) => {
  try {
    const matches = await LiveMatch.find().sort({ _id: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/live-match/:id", async (req, res) => {
  try {
    const matchId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      console.error("❌ Invalid Match ID");
      return res.status(400).json({ message: "❌ Invalid Match ID" });
    }

    // ✅ Find the match by `_id`
    const match = await LiveMatch.findById(matchId);

    if (!match) {
      console.warn("❌ Match not found");
      return res.status(404).json({ message: "❌ Match not found" });
    }

    console.log("✅ Match data fetched successfully");
    res.json(match);

  } catch (err) {
    console.error("❌ Error fetching match data:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Add ball to match
router.post("/live-match/:id/ball", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      runs,
      ballType,
      isOut,
      outType,
      isExtra,
      extraType,
      extraRuns,
      batter,
      bowler
    } = req.body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Invalid Match ID" });
    }

    // ✅ Find the match
    const match = await LiveMatch.findById(id);
    if (!match) return res.status(404).json({ message: "❌ Match not found" });
    if (match.isFinished) return res.status(400).json({ message: "❌ Match already finished" });

    // ✅ Calculate total runs for the ball
    const totalRuns = parseInt(runs || 0) + (isExtra ? parseInt(extraRuns || 0) : 0);

    // ✅ Check if the ball is a legal delivery
    const isLegal = !(isExtra && (extraType === "wide" || extraType === "noBall"));

    // ✅ Build the ball object
    const ball = {
      runs: parseInt(runs || 0),
      ballType,
      isOut,
      outType: isOut ? outType : "",
      batter,
      bowler,
      isExtra,
      extraType: isExtra ? extraType : "",
      extraRuns: isExtra ? parseInt(extraRuns || 0) : 0,
    };

    // ✅ Update match score
    match.score.runs += totalRuns;
    if (isOut) match.score.wickets += 1;

    // ✅ Update the ball and over count if legal or valid extra
    if (isLegal) {
      match.currentBall += 1;
      if (match.currentBall >= 6) {
        match.currentBall = 0;
        match.currentOver += 1;
      }
    }

    // ✅ Update overs display
    match.score.overs = `${match.currentOver}.${match.currentBall}`;
    match.score.balls.push(ball);

    // ✅ Update the innings object
    if (match.currentInnings === 1) {
      match.innings1.balls = [...match.score.balls];
      match.innings1.overs = match.score.overs;
    } else {
      match.innings2.balls = [...match.score.balls];
      match.innings2.overs = match.score.overs;
    }

    // ✅ Get the maximum wickets allowed based on team size
    const teamSize = match.currentInnings === 1
      ? (match.teamAPlayers.length || 11)
      : (match.teamBPlayers.length || 11);

    // ✅ Update Batter Stats
    const batterStatsMap = {};
    match.score.balls.forEach((b) => {
      if (!batterStatsMap[b.batter]) {
        batterStatsMap[b.batter] = {
          name: b.batter,
          runs: 0,
          ballsFaced: 0,
          fours: 0,
          sixes: 0,
          isOut: false,
          outType: "",
          outBowler: ""
        };
      }
      if (!(b.isExtra && b.extraType === "wide")) {
        batterStatsMap[b.batter].ballsFaced += 1;
      }
      batterStatsMap[b.batter].runs += b.runs;
      if (b.runs === 4) batterStatsMap[b.batter].fours += 1;
      if (b.runs === 6) batterStatsMap[b.batter].sixes += 1;

      if (b.isOut) {
        batterStatsMap[b.batter].isOut = true;
        batterStatsMap[b.batter].outType = b.outType;
        batterStatsMap[b.batter].outBowler = b.bowler;
      }
    });

    // ✅ Update Bowler Stats
    const bowlerStatsMap = {};
    match.score.balls.forEach((b) => {
      if (!bowlerStatsMap[b.bowler]) {
        bowlerStatsMap[b.bowler] = {
          name: b.bowler,
          balls: 0,
          runs: 0,
          wickets: 0
        };
      }
      if (!b.isExtra || (b.isExtra && b.extraType !== "wide" && b.extraType !== "noBall")) {
        bowlerStatsMap[b.bowler].balls += 1;
      }
      bowlerStatsMap[b.bowler].runs += b.runs + (b.isExtra ? b.extraRuns : 0);

      if (b.isOut && b.outType !== "runOut") {
        bowlerStatsMap[b.bowler].wickets += 1;
      }
    });

    // ✅ Save updated stats
    match.batterStats = Object.values(batterStatsMap);
    match.bowlerStats = Object.values(bowlerStatsMap);

    // ✅ Check if the innings is complete
    const inningsDone = match.currentInnings === 1 &&
      (match.score.wickets >= teamSize || match.currentOver >= match.oversLimit);

    const matchDone = match.currentInnings === 2 &&
      (match.score.runs >= match.target || match.score.wickets >= teamSize || match.currentOver >= match.oversLimit);

    if (inningsDone) {
      match.innings1 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats,
        balls: match.score.balls
      };

      match.target = match.score.runs + 1;
      match.currentInnings = 2;
      match.currentOver = 0;
      match.currentBall = 0;
      match.score.team = match.teamB;
      match.score.runs = 0;
      match.score.wickets = 0;
      match.score.overs = "0.0";
      match.score.balls = [];
      match.batterStats = [];
      match.bowlerStats = [];
    }

    if (matchDone) {
      match.isFinished = true;
      await createMatchSummary(match);
    }

    // ✅ Save match state to DB
    await match.save();

    // Note: Frontend connects directly to Firebase Realtime Database for live updates

    // ✅ Respond to frontend
    res.json({
      message: "✅ Ball added",
      match: {
        ...match.toObject(),
        batterStats: Object.values(batterStatsMap),
        bowlerStats: Object.values(bowlerStatsMap)
      }
    });

  } catch (err) {
    console.error("❌ Error in ball update:", err.message);
    res.status(500).json({ message: "❌ Error updating ball", error: err.message });
  }
});


// ✅ Update Innings
router.put("/live-match/:id/update-innings", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      innings,
      battingTeam,
      runs,
      wickets,
      extras,
      overs,
      batters,
      bowlers,
      ballByBall
    } = req.body;

    // ✅ Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Invalid Match ID" });
    }

    // ✅ Find the match
    const match = await LiveMatch.findById(id);
    if (!match) {
      return res.status(404).json({ message: "❌ Match not found" });
    }

    // ✅ Update the specific innings
    if (innings === "innings1") {
      match.innings1 = {
        team: battingTeam,
        runs,
        wickets,
        overs,
        balls: ballByBall,
        batterStats: batters,
        bowlerStats: bowlers,
      };
      match.target = runs + 1; // Set the target for the second innings
    } else {
      match.innings2 = {
        team: battingTeam,
        runs,
        wickets,
        overs,
        balls: ballByBall,
        batterStats: batters,
        bowlerStats: bowlers,
      };
      match.isFinished = true;
    }

    await match.save();
    console.log("✅ Innings updated successfully");
    res.json({ message: "✅ Innings updated successfully", match });

  } catch (error) {
    console.error("❌ Error updating innings:", error.message);
    res.status(500).json({ message: "❌ Error updating innings", error: error.message });
  }
});

// ✅ Update Match Result
router.put("/live-match/:id/update-result", async (req, res) => {
  try {
    const { id } = req.params;
    const { result, innings1, innings2 } = req.body;

    const match = await LiveMatch.findById(id);
    if (!match) return res.status(404).json({ message: "❌ Match not found" });

    // ✅ Store the final result and both innings details
    match.result = result;
    match.innings1 = innings1;
    match.innings2 = innings2;
    match.isFinished = true;

    await createMatchSummary(match); // Create a summary for past matches
    await match.save();

    res.json({ message: "✅ Match result updated successfully", match });

  } catch (err) {
    console.error("Error updating match result:", err);
    res.status(500).json({ message: "❌ Error updating match result", error: err.message });
  }
});

// ✅ Handle End Innings manually
router.post("/live-match/:id/end-innings", async (req, res) => {
  try {
    const match = await LiveMatch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "❌ Match not found" });
    if (match.isFinished) return res.status(400).json({ message: "❌ Match already finished" });
    
    if (match.currentInnings === 1) {
      // Store first innings data
      match.innings1 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };
      
      // Set target and reset for second innings
      match.target = match.score.runs + 1;
      match.currentInnings = 2;
      match.score.team = match.teamB;
      match.currentOver = 0;
      match.currentBall = 0;
      match.score.runs = 0;
      match.score.wickets = 0;
      match.score.overs = "0.0";
      match.score.balls = [];
      match.batterStats = [];
      match.bowlerStats = [];
      
      await match.save();
      
      res.json({ 
        message: "✅ First innings ended",
        match
      });
    } else {
      // End match if it's already second innings
      match.isFinished = true;
      
      // Store second innings data
      match.innings2 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };
      
      // Determine result
      const maxWickets = (match.batters.length || 11) - 1;
      if (match.score.runs > match.target - 1) {
        match.result = `${match.teamB} won by ${maxWickets - match.score.wickets} wickets`;
      } else if (match.score.runs < match.target - 1) {
        match.result = `${match.teamA} won by ${match.target - match.score.runs - 1} runs`;
      } else {
        match.result = "Match tied";
      }
      
      await createMatchSummary(match);
      await match.save();
      
      res.json({ 
        message: "✅ Match ended",
        match
      });
    }
  } catch (err) {
    console.error("Error ending innings:", err);
    res.status(500).json({ message: "❌ Error ending innings", error: err.message });
  }
});

// ✅ Force end match
router.put("/live-match/:id/end", async (req, res) => {
  try {
    const match = await LiveMatch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    // Store innings data if not already stored
    if (match.currentInnings === 1 && !match.innings1) {
      match.innings1 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };
    } else if (match.currentInnings === 2 && !match.innings2) {
      match.innings2 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };
    }

    match.isFinished = true;
    
    // Set result if second innings
    if (match.currentInnings === 2) {
      const maxWickets = (match.batters.length || 11) - 1;
      if (match.score.runs > match.target - 1) {
        match.result = `${match.teamB} won by ${maxWickets - match.score.wickets} wickets`;
      } else if (match.score.runs < match.target - 1) {
        match.result = `${match.teamA} won by ${match.target - match.score.runs - 1} runs`;
      } else {
        match.result = "Match tied";
      }
    } else {
      match.result = "Match ended manually";
    }
    
    await createMatchSummary(match);
    await match.save();

    res.json({ message: "✅ Match ended manually", match });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to end match", error: err.message });
  }
});

// ✅ Get past matches
router.get("/live-match-stats", async (req, res) => {
  try {
    const matches = await LiveMatchStat.find().sort({ _id: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "❌ Error", error: err.message });
  }
});

// ✅ Delete match summary
router.delete("/live-match-stats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LiveMatchStat.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "❌ Match stat not found" });

    res.json({ message: "✅ Match stat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

async function createMatchSummary(match) {
  try {
    // ✅ Use innings data if available
    let firstInningsBalls = match.innings1?.balls || [];
    let secondInningsBalls = match.innings2?.balls || [];

    // ✅ Fallback to current balls if innings data not available
    if (match.currentInnings === 1 && firstInningsBalls.length === 0) {
      firstInningsBalls = match.score.balls || [];
    } else if (match.currentInnings === 2 && secondInningsBalls.length === 0) {
      secondInningsBalls = match.score.balls || [];
    }

    // ✅ Combine all balls for processing
    const allBalls = [...firstInningsBalls, ...secondInningsBalls];

    const batters = [];
    const bowlers = [];

    // ✅ Populate batters and bowlers stats
    allBalls.forEach((ball) => {
      // 🏏 Handle Batter Stats
      if (ball.batter) {
        let batter = batters.find(b => b.name === ball.batter);
        if (!batter) {
          batter = { 
            name: ball.batter, 
            runs: 0, 
            balls: 0, 
            fours: 0, 
            sixes: 0, 
            outs: 0 
          };
          batters.push(batter);
        }
        batter.runs += ball.runs;

        if (!ball.isExtra || (ball.isExtra && ball.extraType !== "wide")) {
          batter.balls += 1;
        }

        if (ball.runs === 4) batter.fours += 1;
        if (ball.runs === 6) batter.sixes += 1;

        if (ball.isOut) batter.outs += 1;
      }

      // 🎯 Handle Bowler Stats
      if (ball.bowler) {
        let bowler = bowlers.find(b => b.name === ball.bowler);
        if (!bowler) {
          bowler = { 
            name: ball.bowler, 
            runsGiven: 0, 
            wickets: 0, 
            balls: 0, 
            maidens: 0 
          };
          bowlers.push(bowler);
        }

        bowler.runsGiven += ball.runs + (ball.isExtra ? ball.extraRuns : 0);

        if (!ball.isExtra || (ball.isExtra && ball.extraType !== "wide" && ball.extraType !== "noBall")) {
          bowler.balls += 1;
        }

        if (ball.isOut && ball.outType !== "runOut") {
          bowler.wickets += 1;
        }
      }
    });

    // ✅ Calculate Maiden Overs for Bowlers
    bowlers.forEach((bowler) => {
      const oversBowled = Math.floor(bowler.balls / 6);
      const runsConceded = bowler.runsGiven;

      if (runsConceded === 0 && oversBowled > 0) {
        bowler.maidens += 1;
      }
    });

    // 🏏 Compute the result if not already set
    let result = match.result || "Match ended";
    if (!match.result && match.isFinished) {
      const target = match.target;
      if (match.score.runs >= target) {
        result = `${match.score.team} won by ${
          match.currentInnings === 1
            ? match.teamBPlayers.length - match.score.wickets
            : match.teamAPlayers.length - match.score.wickets
        } wickets`;
      } else {
        result = `${
          match.currentInnings === 1 ? match.teamB : match.teamA
        } won by ${target - match.score.runs} runs`;
      }
    }

    // ✅ Create and save the match summary
    const summary = new LiveMatchStat({
      matchId: match._id,
      matchName: match.matchName,
      date: new Date().toISOString().split("T")[0],
      teamA: match.teamA,
      teamB: match.teamB,
      result,
      batters,
      bowlers,
      innings1: match.innings1 || null,
      innings2: match.innings2 || null,
    });

    await summary.save();
    console.log("✅ Match Summary Created Successfully");
    return summary;
  } catch (error) {
    console.error("❌ Error creating match summary:", error);
    throw error;
  }
}
router.put("/live-match/:id/update-current-players", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentBatters, currentBowler } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Invalid match ID" });
    }

    const match = await LiveMatch.findById(id);
    if (!match) {
      return res.status(404).json({ message: "❌ Match not found" });
    }

    match.currentBatters = currentBatters;
    match.currentBowler = currentBowler;

    await match.save();
    console.log("✅ Current players updated successfully.");
    res.json({ message: "✅ Current players updated", match });
  } catch (error) {
    console.error("❌ Error updating current players:", error.message);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
});

const updateInnings = async (req, res) => {
  const { matchId } = req.body;

  if (!matchId || matchId === "null") {
    console.error("❌ Invalid Match ID for updateInnings");
    return res.status(400).json({ message: "Invalid Match ID" });
  }

  try {
    const match = await LiveMatch.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    
    // Proceed with update
  } catch (error) {
    console.error("Error updating innings:", error.message);
    res.status(500).json({ message: "Error updating innings" });
  }
};

module.exports = router;