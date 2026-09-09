import * as z from "zod";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    wholesalerId: z.string(),
    price: z.number().positive(),
  })).min(1, "السلة فارغة"),
  address: z.string().min(5, "العنوان مفصل جداً"),
  coupon_code: z.string().optional(),
});
