/**
 * ============================================================
 * مكتبة الميزات المستقبلية — Feature Backlog
 * ============================================================
 * الغرض: حفظ جميع الأفكار والمقترحات البرمجية والتصميمية
 * المطروحة خلال جلسات التطوير، بحيث يمكن الرجوع إليها
 * وتفعيلها لاحقاً حسب خطة التطوير وحدود الاشتراكات.
 *
 * Purpose: Store all proposed features, design ideas, and
 * technical suggestions discussed during development sessions,
 * to be activated later according to the roadmap and
 * subscription tiers.
 * ============================================================
 */

export type FeatureStatus =
  | "proposed"       // مقترح — تمت مناقشته فقط
  | "approved"       // معتمد — تمت الموافقة عليه للتنفيذ
  | "in_progress"    // قيد التنفيذ
  | "completed"      // مكتمل — تم تطبيقه
  | "deferred"       // مؤجل — يحتاج مراجعة لاحقة
  | "rejected";      // مرفوض

export type FeaturePriority = "critical" | "high" | "medium" | "low";

export type FeatureCategory =
  | "auth"           // المصادقة والأدوار
  | "database"       // قاعدة البيانات والمخطط
  | "ui_ux"          // الواجهات والتجربة
  | "realtime"       // المزامنة اللحظية
  | "finance"        // المالية والمدفوعات
  | "inventory"      // المخزون والمنتجات
  | "orders"         // الطلبات والتتبع
  | "notifications"  // الإشعارات والتنبيهات
  | "analytics"      // التحليلات والتقارير
  | "admin"          // لوحة الإدارة
  | "supplier"       // واجهة المورد
  | "retailer"       // واجهة التاجر
  | "performance"    // الأداء والتحسين
  | "security"       // الأمان والصلاحيات
  | "integration";   // التكاملات الخارجية

export interface FeatureItem {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en?: string;
  category: FeatureCategory;
  priority: FeaturePriority;
  status: FeatureStatus;
  subscription_tier?: "free" | "basic" | "pro" | "enterprise" | "all";
  estimated_effort?: "small" | "medium" | "large" | "xlarge";
  dependencies?: string[];   // IDs of features this depends on
  notes?: string;
  date_proposed: string;     // ISO date string
  date_updated?: string;
}

// ============================================================
// قائمة الميزات المستقبلية — Feature Backlog List
// ============================================================

