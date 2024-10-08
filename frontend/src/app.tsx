import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider";

import { router } from "@/router";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
