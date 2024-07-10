import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyRupee } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { startTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import GoogleMaps from "@/components/location-input";
import RequireAuth from "@/components/require-auth";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const schema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  category: z.string({
    message: "Category is required",
  }),
  description: z.string({
    message: "Description is required",
  }),
  pricingType: z.enum(["fixed", "hourly"]),
  pricing: z.number().min(1, { message: "Price is required" }),
  media: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
  location: z.string({
    message: "Location is required",
  }),
  tags: z.array(z.string()),
});

function AddService() {
  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      pricingType: "fixed",
      pricing: 1,
      media: undefined,
      location: "",
      tags: [],
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    startTransition(() => {
      console.log(values);
    });
  };

  return (
    <RequireAuth>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4">Add New Service</Typography>
        <Typography variant="subtitle2">
          Create a new service for your customers to purchase. Fill out the form
          below.
        </Typography>
        <Divider sx={{ mb: 1 }} />
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
                    required
                    fullWidth
                    label="Service Name"
                    error={Boolean(form.formState.errors.name)}
                    helperText={form.formState.errors.name?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="category"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    label="Category"
                    error={Boolean(form.formState.errors.category)}
                    helperText={form.formState.errors.category?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    error={Boolean(form.formState.errors.description)}
                    helperText={form.formState.errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="pricing"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    type="number"
                    label="Price"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupee />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => field.onChange()}
                    error={Boolean(form.formState.errors.pricing)}
                    helperText={form.formState.errors.pricing?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="pricingType"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="pricing-type-label">
                      Pricing Type
                    </InputLabel>
                    <Select
                      labelId="pricing-type-label"
                      id="pricing-type"
                      inputRef={ref}
                      {...field}
                      label="Pricing Type"
                      fullWidth
                      required
                      error={Boolean(form.formState.errors.description)}
                    >
                      <MenuItem value={"fixed"}>Fixed</MenuItem>
                      <MenuItem value={"hourly"}>Hourly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="media"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    fullWidth
                    label="Media (Image)"
                    type="file"
                    error={Boolean(form.formState.errors.media)}
                    helperText={form.formState.errors.media?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="location"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    required
                    fullWidth
                    label="Location"
                    error={Boolean(form.formState.errors.location)}
                    helperText={form.formState.errors.location?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="tags"
                control={form.control}
                render={({ field: { ref, ...field } }) => (
                  <TextField
                    inputRef={ref}
                    {...field}
                    fullWidth
                    multiple
                    label="Tags (comma-separated)"
                    error={Boolean(form.formState.errors.tags)}
                    helperText={form.formState.errors.tags?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            // disabled={loading}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
            {/* {loading ? <CircularProgress size={24} /> : "Sign Up"} */}
          </Button>
          <GoogleMaps />
        </Box>
      </Container>
    </RequireAuth>
  );
}

export default AddService;
