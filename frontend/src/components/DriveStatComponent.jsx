import { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Assuming you're using axios for API calls

function DriveStatComponent({ matchId, userId , name ,flag}) {
  const [stats, setStats] = useState({
    name: name,
    match: matchId,
    user: userId,
    total: 0,
    cross: 0,
    parallel: 0,
    cross_inverted: 0,
    parallel_inverted: 0,
  });

  const incrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] + 1,
      total_drives: stats.total_drives + 1,
    });
  };

  const decrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] - 1,
      total_drives: stats.total_drives - 1,
    });
  };

  useEffect(() => {
    if (flag) {
      saveStats();
    }
  } , [flag]);

  const saveStats = () => {
    AxiosInstance.post('drive_stat/', stats)
      .then(response => {
        console.log('Stats saved successfully:', response.data);
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
    <div>
      <div>Name: {stats.name}</div>
      <div>
        <b>Total Drives: {stats.total}</b>
        <button onClick={() => incrementField('total_drives')}>+</button>
        <button onClick={() => decrementField('total_drives')}>-</button>
      </div>
      <div>
        Cross: {stats.cross}
        <button onClick={() => incrementField('cross')}>+</button>
        <button onClick={() => decrementField('cross')}>-</button>
      </div>
      <div>
        Parallel: {stats.parallel}
        <button onClick={() => incrementField('parallel')}>+</button>
        <button onClick={() => decrementField('parallel')}>-</button>
      </div>
      <div>
        Cross Inverted: {stats.cross_inverted}
        <button onClick={() => incrementField('cross_inverted')}>+</button>
        <button onClick={() => decrementField('cross_inverted')}>-</button>
      </div>
      <div>
        Parallel Inverted: {stats.parallel_inverted}
        <button onClick={() => incrementField('parallel_inverted')}>+</button>
        <button onClick={() => decrementField('parallel_inverted')}>-</button>
      </div>
      
    </div>
  );
}

export default DriveStatComponent;