"use client";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Topbar } from "@/components/dashboard/Topbar";

export default function ContactPage() {
  const { showToast } = useToast();
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">اتصل بنا</h1>
        <form className="space-y-4 bg-white p-6 rounded-lg shadow" onSubmit={(e) => { e.preventDefault(); showToast("تم إرسال رسالتك!", "success"); }}>
          <Input name="name" placeholder="الاسم" required />
          <Input name="email" type="email" placeholder="البريد الإلكتروني" required />
          <Textarea name="message" placeholder="رسالتك..." rows={5} required />
          <Button type="submit" className="w-full">إرسال الرسالة</Button>
        </form>
      </div>
    </div>
  );
}
