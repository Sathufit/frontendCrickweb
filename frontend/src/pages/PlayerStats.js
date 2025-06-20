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
            stroke="rgba(220,38,38,0.2)"
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
          <span className="text-2xl font-bold text-red-600">
            {percentage}
          </span>
          <span className="text-xs text-red-500 opacity-70">
            %
          </span>
        </div>
      </div>
    );
  };

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextPlayer = () => {
    if (isTransitioning || stats.length <= 1) return;
    setIsTransitioning(true);
    setCurrentPlayerIndex((prev) => {
      const nextIndex = (prev + 1) % stats.length;
      console.log('Next player:', nextIndex, 'Total players:', stats.length);
      return nextIndex;
    });
    setTimeout(() => setIsTransitioning(false), 500); 
  };

  const prevPlayer = () => {
    if (isTransitioning || stats.length <= 1) return;
    setIsTransitioning(true);
    setCurrentPlayerIndex((prev) => {
      const prevIndex = (prev - 1 + stats.length) % stats.length;
      console.log('Previous player:', prevIndex, 'Total players:', stats.length);
      return prevIndex;
    });
    setTimeout(() => setIsTransitioning(false), 500);
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PlayerProfileCard = ({ player, index, isActive }) => {
    const average = player.average !== "N/A" ? Number(player.average) : 0;
    const strikeRate = calculateStrikeRate(player.totalRuns, player.totalInnings);
    const performancePercentage = Math.min((average / 100) * 100, 100);
    const consistencyPercentage = Math.min(((player.totalInnings - player.totalOuts) / player.totalInnings) * 100, 100);

    return (
      <div 
        className="full-page-card"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          transform: isActive ? 'scale(1)' : 'scale(0.95)',
          opacity: isActive ? 1 : 0,
          transition: 'all 0.5s ease',
          flexDirection: 'column'
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
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none'
          }}
        />

        {/* Mobile Header Bar */}
        <div style={{
          position: 'relative',
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? '80px' : '60px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 10,
          borderBottom: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{
            color: 'white',
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            PLAYER STATS
          </div>
          
          {/* Mobile Navigation Buttons */}
          {isMobile && stats.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button
                onClick={prevPlayer}
                disabled={isTransitioning}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isTransitioning ? 0.5 : 1,
                  backdropFilter: 'blur(10px)'
                }}
              >
                ←
              </button>
              
              <div style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                padding: '0 8px'
              }}>
                {currentPlayerIndex + 1} / {stats.length}
              </div>
              
              <button
                onClick={nextPlayer}
                disabled={isTransitioning}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isTransitioning ? 0.5 : 1,
                  backdropFilter: 'blur(10px)'
                }}
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Main Content Container */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden'
        }}>
          {/* Left Side - Player Image & Basic Info */}
          <div className="player-info-section" style={{ 
            flex: isMobile ? '0 0 auto' : '0 0 45%', 
            padding: isMobile ? '32px 24px' : '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            minHeight: isMobile ? 'auto' : '100%'
          }}>
            {/* Player Avatar */}
            <div 
              style={{
                width: isMobile ? '120px' : '280px',
                height: isMobile ? '120px' : '280px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e5e5e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: isMobile ? '20px' : '40px',
                fontSize: isMobile ? '32px' : '80px',
                fontWeight: 'bold',
                color: '#dc2626',
                border: isMobile ? '4px solid rgba(255,255,255,0.3)' : '8px solid rgba(255,255,255,0.3)',
                boxShadow: isMobile 
                  ? '0 15px 35px rgba(0,0,0,0.3)' 
                  : '0 30px 60px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Inner glow effect */}
              <div style={{
                position: 'absolute',
                inset: isMobile ? '15px' : '20px',
                borderRadius: '50%',
                background: 'rgba(220,38,38,0.1)',
                backdropFilter: 'blur(10px)'
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            {/* Player Name */}
            <h1 style={{ 
              color: 'white', 
              fontSize: isMobile ? '24px' : '48px', 
              fontWeight: '800', 
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              lineHeight: '1.1'
            }}>
              {player.name}
            </h1>

            {/* Performance Grade */}
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: isMobile ? '8px 16px' : '12px 24px', 
              borderRadius: '25px',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              marginBottom: isMobile ? '24px' : '40px'
            }}>
              <span style={{ 
                color: 'white', 
                fontSize: isMobile ? '12px' : '16px', 
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
              gap: isMobile ? '32px' : '30px',
              marginTop: isMobile ? '16px' : '20px',
              justifyContent: 'center'
            }}>
              <div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isMobile ? '11px' : '14px', 
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}>
                  Total Innings
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '18px' : '32px', 
                  fontWeight: '700'
                }}>
                  {player.totalInnings}
                </div>
              </div>
              
              <div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isMobile ? '11px' : '14px', 
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}>
                  Total Outs
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '18px' : '32px', 
                  fontWeight: '700'
                }}>
                  {player.totalOuts}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Statistics */}
          <div className="stats-section" style={{ 
            flex: isMobile ? '1' : '0 0 55%', 
            padding: isMobile ? '24px' : '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            paddingBottom: isMobile ? '40px' : '60px'
          }}>
            {/* Main Stats Header */}
            <div style={{ 
              marginBottom: isMobile ? '24px' : '50px',
              textAlign: 'center'
            }}>
              <div style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: isMobile ? '12px' : '18px', 
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px'
              }}>
                Career Statistics
              </div>
              <div style={{ 
                color: 'white', 
                fontSize: isMobile ? '28px' : '64px', 
                fontWeight: '800',
                lineHeight: '1'
              }}>
                {player.totalRuns.toLocaleString()}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: isMobile ? '12px' : '18px', 
                fontWeight: '500',
                marginTop: '4px'
              }}>
                Total Runs Scored
              </div>
            </div>

            {/* Circular Progress Stats */}
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '20px' : '50px',
              marginBottom: isMobile ? '24px' : '50px',
              justifyContent: 'center',
              flexWrap: 'nowrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <CircularProgress 
                  percentage={Math.round(performancePercentage)} 
                  color={getPerformanceColor(average)}
                  size={isMobile ? 80 : 140}
                />
                <div style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: isMobile ? '10px' : '14px', 
                  fontWeight: '600',
                  marginTop: isMobile ? '8px' : '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Batting Average
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '16px' : '24px', 
                  fontWeight: '700',
                  marginTop: '4px'
                }}>
                  {player.average !== "N/A" ? Number(player.average).toFixed(1) : "N/A"}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <CircularProgress 
                  percentage={Math.round(consistencyPercentage)} 
                  color="#ffffff"
                  size={isMobile ? 80 : 140}
                />
                <div style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  fontSize: isMobile ? '10px' : '14px', 
                  fontWeight: '600',
                  marginTop: isMobile ? '8px' : '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Consistency
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '16px' : '24px', 
                  fontWeight: '700',
                  marginTop: '4px'
                }}>
                  {Math.round(consistencyPercentage)}%
                </div>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div style={{ 
              display: 'flex', 
              gap: isMobile ? '32px' : '60px',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isMobile ? '11px' : '14px', 
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}>
                  Strike Rate
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '20px' : '36px', 
                  fontWeight: '700'
                }}>
                  {strikeRate}
                </div>
              </div>

              <div>
                <div style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isMobile ? '11px' : '14px', 
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px'
                }}>
                  Success Rate
                </div>
                <div style={{ 
                  color: 'white', 
                  fontSize: isMobile ? '20px' : '36px', 
                  fontWeight: '700'
                }}>
                  {Math.round(((player.totalInnings - player.totalOuts) / player.totalInnings) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '20px' : '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: isMobile ? '8px' : '12px',
          zIndex: 3
        }}>
          {stats.map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentPlayerIndex(idx);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              style={{
                width: isMobile ? '8px' : '12px',
                height: isMobile ? '8px' : '12px',
                borderRadius: '50%',
                background: idx === index 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                transform: idx === index ? 'scale(1.2)' : 'scale(1)',
                boxShadow: idx === index 
                  ? '0 4px 12px rgba(255,255,255,0.4)' 
                  : 'none',
                cursor: 'pointer'
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
          width: ${isMobile ? '50px' : '60px'};
          height: ${isMobile ? '50px' : '60px'};
          border: 4px solid rgba(255,255,255,0.3);
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .full-page-card {
          animation: slideIn 0.8s ease-out;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .full-page-card {
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .full-page-card {
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }
          
          .player-info-section {
            min-height: auto !important;
            padding: 24px !important;
          }
          
          .stats-section {
            padding: 16px 24px 40px 24px !important;
          }
        }

        /* Improved touch targets */
        @media (max-width: 768px) and (pointer: coarse) {
          .full-page-card {
            cursor: grab;
          }
          
          .full-page-card:active {
            cursor: grabbing;
          }
        }

        /* Handle notched devices */
        @supports (padding-top: env(safe-area-inset-top)) {
          @media (max-width: 768px) {
            .full-page-card {
              padding-top: env(safe-area-inset-top);
            }
          }
        }

        /* Landscape mobile optimization */
        @media (max-width: 768px) and (orientation: landscape) {
          .full-page-card > div:last-child {
            flex-direction: row !important;
          }
          
          .player-info-section {
            flex: 0 0 45% !important;
            padding: 20px !important;
          }
          
          .stats-section {
            flex: 0 0 55% !important;
            padding: 20px !important;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .full-page-card {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .full-page-card,
          .loading-spinner,
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
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
          minHeight: '100dvh',
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
          padding: '20px'
        }}>
          <div className="loading-spinner"></div>
          <p style={{ 
            marginTop: '24px', 
            fontSize: isMobile ? '16px' : '18px', 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
            textAlign: 'center'
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
          minHeight: '100dvh',
          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <h3 style={{ 
            fontSize: isMobile ? '24px' : '32px', 
            fontWeight: '700',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>
            No Statistics Available
          </h3>
          <p style={{ 
            fontSize: isMobile ? '16px' : '18px',
            opacity: 0.8,
            margin: 0
          }}>
            Player statistics will appear here once they are available.
          </p>
        </div>
      ) : (
        /* Player Profile Cards */
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows - Desktop only */}
          {!isMobile && (
            <>
              <button
                onClick={prevPlayer}
                disabled={isTransitioning}
                style={{
                  position: 'fixed',
                  left: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isTransitioning ? 0.5 : 1,
                  zIndex: 1000
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
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
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isTransitioning ? 0.5 : 1,
                  zIndex: 1000
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                →
              </button>
            </>
          )}

          {/* Player Counter - Desktop */}
          {!isMobile && stats.length > 1 && (
            <div style={{
              position: 'fixed',
              top: '30px',
              right: '30px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '25px',
              padding: '12px 20px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              zIndex: 1000
            }}>
              {currentPlayerIndex + 1} / {stats.length}
            </div>
          )}

          {/* Render current player */}
          {stats.map((player, index) => (
            <div
              key={index}
              style={{
                position: index === currentPlayerIndex ? 'relative' : 'absolute',
                top: index === currentPlayerIndex ? 0 : 0,
                left: 0,
                right: 0,
                zIndex: index === currentPlayerIndex ? 1 : 0,
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