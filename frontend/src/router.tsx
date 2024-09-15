import { Outlet, createBrowserRouter } from "react-router-dom";

import RequireAuth from "@/components/require-auth";

import RootLayout from "@/layouts/root-layout";

import AddService from "@/pages/add-service";
import Calendar from "@/pages/calendar";
import EditServicePage from "@/pages/edit-service";
import { RootErrorBoundary } from "@/pages/error";
import LandingPage from "@/pages/landing";
import NotFoundPage from "@/pages/not-found";
import Services from "@/pages/services";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";

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
          {
            path: "services",
            element: <Outlet />,
            children: [
              {
                path: "",
                element: (
                  <RequireAuth>
                    <Services />
                  </RequireAuth>
                ),
              },
              {
                path: "add",
                element: (
                  <RequireAuth>
                    <AddService />
                  </RequireAuth>
                ),
              },
              {
                path: ":serviceId/edit",
                element: <EditServicePage />,
              },
              {
                path: "*",
                element: <NotFoundPage />,
              },
            ],
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
