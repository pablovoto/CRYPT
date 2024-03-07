import { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Assuming you're using axios for API calls
import '../style/StatsElements.css';

function ServiceStatComponent({ matchId, userId , name ,flag}) {
  const [stats, setStats] = useState({
    name: name,
    match: matchId,
    user: userId,
    total_services: 0,
    to_the_t: 0,
    open: 0,
    middle: 0,
    ace: 0,
  });

  const incrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] + 1,
      total_services: stats.total_services + 1,
    });
  };

  const decrementField = (field) => {
    setStats({
      ...stats,
      [field]: stats[field] - 1,
      total_services: stats.total_services - 1,
    });
  };

  useEffect(() => {
    if (flag) {
      saveStats();
    }
  } , [flag]);

  const saveStats = () => {
    AxiosInstance.post(`/service_stat/`, stats)
      .then(response => {
        // console.log('Stats saved successfully:');
      })
      .catch(error => {
        console.error('Error saving stats:');
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
        Total Services: {stats.total_services}
        <button onClick={() => incrementField('total_services')}>+</button>
        <button onClick={() => decrementField('total_services')}>-</button>
      </div>
      <div className='stat-content'>
        To The T: {stats.to_the_t}
        <button onClick={() => incrementField('to_the_t')}>+</button>
        <button onClick={() => decrementField('to_the_t')}>-</button>
      </div>
      <div className='stat-content'>
        Open: {stats.open}
        <button onClick={() => incrementField('open')}>+</button>
        <button onClick={() => decrementField('open')}>-</button>
      </div>
      <div className='stat-content'>
        Middle: {stats.middle}
        <button onClick={() => incrementField('middle')}>+</button>
        <button onClick={() => decrementField('middle')}>-</button>
      </div>
      <div className='stat-content'>
        Ace: {stats.ace}
        <button onClick={() => incrementField('ace')}>+</button>
        <button onClick={() => decrementField('ace')}>-</button>
      </div>
    </div>
  );
}

export default ServiceStatComponent;