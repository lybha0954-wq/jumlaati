'use client';

export const COMMISSION_RATE = 0.02; // 2%
export const CURRENCY = 'د.ع';

export interface CommissionEntry {
  orderId: string;
    date: string;
      retailerName: string;
        orderTotal: number;
          commission: number;
          }

          export interface LedgerEntry {
            id: string;
              date: string;
                supplierId: string;
                  supplierName: string;
                    type: 'order' | 'payment' | 'adjustment';
                      description: string;
                        amount: number;
                          direction: 'debit' | 'credit';
                            orderId?: string;
                              paymentMethod?: 'cash' | 'credit';
                                status: 'completed' | 'pending' | 'overdue';
                                }

                                const COMMISSION_KEY = 'jumlaati_commissions';
                                const LEDGER_KEY = 'jumlaati_ledger';

                                // ─── Commission Store ─────────────────────────────────────────────────────────

                                /**
                                 * جلب كافة سجلات العمولات المجهزة
                                  */
                                  export function getCommissions(): CommissionEntry[] {
                                    if (typeof window === 'undefined') return [];
                                      try {
                                          const raw = localStorage.getItem(COMMISSION_KEY);
                                              if (!raw) return [];
                                                  const parsed = JSON.parse(raw);

                                                      if (!Array.isArray(parsed)) return [];

                                                          return parsed.map((item) => ({
                                                                ...item,
                                                                      orderTotal: Number(item.orderTotal ?? 0),
                                                                            commission: Number(item.commission ?? 0),
                                                                                }));
                                                                                  } catch {
                                                                                      return [];
                                                                                        }
                                                                                        }

                                                                                        /**
                                                                                         * إضافة عمولة طلب جديدة
                                                                                          */
                                                                                          export function addCommission(entry: CommissionEntry): void {
                                                                                            if (typeof window === 'undefined') return;
                                                                                              const existing = getCommissions();
                                                                                                
                                                                                                  const cleanEntry: CommissionEntry = {
                                                                                                      ...entry,
                                                                                                          orderTotal: Number(entry.orderTotal ?? 0),
                                                                                                              commission: Number(entry.commission ?? entry.orderTotal * COMMISSION_RATE),
                                                                                                                };

                                                                                                                  existing.unshift(cleanEntry);
                                                                                                                    localStorage.setItem(COMMISSION_KEY, JSON.stringify(existing));
                                                                                                                    }

                                                                                                                    /**
                                                                                                                     * حساب إجمالي العمولات المستحقة
                                                                                                                      */
                                                                                                                      export function getTotalCommission(): number {
                                                                                                                        return getCommissions().reduce((sum, entry) => sum + Number(entry.commission || 0), 0);
                                                                                                                        }

                                                                                                                        /**
                                                                                                                         * حساب إجمالي مبيعات الطلبات
                                                                                                                          */
                                                                                                                          export function getTotalSales(): number {
                                                                                                                            return getCommissions().reduce((sum, entry) => sum + Number(entry.orderTotal || 0), 0);
                                                                                                                            }

                                                                                                                            /**
                                                                                                                             * دالة مساعدة لحساب قيمة العمولة بناءً على المبلغ الإجمالي
                                                                                                                              */
                                                                                                                              export function calculateCommission(orderTotal: number): number {
                                                                                                                                const safeTotal = Number(orderTotal) || 0;
                                                                                                                                  return safeTotal * COMMISSION_RATE;
                                                                                                                                  }

                                                                                                                                  // ─── Ledger Store ─────────────────────────────────────────────────────────────

                                                                                                                                  /**
                                                                                                                                   * جلب قيود دفتر الحسابات
                                                                                                                                    */
                                                                                                                                    export function getLedgerEntries(): LedgerEntry[] {
                                                                                                                                      if (typeof window === 'undefined') return [];
                                                                                                                                        try {
                                                                                                                                            const raw = localStorage.getItem(LEDGER_KEY);
                                                                                                                                                if (!raw) return [];
                                                                                                                                                    const parsed = JSON.parse(raw);

                                                                                                                                                        if (!Array.isArray(parsed)) return [];

                                                                                                                                                            return parsed.map((item) => ({
                                                                                                                                                                  ...item,
                                                                                                                                                                        amount: Number(item.amount ?? 0),
                                                                                                                                                                            }));
                                                                                                                                                                              } catch {
                                                                                                                                                                                  return [];
                                                                                                                                                                                    }
                                                                                                                                                                                    }

                                                                                                                                                                                    /**
                                                                                                                                                                                     * إضافة قيد حساب جديد
                                                                                                                                                                                      */
                                                                                                                                                                                      export function addLedgerEntry(entry: LedgerEntry): void {
                                                                                                                                                                                        if (typeof window === 'undefined') return;
                                                                                                                                                                                          const existing = getLedgerEntries();

                                                                                                                                                                                            const cleanEntry: LedgerEntry = {
                                                                                                                                                                                                ...entry,
                                                                                                                                                                                                    amount: Number(entry.amount ?? 0),
                                                                                                                                                                                                      };

                                                                                                                                                                                                        existing.unshift(cleanEntry);
                                                                                                                                                                                                          localStorage.setItem(LEDGER_KEY, JSON.stringify(existing));
                                                                                                                                                                                                          }

                                                                                                                                                                                                          // ─── Helpers ──────────────────────────────────────────────────────────────────

                                                                                                                                                                                                          /**
                                                                                                                                                                                                           * تنسيق المبالغ المالية بالدينار العراقي بشكل آمن
                                                                                                                                                                                                            */
                                                                                                                                                                                                            export function formatIQD(amount: number): string {
                                                                                                                                                                                                              const safeAmount = Number(amount);
                                                                                                                                                                                                                const finalAmount = Number.isNaN(safeAmount) ? 0 : safeAmount;

                                                                                                                                                                                                                  return `${finalAmount.toLocaleString('ar-IQ')} ${CURRENCY}`;
                                                                                                                                                                                                                  }
                                                                                                                                                                                                                  