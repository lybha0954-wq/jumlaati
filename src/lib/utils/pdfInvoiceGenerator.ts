'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IncomingOrder } from '@/lib/services/orderService';

export async function generateOrderInvoicePDF(order: IncomingOrder, supplierName?: string): Promise<void> {
  // Create an off-screen container for rendering the invoice
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  container.style.direction = 'rtl';
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';

  const orderDate = order.placedAt
    ? new Date(order.placedAt).toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('ar-IQ');

  const statusArabic: Record<string, string> = {
    pending: 'قيد الانتظار والمراجعة',
    reviewing: 'قيد المراجعة',
    delivering: 'قيد الشحن والتوصيل',
    completed: 'تم التسليم بنجاح',
    cancelled: 'ملغي',
  };

  const paymentStatusArabic: Record<string, string> = {
    paid: 'مدفوع بالكامل',
    pending: 'الدفع عند الاستلام',
    credit: 'أجل (على الحساب)',
  };

  const itemsHtml = order.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 10px 14px; text-align: center; color: #64748b; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 10px 14px; font-weight: 700; color: #0f172a; font-size: 13px;">${item.name}</td>
        <td style="padding: 10px 14px; text-align: center; font-size: 13px; color: #334155;">${item.qty} ${item.unit || 'قطعة'}</td>
        <td style="padding: 10px 14px; text-align: left; font-size: 13px; color: #334155;">${item.unitPrice.toLocaleString()} د.ع</td>
        <td style="padding: 10px 14px; text-align: left; font-weight: 700; font-size: 13px; color: #0f172a;">${(item.qty * item.unitPrice).toLocaleString()} د.ع</td>
      </tr>
    `
    )
    .join('');

  container.innerHTML = `
    <div style="width: 100%; box-sizing: border-box;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 20px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 26px; font-weight: 900; color: #0284c7; letter-spacing: -0.5px;">جُمْلَتِي</span>
            <span style="font-size: 13px; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px;">فاتورة توريد</span>
          </div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
            المنصة المركزية لتوريد البقالة والسوبرماركت في العراق
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
            المورد المعتمد: <strong>${supplierName || 'مورد جملتي المعتمد'}</strong>
          </div>
        </div>

        <div style="text-align: left;">
          <div style="font-size: 18px; font-weight: 800; color: #0f172a; font-family: monospace;">${order.orderNumber}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">تاريخ الطلب: ${orderDate}</div>
          <div style="margin-top: 6px;">
            <span style="display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;">
              الحالة: ${statusArabic[order.status] || order.status}
            </span>
          </div>
        </div>
      </div>

      <!-- Parties Info Box -->
      <div style="display: flex; gap: 20px; margin-bottom: 24px;">
        <!-- Buyer Info -->
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px;">
          <div style="font-size: 12px; font-weight: 800; color: #0284c7; margin-bottom: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
            بيانات العميل (المحل)
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${order.buyer.storeName || order.buyer.name}</div>
          <div style="font-size: 12px; color: #475569; margin-top: 4px;">المسؤول: ${order.buyer.name}</div>
          <div style="font-size: 12px; color: #475569; margin-top: 2px; direction: ltr; text-align: right;">الهاتف: ${order.buyer.phone || 'غير متوفر'}</div>
        </div>

        <!-- Delivery Info -->
        <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px;">
          <div style="font-size: 12px; font-weight: 800; color: #0284c7; margin-bottom: 8px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">
            تفاصيل التسليم والدفع
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #0f172a;">
            المدينة: ${order.delivery.city}
          </div>
          <div style="font-size: 12px; color: #475569; margin-top: 4px;">
            العنوان: ${order.delivery.address}
          </div>
          <div style="font-size: 12px; color: #059669; font-weight: 700; margin-top: 4px;">
            طريقة الدفع: ${paymentStatusArabic[order.paymentStatus] || order.paymentStatus || 'الدفع عند الاستلام'}
          </div>
          ${
            order.delivery.notes
              ? `<div style="font-size: 11px; color: #64748b; margin-top: 4px; background: #fff; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">ملاحظات: ${order.delivery.notes}</div>`
              : ''
          }
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; text-align: right;">
          <thead>
            <tr style="background-color: #0284c7; color: #ffffff;">
              <th style="padding: 10px 14px; font-size: 12px; font-weight: 800; width: 40px; text-align: center;">#</th>
              <th style="padding: 10px 14px; font-size: 12px; font-weight: 800;">الصنف / المنتج</th>
              <th style="padding: 10px 14px; font-size: 12px; font-weight: 800; text-align: center;">الكمية</th>
              <th style="padding: 10px 14px; font-size: 12px; font-weight: 800; text-align: left;">سعر الوحدة</th>
              <th style="padding: 10px 14px; font-size: 12px; font-weight: 800; text-align: left;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Totals Summary -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
        <div style="width: 320px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; padding-bottom: 6px;">
            <span>المجموع الفرعي:</span>
            <span style="font-weight: 600;">${order.total.toLocaleString()} د.ع</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px; color: #475569; padding-bottom: 6px;">
            <span>أجور الشحن والتوصيل:</span>
            <span style="font-weight: 600; color: #059669;">شحن مجاني</span>
          </div>
          <div style="border-top: 2px solid #0284c7; margin-top: 6px; padding-top: 8px; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 15px; font-weight: 800; color: #0f172a;">الإجمالي النهائي:</span>
            <span style="font-size: 18px; font-weight: 900; color: #0284c7;">${order.total.toLocaleString()} د.ع</span>
          </div>
        </div>
      </div>

      <!-- Footer & Signature Box -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
        <div>
          <span>تم توليد هذه الفاتورة الرسمية إلكترونياً عبر منصة جُمْلَتِي للتوريد التجاري.</span>
          <div style="margin-top: 2px;">للاستفسار والدعم الفني: support@jumlaati.iq</div>
        </div>
        <div style="border: 1px dashed #cbd5e1; border-radius: 8px; padding: 8px 16px; text-align: center;">
          <span style="color: #64748b; font-weight: 700;">ختم وتوقيع المورد</span>
          <div style="height: 24px;"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // 2x resolution for high-definition print quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 mm width
    const pageHeight = 297; // A4 mm height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `فاتورة_${order.orderNumber}.pdf`;
    pdf.save(filename);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
