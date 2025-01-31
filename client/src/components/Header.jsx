// components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dateStore } from "../store/dateStore";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center bg-purple-200 text-black p-4 shadow-md">
      <h1 className="text-3xl font-bold">McOK Calendar</h1>
      <div className="flex items-center">
        <button
          className="btn btn-primary mr-2"
          onClick={() => dateStore.prevDay()}
        >
          &lt; Prev day
        </button>
        <button
          className="btn btn-primary ml-2"
          onClick={() => dateStore.nextDay()}
        >
          Next day &gt;
        </button>
        <button
          className="btn btn-secondary ml-4"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default Header;
