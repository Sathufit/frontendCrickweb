import React from "react";
import '../styles/MatchSummary.css'; // ✅ Correct path


const MatchSummary = ({ matchSummary, innings }) => {
  if (!matchSummary) return null;

  const currentInnings = innings === 1 ? "innings1" : "innings2";
  const inningsData = matchSummary[currentInnings];

  return (
    <div className="match-summary">
      <h3>🏏 {inningsData.battingTeam} - Innings {innings}</h3>
      <p>Runs: {inningsData.runs}/{inningsData.wickets} | Overs: {inningsData.overs}</p>

      <div className="summary-table">
        <h4>Batting</h4>
        <div className="table-header">
          <span>Batter</span>
          <span>Runs</span>
          <span>Balls Faced</span>
          <span>Fours</span>
          <span>Sixes</span>
          <span>SR</span>
        </div>
        {inningsData.batters.map((batter, index) => (
          <div key={index} className="table-row">
            <span>{batter.name}</span>
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
        ))}
      </div>

      <div className="summary-table">
        <h4>Bowling</h4>
        <div className="table-header">
          <span>Bowler</span>
          <span>Overs</span>
          <span>Runs</span>
          <span>Wickets</span>
          <span>Economy</span>
        </div>
        {inningsData.bowlers.map((bowler, index) => (
          <div key={index} className="table-row">
            <span>{bowler.name}</span>
            <span>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</span>
            <span>{bowler.runs}</span>
            <span>{bowler.wickets}</span>
            <span>
              {bowler.balls > 0
                ? (bowler.runs / (bowler.balls / 6)).toFixed(1)
                : "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSummary;
