"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/useToast";

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        }
      } catch {
        showToast("فشل تحميل البيانات", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      if (res.ok) {
        showToast("تم حفظ الإعدادات بنجاح!", "success");
      } else {
        const data = await res.json();
        showToast(data.error || "فشل الحفظ", "error");
      }
    } catch {
      showToast("حدث خطأ", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="text-sm font-medium mb-2 block">الاسم</label>
        <Input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="اسمك الكامل"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">البريد الإلكتروني</label>
        <Input value={profile.email} disabled className="bg-gray-50" />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">رقم الهاتف</label>
        <Input
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="07XX XXX XXXX"
        />
      </div>
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
