import "@fontsource/inter";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import Footer from "@/components/footer";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading";

import { getCurrentUser } from "@/features/auth/thunks";
import { getRecentNotifications } from "@/features/notifications/thunks";

import { cn } from "@/lib/utils";

function RootLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getRecentNotifications());
  }, [dispatch]);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className={cn("flex min-h-[100vh]")}>
      <div className="flex flex-grow flex-col">
        <Header />
        <div className="flex flex-grow">
          {loading ? <LoadingComponent /> : <Outlet />}
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default RootLayout;
