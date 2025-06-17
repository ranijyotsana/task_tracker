import { createSlice, nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  tasks: [],
  searchQuery: '',
  filter: 'All',
  sortBy: 'createdAt',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.tasks.push(action.payload);
      },
      prepare: (task) => ({
        payload: {
          ...task,
          id: nanoid(),
          createdAt: dayjs().format('YYYY-MM-DD'),
          updatedAt: null,
          status: task.status || 'Open',
          statusHistory: [
            {
              status: task.status || 'Open',
              date: dayjs().format('YYYY-MM-DD HH:mm'),
              changedBy: task.createdBy || 'System',
            },
          ],
          managerComments: '',
          isLocked: false,
        },
      }),
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1 && !state.tasks[index].isLocked) {
        const updatedTask = {
          ...state.tasks[index],
          ...action.payload,
          updatedAt: dayjs().format('YYYY-MM-DD'),
        };

        // Add status history only if status changed
        if (action.payload.status && action.payload.status !== state.tasks[index].status) {
          updatedTask.statusHistory = [
            ...state.tasks[index].statusHistory,
            {
              status: action.payload.status,
              date: dayjs().format('YYYY-MM-DD HH:mm'),
              changedBy: action.payload.updatedBy || 'System',
            },
          ];
        }

        state.tasks[index] = updatedTask;
      }
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },

    markPendingApproval: (state, action) => {
        const task = state.tasks.find(task => task.id === action.payload);
        if (task && !task.isLocked && task.status === 'Open') {
          task.status = 'Pending Approval';
          task.updatedAt = dayjs().format('YYYY-MM-DD');
          task.statusHistory.push({
            status: 'Pending Approval',
            date: dayjs().format('YYYY-MM-DD HH:mm'),
            changedBy: 'Developer', // or task.updatedBy
          });
        }
      },
      

      approveTask: (state, action) => {
        const { id, manager, comment } = action.payload;
        const task = state.tasks.find(task => task.id === id);
        if (task && task.status === 'Pending Approval') {
          task.status = 'Closed'; // final status is Closed
          task.managerComments = comment || '';
          task.updatedAt = dayjs().format('YYYY-MM-DD');
          task.statusHistory.push({
            status: 'Closed',
            date: dayjs().format('YYYY-MM-DD HH:mm'),
            changedBy: manager || 'Manager',
          });
          task.isLocked = true; // lock after approval
        }
      },
      

    reopenTask: (state, action) => {
      const { id, manager, comment } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task && (task.status === 'Pending Approval' || task.status === 'Closed')) {
        task.status = 'Open';
        task.managerComments = comment || '';
        task.updatedAt = dayjs().format('YYYY-MM-DD');
        task.statusHistory.push({
          status: 'Reopened',
          date: dayjs().format('YYYY-MM-DD HH:mm'),
          changedBy: manager,
        });
        task.isLocked = false;
      }
    },

    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  markPendingApproval,
  approveTask,
  reopenTask,
  setTasks,
  setSearchQuery,
  setFilter,
  setSortBy,
} = taskSlice.actions;

export default taskSlice.reducer;
