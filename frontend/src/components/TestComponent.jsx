import { List } from '@mui/material';
import React, { useState } from 'react';

const RegistrationForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Submit the form
        // Your code here to handle form submission
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* <h2>Registration Form</h2> */}
            {errorMessage && <p>{errorMessage}</p>}
            
            <form onSubmit={handleSubmit} 
                style={{
                    // top:0,
                    // margin:'auto',
                    flex: 1 }}>
                <div>
                    <label htmlFor="firstName">First Name:</label>
                    <input className='form-control' 
                        style={{margin: 'auto',
                        backgroundColor: 'lightblue'}}
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name:</label>
                    <input className='form-control' 
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
                </form>
                <div
                style={{
                    // display: 'flex',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // height: '100vh',
                    backgroundColor: 'lightblue',
                    // top:0,
                    // left:0,
                    // right:0,
                    // bottom:0,
                    // margin:'auto',
                    flex: 1
                }}>
                    <ul>
                        <List>
                            <li>
                                <a href="/login">Already have an account? Login</a>
                            </li>
                        </List>
                    </ul>
                </div>
            
        </div>
    );
};

export default RegistrationForm;
