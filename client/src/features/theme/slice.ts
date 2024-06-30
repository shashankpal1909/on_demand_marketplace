import { createSlice } from "@reduxjs/toolkit";

import { type RootState } from "@/app/store";

let mode = localStorage.getItem("mode") ?? "light";

if (mode !== "light" && mode !== "dark") {
  mode = "light";
  localStorage.setItem("mode", "light");
}

const initialState = {
  mode: mode,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("mode", state.mode);
    },
  },
});

export default themeSlice.reducer;

export const { toggleMode } = themeSlice.actions;

export const selectThemeMode = (state: RootState) => state.theme.mode;
