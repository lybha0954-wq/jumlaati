"use client";
import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { method: "GET" });
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      showToast("خطأ في جلب المستخدمين", "error");
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleUpdate = async (id: string, data: any) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { showToast("تم تحديث المستخدم", "success"); fetchUsers(); } else { showToast("حدث خطأ", "error"); }
  };

  const columns = [
    { key: "name", header: "الاسم" },
    { key: "email", header: "البريد الإلكتروني" },
    { key: "role", header: "الدور", render: (row: any) => <Badge>{row.role}</Badge> },
    { key: "status", header: "الحالة", render: (row: any) => (row.status === 'suspended' ? <Badge variant="destructive">محظور</Badge> : <Badge variant="success">نشط</Badge>) },
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex items-center gap-2">
          <Select defaultValue={row.role} className="h-8 w-32 text-xs" onChange={(e) => handleUpdate(row.id, { role: e.target.value })}>
            <option value="retailer">تاجر تجزئة</option>
            <option value="wholesaler">تاجر جملة</option>
            <option value="delivery">مندوب توصيل</option>
            <option value="admin">أدمن</option>
          </Select>
          {row.status !== 'suspended' ? (<Button size="sm" variant="outline" className="text-red-600" onClick={() => handleUpdate(row.id, { status: 'suspended' })}>حظر</Button>) : (<Button size="sm" variant="outline" className="text-green-600" onClick={() => handleUpdate(row.id, { status: 'active' })}>تفعيل</Button>)}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {users.length === 0 ? (<div className="py-10 text-center text-gray-500">لا يوجد مستخدمون بعد.</div>) : (<DataTable data={users} columns={columns} />)}
        </div>
      </div>
    </div>
  );
}
