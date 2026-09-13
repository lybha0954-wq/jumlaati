"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { DeliveryStats } from "../components/DeliveryStats";
import { formatCurrency } from "@/lib/utils/currency";
import { Truck, MapPin } from "lucide-react";

interface Task {
  id: string;
  total: number;
  status: string;
  address?: string;
  created_at: string;
}

export default function DeliveryOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    earnings: 0,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/delivery/tasks");
      const data: Task[] = res.ok ? await res.json() : [];
      const active = data.filter(
        (t) => t.status === "accepted" || t.status === "shipped"
      ).length;
      const completed = data.filter((t) => t.status === "delivered").length;
      const earnings = data
        .filter((t) => t.status === "delivered")
        .reduce((sum, t) => sum + (Number(t.total) || 0) * 0.1, 0);

      setStats({ active, completed, earnings });
      setTasks(data.slice(0, 5));
    } catch (err) {
      console.error(err);
      showToast("فشل تحميل المهام", "error");
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
            مهام اليوم
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            المهام النشطة والأرباح
          </p>
        </div>

        <div className="mb-8">
          <DeliveryStats stats={stats} />
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              المهام الحالية
            </h2>
            <Link
              href="/delivery/tasks"
              className="text-sm text-primary hover:underline font-medium"
            >
              عرض الكل ←
            </Link>
          </div>
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4">
                  <Truck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-1">لا توجد مهام حالياً</h3>
                <p className="text-sm text-muted-foreground">
                  عندما يُسند إليك طلب، سيظهر هنا
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        #{task.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {task.address || "بدون عنوان"}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-primary text-sm">
                    {formatCurrency(task.total)}
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
              href="/delivery/tasks"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-emerald-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">📋</span>
              <span className="font-semibold text-sm">المهام</span>
            </Link>
            <Link
              href="/delivery/task-history"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-emerald-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">📜</span>
              <span className="font-semibold text-sm">السجل</span>
            </Link>
            <Link
              href="/delivery/earnings"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-emerald-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">💰</span>
              <span className="font-semibold text-sm">أرباحي</span>
            </Link>
            <Link
              href="/delivery/payouts"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-emerald-50/50 active:scale-95 transition-all bg-white shadow-sm"
            >
              <span className="text-2xl">💵</span>
              <span className="font-semibold text-sm">المدفوعات</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
