import { useState, useEffect } from 'react';
import axios from 'axios';

function UserStats() {
  const userId = localStorage.getItem('userId');
  const [driveStats, setDriveStats] = useState([]);
  const [type2Stats, setType2Stats] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);

  // Fetch the stats when the component mounts
  useEffect(() => {
    axios.all([
      axios.get(`/api/user/${userId}/drivestats`),
      axios.get(`/api/user/${userId}/type2stats`),
      axios.get(`/api/user/${userId}/servicestats`)
    ])
    .then(axios.spread((driveRes, type2Res, serviceRes) => {
      setDriveStats(driveRes.data);
      setType2Stats(type2Res.data);
      setServiceStats(serviceRes.data);
    }))
    .catch(error => {
      console.error('Error fetching stats:', error);
    });
  }, [userId]);

  // Aggregate stats from all matches
  const aggregateStats = (stats) => {
    return stats.reduce((acc, stat) => {
      const { name, match, user, ...statFields } = stat;
  
      if (!acc[name]) {
        acc[name] = {};
      }
  
      Object.keys(statFields).forEach(fieldName => {
        acc[name][fieldName] = (acc[name][fieldName] || 0) + statFields[fieldName];
      });
  
      return acc;
    }, {});
  };

  const driveNames =['winners', 'unforced_errors', 'forced_errors',  'points_won', 'points_lost', 'swing'];	
  const serviceNames = ['first_serve', 'second_serve'];
  const type2Names = ['backhandwinners', 'backhand_unforced_errors', 'backhand_forced_errors',  'backhand_points_won', 'backhand_points_lost', 'smash_won','smash_lost', 'volley_won','volley_lost', 'dropshot_won' , 'dropshot_lost'];

  const aggregateDriveStats = aggregateStats(driveStats);
  const aggregateType2Stats = aggregateStats(type2Stats);
  const aggregateServiceStats = aggregateStats(serviceStats);
  return (
    <div>
        <h2>Drive Stats</h2>
        <table>
        <thead>
            <tr>
            <th>Stat Name</th>
            {Object.keys(aggregateDriveStats[driveNames[0]] || {}).map(fieldName => (
                <th key={fieldName}>{fieldName}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {driveNames.map(name => (
            <tr key={name}>
                <td>{name}</td>
                {Object.values(aggregateDriveStats[name] || {}).map((value, index) => (
                <td key={index}>{value}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>

        <h2>Type2 Stats</h2>
        <table>
        <thead>
            <tr>
            <th>Stat Name</th>
            {Object.keys(aggregateType2Stats[type2Names[0]] || {}).map(fieldName => (
                <th key={fieldName}>{fieldName}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {type2Names.map(name => (
            <tr key={name}>
                <td>{name}</td>
                {Object.values(aggregateType2Stats[name] || {}).map((value, index) => (
                <td key={index}>{value}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>

        <h2>Service Stats</h2> 
        <table>
        <thead>
            <tr>
            <th>Stat Name</th>
            {Object.keys(aggregateServiceStats[serviceNames[0]] || {}).map(fieldName => (
                <th key={fieldName}>{fieldName}</th>
            ))}
            </tr>
        </thead>
        <tbody>
            {serviceNames.map(name => (
            <tr key={name}>
                <td>{name}</td>
                {Object.values(aggregateServiceStats[name] || {}).map((value, index) => (
                <td key={index}>{value}</td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}


export default UserStats;