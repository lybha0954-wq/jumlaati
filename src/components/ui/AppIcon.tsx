'use client';

import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export type IconVariant = 'outline' | 'solid';

export interface AppIconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
    variant?: IconVariant;
      size?: number;
        className?: string;
          onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
            disabled?: boolean;
            }

            /**
             * تحويل اسم الأيقونة إلى صيغة PascalCase وتضمين ملحق Icon إن لزم الأمر
              */
              function normalizeIconName(name: string): string {
                if (!name) return '';
                  let formatted = name.trim();
                    
                      // تحويل الصيغ مثل shopping-bag إلى ShoppingBag
                        if (formatted.includes('-')) {
                            formatted = formatted
                                  .split('-')
                                        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                                              .join('');
                                                } else {
                                                    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
                                                      }

                                                        // إضافة ملحق Icon في حال عدم وجوده
                                                          if (!formatted.endsWith('Icon')) {
                                                              formatted += 'Icon';
                                                                }

                                                                  return formatted;
                                                                  }

                                                                  export function AppIcon({
                                                                    name,
                                                                      variant = 'outline',
                                                                        size = 24,
                                                                          className = '',
                                                                            onClick,
                                                                              disabled = false,
                                                                                style,
                                                                                  ...props
                                                                                  }: AppIconProps) {
                                                                                    const iconSet = variant === 'solid' ? HeroIconsSolid : HeroIcons;
                                                                                      const formattedName = normalizeIconName(name);

                                                                                        // البحث عن الأيقونة باسمها المطابق أو المنسق
                                                                                          const IconComponent = (iconSet[name as keyof typeof iconSet] ||
                                                                                              iconSet[formattedName as keyof typeof iconSet]) as React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;

                                                                                                const baseStyle: React.CSSProperties = {
                                                                                                    width: size,
                                                                                                        height: size,
                                                                                                            minWidth: size,
                                                                                                                minHeight: size,
                                                                                                                    ...style,
                                                                                                                      };

                                                                                                                        const cursorClasses = disabled
                                                                                                                            ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                                                                                                                : onClick
                                                                                                                                    ? 'cursor-pointer hover:opacity-80 transition-opacity' :'';

                                                                                                                                          if (!IconComponent) {
                                                                                                                                              return (
                                                                                                                                                    <QuestionMarkCircleIcon
                                                                                                                                                            style={baseStyle}
                                                                                                                                                                    className={`text-muted-foreground ${cursorClasses} ${className}`}
                                                                                                                                                                            onClick={disabled ? undefined : onClick}
                                                                                                                                                                                    {...props}
                                                                                                                                                                                          />
                                                                                                                                                                                              );
                                                                                                                                                                                                }

                                                                                                                                                                                                  return (
                                                                                                                                                                                                      <IconComponent
                                                                                                                                                                                                            style={baseStyle}
                                                                                                                                                                                                                  className={`${cursorClasses} ${className}`}
                                                                                                                                                                                                                        onClick={disabled ? undefined : onClick}
                                                                                                                                                                                                                              {...props}
                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                    export default AppIcon;
                                                                                                                                                                                                                                    