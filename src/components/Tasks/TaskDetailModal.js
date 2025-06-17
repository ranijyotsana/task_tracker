import React from 'react';

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Task Details</h2>
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Assignee:</strong> {task.assignee}</p>
        <div className="flex justify-end mt-4">
          <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
