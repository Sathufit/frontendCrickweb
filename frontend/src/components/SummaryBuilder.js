// src/components/SummaryBuilder.js

// Helper function to format balls into overs (e.g., 121 balls -> "20.1")
function formatOvers(balls) {
  if (typeof balls !== 'number' || balls < 0) return "0.0";
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${overs}.${remainingBalls}`;
}

// Main function to build the summary for an "Overs" match
export function buildOversSummary(data) {
  if (!data) return null;

  const {
    teamAName = "Team A",
    teamBName = "Team B",
    battingFirstTeam = teamAName,
    firstInningsScore = 0, firstInningsWickets = 0, firstInningsBalls = 0,
    secondInningsScore = 0, secondInningsWickets = 0, secondInningsBalls = 0,
    teamAPlayers = [],
    teamBPlayers = [],
    fullMatchBattingStats = {},
    fullMatchBowlingStats = {}
  } = data;

  // 1. Determine each team's final score
  const [teamAScore, teamAWickets, teamABalls] = (battingFirstTeam === teamAName)
    ? [firstInningsScore, firstInningsWickets, firstInningsBalls]
    : [secondInningsScore, secondInningsWickets, secondInningsBalls];

  const [teamBScore, teamBWickets, teamBBalls] = (battingFirstTeam === teamBName)
    ? [firstInningsScore, firstInningsWickets, firstInningsBalls]
    : [secondInningsScore, secondInningsWickets, secondInningsBalls];

  // 2. Determine the result string
  let resultText = "";
  if (teamAScore > teamBScore) {
    resultText = `${teamAName} Won by ${teamAScore - teamBScore} runs`;
  } else if (teamBScore > teamAScore) {
    const wicketsLeft = 10 - teamBWickets;
    resultText = `${teamBName} Won by ${wicketsLeft} wickets`;
  } else {
    resultText = "Match Tied";
  }

  // 3. Filter stats for each team
  const getStats = (players, fullStats) => {
    return players.map(player => fullStats[player]).filter(Boolean);
  };
  
  const teamAStats = {
    batting: getStats(teamAPlayers, fullMatchBattingStats),
    bowling: getStats(teamAPlayers, fullMatchBowlingStats)
  };
  
  const teamBStats = {
    batting: getStats(teamBPlayers, fullMatchBattingStats),
    bowling: getStats(teamBPlayers, fullMatchBowlingStats)
  };

  // 4. Construct and return the final summary object
  return {
    title: `${teamAName} vs ${teamBName}`,
    teamAScoreText: `${teamAName}: ${teamAScore}/${teamAWickets} (${formatOvers(teamABalls)})`,
    teamBScoreText: `${teamBName}: ${teamBScore}/${teamBWickets} (${formatOvers(teamBBalls)})`,
    result: resultText,
    teamAStats,
    teamBStats
  };
}

// You can add buildTestSummary(data) here later following the same pattern