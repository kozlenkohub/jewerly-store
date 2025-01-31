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
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
      await axios
        .post(
          '/api/cart/sync',
          {
            userId: data.token,

            guestCart,
          },
          {
            headers: { Authorization: `Bearer ${data.token}` },
          },
        )
        .then(() => {
          localStorage.removeItem('guestCart');
        });
      dispatch(fetchCartItems());
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/user/profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateName = createAsyncThunk('user/updateName', async (name, { rejectWithValue }) => {
  try {
    const { data } = await axios.put('/api/user/profile/name', { name });
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateEmail = createAsyncThunk(
  'user/updateEmail',
  async (email, { rejectWithValue }) => {
    try {
      console.log('Sending request to update email:', email);
      const { data } = await axios.put('/api/user/profile/email', { email });
      console.log('Response from server:', data);
      return data;
    } catch (error) {
      console.error('Error in updateEmail action:', error);
      return rejectWithValue(error.response.data);
    }
  },
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ password, newPassword }, { rejectWithValue }) => {
    try {
      if (newPassword.length < 8) {
        return rejectWithValue({ message: 'New password must be at least 8 characters' });
      }
      console.log('Sending request to update password:', { password, newPassword }); // Log the request data
      const { data } = await axios.put('/api/user/profile/password', { password, newPassword });
      console.log('Response from server:', data); // Log the response from the server
      return data;
    } catch (error) {
      console.error('Error in updatePassword action:', error); // Log the error
      return rejectWithValue(error.response.data);
    }
  },
);

const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
  isUserLoading: false,
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
      })
      .addCase(fetchProfile.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Failed to fetch profile!');
      })
      .addCase(updateName.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(updateName.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user.name = action.payload.name;
        toast.success('Name updated successfully!');
      })
      .addCase(updateName.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Failed to update name!');
      })
      .addCase(updateEmail.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user.email = action.payload.email;
        toast.success('Email updated successfully!');
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Failed to update email!');
      })
      .addCase(updatePassword.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUserLoading = false;
        toast.success('Password updated successfully!');
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.payload.message;
        toast.error(action.payload.message || 'Failed to update password!');
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
