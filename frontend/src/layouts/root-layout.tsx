import "@fontsource-variable/overpass";
import "@fontsource/inter";
import "@fontsource/roboto";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { Toaster } from "@/components/ui/toaster";

import Footer from "@/components/footer";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading";

import { getCurrentUser } from "@/features/auth/thunks";
import { getRecentNotifications } from "@/features/notifications/thunks";

import { cn } from "@/lib/utils";

function RootLayout() {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getRecentNotifications());
  }, [dispatch]);

  return (
    <div className={cn("flex min-h-[100vh]")}>
      <div className="flex flex-grow flex-col">
        <Header />
        <div className="flex flex-grow">
          {loading ? <LoadingComponent /> : <Outlet />}
        </div>
        <Footer />
        <Toaster />
      </div>
    </div>
  );
}

export default RootLayout;
