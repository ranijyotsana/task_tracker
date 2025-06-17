import React from 'react';
import { useDispatch } from 'react-redux';
import {
  markPendingApproval,
  approveTask,
  reopenTask,
  deleteTask,
} from '../../features/tasks/taskSlice';

const TaskList = ({ tasks, onEdit, onView }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isManager = user.role === 'manager';
  const isDeveloper = user.role === 'developer';

  if (!tasks.length) {
    return <p className="text-gray-600 dark:text-gray-300">No tasks found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">{task.title}</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${task.status === 'Closed' ? 'bg-green-200 text-green-800' : task.status === 'Pending Approval' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
              {task.status}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-2">{task.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Priority: {task.priority}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Assigned to: {task.assignee || 'Unassigned'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Created: {task.createdAt}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onView(task)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm"
            >
              View
            </button>

            {!task.isLocked && (
              <>
                <button
                  onClick={() => onEdit(task)}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => dispatch(deleteTask(task.id))}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* 🟨 Developer action - Close/Send to Manager */}
          {isDeveloper && (
  <>
    {task.status === 'Open' && (
      <button
        onClick={() => dispatch(markPendingApproval(task.id))}
        className="mt-3 inline-block text-blue-600 hover:underline text-sm"
      >
        📩 Close (Send to Manager)
      </button>
    )}
    {task.status === 'Pending Approval' && (
      <p className="mt-3 text-yellow-600 text-sm">⏳ Pending Manager Approval</p>
    )}
    {task.status === 'Closed' && (
      <p className="mt-3 text-green-600 text-sm">✅ Task Approved and Closed</p>
    )}
  </>
)}

          {/* 🟩 Manager action - Approve/Reopen */}
          {isManager && task.status === 'Pending Approval' && (
            <div className="mt-3 space-x-2">
              <button
                onClick={() => dispatch(approveTask({ id: task.id, manager: user.username }))}
                className="text-green-600 hover:underline text-sm"
              >
                ✅ Approve
              </button>

              <button
                onClick={() => dispatch(reopenTask({ id: task.id, manager: user.username }))}
                className="text-red-600 hover:underline text-sm"
              >
                ♻️ Reopen
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
