require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// Test commit


const app = express();
app.use(express.json());

const corsOptions = {
    origin: [
      "http://localhost:3000",
      "https://frontyardcricket.onrender.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  };
  
  app.use(cors(corsOptions));
  

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

  const RunSchema = new mongoose.Schema({
    name: String,
    venue: String,
    runs: Number,
    innings: Number,
    outs: Number,
    date: String
});

const WicketSchema = new mongoose.Schema({
    bowler_name: String,
    venue: String,
    wickets: Number,
    innings: Number,
    date: String
});

const LiveMatchSchema = new mongoose.Schema({
    matchName: String,
    oversLimit: Number,
    currentInnings: { type: Number, default: 1 },
    currentOver: Number,
    currentBall: Number,
    teamA: String,
    teamB: String,
    score: {
      team: String,
      runs: Number,
      wickets: Number,
      overs: String,
      balls: Array,
    },
    batters: Array,
    bowler: String,
    isFinished: { type: Boolean, default: false },
    target: Number // Track target for second innings
  });
  
  

const Run = mongoose.model("runs", RunSchema);
const Wicket = mongoose.model("wickets", WicketSchema);
const LiveMatch = mongoose.model("LiveMatch", LiveMatchSchema);

app.get("/current-match", async (req, res) => {
    try {
        const match = await LiveMatch.findOne({ isFinished: false });
        res.json({ match });
    } catch (error) {
        res.status(500).json({ message: "Error fetching current match", error: error.message });
    }
});

// POST finish match
app.post("/finish-match/:id", async (req, res) => {
    try {
        const match = await LiveMatch.findById(req.params.id);
        if (!match) return res.status(404).json({ message: "Match not found" });

        match.isFinished = true;
        await match.save();

        res.json({ message: "Match finished successfully", match });
    } catch (error) {
        res.status(500).json({ message: "Error finishing match", error: error.message });
    }
});

app.get("/players/stats", async (req, res) => {
    try {
        const stats = await Run.aggregate([
            {
                $group: {
                    _id: "$name",
                    totalRuns: { $sum: "$runs" },
                    totalInnings: { $sum: "$innings" },
                    totalOuts: { $sum: "$outs" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    totalRuns: 1,
                    totalInnings: 1,
                    totalOuts: 1,
                    average: {
                        $cond: {
                            if: { $gt: ["$totalOuts", 0] },
                            then: { $divide: ["$totalRuns", "$totalOuts"] },
                            else: "N/A"
                        }
                    }
                }
            },
            { $sort: { totalRuns: -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get("/runs", async (req, res) => {
    try {
        const runs = await Run.find().select("name venue runs innings outs date");
        res.json(runs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/wickets", async (req, res) => {
    try {
        const wickets = await Wicket.find();
        res.json(wickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/runs", async (req, res) => {
    try {
        const { name, venue, runs, innings, outs, date } = req.body;
        if (!name || !venue || runs == null || innings == null || outs == null || !date) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        const newRun = new Run({ name, venue, runs, innings, outs, date });
        await newRun.save();
        res.status(201).json({ message: "✅ Run added successfully", newRun });
    } catch (err) {
        res.status(500).json({ message: "❌ Server error", error: err.message });
    }
});

app.post("/wickets", async (req, res) => {
    try {
        const { bowler_name, venue, wickets, innings, date } = req.body;
        if (!bowler_name || !venue || wickets == null || innings == null || !date) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        const newWicket = new Wicket({ bowler_name, venue, wickets, innings, date });
        await newWicket.save();
        res.status(201).json({ message: "✅ Wicket added successfully", newWicket });
    } catch (err) {
        res.status(500).json({ message: "❌ Server error", error: err.message });
    }
});

app.delete("/runs/:id", async (req, res) => {
    try {
        const deletedRun = await Run.findByIdAndDelete(req.params.id);
        if (!deletedRun) {
            return res.status(404).json({ message: "❌ Run not found" });
        }
        res.json({ message: "✅ Run deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/wickets/:id", async (req, res) => {
    try {
        const deletedWicket = await Wicket.findByIdAndDelete(req.params.id);
        if (!deletedWicket) {
            return res.status(404).json({ message: "❌ Wicket not found" });
        }
        res.json({ message: "✅ Wicket deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/runs/:id", async (req, res) => {
    try {
        const updatedRun = await Run.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRun) {
            return res.status(404).json({ message: "❌ Run not found" });
        }
        res.json({ message: "✅ Run updated successfully", updatedRun });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/wickets/:id", async (req, res) => {
    try {
        const updatedWicket = await Wicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWicket) {
            return res.status(404).json({ message: "❌ Wicket not found" });
        }
        res.json({ message: "✅ Wicket updated successfully", updatedWicket });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/daily-report", async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required in query param" });

    try {
        const dailyBatters = await Run.aggregate([
            { $match: { date: date } },
            {
                $group: {
                    _id: "$name",
                    runs: { $sum: "$runs" }
                }
            },
            { $sort: { runs: -1 } }
        ]);

        const dailyBowlers = await Wicket.aggregate([
            { $match: { date: date } },
            {
                $group: {
                    _id: "$bowler_name",
                    wickets: { $sum: "$wickets" }
                }
            },
            { $sort: { wickets: -1 } }
        ]);

        res.json({ date, batters: dailyBatters, bowlers: dailyBowlers });
    } catch (err) {
        res.status(500).json({ message: "Error generating report", error: err.message });
    }
});

app.post("/start-match", async (req, res) => {
    try {
        const { matchName, oversLimit, teamA, teamB } = req.body;
        const newMatch = new LiveMatch({
            matchName,
            oversLimit,
            currentOver: 0,
            currentBall: 0,
            teamA,
            teamB,
            score: {
                team: teamA,
                runs: 0,
                wickets: 0,
                overs: "0.0",
                balls: [],
            },
            batters: [],
            bowler: "",
        });
        await newMatch.save();
        res.status(201).json({ message: "Match started successfully", match: newMatch });
    } catch (error) {
        res.status(500).json({ message: "Error starting match", error: error.message });
    }
});

app.put("/update-score/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { runs, ballType, batter, bowler, isOut, outType } = req.body;
        const match = await LiveMatch.findById(id);
        if (!match) return res.status(404).json({ message: "Match not found" });

        match.score.runs += runs;
        match.score.balls.push({ runs, ballType, batter, bowler, isOut, outType });
        match.currentBall += 1;

        if (match.currentBall === 6) {
            match.currentBall = 0;
            match.currentOver += 1;
        }
        match.score.overs = `${match.currentOver}.${match.currentBall}`;

        if (isOut) match.score.wickets += 1;

        const today = new Date().toISOString().slice(0, 10);

        await Promise.all([
            new Run({ name: batter, venue: match.matchName, runs, innings: 1, outs: isOut ? 1 : 0, date: today }).save(),
            new Wicket({ bowler_name: bowler, venue: match.matchName, wickets: isOut ? 1 : 0, innings: 1, date: today }).save()
        ]);

        await match.save();
        res.json({ message: "Score updated successfully", match });
    } catch (error) {
        res.status(500).json({ message: "Error updating score", error: error.message });
    }
});

app.get("/match-summary/:id", async (req, res) => {
    try {
        const match = await LiveMatch.findById(req.params.id);
        if (!match) return res.status(404).json({ message: "Match not found" });

        const battersStats = {};
        const bowlersStats = {};

        match.score.balls.forEach(({ batter, bowler, runs, isOut }) => {
            if (!battersStats[batter]) battersStats[batter] = { runs: 0, balls: 0, outs: 0 };
            if (!bowlersStats[bowler]) bowlersStats[bowler] = { runsGiven: 0, wickets: 0 };

            battersStats[batter].runs += runs;
            battersStats[batter].balls += 1;
            if (isOut) battersStats[batter].outs += 1;

            bowlersStats[bowler].runsGiven += runs;
            if (isOut) bowlersStats[bowler].wickets += 1;
        });

        res.json({
            matchName: match.matchName,
            teams: { teamA: match.teamA, teamB: match.teamB },
            finalScore: match.score,
            battersStats,
            bowlersStats
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching summary", error: err.message });
    }
});
// DELETE /api/matches/:id
app.delete('/matches/:id', async (req, res) => {
    try {
      const matchId = req.params.id;
      await LiveMatch.findByIdAndDelete(matchId);
      res.json({ success: true, message: "Match deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete match" });
    }
  });
  app.get("/finished-matches", async (req, res) => {
    try {
      const matches = await LiveMatch.find({ isFinished: true });
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch finished matches", error: error.message });
    }
  });
  
  

  const frontendPath = path.join(__dirname, "frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
