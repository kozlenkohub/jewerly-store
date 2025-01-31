import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { fetchCartItems } from './cartSlice';

export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/user/register', userData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const login = createAsyncThunk(
  'user/login',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post('/api/user/login', userData);
      localStorage.setItem('token', data.token);
      dispatch(fetchCartItems());
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
  isUserisUserLoading: false,
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
        state.isUserLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        toast.success('Registration successful!');
      })
      .addCase(register.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Registration failed!');
      })
      .addCase(login.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        toast.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Login failed!');
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
