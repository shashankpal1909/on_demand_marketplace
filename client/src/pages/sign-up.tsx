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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { resetError, resetLoading, resetSuccess } from "@/features/auth/slice";
import { signUp } from "@/features/auth/thunks";

import type { SignUpDTO } from "@/lib/dtos";

const schema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  username: z
    .string()
    .min(3, { message: "username should be be 3-9 characters" })
    .max(12, { message: "username should be be 3-9 characters" }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password should be at least 6 characters long",
  }),
});

export default function SignUp() {
  const { user, error, loading, success } = useAppSelector(
    (state) => state.auth,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    startTransition(() => {
      const dto: SignUpDTO = { ...values, role: "customer" };
      dispatch(signUp(dto))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

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
          Sign Up
        </Typography>
        <Typography variant="subtitle2">Create New Account</Typography>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    autoComplete="given-name"
                    name="name"
                    fullWidth
                    id="name"
                    label="Full Name"
                    required
                    error={Boolean(form.formState.errors.name)}
                    helperText={form.formState.errors.name?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    required
                    error={Boolean(form.formState.errors.username)}
                    helperText={form.formState.errors.username?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    required
                    error={Boolean(form.formState.errors.email)}
                    helperText={form.formState.errors.email?.message}
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
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    required
                    autoComplete="new-password"
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
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/sign-in" component={RouterLink} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
