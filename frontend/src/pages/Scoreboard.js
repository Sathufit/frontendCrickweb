import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import styled, { keyframes } from 'styled-components';

// --- (1) STYLED COMPONENTS (Reused across all views) ---
const spin = keyframes` to { transform: rotate(360deg); } `;
const blink = keyframes` 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } `;
const ScoreboardWrapper = styled.div` max-width: 1200px; margin: 0 auto 32px auto; display: grid; gap: 24px; `;
const Card = styled.div` background: #ffffff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.03); position: relative; overflow: hidden; `;
const MainScoreCard = styled(Card)` background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); `;
const LiveIndicator = styled.div` position: absolute; top: 16px; right: 16px; display: flex; align-items: center; gap: 8px; background: #dc2626; color: white; padding: 6px 12px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; &::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #fef2f2; animation: ${blink} 1.5s ease-in-out infinite; } `;
const MatchTitle = styled.h1` font-size: 1.5rem; font-weight: 700; margin: 0 0 16px 0; color: #111827; line-height: 1.3; padding-right: 90px; `;
const ScoreDisplay = styled.div` text-align: center; padding: 24px; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca; `;
const ScoreText = styled.p` font-size: 3.5rem; font-weight: 800; margin: 0; line-height: 1; color: #dc2626; `;
const InfoRow = styled.div` display: flex; justify-content: space-around; margin-top: 12px; font-size: 1rem; color: #6b7280; font-weight: 500; `;
const MatchInfoSection = styled.div` background: #eff6ff; color: #1d4ed8; padding: 16px; border-radius: 12px; text-align: center; font-size: 1.125rem; font-weight: 600; margin: 24px 0; border: 1px solid #dbeafe; `;
const PlayerGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-bottom: 24px; `;
const PlayerCard = styled.div` background: #f8fafc; padding: 12px 16px; border-radius: 10px; border: 1px solid #e2e8f0; `;
const PlayerLabel = styled.p` font-size: 0.75rem; color: #6b7280; margin: 0 0 4px 0; font-weight: 600; text-transform: uppercase; `;
const PlayerInfoText = styled.p` font-size: 1rem; font-weight: 600; margin: 0; color: #1e293b; word-break: break-word; `;
const CurrentOverSection = styled.div` background: #e2e8f0; padding: 12px; border-radius: 10px; text-align: center; font-family: 'Fira Code', 'Courier New', monospace; font-size: 1rem; font-weight: 500; color: #374151; letter-spacing: 2px; word-break: break-all; `;
const StatsGrid = styled.div` display: grid; grid-template-columns: 1fr; gap: 24px; @media (min-width: 1024px) { grid-template-columns: repeat(2, 1fr); } `;
const CardTitle = styled.h3` font-size: 1.25rem; font-weight: 700; margin: 0 0 16px 0; color: #111827; text-align: center; position: relative; padding-bottom: 8px; &::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 3px; background: #dc2626; border-radius: 2px; } `;
const TableWrapper = styled.div` overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 12px; &::-webkit-scrollbar { height: 6px; } &::-webkit-scrollbar-track { background: #f1f5f9; } &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; } `;
const StyledTable = styled.table` width: 100%; border-collapse: collapse; min-width: 500px; `;
const THead = styled.thead` background: #f8fafc; `;
const TH = styled.th` padding: 12px 16px; text-align: left; font-weight: 600; color: #475569; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; white-space: nowrap; `;
const TBody = styled.tbody` tr:not(:last-child) { border-bottom: 1px solid #f1f5f9; } `;
const TD = styled.td` padding: 12px 16px; color: #374151; font-weight: 500; font-size: 0.9rem; &.player-name { font-weight: 600; color: #1e293b; } &.status { font-style: italic; color: #6b7280; } `;
const NoDataCell = styled.td` text-align: center; font-style: italic; color: #94a3b8; padding: 24px; `;
const StatusContainer = styled.div` display: flex; align-items: center; justify-content: center; min-height: 20vh; font-size: 1.125rem; font-weight: 600; color: #475569; background: white; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); `;
const LoadingSpinner = styled.div` width: 24px; height: 24px; border: 3px solid #e2e8f0; border-radius: 50%; border-top-color: #dc2626; animation: ${spin} 1s linear infinite; margin-right: 12px; `;
const ErrorMessage = styled(StatusContainer)` background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; `;
const SummaryHeader = styled.div` text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e2e8f0; `;
const SummaryTitle = styled.h1` font-size: 2rem; color: #111827; margin: 0 0 12px 0; `;
const SummaryScore = styled.p` font-size: 1.25rem; color: #475569; margin: 4px 0; font-weight: 500; `;
const SummaryResult = styled.h2` font-size: 1.5rem; color: #1d4ed8; margin: 16px 0 0 0;`;

// --- (2) REUSABLE & VIEW-SPECIFIC COMPONENTS ---

// Generic Stats Table to avoid repetition
const StatsTable = ({ stats, type = 'batting' }) => {
    if (!stats || stats.length === 0) {
        return <p style={{textAlign: 'center', fontStyle: 'italic', color: '#6b7280'}}>No {type} stats available.</p>;
    }
    
    if (type === 'batting') {
        return (
            <TableWrapper><StyledTable><THead><tr><TH>Batsman</TH><TH>Status</TH><TH>R</TH><TH>B</TH><TH>4s/6s</TH><TH>SR</TH></tr></THead><TBody>{stats.map((p, i) => (<tr key={i}><TD className="player-name">{p.playerName}</TD><TD className="status">{p.out ? 'Out' : 'Not Out'}</TD><TD>{p.runs}</TD><TD>{p.balls}</TD><TD>{p.boundaries}</TD><TD>{p.strikeRate}</TD></tr>))}</TBody></StyledTable></TableWrapper>
        );
    }

    return (
        <TableWrapper><StyledTable><THead><tr><TH>Bowler</TH><TH>O</TH><TH>R</TH><TH>W</TH><TH>Econ</TH></tr></THead><TBody>{stats.map((p, i) => (<tr key={i}><TD className="player-name">{p.playerName}</TD><TD>{p.overs}</TD><TD>{p.runs}</TD><TD>{p.wickets}</TD><TD>{p.economy}</TD></tr>))}</TBody></StyledTable></TableWrapper>
    );
};

