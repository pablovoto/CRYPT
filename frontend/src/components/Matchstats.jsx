import { useState, useEffect } from 'react';
import AxiosInstance from './Axios';
import DriveStatComponent from './DriveStatComponent';
import TennisScoreComponent from './TennisScoreComponent';
import ServiceStatComponent from './ServiceStatComponent';
import Type2StatComponent from './Type2StatComponent';
import '../style/Matchstat.css';



function MatchStats() {
  const [matchId, setMatchId] = useState(null);
  const userId =Number(localStorage.getItem('student_id')) ;
  const driveNames =['winners', 'unforced_errors', 'forced_errors',  'points_won', 'points_lost', 'swing'];	
  const serviceNames = ['first_serve', 'second_serve'];
  const type2Names = ['backhandwinners', 'backhand_unforced_errors', 'backhand_forced_errors',  'backhand_points_won', 'backhand_points_lost', 'smash_won','smash_lost', 'volley_won','volley_lost', 'dropshot_won' , 'dropshot_lost'];
  const [flag, setFlag] = useState(false);
  
  const handleButtonClick = () => {
    if (window.confirm('Are you sure you want to activate the flag?')) {
      setFlag(true);
      wait (5000);
      setFlag(false); 
    }
  };

  // Create a new match when the component mounts
  useEffect(() => {
    AxiosInstance.post('matches/', { 
      user: userId,
      sets_won: 0,
      games_won: 0,
      points_won: 0
      })
      .then(response => {
        console.log('Match created:', response.data);
        setMatchId(Number(response.data.id));
      })
      .catch(error => {
        console.error('Error creating match:', error);
      });
  }, [userId]);
  
  if (!matchId) {
    return null; // Or some loading indicator
  }

  return (
    <div className='main'>
      <div className='score'>
        <TennisScoreComponent matchId={matchId} flag={flag} userId={userId} />
      </div>
      <div className='stats'>
      <div className='type-stats'>
        {driveNames.map(name => (
          <DriveStatComponent key={name} matchId={matchId} userId={userId} name={name} flag={flag}/>
        ))}
      </div>
      <div className='type-stats'>
        {type2Names.map(name => (
          <Type2StatComponent key={name} matchId={matchId} userId={userId} name={name} flag={flag}/>
        ))}
      </div>
      <div className='type-stats'>
        {serviceNames.map(name => ( 
          <ServiceStatComponent key={name} matchId={matchId} userId={userId} name={name} flag={flag}/>
        ))}
    </div> 
    </div>
    
      <button className='flag-btn'onClick={handleButtonClick}>Activate Flag</button> 
    </div>
    
  );
}

export default MatchStats;