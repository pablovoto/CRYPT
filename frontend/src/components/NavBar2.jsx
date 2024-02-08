import React, { useState } from 'react';

const NavigationBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [renderCount, setRenderCount] = useState(0);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    React.useEffect(() => {
        setRenderCount(prevCount => prevCount + 1);
      });
    
    return (
        <div className={`navigation-bar ${isCollapsed ? 'collapsed' : ''}`}>
            <h1>Renderizado: {renderCount} veces</h1>
            <button className="toggle-button" onClick={toggleCollapse}>
                Toggle
            </button>
            <ul className="nav-links">
                <li>
                    <a href="/register">Register</a>
                </li>
                <li>
                    <a href="/home">Home</a>
                </li>
                <li>
                    <a href="/match-history">MatchHistory</a>
                </li>
            </ul>
        </div>
    );
};

export default NavigationBar;