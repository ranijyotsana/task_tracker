import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import fakeLogs from '../../db/timeLogs.json';

const loadLogsFromStorage = () => {
  const logs = localStorage.getItem('timeLogs');
  return logs ? JSON.parse(logs) : [];
};

const initialState = {
  timeLogs: loadLogsFromStorage(),
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    addTimeLog: (state, action) => {
      const newLog = {
        id: uuidv4(),
        taskId: action.payload.taskId,
        username: action.payload.username,
        duration: action.payload.duration,
        loggedAt: new Date().toISOString(),
      };
      state.timeLogs.push(newLog);
      localStorage.setItem('timeLogs', JSON.stringify(state.timeLogs));
    },

    deleteTimeLogsByTaskId: (state, action) => {
      state.timeLogs = state.timeLogs.filter(
        log => log.taskId !== action.payload
      );
      localStorage.setItem('timeLogs', JSON.stringify(state.timeLogs));
    },

    loadFakeLogs: (state) => {
      state.timeLogs = fakeLogs;
      localStorage.setItem('timeLogs', JSON.stringify(fakeLogs));
    },

    clearTimeLogs: (state) => {
      state.timeLogs = [];
      localStorage.removeItem('timeLogs');
    },
  },
});

export const {
  addTimeLog,
  deleteTimeLogsByTaskId,
  loadFakeLogs,
  clearTimeLogs,
} = timeSlice.actions;

export default timeSlice.reducer;
