"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users,
  DollarSign,
  RotateCcw,
  BarChart2,
  Package,
  Ticket,
} from "lucide-react";

const actions = [
  { href: "/admin/users", icon: Users, label: "المستخدمون", color: "text-blue-600 bg-blue-50/80" },
  { href: "/admin/payments", icon: DollarSign, label: "المدفوعات", color: "text-emerald-600 bg-emerald-50/80" },
  { href: "/admin/refunds", icon: RotateCcw, label: "المرتجعات", color: "text-rose-600 bg-rose-50/80" },
  { href: "/admin/analytics", icon: BarChart2, label: "التحليلات", color: "text-purple-600 bg-purple-50/80" },
  { href: "/admin/coupons", icon: Ticket, label: "الكوبونات", color: "text-amber-600 bg-amber-50/80" },
  { href: "/admin/commissions", icon: Package, label: "العمولات", color: "text-indigo-600 bg-indigo-50/80" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link key={act.href} href={act.href}>
            <Card className="group border border-slate-100 bg-white hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 rounded-2xl active:scale-95 cursor-pointer">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {act.label}
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

