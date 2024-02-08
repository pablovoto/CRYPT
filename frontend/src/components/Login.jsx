import React, { useState } from 'react';
import AxiosInstance from './Axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await AxiosInstance.post('login/', {
        username_or_email: usernameOrEmail,
        password: password
      });
  
      if (response.data.success) {
        // Login successful, redirect or do something
        localStorage.setItem('user_id', response.data.user_id);
        localStorage.setItem('user_role', response.data.user_role);
        localStorage.setItem('student_id', response.data.student_id);
        navigate('/');
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
    <div className='login-form '>
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
    </div>
  );
}

export default Login;