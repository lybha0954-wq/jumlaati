/**
 * ============================================================
 * مخطط المشروع الرئيسي — Master Project Blueprint
 * ============================================================
 * الغرض: حفظ جميع تفاصيل المشروع المتفق عليها كثوابت TypeScript
 * تشمل: هيكل الشاشات لكل دور، الميزات التقنية، مخطط قاعدة البيانات،
 * وقيود الموارد — للرجوع إليها في أي وقت خلال التطوير.
 *
 * Purpose: Store all agreed project details as TypeScript constants
 * including: screen structures per role, technical features,
 * database schema, and resource constraints.
 * ============================================================
 */

// ============================================================
// معلومات المشروع الأساسية — Core Project Info
// ============================================================

export const PROJECT_INFO = {
  name_ar: "مِسْوَاقِي جُمْلَة",
  name_en: "Jumlaati",
  tagline_ar: "منصة البيع بالجملة للتجار والموردين في العراق",
  tagline_en: "B2B Wholesale Platform for Iraqi Retailers & Suppliers",
  currency: "د.ع",
  currency_code: "IQD",
  locale: "ar-IQ",
  direction: "rtl",
  url: "https://jumlaati1280.builtwithrocket.new",
  version: "1.0.0",
  last_updated: "2026-08-05",
} as const;

// ============================================================
// الأدوار — User Roles
// ============================================================

export type UserRole = "retailer" | "supplier" | "admin";

export const USER_ROLES = {
  RETAILER: "retailer" as UserRole,
  SUPPLIER: "supplier" as UserRole,
  ADMIN: "admin" as UserRole,
} as const;

export const ROLE_LABELS: Record<UserRole, { ar: string; en: string }> = {
  retailer: { ar: "صاحب محل / سوبرماركت", en: "Retailer / Store Owner" },
  supplier: { ar: "تاجر جملة / مجهز", en: "Wholesale Supplier" },
  admin: { ar: "مدير النظام", en: "System Administrator" },
};

// ============================================================
// هيكل الشاشات لكل دور — Screen Structure Per Role
// ============================================================

export interface ScreenDefinition {
  id: string;
  route: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  nav_icon: string;
  nav_label_ar: string;
  is_bottom_nav: boolean;
  roles: UserRole[];
}

