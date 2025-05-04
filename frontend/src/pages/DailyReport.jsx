import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'chart.js/auto';
const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://frontyardcricket.onrender.com";


const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    if (!selectedDate) return;
    try {
      const res = await axios.get(`${API_URL}/daily-report?date=${selectedDate}`);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    }
  };

  const generatePDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Cricket Report - ${report.date}`, 14, 20);

    doc.setFontSize(14);
    doc.text('🏏 Batting Stats', 14, 35);
    report.batters.forEach((b, i) => {
      doc.text(`${i + 1}. ${b._id}: ${b.runs} runs`, 14, 45 + i * 7);
    });

    const offset = 45 + report.batters.length * 7 + 10;
    doc.text('🎯 Bowling Stats', 14, offset);
    report.bowlers.forEach((b, i) => {
      doc.text(`${i + 1}. ${b._id}: ${b.wickets} wickets`, 14, offset + 10 + i * 7);
    });

    doc.save(`Cricket_Report_${report.date}.pdf`);
  };

  const getChartData = (labels, values, label, bgColor) => ({
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: bgColor,
      },
    ],
  });

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
          <button onClick={generatePDF} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            📄 Download PDF
          </button>

          <h3 style={{ marginTop: '2rem' }}>🏏 Batting Table</h3>
          <table border="1" cellPadding="8">
            <thead><tr><th>Name</th><th>Runs</th></tr></thead>
            <tbody>
              {report.batters.map((b, i) => (
                <tr key={i}><td>{b._id}</td><td>{b.runs}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: '2rem' }}>🎯 Bowling Table</h3>
          <table border="1" cellPadding="8">
            <thead><tr><th>Name</th><th>Wickets</th></tr></thead>
            <tbody>
              {report.bowlers.map((b, i) => (
                <tr key={i}><td>{b._id}</td><td>{b.wickets}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: '2rem' }}>📊 Charts</h3>
          <div style={{ maxWidth: '700px', marginBottom: '2rem' }}>
            <Bar
              data={getChartData(
                report.batters.map(b => b._id),
                report.batters.map(b => b.runs),
                "Runs by Batter",
                "#4a90e2"
              )}
            />
          </div>

          <div style={{ maxWidth: '700px' }}>
            <Bar
              data={getChartData(
                report.bowlers.map(b => b._id),
                report.bowlers.map(b => b.wickets),
                "Wickets by Bowler",
                "#10b981"
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DailyReport;
