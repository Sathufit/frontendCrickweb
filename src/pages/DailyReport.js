import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    if (!selectedDate) return;
    try {
      const res = await axios.get(`/daily-report?date=${selectedDate}`);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Daily Cricket Report</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={fetchReport} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Get Report
      </button>

      {report && (
        <>
          <h3>Batters on {report.date}</h3>
          <table>
            <thead><tr><th>Name</th><th>Runs</th></tr></thead>
            <tbody>
              {report.batters.map((b, i) => (
                <tr key={i}><td>{b._id}</td><td>{b.runs}</td></tr>
              ))}
            </tbody>
          </table>

          <h3>Bowlers on {report.date}</h3>
          <table>
            <thead><tr><th>Name</th><th>Wickets</th></tr></thead>
            <tbody>
              {report.bowlers.map((b, i) => (
                <tr key={i}><td>{b._id}</td><td>{b.wickets}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DailyReport;
