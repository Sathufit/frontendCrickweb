import React, { useEffect, useState } from 'react';
import { fetchMatches } from './api';

const MatchStats = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetchMatches().then(data => setMatches(data));
    }, []);

    return (
        <div>
            <h2>Match Stats</h2>
            <table>
                <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>Venue</th>
                        <th>Runs</th>
                        <th>Innings</th>
                        <th>Outs</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match, index) => (
                        <tr key={index}>
                            <td>{match.playerName}</td>
                            <td>{match.venue}</td>
                            <td>{match.runs}</td>
                            <td>{match.innings}</td>
                            <td>{match.outs}</td>
                            <td>{new Date(match.date).toDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MatchStats;
