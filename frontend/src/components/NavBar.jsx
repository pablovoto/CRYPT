import React, { useCallback } from 'react';
import { useState, useEffect, useRef } from "react";
import {FaBars, FaTimes} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios';
import "../Style/NavBar.css";

function NavBar() {
    //this is a functional component
    //useState is a hook that allows you to have state variables in functional components
    const navRef = useRef();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const userId = Number(localStorage.getItem('user_id'));
    const userRole= localStorage.getItem('user_role');
    const navigate = useNavigate();

    const showNav = () => {
        navRef.current.classList.toggle("responsive_nav")
    };

    const handleLinkClick = (event) => {
        checkIfLoggedIn();
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    const checkIfLoggedIn = () => {
        if (userId) {
            setIsLoggedIn(true);
        }
    };

    const handleLogout = useCallback(async (event) => {
        event.preventDefault(); // Prevent the default action
        try {
            const response = await AxiosInstance.get('/logout/');
            if (response.status === 200) {
                console.log('Logged out');
                localStorage.removeItem('user_id');
                setIsLoggedIn(false); 
                navigate('/');
            } else {
                console.log('Logout failed with status:', response.status);
            }
        } catch (error) {
            console.error(error);
        }
    }, [navigate]);
    
      const changeOpenStatus = () => {
        setOpen(!open)
      }
    
    return (
        <header>
            <h3>LOGO</h3>
            <nav ref={navRef}>
                <a href="/">Home</a>
                {!isLoggedIn && <a href="/login" onClick={handleLinkClick}>Login</a>}
                {isLoggedIn && <a href="/profile" onClick={handleLinkClick}>Profile</a>}
                {!isLoggedIn && <a href="/register" onClick={handleLinkClick}>Register</a>}
                {isLoggedIn && <a href="/login" onClick={handleLogout} >Logout</a>}
                {isLoggedIn && <a href="/matchstats" onClick={handleLinkClick}>Stats</a>}
                <a href="/about">About</a>
                <a href="/catalog">Products</a>
                {isLoggedIn && <a href="/products" onClick={handleLinkClick}>Add Product</a>}
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