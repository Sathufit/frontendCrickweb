// src/pages/ScoreboardPage.js
import React, { useState } from 'react';
// THIS IS THE CORRECTED IMPORT PATH
import Scoreboard from '../components/Scoreboard';   // The component that shows a single match
import MatchList from '../components/MatchList';     // The component that shows past matches
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const HeaderSection = styled.header`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
  margin-bottom: 32px;
`;

const AppTitle = styled.h1`
  margin: 0 0 16px 0;
  color: #1e293b;
`;

const InputArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const MatchInput = styled.input`
  font-size: 1rem;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  min-width: 250px;
  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
`;

const ViewButton = styled.button`
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #dc2626;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #b91c1c;
  }
`;

function ScoreboardPage() {
  const [matchIdInput, setMatchIdInput] = useState('');
  const [activeMatchId, setActiveMatchId] = useState(null);

  const handleViewMatch = () => {
    if (matchIdInput.trim()) {
      setActiveMatchId(matchIdInput.trim());
    }
  };
  
  const handleSelectPastMatch = (id) => {
    setActiveMatchId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <HeaderSection>
        <AppTitle>Cricket Score Viewer</AppTitle>
        <InputArea>
          <MatchInput 
            type="text"
            placeholder="Enter Live Match ID"
            value={matchIdInput}
            onChange={(e) => setMatchIdInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleViewMatch()}
          />
          <ViewButton onClick={handleViewMatch}>View Match</ViewButton>
        </InputArea>
      </HeaderSection>

      {/* This will render the Scoreboard component ONLY when an ID is active */}
      {activeMatchId && <Scoreboard matchId={activeMatchId} />}
      
      {/* This renders the list of past matches, which can set the active ID */}
      <MatchList onMatchSelect={handleSelectPastMatch} />
    </PageContainer>
  );
}

export default ScoreboardPage;