export const SCREENS: ScreenDefinition[] = [
  // ── شاشات التاجر (Retailer) ──────────────────────────────
  {
    id: "retailer-home",
    route: "/retailer-home",
    title_ar: "الرئيسية — التاجر",
    title_en: "Retailer Home",
    description_ar: "عروض اليوم، البحث السريع، مسح الباركود، أبرز الموردين",
    nav_icon: "🏠",
    nav_label_ar: "الرئيسية",
    is_bottom_nav: true,
    roles: ["retailer"],
  },
  {
    id: "retailer-catalog",
    route: "/retailer-catalog",
    title_ar: "كتالوج المنتجات",
    title_en: "Product Catalog",
    description_ar: "تصفح المنتجات حسب الفئة، البحث بالاسم أو الباركود، إضافة للسلة",
    nav_icon: "📦",
    nav_label_ar: "المنتجات",
    is_bottom_nav: true,
    roles: ["retailer"],
  },
  {
    id: "product-browse",
    route: "/product-browse",
    title_ar: "استعراض المنتجات",
    title_en: "Browse Products",
    description_ar: "استعراض شامل لجميع المنتجات من جميع الموردين مع الفلترة والتصفية",
    nav_icon: "🔍",
    nav_label_ar: "استعراض",
    is_bottom_nav: false,
    roles: ["retailer"],
  },
  {
    id: "retailer-cart",
    route: "/retailer-cart",
    title_ar: "سلة الشراء",
    title_en: "Shopping Cart",
    description_ar: "مراجعة المنتجات المختارة، تعديل الكميات، حساب الإجمالي",
    nav_icon: "🛒",
    nav_label_ar: "السلة",
    is_bottom_nav: true,
    roles: ["retailer"],
  },
  {
    id: "retailer-checkout",
    route: "/retailer-checkout",
    title_ar: "إتمام الطلب",
    title_en: "Checkout",
    description_ar: "تأكيد الطلب، اختيار طريقة الدفع، تفاصيل التوصيل",
    nav_icon: "✅",
    nav_label_ar: "الدفع",
    is_bottom_nav: false,
    roles: ["retailer"],
  },
  {
    id: "retailer-orders",
    route: "/retailer-orders",
    title_ar: "طلباتي",
    title_en: "My Orders",
    description_ar: "تتبع حالة الطلبات الحالية والسابقة، تفاصيل كل طلب",
    nav_icon: "📋",
    nav_label_ar: "طلباتي",
    is_bottom_nav: false,
    roles: ["retailer"],
  },
  {
    id: "retailer-ledger",
    route: "/retailer-ledger",
    title_ar: "دفتر الحسابات",
    title_en: "Retailer Ledger",
    description_ar: "سجل الديون والمدفوعات مع كل مورد، المبالغ المتبقية",
    nav_icon: "📒",
    nav_label_ar: "الحسابات",
    is_bottom_nav: false,
    roles: ["retailer"],
  },
  {
    id: "retailer-profile",
    route: "/retailer-profile",
    title_ar: "الملف الشخصي",
    title_en: "Retailer Profile",
    description_ar: "بيانات المحل، معلومات الاتصال، إعدادات الحساب",
    nav_icon: "👤",
    nav_label_ar: "حسابي",
    is_bottom_nav: true,
    roles: ["retailer"],
  },
  {
    id: "retailer-account",
    route: "/retailer-account",
    title_ar: "إعدادات الحساب",
    title_en: "Account Settings",
    description_ar: "تغيير كلمة المرور، إعدادات الإشعارات، تسجيل الخروج",
    nav_icon: "⚙️",
    nav_label_ar: "الإعدادات",
    is_bottom_nav: false,
    roles: ["retailer"],
  },
  {
    id: "retailer-shop",
    route: "/retailer-shop",
    title_ar: "متجر التاجر",
    title_en: "Retailer Shop",
    description_ar: "واجهة المتجر الشاملة للتاجر مع جميع الوظائف",
    nav_icon: "🏪",
    nav_label_ar: "المتجر",
    is_bottom_nav: false,
    roles: ["retailer"],
  },

  // ── شاشات المورد (Supplier) ──────────────────────────────
  {
    id: "supplier-dashboard",
    route: "/supplier-dashboard",
    title_ar: "لوحة المورد",
    title_en: "Supplier Dashboard",
    description_ar: "ملخص المبيعات اليومية، الطلبات المعلقة، أبرز المؤشرات",
    nav_icon: "📊",
    nav_label_ar: "الرئيسية",
    is_bottom_nav: true,
    roles: ["supplier"],
  },
  {
    id: "supplier-catalog",
    route: "/supplier-catalog",
    title_ar: "إدارة المنتجات",
    title_en: "Product Management",
    description_ar: "إضافة وتعديل وحذف المنتجات، إدارة الأسعار والعروض",
    nav_icon: "📦",
    nav_label_ar: "المنتجات",
    is_bottom_nav: true,
    roles: ["supplier"],
  },
  {
    id: "inventory-management",
    route: "/inventory-management",
    title_ar: "إدارة المخزون",
    title_en: "Inventory Management",
    description_ar: "تتبع المخزون، تنبيهات النفاذ، تحديث الكميات، مسح الباركود",
    nav_icon: "🏭",
    nav_label_ar: "المخزون",
    is_bottom_nav: false,
    roles: ["supplier"],
  },
  {
    id: "supplier-incoming-orders",
    route: "/supplier-incoming-orders",
    title_ar: "الطلبات الواردة",
    title_en: "Incoming Orders",
    description_ar: "استقبال ومراجعة وقبول أو رفض الطلبات الواردة من التجار",
    nav_icon: "📥",
    nav_label_ar: "الطلبات",
    is_bottom_nav: true,
    roles: ["supplier"],
  },
  {
    id: "supplier-orders",
    route: "/supplier-orders",
    title_ar: "سجل الطلبات",
    title_en: "Orders History",
    description_ar: "سجل جميع الطلبات المعالجة والمكتملة والملغاة",
    nav_icon: "📋",
    nav_label_ar: "السجل",
    is_bottom_nav: false,
    roles: ["supplier"],
  },
  {
    id: "supplier-finance",
    route: "/supplier-finance",
    title_ar: "المالية والحسابات",
    title_en: "Finance & Accounts",
    description_ar: "سجل الإيرادات، الديون المستحقة، المدفوعات، التقارير المالية",
    nav_icon: "💰",
    nav_label_ar: "المالية",
    is_bottom_nav: false,
    roles: ["supplier"],
  },
  {
    id: "stores-customers",
    route: "/stores-customers",
    title_ar: "المحلات والعملاء",
    title_en: "Stores & Customers",
    description_ar: "قائمة التجار المتعاملين، تفاصيل كل عميل، سجل معاملاته",
    nav_icon: "🏪",
    nav_label_ar: "العملاء",
    is_bottom_nav: false,
    roles: ["supplier"],
  },
  {
    id: "delivery-zones",
    route: "/delivery-zones",
    title_ar: "مناطق التوصيل",
    title_en: "Delivery Zones",
    description_ar: "تحديد وإدارة مناطق التوصيل الجغرافية للمورد",
    nav_icon: "🗺️",
    nav_label_ar: "التوصيل",
    is_bottom_nav: false,
    roles: ["supplier"],
  },
  {
    id: "support-settings",
    route: "/support-settings",
    title_ar: "الدعم والإعدادات",
    title_en: "Support & Settings",
    description_ar: "الدعم الفني، إعدادات الحساب، تسجيل الخروج",
    nav_icon: "⚙️",
    nav_label_ar: "الإعدادات",
    is_bottom_nav: true,
    roles: ["supplier"],
  },

  // ── شاشات المدير (Admin) ─────────────────────────────────
  {
    id: "admin-dashboard",
    route: "/admin-dashboard",
    title_ar: "لوحة الإدارة",
    title_en: "Admin Dashboard",
    description_ar: "نظرة عامة على المنصة: إجمالي التداولات، المستخدمين النشطين، الطلبات",
    nav_icon: "⚡",
    nav_label_ar: "التحكم",
    is_bottom_nav: true,
    roles: ["admin"],
  },
  {
    id: "admin-users",
    route: "/admin-users",
    title_ar: "إدارة المستخدمين",
    title_en: "User Management",
    description_ar: "إدارة حسابات التجار والموردين، التفعيل والتعليق، تغيير الأدوار",
    nav_icon: "👥",
    nav_label_ar: "المستخدمون",
    is_bottom_nav: true,
    roles: ["admin"],
  },
  {
    id: "admin-transactions",
    route: "/admin-transactions",
    title_ar: "المعاملات المالية",
    title_en: "Financial Transactions",
    description_ar: "مراقبة جميع المعاملات المالية، تسوية الديون، الفواتير",
    nav_icon: "💳",
    nav_label_ar: "المالية",
    is_bottom_nav: true,
    roles: ["admin"],
  },
  {
    id: "admin-hub",
    route: "/admin-hub",
    title_ar: "مركز الإدارة",
    title_en: "Admin Hub",
    description_ar: "مركز التحكم الشامل: الإعلانات، الموافقات، تذاكر الدعم",
    nav_icon: "🎛️",
    nav_label_ar: "المركز",
    is_bottom_nav: false,
    roles: ["admin"],
  },
  {
    id: "admin-settings",
    route: "/admin-settings",
    title_ar: "إعدادات النظام",
    title_en: "System Settings",
    description_ar: "إعدادات المنصة العامة، العمولات، خطط الاشتراك",
    nav_icon: "⚙️",
    nav_label_ar: "الإعدادات",
    is_bottom_nav: true,
    roles: ["admin"],
  },
  {
    id: "financials",
    route: "/financials",
    title_ar: "التقارير المالية",
    title_en: "Financial Reports",
    description_ar: "تقارير مالية شاملة للمنصة: الإيرادات، العمولات، الاتجاهات",
    nav_icon: "📈",
    nav_label_ar: "التقارير",
    is_bottom_nav: false,
    roles: ["admin"],
  },
  {
    id: "orders",
    route: "/orders",
    title_ar: "جميع الطلبات",
    title_en: "All Orders",
    description_ar: "عرض موحد لجميع طلبات المنصة مع الفلترة والبحث",
    nav_icon: "📋",
    nav_label_ar: "الطلبات",
    is_bottom_nav: false,
    roles: ["admin"],
  },
  {
    id: "notifications",
    route: "/notifications",
    title_ar: "مركز الإشعارات",
    title_en: "Notifications Center",
    description_ar: "إدارة وإرسال الإشعارات لجميع المستخدمين",
    nav_icon: "🔔",
    nav_label_ar: "الإشعارات",
    is_bottom_nav: false,
    roles: ["admin", "supplier", "retailer"],
  },

  // ── شاشات مشتركة (Shared) ───────────────────────────────
  {
    id: "sign-up-login",
    route: "/sign-up-login",
    title_ar: "تسجيل الدخول / إنشاء حساب",
    title_en: "Sign Up / Login",
    description_ar: "صفحة المصادقة الموحدة: تسجيل دخول، إنشاء حساب، اختيار الدور",
    nav_icon: "🔐",
    nav_label_ar: "الدخول",
    is_bottom_nav: false,
    roles: ["retailer", "supplier", "admin"],
  },
];

