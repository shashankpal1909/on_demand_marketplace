import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import authService from "@/api/services/auth-service";

import type {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "@/lib/dtos";

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (dto: ChangePasswordDTO, thunkAPI) => {
    try {
      const response = await authService.changePassword(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (dto: ForgotPasswordDTO, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (dto: ResetPasswordDTO, thunkAPI) => {
    try {
      const response = await authService.resetPassword(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      const response = await authService.signIn(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const signOut = createAsyncThunk("auth/signOut", async (_, thunkAPI) => {
  try {
    localStorage.removeItem("access_token");
  } catch (error) {
    if (error instanceof AxiosError) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    } else {
      throw error;
    }
  }
});

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (dto: SignUpDTO, thunkAPI) => {
    try {
      const response = await authService.signUp(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, thunkAPI) => {
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);
