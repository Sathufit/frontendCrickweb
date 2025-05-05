const BowlerStatSchema = new mongoose.Schema({
    bowler_name: String,
    venue: String,
    runsGiven: Number,
    wickets: Number,
    date: String
  });
  
  const BowlerStat = mongoose.model("bowlerstats", BowlerStatSchema);
  