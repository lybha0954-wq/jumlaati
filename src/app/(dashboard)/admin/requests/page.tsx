"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import { useToast } from "@/hooks/useToast";
import {
  Headphones, CheckCircle2, Clock, XCircle, Search, MessageSquare, User,
} from "lucide-react";

interface Request {
  id: string;
  user_id: string;
  subject: string;
  body: string | null;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "normal" | "high";
  admin_reply: string | null;
  created_at: string;
  requester_name?: string;
}

type Filter = "all" | "open" | "in_progress" | "closed";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all",         label: "الكل",           color: "bg-gray-100" },
  { key: "open",        label: "جديدة",          color: "bg-amber-500" },
  { key: "in_progress", label: "قيد المعالجة",  color: "bg-blue-500" },
  { key: "closed",      label: "مُغلقة",          color: "bg-[#2e8b73]" },
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Request | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/requests");
      const d = res.ok ? await res.json() : [];
      setRequests(Array.isArray(d) ? d : []);
    } catch {
      showToast("فشل التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: string, adminReply?: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_reply: adminReply }),
      });
      if (res.ok) {
        showToast("✅ تم التحديث", "success");
        setSelected(null);
        setReply("");
        fetchData();
      } else {
        showToast("فشل التحديث", "error");
      }
    } catch {
      showToast("خطأ في الاتصال", "error");
    } finally {
      setBusy(null);
    }
  };

  const counts = useMemo(() => ({
    all: requests.length,
    open: requests.filter((r) => r.status === "open").length,
    in_progress: requests.filter((r) => r.status === "in_progress").length,
    closed: requests.filter((r) => r.status === "closed").length,
  }), [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        (r.subject || "").toLowerCase().includes(q) ||
        (r.body || "").toLowerCase().includes(q) ||
        (r.requester_name || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, filter, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-24">
        <Topbar />
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="mb-5">
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mb-5"><KPISkeleton count={4} /></div>
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      <Topbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <h1 className="mb-1 flex items-center gap-2 text-2xl font-black text-gray-900">
            <Headphones size={22} className="text-[#2e8b73]" /> الدعم الفني
          </h1>
          <p className="text-sm text-gray-500">{requests.length} طلب دعم</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`rounded-2xl border p-3 text-right transition-all ${
                filter === f.key
                  ? "border-[#2e8b73]/40 bg-[#e8f4f0]"
                  : "border-gray-100 bg-white hover:border-[#2e8b73]/20"
              }`}>
              <div className={`mb-1.5 h-1.5 w-6 rounded-full ${f.color}`} />
              <p className="text-[10px] text-gray-500">{f.label}</p>
              <p className="text-lg font-black text-gray-900">{counts[f.key]}</p>
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 focus-within:border-[#2e8b73]/40">
          <Search size={16} className="text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في طلبات الدعم..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Headphones}
            title="لا توجد طلبات دعم"
            description={search || filter !== "all" ? "جرّب تغيير الفلتر أو البحث" : "ستظهر طلبات العملاء هنا"}
            color="blue"
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <RequestCard key={r.id} request={r} onClick={() => { setSelected(r); setReply(r.admin_reply || ""); }} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <RequestModal
          request={selected}
          reply={reply}
          setReply={setReply}
          busy={busy === selected.id}
          onClose={() => { setSelected(null); setReply(""); }}
          onUpdate={updateStatus}
        />
      )}
    </div>
  );
}

function RequestCard({ request, onClick }: { request: Request; onClick: () => void }) {
  const statusInfo: Record<string, { label: string; cls: string; Icon: any }> = {
    open:        { label: "جديد",          cls: "bg-amber-50 text-amber-700",  Icon: Clock },
    in_progress: { label: "قيد المعالجة", cls: "bg-blue-50 text-blue-700",    Icon: MessageSquare },
    closed:      { label: "مُغلق",          cls: "bg-[#e8f4f0] text-[#1e6b57]", Icon: CheckCircle2 },
  };
  const st = statusInfo[request.status] || statusInfo.open;
  const StIcon = st.Icon;
  const priorityAr: Record<string, string> = { low: "منخفضة", normal: "عادية", high: "عالية" };

  return (
    <button onClick={onClick}
      className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-right transition-all hover:border-[#2e8b73]/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-gray-900">{request.subject}</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
              <StIcon size={11} /> {st.label}
            </span>
          </div>
          {request.body && (
            <p className="mb-2 line-clamp-2 text-xs text-gray-500">{request.body}</p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1">
              <User size={10} /> {request.requester_name || "مستخدم"}
            </span>
            <span>{String(request.created_at || "").slice(0, 16)}</span>
            <span className={`font-bold ${request.priority === "high" ? "text-red-500" : request.priority === "low" ? "text-gray-400" : "text-amber-500"}`}>
              {priorityAr[request.priority] || "عادية"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function RequestModal({ request, reply, setReply, busy, onClose, onUpdate }: any) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-md sm:rounded-3xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">{request.subject}</h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
            <XCircle size={18} />
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
          <p className="mb-1 text-[10px] font-bold text-gray-500">من: {request.requester_name || "مستخدم"}</p>
          <p className="text-sm text-gray-700">{request.body || "لا يوجد وصف"}</p>
          <p className="mt-2 text-[10px] text-gray-400">{String(request.created_at || "").slice(0, 16)}</p>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold text-gray-700">الرد</label>
          <textarea value={reply} onChange={(e) => setReply(e.target.value)}
            placeholder="اكتب ردك هنا..."
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none focus:border-[#2e8b73] focus:bg-white" />
        </div>

        <div className="space-y-2">
          {request.status !== "in_progress" && (
            <button onClick={() => onUpdate(request.id, "in_progress", reply)} disabled={busy}
              className="w-full rounded-xl bg-blue-500 py-3 text-sm font-bold text-white hover:bg-blue-600 disabled:opacity-50">
              {busy ? "..." : "بدء المعالجة"}
            </button>
          )}
          {request.status !== "closed" && (
            <button onClick={() => onUpdate(request.id, "closed", reply)} disabled={busy}
              className="w-full rounded-xl bg-[#2e8b73] py-3 text-sm font-bold text-white hover:bg-[#1e6b57] disabled:opacity-50">
              {busy ? "..." : "إغلاق مع الرد"}
            </button>
          )}
          {request.status === "closed" && (
            <div className="rounded-xl border border-[#2e8b73]/30 bg-[#e8f4f0] p-3 text-center text-xs font-bold text-[#1e6b57]">
              ✅ هذا الطلب مُغلق
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
