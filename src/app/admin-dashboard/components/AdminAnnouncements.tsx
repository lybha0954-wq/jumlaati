'use client';
import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'الجميع' | 'الموردون' | 'المحلات';
  createdAt: string;
  pinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'تحديث سياسة العمولات', body: 'اعتباراً من أول سبتمبر 2026، ستكون نسبة العمولة 2.5٪ على جميع الطلبات.', audience: 'الجميع', createdAt: '٢٠٢٦/٠٨/٠١', pinned: true },
  { id: 'ann-2', title: 'صيانة مجدولة للمنصة', body: 'سيتوقف النظام للصيانة يوم الجمعة 8 أغسطس من 2 صباحاً حتى 4 صباحاً.', audience: 'الجميع', createdAt: '٢٠٢٦/٠٧/٢٨', pinned: false },
  { id: 'ann-3', title: 'ميزة التتبع الفوري للطلبات', body: 'تم إطلاق ميزة تتبع الطلبات في الوقت الفعلي لجميع الموردين.', audience: 'الموردون', createdAt: '٢٠٢٦/٠٧/٢٠', pinned: false },
];

const audienceColors: Record<string, string> = {
  'الجميع': 'bg-blue-50 text-blue-700 border-blue-200',
  'الموردون': 'bg-violet-50 text-violet-700 border-violet-200',
  'المحلات': 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: '', body: '', audience: 'الجميع' as Announcement['audience'], pinned: false });
  const [saved, setSaved] = useState(false);

  const openNew = () => {
    setEditItem(null);
    setForm({ title: '', body: '', audience: 'الجميع', pinned: false });
    setModalOpen(true);
  };

  const openEdit = (item: Announcement) => {
    setEditItem(item);
    setForm({ title: item.title, body: item.body, audience: item.audience, pinned: item.pinned });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    if (editItem) {
      setAnnouncements((prev) => prev.map((a) => a.id === editItem.id ? { ...a, ...form } : a));
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        ...form,
        createdAt: '٢٠٢٦/٠٨/٠٤',
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setModalOpen(false); }, 700);
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-card rounded-2xl border border-border flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Megaphone size={15} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-arabic font-bold text-sm text-foreground">الإعلانات والتنبيهات</h2>
            <p className="text-xs text-muted-foreground font-arabic">{announcements.length} إعلان نشط</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-arabic font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus size={13} />
          إعلان جديد
        </button>
      </div>

      {/* List */}
      <div className="flex-1 divide-y divide-border overflow-y-auto max-h-80">
        {announcements.map((ann) => (
          <div key={ann.id} className="px-5 py-3.5 hover:bg-muted/30 transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {ann.pinned && (
                    <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5 font-arabic font-semibold">مثبت</span>
                  )}
                  <span className={`text-xs border rounded-full px-1.5 py-0.5 font-arabic font-semibold ${audienceColors[ann.audience]}`}>
                    {ann.audience}
                  </span>
                  <span className="text-xs text-muted-foreground font-arabic">{ann.createdAt}</span>
                </div>
                <p className="font-arabic font-semibold text-sm text-foreground">{ann.title}</p>
                <p className="font-arabic text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.body}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(ann)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Edit3 size={13} />
                </button>
                <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'تعديل الإعلان' : 'إعلان جديد'}
        size="md"
        footer={
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-white font-arabic font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {saved ? <><CheckCircle size={15} /> تم الحفظ</> : 'حفظ الإعلان'}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-muted text-foreground font-arabic text-sm hover:bg-muted/80 transition-colors">
              إلغاء
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-arabic font-semibold text-muted-foreground mb-1.5">عنوان الإعلان</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="أدخل عنوان الإعلان..."
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-xs font-arabic font-semibold text-muted-foreground mb-1.5">نص الإعلان</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="اكتب محتوى الإعلان هنا..."
              rows={4}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-arabic font-semibold text-muted-foreground mb-1.5">الجمهور المستهدف</label>
              <select
                value={form.audience}
                onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value as Announcement['audience'] }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-arabic text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="الجميع">الجميع</option>
                <option value="الموردون">الموردون فقط</option>
                <option value="المحلات">المحلات فقط</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm font-arabic text-foreground">تثبيت الإعلان</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
