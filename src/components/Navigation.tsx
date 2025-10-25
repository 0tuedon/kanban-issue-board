import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => (
    <nav className="main-navigation" aria-label="Main navigation">
        <Link to="/board" className="nav-link">Board</Link>
        <Link to="/settings" className="nav-link">Settings</Link>
    </nav>
);