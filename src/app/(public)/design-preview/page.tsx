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

        <section>
          <h1 className="text-4xl font-bold mb-6">نظام التصميم v1.0</h1>
          <p className="text-muted-foreground">
            معاينة كاملة للألوان والطباعة والمكونات.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">🎨 لوحة الألوان</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary text-primary-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Primary</div>
            </div>
            <div className="bg-secondary text-secondary-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Secondary</div>
            </div>
            <div className="bg-success text-success-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Success</div>
            </div>
            <div className="bg-danger text-danger-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Danger</div>
            </div>
            <div className="bg-warning text-warning-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Warning</div>
            </div>
            <div className="bg-info text-info-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Info</div>
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Muted</div>
            </div>
            <div className="bg-accent text-accent-foreground p-6 rounded-xl">
              <div className="text-sm font-semibold">Accent</div>
            </div>
          </div>
        </section>

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
            </CardContent>
          </Card>
        </section>

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
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  الإيرادات
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142,000 د.ع</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  المنتجات
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30</div>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