// ============================================================
// مخطط قاعدة البيانات — Database Schema
// ============================================================

export interface TableDefinition {
  name: string;
  description_ar: string;
  description_en: string;
  primary_key: string;
  rls_enabled: boolean;
  realtime_enabled: boolean;
  columns: ColumnDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  default?: string;
  description_ar: string;
}

export const DATABASE_SCHEMA: TableDefinition[] = [
  {
    name: "profiles",
    description_ar: "بيانات المستخدمين والأدوار — مرتبط بـ auth.users",
    description_en: "User profiles and roles — linked to auth.users",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "UUID", nullable: false, description_ar: "معرف فريد — مرجع auth.users" },
      { name: "full_name", type: "TEXT", nullable: false, description_ar: "الاسم الكامل" },
      { name: "store_name", type: "TEXT", nullable: true, description_ar: "اسم المحل أو الشركة" },
      { name: "role", type: "TEXT", nullable: false, default: "retailer", description_ar: "الدور: retailer | supplier | admin" },
      { name: "phone", type: "TEXT", nullable: true, description_ar: "رقم الهاتف" },
      { name: "avatar_url", type: "TEXT", nullable: true, description_ar: "رابط صورة الملف الشخصي" },
      { name: "is_active", type: "BOOLEAN", nullable: false, default: "true", description_ar: "حالة تفعيل الحساب" },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "تاريخ الإنشاء" },
    ],
  },
  {
    name: "products",
    description_ar: "المنتجات والمخزون — مرتبط بالمورد",
    description_en: "Products and inventory — linked to supplier",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "معرف تسلسلي" },
      { name: "supplier_id", type: "UUID", nullable: false, description_ar: "معرف المورد — مرجع profiles" },
      { name: "name", type: "TEXT", nullable: false, description_ar: "اسم المنتج" },
      { name: "barcode", type: "TEXT", nullable: true, description_ar: "رمز الباركود (فريد)" },
      { name: "category", type: "TEXT", nullable: false, description_ar: "فئة المنتج" },
      { name: "price", type: "NUMERIC", nullable: false, description_ar: "السعر بالدينار العراقي" },
      { name: "original_price", type: "NUMERIC", nullable: true, description_ar: "السعر الأصلي قبل الخصم" },
      { name: "discount_percent", type: "NUMERIC", nullable: true, description_ar: "نسبة الخصم %" },
      { name: "stock", type: "INT", nullable: false, default: "0", description_ar: "الكمية المتاحة في المخزون" },
      { name: "min_stock_alert", type: "INT", nullable: true, default: "10", description_ar: "حد التنبيه عند نفاذ المخزون" },
      { name: "is_offer", type: "BOOLEAN", nullable: false, default: "false", description_ar: "هل المنتج في عرض؟" },
      { name: "offer_start", type: "TIMESTAMPTZ", nullable: true, description_ar: "تاريخ بداية العرض" },
      { name: "offer_end", type: "TIMESTAMPTZ", nullable: true, description_ar: "تاريخ نهاية العرض" },
      { name: "image_url", type: "TEXT", nullable: true, description_ar: "رابط صورة المنتج" },
      { name: "description", type: "TEXT", nullable: true, description_ar: "وصف المنتج" },
      { name: "unit", type: "TEXT", nullable: true, description_ar: "وحدة القياس (كغم، ليتر، قطعة...)" },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "تاريخ الإضافة" },
    ],
  },
  {
    name: "orders",
    description_ar: "الطلبات بين التجار والموردين",
    description_en: "Orders between retailers and suppliers",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "رقم الطلب" },
      { name: "retailer_id", type: "UUID", nullable: false, description_ar: "معرف التاجر — مرجع profiles" },
      { name: "supplier_id", type: "UUID", nullable: false, description_ar: "معرف المورد — مرجع profiles" },
      { name: "total_amount", type: "NUMERIC", nullable: false, description_ar: "المبلغ الإجمالي بالدينار العراقي" },
      { name: "status", type: "TEXT", nullable: false, default: "pending", description_ar: "الحالة: pending|processing|shipped|completed|cancelled" },
      { name: "payment_status", type: "TEXT", nullable: true, default: "unpaid", description_ar: "حالة الدفع: unpaid|partial|paid" },
      { name: "notes", type: "TEXT", nullable: true, description_ar: "ملاحظات الطلب" },
      { name: "stripe_payment_intent_id", type: "TEXT", nullable: true, description_ar: "معرف نية الدفع في Stripe" },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "تاريخ الطلب" },
    ],
  },
  {
    name: "order_items",
    description_ar: "تفاصيل عناصر كل طلب",
    description_en: "Line items for each order",
    primary_key: "id",
    rls_enabled: false,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "معرف تسلسلي" },
      { name: "order_id", type: "BIGINT", nullable: false, description_ar: "معرف الطلب — مرجع orders" },
      { name: "product_id", type: "BIGINT", nullable: false, description_ar: "معرف المنتج — مرجع products" },
      { name: "quantity", type: "INT", nullable: false, description_ar: "الكمية المطلوبة" },
      { name: "unit_price", type: "NUMERIC", nullable: false, description_ar: "سعر الوحدة وقت الطلب" },
    ],
  },
  {
    name: "transactions",
    description_ar: "سجل المعاملات المالية والديون",
    description_en: "Financial transactions and debt tracking",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "معرف تسلسلي" },
      { name: "retailer_id", type: "UUID", nullable: false, description_ar: "معرف التاجر — مرجع profiles" },
      { name: "supplier_id", type: "UUID", nullable: false, description_ar: "معرف المورد — مرجع profiles" },
      { name: "order_id", type: "BIGINT", nullable: true, description_ar: "معرف الطلب المرتبط — مرجع orders" },
      { name: "total_dept", type: "NUMERIC", nullable: false, default: "0", description_ar: "إجمالي الدين بالدينار العراقي" },
      { name: "paid_amount", type: "NUMERIC", nullable: false, default: "0", description_ar: "المبلغ المدفوع" },
      { name: "remaining_amount", type: "NUMERIC", nullable: false, description_ar: "المبلغ المتبقي (محسوب تلقائياً)" },
      { name: "payment_method", type: "TEXT", nullable: true, description_ar: "طريقة الدفع: cash|stripe|credit" },
      { name: "updated_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "آخر تحديث" },
    ],
  },
  {
    name: "notifications",
    description_ar: "الإشعارات والتنبيهات لجميع المستخدمين",
    description_en: "Notifications and alerts for all users",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "معرف تسلسلي" },
      { name: "user_id", type: "UUID", nullable: false, description_ar: "معرف المستخدم المستهدف — مرجع profiles" },
      { name: "title", type: "TEXT", nullable: false, description_ar: "عنوان الإشعار" },
      { name: "message", type: "TEXT", nullable: false, description_ar: "نص الإشعار" },
      { name: "type", type: "TEXT", nullable: false, description_ar: "النوع: order|stock|payment|system|offer" },
      { name: "is_read", type: "BOOLEAN", nullable: false, default: "false", description_ar: "هل تمت القراءة؟" },
      { name: "link", type: "TEXT", nullable: true, description_ar: "رابط الصفحة المرتبطة" },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "تاريخ الإشعار" },
    ],
  },
  {
    name: "supplier_orders",
    description_ar: "طلبات المورد الخاصة (من موردين آخرين)",
    description_en: "Supplier's own purchase orders",
    primary_key: "id",
    rls_enabled: true,
    realtime_enabled: true,
    columns: [
      { name: "id", type: "BIGSERIAL", nullable: false, description_ar: "معرف تسلسلي" },
      { name: "supplier_id", type: "UUID", nullable: false, description_ar: "معرف المورد — مرجع profiles" },
      { name: "total_amount", type: "NUMERIC", nullable: false, description_ar: "المبلغ الإجمالي" },
      { name: "status", type: "TEXT", nullable: false, default: "pending", description_ar: "الحالة" },
      { name: "created_at", type: "TIMESTAMPTZ", nullable: false, default: "now()", description_ar: "تاريخ الإنشاء" },
    ],
  },
];

