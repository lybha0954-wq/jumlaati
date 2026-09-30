-- ═══════════════════════════════════════════════════
-- جُمْلَتِي — نظام Feature Flags
-- ═══════════════════════════════════════════════════

-- 1) الجدول
CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_for_roles TEXT[],
  config JSONB DEFAULT '{}'::jsonb,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) فهرس على enabled
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(enabled);

-- 3) trigger تحديث updated_at
CREATE OR REPLACE FUNCTION touch_feature_flags_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_feature_flags_updated_at ON feature_flags;
CREATE TRIGGER trg_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION touch_feature_flags_updated_at();

-- 4) RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_enabled" ON feature_flags;
CREATE POLICY "public_read_enabled" ON feature_flags
  FOR SELECT
  USING (true);  -- الجميع يقرأ (نحتاج نعرف ميزاتنا)

DROP POLICY IF EXISTS "admin_write" ON feature_flags;
CREATE POLICY "admin_write" ON feature_flags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 5) صلاحيات
GRANT SELECT ON feature_flags TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON feature_flags TO authenticated;

-- 6) زرع 21 ميزة (كلها معطّلة افتراضياً)
INSERT INTO feature_flags (key, enabled, label, description, category) VALUES
  ('wishlist',           false, 'قائمة الرغبات',       'حفظ المنتجات المفضلة',                'retailer'),
  ('points',             false, 'نقاط الولاء',         'نقاط مقابل كل عملية شراء',           'retailer'),
  ('coupons',            false, 'كوبونات الخصم',       'كودات خصم للمستخدمين',                'marketing'),
  ('commissions',        false, 'العمولات',            'نظام عمولات المنصة',                  'finance'),
  ('refunds',            false, 'المرتجعات',           'طلبات استرداد المبالغ',               'finance'),
  ('reviews',            false, 'التقييمات',           'تقييم المنتجات والموردين',            'quality'),
  ('offers',             false, 'العروض',              'عروض خاصة من التجار',                 'marketing'),
  ('payouts',            false, 'المستحقات',           'طلبات سحب الأرباح',                    'finance'),
  ('requests',           false, 'الطلبات الخاصة',      'طلبات مخصّصة من المستخدمين',          'operations'),
  ('matching',           false, 'المطابقة الذكية',      'مطابقة تلقائية بين التجار',           'ai'),
  ('whatsapp',           false, 'واتساب API',          'تكامل WhatsApp Business API',         'communication'),
  ('upload',             false, 'رفع ملفات',           'رفع صور ومستندات',                    'operations'),
  ('delivery_tasks',     false, 'مهام التوصيل',        'نظام مهام المندوبين الكامل',          'delivery'),
  ('payments_webhook',   false, 'Webhooks الدفع',      'استقبال إشعارات بوابات الدفع',        'finance'),
  ('push_manual',        false, 'Push يدوي',           'إرسال إشعارات يدوية من الإدارة',      'communication'),
  ('notifications_center', true, 'مركز الإشعارات',    'قائمة الإشعارات المنسدلة',            'core'),
  ('dark_mode',          false, 'الوضع الليلي',        'تصميم داكن',                          'ui'),
  ('offline_mode',       false, 'وضع عدم الاتصال',    'العمل بدون إنترنت',                    'ui'),
  ('reports_advanced',   false, 'تقارير متقدمة',       'رسوم بيانية وتحليلات',                'admin'),
  ('multi_language',     false, 'تعدد اللغات',         'دعم لغات إضافية',                     'i18n'),
  ('referrals',          false, 'الإحالات',            'دعوة أصدقاء ومكافآت',                 'marketing')
ON CONFLICT (key) DO NOTHING;

-- 7) عرض سريع
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE enabled) AS enabled,
       COUNT(*) FILTER (WHERE NOT enabled) AS disabled
FROM feature_flags;
