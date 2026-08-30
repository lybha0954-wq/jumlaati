'use client';

import { useState, useRef } from 'react';
import { storeService } from '@/lib/services/storeService';
import Image from 'next/image';

interface ProfileImageUploaderProps {
  type: 'avatar' | 'logo';
  currentImage: string | null;
  onImageUpdate: (newUrl: string | null) => void;
  label?: string;
}

export default function ProfileImageUploader({ 
  type, 
  currentImage, 
  onImageUpdate,
  label 
}: ProfileImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديد شكل العرض (دائري للصورة الرمزية، مستطيل للشعار)
  const isAvatar = type === 'avatar';
  const sizeClass = isAvatar ? 'w-32 h-32 rounded-full' : 'w-64 h-32 rounded-lg';
  const uploadLabel = label || (isAvatar ? 'الصورة الشخصية' : 'شعار المتجر');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // معاينة فورية للمستخدم قبل الرفع
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setLoading(true);
    try {
      const newUrl = await storeService.uploadProfileImage(file, type);
      if (newUrl) {
        setPreview(newUrl);
        onImageUpdate(newUrl);
        alert('تم رفع الصورة بنجاح!');
      }
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء الرفع');
      // إعادة المعاينة إلى الصورة القديمة
      setPreview(currentImage);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    setLoading(true);
    try {
      const success = await storeService.deleteProfileImage(type);
      if (success) {
        setPreview(null);
        onImageUpdate(null);
      }
    } catch (error: any) {
      alert(error.message || 'فشل حذف الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{uploadLabel}</label>
      
      <div className="flex items-center gap-6">
        {/* عرض الصورة الحالية */}
        <div className={`relative ${sizeClass} bg-gray-100 border-2 border-gray-200 flex-shrink-0 overflow-hidden`}>
          {preview ? (
            <Image
              src={preview}
              alt={uploadLabel}
              fill
              className={`object-cover ${isAvatar ? 'rounded-full' : 'rounded-lg'}`}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-gray-400 text-sm ${isAvatar ? 'rounded-full' : 'rounded-lg'}`}>
              {isAvatar ? '👤' : '🏪'}
            </div>
          )}
        </div>

        {/* أزرار التحكم */}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition text-center disabled:opacity-50">
            {loading ? 'جاري الرفع...' : '📸 رفع صورة'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
          
          {preview && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition disabled:opacity-50"
            >
              🗑️ حذف
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-400">يُفضل رفع صورة بحجم: {isAvatar ? '400×400' : '800×400'} بكسل (تدعم JPG, PNG)</p>
    </div>
  );
}