// ============================================================
// الميزات التقنية المطبقة — Implemented Technical Features
// ============================================================

export interface TechnicalFeature {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  implemented: boolean;
  file_path?: string;
}

export const TECHNICAL_FEATURES: TechnicalFeature[] = [
  // ── المصادقة ─────────────────────────────────────────────
  {
    id: "auth-supabase",
    name_ar: "مصادقة Supabase",
    name_en: "Supabase Authentication",
    description_ar: "تسجيل دخول وإنشاء حساب عبر Supabase Auth مع ربط الأدوار",
    implemented: true,
    file_path: "src/contexts/AuthContext.tsx",
  },
  {
    id: "auth-roles",
    name_ar: "نظام الأدوار الثلاثة",
    name_en: "Three-Role System",
    description_ar: "retailer | supplier | admin — مع توجيه تلقائي لكل دور",
    implemented: true,
    file_path: "src/app/sign-up-login/components/AuthContent.tsx",
  },
  {
    id: "auth-demo",
    name_ar: "بيانات تجريبية للاختبار",
    name_en: "Demo Credentials",
    description_ar: "حسابات تجريبية جاهزة لكل دور لتسهيل الاختبار",
    implemented: true,
    file_path: "src/app/sign-up-login/components/DemoCredentials.tsx",
  },

  // ── قاعدة البيانات ───────────────────────────────────────
  {
    id: "db-schema",
    name_ar: "مخطط قاعدة البيانات الشامل",
    name_en: "Full Database Schema",
    description_ar: "7 جداول رئيسية مع RLS وعلاقات كاملة",
    implemented: true,
    file_path: "supabase/migrations/20260805022000_enhanced_schema_v2.sql",
  },
  {
    id: "db-rls",
    name_ar: "سياسات الأمان RLS",
    name_en: "Row Level Security Policies",
    description_ar: "حماية البيانات على مستوى الصفوف لكل جدول",
    implemented: true,
    file_path: "supabase/migrations/20260805022000_enhanced_schema_v2.sql",
  },
  {
    id: "db-realtime",
    name_ar: "المزامنة اللحظية",
    name_en: "Real-time Subscriptions",
    description_ar: "تفعيل supabase_realtime لجميع الجداول الرئيسية",
    implemented: true,
    file_path: "src/hooks/useRealtimeSubscription.ts",
  },
  {
    id: "db-barcode",
    name_ar: "البحث بالباركود",
    name_en: "Barcode Search",
    description_ar: "دالة get_product_by_barcode() للبحث المباشر",
    implemented: true,
    file_path: "src/lib/services/productService.ts",
  },

  // ── الخدمات ──────────────────────────────────────────────
  {
    id: "svc-products",
    name_ar: "خدمة المنتجات",
    name_en: "Product Service",
    description_ar: "CRUD كامل للمنتجات مع دعم العروض والخصومات",
    implemented: true,
    file_path: "src/lib/services/productService.ts",
  },
  {
    id: "svc-orders",
    name_ar: "خدمة الطلبات",
    name_en: "Order Service",
    description_ar: "إنشاء وتتبع وتحديث حالات الطلبات",
    implemented: true,
    file_path: "src/lib/services/orderService.ts",
  },
  {
    id: "svc-finance",
    name_ar: "خدمة المالية",
    name_en: "Financial Service",
    description_ar: "تتبع الإيرادات والمصروفات والتقارير المالية",
    implemented: true,
    file_path: "src/lib/services/financialService.ts",
  },
  {
    id: "svc-transactions",
    name_ar: "خدمة المعاملات",
    name_en: "Transaction Service",
    description_ar: "سجل الديون والمدفوعات بين التجار والموردين",
    implemented: true,
    file_path: "src/lib/services/transactionService.ts",
  },
  {
    id: "svc-notifications",
    name_ar: "خدمة الإشعارات",
    name_en: "Notification Service",
    description_ar: "إرسال وإدارة الإشعارات لجميع الأدوار",
    implemented: true,
    file_path: "src/lib/services/notificationService.ts",
  },
  {
    id: "svc-supplier",
    name_ar: "خدمة المورد",
    name_en: "Supplier Service",
    description_ar: "بيانات الموردين وإحصاءاتهم",
    implemented: true,
    file_path: "src/lib/services/supplierService.ts",
  },
  {
    id: "svc-store",
    name_ar: "خدمة المحلات",
    name_en: "Store Service",
    description_ar: "بيانات المحلات والتجار",
    implemented: true,
    file_path: "src/lib/services/storeService.ts",
  },

  // ── المدفوعات ────────────────────────────────────────────
  {
    id: "stripe-integration",
    name_ar: "تكامل Stripe",
    name_en: "Stripe Payment Integration",
    description_ar: "معالجة المدفوعات الإلكترونية عبر Stripe",
    implemented: true,
    file_path: "src/lib/stripe/client.ts",
  },
  {
    id: "stripe-edge-create",
    name_ar: "Edge Function: إنشاء نية الدفع",
    name_en: "Edge Function: Create Payment Intent",
    description_ar: "Supabase Edge Function لإنشاء PaymentIntent في Stripe",
    implemented: true,
    file_path: "supabase/functions/create-payment-intent/index.ts",
  },
  {
    id: "stripe-edge-confirm",
    name_ar: "Edge Function: تأكيد الدفع",
    name_en: "Edge Function: Confirm Payment",
    description_ar: "Supabase Edge Function لتأكيد الدفع وتحديث حالة الطلب",
    implemented: true,
    file_path: "supabase/functions/confirm-payment/index.ts",
  },

  // ── المكونات المشتركة ────────────────────────────────────
  {
    id: "ui-app-layout",
    name_ar: "تخطيط التطبيق الموحد",
    name_en: "Unified App Layout",
    description_ar: "AppLayout مع Topbar وSidebar وBottomNavBar",
    implemented: true,
    file_path: "src/components/AppLayout.tsx",
  },
  {
    id: "ui-notifications-center",
    name_ar: "مركز الإشعارات الموحد",
    name_en: "Unified Notification Center",
    description_ar: "مركز إشعارات مشترك لجميع الأدوار",
    implemented: true,
    file_path: "src/components/UnifiedNotificationCenter.tsx",
  },
  {
    id: "ui-commission-store",
    name_ar: "متجر العمولات",
    name_en: "Commission Store",
    description_ar: "إدارة نسب العمولات على المعاملات",
    implemented: true,
    file_path: "src/lib/commissionStore.ts",
  },
];

