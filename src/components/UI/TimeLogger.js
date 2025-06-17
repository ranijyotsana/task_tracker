import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTimeLog } from '../../features/time/timeSlice';
import { toast } from 'react-toastify';

const TimeLogger = ({ taskId }) => {
  const dispatch = useDispatch();
  const [minutes, setMinutes] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Get all timeLogs for this task
  const timeLogs = useSelector((state) =>
    state.time.timeLogs.filter((log) => log.taskId === taskId)
  );

  const totalTime = timeLogs.reduce((sum, log) => sum + log.duration, 0); // in minutes
  const totalHours = (totalTime / 60).toFixed(2);

  const handleLogTime = () => {
    const duration = parseInt(minutes);
    if (!duration || duration <= 0) {
      toast.error('Please enter a valid number of minutes.');
      return;
    }

    dispatch(
      addTimeLog({
        taskId,
        duration,
        username: user.username,
        timestamp: new Date().toISOString(),
      })
    );

    toast.success(`Logged ${duration} minutes`);
    setMinutes('');
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800 rounded shadow">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
        ⏱ Time Tracking
      </h3>

      <p className="mb-2 text-gray-700 dark:text-gray-300">
        Total Time: <strong>{totalHours}</strong> hours
      </p>

      {user.role === 'developer' && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="Minutes"
            className="px-3 py-2 rounded border w-32 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleLogTime}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Log Time
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeLogger;
