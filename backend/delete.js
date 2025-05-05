const mongoose = require('mongoose');

// Define schema for bowler stats
const bowlerStatSchema = new mongoose.Schema({
  bowler_name: String,
  venue: String,
  runsGiven: Number,
  wickets: Number,
  date: String,
});

// Use exact collection name "bowlerstats"
const BowlerStat = mongoose.model('BowlerStat', bowlerStatSchema, 'wickets');

const deleteBowlerStats = async () => {
  try {
    await mongoose.connect('mongodb+srv://nanayakkarasathush89:wONyYAlS6IYOIOB7@cluster0.g1v4x.mongodb.net/cricketdb?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await BowlerStat.deleteMany({ bowler_name: /Shanaka/i });

    console.log(`✅ ${result.deletedCount} bowler stat(s) deleted.`);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error deleting bowler stats:', error);
  }
};

deleteBowlerStats();
