import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('login/', {
        username_or_email: usernameOrEmail,
        password: password
      });
  
      if (response.data.success) {
        // Login successful, redirect or do something
        navigate.push('/userstats');
      } else {
        // Login failed, set error message
        setError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username or Email"
        value={usernameOrEmail}
        onChange={e => setUsernameOrEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;