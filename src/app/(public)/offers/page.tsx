"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, KPISkeleton } from "@/components/shared/SkeletonLoader";
import {
  Gift, Tag, Calendar, Percent, Package, Store,
  Search, Clock, CheckCircle2, AlertTriangle, TrendingDown,
} from "lucide-react";
import Link from "next/link";

interface Offer {
  id: string;
  supplier_id: string;
  product_id: number | null;
  title: string;
  description: string | null;
  discount_percent: number | null;
  discount_type?: "percent" | "fixed";
  discount_value?: number;
  valid_from: string;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
  supplier_name?: string;
  product_name?: string;
  product_price?: number;
  product_image?: string;
}

type Filter = "all" | "active" | "expiring" | "expired";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all",      label: "الكل",          color: "bg-gray-100" },
  { key: "active",   label: "نشطة",          color: "bg-[#2e8b73]" },
  { key: "expiring", label: "تنتهي قريباً", color: "bg-amber-500" },
  { key: "expired",  label: "منتهية",        color: "bg-red-500" },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch("/api/offers");
      const data = res.ok ? await res.json() : [];
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const getDiscountValue = (o: Offer) => {
    if (o.discount_type === "percent" || !o.discount_type) {
      return Number(o.discount_value ?? o.discount_percent ?? 0);
    }
    return Number(o.discount_value ?? 0);
  };

  const isExpired = (o: Offer) => o.valid_to && new Date(o.valid_to) < new Date();

  const isExpiringSoon = (o: Offer) => {
    if (!o.valid_to || isExpired(o)) return false;
    const days = (new Date(o.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  };

  const counts = useMemo(() => ({
    all: offers.length,
    active: offers.filter((o) => !isExpired(o)).length,
    expiring: offers.filter(isExpiringSoon).length,
    expired: offers.filter(isExpired).length,
  }), [offers]);

  const filtered = useMemo(() => {
    let list = offers;
    if (filter === "active") list = list.filter((o) => !isExpired(o));
    else if (filter === "expiring") list = list.filter(isExpiringSoon);
    else if (filter === "expired") list = list.filter(isExpired);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.title.toLowerCase().includes(q) ||
        (o.description || "").toLowerCase().includes(q) ||
        (o.supplier_name || "").toLowerCase().includes(q) ||
        (o.product_name || "").toLowerCase().includes(q)
      );
    }

    // ترتيب: النشطة أولاً، ثم expiring، ثم expired
    return [...list].sort((a, b) => {
      const ax = isExpired(a) ? 2 : isExpiringSoon(a) ? 1 : 0;
      const bx = isExpired(b) ? 2 : isExpiringSoon(b) ? 1 : 0;
      return ax - bx;
    });
  }, [offers, filter, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <Topbar />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="mb-6">
            <div className="mx-auto mb-3 h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="mx-auto h-7 w-48 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mb-5"><KPISkeleton count={4} /></div>
          <ListSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <Topbar />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* رأس الصفحة */}
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <Gift className="h-8 w-8 text-amber-500" strokeWidth={2} />
          </div>
          <h1 className="mb-2 text-3xl font-black text-gray-900">العروض الترويجية</h1>
          <p className="text-sm text-gray-500">
            {offers.length > 0
              ? `${counts.active} عرض نشط من ${offers.length}`
              : "عروض حصرية من تجار الجملة"}
          </p>
        </div>

        {/* الفلاتر */}
        {offers.length > 0 && (
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
        )}

        {/* البحث */}
        {offers.length > 0 && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 focus-within:border-[#2e8b73]/40">
            <Search size={16} className="text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في العروض..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
          </div>
        )}

        {/* المحتوى */}
        {offers.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50/50 to-white p-10 sm:p-14 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
              <Gift className="h-8 w-8 text-amber-600" strokeWidth={2} />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">لا توجد عروض حالياً</h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-500">
              عندما يُضيف تجار الجملة عروضاً، ستظهر هنا.
            </p>
            <div className="mb-8 grid grid-cols-1 gap-4 text-right sm:grid-cols-3">
              <FeatureCard icon={<Tag className="h-5 w-5" />} title="خصومات مباشرة" desc="عروض على منتجات محددة" />
              <FeatureCard icon={<Gift className="h-5 w-5" />} title="هدايا الكمية" desc="مكافآت عند طلب كميات كبيرة" />
              <FeatureCard icon={<Calendar className="h-5 w-5" />} title="عروض موسمية" desc="تخفيضات في المناسبات" />
            </div>
            <Link href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-white hover:bg-amber-600 active:scale-95">
              تصفّح المنتجات ←
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="لا نتائج مطابقة"
            description="جرّب تغيير الفلتر أو البحث بكلمة أخرى"
            color="amber"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((o) => (
              <OfferCard
                key={o.id}
                offer={o}
                discount={getDiscountValue(o)}
                expired={!!isExpired(o)}
                expiringSoon={isExpiringSoon(o)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OfferCard({ offer, discount, expired, expiringSoon }: {
  offer: Offer;
  discount: number;
  expired: boolean;
  expiringSoon: boolean;
}) {
  const toDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString("ar-IQ", { day: "numeric", month: "short" }) : "—";

  const daysLeft = offer.valid_to
    ? Math.ceil((new Date(offer.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isFixed = offer.discount_type === "fixed";

  return (
    <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
      expired
        ? "border-gray-100 opacity-60"
        : expiringSoon
        ? "border-amber-300 hover:shadow-md"
        : "border-amber-100 hover:border-amber-300 hover:shadow-md"
    }`}>
      {/* شريط الصورة/اللون */}
      <div className={`relative h-24 ${
        expired ? "bg-gray-50" : expiringSoon
          ? "bg-gradient-to-l from-amber-400 to-amber-500"
          : "bg-gradient-to-l from-amber-500 to-orange-500"
      }`}>
        {offer.product_image ? (
          <Image src={offer.product_image} alt={offer.title} fill sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover opacity-90" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Gift className="h-10 w-10 text-white/60" strokeWidth={1.5} />
          </div>
        )}

        {/* شارة الخصم */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-black text-amber-600 shadow-md">
            {isFixed ? `${discount} د.ع` : `-${discount}%`}
          </span>
        )}

        {/* شارة الحالة */}
        {expired ? (
          <span className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            منتهي
          </span>
        ) : expiringSoon ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            <Clock size={10} /> {daysLeft} يوم
          </span>
        ) : (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold text-[#2e8b73]">
            <CheckCircle2 size={10} /> نشط
          </span>
        )}
      </div>

      {/* المحتوى */}
      <div className="p-5">
        <h3 className="mb-1.5 line-clamp-1 text-base font-black text-gray-900">
          {offer.title}
        </h3>

        {offer.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
            {offer.description}
          </p>
        )}

        {/* سعر المنتج قبل/بعد */}
        {offer.product_price && discount > 0 && !isFixed && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="text-gray-400 line-through">
              {Number(offer.product_price).toLocaleString()} د.ع
            </span>
            <span className="font-black text-[#2e8b73]">
              {Math.round(Number(offer.product_price) * (1 - discount / 100)).toLocaleString()} د.ع
            </span>
            <TrendingDown size={12} className="text-[#2e8b73]" />
          </div>
        )}

        {/* الأطراف */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-gray-400">
          {offer.supplier_name && (
            <span className="inline-flex items-center gap-1">
              <Store size={10} /> {offer.supplier_name}
            </span>
          )}
          {offer.product_name && (
            <span className="inline-flex items-center gap-1">
              <Package size={10} /> {offer.product_name}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 ${expired ? "text-red-500" : expiringSoon ? "text-amber-600" : ""}`}>
            <Calendar size={10} /> حتى {toDate(offer.valid_to)}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-bold">{title}</h3>
      <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
    </div>
  );
}
