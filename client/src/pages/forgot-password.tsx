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
import { Link as RouterLink } from "react-router-dom";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { resetError, resetLoading, resetSuccess } from "@/features/auth/slice";
import { forgotPassword } from "@/features/auth/thunks";

import type { ForgotPasswordDTO } from "@/lib/dtos";

const schema = z.object({
  email: z.string().email({ message: "email is required" }),
});

export default function ForgotPassword() {
  const { error, loading, success } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    startTransition(() => {
      const dto: ForgotPasswordDTO = values;
      dispatch(forgotPassword(dto))
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
          Forgot Password
        </Typography>
        <Typography variant="subtitle2" align="center">
          Enter your email and we&apos;ll send you instructions to reset your
          password.
        </Typography>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
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
