import { createClient } from "@/lib/supabase/server";
import { Product, ProductInput } from "@/types/product";

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price,
        wholesalePrice: item.wholesale_price || item.price,
        stock: item.stock || 0,
        category: item.category || "",
        images: item.images || [],
        isActive: item.is_active,
        createdAt: item.created_at,
      }));
    } catch (err) {
      console.error("Unexpected error in getAllProducts:", err);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        wholesalePrice: data.wholesale_price || data.price,
        stock: data.stock || 0,
        category: data.category || "",
        images: data.images || [],
        isActive: data.is_active,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error("Unexpected error in getProductById:", err);
      return null;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        wholesalePrice: data.wholesale_price || data.price,
        stock: data.stock || 0,
        category: data.category || "",
        images: data.images || [],
        isActive: data.is_active,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error("Unexpected error in getProductBySlug:", err);
      return null;
    }
  },

  async createProduct(input: ProductInput): Promise<Product | null> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: input.name,
          description: input.description,
          price: input.price,
          wholesale_price: input.wholesalePrice,
          stock: input.stock,
          category: input.category,
          images: input.images,
          is_active: input.isActive,
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Error creating product:", error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        wholesalePrice: data.wholesale_price || data.price,
        stock: data.stock || 0,
        category: data.category || "",
        images: data.images || [],
        isActive: data.is_active,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error("Unexpected error in createProduct:", err);
      return null;
    }
  },

  async updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null> {
    try {
      const supabase = await createClient();
      const updateData: Record<string, unknown> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.price !== undefined) updateData.price = input.price;
      if (input.wholesalePrice !== undefined) updateData.wholesale_price = input.wholesalePrice;
      if (input.stock !== undefined) updateData.stock = input.stock;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.images !== undefined) updateData.images = input.images;
      if (input.isActive !== undefined) updateData.is_active = input.isActive;

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        console.error("Error updating product:", error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: data.price,
        wholesalePrice: data.wholesale_price || data.price,
        stock: data.stock || 0,
        category: data.category || "",
        images: data.images || [],
        isActive: data.is_active,
        createdAt: data.created_at,
      };
    } catch (err) {
      console.error("Unexpected error in updateProduct:", err);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Error deleting product:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Unexpected error in deleteProduct:", err);
      return false;
    }
  },
};
