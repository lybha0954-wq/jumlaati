"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, children, title, className }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string; className?: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className={cn("bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up", className)} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">✕</button>
        {children}
      </div>
    </div>
  );
}
