'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
    onClose: () => void;
      title: React.ReactNode;
        children: React.ReactNode;
          size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
            footer?: React.ReactNode;
              preventOutsideClose?: boolean;
                className?: string;
                }

                const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
                  sm: 'max-w-sm',
                    md: 'max-w-md',
                      lg: 'max-w-2xl',
                        xl: 'max-w-4xl',
                          full: 'max-w-[95vw] h-[90vh]',
                          };

                          export default function Modal({
                            open,
                              onClose,
                                title,
                                  children,
                                    size = 'md',
                                      footer,
                                        preventOutsideClose = false,
                                          className = '',
                                          }: ModalProps) {
                                            // معالجة الضغط على زر Escape
                                              const handleKeyDown = useCallback(
                                                  (e: KeyboardEvent) => {
                                                        if (e.key === 'Escape') {
                                                                onClose();
                                                                      }
                                                                          },
                                                                              [onClose]
                                                                                );

                                                                                  useEffect(() => {
                                                                                      if (open) {
                                                                                            document.body.style.overflow = 'hidden';
                                                                                                  window.addEventListener('keydown', handleKeyDown);
                                                                                                      } else {
                                                                                                            document.body.style.overflow = '';
                                                                                                                }

                                                                                                                    return () => {
                                                                                                                          document.body.style.overflow = '';
                                                                                                                                window.removeEventListener('keydown', handleKeyDown);
                                                                                                                                    };
                                                                                                                                      }, [open, handleKeyDown]);

                                                                                                                                        if (!open) return null;

                                                                                                                                          return (
                                                                                                                                              <div
                                                                                                                                                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
                                                                                                                                                          onClick={(e) => {
                                                                                                                                                                  if (!preventOutsideClose && e.target === e.currentTarget) {
                                                                                                                                                                            onClose();
                                                                                                                                                                                    }
                                                                                                                                                                                          }}
                                                                                                                                                                                                role="dialog"
                                                                                                                                                                                                      aria-modal="true"
                                                                                                                                                                                                            dir="rtl"
                                                                                                                                                                                                                >
                                                                                                                                                                                                                      <div
                                                                                                                                                                                                                              className={`bg-card text-card-foreground rounded-2xl shadow-2xl w-full ${sizeMap[size]} flex flex-col max-h-[90dvh] border border-border/80 overflow-hidden animate-in zoom-in-95 duration-200 ${className}`}
                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                            {/* Header */}
                                                                                                                                                                                                                                                    <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 flex-shrink-0 bg-card">
                                                                                                                                                                                                                                                              <div className="font-arabic font-bold text-base sm:text-lg text-foreground truncate pl-2">
                                                                                                                                                                                                                                                                          {title}
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                                                                                          onClick={onClose}
                                                                                                                                                                                                                                                                                                                      type="button"
                                                                                                                                                                                                                                                                                                                                  className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
                                                                                                                                                                                                                                                                                                                                              aria-label="إغلاق النافذة"
                                                                                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                                                                                    <X size={20} />
                                                                                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                                                                                      </div>

                                                                                                                                                                                                                                                                                                                                                                                              {/* Body */}
                                                                                                                                                                                                                                                                                                                                                                                                      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-arabic">
                                                                                                                                                                                                                                                                                                                                                                                                                {children}
                                                                                                                                                                                                                                                                                                                                                                                                                        </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                {/* Footer */}
                                                                                                                                                                                                                                                                                                                                                                                                                                        {footer && (
                                                                                                                                                                                                                                                                                                                                                                                                                                                  <div className="px-5 py-3.5 border-t border-border/60 flex-shrink-0 bg-muted/20 rounded-b-2xl">
                                                                                                                                                                                                                                                                                                                                                                                                                                                              {footer}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                )}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            