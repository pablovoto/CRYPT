import React from "react";
import { useState, useEffect, useRef } from "react";
import {FaBars, FaTimes} from "react-icons/fa";
import "../Style/NavBar.css";
function NavBar() {
    //this is a functional component
    //useState is a hook that allows you to have state variables in functional components
    const navRef = useRef();
    
    const showNav = () => {
        navRef.current.classList.toggle("responsive_nav")
    };
    
    return (
        <header>
            <h3>LOGO</h3>
            <nav ref={navRef}>
                <a href="/">Home</a>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
                <button className="nav-btn nav-cls-btn" onClick={showNav}>
                    <FaTimes /> 
                </button> 
            </nav>
            <button className="nav-btn" onClick={showNav}>      
                <FaBars />
            </button>
        </header>
    );
}
export default NavBar;