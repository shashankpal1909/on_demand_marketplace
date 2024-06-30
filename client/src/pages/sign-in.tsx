import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { startTransition, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { resetError, resetLoading, resetSuccess } from "@/features/auth/slice";
import { getCurrentUser, signIn } from "@/features/auth/thunks";

import type { SignInDTO } from "@/lib/dtos";

const schema = z.object({
  username: z.string({
    message: "Please enter your username or email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function SignIn() {
  const { user, error, loading, success } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    startTransition(() => {
      const dto: SignInDTO = values;
      dispatch(signIn(dto))
        .unwrap()
        .then(() => {
          dispatch(getCurrentUser())
            .unwrap()
            .then(() => {
              navigate(from, { replace: true });
            })
            .catch(() => {});
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, user]);

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetLoading());
      dispatch(resetSuccess());
    };
  }, [dispatch]);

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          // marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Typography variant="subtitle2">Welcome Back</Typography>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    label="Username or Email Address"
                    autoComplete="email"
                    error={Boolean(form.formState.errors.username)}
                    helperText={form.formState.errors.username?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    type="password"
                    label="Password"
                    autoComplete="password"
                    error={Boolean(form.formState.errors.password)}
                    helperText={form.formState.errors.password?.message}
                  />
                )}
              />
            </Grid>
            <Grid item sx={{ width: "100%" }}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to={"/forgot-password"}
                component={RouterLink}
                variant="body2"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to={"/sign-up"} component={RouterLink} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
