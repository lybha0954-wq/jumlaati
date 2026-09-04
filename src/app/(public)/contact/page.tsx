"use client";
import { useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showToast("تم إرسال رسالتك بنجاح!", "success");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">اتصل بنا</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <Input name="name" placeholder="الاسم" required />
          <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
          <Textarea name="message" placeholder="رسالتك..." rows={5} required />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
          </Button>
        </form>
      </div>
    </div>
  );
}
