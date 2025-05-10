import React from 'react';

const SummaryModal = ({ isVisible, setIsVisible, matchSummary, selectedMatchName }) => {
  if (!isVisible) return null;

  const { innings1, innings2, result } = matchSummary;

  // 📝 Helper to render Batting Stats
  const renderBattingStats = (batters) => {
    if (!batters || batters.length === 0) {
      return <p>No batting data available.</p>;
    }
    return batters.map((batter, index) => (
      <div key={index} className="stat-row">
        <span className="stat-name">{batter.name}</span>: 
        <span>{batter.runs} ({batter.ballsFaced})</span> - 
        <span>{batter.fours}x4, {batter.sixes}x6</span>
      </div>
    ));
  };

  // 📝 Helper to render Bowling Stats
  const renderBowlingStats = (bowlers) => {
    if (!bowlers || bowlers.length === 0) {
      return <p>No bowling data available.</p>;
    }
    return bowlers.map((bowler, index) => (
      <div key={index} className="stat-row">
        <span className="stat-name">{bowler.name}</span>: 
        <span>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6} overs</span>, 
        <span>{bowler.runs} runs</span>, 
        <span>{bowler.wickets} wickets</span>
      </div>
    ));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{selectedMatchName} - Match Summary</h2>

        {/* First Innings Summary */}
        <div className="innings-summary">
          <h3>1st Innings - {innings1?.team || "N/A"}</h3>
          <p>Runs: {innings1?.runs ?? 0} / Wickets: {innings1?.wickets ?? 0}</p>
          <p>Overs: {innings1?.overs ?? "0.0"}</p>

          <div className="summary-section">
            <h4>Batting</h4>
            {renderBattingStats(innings1?.batterStats)}
          </div>

          <div className="summary-section">
            <h4>Bowling</h4>
            {renderBowlingStats(innings1?.bowlerStats)}
          </div>
        </div>

        {/* Second Innings Summary */}
        <div className="innings-summary">
          <h3>2nd Innings - {innings2?.team || "N/A"}</h3>
          <p>Runs: {innings2?.runs ?? 0} / Wickets: {innings2?.wickets ?? 0}</p>
          <p>Overs: {innings2?.overs ?? "0.0"}</p>

          <div className="summary-section">
            <h4>Batting</h4>
            {renderBattingStats(innings2?.batterStats)}
          </div>

          <div className="summary-section">
            <h4>Bowling</h4>
            {renderBowlingStats(innings2?.bowlerStats)}
          </div>
        </div>

        {/* Match Result */}
        <div className="match-result">
          <h3>Result:</h3>
          <p>{result || "No result available."}</p>
        </div>

        <button onClick={() => setIsVisible(false)} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
