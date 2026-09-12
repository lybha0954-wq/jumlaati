import { createClient } from "@/lib/supabase/client";

export const uploadService = {
  /**
   * رفع صورة منتج إلى Supabase Storage
   * @returns URL العام للصورة
   */
  async uploadProductImage(file: File, userId: string): Promise<string> {
    const supabase = createClient();
    
    // تحقق من النوع
    if (!file.type.startsWith("image/")) {
      throw new Error("الملف يجب أن يكون صورة");
    }
    
    // تحقق من الحجم (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
    }

    // اسم فريد
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // الحصول على الرابط العام
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return publicUrl;
  },

  /**
   * حذف صورة
   */
  async deleteProductImage(path: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("product-images")
      .remove([path]);
    if (error) throw new Error(error.message);
  },
};
