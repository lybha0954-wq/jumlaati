'use client';

import React, { memo } from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  /** أيقونة مخصصة للمكون */
    icon?: React.ReactNode;
      /** العنوان الرئيسي لحالة الفراغ */
        title: string;
          /** وصف تفصيلي اختياري */
            description?: string;
              /** زر إجراء أو مكون اختياري (مثل: زر إضافة عنصر) */
                action?: React.ReactNode;
                  /** كلاسات Tailwind إضافية للكونتينر */
                    className?: string;
                      /** وضع مدمج للمساحات الضيقة مثل الجداول الصغيرة والمودال */
                        compact?: boolean;
                        }

                        export const EmptyState = memo(function EmptyState({
                          icon,
                            title,
                              description,
                                action,
                                  className = '',
                                    compact = false,
                                    }: EmptyStateProps) {
                                      return (
                                          <div
                                                className={`flex flex-col items-center justify-center text-center select-none ${
                                                        compact ? 'py-8 px-4' : 'py-12 sm:py-16 px-6'
                                                              } ${className}`.trim()}
                                                                  >
                                                                        {/* Icon Container */}
                                                                              <div
                                                                                      className={`rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center border border-border/50 shadow-xs transition-transform hover:scale-105 ${
                                                                                                compact ? 'w-10 h-10 mb-2.5' : 'w-14 h-14 mb-4'
                                                                                                        }`}
                                                                                                              >
                                                                                                                      {icon ? (
                                                                                                                                icon
                                                                                                                                        ) : (
                                                                                                                                                  <PackageOpen size={compact ? 20 : 28} className="stroke-[1.75]" />
                                                                                                                                                          )}
                                                                                                                                                                </div>

                                                                                                                                                                      {/* Title */}
                                                                                                                                                                            <h3
                                                                                                                                                                                    className={`font-semibold text-foreground ${
                                                                                                                                                                                              compact ? 'text-sm mb-1' : 'text-base sm:text-lg mb-1.5'
                                                                                                                                                                                                      }`}
                                                                                                                                                                                                            >
                                                                                                                                                                                                                    {title}
                                                                                                                                                                                                                          </h3>

                                                                                                                                                                                                                                {/* Description */}
                                                                                                                                                                                                                                      {description && (
                                                                                                                                                                                                                                              <p
                                                                                                                                                                                                                                                        className={`text-muted-foreground leading-relaxed max-w-xs ${
                                                                                                                                                                                                                                                                    compact ? 'text-xs mb-3' : 'text-xs sm:text-sm mb-5'
                                                                                                                                                                                                                                                                              }`}
                                                                                                                                                                                                                                                                                      >
                                                                                                                                                                                                                                                                                                {description}
                                                                                                                                                                                                                                                                                                        </p>
                                                                                                                                                                                                                                                                                                              )}

                                                                                                                                                                                                                                                                                                                    {/* Action Button / Custom Node */}
                                                                                                                                                                                                                                                                                                                          {action && (
                                                                                                                                                                                                                                                                                                                                  <div className="flex items-center justify-center w-full max-w-xs">
                                                                                                                                                                                                                                                                                                                                            {action}
                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                );
                                                                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                                                                EmptyState.displayName = 'EmptyState';

                                                                                                                                                                                                                                                                                                                                                                export default EmptyState;
                                                                                                                                                                                                                                                                                                                                                                