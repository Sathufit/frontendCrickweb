import React from "react";
import "../styles/PastMatches.css";

const PastMatches = ({ pastMatches, viewMatchSummary, deletePastMatch }) => {
  // ✅ Log the matches for debugging
  console.log("✅ Past Matches Data: ", pastMatches);

  if (!pastMatches.length) {
    return <p className="no-matches">No past matches available.</p>;
  }

  return (
    <div className="past-matches-grid">
      {pastMatches.map((match) => {
        console.log("🔍 Checking Match:", match); // ✅ Check each match object
        
        // ✅ Ensure `_id` exists before rendering
        if (!match._id) {
          console.error("❌ Match ID not found for match:", match);
          return null; // Skip rendering if `_id` is not valid
        }

        return (
          <div
            key={match._id}
            className="match-card"
            onClick={() => {
              console.log("🚀 Viewing Match Summary for ID:", match._id);
              viewMatchSummary(match._id); // ✅ Corrected to `_id`
            }}
          >
            <h3>{match.teamA} vs {match.teamB}</h3>
            <p className="match-result">{match.result || "No result"}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Deleting Match ID:", match._id);
                deletePastMatch(match._id);
              }}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PastMatches;
