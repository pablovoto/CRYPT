import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/login/', {
                username_or_email: usernameOrEmail,
                password: password
            });

            if (response.status === 200) {
                // Handle successful login here
                console.log('Logged in');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    Username or Email:
                    <input type="text" value={usernameOrEmail} onChange={e => setUsernameOrEmail(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </label>
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
            <p>Don´t have an account? <Link to="/signup">Click here</Link> to sign up.</p>
        </div>
    );
};

export default Login;