"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) setUsers(await res.json());
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdate = async (id: string, data: any) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showToast("تم تحديث بيانات المستخدم بنجاح", "success");
      setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
    } else {
      showToast("حدث خطأ في التحديث", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: "name", header: "الاسم" },
    { key: "email", header: "البريد الإلكتروني" },
    { key: "role", header: "الدور", render: (row: any) => <Badge>{row.role}</Badge> },
    { key: "status", header: "الحالة", render: (row: any) => (
        <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>{row.status || 'active'}</Badge>
    )},
    { key: "actions", header: "إجراءات", render: (row: any) => (
        <div className="flex items-center gap-2">
          <Select
            defaultValue={row.role}
            className="h-8 w-32 text-xs"
            onChange={(e) => handleUpdate(row.id, { role: e.target.value })}
          >
            <option value="retailer">تاجر تجزئة</option>
            <option value="wholesaler">تاجر جملة</option>
            <option value="delivery">مندوب توصيل</option>
            <option value="admin">أدمن</option>
          </Select>
          {row.status !== 'active' ? (
            <Button size="sm" onClick={() => handleUpdate(row.id, { status: 'active' })}>قبول</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => handleUpdate(row.id, { status: 'suspended' })}>حظر</Button>
          )}
        </div>
    )},
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <DataTable data={users} columns={columns} />
    </div>
  );
}
