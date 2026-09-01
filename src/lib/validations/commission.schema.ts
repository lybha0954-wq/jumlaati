import * as z from "zod";

export const commissionSchema = z?.object({
  orderId: z?.string(),
  retailerId: z?.string(),
  amount: z?.coerce?.number()?.positive(),
  status: z?.enum(["pending", "paid"])?.default("pending"),
});
