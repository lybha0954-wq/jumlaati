"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import { Bell, Package, Wallet, UserPlus, Truck, Calendar } from "lucide-react";

interface Log {
  id: number;
  type: string;
  title: string;
  body: string | null;
  created_at: string;
  user_id: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        setLogs(await res.json());
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
          </div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 text-2xl font-black text-gray-900">سجل النشاط</h1>
          <p className="text-sm text-gray-500">{logs.length} حدث حديث</p>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Bell className="mx-auto mb-3 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">لا يوجد نشاط بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((l) => {
              const info = typeInfo(l.type);
              return (
                <div
                  key={l.id}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${info.bg} ${info.text}`}>
                    <info.Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">{l.title}</p>
                    {l.body && (
                      <p className="mt-0.5 text-xs text-gray-500">{l.body}</p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={10} />
                      {new Date(l.created_at).toLocaleString("ar-IQ", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function typeInfo(type: string) {
  const map: Record<string, any> = {
    order: { bg: "bg-blue-50", text: "text-blue-600", Icon: Package },
    status: { bg: "bg-purple-50", text: "text-purple-600", Icon: Truck },
    payment: { bg: "bg-amber-50", text: "text-amber-600", Icon: Wallet },
    info: { bg: "bg-gray-50", text: "text-gray-600", Icon: Bell },
  };
  return map[type] || map.info;
}
