import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// --- GLOBAL STYLES & FONT IMPORTS ---
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Lato:wght@400;700&display=swap');

  body {
    margin: 0;
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F8F9FA;
    color: #212529;
    overflow-x: hidden;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }
`;

// --- THEME & COLOR PALETTE ---
const theme = {
  colors: {
    primary: "#C8102E",
    primaryDark: "#A10D25",
    primaryLight: "#E8394B",
    white: "#FFFFFF",
    dark: "#212529",
    grey: "#6C757D",
    lightGrey: "#F8F9FA",
    border: "#DEE2E6",
    accent: "#FFD700",
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Lato', sans-serif",
  },
  shadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  shadowHover: "0 15px 35px rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
};

// --- ENHANCED ANIMATIONS ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(200, 16, 46, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(200, 16, 46, 0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const heroBackgroundMove = keyframes`
  0%, 100% {
    background-position: center 0%;
  }
  50% {
    background-position: center 10%;
  }
`;

// --- STYLED COMPONENTS ---
const PageWrapper = styled.div`
  background-color: ${theme.colors.lightGrey};
  position: relative;
`;

// --- Enhanced Header & Navigation ---
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 2rem;
  height: 80px;
  background-color: ${({ $scrolled }) => $scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${({ $scrolled }) => $scrolled ? theme.shadow : 'none'};
  transition: all 0.3s ease-in-out;
  border-bottom: ${({ $scrolled }) => $scrolled ? `1px solid ${theme.colors.border}` : 'none'};

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const NavContainer = styled.div`
  max-width: 1320px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  animation: ${slideInLeft} 0.8s ease-out;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(10deg);
  }
`;

const LogoText = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 1.75rem;
  font-weight: 800;
  color: ${theme.colors.primary};
  margin: 0;
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DesktopNav = styled.nav`
  display: flex;
  gap: 1.5rem;
  animation: ${slideInRight} 0.8s ease-out;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-family: ${theme.fonts.body};
  font-weight: 700;
  color: ${theme.colors.dark};
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(200, 16, 46, 0.1), transparent);
    transition: left 0.5s;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.primary};
    transform: translateY(-2px);
    
    &:before {
      left: 100%;
    }
  }

  &.active {
    color: ${theme.colors.primary};
    &:after {
      width: 100%;
    }
  }
`;

const MobileMenuToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  display: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  @media (max-width: 992px) {
    display: block;
  }

  &:hover {
    background-color: rgba(200, 16, 46, 0.1);
  }
  
  div {
    width: 25px;
    height: 3px;
    background-color: ${theme.colors.primary};
    margin: 5px 0;
    transition: 0.4s;
    border-radius: 2px;
  }

  ${({ isOpen }) => isOpen && `
    div:nth-child(1) { transform: rotate(-45deg) translate(-5px, 6px); }
    div:nth-child(2) { opacity: 0; }
    div:nth-child(3) { transform: rotate(45deg) translate(-5px, -6px); }
  `}
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 250, 0.95));
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 999; /* FIX: Added z-index to ensure menu appears over page content */

  ${StyledNavLink} {
    font-size: 1.5rem;
    animation: ${({ $isOpen }) => $isOpen ? fadeIn : 'none'} 0.6s ease-out;
    animation-delay: ${(_, index) => index * 0.1}s;
    animation-fill-mode: backwards;
  }
`;

// --- Enhanced Hero Section ---
const HeroSection = styled.section`
  height: 70vh;
  min-height: 500px;
  background-image: linear-gradient(rgba(200, 16, 46, 0.7), rgba(161, 13, 37, 0.8)), url('https://images.unsplash.com/photo-1599446340913-91b343339121?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${theme.colors.white};
  padding: 2rem;
  position: relative;
  overflow: hidden;
  animation: ${heroBackgroundMove} 20s ease-in-out infinite;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeIn} 1.2s ease-out;
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  background: linear-gradient(45deg, #ffffff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${bounce} 2s ease-in-out 1s;
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
  animation: ${fadeIn} 1.5s ease-out 0.5s backwards;
`;

