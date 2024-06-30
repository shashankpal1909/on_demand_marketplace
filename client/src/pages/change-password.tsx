import { zodResolver } from "@hookform/resolvers/zod";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { startTransition, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import RequireAuth from "@/components/require-auth";

import { resetError, resetLoading, resetSuccess } from "@/features/auth/slice";
import "@/features/auth/thunks";
import { changePassword } from "@/features/auth/thunks";

import type { ChangePasswordDTO } from "@/lib/dtos";

const schema = z.object({
  password: z.string().min(1, { message: "current password is required" }),
  newPassword: z
    .string()
    .min(6, { message: "new password should be at least 6 characters" }),
});

export default function ChangePassword() {
  const { error, loading, success } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    startTransition(() => {
      const dto: ChangePasswordDTO = {
        current_password: values.password,
        new_password: values.newPassword,
      };
      dispatch(changePassword(dto))
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

  return (
    <RequireAuth>
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
                      label="Current Password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      error={Boolean(form.formState.errors.password)}
                      helperText={form.formState.errors.password?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="newPassword"
                  control={form.control}
                  render={({ field: { ref, ...field } }) => (
                    <TextField
                      inputRef={ref}
                      {...field}
                      fullWidth
                      required
                      id="newPassword"
                      label="New Password"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      error={Boolean(form.formState.errors.newPassword)}
                      helperText={form.formState.errors.newPassword?.message}
                    />
                  )}
                />
              </Grid>
              {(error || success) && (
                <Grid item sx={{ width: "100%" }}>
                  {error && <Alert severity="error">{error}</Alert>}
                  {success && <Alert severity="success">{success}</Alert>}
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Container>
    </RequireAuth>
  );
}
