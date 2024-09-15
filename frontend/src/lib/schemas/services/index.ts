import { z } from "zod";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGES_COUNT,
} from "@/lib/constants/services";

const schema = z.object({
  name: z.string().min(1, { message: "Please enter a valid title." }),
  category: z.string().min(1, { message: "Please enter a valid category." }),
  description: z
    .string()
    .min(1, { message: "Please enter a valid description." }),
  pricingType: z.enum(["fixed", "hourly"]),
  pricing: z.coerce.number().min(1, { message: "Please enter a valid price." }),
  media: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) =>
        files?.every(
          (file) =>
            file.size <= MAX_IMAGE_FILE_SIZE &&
            ACCEPTED_IMAGE_TYPES.includes(file.type),
        ),
      {
        message: "Invalid file type or size.",
      },
    )
    .refine((files) => files && files?.length > MAX_IMAGES_COUNT, {
      message: `You can only upload ${MAX_IMAGES_COUNT} images.`,
    }),
  location: z.string().min(1, { message: "Please enter a valid location." }),
  tags: z.array(z.string()),
});

export default schema;
