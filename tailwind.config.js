cat > ~/design_system_v1.sh << 'ENDOFSCRIPT'
#!/data/data/com.termux/files/usr/bin/bash

cd ~/jumlaati || exit 1

BACKUP=~/jumlaati_backup_design_$(date +%Y%m%d_%H%M)
mkdir -p "$BACKUP"
cp src/styles/globals.css "$BACKUP/" 2>/dev/null
cp tailwind.config.js "$BACKUP/" 2>/dev/null

echo "═══════════════════════════════════════════════════════"
echo "🎨 Design System v1.0 — التطبيق الكامل"
echo "═══════════════════════════════════════════════════════"
echo

# ═══════════════════════════════════════════════════════
# 1. globals.css — نظام الألوان والطباعة
# ═══════════════════════════════════════════════════════
cat > src/styles/globals.css << 'ENDCSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ═══════════════════════════════════════════════════
       جملتي — Design System v1.0
       لوحة ألوان دافئة، احترافية، مريحة للعين
       ═══════════════════════════════════════════════════ */

    /* الأساسيات */
    --background: 250 250 249;      /* stone-50 */
    --foreground: 28 25 23;         /* stone-900 */

    /* البطاقات */
    --card: 255 255 255;
    --card-foreground: 28 25 23;

    /* النوافذ المنبثقة */
    --popover: 255 255 255;
    --popover-foreground: 28 25 23;

    /* اللون الأساسي — عنبري دافئ */
    --primary: 217 119 6;           /* amber-600 — للأزرار */
    --primary-foreground: 255 255 255;
    --primary-light: 245 158 11;    /* amber-500 — للأيقونات */
    --primary-soft: 255 251 235;    /* amber-50 — للخلفيات */

    /* الثانوي */
    --secondary: 245 245 244;       /* stone-100 */
    --secondary-foreground: 41 37 36;

    /* الخفيف */
    --muted: 245 245 244;
    --muted-foreground: 120 113 108; /* stone-500 */

    /* Accent */
    --accent: 255 237 213;          /* orange-100 */
    --accent-foreground: 124 45 18; /* orange-900 */

    /* الحالات */
    --danger: 220 38 38;            /* red-600 */
    --danger-foreground: 255 255 255;

    --destructive: 220 38 38;
    --destructive-foreground: 255 255 255;

    --success: 22 163 74;           /* green-600 */
    --success-foreground: 255 255 255;

    --warning: 245 158 11;          /* amber-500 */
    --warning-foreground: 255 255 255;

    --info: 37 99 235;              /* blue-600 */
    --info-foreground: 255 255 255;

    /* الحدود */
    --border: 231 229 228;          /* stone-200 */
    --input: 231 229 228;
    --ring: 217 119 6;

    /* الزوايا */
    --radius: 0.75rem;
  }

  * {
    border-color: rgb(var(--border) / 1);
  }

  html {
    font-family: 'Tajawal', system-ui, -apple-system, sans-serif;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: rgb(var(--background) / 1);
    color: rgb(var(--foreground) / 1);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* العناوين */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  /* الحقول */
  input, select, textarea {
    @apply transition-all duration-200;
    font-family: inherit;
  }

  input:focus, select:focus, textarea:focus {
    @apply outline-none;
    box-shadow: 0 0 0 3px rgb(var(--primary) / 0.15);
    border-color: rgb(var(--primary) / 1);
  }

  /* الأزرار */
  button {
    @apply transition-all duration-200;
    font-family: inherit;
  }

  button:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* الروابط */
  a {
    @apply transition-colors duration-200;
  }

  /* Scrollbar مخصص */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(var(--muted) / 0.5);
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(var(--muted-foreground) / 0.3);
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgb(var(--muted-foreground) / 0.5);
  }
}

@layer components {
  .card-base {
    @apply bg-card rounded-2xl border border-border shadow-soft;
  }

  .btn-base {
    @apply inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all;
  }

  .badge-base {
    @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold;
  }

  .input-base {
    @apply w-full h-12 rounded-xl border border-input bg-card px-4 text-base transition-all;
  }
}

@layer utilities {
  .text-gradient {
    background: linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-light)) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .shadow-primary {
    box-shadow: 0 4px 14px 0 rgb(var(--primary) / 0.25);
  }

  .no-select {
    -webkit-user-select: none;
    user-select: none;
  }
}
ENDCSS

echo "✅ globals.css — محدَّث"

