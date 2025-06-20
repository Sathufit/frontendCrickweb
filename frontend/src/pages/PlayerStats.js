import React, { useEffect, useState } from "react";
import { fetchPlayerStats } from "../api";

const PlayerStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerStats();
  }, []);

  const loadPlayerStats = async () => {
    setLoading(true);
    try {
      const data = await fetchPlayerStats();
      console.log("📌 Fetched Player Stats (Frontend):", data);
      setStats(data);
    } catch (error) {
      console.error("❌ Error fetching player stats:", error);
    }
    setLoading(false);
  };

  const getPerformanceColor = (average) => {
    if (average >= 50) return '#10b981';
    if (average >= 35) return '#f59e0b';
    return '#ef4444';
  };

  const getPerformanceGrade = (average) => {
    if (average >= 45) return 'Excellent';
    if (average >= 25) return 'Good';
    if (average >= 10) return 'Average';
    return 'Needs Improvement';
  };

  const calculateStrikeRate = (runs, innings) => {
    return innings > 0 ? ((runs / innings) * 1.2).toFixed(1) : 0;
  };

  const CircularProgress = ({ percentage, color, size = 120 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">
            {percentage}
          </span>
          <span className="text-xs text-white opacity-70">
            %
          </span>
        </div>
      </div>
    );
  };

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextPlayer = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPlayerIndex((prev) => (prev + 1) % stats.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevPlayer = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPlayerIndex((prev) => (prev - 1 + stats.length) % stats.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Touch/Swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPlayer();
    } else if (isRightSwipe) {
      prevPlayer();
    }
  };

  const PlayerProfileCard = ({ player, index, isActive }) => {
    const average = player.average !== "N/A" ? Number(player.average) : 0;
    const strikeRate = calculateStrikeRate(player.totalRuns, player.totalInnings);
    const performancePercentage = Math.min((average / 100) * 100, 100);
    const consistencyPercentage = Math.min(((player.totalInnings - player.totalOuts) / player.totalInnings) * 100, 100);

    return (
      <div 
        className="full-page-card"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)',
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          opacity: isActive ? 1 : 0,
          transition: 'all 0.5s ease',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60%',
            height: '100%',
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none'
          }}
        />

        {/* Left Side - Player Image & Basic Info */}
        <div className="player-info-section" style={{ 
          flex: window.innerWidth <= 768 ? '0 0 auto' : '0 0 45%', 
          padding: window.innerWidth <= 768 ? '40px 20px 20px 20px' : '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'center',
          alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start',
          position: 'relative',
          zIndex: 2,
          textAlign: window.innerWidth <= 768 ? 'center' : 'left'
        }}>
          {/* Player Avatar */}
          <div 
            style={{
              width: window.innerWidth <= 768 ? '180px' : '280px',
              height: window.innerWidth <= 768 ? '180px' : '280px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: window.innerWidth <= 768 ? '24px' : '40px',
              fontSize: window.innerWidth <= 768 ? '48px' : '80px',
              fontWeight: 'bold',
              color: 'white',
              border: window.innerWidth <= 768 ? '6px solid rgba(255,255,255,0.2)' : '8px solid rgba(255,255,255,0.2)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Inner glow effect */}
            <div style={{
              position: 'absolute',
              inset: '20px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>
              {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>

          {/* Player Name */}
          <h1 style={{ 
            color: 'white', 
            fontSize: window.innerWidth <= 768 ? '32px' : '48px', 
            fontWeight: '800', 
            margin: '0 0 20px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            lineHeight: '1.1'
          }}>
            {player.name}
          </h1>

          {/* Performance Grade */}
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '12px 24px', 
            borderRadius: '25px',
            display: 'inline-block',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '40px'
          }}>
            <span style={{ 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {getPerformanceGrade(average)}
            </span>
          </div>

          {/* Quick Stats */}
          <div style={{ 
            display: 'flex', 
            gap: window.innerWidth <= 768 ? '20px' : '30px',
            marginTop: '20px',
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
            alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start'
          }}>
            <div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Total Innings
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 768 ? '24px' : '32px', 
                fontWeight: '700'
              }}>
                {player.totalInnings}
              </div>
            </div>
            
            <div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Total Outs
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 768 ? '24px' : '32px', 
                fontWeight: '700'
              }}>
                {player.totalOuts}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Statistics */}
        <div className="stats-section" style={{ 
          flex: window.innerWidth <= 768 ? '1' : '0 0 55%', 
          padding: window.innerWidth <= 768 ? '20px' : '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Main Stats Header */}
          <div style={{ 
            marginBottom: window.innerWidth <= 768 ? '30px' : '50px',
            textAlign: window.innerWidth <= 768 ? 'center' : 'left'
          }}>
            <div style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '18px', 
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '10px'
            }}>
              Career Statistics
            </div>
            <div style={{ 
              color: 'white', 
              fontSize: window.innerWidth <= 768 ? '42px' : '64px', 
              fontWeight: '800',
              lineHeight: '1'
            }}>
              {player.totalRuns.toLocaleString()}
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '18px', 
              fontWeight: '500',
              marginTop: '5px'
            }}>
              Total Runs Scored
            </div>
          </div>

          {/* Circular Progress Stats */}
          <div style={{ 
            display: 'flex', 
            gap: window.innerWidth <= 768 ? '30px' : '50px',
            marginBottom: window.innerWidth <= 768 ? '30px' : '50px',
            justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
            flexWrap: window.innerWidth <= 768 ? 'wrap' : 'nowrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <CircularProgress 
                percentage={Math.round(performancePercentage)} 
                color={getPerformanceColor(average)}
                size={window.innerWidth <= 768 ? 110 : 140}
              />
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '14px', 
                fontWeight: '600',
                marginTop: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Batting Average
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700',
                marginTop: '5px'
              }}>
                {player.average !== "N/A" ? Number(player.average).toFixed(1) : "N/A"}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <CircularProgress 
                percentage={Math.round(consistencyPercentage)} 
                color="#3b82f6"
                size={window.innerWidth <= 768 ? 110 : 140}
              />
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '14px', 
                fontWeight: '600',
                marginTop: '15px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Consistency
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '700',
                marginTop: '5px'
              }}>
                {Math.round(consistencyPercentage)}%
              </div>
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div style={{ 
            display: 'flex', 
            gap: window.innerWidth <= 768 ? '40px' : '60px',
            justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start',
            textAlign: window.innerWidth <= 768 ? 'center' : 'left'
          }}>
            <div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Strike Rate
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 768 ? '28px' : '36px', 
                fontWeight: '700'
              }}>
                {strikeRate}
              </div>
            </div>

            <div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '14px', 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Success Rate
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: window.innerWidth <= 768 ? '28px' : '36px', 
                fontWeight: '700'
              }}>
                {Math.round(((player.totalInnings - player.totalOuts) / player.totalInnings) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div style={{
          position: 'absolute',
          bottom: window.innerWidth <= 768 ? '20px' : '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 3
        }}>
          {stats.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: idx === index 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                transform: idx === index ? 'scale(1.2)' : 'scale(1)',
                boxShadow: idx === index 
                  ? '0 4px 12px rgba(255,255,255,0.4)' 
                  : 'none'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .full-page-card {
          animation: slideIn 0.8s ease-out;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .full-page-card {
            flex-direction: column !important;
            padding: 20px 0 !important;
          }
          
          .player-info-section {
            flex: 0 0 auto !important;
            padding: 40px 20px 20px 20px !important;
            text-align: center !important;
            align-items: center !important;
          }
          
          .stats-section {
            flex: 1 !important;
            padding: 20px !important;
            justify-content: flex-start !important;
          }

          .full-page-card {
            min-height: 100vh;
            overflow-y: auto;
          }
        }

        /* Tablet Responsive Styles */
        @media (max-width: 1024px) and (min-width: 769px) {
          .full-page-card {
            padding: 40px 20px;
          }
          
          .player-info-section {
            padding: 40px 20px !important;
          }
          
          .stats-section {
            padding: 40px 20px !important;
          }
        }

        /* Touch-friendly interactions */
        @media (max-width: 768px) {
          .full-page-card {
            touch-action: pan-y;
          }
        }
      `}</style>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ 
            marginTop: '24px', 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '500'
          }}>
            Loading player statistics...
          </p>
        </div>
      ) : stats.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h3 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            No Statistics Available
          </h3>
          <p style={{ 
            fontSize: '18px',
            opacity: 0.7
          }}>
            Player statistics will appear here once they are available.
          </p>
        </div>
      ) : (
        /* Player Profile Cards */
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={prevPlayer}
            disabled={isTransitioning}
            style={{
              position: 'fixed',
              left: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: window.innerWidth <= 768 ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isTransitioning ? 0.5 : 1,
              zIndex: 1000
            }}
          >
            ←
          </button>

          <button
            onClick={nextPlayer}
            disabled={isTransitioning}
            style={{
              position: 'fixed',
              right: '30px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: window.innerWidth <= 768 ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isTransitioning ? 0.5 : 1,
              zIndex: 1000
            }}
          >
            →
          </button>

          {/* Player Cards */}
          {stats.map((player, index) => (
            <div
              key={index}
              style={{
                position: index === 0 ? 'relative' : 'absolute',
                top: index === 0 ? 0 : 0,
                left: 0,
                width: '100%',
                height: '100vh',
                transition: 'all 0.5s ease',
                transform: `translateX(${(index - currentPlayerIndex) * 100}%)`,
                opacity: index === currentPlayerIndex ? 1 : 0,
                pointerEvents: index === currentPlayerIndex ? 'auto' : 'none'
              }}
            >
              <PlayerProfileCard 
                player={player} 
                index={index} 
                isActive={index === currentPlayerIndex}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PlayerStats;