export const featureBacklog: FeatureItem[] = [

  // ── قاعدة البيانات والمخطط ──────────────────────────────
  {
    id: "DB-001",
    title_ar: "هيكل قاعدة البيانات الشامل",
    title_en: "Full Database & Backend Schema",
    description_ar:
      "تأسيس هيكل قاعدة بيانات متكامل يشمل: المستخدمين والأدوار، المنتجات والباركود، الطلبات وتتبع الحالات، المالية والديون، الإشعارات والتنبيهات — مع RLS كامل ومزامنة لحظية.",
    category: "database",
    priority: "critical",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "xlarge",
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم تطبيقه في migration: 20260805022000_enhanced_schema_v2.sql",
  },
  {
    id: "DB-002",
    title_ar: "دالة مسح الباركود اللحظية",
    title_en: "Real-time Barcode Lookup Function",
    description_ar:
      "ربط دالة get_product_by_barcode() مباشرة بجداول المنتجات للاستعلام والتحديث اللحظي عند مسح الباركود.",
    category: "database",
    priority: "high",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "small",
    dependencies: ["DB-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم تطبيقه ضمن migration DB-001 وخدمة productService.ts",
  },

  // ── المصادقة والأدوار ────────────────────────────────────
  {
    id: "AUTH-001",
    title_ar: "نظام الأدوار الثلاثة",
    title_en: "Three-Role Authentication System",
    description_ar:
      "ربط معرفات المستخدمين بنوع الحساب [admin, supplier, retailer] مع تخزين البيانات الشخصية والتجارية.",
    category: "auth",
    priority: "critical",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "large",
    date_proposed: "2026-08-04",
    date_updated: "2026-08-05",
  },

  // ── الواجهات والتجربة ────────────────────────────────────
  {
    id: "UI-001",
    title_ar: "عرض جميع المقترحات قبل التطبيق",
    title_en: "Show All Design Options Before Applying",
    description_ar:
      "عند تقديم مقترحات تصميمية أو برمجية، يتم عرض جميع الخيارات (الثلاثة) بعناوينها ومميزاتها أولاً، ثم انتظار تحديد المستخدم قبل التطبيق.",
    category: "ui_ux",
    priority: "high",
    status: "approved",
    subscription_tier: "all",
    estimated_effort: "small",
    date_proposed: "2026-08-05",
    notes: "قاعدة عمل معتمدة — تُطبَّق على جميع المقترحات القادمة",
  },

  // ── المزامنة اللحظية ─────────────────────────────────────
  {
    id: "RT-001",
    title_ar: "المزامنة اللحظية لجميع الجداول الرئيسية",
    title_en: "Real-time Subscriptions for Core Tables",
    description_ar:
      "تفعيل supabase_realtime publication لجداول: products, orders, order_items, supplier_orders, notifications, transactions, user_profiles.",
    category: "realtime",
    priority: "high",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "medium",
    dependencies: ["DB-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
  },
  {
    id: "RT-002",
    title_ar: "إصلاح تعارض أسماء قنوات Realtime",
    title_en: "Fix Realtime Channel Name Collisions",
    description_ar:
      "استبدال Date.now() بعداد ثابت على مستوى الوحدة عبر useRef لمنع تعارض أسماء القنوات في React StrictMode.",
    category: "realtime",
    priority: "high",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "small",
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم التطبيق في useRealtimeSubscription.ts",
  },

  // ── المالية والمدفوعات ───────────────────────────────────
  {
    id: "FIN-001",
    title_ar: "نظام المعاملات المالية والديون",
    title_en: "Finance & Debt Tracking System",
    description_ar:
      "سجل المعاملات المالية الحية بين المحلات والموردين بالدينار العراقي: المبلغ الكلي، المدفوع، المتبقي، حالة الدفع، وسجل الفواتير.",
    category: "finance",
    priority: "high",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "large",
    dependencies: ["DB-001", "AUTH-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم تطبيقه في transactionService.ts وجدول transactions",
  },
  {
    id: "FIN-002",
    title_ar: "تكامل Stripe للمدفوعات",
    title_en: "Stripe Payment Integration",
    description_ar:
      "تكامل بوابة Stripe لمعالجة المدفوعات الإلكترونية مع Edge Functions لتأكيد الدفع وإنشاء نوايا الدفع.",
    category: "finance",
    priority: "high",
    status: "completed",
    subscription_tier: "pro",
    estimated_effort: "large",
    date_proposed: "2026-08-04",
    date_updated: "2026-08-04",
    notes: "تم تطبيقه في supabase/functions/create-payment-intent وconfirm-payment",
  },

  // ── المخزون والمنتجات ────────────────────────────────────
  {
    id: "INV-001",
    title_ar: "دعم التخفيضات والعروض على المنتجات",
    title_en: "Product Discounts & Offers Support",
    description_ar:
      "إضافة حقول: نسبة الخصم، السعر بعد الخصم، تاريخ بداية ونهاية العرض — مع دالة getActiveOffers() لاسترجاع العروض النشطة.",
    category: "inventory",
    priority: "medium",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "medium",
    dependencies: ["DB-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم تطبيقه في productService.ts والمخطط المحسّن",
  },
  {
    id: "INV-002",
    title_ar: "تنبيه نفاذ المخزون",
    title_en: "Low Stock Alert Notifications",
    description_ar:
      "إرسال تنبيهات فورية للمورد عند وصول مخزون منتج إلى حد أدنى محدد.",
    category: "inventory",
    priority: "medium",
    status: "proposed",
    subscription_tier: "basic",
    estimated_effort: "medium",
    dependencies: ["DB-001", "NOTIF-001"],
    date_proposed: "2026-08-05",
  },

  // ── الإشعارات والتنبيهات ─────────────────────────────────
  {
    id: "NOTIF-001",
    title_ar: "نظام الإشعارات متعدد الأدوار",
    title_en: "Multi-Role Notification System",
    description_ar:
      "دعم التنبيهات الفورية لكل مستخدم حسب دوره: تغير حالة طلب، نفاذ مخزون، عروض جديدة، رسائل الدعم — مع حالات مقروء/غير مقروء ورابط مباشر.",
    category: "notifications",
    priority: "high",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "large",
    dependencies: ["DB-001", "AUTH-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
    notes: "تم تطبيقه في notificationService.ts وجدول notifications",
  },

  // ── الأمان والصلاحيات ────────────────────────────────────
  {
    id: "SEC-001",
    title_ar: "سياسات RLS الشاملة",
    title_en: "Comprehensive Row Level Security Policies",
    description_ar:
      "تفعيل سياسات الأمان على مستوى الصفوف لجميع الجداول بحيث لا يرى كل مستخدم إلا البيانات الخاصة بدوره فقط.",
    category: "security",
    priority: "critical",
    status: "completed",
    subscription_tier: "all",
    estimated_effort: "large",
    dependencies: ["DB-001", "AUTH-001"],
    date_proposed: "2026-08-05",
    date_updated: "2026-08-05",
  },

  // ── ميزات مستقبلية مقترحة ───────────────────────────────
  {
    id: "FUTURE-001",
    title_ar: "تقارير المبيعات والتحليلات المتقدمة",
    title_en: "Advanced Sales Reports & Analytics",
    description_ar:
      "لوحة تحليلات متقدمة تشمل: مخططات المبيعات الزمنية، أفضل المنتجات مبيعاً، تحليل الديون، ومقارنة الأداء بين الفترات.",
    category: "analytics",
    priority: "medium",
    status: "proposed",
    subscription_tier: "pro",
    estimated_effort: "large",
    dependencies: ["DB-001", "FIN-001"],
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-002",
    title_ar: "تطبيق الجوال (PWA)",
    title_en: "Mobile App / Progressive Web App",
    description_ar:
      "تحويل التطبيق إلى PWA يدعم التثبيت على الجوال والعمل في وضع عدم الاتصال مع مزامنة عند استعادة الاتصال.",
    category: "performance",
    priority: "low",
    status: "proposed",
    subscription_tier: "enterprise",
    estimated_effort: "xlarge",
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-003",
    title_ar: "نظام الفواتير الإلكترونية",
    title_en: "Electronic Invoice System",
    description_ar:
      "توليد فواتير PDF تلقائية لكل طلب مكتمل مع إمكانية الإرسال عبر البريد الإلكتروني أو واتساب.",
    category: "finance",
    priority: "medium",
    status: "proposed",
    subscription_tier: "basic",
    estimated_effort: "medium",
    dependencies: ["DB-001", "FIN-001"],
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-004",
    title_ar: "نظام التقييمات والمراجعات",
    title_en: "Ratings & Reviews System",
    description_ar:
      "السماح للتجار بتقييم الموردين والمنتجات بعد اكتمال الطلب، مع عرض متوسط التقييمات في الكتالوج.",
    category: "retailer",
    priority: "low",
    status: "proposed",
    subscription_tier: "pro",
    estimated_effort: "medium",
    dependencies: ["DB-001", "AUTH-001"],
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-005",
    title_ar: "نظام الولاء والنقاط",
    title_en: "Loyalty Points System",
    description_ar:
      "منح نقاط للتجار عند كل عملية شراء واستبدالها بخصومات أو مزايا إضافية.",
    category: "retailer",
    priority: "low",
    status: "proposed",
    subscription_tier: "enterprise",
    estimated_effort: "large",
    dependencies: ["DB-001", "FIN-001"],
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-006",
    title_ar: "نظام الدردشة المباشرة بين المورد والتاجر",
    title_en: "Live Chat Between Supplier & Retailer",
    description_ar:
      "قناة تواصل مباشرة داخل التطبيق بين المورد والتاجر لمناقشة الطلبات والأسعار.",
    category: "integration",
    priority: "medium",
    status: "proposed",
    subscription_tier: "pro",
    estimated_effort: "large",
    dependencies: ["DB-001", "AUTH-001", "RT-001"],
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-007",
    title_ar: "تكامل خرائط مناطق التوصيل",
    title_en: "Delivery Zones Map Integration",
    description_ar:
      "عرض مناطق التوصيل على خريطة تفاعلية مع إمكانية تحديد نطاق التوصيل جغرافياً لكل مورد.",
    category: "supplier",
    priority: "medium",
    status: "proposed",
    subscription_tier: "pro",
    estimated_effort: "large",
    date_proposed: "2026-08-05",
  },
  {
    id: "FUTURE-008",
    title_ar: "نظام الاشتراكات والخطط",
    title_en: "Subscription Plans & Tiers",
    description_ar:
      "إدارة خطط الاشتراك (مجاني، أساسي، احترافي، مؤسسي) مع تفعيل/تعطيل الميزات تلقائياً حسب الخطة.",
    category: "admin",
    priority: "high",
    status: "proposed",
    subscription_tier: "all",
    estimated_effort: "xlarge",
    dependencies: ["AUTH-001", "FIN-002"],
    date_proposed: "2026-08-05",
  },
];

// ============================================================
// دوال المساعدة — Helper Functions
// ============================================================

/** استرجاع الميزات حسب الحالة */
export function getFeaturesByStatus(status: FeatureStatus): FeatureItem[] {
  return featureBacklog.filter((f) => f.status === status);
}

/** استرجاع الميزات حسب الفئة */
export function getFeaturesByCategory(category: FeatureCategory): FeatureItem[] {
  return featureBacklog.filter((f) => f.category === category);
}

/** استرجاع الميزات حسب الأولوية */
export function getFeaturesByPriority(priority: FeaturePriority): FeatureItem[] {
  return featureBacklog.filter((f) => f.priority === priority);
}

/** استرجاع الميزات المقترحة غير المطبقة بعد */
export function getPendingFeatures(): FeatureItem[] {
  return featureBacklog.filter((f) =>
    f.status === "proposed" || f.status === "approved"
  );
}

/** ملخص إحصائي للمكتبة */
export function getBacklogSummary() {
  const total = featureBacklog.length;
  const byStatus = featureBacklog.reduce((acc, f) => {
    acc[f.status] = (acc[f.status] || 0) + 1;
    return acc;
  }, {} as Record<FeatureStatus, number>);

  return { total, byStatus };
}
