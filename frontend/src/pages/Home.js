import React, { useState } from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active styles
import styled, { createGlobalStyle } from "styled-components";

// --- GLOBAL STYLES ---
// Best practice for setting base font-family and resets
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F9FAFB; // A light grey background for better contrast
    color: #1F2937; // Dark grey for text
  }
`;

// --- THEME & COLOR PALETTE ---
const theme = {
  colors: {
    primary: "#D92626", // A strong, vibrant red
    primaryDark: "#B91C1C", // Darker red for hover
    white: "#FFFFFF",
    text: "#1F2937", // Near-black for main text
    textSecondary: "#6B7280", // Grey for secondary text
    background: "#F9FAFB",
    border: "#E5E7EB",
  },
  shadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  borderRadius: "8px",
};

// --- STYLED COMPONENTS ---

const PageWrapper = styled.div`
  min-height: 100vh;
`;

// --- Header & Navigation ---
const Header = styled.header`
  background-color: ${theme.colors.white};
  box-shadow: ${theme.shadow};
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  padding: 0 1.5rem;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin: 0;
`;

const DesktopNav = styled.nav`
  display: none;
  gap: 1rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.5rem;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  position: relative;
  transition: color 0.2s ease-in-out;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background-color: ${theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${theme.colors.text};
  }

  &.active {
    color: ${theme.colors.primary};
    font-weight: 600;
    &:after {
      width: 100%;
    }
  }
`;

const MobileMenuToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1001;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.primary};
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  ${({ isOpen }) => isOpen && `
    span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  `}

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background-color: ${theme.colors.white};
  padding: 1rem 1.5rem 2rem;
  box-shadow: ${theme.shadow};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-120%)'};
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

// --- Hero Section ---
const HeroSection = styled.section`
  background-color: ${theme.colors.white};
  text-align: center;
  padding: 4rem 1.5rem 5rem;
`;

const HeroContent = styled.div`
  max-width: 768px;
  margin: 0 auto;
`;

const HeroTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  color: ${theme.colors.text};
  margin-bottom: 1.5rem;

  span {
    color: ${theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled(NavLink)`
  padding: 0.875rem 2rem;
  border-radius: ${theme.borderRadius};
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: ${theme.colors.white};
  color: ${theme.colors.primary};
  border-color: ${theme.colors.border};

  &:hover {
    border-color: ${theme.colors.primary};
  }
`;


// --- Features Section ---
const FeaturesSection = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${theme.colors.background};
`;

const FeaturesContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 2.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius};
  padding: 2rem;
  box-shadow: ${theme.shadow};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIconWrapper = styled.div`
  margin: 0 auto 1.5rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #FEE2E2; // Light red background
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
`;

const FeatureTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

// --- Footer ---
const Footer = styled.footer`
  background-color: ${theme.colors.white};
  padding: 3rem 1.5rem;
  border-top: 1px solid ${theme.colors.border};
`;

const FooterContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
  color: ${theme.colors.textSecondary};
`;

const FooterText = styled.p`
  margin: 1rem 0;
  font-size: 0.875rem;
`;

// --- The Main Component ---
const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Reusable NavLinks array
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/view-runs", label: "Runs" },
    { to: "/view-wickets", label: "Wickets" },
    { to: "/wicket-analysis", label: "Wicket Analysis" },
    { to: "/stats", label: "Batting Stats" },
    { to: "/analyst", label: "Analysis" },
    { to: "/live-match", label: "Live Match" },
  ];

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        {/* Navbar */}
        <Header>
          <NavContainer>
            <LogoLink to="/" onClick={closeMenu}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 13.5L18 12L16.5 10.5M18 12H6M19.9997 12C19.9997 16.9706 15.9703 21 10.9997 21C6.02918 21 1.99976 16.9706 1.99976 12C1.99976 7.02944 6.02918 3 10.9997 3C15.9703 3 19.9997 7.02944 19.9997 12Z" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <LogoText>FrontyardCricket</LogoText>
            </LogoLink>

            <DesktopNav>
              {navLinks.map(link => (
                <StyledNavLink key={link.to} to={link.to} end>{link.label}</StyledNavLink>
              ))}
            </DesktopNav>

            <MobileMenuToggle isOpen={menuOpen} onClick={toggleMenu}>
              <span />
              <span />
              <span />
            </MobileMenuToggle>
          </NavContainer>
        </Header>
        
        {/* Mobile Menu (conditionally rendered) */}
        <MobileMenu isOpen={menuOpen}>
          {navLinks.map(link => (
             <StyledNavLink key={link.to} to={link.to} onClick={closeMenu} end>{link.label}</StyledNavLink>
          ))}
        </MobileMenu>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              Your Ultimate <span>Cricket</span> Companion
            </HeroTitle>
            <HeroSubtitle>
              Track every run, wicket, and match statistic with unparalleled ease. Welcome to the future of cricket analysis.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/stats">View Statistics</PrimaryButton>
              <SecondaryButton to="/add-runs">Add New Entry</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <FeaturesContainer>
            <SectionTitle>Everything You Need, All in One Place</SectionTitle>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIconWrapper>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16"/></svg>
                </FeatureIconWrapper>
                <FeatureTitle>Live Score Tracking</FeatureTitle>
                <FeatureDescription>Record runs and wickets in real-time with an intuitive and fast interface.</FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIconWrapper>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                </FeatureIconWrapper>
                <FeatureTitle>In-Depth Analysis</FeatureTitle>
                <FeatureDescription>Visualize player performance, match trends, and historical data with powerful charts.</FeatureDescription>
              </FeatureCard>
              <FeatureCard>
                <FeatureIconWrapper>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </FeatureIconWrapper>
                <FeatureTitle>Player Management</FeatureTitle>
                <FeatureDescription>Create player profiles, track career stats, and compare performances across your team.</FeatureDescription>
              </FeatureCard>
            </FeaturesGrid>
          </FeaturesContainer>
        </FeaturesSection>
        
        {/* Footer */}
        <Footer>
          <FooterContainer>
            <LogoLink to="/" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
              <LogoText>FrontyardCricket</LogoText>
            </LogoLink>
            <FooterText>© {new Date().getFullYear()} FrontyardCricket. All rights reserved.</FooterText>
          </FooterContainer>
        </Footer>
      </PageWrapper>
    </>
  );
};

export default Home;