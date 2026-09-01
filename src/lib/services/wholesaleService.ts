// ... داخل الكائن wholesaleService

  // حذف منتج
  async deleteProduct(productId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw new Error(error.message);
  },

  // تعديل بيانات منتج (بدل المخزون فقط)
  async updateProduct(productId: string, updates: any): Promise<any> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
