"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        showToast("تعذر جلب المستخدمين", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: "name", header: "الاسم" },
    { key: "email", header: "البريد الإلكتروني" },
    { key: "role", header: "الدور", render: (row: any) => <Badge>{row.role}</Badge> },
    { key: "actions", header: "إجراءات", render: () => (
        <Button size="sm" variant="outline">عرض</Button>
    )},
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <DataTable data={users} columns={columns} />
    </div>
  );
}
