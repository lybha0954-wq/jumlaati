"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { uploadService } from "@/lib/services/uploadService";
import { useUserStore } from "@/lib/stores/userStore";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const user = useUserStore((s) => s.user);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!user?.id) {
      showToast("يجب تسجيل الدخول أولاً", "error");
      return;
    }

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      showToast(`الحد الأقصى ${maxImages} صور`, "error");
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const url = await uploadService.uploadProductImage(files[i], user.id);
        newImages.push(url);
      }
      onChange([...images, ...newImages]);
      showToast(`تم رفع ${newImages.length} صورة`, "success");
    } catch (err: any) {
      showToast(err.message || "فشل رفع الصورة", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* شبكة الصور */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
          >
            <Image
              src={url}
              alt={`صورة ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* زر الإضافة */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Upload size={24} />
                <span className="text-xs mt-1">إضافة</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        {images.length}/{maxImages} صور — حجم أقصى 5 MB لكل صورة
      </p>
    </div>
  );
}
