import { useState, useEffect } from 'react';
import axios from 'axios';
import DriveStatComponent from './DriveStatComponent';
import TennisScoreComponent from './TennisScoreComponent';
import ServiceStatComponent from './ServiceStatComponent';
import Type2StatComponent from './Type2StatComponent';

function MatchStats2() {
  const [matchId, setMatchId] = useState(null);
  const driveNames =['winners', 'unforced_errors', 'forced_errors',  'points_won', 'points_lost', 'swing'];  
  const serviceNames = ['first_serve', 'second_serve'];
  const type2Names = ['backhandwinners', 'backhand_unforced_errors', 'backhand_forced_errors',  'backhand_points_won', 'backhand_points_lost', 'smash_won','smash_lost', 'volley_won','volley_lost', 'dropshot_won' , 'dropshot_lost'];
  const [flag, setFlag] = useState(false);
  const handleButtonClick = () => {
    if (window.confirm('Are you sure you want to activate the flag?')) {
      setFlag(true);
    }
  };
  const [students, setStudents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  // Fetch students when the component mounts
  useEffect(() => {
    axios.get('students/')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  // Create a new match when the component mounts
  useEffect(() => {
    if (selectedUserId) {
      axios.post('/matches/', { 
        user: selectedUserId,
        sets_won: 0,
        games_won: 0,
        points_won: 0
        })
        .then(response => {
          setMatchId(response.data.matchId);
        })
        .catch(error => {
          console.error('Error creating match:', error);
        });
    }
  }, [selectedUserId]);

  if (!matchId) {
    return null; // Or some loading indicator
  }

  return (
    <div>
      <select value={selectedUserId} onChange={handleChange}>
      <option value="">Select a student</option>
      {students.map((student) => (
        <option key={student.id} value={student.id}>
          {student.name}
        </option>
      ))}
    </select>
      <TennisScoreComponent matchId={matchId} />
      {driveNames.map(name => (
        <DriveStatComponent key={name} matchId={matchId} playerId={selectedUserId} name={name} flag={flag}/>
      ))}
      {type2Names.map(name => (
        <Type2StatComponent key={name} matchId={matchId} playerId={selectedUserId} name={name} flag={flag}/>
      ))}
      {serviceNames.map(name => ( 
        <ServiceStatComponent key={name} matchId={matchId} playerId={selectedUserId} name={name} flag={flag}/>
      ))}
      <button onClick={handleButtonClick}>Activate Flag</button>
    </div>
  );
}

export default MatchStats2;