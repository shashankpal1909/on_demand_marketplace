import { Outlet, createBrowserRouter } from "react-router-dom";

import RequireAuth from "@/components/require-auth";

import RootLayout from "@/layouts/root-layout";

import ChangePassword from "@/pages/change-password";
import RootErrorBoundary from "@/pages/error";
import ForgotPassword from "@/pages/forgot-password";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import ResetPassword from "@/pages/reset-password";
import SignInPage from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";

import AddService from "./pages/add-service";
import Dashboard from "./pages/dashboard";
import ServiceManagement from "./pages/service-management";
import SettingsPage from "./pages/settings";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: (
              <RequireAuth>
                <LandingPage />
              </RequireAuth>
            ),
          },
          {
            path: "sign-in",
            element: <SignInPage />,
          },
          {
            path: "sign-up",
            element: <SignUp />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
          {
            path: "change-password",
            element: <ChangePassword />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "services",
            element: <Outlet />,
            children: [
              {
                path: "",
                element: <ServiceManagement />,
              },
              {
                path: "add",
                element: <AddService />,
              },
            ],
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
