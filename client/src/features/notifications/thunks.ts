import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import notificationService from "@/api/services/notification-service";

export const getRecentNotifications = createAsyncThunk(
  "notifications/get",
  async (_, thunkAPI) => {
    try {
      const response = await notificationService.getNotifications(5);
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
