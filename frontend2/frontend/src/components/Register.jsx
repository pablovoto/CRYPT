import React, { useState } from 'react';
import AxiosInstance from './Axios';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Assuming handleSubmit is an async function
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log("Form submitted", data);
            const studentResponse = await AxiosInstance.post('users/', {
                username: data.username,
                password: data.password,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                is_active: true,
                is_staff: false,
                is_professor: false,
            });      

            if (studentResponse.status === 201) {
                console.log('Student and user created successfully');
                history.push('/home'); // Redirect to home page
              } else {
                console.log(studentResponse.data.detail);
              }
            } catch (error) {
                if (error.response) {
                    console.log('An error occurred:', error.response.data);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                First Name:
                <input
                    type="text"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Last Name:
                <input
                    type="text"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit">Register</button>
        </form>
    );
};

export default RegistrationForm;