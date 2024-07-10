import { createSlice } from "@reduxjs/toolkit";

import type { User } from "@/api/services/auth-service";

import {
  getCurrentUser,
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyEmail,
  changePassword,
} from "./thunks";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

type UnProcessableEntityErrorDetail = {
  type: string;
  loc: string[];
  msg: string;
}[];

interface ErrorPayload {
  detail: string | UnProcessableEntityErrorDetail;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  success: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetLoading: (state: AuthState) => {
      state.loading = false;
    },
    resetError: (state: AuthState) => {
      state.error = null;
    },
    resetSuccess: (state: AuthState) => {
      state.success = null;
    },
    setError: (state: AuthState, action) => {
      state.error = action.payload;
    },
    setLoading: (state: AuthState, action) => {
      state.loading = !!action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success =
          "An email with reset password instructions has been sent.";
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        localStorage.removeItem("access_token");
      })
      // change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = "Password has been changed successfully!";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = "Password has been reset successfully!";
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("access_token", action.payload.access_token);
        state.error = state.success = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // sign out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = state.success = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = state.error = null;
        state.user = action.payload.user;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      })
      // verify email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = "Email verified successfully.";
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        updateErrorState(action.payload as ErrorPayload, state);
      });
  },
});

export const {
  resetError,
  resetLoading,
  resetSuccess,
  setError,
  setLoading,
  setSuccess,
} = authSlice.actions;

export default authSlice.reducer;
function updateErrorState(payload: ErrorPayload, state: AuthState) {
  const { detail } = payload;

  if (typeof detail === "string") {
    state.error = detail;
  } else if (
    Array.isArray(detail) &&
    detail.every((item) => typeof item === "object")
  ) {
    state.error = detail
      .map((err) => `Invalid ${err.loc[err.loc.length - 1]}`)
      .join("\n");
  } else {
    state.error = "An unexpected error occurred.";
  }
}
