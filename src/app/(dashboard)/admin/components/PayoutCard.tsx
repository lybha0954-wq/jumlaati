"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { Check, X, Loader2, Calendar, ShieldCheck } from "lucide-react";

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

const roleMap: Record<string, { label: string; badge: string }> = {
  wholesaler: { label: "تاجر جملة", badge: "bg-amber-100 text-amber-800" },
  retailer: { label: "تاجر تجزئة", badge: "bg-blue-100 text-blue-800" },
  delivery: { label: "مندوب توصيل", badge: "bg-emerald-100 text-emerald-800" },
  admin: { label: "أدمن", badge: "bg-purple-100 text-purple-800" },
};

export function PayoutCard({
  payout,
  onApprove,
  onReject,
  processing = false,
}: PayoutCardProps) {
  const [actionState, setActionState] = useState<"approve" | "reject" | null>(null);

  const user = payout.users;
  const initial = user?.name?.charAt(0) || "؟";
  const roleInfo = roleMap[user?.role || ""] || {
    label: "مستخدم",
    badge: "bg-slate-100 text-slate-700",
  };

  const handleAction = async (type: "approve" | "reject") => {
    if (processing || actionState) return;
    setActionState(type);
    try {
      if (type === "approve") await onApprove();
      else await onReject();
    } finally {
      setActionState(null);
    }
  };

  const dateStr = new Date(payout.created_at).toLocaleDateString("ar-IQ", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 rounded-2xl">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* User Info & Avatar */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-black text-lg flex items-center justify-center shadow-sm flex-shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                  {user?.name || "غير معروف"}
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${roleInfo.badge}`}>
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate dir-ltr text-right">
                {user?.email}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-right sm:text-left pl-2">
              <span className="text-[10px] font-semibold text-slate-400 block">
                المبلغ المطلوبة
              </span>
              <span className="text-lg sm:text-xl font-black text-rose-600 tracking-tight">
                {formatCurrency(payout.amount)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={processing || !!actionState}
                onClick={() => handleAction("reject")}
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 active:scale-95 transition-all text-xs h-9 px-3 font-bold"
              >
                {actionState === "reject" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-3.5 h-3.5 ml-1" />
                    رفض
                  </>
                )}
              </Button>

              <Button
                size="sm"
                disabled={processing || !!actionState}
                onClick={() => handleAction("approve")}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md active:scale-95 transition-all text-xs h-9 px-4 font-bold"
              >
                {actionState === "approve" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 ml-1" />
                    موافقة
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

