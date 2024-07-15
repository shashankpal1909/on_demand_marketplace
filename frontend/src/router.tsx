import { Outlet, createBrowserRouter } from "react-router-dom";

import RootLayout from "@/layouts/root-layout";

// import ChangePassword from "@/pages/change-password";
import { RootErrorBoundary } from "@/pages/error";
// import ForgotPassword from "@/pages/forgot-password";
// import LandingPage from "@/pages/landing";
// import NotFoundPage from "@/pages/not-found";
// import ResetPassword from "@/pages/reset-password";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";

import CalendarNew from "./components/Calendar";
import Grid from "./components/Grid";
import WeeklyCalendar from "./components/WeeklyCalendar";
import AddService from "./pages/add-service";
import AvailabilityCalendar from "./pages/availability-calendar";
import Calendar from "./pages/calendar";
import LandingPage from "./pages/landing";
import NotFoundPage from "./pages/not-found";
import Services from "./pages/services";

// import Dashboard from "./pages/dashboard";
// import ServiceManagement from "./pages/service-management";
// import SettingsPage from "./pages/settings";

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
            element: <LandingPage />,
          },
          {
            path: "sign-in",
            element: <SignIn />,
          },
          {
            path: "sign-up",
            element: <SignUp />,
          },
          // {
          //   path: "forgot-password",
          //   element: <ForgotPassword />,
          // },
          // {
          //   path: "reset-password",
          //   element: <ResetPassword />,
          // },
          // {
          //   path: "change-password",
          //   element: <ChangePassword />,
          // },
          // {
          //   path: "settings",
          //   element: <SettingsPage />,
          // },
          // {
          //   path: "dashboard",
          //   element: <Dashboard />,
          // },
          {
            path: "services",
            element: <Outlet />,
            children: [
              {
                path: "",
                element: <Services />,
              },
              {
                path: "add",
                element: <AddService />,
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
            ],
          },
          {
            path: "grid",
            element: <Grid />,
          },
          {
            path: "availability-calendar",
            element: <AvailabilityCalendar />,
          },
          {
            path: "weekly",
            element: <WeeklyCalendar />,
          },
          {
            path: "weekly/new",
            element: <CalendarNew />,
          },
          {
            path: "calendar",
            element: <Calendar />,
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
