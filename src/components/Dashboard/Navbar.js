/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Task Tracker</h1>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/analytics" className="hover:underline">Analytics</Link>
        <button
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
          onClick={() => {
            onLogout();
            navigate('/');
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
