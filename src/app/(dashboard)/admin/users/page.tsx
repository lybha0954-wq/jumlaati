import { Topbar } from "@/components/dashboard/Topbar";
import { UsersTable } from "../components/UsersTable";

export default function AdminUsersPage() {
  return (
    <div>
      <Topbar />
      <h1 className="text-3xl font-bold mb-6">إدارة المستخدمين</h1>
      <UsersTable />
    </div>
  );
}
