"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Ticket, Plus } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: formData.get("code"),
        discount_percent: Number(formData.get("discount_percent")),
        max_uses: Number(formData.get("max_uses")),
      }),
    });
    if (res.ok) {
      showToast("تم إنشاء الكود بنجاح", "success");
      setShowModal(false);
      fetchCoupons();
    } else {
      showToast("حدث خطأ", "error");
    }
  };

  const columns = [
    { key: "code", header: "الكود" },
    { key: "discount_percent", header: "الخصم", render: (row: any) => `${row.discount_percent}%` },
    { key: "max_uses", header: "الحد الأقصى" },
    { key: "used_count", header: "المستخدم" },
    { key: "is_active", header: "الحالة", render: (row: any) => row.is_active ? <Badge variant="success">نشط</Badge> : <Badge variant="destructive">معطل</Badge> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="text-primary" size={28} /> أكواد الخصم
          </h1>
          <Button onClick={() => setShowModal(true)}><Plus size={18} className="ml-2" /> إنشاء كود</Button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {coupons.length === 0 ? (
            <div className="py-10 text-center text-gray-500">لا توجد أكواد خصم حالياً.</div>
          ) : (
            <DataTable data={coupons} columns={columns} />
          )}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="إنشاء كود خصم جديد">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input name="code" placeholder="الكود (مثال: SAVE10)" required />
          <Input name="discount_percent" type="number" placeholder="نسبة الخصم (%)" required />
          <Input name="max_uses" type="number" placeholder="الحد الأقصى للاستخدام" required />
          <Button type="submit" className="w-full">إنشاء الكود</Button>
        </form>
      </Modal>
    </div>
  );
}
