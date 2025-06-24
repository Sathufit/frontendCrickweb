// src/components/MatchList.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import styled from 'styled-components';

const ListContainer = styled.div`
  margin-top: 32px;
`;

const Title = styled.h2`
  color: #1e293b;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 24px;
`;

const MatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const MatchCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const MatchStatus = styled.h3`
  margin: 0 0 8px 0;
  color: #111827;
  font-size: 1.1rem;
`;

const MatchResult = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1d4ed8;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #475569;
`;

const MatchList = ({ onMatchSelect }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastMatches = async () => {
      try {
        const q = query(
          collection(db, "matches"), 
          where("matchFinished", "==", true), 
          orderBy("lastUpdated", "desc")
        );
        const querySnapshot = await getDocs(q);
        const matchesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMatches(matchesList);
      } catch (err) {
        console.error("Error fetching past matches:", err);
        setError("Could not load past matches.");
      } finally {
        setLoading(false);
      }
    };
    fetchPastMatches();
  }, []);

  if (loading) return <ListContainer><LoadingText>Loading Past Matches...</LoadingText></ListContainer>;
  if (error) return <ListContainer><p>{error}</p></ListContainer>;

  return (
    <ListContainer>
      <Title>Past Match Results</Title>
      {matches.length > 0 ? (
        <MatchGrid>
          {matches.map(match => (
            <MatchCard key={match.id} onClick={() => onMatchSelect(match.id)}>
              <MatchStatus>{match.matchStatus}</MatchStatus>
              <MatchResult>{match.leadTrail}</MatchResult>
            </MatchCard>
          ))}
        </MatchGrid>
      ) : (
        <p>No past matches found.</p>
      )}
    </ListContainer>
  );
};

export default MatchList;