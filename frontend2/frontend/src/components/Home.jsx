import React from 'react';
import { useState, useEffect } from 'react'
function HomePage() {
    const [renderCount, setRenderCount] = useState(0)
    const [count, setCount] = useState(0)
    
    const handleLogin = () => {
        setCount((count) => count + 1);
        console.log('Login button clickedede', count);
    };

    const handleRegister = () => {
        // Add your register functionality here
    };

    
    useEffect(() => {
        setRenderCount(prevCount => prevCount + 1);
      }, []);
    return (
        <div>
            <h1>Welcome to My Website</h1>
            <h2>Render count: {renderCount}</h2>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default HomePage;
