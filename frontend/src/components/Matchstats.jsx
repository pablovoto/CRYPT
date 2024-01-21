import { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for API calls
import DriveStatComponent from './DriveStatComponent';
import TennisScoreComponent from './TennisScoreComponent';


function MatchStats({ matchId, userId, userToken }) {
  const [names, setNames] = useState([]);

  useEffect(() => {
    // Fetch the names of DriveStats here and set them in the state.
    axios.get('/api/drivestat/names')
      .then(response => {
        setNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching names:', error);
      });
  }, []);

  return (
    <div>
      {names.map(name => (
        <DriveStatComponent key={name} matchId={matchId} playerId={userId} name={name} />
      ))}
    </div>
  );
}

export default MatchStats;