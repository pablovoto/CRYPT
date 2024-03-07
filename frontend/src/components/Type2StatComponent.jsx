import { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Assuming you're using axios for API calls
import '../style/StatsElements.css';
 
function Type2StatComponent({ matchId, userId, name , flag}) {
  const [stats, setStats] = useState({
    name: name,
    match: matchId,
    user: userId,
    total: 0,
    cross: 0,
    parallel: 0,
  });

  const incrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] + 1,
    });
  };

  const decrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] - 1,
    });
  };

  useEffect (() => {
    if (flag) {
      saveStats();
    }
  }, [flag]);

  const saveStats = () => {
    AxiosInstance.post(`type2_stat/`, stats)
      .then(response => {
        // console.log('Stats saved successfully:');
      })
      .catch(error => {
        console.error('Error saving stats:', error);
        console.log(stats);
      });
  };

  if (!stats) {
    return null;
  }

  return (
    
      <div className='stat-element'>
        <span className='title-text'>{stats.name.replace(/_/g, " ")}</span>
      <div className='stat-content'>
        Total: {stats.total}
        <button onClick={() => incrementField('total')}>+</button>
        <button onClick={() => decrementField('total')}>-</button>
      </div>
      <div className='stat-content'>
        Cross: {stats.cross}
        <button onClick={() => incrementField('cross')}>+</button>
        <button onClick={() => decrementField('cross')}>-</button>
      </div>
      <div className='stat-content'>
        Parallel: {stats.parallel}
        <button onClick={() => incrementField('parallel')}>+</button>
        <button onClick={() => decrementField('parallel')}>-</button>
      </div>
    </div>
  );
}

export default Type2StatComponent;