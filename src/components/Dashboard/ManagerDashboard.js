import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  deleteTask,
  approveTask,
  reopenTask,
} from '../../features/tasks/taskSlice';
import TaskTrendChart from '../Charts/TaskTrendChart';
import TimeLogger from '../UI/TimeLogger';


const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Open',
    createdBy: 'Manager',
  });

  const [comment, setComment] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    dispatch(addTask(formData));
    setFormData({
      title: '',
      description: '',
      priority: 'Low',
      status: 'Open',
      createdBy: 'Manager',
    });
  };

  const handleApprove = (task) => {
    dispatch(
      approveTask({
        id: task.id,
        manager: user?.username || 'Manager',
        comment,
      })
    );
    setComment('');
  };

  const handleReopen = (task) => {
    dispatch(
      reopenTask({
        id: task.id,
        manager: user?.username || 'Manager',
        comment,
      })
    );
    setComment('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      {/* === Task Add Form === */}
      <form onSubmit={handleAddTask} className="mb-6 grid gap-2">
        <input
          type="text"
          placeholder="Title"
          className="border p-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="border p-2"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <select
          className="border p-2"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Add Task
        </button>
      </form>

      {/* === Task List === */}
      <div>
        <h2 className="text-xl font-semibold mb-2">All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task, index) => (
              <li key={task.id} className="border rounded p-4">
                <div className="font-bold">{index + 1}. {task.title}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {task.description}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Priority:</span> {task.priority} |{' '}
                  <span className="font-semibold">Status:</span> {task.status} |{' '}
                  <span className="font-semibold">Created:</span> {task.createdAt}
                </div>

                <div className="mt-2 space-x-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => dispatch(deleteTask(task.id))}
                  >
                    🗑️ Delete
                  </button>
                  <button className="bg-gray-400 text-white px-3 py-1 rounded">
                    ✏️ Edit
                  </button>

                  {/* ✅ Manager Approve/Reopen Actions */}
                  {task.status === 'Pending Approval' && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        placeholder="Add approval/reopen comment (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      />
                      <div className="space-x-2">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleApprove(task)}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                          onClick={() => handleReopen(task)}
                        >
                          ♻️ Reopen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* === Analytics Section === */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">📊 Task Trend Chart</h2>
        <TaskTrendChart />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">⏱ Time Tracker</h2>
        <TimeLogger />
      </div>
    </div>
  );
};

export default ManagerDashboard;
