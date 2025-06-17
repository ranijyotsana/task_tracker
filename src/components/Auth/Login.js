import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Hardcoded users list
  const users = [
    { username: 'manager1', password: 'manager123', role: 'manager' },
    { username: 'dev1', password: 'dev123', role: 'developer' },
    { username: 'dev2', password: 'dev456', role: 'developer' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');

      // 🔁 Role-based redirect
      if (user.role === 'manager') {
        navigate('/manager-dashboard'); // You must define this route
      } else {
        navigate('/dashboard'); // Developer dashboard
      }
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-purple-300">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
