"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserCog, UserCheck, UserX, Users } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { method: "GET" });
      if (res.ok) setUsers(await res.json());
      else showToast("خطأ في جلب المستخدمين", "error");
    } catch (error) {
      showToast("تعذر الاتصال بالخادم", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      fetchUsers();
    } else {
      const errorData = await res.json();
      showToast(errorData.error || "حدث خطأ", "error");
    }
  };

  // حساب الإحصائيات
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'suspended').length;
  const retailers = users.filter(u => u.role === 'retailer').length;
  const wholesalers = users.filter(u => u.role === 'wholesaler').length;
  const deliveries = users.filter(u => u.role === 'delivery').length;

  const columns = [
    { key: "name", header: "الاسم" },
    { key: "email", header: "البريد الإلكتروني" },
    { key: "created_at", header: "تاريخ التسجيل", render: (row: any) => new Date(row.created_at).toLocaleDateString('ar-IQ') },
    { key: "role", header: "الدور", render: (row: any) => <Badge variant="secondary">{row.role}</Badge> },
    { key: "status", header: "الحالة", render: (row: any) => (
        row.status === 'suspended' ? <Badge variant="destructive">محظور</Badge> : <Badge variant="success">نشط</Badge>
    )},
    { key: "actions", header: "إجراءات التحكم", render: (row: any) => (
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
            {row.status !== 'suspended' ? (
                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleUpdate(row.id, { status: 'suspended' })}>
                    <UserX size={14} /> حظر
                </Button>
            ) : (
                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleUpdate(row.id, { status: 'active' })}>
                    <UserCheck size={14} /> تفعيل
                </Button>
            )}
        </div>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h1>
            <Button variant="outline" size="sm"><UserCog size={18} className="ml-2" /> إدارة الصلاحيات</Button>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">إجمالي المستخدمين</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">الحسابات النشطة</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">تجار الجملة</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{wholesalers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">تجزئة وتوصيل</CardTitle>
                    <Users className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{retailers + deliveries}</div>
                </CardContent>
            </Card>
        </div>

        {/* جدول المستخدمين */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <p className="text-center text-gray-500 py-10">جارٍ تحميل البيانات...</p>
          ) : users.length === 0 ? (
            <div className="py-10 text-center">
              <h3 className="text-xl font-bold text-gray-500">لا يوجد مستخدمون بعد</h3>
              <p className="text-gray-400 mt-2">سيظهر هنا جميع التجار والمندوبين المسجلين.</p>
            </div>
          ) : (
            <DataTable data={users} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
