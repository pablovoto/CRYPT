// import React from 'react';

// const Home = () => {
//     return (
//         <div style={{ textAlign: 'center' }}>
//             <h1>Welcome to Our Website, BITCH!</h1>
//             <p>This is a simple landing page.</p>
//             <button onClick={() => alert('Button clicked!')}>Login</button>
//             <button onClick={() => alert('Button clicked!')}>Login</button>
//         </div>
//     );
// };

// export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function HomePage() {
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount(prevCount => prevCount + 1);
  }, []);
  return (
    <>
      <h1>Home Page</h1>
      <h2>Renderizado: {renderCount} veces</h2>
      <Link to="/login">
        <button>LogIn</button>
      </Link>
    </>
  );
}

export default HomePage;