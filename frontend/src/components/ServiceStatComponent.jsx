import { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Assuming you're using axios for API calls

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
    AxiosInstance.put(`/service_stat/`, stats)
      .then(response => {
        console.log('Stats saved successfully:', response.data);
      })
      .catch(error => {
        console.error('Error saving stats:', error);
      });
  };

  if (!stats) {
    return null;
  }

  return (
    <div>
      <div>Name: {stats.name}</div>
      <div>
        Total Services: {stats.total_services}
        <button onClick={() => incrementField('total_services')}>+</button>
        <button onClick={() => decrementField('total_services')}>-</button>
      </div>
      <div>
        To The T: {stats.to_the_t}
        <button onClick={() => incrementField('to_the_t')}>+</button>
        <button onClick={() => decrementField('to_the_t')}>-</button>
      </div>
      <div>
        Open: {stats.open}
        <button onClick={() => incrementField('open')}>+</button>
        <button onClick={() => decrementField('open')}>-</button>
      </div>
      <div>
        Middle: {stats.middle}
        <button onClick={() => incrementField('middle')}>+</button>
        <button onClick={() => decrementField('middle')}>-</button>
      </div>
      <div>
        Ace: {stats.ace}
        <button onClick={() => incrementField('ace')}>+</button>
        <button onClick={() => decrementField('ace')}>-</button>
      </div>
    </div>
  );
}

export default ServiceStatComponent;