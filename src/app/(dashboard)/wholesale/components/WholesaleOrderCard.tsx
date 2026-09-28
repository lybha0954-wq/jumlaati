"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Printer,
  Send,
  Truck,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";

export type OrderStatus =
  | "reviewing"
  | "delivering"
  | "completed"
  | "cancelled";

export interface WholesaleOrder {
  id: string;
  retailer_profile_id: string;
  supplier_profile_id?: string;
  total: number;
  status: OrderStatus;
  address?: string;
  created_at: string;
  users?: { full_name?: string; email?: string } | null;
}

interface Props {
  order: WholesaleOrder;
  onPrint?: (order: WholesaleOrder) => void;
  onShipWhatsApp?: (order: WholesaleOrder) => void;
  onConfirm?: (order: WholesaleOrder) => void;
  processing?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; bg: string; text: string; Icon: typeof Clock }
> = {
  reviewing: {
    label: "قيد الانتظار",
    bg: "bg-amber-50",
    text: "text-amber-700",
    Icon: Clock,
  },
  delivering: {
    label: "تم الشحن",
    bg: "bg-purple-50",
    text: "text-purple-700",
    Icon: Truck,
  },
  completed: {
    label: "تم التوصيل",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    Icon: Check,
  },
  cancelled: {
    label: "ملغى",
    bg: "bg-rose-50",
    text: "text-rose-700",
    Icon: XCircle,
  },
};

export function WholesaleOrderCard({
  order,
  onPrint,
  onShipWhatsApp,
  onConfirm,
  processing,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const config = statusConfig[order.status] || statusConfig.reviewing;
  const StatusIcon = config.Icon;
  const customerName = order.users?.full_name || "عميل";
  const initial = customerName.charAt(0);

  const dateStr = new Date(order.created_at).toLocaleDateString("ar-IQ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-500 ease-out hover:shadow-lg hover:border-primary/30 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-lg sm:text-xl shadow-sm transition-all duration-300 group-hover:scale-105">
                {initial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                {customerName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                #{order.id.slice(0, 8)}
              </p>
              <span className="inline-flex items-center text-[10px] text-muted-foreground mt-1">
                {dateStr}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${config.bg} ${config.text}`}
          >
            <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
            {config.label}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-4 mb-4">
          <p className="text-[10px] text-muted-foreground mb-0.5 font-medium">
            المجموع
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-primary">
            {formatCurrency(order.total)}
          </p>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPrint?.(order)}
            disabled={processing}
            className="flex-1 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 ml-1.5" />
            طباعة
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onShipWhatsApp?.(order)}
            disabled={processing}
            className="flex-1 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 ml-1.5" />
            شحن واتساب
          </Button>
          <Button
            size="sm"
            onClick={() => onConfirm?.(order)}
            disabled={processing}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 ml-1.5" />
            تأكيد
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
