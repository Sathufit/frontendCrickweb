require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const liveMatchRoutes = require("./routes/livematch");

const app = express();

// ✅ CORS setup
const corsOptions = {
  origin: ["http://localhost:3000", "https://frontyardcricket.onrender.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// ✅ Middleware
app.use(express.json());

// ✅ Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' http://localhost:5001 https://friendspherecricweb.onrender.com; img-src 'self' data:; frame-ancestors 'self';"
  );
  next();
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use live match routes BEFORE frontend
app.use("/api", liveMatchRoutes);

// ✅ Mongoose schemas/models
const Run = mongoose.model("runs", new mongoose.Schema({
  name: String,
  venue: String,
  runs: Number,
  innings: Number,
  outs: Number,
  date: String
}));

const Wicket = mongoose.model("wickets", new mongoose.Schema({
  bowler_name: String,
  venue: String,
  wickets: Number,
  innings: Number,
  date: String
}));

// ✅ Stats Routes
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
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ CRUD Routes for Runs & Wickets
app.get("/runs", async (req, res) => {
  try {
    const runs = await Run.find().sort({ date: -1 });
    res.json(runs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/wickets", async (req, res) => {
  try {
    const wickets = await Wicket.find().sort({ date: -1 });
    res.json(wickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/runs", async (req, res) => {
  try {
    const { name, venue, runs, innings, outs, date } = req.body;
    if (!name || !venue || runs == null || innings == null || outs == null || !date)
      return res.status(400).json({ message: "❌ All fields are required" });

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
    if (!bowler_name || !venue || wickets == null || innings == null || !date)
      return res.status(400).json({ message: "❌ All fields are required" });

    const newWicket = new Wicket({ bowler_name, venue, wickets, innings, date });
    await newWicket.save();
    res.status(201).json({ message: "✅ Wicket added successfully", newWicket });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

app.put("/runs/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });

    const updatedRun = await Run.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRun)
      return res.status(404).json({ message: "❌ Run not found" });

    res.json({ message: "✅ Run updated successfully", updatedRun });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/wickets/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });

    const { bowler_name, venue, wickets, innings, date } = req.body;
    if (!bowler_name || !venue || wickets == null || innings == null || !date)
      return res.status(400).json({ message: "❌ All fields are required" });

    const updatedWicket = await Wicket.findByIdAndUpdate(
      req.params.id,
      { bowler_name, venue, wickets, innings, date },
      { new: true, runValidators: true }
    );

    if (!updatedWicket)
      return res.status(404).json({ message: "❌ Wicket not found" });

    res.json({ message: "✅ Wicket updated successfully", updatedWicket });
  } catch (err) {
    res.status(500).json({ message: "❌ Server error", error: err.message });
  }
});

app.delete("/runs/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });

    const deleted = await Run.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "❌ Run not found" });

    res.json({ message: "✅ Run deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/wickets/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid ID format" });

    const deleted = await Wicket.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "❌ Wicket not found" });

    res.json({ message: "✅ Wicket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/daily-report", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required in query param" });

  try {
    const dailyBatters = await Run.aggregate([
      { $match: { date } },
      { $group: { _id: "$name", runs: { $sum: "$runs" } } },
      { $sort: { runs: -1 } }
    ]);

    const dailyBowlers = await Wicket.aggregate([
      { $match: { date } },
      { $group: { _id: "$bowler_name", wickets: { $sum: "$wickets" } } },
      { $sort: { wickets: -1 } }
    ]);

    res.json({ date, batters: dailyBatters, bowlers: dailyBowlers });
  } catch (err) {
    res.status(500).json({ message: "Error generating report", error: err.message });
  }
});

// ✅ Serve frontend AFTER all API routes
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
