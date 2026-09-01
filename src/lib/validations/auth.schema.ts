import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "الاسم قصير جداً"),
  role: z.enum(["retailer", "wholesaler", "delivery"]),
});
