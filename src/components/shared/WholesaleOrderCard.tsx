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

export type WholesaleOrderStatus =
  | "قيد الانتظار"
  | "قيد المعالجة"
  | "تم الشحن"
  | "تم التوصيل"
  | "ملغى";

export type WholesaleOrder = {
  id: string;
  customerName: string;
  total: number;
  date: string | Date;
  status: WholesaleOrderStatus;
  onPrint?: () => void;
  onShipWhatsApp?: () => void;
  onConfirm?: () => void;
};

const statusStyles: Record<WholesaleOrderStatus, string> = {
  "قيد الانتظار": "bg-amber-50 text-amber-700",
  "قيد المعالجة": "bg-blue-50 text-blue-700",
  "تم الشحن": "bg-purple-50 text-purple-700",
  "تم التوصيل": "bg-emerald-50 text-emerald-700",
  ملغى: "bg-rose-50 text-rose-700",
};

const statusIcons: Record<WholesaleOrderStatus, typeof Clock> = {
  "قيد الانتظار": Clock,
  "قيد المعالجة": Clock,
  "تم الشحن": Truck,
  "تم التوصيل": Check,
  ملغى: XCircle,
};

const formatCurrency = (total: number) =>
  `${new Intl.NumberFormat("ar-IQ").format(total)} د.ع`;

const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("ar-IQ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export function WholesaleOrderCard({
  order,
}: {
  order: WholesaleOrder;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const StatusIcon = statusIcons[order.status];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <article
      dir="rtl"
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700"
          >
            {order.customerName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">
              {order.customerName}
            </p>
            <p className="mt-1 text-sm text-gray-500">#{order.id}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[order.status]}`}
        >
          <StatusIcon aria-hidden="true" className="size-3.5" />
          {order.status}
        </span>
      </div>

      <div className="my-5 border-t border-gray-100 pt-5">
        <p className="text-2xl font-extrabold tracking-tight text-gray-900">
          {formatCurrency(order.total)}
        </p>
        <p className="mt-1 text-sm text-gray-500">{formatDate(order.date)}</p>
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <button
          type="button"
          onClick={order.onPrint}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 active:scale-95"
        >
          <Printer aria-hidden="true" className="size-4" />
          طباعة
        </button>
        <button
          type="button"
          onClick={order.onShipWhatsApp}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 active:scale-95"
        >
          <Send aria-hidden="true" className="size-4" />
          شحن واتساب
        </button>
        <button
          type="button"
          onClick={order.onConfirm}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 active:scale-95"
        >
          <Check aria-hidden="true" className="size-4" />
          تأكيد الطلب
        </button>
      </div>
    </article>
  );
}

export default WholesaleOrderCard;

