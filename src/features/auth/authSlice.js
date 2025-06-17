import { createSlice } from '@reduxjs/toolkit';

// Load user from localStorage
const savedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    signup: (state, action) => {
      // Optional: handle signup logic if needed
      // You can store new users in localStorage['users']
    },
    updateUser: (state, action) => {
      // Useful if profile is editable later
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const { login, logout, signup, updateUser } = authSlice.actions;

export default authSlice.reducer;
