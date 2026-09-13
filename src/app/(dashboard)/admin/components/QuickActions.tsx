"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  DollarSign,
  AlertCircle,
  BarChart3,
  Package,
  Ticket,
} from "lucide-react";

const actions = [
  { href: "/admin/users", icon: Users, label: "المستخدمون", color: "blue" },
  { href: "/admin/payments", icon: DollarSign, label: "المدفوعات", color: "emerald" },
  { href: "/admin/refunds", icon: AlertCircle, label: "المرتجعات", color: "rose" },
  { href: "/admin/analytics", icon: BarChart3, label: "التحليلات", color: "purple" },
  { href: "/admin/coupons", icon: Ticket, label: "الكوبونات", color: "amber" },
  { href: "/admin/commissions", icon: Package, label: "العمولات", color: "blue" },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
};

export function QuickActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const colors = colorMap[action.color];
        return (
          <Link key={action.href} href={action.href}>
            <Card
              className={`group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 active:scale-95 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{ transitionDelay: mounted ? `${index * 50}ms` : "0ms" }}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                <div
                  className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon size={22} strokeWidth={2} />
                </div>
                <span className="font-semibold text-xs sm:text-sm">
                  {action.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
