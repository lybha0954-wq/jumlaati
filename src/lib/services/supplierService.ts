'use client';

import { createClient } from '@/lib/supabase/client';

export interface Supplier {
  id: string;
    name: string;
      region: string;
        rating: number;
          phone: string;
            isActive: boolean;
              creditLimit: number;
                creditUsed: number;
                  pendingDebt: number;
                    dueDays: number;
                      creditStatus: 'good' | 'warning' | 'overdue';
                      }

                      function toSupplier(row: any): Supplier {
                        return {
                            id: row.id ?? '',
                                name: row.name ?? '',
                                    region: row.region ?? '',
                                        rating: Number(row.rating ?? 4.5),
                                            phone: row.phone ?? '',
                                                isActive: row.is_active ?? true,
                                                    creditLimit: Number(row.credit_limit ?? 0),
                                                        creditUsed: Number(row.credit_used ?? 0),
                                                            pendingDebt: Number(row.pending_debt ?? 0),
                                                                dueDays: Number(row.due_days ?? 0),
                                                                    creditStatus: (row.credit_status as Supplier['creditStatus']) ?? 'good',
                                                                      };
                                                                      }

                                                                      function isSchemaError(error: any): boolean {
                                                                        if (!error) return false;
                                                                          if (error.code && typeof error.code === 'string') {
                                                                              const cls = error.code.substring(0, 2);
                                                                                  if (cls === '42' || cls === '08') return true;
                                                                                      if (cls === '23') return false;
                                                                                        }
                                                                                          return false;
                                                                                          }

                                                                                          export const supplierService = {
                                                                                            /**
                                                                                               * جلب كافة الموردين المسجلين مرتبين حسب الاسم
                                                                                                  */
                                                                                                    async getAll(): Promise<Supplier[]> {
                                                                                                        const supabase = createClient();
                                                                                                            if (!supabase) return [];

                                                                                                                try {
                                                                                                                      const { data, error } = await supabase
                                                                                                                              .from('suppliers')
                                                                                                                                      .select('*')
                                                                                                                                              .order('name', { ascending: true });

                                                                                                                                                    if (error) {
                                                                                                                                                            if (isSchemaError(error)) throw error;
                                                                                                                                                                    return [];
                                                                                                                                                                          }
                                                                                                                                                                                return (data ?? []).map(toSupplier);
                                                                                                                                                                                    } catch (e: any) {
                                                                                                                                                                                          if (isSchemaError(e)) throw e;
                                                                                                                                                                                                return [];
                                                                                                                                                                                                    }
                                                                                                                                                                                                      },
                                                                                                                                                                                                      };
                                                                                                                                                                                                      