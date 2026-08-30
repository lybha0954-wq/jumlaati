import { createClient } from '@/lib/supabase/server';

export async function searchProducts(query: string, page: number = 1) {
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc('search_products', { 
      search_query: query, 
      page_number: page,
      page_size: 20 
    });
  
  if (error) return { products: [], total: 0 };
  return { products: data || [], total: data?.length || 0 };
}
