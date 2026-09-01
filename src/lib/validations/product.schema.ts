import * as z from "zod";

export const productSchema = z?.object({
  name: z?.string()?.min(2, "اسم المنتج مطلوب"),
  description: z?.string()?.optional(),
  price: z?.coerce?.number()?.positive("السعر يجب أن يكون موجباً"),
  wholesalePrice: z?.coerce?.number()?.positive("سعر الجملة يجب أن يكون موجباً"),
  stock: z?.coerce?.number()?.int()?.nonnegative(),
  category: z?.string()?.min(1, "الفئة مطلوبة"),
});
