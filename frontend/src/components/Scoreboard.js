import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import styled, { keyframes, css } from 'styled-components';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Layout Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
  padding: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  @media (min-width: 768px) {
    margin-bottom: 48px;
  }
`;

const MainTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
  
  @media (min-width: 768px) {
    font-size: 3rem;
    margin-bottom: 12px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ScoreSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${slideIn} 0.6s ease-out;
`;

// Card Components
const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const LiveCard = styled(Card)`
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #fef7f7 100%);
  border: 2px solid #dc2626;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #dc2626, #ef4444, #dc2626);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
  }
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${pulse} 2s infinite;
  z-index: 10;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    animation: ${pulse} 1.5s infinite;
  }
`;

const CardContent = styled.div`
  padding: 24px;
  
  @media (min-width: 768px) {
    padding: 32px;
  }
`;

// Match Info Components
const MatchHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding-right: 100px;
  
  @media (max-width: 767px) {
    padding-right: 0;
    margin-bottom: 60px;
  }
`;

const MatchTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  
  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
`;

const MatchStatus = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

// Score Display
const ScoreDisplay = styled.div`
  text-align: center;
  background: linear-gradient(135deg, #fef7f7 0%, #ffffff 100%);
  border: 2px solid #fecaca;
  border-radius: 16px;
  padding: 32px 24px;
  margin: 24px 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }
`;

const MainScore = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 4rem;
    margin-bottom: 20px;
  }
`;

const ScoreInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
    gap: 48px;
  }
`;

// Player Info Grid
const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 32px 0;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PlayerCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.1);
  }
`;

const PlayerLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const PlayerName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  word-break: break-word;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

// Current Over
const CurrentOver = styled.div`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  font-family: 'JetBrains Mono', 'Monaco', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  letter-spacing: 1px;
  margin-top: 24px;
  
  @media (min-width: 768px) {
    font-size: 1.125rem;
    padding: 24px;
  }
`;

// Stats Components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
`;

const StatsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 24px 0;
  text-align: center;
  position: relative;
  padding-bottom: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #dc2626, #ef4444);
    border-radius: 2px;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Table Components
const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHead = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const TableHeader = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 700;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  
  &:first-child {
    border-top-left-radius: 12px;
  }
  
  &:last-child {
    border-top-right-radius: 12px;
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: #f8fafc;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #f1f5f9;
    }
  }
`;

const TableCell = styled.td`
  padding: 16px 12px;
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
  
  &.player-name {
    font-weight: 700;
    color: #1a1a1a;
  }
  
  &.status {
    font-style: italic;
    color: #64748b;
  }
  
  &.number {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }
`;

// Status Components
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 48px 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f1f5f9;
  border-radius: 50%;
  border-top-color: #dc2626;
  animation: ${spin} 1s linear infinite;
  margin-right: 16px;
`;

const LoadingText = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #64748b;
`;

const ErrorContainer = styled(StatusContainer)`
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
  border: 2px solid #fecaca;
  color: #b91c1c;
`;

// Summary Components
const SummaryHeader = styled.div`
  text-align: center;
  padding: 32px 24px;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 32px;
`;

const SummaryTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  letter-spacing: -0.025em;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
`;

const SummaryScore = styled.div`
  font-size: 1.125rem;
  color: #64748b;
  margin: 8px 0;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin: 12px 0;
  }
`;

const SummaryResult = styled.div`
  font-size: 1.25rem;
  color: #dc2626;
  font-weight: 700;
  margin-top: 16px;
  padding: 12px 24px;
  background: #fef7f7;
  border: 1px solid #fecaca;
  border-radius: 8px;
  display: inline-block;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    padding: 16px 32px;
    margin-top: 20px;
  }
`;

