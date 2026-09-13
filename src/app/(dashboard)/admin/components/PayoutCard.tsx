"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { Check, X, Loader2, Calendar } from "lucide-react";

interface PayoutCardProps {
  payout: {
    id: string;
    amount: number;
    created_at: string;
    users?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
  onApprove: () => Promise<void> | void;
  onReject: () => Promise<void> | void;
  processing?: boolean;
}

const roleLabels: Record<string, string> = {
  wholesaler: "تاجر جملة",
  retailer: "تاجر تجزئة",
  delivery: "مندوب توصيل",
  admin: "أدمن",
};

const roleColors: Record<string, string> = {
  wholesaler: "bg-amber-50 text-amber-700 border-amber-200",
  retailer: "bg-blue-50 text-blue-700 border-blue-200",
  delivery: "bg-emerald-50 text-emerald-700 border-emerald-200",
  admin: "bg-purple-50 text-purple-700 border-purple-200",
};

export function PayoutCard({
  payout,
  onApprove,
  onReject,
  processing = false,
}: PayoutCardProps) {
  const [localProcessing, setLocalProcessing] = useState<
    "approve" | "reject" | null
  >(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const user = payout.users;
  const initial = user?.name?.charAt(0) || "؟";
  const roleLabel = user?.role ? roleLabels[user.role] : "";
  const roleColor = user?.role
    ? roleColors[user.role]
    : "bg-gray-50 text-gray-700 border-gray-200";

  const handleAction = async (action: "approve" | "reject") => {
    if (processing || localProcessing) return;
    setLocalProcessing(action);
    try {
      if (action === "approve") await onApprove();
      else await onReject();
    } finally {
      setLocalProcessing(null);
    }
  };

  const date = new Date(payout.created_at);
  const dateStr = date.toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const disabled = processing || !!localProcessing;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:border-primary/30 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 flex items-center justify-center font-bold text-lg sm:text-xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                {user?.name || "غير معروف"}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {roleLabel && (
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor}`}
                  >
                    {roleLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar size={10} />
                  {dateStr}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left flex-shrink-0">
            <p className="text-[10px] text-muted-foreground mb-0.5 font-medium">
              المبلغ
            </p>
            <p className="text-lg sm:text-xl font-extrabold text-primary tracking-tight">
              {formatCurrency(payout.amount)}
            </p>
          </div>

          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction("reject")}
              disabled={disabled}
              className="flex-1 sm:flex-initial text-destructive border-destructive/30 hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-200 active:scale-95"
            >
              {localProcessing === "reject" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <X size={14} className="ml-1" />
                  <span className="hidden sm:inline">رفض</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => handleAction("approve")}
              disabled={disabled}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              {localProcessing === "approve" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <Check size={14} className="ml-1" />
                  <span className="hidden sm:inline">موافقة</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
