import * as z from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(6, "أدخل بريدك الإلكتروني أو رقم هاتفك"),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().optional(),
  password: z.string().min(6, "كلمة المرور قصيرة جداً"),
  role: z.enum(["retailer", "wholesaler", "delivery"]).default("retailer"),
});
