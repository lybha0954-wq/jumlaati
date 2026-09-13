"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "@/components/dashboard/Topbar";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/lib/utils/currency";
import {
  Users,
  DollarSign,
  Clock,
  Wallet,
  Check,
  X,
  AlertCircle,
  BarChart3,
} from "lucide-react";

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

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Topbar />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">مركز الموافقات</h1>
          <p className="text-muted-foreground">
            كل ما يحتاج قرارك اليوم في مكان واحد
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="المستخدمون"
            value={String(stats.users)}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="الإيرادات"
            value={formatCurrency(stats.revenue)}
            color="emerald"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="سحوبات معلقة"
            value={String(stats.pendingPayouts)}
            color="amber"
            highlight={stats.pendingPayouts > 0}
          />
          <StatCard
            icon={<Wallet className="w-5 h-5" />}
            label="مبالغ معلقة"
            value={formatCurrency(stats.pendingAmount)}
            color="purple"
            highlight={stats.pendingAmount > 0}
          />
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">طلبات السحب</h2>
              {stats.pendingPayouts > 0 && (
                <Badge variant="destructive">{stats.pendingPayouts}</Badge>
              )}
            </div>
            <Link
              href="/admin/payouts"
              className="text-sm text-primary hover:underline"
            >
              عرض الكل ←
            </Link>
          </div>

          {pendingPayouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold mb-1">
                  لا توجد طلبات معلقة
                </h3>
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
          <h2 className="text-xl font-bold mb-4">وصول سريع</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLink
              href="/admin/users"
              icon={<Users />}
              label="المستخدمون"
            />
            <QuickLink
              href="/admin/payments"
              icon={<DollarSign />}
              label="المدفوعات"
            />
            <QuickLink
              href="/admin/refunds"
              icon={<AlertCircle />}
              label="المرتجعات"
            />
            <QuickLink
              href="/admin/analytics"
              icon={<BarChart3 />}
              label="التحليلات"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, highlight }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className={highlight ? "ring-2 ring-amber-200" : ""}>
      <CardContent className="p-5">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colors[color]}`}
        >
          {icon}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function PayoutCard({ payout, onApprove, onReject, processing }: any) {
  const user = payout.users;
  return (
    <Card className="hover:shadow-medium transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
              {user?.name?.charAt(0) || "؟"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {user?.name || "غير معروف"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(payout.created_at).toLocaleDateString("ar-IQ")}
              </p>
            </div>
          </div>

          <div className="text-left">
            <p className="text-xs text-muted-foreground mb-1">المبلغ</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(payout.amount)}
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              disabled={processing}
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
            >
              <X size={16} className="ml-1" />
              رفض
            </Button>
            <Button
              size="sm"
              onClick={onApprove}
              disabled={processing}
              className="bg-success hover:bg-success/90"
            >
              <Check size={16} className="ml-1" />
              موافقة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, icon, label }: any) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-medium transition-all hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
          <span className="font-medium text-sm">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
