"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export function FileUpload({ className, onChange }: { className?: string; onChange?: (file: File | null) => void }) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const { showToast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("حجم الملف يتجاوز 5 ميغابايت", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={cn("border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors", className)}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-md" />
      ) : (
        <div className="text-gray-500">
          <div className="text-3xl mb-2">📁</div>
          <p>اضغط لاختيار صورة أو اسحبها هنا</p>
        </div>
      )}
    </div>
  );
}