// Components
const StatsTable = ({ stats, type = 'batting' }) => {
  if (!stats || stats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b', fontStyle: 'italic' }}>
        No {type} statistics available
      </div>
    );
  }

  if (type === 'batting') {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Batsman</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>R</TableHeader>
              <TableHeader>B</TableHeader>
              <TableHeader>4s/6s</TableHeader>
              <TableHeader>SR</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {stats.map((player, index) => (
              <tr key={index}>
                <TableCell className="player-name">{player.playerName}</TableCell>
                <TableCell className="status">{player.out ? 'Out' : 'Not Out'}</TableCell>
                <TableCell className="number">{player.runs}</TableCell>
                <TableCell className="number">{player.balls}</TableCell>
                <TableCell className="number">{player.boundaries}</TableCell>
                <TableCell className="number">{player.strikeRate}</TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Bowler</TableHeader>
            <TableHeader>O</TableHeader>
            <TableHeader>R</TableHeader>
            <TableHeader>W</TableHeader>
            <TableHeader>Econ</TableHeader>
          </tr>
        </TableHead>
        <TableBody>
          {stats.map((player, index) => (
            <tr key={index}>
              <TableCell className="player-name">{player.playerName}</TableCell>
              <TableCell className="number">{player.overs}</TableCell>
              <TableCell className="number">{player.runs}</TableCell>
              <TableCell className="number">{player.wickets}</TableCell>
              <TableCell className="number">{player.economy}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const LiveScoreboardView = ({ matchData }) => (
  <ScoreSection>
    <LiveCard>
      {!matchData.matchFinished && <LiveBadge>LIVE</LiveBadge>}
      <CardContent>
        <MatchHeader>
          <MatchTitle>{matchData.matchStatus || 'Match In Progress'}</MatchTitle>
          <MatchStatus>International Cricket Championship</MatchStatus>
        </MatchHeader>
        
        <ScoreDisplay>
          <MainScore>{matchData.score || '0/0'}</MainScore>
          <ScoreInfo>
            <span>{matchData.overs || 'Overs: 0.0/0'}</span>
            <span>{matchData.runRate || 'Run Rate: 0.00'}</span>
          </ScoreInfo>
        </ScoreDisplay>

        {matchData.leadTrail && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            color: '#1d4ed8',
            padding: '16px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            fontSize: '1.125rem',
            fontWeight: '600',
            margin: '24px 0',
            border: '1px solid #bfdbfe'
          }}>
            {matchData.leadTrail}
          </div>
        )}

        <PlayersGrid>
          <PlayerCard>
            <PlayerLabel>Batsman 1</PlayerLabel>
            <PlayerName>{matchData.batsman1 || 'N/A'}</PlayerName>
          </PlayerCard>
          <PlayerCard>
            <PlayerLabel>Batsman 2</PlayerLabel>
            <PlayerName>{matchData.batsman2 || 'N/A'}</PlayerName>
          </PlayerCard>
          <PlayerCard>
            <PlayerLabel>Current Bowler</PlayerLabel>
            <PlayerName>{matchData.bowler || 'N/A'}</PlayerName>
          </PlayerCard>
        </PlayersGrid>

        <CurrentOver>
          {matchData.currentOver || 'This Over: - - - - - -'}
        </CurrentOver>
      </CardContent>
    </LiveCard>

    <StatsGrid>
      <StatsCard>
        <CardContent>
          <StatsTitle>{matchData.battingCardTitle || 'Batting Performance'}</StatsTitle>
          <StatsTable stats={matchData.battingStats} type="batting" />
        </CardContent>
      </StatsCard>
      <StatsCard>
        <CardContent>
          <StatsTitle>{matchData.bowlingCardTitle || 'Bowling Figures'}</StatsTitle>
          <StatsTable stats={matchData.bowlingStats} type="bowling" />
        </CardContent>
      </StatsCard>
    </StatsGrid>
  </ScoreSection>
);

const OversMatchSummaryView = ({ summary }) => (
  <ScoreSection>
    <Card>
      <SummaryHeader>
        <SummaryTitle>{summary.title}</SummaryTitle>
        <SummaryScore>{summary.teamAScore}</SummaryScore>
        <SummaryScore>{summary.teamBScore}</SummaryScore>
        <SummaryResult>{summary.result}</SummaryResult>
      </SummaryHeader>
      <CardContent>
        <StatsGrid>
          <StatsCard>
            <CardContent>
              <StatsTitle>Team A Batting</StatsTitle>
              <StatsTable stats={summary.teamAStats?.batting} type="batting" />
            </CardContent>
          </StatsCard>
          <StatsCard>
            <CardContent>
              <StatsTitle>Team A Bowling</StatsTitle>
              <StatsTable stats={summary.teamAStats?.bowling} type="bowling" />
            </CardContent>
          </StatsCard>
          <StatsCard>
            <CardContent>
              <StatsTitle>Team B Batting</StatsTitle>
              <StatsTable stats={summary.teamBStats?.batting} type="batting" />
            </CardContent>
          </StatsCard>
          <StatsCard>
            <CardContent>
              <StatsTitle>Team B Bowling</StatsTitle>
              <StatsTable stats={summary.teamBStats?.bowling} type="bowling" />
            </CardContent>
          </StatsCard>
        </StatsGrid>
      </CardContent>
    </Card>
  </ScoreSection>
);

const TestMatchSummaryView = ({ summary }) => (
  <ScoreSection>
    <Card>
      <SummaryHeader>
        <SummaryTitle>{summary.title}</SummaryTitle>
        <SummaryScore>{summary.teamAScores}</SummaryScore>
        <SummaryScore>{summary.teamBScores}</SummaryScore>
        <SummaryResult>{summary.result}</SummaryResult>
      </SummaryHeader>
      <CardContent>
        {summary.innings?.map((inning, index) => (
          <Card key={index} style={{ marginBottom: '32px' }}>
            <CardContent>
              <StatsTitle>{inning.title} - {inning.score}</StatsTitle>
              <StatsGrid>
                <div>
                  <h4 style={{ marginBottom: '16px', color: '#374151', fontWeight: '600' }}>Batting</h4>
                  <StatsTable stats={inning.battingStats} type="batting" />
                </div>
                <div>
                  <h4 style={{ marginBottom: '16px', color: '#374151', fontWeight: '600' }}>Bowling</h4>
                  <StatsTable stats={inning.bowlingStats} type="bowling" />
                </div>
              </StatsGrid>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  </ScoreSection>
);

const Scoreboard = ({ matchId }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      setError(null);
      return;
    }

    setMatchData(null);
    setLoading(true);
    setError(null);

    const docRef = doc(db, 'matches', matchId);
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setMatchData(doc.data());
          setError(null);
        } else {
          setError(`Match with ID: ${matchId} not found.`);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firebase listener error:", err);
        setError("Failed to connect to live data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [matchId]);

  if (loading) {
    return (
      <Container>
        <StatusContainer>
          <LoadingSpinner />
          <LoadingText>Loading Match Details...</LoadingText>
        </StatusContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>Connection Error</h3>
            <p style={{ margin: 0, fontSize: '1rem' }}>{error}</p>
          </div>
        </ErrorContainer>
      </Container>
    );
  }

  if (!matchData) {
    return null;
  }

  const renderContent = () => {
    if (matchData.matchFinished) {
      if (!matchData.summary) {
        return (
          <StatusContainer>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#64748b' }}>Match Completed</h3>
              <p style={{ margin: 0, fontSize: '1rem', color: '#64748b' }}>Summary not available yet</p>
            </div>
          </StatusContainer>
        );
      }
      
      if (matchData.matchType === 'test') {
        return <TestMatchSummaryView summary={matchData.summary} />;
      }
      
      return <OversMatchSummaryView summary={matchData.summary} />;
    }
    
    return <LiveScoreboardView matchData={matchData} />;
  };

  return (
    <Container>
      <Header>
        <MainTitle>Live Cricket</MainTitle>
        <Subtitle>International Championship Series</Subtitle>
      </Header>
      {renderContent()}
    </Container>
  );
};

export default Scoreboard;