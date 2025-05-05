const express = require("express");
const mongoose = require("mongoose");
const LiveMatchStat = require("../models/LiveMatchStatSchema");

const router = express.Router();

// ✅ Updated LiveMatch schema with team players
const LiveMatchSchema = new mongoose.Schema({
  matchName: String,
  oversLimit: Number,
  currentInnings: { type: Number, default: 1 },
  currentOver: { type: Number, default: 0 },
  currentBall: { type: Number, default: 0 },
  teamA: String,
  teamB: String,
  teamAPlayers: [String], // ✅ Added for team A players
  teamBPlayers: [String], // ✅ Added for team B players
  score: {
    team: { type: String, default: "" },
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: String, default: "0.0" },
    balls: {
      type: [{
        runs: Number,
        ballType: String,
        batter: String,
        bowler: String,
        isOut: Boolean,
        outType: String,
        isExtra: Boolean,
        extraType: String,
        extraRuns: Number,
      }],
      default: [],
    },
  },
  batters: [String],
  bowlers: [String],
  batterStats: { type: Array, default: [] },
  bowlerStats: { type: Array, default: [] },
  isFinished: { type: Boolean, default: false },
  target: { type: Number, default: 0 },
  innings1: { type: Object, default: null },
  innings2: { type: Object, default: null },
  result: { type: String, default: "" }
});

const LiveMatch = mongoose.model("LiveMatch", LiveMatchSchema);

