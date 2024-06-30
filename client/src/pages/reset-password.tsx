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
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import {
  resetError,
  resetLoading,
  resetSuccess,
  setError,
} from "@/features/auth/slice";
import { resetPassword } from "@/features/auth/thunks";

import type { ResetPasswordDTO } from "@/lib/dtos";

const schema = z.object({
  password: z
    .string()
    .min(6, { message: "password should be at least 6 characters" }),
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { error, loading, success } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    startTransition(() => {
      const dto: ResetPasswordDTO = { ...values, token: token! };
      dispatch(resetPassword(dto))
        .unwrap()
        .then(() => {
          form.reset();
        })
        .catch(() => {});
    });
  };

  useEffect(() => {
    return () => {
      dispatch(resetError());
      dispatch(resetLoading());
      dispatch(resetSuccess());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log(token);
    if (!token) {
      dispatch(setError("Invalid token"));
    }
  }, [dispatch, token]);

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
          Reset Password
        </Typography>
        <Typography variant="subtitle2" align="center">
          Enter new password
        </Typography>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    fullWidth
                    required
                    id="password"
                    label="New Password"
                    name="password"
                    type="password"
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
            disabled={loading || !token}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
          <Grid container>
            <Grid item>
              <Link to={"/sign-up"} component={RouterLink} variant="body2">
                Back to Login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