const HeroButton = styled(NavLink)`
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  background: linear-gradient(45deg, ${theme.colors.white}, #f8f9fa);
  color: ${theme.colors.primary};
  transition: all 0.3s ease;
  box-shadow: ${theme.shadow};
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  animation: ${pulse} 2s infinite;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: ${theme.shadowHover};
    
    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

// --- Enhanced Content Section ---
const ContentSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100px;
    background: linear-gradient(to bottom, ${theme.colors.primary}, transparent);
  }
`;

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: ${theme.colors.dark};
  position: relative;
  animation: ${scaleIn} 0.8s ease-out;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
    margin: 1rem auto 0;
    border-radius: 2px;
    animation: ${fadeIn} 1s ease-out 0.5s backwards;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

// --- Enhanced Statistics Section ---
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  animation: ${fadeIn} 1s ease-out forwards;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, ${theme.colors.white} 0%, #f8f9fa 100%);
  border-radius: ${theme.borderRadius};
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: ${theme.shadow};
  border-top: 5px solid ${theme.colors.primary};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: ${(_, index) => index * 0.2}s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight}, ${theme.colors.accent});
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }

  &:after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(200, 16, 46, 0.05) 0%, transparent 70%);
    transform: scale(0);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: ${theme.shadowHover};
    border-top-color: ${theme.colors.accent};

    &:after {
      transform: scale(1);
    }
  }

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.3s;
  }
  &:nth-child(3) {
    animation-delay: 0.5s;
  }
`;

const StatValue = styled.p`
  font-family: ${theme.fonts.heading};
  font-size: 4rem;
  font-weight: 800;
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const StatLabel = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.2rem;
  color: ${theme.colors.grey};
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: ${theme.colors.primary};
    border-radius: 1px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${StatCard}:hover & {
    color: ${theme.colors.dark};
    
    &:after {
      opacity: 1;
    }
  }
`;

// --- Enhanced CTA Section ---
const CtaSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.dark} 0%, #1a1d20 100%);
  color: ${theme.colors.white};
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 20% 80%, rgba(200, 16, 46, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
`;

const CtaTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, ${theme.colors.white}, ${theme.colors.lightGrey});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${scaleIn} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  opacity: 0.9;
  animation: ${fadeIn} 1s ease-out 0.3s backwards;
`;

const CtaButton = styled(NavLink)`
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.primaryLight});
  color: ${theme.colors.white};
  transition: all 0.3s ease;
  box-shadow: ${theme.shadow};
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  animation: ${bounce} 2s ease-in-out 1s;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: ${theme.shadowHover};
    
    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: scale(1.05);
  }
`;

// --- Enhanced Footer ---
const Footer = styled.footer`
  background: linear-gradient(135deg, ${theme.colors.dark} 0%, #1a1d20 100%);
  color: ${theme.colors.lightGrey};
  padding: 4rem 2rem 2rem;
  border-top: 1px solid #444;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent);
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeIn} 1s ease-out;
`;

const FooterText = styled.p`
  margin-top: 3rem;
  font-size: 0.9rem;
  color: ${theme.colors.grey};
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

// --- Loading Animation ---
const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const LoadingText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.2rem;
  color: ${theme.colors.grey};
  margin-bottom: 2rem;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.colors.border};
  border-radius: 50%;
  border-top-color: ${theme.colors.primary};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// --- The Main Component ---
