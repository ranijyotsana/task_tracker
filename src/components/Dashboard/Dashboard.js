// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks, updateTask } from '../../features/tasks/taskSlice';
import TaskList from '../Tasks/TaskList';
import TaskFormModal from '../Tasks/TaskFormModal';
import TaskDetailModal from '../Tasks/TaskDetailModal';
import SearchFilterBar from '../Tasks/SearchFilterBar';
import Navbar from './Navbar';
import TimeLogger from '../UI/TimeLogger';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ toggleDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isManager = user.role === 'manager';
  const isDeveloper = user.role === 'developer';

  const { tasks, filter, sortBy, searchQuery } = useSelector((state) => state.tasks);

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [task, setTask] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignee: '',
    createdAt: '',
    dueDate: '',
  });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    dispatch(setTasks(storedTasks));
  }, [dispatch]);

  const handleAddOrEdit = () => {
    if (task.id) {
      const updated = { ...task };
      dispatch(updateTask(updated));
      toast.success('Task updated!');
    } else {
      const newTask = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      dispatch(setTasks([...tasks, newTask]));
      toast.success('Task created!');
    }

    const updatedTasks = [...tasks.filter(t => t.id !== task.id), task];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setShowForm(false);
    setTask({
      id: '',
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Open',
      assignee: '',
      createdAt: '',
      dueDate: '',
    });
  };

  const handleOpenEdit = (taskToEdit) => {
    setTask(taskToEdit);
    setShowForm(true);
  };

  const handleViewDetails = (taskToView) => {
    setSelectedTask(taskToView);
    setShowDetail(true);
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (isDeveloper && t.assignee !== user.username) return false;
      if (filter && t.status !== filter) return false;
      if (searchQuery &&
        !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') return a.priority.localeCompare(b.priority);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Navbar toggleDarkMode={toggleDarkMode} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
          Welcome, {user.username}
        </h1>

        <div className="space-x-2">
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded shadow-md hover:opacity-90"
            onClick={() => setShowForm(true)}
          >
            + Add Task
          </button>

          {isManager && (
            <button
              onClick={() => navigate('/analytics')}
              className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-4 py-2 rounded shadow-md hover:opacity-90"
            >
              📊 View Analytics
            </button>
          )}
        </div>
      </div>

      <SearchFilterBar />

      <TaskList
        tasks={filteredTasks}
        onEdit={handleOpenEdit}
        onView={handleViewDetails}
      />

      <TaskFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddOrEdit}
        task={task}
        setTask={setTask}
      />

      <TaskDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        task={selectedTask}
      />

      {/* ✅ Both Manager & Developer see time logger */}
      <TimeLogger tasks={filteredTasks} />
    </div>
  );
};

export default Dashboard;
