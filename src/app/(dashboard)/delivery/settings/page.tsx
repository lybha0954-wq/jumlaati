import { Topbar } from "@/components/dashboard/Topbar";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Topbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
        <div className="bg-white p-6 rounded-2xl shadow-sm max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">معلومات الحساب</h2>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
