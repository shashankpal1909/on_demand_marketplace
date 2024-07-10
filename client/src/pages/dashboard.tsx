import { Box, Container, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import LoadingComponent from "@/components/loading";
import RequireAuth from "@/components/require-auth";

import { addNotification } from "@/features/notifications/slice";
import { getRecentNotifications } from "@/features/notifications/thunks";

function Dashboard() {
  const { loading, recentNotifications } = useAppSelector(
    (state) => state.notifications,
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRecentNotifications());
  }, [dispatch]);

  const [websocket, setWebsocket] = useState<WebSocket>();

  useEffect(() => {
    const url = `ws://localhost:8000/api/v1/notifications/ws/${user?.username}`;
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      ws.send("Connect");
    };

    // receive message every start page
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      dispatch(addNotification(message));
    };

    setWebsocket(ws);
    //clean up function when we close page
    return () => ws.close();
  }, [dispatch, user?.username]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <RequireAuth>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography variant="subtitle2">
          Welcome to your dashboard! Here you can access all your orders,
          products, and more.
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box>
          {recentNotifications?.map((notification) => (
            <Box key={notification.id}>
              {JSON.stringify(notification, null, 4)}
            </Box>
          ))}
        </Box>
      </Container>
    </RequireAuth>
  );
}

export default Dashboard;
