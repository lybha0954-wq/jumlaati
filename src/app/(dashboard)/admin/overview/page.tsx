"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { AdminStats } from "../components/AdminStats";
import { PayoutCard } from "../components/PayoutCard";
import { QuickActions } from "../components/QuickActions";
import { Check, ArrowLeft } from "lucide-react";

interface Payout {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  users?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    revenue: 0,
    pendingPayouts: 0,
    pendingAmount: 0,
  });
  const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, payoutsRes, paymentsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/payouts"),
        fetch("/api/admin/payments"),
      ]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const payouts: Payout[] = payoutsRes.ok ? await payoutsRes.json() : [];
      const payments = paymentsRes.ok ? await paymentsRes.json() : [];

      const pending = payouts.filter((p) => p.status === "pending");
      const completed = (payments || []).filter(
        (p: any) => p.status === "completed"
      );
      const revenue = completed.reduce(
        (s: number, p: any) => s + (Number(p.amount) || 0),
        0
      );

      setStats({
        users: Array.isArray(users) ? users.length : 0,
        revenue,
        pendingPayouts: pending.length,
        pendingAmount: pending.reduce((s, p) => s + Number(p.amount), 0),
      });

      setPendingPayouts(pending);
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

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    if (processing) return;
    setProcessing(id);
    const payout = pendingPayouts.find((p) => p.id === id);

    try {
      const res = await fetch("/api/admin/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        showToast(
          status === "approved" ? "تمت الموافقة على الطلب" : "تم رفض الطلب",
          "success"
        );
        setPendingPayouts((prev) => prev.filter((p) => p.id !== id));
        setStats((prev) => ({
          ...prev,
          pendingPayouts: prev.pendingPayouts - 1,
          pendingAmount:
            prev.pendingAmount - (payout ? Number(payout.amount) : 0),
        }));
      } else {
        const data = await res.json();
        showToast(data.error || "فشل الإجراء", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setProcessing(null);
    }
  };

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
            مركز الموافقات
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            كل ما يحتاج قرارك اليوم في مكان واحد
          </p>
        </div>

        <div className="mb-8">
          <AdminStats stats={stats} />
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">طلبات السحب</h2>
              {stats.pendingPayouts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.pendingPayouts}
                </Badge>
              )}
            </div>
            <Link
              href="/admin/payouts"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1 font-medium transition-all duration-200 hover:gap-2"
            >
              عرض الكل
              <ArrowLeft size={14} />
            </Link>
          </div>

          {pendingPayouts.length === 0 ? (
            <Card className="transition-all duration-500">
              <CardContent className="py-12 sm:py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-4 transition-transform duration-500 hover:scale-110">
                  <Check
                    className="w-8 h-8 text-emerald-600"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="text-lg font-bold mb-1">لا توجد طلبات معلقة</h3>
                <p className="text-sm text-muted-foreground">
                  كل الطلبات تمت معالجتها. عمل رائع!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingPayouts.map((payout) => (
                <PayoutCard
                  key={payout.id}
                  payout={payout}
                  onApprove={() => handleAction(payout.id, "approved")}
                  onReject={() => handleAction(payout.id, "rejected")}
                  processing={processing === payout.id}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">وصول سريع</h2>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
