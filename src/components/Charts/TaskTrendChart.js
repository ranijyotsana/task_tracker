import React from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const TaskTrendChart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const tasks = useSelector((state) => state.tasks.tasks);

  // Filter tasks based on role
  const filteredTasks =
    user.role === 'manager'
      ? tasks
      : tasks.filter((task) => task.assignee === user.username);

  // Group tasks by created date
  const groupedByDate = filteredTasks.reduce((acc, task) => {
    const date = dayjs(task.createdAt).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Convert to array for chart
  const chartData = Object.entries(groupedByDate).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-4">
        📈 Task Trend Over Time
      </h2>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No task data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskTrendChart;
