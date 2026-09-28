/**
 * ════════════════════════════════════════════════════════
 * 📊 النظام المالي — جُمْلَتِي
 * ════════════════════════════════════════════════════════
 * 
 * النموذج المختار:
 *   • السوبرماركت: مجاني بالكامل
 *   • المندوب: مجاني بالكامل
 *   • تاجر الجملة: يختار أحد خيارين:
 *       A) بدون اشتراك → 1% عمولة على كل طلب
 *       B) اشتراك 25,000 د.ع/شهر → 0% عمولة
 * 
 * الحكمة:
 *   • السوبرماركت مجاني لأنه القلب (كلما زاد، زادت قيمة النظام)
 *   • المندوب مجاني لأنه الخدمة (لا أحد يعمل بأجر مقتطع)
 *   • تاجر الجملة يدفع رمزياً (1% مقبولة جداً في السوق العراقي)
 *   • المرونة: تاجر صغير يبدأ مجاناً فعلياً، تاجر كبير يوفّر بالاشتراك
 */

export const PRICING = {
  /** العملة */
  currency: 'IQD',
  symbol: 'د.ع',

  /** الأدوار المجانية */
  freeRoles: ['retailer', 'delivery'] as const,

  /** تاجر الجملة — خيارات الدفع */
  supplier: {
    /** الخيار A: بدون اشتراك */
    payPerOrder: {
      id: 'pay_per_order',
      label: 'بدون اشتراك',
      description: 'ادفع 1% فقط عند كل طلب',
      commissionRate: 0.01, // 1%
      monthlyFee: 0,
    },
    /** الخيار B: اشتراك شهري */
    subscription: {
      id: 'subscription',
      label: 'اشتراك شهري',
      description: '25,000 د.ع شهرياً — بدون أي عمولة',
      commissionRate: 0,
      monthlyFee: 25000,
    },
  },

  /** الميزات المدفوعة الإضافية */
  addons: {
    featured: {
      id: 'featured',
      label: 'تاجر مميّز ⭐',
      description: 'تظهر أولاً في نتائج البحث',
      price: 30000,
      period: 'monthly',
    },
    advancedReports: {
      id: 'advanced_reports',
      label: 'تقارير متقدمة 📊',
      description: 'رسوم بيانية وتقارير مفصلة',
      price: 15000,
      period: 'monthly',
    },
    sms: {
      id: 'sms',
      label: 'رسائل SMS 📱',
      description: 'أرسل إشعارات لعملائك',
      price: 100,
      period: 'per_message',
    },
    qrPrint: {
      id: 'qr_print',
      label: 'QR مطبوع 🔲',
      description: 'بطاقات QR جاهزة للملصقات',
      price: 10000,
      period: 'per_100',
    },
  },
} as const;

/** احسب عمولة طلب معيّن */
export function calcCommission(
  orderTotal: number,
  supplierPlan: 'pay_per_order' | 'subscription'
): number {
  if (supplierPlan === 'subscription') return 0;
  return Math.round(orderTotal * PRICING.supplier.payPerOrder.commissionRate);
}

/** هل تجاوز التاجر الحد المجاني؟ */
export const FREE_ORDERS_LIMIT = 0; // لا حد — كل طلب له 1%

/** عدد الطلبات المطلوبة لتوفير الاشتراك */
export function breakEvenOrders(avgOrderValue = 80000): number {
  const commissionPerOrder = avgOrderValue * PRICING.supplier.payPerOrder.commissionRate;
  return Math.ceil(PRICING.supplier.subscription.monthlyFee / commissionPerOrder);
}

/** رسالة تحفيزية للتاجر حسب استخدمه */
export function pricingHint(orderCount: number, avgOrderValue = 80000): string {
  const commissionCost = orderCount * avgOrderValue * PRICING.supplier.payPerOrder.commissionRate;
  const subscriptionCost = PRICING.supplier.subscription.monthlyFee;
  
  if (commissionCost > subscriptionCost) {
    const saving = Math.round(commissionCost - subscriptionCost);
    return `💡 لو اشتركت هذا الشهر، ستوفّر ${saving.toLocaleString('ar-IQ')} د.ع`;
  }
  return '';
}
