'use client';
import React, { useRef } from 'react';
import { X, Printer, Share2 } from 'lucide-react';

export interface InvoiceItem {
  name: string;
  qty: number;
  unit: string;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  sellerName: string;
  sellerPhone?: string;
  buyerName: string;
  buyerStoreName?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  items: InvoiceItem[];
  notes?: string;
}

interface InvoicePrintModalProps {
  invoice: InvoiceData;
  onClose: () => void;
}

const fmt = (n: number) => n.toLocaleString('ar-IQ') + ' د.ع';

export default function InvoicePrintModal({ invoice, onClose }: InvoicePrintModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const tax = Math.round(subtotal * 0.0); // No tax by default
  const total = subtotal + tax;

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <title>فاتورة ${invoice.invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Tajawal', sans-serif; direction: rtl; color: #0F172A; background: white; padding: 24px; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #1E3A5F; }
          .brand { font-size: 24px; font-weight: 800; color: #1E3A5F; }
          .brand-sub { font-size: 12px; color: #64748B; margin-top: 2px; }
          .invoice-meta { text-align: left; }
          .invoice-num { font-size: 18px; font-weight: 700; color: #1E3A5F; }
          .invoice-date { font-size: 12px; color: #64748B; margin-top: 4px; }
          .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
          .party-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; }
          .party-label { font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px; }
          .party-name { font-size: 14px; font-weight: 700; color: #0F172A; }
          .party-detail { font-size: 12px; color: #64748B; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th { background: #1E3A5F; color: white; padding: 8px 12px; font-size: 12px; font-weight: 700; text-align: right; }
          td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) td { background: #F8FAFC; }
          .totals { display: flex; justify-content: flex-end; }
          .totals-box { width: 220px; }
          .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; }
          .total-final { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; font-weight: 800; color: #1E3A5F; border-top: 2px solid #1E3A5F; margin-top: 4px; }
          .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: #94A3B8; }
          .notes { background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 8px; padding: 10px 12px; margin-bottom: 16px; font-size: 12px; color: #92400E; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleShare = async () => {
    const text = `فاتورة ${invoice.invoiceNumber}\nالتاريخ: ${invoice.date}\nالمورد: ${invoice.sellerName}\nالعميل: ${invoice.buyerName}\nالإجمالي: ${fmt(total)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `فاتورة ${invoice.invoiceNumber}`, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert('تم نسخ تفاصيل الفاتورة إلى الحافظة');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      dir="rtl"
    >
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ boxShadow: 'var(--shadow-xl)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary text-white no-print">
          <h2 className="font-arabic font-bold text-lg">فاتورة — {invoice.invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-arabic transition-colors"
            >
              <Share2 size={14} />
              مشاركة
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-arabic transition-colors"
            >
              <Printer size={14} />
              طباعة
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable invoice content */}
        <div className="overflow-y-auto flex-1 p-5">
          <div ref={printRef} className="print-invoice">
            {/* Invoice Header */}
            <div className="invoice-header flex items-start justify-between mb-6 pb-4 border-b-2 border-primary">
              <div>
                <div className="font-arabic font-extrabold text-2xl text-primary">جُمْلَتِي</div>
                <div className="font-arabic text-xs text-muted-foreground mt-0.5">منصة التوريد بالجملة في العراق</div>
              </div>
              <div className="text-left">
                <div className="font-arabic font-bold text-lg text-primary">{invoice.invoiceNumber}</div>
                <div className="font-arabic text-xs text-muted-foreground mt-1">{invoice.date}</div>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-muted/40 border border-border rounded-xl p-3">
                <div className="font-arabic text-[10px] font-bold text-muted-foreground uppercase mb-1.5">المورد</div>
                <div className="font-arabic font-bold text-sm text-foreground">{invoice.sellerName}</div>
                {invoice.sellerPhone && <div className="font-arabic text-xs text-muted-foreground mt-0.5">{invoice.sellerPhone}</div>}
              </div>
              <div className="bg-muted/40 border border-border rounded-xl p-3">
                <div className="font-arabic text-[10px] font-bold text-muted-foreground uppercase mb-1.5">العميل</div>
                <div className="font-arabic font-bold text-sm text-foreground">{invoice.buyerName}</div>
                {invoice.buyerStoreName && <div className="font-arabic text-xs text-muted-foreground mt-0.5">{invoice.buyerStoreName}</div>}
                {invoice.buyerPhone && <div className="font-arabic text-xs text-muted-foreground">{invoice.buyerPhone}</div>}
                {invoice.buyerAddress && <div className="font-arabic text-xs text-muted-foreground">{invoice.buyerAddress}</div>}
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-right py-2.5 px-3 font-arabic font-bold rounded-tr-lg">#</th>
                    <th className="text-right py-2.5 px-3 font-arabic font-bold">المنتج</th>
                    <th className="text-center py-2.5 px-3 font-arabic font-bold">الكمية</th>
                    <th className="text-center py-2.5 px-3 font-arabic font-bold">الوحدة</th>
                    <th className="text-left py-2.5 px-3 font-arabic font-bold">سعر الوحدة</th>
                    <th className="text-left py-2.5 px-3 font-arabic font-bold rounded-tl-lg">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={`inv-item-${idx}`} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="py-2 px-3 font-arabic text-muted-foreground">{idx + 1}</td>
                      <td className="py-2 px-3 font-arabic font-semibold text-foreground">{item.name}</td>
                      <td className="py-2 px-3 font-arabic text-center tabular-nums">{item.qty}</td>
                      <td className="py-2 px-3 font-arabic text-center text-muted-foreground">{item.unit}</td>
                      <td className="py-2 px-3 font-arabic text-left tabular-nums text-muted-foreground">{item.unitPrice.toLocaleString('ar-IQ')}</td>
                      <td className="py-2 px-3 font-arabic text-left tabular-nums font-semibold">{(item.qty * item.unitPrice).toLocaleString('ar-IQ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-4">
              <div className="w-56 space-y-1">
                <div className="flex justify-between text-sm font-arabic text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span className="tabular-nums">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-base font-arabic font-extrabold text-primary border-t-2 border-primary pt-2 mt-2">
                  <span>الإجمالي الكلي</span>
                  <span className="tabular-nums">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4">
                <p className="font-arabic text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">ملاحظات</p>
                <p className="font-arabic text-sm text-amber-800 dark:text-amber-300">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border pt-3 text-center">
              <p className="font-arabic text-xs text-muted-foreground">
                شكراً لتعاملكم مع جُمْلَتِي — منصة التوريد بالجملة في العراق
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
