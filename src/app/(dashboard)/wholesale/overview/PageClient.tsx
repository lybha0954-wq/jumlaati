"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { WholesaleStats } from "../components/WholesaleStats";
import { WholesaleOrderCard } from "../components/WholesaleOrderCard";
import { Package } from "lucide-react";

interface Order { id: string; retailer_profile_id: string; supplier_profile_id?: string; total: number; status: "reviewing" | "delivering" | "completed" | 
  "cancelled"; address?: string; created_at: string; users?: { name?: string; email?: string } | null;
}
export default function WholesaleOverviewPage() { const [loading, setLoading] = useState(true); const [stats, setStats] = useState({ products: 0, 
    orders: 0, revenue: 0, pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]); const { showToast } = useToast(); const fetchData = useCallback(async () => { try 
    {
      const [productsRes, ordersRes] = await Promise.all([ fetch("/api/products"), fetch("/api/orders"), ]); const products = productsRes.ok ? 
      await productsRes.json() : []; const orders: Order[] = ordersRes.ok ? await ordersRes.json() : []; const totalRevenue = orders.reduce(
        (sum, o) => sum + (Number(o.total) || 0), 0 ); const pending = orders.filter((o) => o.status === "reviewing").length; setStats({ products: 
        Array.isArray(products) ? products.length : 0, orders: orders.length, revenue: totalRevenue, pendingOrders: pending,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err); showToast("فشل تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  useEffect(() => { fetchData();
  }, [fetchData]);
  if (loading) { return ( <div className="min-h-screen bg-background pb-20"> <Topbar /> <div className="flex items-center justify-center py-32"> 
          <LoadingSpinner />
        </div> </div> );
  }
  return ( <div className="min-h-screen bg-background pb-20"> <Topbar /> <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl"> <div 
        className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight"> نظرة عامة للجملة </h1> <p className="text-muted-foreground 
          text-sm sm:text-base">
            ملخص نشاطك التجاري في مكان واحد </p> </div> <div className="mb-8"> <WholesaleStats stats={stats} /> </div> <div className="mb-10"> <div 
          className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"> <Package className="w-5 h-5 text-primary" /> أحدث الطلبات </h2> 
            <Link
              href="/wholesale/orders" className="text-sm text-primary hover:underline font-medium"
            >
              عرض الكل ← </Link> </div> {recentOrders.length === 0 ? ( <Card> <CardContent className="py-12 text-center"> <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4">
                  <Package className="w-8 h-8 text-amber-600" /> </div> <h3 className="text-lg font-bold mb-1">لا توجد طلبات بعد</h3> <p 
                className="text-sm text-muted-foreground">
                  عندما يصلك طلب، سيظهر هنا </p> </CardContent> </Card> ) : ( <div className="space-y-3">
              {recentOrders.map((order) => (
                <WholesaleOrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">وصول سريع</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickLink href="/wholesale/products" label="المنتجات" emoji="📦" />
            <QuickLink href="/wholesale/orders" label="الطلبات" emoji="🛒" />
            <QuickLink href="/wholesale/inventory" label="المخزون" emoji="📊" />
            <QuickLink href="/wholesale/payouts" label="المدفوعات" emoji="💵" />
          </div>
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
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-amber-50/50 active:scale-95 transition-all duration-200 group bg-white shadow-sm"
    >
      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
        {emoji}
      </span>
      <span className="font-semibold text-sm">{label}</span>
    </Link>
  );
}
