"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { WholesaleStats } from "../components/WholesaleStats";
import { formatCurrency } from "@/lib/utils/currency";
import { Package } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function WholesaleOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);

      const products = productsRes.ok ? await productsRes.json() : [];
      const orders: Order[] = ordersRes.ok ? await ordersRes.json() : [];

      const totalRevenue = orders.reduce(
        (sum, o) => sum + (Number(o.total) || 0),
        0
      );
      const pending = orders.filter((o) => o.status === "pending").length;

      setStats({
        products: Array.isArray(products) ? products.length : 0,
        orders: orders.length,
        revenue: totalRevenue,
        pendingOrders: pending,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
      showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Topbar />
        <div className="flex items-center justify-center py-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Topbar />

      <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            نظرة عامة للجملة
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            ملخص نشاطك التجاري في وقت واحد
          </p>
        </div>

        <div className="mb-8">
          <WholesaleStats stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="transition-all duration-500 hover:shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                أحدث الطلبات
              </h2>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  لا توجد طلبات واردة بعد
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-amber-50/30 transition-all duration-200"
                    >
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          طلب #{order.id.slice(0, 6)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString(
                            "ar-IQ"
                          )}
                        </p>
                      </div>
                      <span className="font-extrabold text-primary text-sm sm:text-base">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="transition-all duration-500 hover:shadow-lg">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-xl font-bold mb-4">وصول سريع</h2>
              <div className="grid grid-cols-2 gap-3">
                <QuickLink
                  href="/wholesale/products"
                  label="المنتجات"
                  emoji="📦"
                />
                <QuickLink
                  href="/wholesale/orders"
                  label="الطلبات"
                  emoji="🛒"
                />
                <QuickLink
                  href="/wholesale/inventory"
                  label="المخزون"
                  emoji="📊"
                />
                <QuickLink
                  href="/wholesale/payouts"
                  label="المدفوعات"
                  emoji="💵"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  label,
  emoji,
}: {
  href: string;
  label: string;
  emoji: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-amber-50/50 active:scale-95 transition-all duration-200 group"
    >
      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
        {emoji}
      </span>
      <span className="font-semibold text-sm">{label}</span>
    </a>
  );
}