// ============================================================
// قيود الموارد والاشتراكات — Resource Constraints
// ============================================================

export const RESOURCE_CONSTRAINTS = {
  // حدود المنصة
  platform: {
    max_screens_per_request: 6,
    framework: "Next.js 15",
    language: "TypeScript",
    styling: "Tailwind CSS v3",
    database: "Supabase (PostgreSQL)",
    payments: "Stripe",
    hosting: "Rocket.new",
  },

  // حدود الملفات
  files: {
    max_lines_per_file: 500,
    css_editable: ["src/styles/tailwind.css", "tailwind.config.js"],
    css_readonly: ["src/styles/index.css"],
    config_readonly: ["next.config.mjs"],
  },

  // خطط الاشتراك والميزات
  subscription_tiers: {
    free: {
      label_ar: "مجاني",
      features: ["تصفح المنتجات", "إنشاء حساب", "عرض الطلبات"],
    },
    basic: {
      label_ar: "أساسي",
      features: ["إدارة المخزون", "تتبع الطلبات", "الإشعارات", "الفواتير الإلكترونية"],
    },
    pro: {
      label_ar: "احترافي",
      features: ["المدفوعات الإلكترونية", "التحليلات المتقدمة", "الدردشة المباشرة", "مناطق التوصيل"],
    },
    enterprise: {
      label_ar: "مؤسسي",
      features: ["PWA", "نظام الولاء", "API مخصص", "دعم أولوية"],
    },
  },

  // حدود قاعدة البيانات
  database: {
    max_tables: 20,
    rls_required: true,
    realtime_tables: ["products", "orders", "order_items", "supplier_orders", "notifications", "transactions", "profiles"],
    currency: "IQD",
    currency_symbol: "د.ع",
  },
} as const;