// ✅ Updated match creation endpoint
router.post("/live-match", async (req, res) => {
  try {
    const { matchName, oversLimit, teamA, teamB, playersTeamA, playersTeamB } = req.body;
    if (!matchName || !oversLimit || !teamA || !teamB || !playersTeamA || !playersTeamB) {
      return res.status(400).json({ message: "❌ All match details are required" });
    }

    const newMatch = new LiveMatch({
      matchName,
      oversLimit,
      teamA,
      teamB,
      teamAPlayers: playersTeamA,
      teamBPlayers: playersTeamB,
      score: { team: teamA, runs: 0, wickets: 0, overs: "0.0", balls: [] },
      batters: playersTeamA,
      bowlers: playersTeamB,
    });

    await newMatch.save();
    res.status(201).json({ message: "✅ Match created", match: newMatch });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
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

// ✅ Get single match
router.get("/live-match/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID" });

    const match = await LiveMatch.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "❌ Match not found" });

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add ball to match
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

    const match = await LiveMatch.findById(id);
    if (!match) return res.status(404).json({ message: "❌ Match not found" });
    if (match.isFinished) return res.status(400).json({ message: "❌ Match already finished" });

    const totalRuns = parseInt(runs || 0) + (isExtra ? parseInt(extraRuns || 0) : 0);
    const isLegal = !(isExtra && (extraType === "wide" || extraType === "noBall"));

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

    match.score.runs += totalRuns;
    if (isOut) match.score.wickets += 1;

    if (isLegal) {
      match.currentBall += 1;
      if (match.currentBall === 6) {
        match.currentBall = 0;
        match.currentOver += 1;
      }
    }

    match.score.overs = `${match.currentOver}.${match.currentBall}`;
    match.score.balls.push(ball);

    // 🧮 Batter Stats
    const batterStatsMap = {};
    match.score.balls.forEach((b) => {
      const bName = b.batter;
      if (!batterStatsMap[bName]) {
        batterStatsMap[bName] = {
          name: bName,
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
        batterStatsMap[bName].ballsFaced += 1;
      }

      batterStatsMap[bName].runs += b.runs;
      if (b.runs === 4) batterStatsMap[bName].fours += 1;
      if (b.runs === 6) batterStatsMap[bName].sixes += 1;

      if (b.isOut) {
        batterStatsMap[bName].isOut = true;
        batterStatsMap[bName].outType = b.outType;
        batterStatsMap[bName].outBowler = b.bowler;
      }
    });

    // 🎯 Bowler Stats
    const bowlerStatsMap = {};
    match.score.balls.forEach((b) => {
      const bwName = b.bowler;
      if (!bowlerStatsMap[bwName]) {
        bowlerStatsMap[bwName] = {
          name: bwName,
          balls: 0,
          runs: 0,
          wickets: 0
        };
      }

      if (b.isExtra) {
        if (b.extraType !== "wide" && b.extraType !== "noBall") {
          bowlerStatsMap[bwName].balls += 1;
        }
      } else {
        bowlerStatsMap[bwName].balls += 1;
      }

      bowlerStatsMap[bwName].runs += b.runs + (b.isExtra ? b.extraRuns : 0);

      if (b.isOut && b.outType !== "runOut") {
        bowlerStatsMap[bwName].wickets += 1;
      }
    });

    match.batters = Object.keys(batterStatsMap);
    match.bowlers = Object.keys(bowlerStatsMap);
    match.batterStats = Object.values(batterStatsMap);
    match.bowlerStats = Object.values(bowlerStatsMap);

    // ✅ Get actual max wickets based on team size
    const teamSize = match.currentInnings === 1
      ? (match.teamAPlayers?.length || 11)
      : (match.teamBPlayers?.length || 11);

    const maxWickets = teamSize - 1;

    const inningsDone =
      match.currentInnings === 1 &&
      (
        match.score.wickets >= maxWickets ||
        match.currentOver === match.oversLimit
      );

    const matchDone =
      match.currentInnings === 2 &&
      (
        match.score.runs >= match.target ||
        match.score.wickets >= maxWickets ||
        match.currentOver === match.oversLimit
      );

    if (inningsDone) {
      match.innings1 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };

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
    }

    if (matchDone) {
      match.isFinished = true;

      match.innings2 = {
        team: match.score.team,
        runs: match.score.runs,
        wickets: match.score.wickets,
        overs: match.score.overs,
        batterStats: match.batterStats,
        bowlerStats: match.bowlerStats
      };

      if (match.score.runs > match.target - 1) {
        match.result = `${match.teamB} won by ${maxWickets - match.score.wickets} wickets`;
      } else if (match.score.runs < match.target - 1) {
        match.result = `${match.teamA} won by ${match.target - match.score.runs - 1} runs`;
      } else {
        match.result = "Match tied";
      }

      await createMatchSummary(match);
    }

    await match.save();

    res.json({
      message: "✅ Ball added",
      match: {
        ...match.toObject(),
        batterStats: Object.values(batterStatsMap),
        bowlerStats: Object.values(bowlerStatsMap)
      }
    });

  } catch (err) {
    console.error("Error in ball update:", err);
    res.status(500).json({ message: "❌ Error", error: err.message });
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

// ✅ Create match summary
async function createMatchSummary(match) {
  try {
    // Use innings data if available
    let firstInningsBalls = match.innings1?.balls || [];
    let secondInningsBalls = match.innings2?.balls || [];
    
    // Fallback to current balls if innings data not available
    if (match.currentInnings === 1 && firstInningsBalls.length === 0) {
      firstInningsBalls = match.score.balls || [];
    } else if (match.currentInnings === 2 && secondInningsBalls.length === 0) {
      secondInningsBalls = match.score.balls || [];
    }
    
    // Combine all balls for processing
    const allBalls = [...firstInningsBalls, ...secondInningsBalls];
    
    const batters = [];
    const bowlers = [];

    allBalls.forEach((ball) => {
      if (ball.batter) {
        let batter = batters.find(b => b.name === ball.batter);
        if (!batter) {
          batter = { name: ball.batter, runs: 0, balls: 0, outs: 0 };
          batters.push(batter);
        }
        batter.runs += ball.runs;
        if (!ball.isExtra || (ball.isExtra && ball.extraType !== "wide")) {
          batter.balls += 1;
        }
        if (ball.isOut) batter.outs += 1;
      }

      if (ball.bowler) {
        let bowler = bowlers.find(b => b.name === ball.bowler);
        if (!bowler) {
          bowler = { name: ball.bowler, runsGiven: 0, wickets: 0, balls: 0 };
          bowlers.push(bowler);
        }
        bowler.runsGiven += (ball.runs + (ball.isExtra ? ball.extraRuns : 0));
        if (!ball.isExtra || (ball.isExtra && ball.extraType !== "wide" && ball.extraType !== "noBall")) {
          bowler.balls += 1;
        }
        if (ball.isOut && ball.outType !== "runOut") {
          bowler.wickets += 1;
        }
      }
    });

    let result = match.result || "Match ended";
    
    // Create and save the summary
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
      innings2: match.innings2 || null
    });

    await summary.save();
    return summary;
  } catch (error) {
    console.error("Error creating match summary:", error);
    throw error;
  }
}

module.exports = router;