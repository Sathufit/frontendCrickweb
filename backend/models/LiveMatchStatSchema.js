// models/LiveMatchStatSchema.js
const mongoose = require("mongoose");

const LiveMatchStatSchema = new mongoose.Schema({
    matchId: mongoose.Schema.Types.ObjectId,
    matchName: String,
    date: String,
    teamA: String,
    teamB: String,
    result: String,
    batters: [
        {
            name: String,
            runs: Number,
            balls: Number,
            outs: Number,
        },
    ],
    bowlers: [
        {
            name: String,
            runsGiven: Number,
            wickets: Number,
        },
    ],
});

module.exports = mongoose.model("LiveMatchStat", LiveMatchStatSchema);
