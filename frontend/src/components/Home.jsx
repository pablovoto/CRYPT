import React from 'react';

const Home = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Welcome to Our Website!</h1>
            <p>This is a simple landing page.</p>
            <button onClick={() => alert('Button clicked!')}>Click me!</button>
        </div>
    );
};

export default Home;