const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clubStats, setClubStats] = useState({ totalRuns: 0, totalInnings: 0, totalWickets: 0 });
  const [loading, setLoading] = useState(true);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // FIX: Lock body scroll when mobile menu is open for better UX
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset the style when the component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  // Fetch club data on component mount
  useEffect(() => {
    const fetchClubData = async () => {
      setLoading(true);
      try {
        // MOCK data for demonstration
        await new Promise(res => setTimeout(res, 2000)); 
        
        const mockApiResponse = {
          totalRuns: 12457,
          totalInnings: 312,
          totalWickets: 289,
        };
        
        setClubStats(mockApiResponse);

      } catch (error) {
        console.error("Failed to fetch club stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/view-runs", label: "Runs" },
    { to: "/view-wickets", label: "Wickets" },
    { to: "/wicket-analysis", label: "Wicket Analysis" },
    { to: "/stats", label: "Batting Stats" },
    { to: "/analyst", label: "Analysis" },
    { to: "/scoreboard", label: "Live Match" },
  ];

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        {/* Navbar */}
        <Header scrolled={scrolled}>
          <NavContainer>
            <LogoLink to="/" onClick={closeMenu}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill={theme.colors.primary}>
                <path d="M3 21h18v-2H3v2zM6 18h2V6H6v12zm5 0h2V6h-2v12zm5 0h2V6h-2v12z"/>
              </svg>
              <LogoText>Frontyard CC</LogoText>
            </LogoLink>

            <DesktopNav>
              {navLinks.map(link => (
                <StyledNavLink key={link.to} to={link.to} end>{link.label}</StyledNavLink>
              ))}
            </DesktopNav>

            <MobileMenuToggle $isOpen={menuOpen} onClick={toggleMenu}>
              <div /><div /><div />
            </MobileMenuToggle>
          </NavContainer>
        </Header>
        
        <MobileMenu $isOpen={menuOpen}>
          {navLinks.map((link, index) => (
             <StyledNavLink 
               key={link.to} 
               to={link.to} 
               onClick={closeMenu} 
               end
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               {link.label}
             </StyledNavLink>
          ))}
        </MobileMenu>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>FRONTYARD CRICKET CLUB</HeroTitle>
            <HeroSubtitle>Passion. Pride. Performance. Welcome to the home of your favorite club.</HeroSubtitle>
            <HeroButton to="/scoreboard">View Live Match</HeroButton>
          </HeroContent>
        </HeroSection>

        {/* Club Statistics Section */}
        <ContentSection>
          <SectionTitle>Club At a Glance</SectionTitle>
          {loading ? (
            <LoadingContainer>
              <LoadingText>Loading Club Statistics...</LoadingText>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <StatGrid>
              <StatCard>
                <StatValue>{clubStats.totalRuns.toLocaleString()}</StatValue>
                <StatLabel>Total Runs Scored</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{clubStats.totalInnings.toLocaleString()}</StatValue>
                <StatLabel>Innings Batted</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{clubStats.totalWickets.toLocaleString()}</StatValue>
                <StatLabel>Total Wickets Taken</StatLabel>
              </StatCard>
            </StatGrid>
          )}
        </ContentSection>

        {/* Join The Club CTA Section */}
        <CtaSection>
          <CtaContent>
            <CtaTitle>Join The Frontyard Family</CtaTitle>
            <CtaText>
              Whether you're a seasoned player, a junior starting your journey, or a fan wanting to support local sport, there's a place for you at Frontyard CC.
            </CtaText>
            <CtaButton to="/join">Become a Member</CtaButton>
          </CtaContent>
        </CtaSection>
        
        {/* Footer */}
        <Footer>
          <FooterContainer>
            <LogoLink to="/" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
               <svg width="40" height="40" viewBox="0 0 24 24" fill={theme.colors.white}>
                 <path d="M3 21h18v-2H3v2zM6 18h2V6H6v12zm5 0h2V6h-2v12zm5 0h2V6h-2v12z"/>
               </svg>
               <LogoText style={{ color: theme.colors.white }}>Frontyard CC</LogoText>
            </LogoLink>
            
            <FooterText>
              © 2024 Frontyard Cricket Club. All rights reserved. | Passion • Pride • Performance
            </FooterText>
          </FooterContainer>
        </Footer>
      </PageWrapper>
    </>
  );
};

export default Home;