import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff6384', '#36a2eb'];

const AnalyticsPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const timeLogs = useSelector(state => state.time.timeLogs);
  const tasks = useSelector(state => state.tasks.tasks);

  if (user.role !== 'manager') {
    return (
      <div className="p-6 text-center text-xl font-semibold text-red-600">
        🔒 Access Denied: Analytics are only visible to managers.
      </div>
    );
  }

  // 🔹 Time per User (Pie Chart)
  const timeByUser = timeLogs.reduce((acc, log) => {
    acc[log.username] = (acc[log.username] || 0) + log.duration;
    return acc;
  }, {});
  const pieData = Object.entries(timeByUser).map(([username, duration]) => ({
    name: username,
    value: duration,
  }));

  // 🔸 Time per Task (Bar Chart)
  const timeByTask = timeLogs.reduce((acc, log) => {
    const taskTitle = tasks.find(t => t.id === log.taskId)?.title || 'Unknown';
    acc[taskTitle] = (acc[taskTitle] || 0) + log.duration;
    return acc;
  }, {});
  const barData = Object.entries(timeByTask).map(([title, duration]) => ({
    title,
    duration,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6">📈 Analytics Dashboard</h2>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">🧑‍💻 Time Log Breakdown by User</h3>
        {pieData.length === 0 ? (
          <p className="text-gray-500">No time logs available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">📋 Total Time Spent per Task</h3>
        {barData.length === 0 ? (
          <p className="text-gray-500">No time logs to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
