/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import TaskTrendChart from './components/Charts/TaskTrendChart'; // Analytics
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard route */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
           path="/manager-dashboard"
           element={
           user?.role === 'manager' ? <ManagerDashboard /> : <Navigate to="/dashboard" />
            }
            />




        <Route
          path="/analytics"
          element={user ? <TaskTrendChart /> : <Navigate to="/" />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
