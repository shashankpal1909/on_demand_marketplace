import "@fontsource-variable/overpass";
// import "@fontsource/inter";
import "@fontsource/roboto";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
    <div className={cn("flex flex-col h-[100svh]")}>
      <Header />
      <ScrollArea className="flex flex-grow flex-col justify-center items-center h-max min-h-[100svh-100px] w-[100svw] overflow-auto">
        {loading ? <LoadingComponent /> : <Outlet />}
        <ScrollBar orientation={"horizontal"} />
      </ScrollArea>
      {/*<Footer />*/}
      <Toaster />
    </div>
  );
}

export default RootLayout;
