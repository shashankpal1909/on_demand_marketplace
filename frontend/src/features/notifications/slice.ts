import { createSlice } from "@reduxjs/toolkit";

import type { Notification } from "@/api/services/notification-service";

import { getRecentNotifications } from "@/features/notifications/thunks";

interface NotificationState {
  recentNotifications: Notification[];
  allNotifications: Notification[];
  loading: boolean;
}

const initialState: NotificationState = {
  recentNotifications: [],
  allNotifications: [],
  loading: true,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state: NotificationState, action) => {
      state.recentNotifications = [
        action.payload,
        ...state.recentNotifications.slice(0, -1),
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecentNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRecentNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.recentNotifications = action.payload as unknown as Notification[];
    });
    builder.addCase(getRecentNotifications.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
