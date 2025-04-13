// WicketAnalysis.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import "../styles/WicketAnalysis.css";

const WicketAnalysis = () => {
  const [wicketsData, setWicketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rate', direction: 'descending' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchWickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/wickets`);
        const data = response.data;

        // Group by bowler and aggregate
        const analysisMap = {};
        data.forEach(w => {
          const key = w.bowler_name;
          if (!analysisMap[key]) {
            analysisMap[key] = { wickets: 0, innings: 0 };
          }
          analysisMap[key].wickets += Number(w.wickets);
          analysisMap[key].innings += Number(w.innings);
        });

        // Convert to array and calculate rate
        const analysisArray = Object.entries(analysisMap).map(([name, stats]) => ({
          bowler_name: name,
          total_wickets: stats.wickets,
          total_innings: stats.innings,
          rate: stats.innings === 0 ? 0 : (stats.wickets / stats.innings).toFixed(2),
        }));

        // Sort by rate
        sortData(analysisArray, 'rate', 'descending');
        setWicketsData(analysisArray);
      } catch (err) {
        console.error("❌ Error fetching wicket analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWickets();
  }, []);

  const sortData = (data, key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === 'bowler_name') {
        return direction === 'ascending' 
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      } else {
        return direction === 'ascending' 
          ? parseFloat(a[key]) - parseFloat(b[key])
          : parseFloat(b[key]) - parseFloat(a[key]);
      }
    });
    
    setWicketsData(sortedData);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    sortData(wicketsData, key, direction);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === 'ascending' ? "↑" : "↓";
  };

  const renderPlayerCards = () => {
    return (
      <div className="wicket-cards">
        {wicketsData.map((bowler, index) => (
          <div 
            className="wicket-card" 
            key={index}
            style={{'--animation-order': index}}
          >
            <div className="wicket-card-header">
              <span className="wicket-card-rank">{index + 1}</span>
              <h3 className="wicket-card-name">{bowler.bowler_name}</h3>
            </div>
            <div className="wicket-card-stats">
              <div className="wicket-stat">
                <span className="wicket-stat-value">{bowler.total_wickets}</span>
                <span className="wicket-stat-label">Wickets</span>
              </div>
              <div className="wicket-stat">
                <span className="wicket-stat-value">{bowler.total_innings}</span>
                <span className="wicket-stat-label">Innings</span>
              </div>
              <div className="wicket-stat highlight">
                <span className="wicket-stat-value">{bowler.rate}</span>
                <span className="wicket-stat-label">Rate</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div className="wicket-table-container">
        <table className="wicket-table">
          <thead>
            <tr>
              <th className="rank-column">#</th>
              <th onClick={() => requestSort('bowler_name')}>
                Bowler {getSortIcon('bowler_name')}
              </th>
              <th onClick={() => requestSort('total_wickets')}>
                Wickets {getSortIcon('total_wickets')}
              </th>
              <th onClick={() => requestSort('total_innings')}>
                Innings {getSortIcon('total_innings')}
              </th>
              <th onClick={() => requestSort('rate')}>
                Rate {getSortIcon('rate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {wicketsData.map((bowler, index) => (
              <tr key={index} style={{'--animation-order': index}}>
                <td className="rank-column">{index + 1}</td>
                <td>{bowler.bowler_name}</td>
                <td>{bowler.total_wickets}</td>
                <td>{bowler.total_innings}</td>
                <td className="rate-column">{bowler.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="wicket-analysis">
      <div className="wicket-header">
        <h1>Wicket Rate Analysis</h1>
        <p className="wicket-subtitle">
          Comparing bowlers based on wickets taken per innings
        </p>
      </div>

      {loading ? (
        <div className="wicket-loading">
          <div className="cricket-loader">
            <div className="cricket-ball"></div>
          </div>
          <p>Loading analysis...</p>
        </div>
      ) : (
        <div className="wicket-content">
          {isMobile ? renderPlayerCards() : renderTable()}
        </div>
      )}
    </div>
  );
};

export default WicketAnalysis;