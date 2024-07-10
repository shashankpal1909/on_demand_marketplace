import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/slice";
import notificationsReducer from "@/features/notifications/slice";
import themeReducer from "@/features/theme/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
