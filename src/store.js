import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import taskReducer from './features/tasks/taskSlice';
import timeReducer from './features/time/timeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    time: timeReducer,
  },
});

export default store;
