import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTask } from '../../features/tasks/taskSlice';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const task = useSelector(state => state.tasks.tasks.find(t => t.id === id));
  const timeLogs = useSelector(state => state.time.timeLogs);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [editableTask, setEditableTask] = useState(task);
  const [note, setNote] = useState('');
  const [statusHistory, setStatusHistory] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(`history_${id}`));
    return saved || [];
  });

  useEffect(() => {
    if (!task) navigate('/dashboard');
  }, [task, navigate]);

  // 🔄 Track time by username for pie chart
  const timeByUser = timeLogs
    .filter(log => log.taskId === id)
    .reduce((acc, log) => {
      acc[log.username] = (acc[log.username] || 0) + log.duration;
      return acc;
    }, {});

  const pieData = Object.entries(timeByUser).map(([name, duration]) => ({
    name,
    value: duration,
  }));

  const handleUpdate = () => {
    if (task.status === 'Closed') {
      toast.warn("This task is locked. Already approved.");
      return;
    }
    dispatch(updateTask(editableTask));
    toast.success("Task updated!");
  };

  const handleDelete = () => {
    dispatch(deleteTask(id));
    toast.success("Task deleted!");
    navigate('/dashboard');
  };

  const saveHistory = (action, noteText) => {
    const newEntry = {
      date: new Date().toLocaleString(),
      status: editableTask.status,
      action,
      by: currentUser.username,
      note: noteText || '',
    };
    const updated = [newEntry, ...statusHistory];
    localStorage.setItem(`history_${id}`, JSON.stringify(updated));
    setStatusHistory(updated);
  };

  const handleApprove = () => {
    const updated = { ...editableTask, status: 'Closed' };
    dispatch(updateTask(updated));
    saveHistory('Approved', note);
    setNote('');
    toast.success("Task approved and locked!");
  };

  const handleReopen = () => {
    const updated = { ...editableTask, status: 'Open' };
    dispatch(updateTask(updated));
    saveHistory('Reopened', note);
    setNote('');
    toast.info("Task reopened!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-xl mt-6">
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4">Task Detail</h2>

      <div className="space-y-2 text-lg">
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Assignee:</strong> {task.assignee}</p>
      </div>

      {/* Edit + Delete (if not locked) */}
      {(currentUser.role === 'developer' || currentUser.role === 'manager') && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleUpdate}
            className={`px-4 py-2 rounded text-white ${
              task.status === 'Closed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={task.status === 'Closed'}
          >
            ✏️ Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            🗑 Delete
          </button>
        </div>
      )}

      {/* Manager Approval/Reopen Buttons */}
      {currentUser.role === 'manager' && task.status === 'Pending Approval' && (
        <div className="mt-6 space-y-3">
          <textarea
            placeholder="Add manager note (optional)"
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              ✅ Approve Bug Closure
            </button>
            <button
              onClick={handleReopen}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              🔄 Reopen Bug
            </button>
          </div>
        </div>
      )}

      {/* Manager: Time Logs + Chart + History */}
      {currentUser.role === 'manager' && (
        <>
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h3 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-300">
              🕒 Time Logged by Developers
            </h3>
            <timeLogs taskId={task.id} />

            {pieData.length === 0 ? (
              <p className="text-gray-500">No logs yet for this task.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
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

          {/* Status Change History */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-2">📜 Status Change History</h3>
            {statusHistory.length === 0 ? (
              <p className="text-gray-500">No status changes yet.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {statusHistory.map((entry, index) => (
                  <li key={index}>
                    {entry.date} - <strong>{entry.status}</strong> by {entry.by} ({entry.action})
                    {entry.note && <p className="text-sm italic text-gray-600 dark:text-gray-400">💬 {entry.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDetail;