// View for LIVE Matches
const LiveScoreboardView = ({ matchData }) => (
  <>
    <MainScoreCard>
      {!matchData.matchFinished && <LiveIndicator>LIVE</LiveIndicator>}
      <MatchTitle>{matchData.matchStatus || 'Match In Progress'}</MatchTitle>
      <ScoreDisplay>
        <ScoreText>{matchData.score || '0/0'}</ScoreText>
        <InfoRow>
          <span>{matchData.overs || 'Overs: 0.0/0'}</span>
          <span>{matchData.runRate || 'Run Rate: 0.00'}</span>
        </InfoRow>
      </ScoreDisplay>
      {matchData.leadTrail && <MatchInfoSection>{matchData.leadTrail}</MatchInfoSection>}
      <PlayerGrid>
        <PlayerCard><PlayerLabel>Batsman 1</PlayerLabel><PlayerInfoText>{matchData.batsman1 || 'N/A'}</PlayerInfoText></PlayerCard>
        <PlayerCard><PlayerLabel>Batsman 2</PlayerLabel><PlayerInfoText>{matchData.batsman2 || 'N/A'}</PlayerInfoText></PlayerCard>
        <PlayerCard><PlayerLabel>Current Bowler</PlayerLabel><PlayerInfoText>{matchData.bowler || 'N/A'}</PlayerInfoText></PlayerCard>
      </PlayerGrid>
      <CurrentOverSection>{matchData.currentOver || 'This Over:'}</CurrentOverSection>
    </MainScoreCard>
    <StatsGrid>
      <Card><CardTitle>{matchData.battingCardTitle || 'Batting'}</CardTitle><StatsTable stats={matchData.battingStats} type="batting" /></Card>
      <Card><CardTitle>{matchData.bowlingCardTitle || 'Bowling'}</CardTitle><StatsTable stats={matchData.bowlingStats} type="bowling" /></Card>
    </StatsGrid>
  </>
);

// View for Finished OVERS Matches
const OversMatchSummaryView = ({ summary }) => (
  <Card>
    <SummaryHeader>
      <SummaryTitle>{summary.title}</SummaryTitle>
      <SummaryScore>{summary.teamAScore}</SummaryScore>
      <SummaryScore>{summary.teamBScore}</SummaryScore>
      <SummaryResult>{summary.result}</SummaryResult>
    </SummaryHeader>
    <StatsGrid>
      <Card><CardTitle>Team A Batting</CardTitle><StatsTable stats={summary.teamAStats?.batting} type="batting" /></Card>
      <Card><CardTitle>Team A Bowling</CardTitle><StatsTable stats={summary.teamAStats?.bowling} type="bowling" /></Card>
      <Card><CardTitle>Team B Batting</CardTitle><StatsTable stats={summary.teamBStats?.batting} type="batting" /></Card>
      <Card><CardTitle>Team B Bowling</CardTitle><StatsTable stats={summary.teamBStats?.bowling} type="bowling" /></Card>
    </StatsGrid>
  </Card>
);

// View for Finished TEST Matches
const TestMatchSummaryView = ({ summary }) => (
    <Card>
        <SummaryHeader>
            <SummaryTitle>{summary.title}</SummaryTitle>
            <SummaryScore>{summary.teamAScores}</SummaryScore>
            <SummaryScore>{summary.teamBScores}</SummaryScore>
            <SummaryResult>{summary.result}</SummaryResult>
        </SummaryHeader>
        {summary.innings?.map((inning, index) => (
            <Card key={index} style={{marginBottom: '24px'}}>
                <CardTitle>{inning.title} - {inning.score}</CardTitle>
                <StatsGrid>
                    <StatsTable stats={inning.battingStats} type="batting" />
                    <StatsTable stats={inning.bowlingStats} type="bowling" />
                </StatsGrid>
            </Card>
        ))}
    </Card>
);

// --- (3) THE MAIN SCOREBOARD COMPONENT (The "Router") ---
const Scoreboard = ({ matchId }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!matchId) { setLoading(false); setError(null); return; }
    setMatchData(null); setLoading(true); setError(null);
    const docRef = doc(db, 'matches', matchId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setMatchData(doc.data()); setError(null);
      } else {
        setError(`Match with ID: ${matchId} not found.`);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firebase listener error:", err);
      setError("Failed to connect to live data.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [matchId]);

  if (loading) return <StatusContainer><LoadingSpinner />Loading Match Details...</StatusContainer>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!matchData) return null;

  // This is the core logic that decides which view to render.
  const renderContent = () => {
    if (matchData.matchFinished) {
      if (!matchData.summary) {
        return <StatusContainer>This match is finished, but a summary is not available.</StatusContainer>;
      }
      if (matchData.matchType === 'test') {
        return <TestMatchSummaryView summary={matchData.summary} />;
      }
      // Default to overs match summary if type is 'overs' or not specified
      return <OversMatchSummaryView summary={matchData.summary} />;
    }
    // If not finished, show the live view.
    return <LiveScoreboardView matchData={matchData} />;
  };

  return (
    <ScoreboardWrapper>
      {renderContent()}
    </ScoreboardWrapper>
  );
};

export default Scoreboard;