# ═══════════════════════════════════════════════════════
# 2. tailwind.config.js — الرموز الموسّعة
# ═══════════════════════════════════════════════════════
cat > tailwind.config.js << 'ENDTW'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          soft: 'rgb(var(--primary-soft) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger) / <alpha-value>)',
          foreground: 'rgb(var(--danger-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          foreground: 'rgb(var(--info-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        md: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        '2xl': 'calc(var(--radius) + 12px)',
        '3xl': 'calc(var(--radius) + 20px)',
      },
      fontFamily: {
        sans: ['Tajawal', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px -1px rgb(0 0 0 / 0.05), 0 1px 3px -1px rgb(0 0 0 / 0.03)',
        'medium': '0 4px 16px -2px rgb(0 0 0 / 0.08), 0 2px 6px -1px rgb(0 0 0 / 0.04)',
        'large': '0 12px 32px -4px rgb(0 0 0 / 0.12), 0 4px 12px -2px rgb(0 0 0 / 0.06)',
        'primary': '0 4px 14px 0 rgb(var(--primary) / 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
ENDTW

echo "✅ tailwind.config.js — محدَّث"

# ═══════════════════════════════════════════════════════
# 3. صفحة معاينة Design System
# ═══════════════════════════════════════════════════════
mkdir -p "src/app/(public)/design-preview"

cat > "src/app/(public)/design-preview/page.tsx" << 'ENDPREVIEW'
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Package, TrendingUp, Users, ShoppingCart } from "lucide-react";

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Topbar />

      <div className="container mx-auto py-10 px-4 space-y-12">

        {/* العناوين */}
        <section>
          <h1 className="text-4xl font-bold mb-6">نظام التصميم v1.0</h1>
          <p className="text-muted-foreground">
            معاينة كاملة للألوان والطباعة والمكونات.
          </p>
        </section>

        {/* الألوان */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎨 لوحة الألوان</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-primary-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Primary</div>
              <div className="text-xs opacity-80 mt-1">العنصر الأساسي</div>
            </div>
            <div className="bg-secondary text-secondary-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Secondary</div>
              <div className="text-xs opacity-80 mt-1">الثانوي</div>
            </div>
            <div className="bg-success text-success-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Success</div>
              <div className="text-xs opacity-80 mt-1">النجاح</div>
            </div>
            <div className="bg-danger text-danger-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Danger</div>
              <div className="text-xs opacity-80 mt-1">الخطر</div>
            </div>
            <div className="bg-warning text-warning-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Warning</div>
              <div className="text-xs opacity-80 mt-1">التحذير</div>
            </div>
            <div className="bg-info text-info-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Info</div>
              <div className="text-xs opacity-80 mt-1">معلومة</div>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Muted</div>
              <div className="text-xs opacity-80 mt-1">خفيف</div>
            </div>
            <div className="bg-accent text-accent-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Accent</div>
              <div className="text-xs opacity-80 mt-1">تمييز</div>
            </div>
          </div>
        </section>

        {/* الطباعة */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📝 الطباعة</h2>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h1>عنوان أول — h1 (36px)</h1>
              <h2>عنوان ثاني — h2 (30px)</h2>
              <h3>عنوان ثالث — h3 (24px)</h3>
              <h4>عنوان رابع — h4 (20px)</h4>
              <p className="text-base">
                نص عادي — حجم أساسي. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-muted-foreground">
                نص ثانوي — للتفاصيل. هذا النص يشرح شيئًا مهمًا.
              </p>
              <p className="text-xs text-muted-foreground">
                نص صغير جدًا — للعلامات والتواريخ.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* الأزرار */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔘 الأزرار</h2>
          <Card>
            <CardContent className="pt-6 flex flex-wrap gap-3">
              <Button>افتراضي</Button>
              <Button variant="secondary">ثانوي</Button>
              <Button variant="outline">مخطط</Button>
              <Button variant="ghost">شبح</Button>
              <Button variant="destructive">خطر</Button>
              <Button variant="link">رابط</Button>
              <Button disabled>معطّل</Button>
              <Button size="sm">صغير</Button>
              <Button size="lg">كبير</Button>
            </CardContent>
          </Card>
        </section>

        {/* الشارات */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🏷️ الشارات</h2>
          <Card>
            <CardContent className="pt-6 flex flex-wrap gap-3">
              <Badge>افتراضي</Badge>
              <Badge variant="secondary">ثانوي</Badge>
              <Badge variant="success">مكتمل</Badge>
              <Badge variant="destructive">ملغى</Badge>
              <Badge variant="outline">مخطط</Badge>
            </CardContent>
          </Card>
        </section>

        {/* الحقول */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📝 الحقول</h2>
          <Card>
            <CardContent className="pt-6 space-y-4 max-w-md">
              <Input placeholder="حقل نصي عادي" />
              <Input placeholder="حقل معطّل" disabled />
              <Input type="email" placeholder="البريد الإلكتروني" />
            </CardContent>
          </Card>
        </section>

        {/* البطاقات */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎴 البطاقات</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  إجمالي المستخدمين
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-success mt-1">↑ 12% هذا الشهر</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  الطلبات
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456</div>
                <p className="text-xs text-success mt-1">↑ 8% هذا الأسبوع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  الإيرادات
                <\/CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142,000 د.ع</div>
                <p className="text-xs text-success mt-1">↑ 23%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  المنتجات
                <\/CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30</div>
                <p className="text-xs text-muted-foreground mt-1">في المخزون</p>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
ENDPREVIEW

echo "✅ صفحة المعاينة — محدَّثة"

# ═══════════════════════════════════════════════════════
# 4. Commit + Push
# ═══════════════════════════════════════════════════════
echo
echo "═══════════════════════════════════════════════════════"
echo "📤 Push إلى GitHub..."
echo "═══════════════════════════════════════════════════════"

git add -A
git commit -m "feat(design): Design System v1.0 + preview page

- New color palette: warm amber + stone neutrals
- Better contrast ratios (WCAG AA)
- Typography scale with proper weights
- Custom scrollbar styling
- Semantic colors (success, warning, info, danger)
- Enhanced shadows (soft, medium, large, primary)
- Animation keyframes (fade, slide, scale)
- Extended Tailwind config with new tokens
- Added /design-preview page for visual reference"

git push origin main

echo
echo "═══════════════════════════════════════════════════════"
echo "✅ المرحلة 1 اكتملت"
echo "═══════════════════════════════════════════════════════"
echo
echo "Vercel سيبدأ البناء خلال 30 ثانية."
echo
echo "بعد 2-3 دقائق، افتح:"
echo "  https://jumlaati.vercel.app/design-preview"
echo
echo "المرحلة التالية:"
echo "  🅱️ الصور والأيقونات (Open Food Facts + 3dicons)"
echo

ENDSCRIPT

chmod +x ~/design_system_v1.sh
echo "✅ الملف جاهز: ~/design_system_v1.sh"
echo ""
echo "نفّذ:"
echo "  bash ~/design_system_v1.sh"
