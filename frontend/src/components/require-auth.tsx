import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/hooks";

import LoadingComponent from "@/components/loading";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      navigate(`/sign-in`, {
        replace: true,
        state: { from: location },
      });
    }
  }, [loading, location, navigate, user]);

  if (loading) {
    return <LoadingComponent />;
  }

  return children;
};

export default RequireAuth;
