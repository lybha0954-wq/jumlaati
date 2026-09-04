import * as z from "zod";

export const reviewSchema = z.object({
  product_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});
