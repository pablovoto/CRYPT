import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
// import './App.css'

import Home from './components/Home'
import NavBar from './components/NavBar'
import Register from './components/Register'
function App() {
  const [count, setCount] = useState(0)
  const [renderCount, setRenderCount] = useState(0)
  useEffect(() => {
    setRenderCount(prevCount => prevCount + 1);
  }, []);
  return (
    <Router>
    <NavBar/> {/* This will always be rendered */}
    <Routes>
      <Route path="" element={<Home />} /> 
      <Route path="register" element={<Register />} />
      {/* This will only be rendered when the URL is "/" */}
      {/* Add more Route components here for other paths */}
    </Routes> 
  </Router>
  );
}


export default App