// ============================================================
// قواعد العمل المتفق عليها — Agreed Working Rules
// ============================================================

export const WORKING_RULES = [
  {
    id: "RULE-001",
    title_ar: "عرض الخيارات قبل التطبيق",
    description_ar: "عند تقديم مقترحات تصميمية أو برمجية، يتم عرض جميع الخيارات بعناوينها ومميزاتها أولاً، ثم انتظار تحديد المستخدم قبل التطبيق.",
  },
  {
    id: "RULE-002",
    title_ar: "الحفاظ على الكود الموجود",
    description_ar: "لا يتم حذف أو تعديل أي كود موجود إلا إذا طُلب ذلك صراحةً.",
  },
  {
    id: "RULE-003",
    title_ar: "الدينار العراقي كعملة افتراضية",
    description_ar: "جميع المبالغ المالية تُعرض بالدينار العراقي (د.ع) ما لم يُحدد خلاف ذلك.",
  },
  {
    id: "RULE-004",
    title_ar: "دعم RTL الكامل",
    description_ar: "جميع الواجهات تدعم الاتجاه من اليمين إلى اليسار (RTL) للغة العربية.",
  },
  {
    id: "RULE-005",
    title_ar: "تصميم Mobile-First",
    description_ar: "التصميم يبدأ من الجوال (max-w-md) ثم يتوسع للشاشات الأكبر.",
  },
  {
    id: "RULE-006",
    title_ar: "لا ملفات Markdown",
    description_ar: "لا يتم إنشاء ملفات .md أو توثيق خارجي — كل شيء يُحفظ كـ TypeScript constants.",
  },
] as const;

