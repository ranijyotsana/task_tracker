import React from 'react';

const TaskFormModal = ({ isOpen, onClose, onSubmit, task, setTask }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">{task?.id ? 'Edit Task' : 'Create Task'}</h2>
        <input type="text" className="w-full p-3 mb-2 border rounded focus:ring-2 focus:ring-blue-400" placeholder="Title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
        <textarea className="w-full p-3 mb-2 border rounded focus:ring-2 focus:ring-blue-400" placeholder="Description" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
        <select className="w-full p-3 mb-2 border rounded bg-blue-50" value={task.priority} onChange={(e) => setTask({ ...task, priority: e.target.value })}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select className="w-full p-3 mb-2 border rounded bg-blue-50" value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Closed">Closed</option>
        </select>
        <input type="text" className="w-full p-3 mb-2 border rounded focus:ring-2 focus:ring-blue-400" placeholder="Assignee" value={task.assignee} onChange={(e) => setTask({ ...task, assignee: e.target.value })} />
        <div className="flex justify-end space-x-3 mt-4">
          <button className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded shadow-md hover:opacity-90" onClick={onSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;