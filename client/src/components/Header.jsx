// components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-between items-center bg-purple-200 text-black p-4 shadow-md">
            <h1 className="text-3xl font-bold">McOK Calendar</h1>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
    );
}

export default Header;
