'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, ShoppingCart, Package } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type ToastType = 'success' | 'error' | 'info' | 'cart' | 'order';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  subMessage?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, subMessage?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const toastConfig: Record<ToastType, { icon: React.ElementType; bg: string; border: string; iconColor: string; textColor: string }> = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-600', textColor: 'text-emerald-800' },
  error:   { icon: AlertCircle, bg: 'bg-red-50',     border: 'border-red-200',     iconColor: 'text-red-600',     textColor: 'text-red-800'     },
  info:    { icon: Info,        bg: 'bg-blue-50',    border: 'border-blue-200',    iconColor: 'text-blue-600',    textColor: 'text-blue-800'    },
  cart:    { icon: ShoppingCart, bg: 'bg-primary/5', border: 'border-primary/20', iconColor: 'text-primary',     textColor: 'text-foreground'  },
  order:   { icon: Package,     bg: 'bg-violet-50',  border: 'border-violet-200',  iconColor: 'text-violet-600',  textColor: 'text-violet-800'  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    // Trigger enter animation
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-xs w-full transition-all duration-300 ${cfg.bg} ${cfg.border} ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
      dir="rtl"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <Icon size={16} className={cfg.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-arabic font-semibold leading-snug ${cfg.textColor}`}>{toast.message}</p>
        {toast.subMessage && (
          <p className="text-xs font-arabic text-muted-foreground mt-0.5">{toast.subMessage}</p>
        )}
      </div>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300); }}
        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, subMessage?: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message, subMessage, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none w-full px-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full max-w-xs">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
