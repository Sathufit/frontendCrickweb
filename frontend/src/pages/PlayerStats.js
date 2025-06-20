import React, { useEffect, useState, useCallback } from "react";
// This uses your actual API function.
import { fetchPlayerStats } from "../api";

const PlayerStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // --- Data Fetching and State Management ---

  useEffect(() => {
    const loadPlayerStats = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayerStats();
        console.log("📌 Fetched Player Stats (Frontend):", data);
        // Ensure stats is an array to prevent errors if API returns nothing
        setStats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching player stats:", error);
        setStats([]); // Set to empty array on error
      }
      setLoading(false);
    };
    loadPlayerStats();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Navigation Logic ---

  const changePlayer = useCallback((newIndex) => {
    if (isTransitioning || stats.length <= 1) return;
    setIsTransitioning(true);
    setCurrentPlayerIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500); // Duration matches CSS transition
  }, [isTransitioning, stats.length]);

  const nextPlayer = useCallback(() => {
    changePlayer((currentPlayerIndex + 1) % stats.length);
  }, [currentPlayerIndex, stats.length, changePlayer]);

  const prevPlayer = useCallback(() => {
    changePlayer((currentPlayerIndex - 1 + stats.length) % stats.length);
  }, [currentPlayerIndex, stats.length, changePlayer]);

  // --- Swipe/Touch Handling for Mobile ---

  const [touchStart, setTouchStart] = useState(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e) => {
    if (touchStart === null) return;
    const distance = touchStart - e.targetTouches[0].clientX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPlayer();
      setTouchStart(null); // Prevent multiple swipes
    } else if (isRightSwipe) {
      prevPlayer();
      setTouchStart(null); // Prevent multiple swipes
    }
  };


  // --- Helper Functions and Components ---

  const getPerformanceColor = (average) => {
    if (average >= 50) return '#dc2626';
    if (average >= 35) return '#ef4444';
    return '#fca5a5';
  };

  const getPerformanceGrade = (average) => {
    if (average >= 45) return 'Excellent';
    if (average >= 25) return 'Good';
    if (average >= 10) return 'Average';
    return 'Needs Improvement';
  };

  const calculateStrikeRate = (runs, innings) => {
    return innings > 0 ? ((runs / innings) * 1.2).toFixed(1) : "0.0";
  };

  const CircularProgress = ({ percentage, color, size = 120 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg style={{ transform: 'rotate(-90deg)' }} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="transparent" />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color} strokeWidth="8" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>{Math.round(percentage)}</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, color: color }}>%</span>
        </div>
      </div>
    );
  };

  // This is now a "dumb" component just for displaying data.
  // All event handling and layout control is managed by the parent.
  const PlayerProfileCard = ({ player }) => {
    const average = player.average !== "N/A" ? Number(player.average) : 0;
    const strikeRate = calculateStrikeRate(player.totalRuns, player.totalInnings);
    const performancePercentage = Math.min((average / 60) * 100, 100);
    const consistencyPercentage = player.totalInnings > 0 ? Math.round(((player.totalInnings - player.totalOuts) / player.totalInnings) * 100) : 0;

    return (
      <div
        className="player-card-content"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
          minHeight: '100%', // Fills the scrollable container
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          position: 'relative',
          paddingBottom: '50px' // Space for content at the very bottom
        }}
      >
        {/* Decorative Backgrounds */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* Left Side: Player Info */}
        <div style={{ flex: isMobile ? 'none' : '0 0 45%', padding: isMobile ? '110px 24px 24px' : '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: isMobile ? 120 : 220, height: isMobile ? 120 : 220, borderRadius: '50%', background: 'linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? 20 : 30, fontSize: isMobile ? 32 : 64, fontWeight: 'bold', color: '#dc2626', border: '6px solid rgba(255,255,255,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <span>{player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
          </div>
          <h1 style={{ color: 'white', fontSize: isMobile ? '2rem' : '3rem', fontWeight: 800, margin: '0 0 16px 0', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>{player.name}</h1>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: 25, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 32 }}>
            <span style={{ color: 'white', fontSize: isMobile ? 12 : 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{getPerformanceGrade(average)}</span>
          </div>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>Innings</div>
              <div style={{ color: 'white', fontSize: isMobile ? 20 : 28, fontWeight: 700 }}>{player.totalInnings}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>Outs</div>
              <div style={{ color: 'white', fontSize: isMobile ? 20 : 28, fontWeight: 700 }}>{player.totalOuts}</div>
            </div>
          </div>
        </div>

        {/* Right Side: Statistics */}
        <div style={{ flex: 1, padding: isMobile ? '24px' : '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: isMobile ? 32 : 50, textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 14 : 18, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Career Statistics</div>
            <div style={{ color: 'white', fontSize: isMobile ? 48 : 64, fontWeight: 800, lineHeight: 1 }}>{player.totalRuns.toLocaleString()}</div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: isMobile ? 14 : 18, marginTop: 4 }}>Total Runs Scored</div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 20 : 40, marginBottom: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <CircularProgress percentage={performancePercentage} color={getPerformanceColor(average)} size={isMobile ? 100 : 140} />
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600, marginTop: 12, textTransform: 'uppercase' }}>Batting Avg</div>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 700, marginTop: 4 }}>{Number(player.average).toFixed(1)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <CircularProgress percentage={consistencyPercentage} color="#ffffff" size={isMobile ? 100 : 140} />
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 600, marginTop: 12, textTransform: 'uppercase' }}>Consistency</div>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 700, marginTop: 4 }}>{consistencyPercentage}%</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>Strike Rate</div>
              <div style={{ color: 'white', fontSize: isMobile ? 24 : 32, fontWeight: 700 }}>{strikeRate}</div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>Success Rate</div>
              <div style={{ color: 'white', fontSize: isMobile ? 24 : 32, fontWeight: 700 }}>{consistencyPercentage}%</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Render Logic ---

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #7f1d1d; overflow: hidden; }
        * { box-sizing: border-box; }
        .safe-area-padding {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', background: '#991b1b' }}>
          <div style={{ width: 50, height: 50, border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      ) : (
        <div
          className="stats-page-container safe-area-padding"
          style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          {/* PERSISTENT UI (Header, Arrows) - Placed here so they don't fade with cards */}
          {isMobile && (
            <div style={{ position: 'absolute', top: 'env(safe-area-inset-top)', left: 0, right: 0, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 10 }}>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>PLAYER STATS</div>
              {stats.length > 1 && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={prevPlayer} disabled={isTransitioning} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
                  <button onClick={nextPlayer} disabled={isTransitioning} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
                </div>
              )}
            </div>
          )}
          {!isMobile && stats.length > 1 && (
            <>
              <button onClick={prevPlayer} disabled={isTransitioning} style={{ position: 'fixed', left: 30, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', width: 50, height: 50, color: 'white', fontSize: 24, cursor: 'pointer', transition: 'background 0.3s' }}>←</button>
              <button onClick={nextPlayer} disabled={isTransitioning} style={{ position: 'fixed', right: 30, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', width: 50, height: 50, color: 'white', fontSize: 24, cursor: 'pointer', transition: 'background 0.3s' }}>→</button>
            </>
          )}

          {/* This wrapper holds the stacked, transitioning cards */}
          <div className="cards-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {stats.length > 0 ? stats.map((player, index) => (
              <div
                key={player._id || index} // Use a unique ID from your data if possible
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: index === currentPlayerIndex ? 1 : 0,
                  transform: `scale(${index === currentPlayerIndex ? 1 : 0.97})`,
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: index === currentPlayerIndex ? 'auto' : 'none',
                  // THIS IS THE KEY FIX: Allows vertical scrolling within each card
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <PlayerProfileCard player={player} />
              </div>
            )) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white', textAlign: 'center', padding: '20px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700 }}>No Statistics Available</h3>
                <p style={{ opacity: 0.8 }}>Player statistics will appear here once available.</p>
              </div>
            )}
          </div>

          {/* Navigation Dots */}
          {stats.length > 1 && (
            <div style={{ position: 'absolute', bottom: isMobile ? 20 : 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, zIndex: 10, paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {stats.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => changePlayer(idx)}
                  style={{ width: 10, height: 10, borderRadius: '50%', background: idx === currentPlayerIndex ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PlayerStats;