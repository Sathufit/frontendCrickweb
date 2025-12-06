import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'chart.js/auto';
import '../styles/AnalyticsImproved.css';

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5001"
  : "https://frontyardcricket.onrender.com";

const DailyReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/daily-report?date=${selectedDate}`);
      setReport(res.data);
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Cricket Report - ${report.date}`, 14, 20);

    doc.setFontSize(14);
    doc.text('Batting Stats', 14, 35);
    report.batters.forEach((b, i) => {
      doc.text(`${i + 1}. ${b._id}: ${b.runs} runs`, 14, 45 + i * 7);
    });

    const offset = 45 + report.batters.length * 7 + 10;
    doc.text('Bowling Stats', 14, offset);
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
        borderColor: bgColor,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(242, 242, 242, 0.05)',
        },
        ticks: {
          color: 'var(--color-text-secondary)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'var(--color-text-secondary)',
        },
      },
    },
  };

  return (
    <div className="analytics-page">
      <Navbar />

      <div className="analytics-container">
        <div className="analytics-header">
          <h1 className="analytics-title">
            Daily <span className="highlight">Report</span>
          </h1>
          <p className="analytics-subtitle">
            Generate comprehensive match reports for any date
          </p>
        </div>

        {/* Date Selector */}
        <div className="filters-bar" style={{ marginBottom: '2rem' }}>
          <div className="filter-group" style={{ flex: 1, maxWidth: '400px' }}>
            <label className="filter-label">Select Date</label>
            <input
              type="date"
              className="filter-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '12px' }}
            />
          </div>
          <button 
            onClick={fetchReport} 
            className="btn-primary"
            style={{ alignSelf: 'flex-end', padding: '12px 32px' }}
          >
            Generate Report
          </button>
        </div>

        {loading ? (
          <div className="loading-analytics">
            <div className="loading-spinner-large"></div>
            <p className="loading-text">Generating report...</p>
          </div>
        ) : report ? (
          <>
            {/* Export Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={generatePDF} className="btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download PDF
              </button>
            </div>

            {/* Batting Statistics */}
            <div className="chart-card" style={{ marginBottom: '2rem' }}>
              <div className="chart-header">
                <h3 className="chart-title">Batting Performance</h3>
                <p className="chart-subtitle">{report.batters.length} batters</p>
              </div>
              
              {/* Chart */}
              <div style={{ height: '300px', padding: '2rem 1rem' }}>
                <Bar
                  data={getChartData(
                    report.batters.map(b => b._id),
                    report.batters.map(b => b.runs),
                    'Runs',
                    'var(--color-accent-primary)'
                  )}
                  options={chartOptions}
                />
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.1)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batter</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Runs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.batters.map((batter, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.05)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200, 255, 58, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(200, 255, 58, 0.1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {index + 1}
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{batter._id}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: batter.runs >= 100 ? 'rgba(34, 197, 94, 0.1)' : batter.runs >= 50 ? 'rgba(200, 255, 58, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                            border: `1px solid ${batter.runs >= 100 ? '#22c55e' : batter.runs >= 50 ? 'var(--color-accent-primary)' : 'rgba(160, 160, 160, 0.3)'}`,
                            borderRadius: '6px',
                            color: batter.runs >= 100 ? '#22c55e' : batter.runs >= 50 ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {batter.runs}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Statistics */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Bowling Performance</h3>
                <p className="chart-subtitle">{report.bowlers.length} bowlers</p>
              </div>
              
              {/* Chart */}
              <div style={{ height: '300px', padding: '2rem 1rem' }}>
                <Bar
                  data={getChartData(
                    report.bowlers.map(b => b._id),
                    report.bowlers.map(b => b.wickets),
                    'Wickets',
                    '#22c55e'
                  )}
                  options={chartOptions}
                />
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.1)' }}>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rank</th>
                      <th style={{ padding: '16px', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bowler</th>
                      <th style={{ padding: '16px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wickets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.bowlers.map((bowler, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(242, 242, 242, 0.05)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(200, 255, 58, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(200, 255, 58, 0.1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {index + 1}
                          </div>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--color-text-primary)', fontWeight: 600 }}>{bowler._id}</td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: bowler.wickets >= 5 ? 'rgba(34, 197, 94, 0.1)' : bowler.wickets >= 3 ? 'rgba(200, 255, 58, 0.1)' : 'rgba(160, 160, 160, 0.1)',
                            border: `1px solid ${bowler.wickets >= 5 ? '#22c55e' : bowler.wickets >= 3 ? 'var(--color-accent-primary)' : 'rgba(160, 160, 160, 0.3)'}`,
                            borderRadius: '6px',
                            color: bowler.wickets >= 5 ? '#22c55e' : bowler.wickets >= 3 ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {bowler.wickets}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="chart-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto', display: 'block' }}>
                <path d="M3 3v18h18"/>
                <path d="M18 17V9"/>
                <path d="M13 17V5"/>
                <path d="M8 17v-3"/>
              </svg>
            </div>
            <h3 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>No Report Generated</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Select a date and click "Generate Report" to view statistics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
