import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/get-user");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
      });
  },
});

export const { setUserData, logoutUser, clearError } = userSlice.actions;
export default userSlice.reducer;
