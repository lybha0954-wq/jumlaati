import * as z from "zod";

export const addressSchema = z.object({
  title: z.string().min(2, "عنوان قصير جداً"),
  city: z.string().min(2, "المدينة مطلوبة"),
  district: z.string().min(2, "المنطقة مطلوبة"),
  street: z.string().min(2, "الشارع مطلوب"),
  is_default: z.boolean().default(false),
});