// ============================================================
// دوال المساعدة — Helper Functions
// ============================================================

/** استرجاع شاشات دور معين */
export function getScreensByRole(role: UserRole): ScreenDefinition[] {
  return SCREENS.filter((s) => s.roles.includes(role));
}

/** استرجاع شاشات الشريط السفلي لدور معين */
export function getBottomNavScreens(role: UserRole): ScreenDefinition[] {
  return SCREENS.filter((s) => s.roles.includes(role) && s.is_bottom_nav);
}

/** استرجاع جدول قاعدة البيانات بالاسم */
export function getTableByName(name: string): TableDefinition | undefined {
  return DATABASE_SCHEMA.find((t) => t.name === name);
}

/** استرجاع الميزات التقنية المطبقة */
export function getImplementedFeatures(): TechnicalFeature[] {
  return TECHNICAL_FEATURES.filter((f) => f.implemented);
}

/** ملخص المشروع */
export function getProjectSummary() {
  return {
    project: PROJECT_INFO.name_ar,
    total_screens: SCREENS.length,
    screens_by_role: {
      retailer: getScreensByRole("retailer").length,
      supplier: getScreensByRole("supplier").length,
      admin: getScreensByRole("admin").length,
    },
    total_tables: DATABASE_SCHEMA.length,
    implemented_features: getImplementedFeatures().length,
    total_features: TECHNICAL_FEATURES.length,
  };
}
