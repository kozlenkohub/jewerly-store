import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import toast from 'react-hot-toast';

export const register = createAsyncThunk('user/register', async (userData) => {
  const { data } = await axios.post('/api/user/register', userData);
  return data;
});

export const login = createAsyncThunk('user/login', async (userData) => {
  const { data } = await axios.post('/api/user/login', userData);
  return data;
});

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      toast.success('Logout successful!');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        toast.success('Registration successful!');
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Registration failed!');
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        toast.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Login failed!');
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
