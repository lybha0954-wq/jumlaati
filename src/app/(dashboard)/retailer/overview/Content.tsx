"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { RetailerStats } from "../components/RetailerStats";
import { formatCurrency } from "@/lib/utils/currency";
import { Package, ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function RetailerOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    pending: 0,
    delivered: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const orders: Order[] = res.ok ? await res.json() : [];
      const pending = orders.filter((o) => o.status === "pending").length;
      const delivered = orders.filter((o) => o.status === "delivered").length;
      const totalSpent = orders.reduce(
        (sum, o) => sum + (Number(o.total) || 0),
        0
      );
      setStats({
        orders: orders.length,
        pending,
        delivered,
        totalSpent,
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
            نظرة عامة للتاجر
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            ملخص طلباتك ومشترياتك
          </p>
        </div>

        <div className="mb-8">
          <RetailerStats stats={stats} />
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              أحدث طلباتي
            </h2>
            <Link
              href="/retailer/orders"
              className="text-sm text-primary hover:underline font-medium"
            >
              عرض الكل ←
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-1">لا توجد طلبات بعد</h3>
                <p className="text-sm text-muted-foreground">
                  تصفّح المنتجات وابدأ التسوق
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-bold text-sm">
                      طلب #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("ar-IQ")}
                    </p>
                  </div>
                  <span className="font-extrabold text-primary text-base">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">وصول سريع</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/retailer/cart"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">🛒</span>
              <span className="font-semibold text-sm">السلة</span>
            </Link>
            <Link
              href="/retailer/orders"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">📋</span>
              <span className="font-semibold text-sm">طلباتي</span>
            </Link>
            <Link
              href="/retailer/favorites"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">❤️</span>
              <span className="font-semibold text-sm">المفضلة</span>
            </Link>
            <Link
              href="/retailer/nearby-wholesale"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">🏪</span>
              <span className="font-semibold text-sm">تجار الجملة</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
