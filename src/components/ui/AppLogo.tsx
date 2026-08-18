'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

export interface AppLogoProps {
  src?: string;
    iconName?: string;
      size?: number;
        className?: string;
          onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => void;
            showText?: boolean;
              text?: string;
                textClassName?: string;
                  href?: string;
                    priority?: boolean;
                    }

                    export const AppLogo = memo(function AppLogo({
                      src = '/assets/images/app_logo.png',
                        iconName = 'ShoppingBagIcon',
                          size = 40,
                            className = '',
                              onClick,
                                showText = false,
                                  text = 'جملتي',
                                    textClassName = '',
                                      href,
                                        priority = true,
                                        }: AppLogoProps) {
                                          const [imageError, setImageError] = useState(false);

                                            const handleImageError = useCallback(() => {
                                                setImageError(true);
                                                  }, []);

                                                    const containerClassName = useMemo(() => {
                                                        const classes = ['inline-flex items-center gap-2.5 select-none'];
                                                            if (onClick || href) {
                                                                  classes.push('cursor-pointer hover:opacity-85 transition-all active:scale-[0.98]');
                                                                      }
                                                                          if (className) classes.push(className);
                                                                              return classes.join(' ');
                                                                                }, [onClick, href, className]);

                                                                                  const textClasses = useMemo(() => {
                                                                                      return `font-bold text-lg tracking-tight text-foreground ${textClassName}`.trim();
                                                                                        }, [textClassName]);

                                                                                          const handleKeyDown = useCallback(
                                                                                              (e: React.KeyboardEvent<HTMLDivElement>) => {
                                                                                                    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
                                                                                                            e.preventDefault();
                                                                                                                    onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                                                                                                                          }
                                                                                                                              },
                                                                                                                                  [onClick]
                                                                                                                                    );

                                                                                                                                      const renderContent = () => (
                                                                                                                                          <>
                                                                                                                                                {/* عرض الصورة إذا توفرت ولم يحدث خطأ تحميل، وإلا يتم التراجع للأيقونة */}
                                                                                                                                                      {src && !imageError ? (
                                                                                                                                                              <AppImage
                                                                                                                                                                        src={src}
                                                                                                                                                                                  alt={text || 'App Logo'}
                                                                                                                                                                                            width={size}
                                                                                                                                                                                                      height={size}
                                                                                                                                                                                                                className="flex-shrink-0 object-contain rounded-lg"
                                                                                                                                                                                                                          priority={priority}
                                                                                                                                                                                                                                    unoptimized={typeof src === 'string' && src.endsWith('.svg')}
                                                                                                                                                                                                                                              onError={handleImageError}
                                                                                                                                                                                                                                                        fallbackSrc=""
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                      ) : (
                                                                                                                                                                                                                                                                              <div
                                                                                                                                                                                                                                                                                        className="flex items-center justify-center rounded-xl bg-primary/10 text-primary p-1.5 flex-shrink-0"
                                                                                                                                                                                                                                                                                                  style={{ width: size, height: size }}
                                                                                                                                                                                                                                                                                                          >
                                                                                                                                                                                                                                                                                                                    <AppIcon name={iconName} size={Math.round(size * 0.65)} />
                                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                                  )}

                                                                                                                                                                                                                                                                                                                                        {/* عرض اسم التطبيق اختياريًا */}
                                                                                                                                                                                                                                                                                                                                              {showText && text && <span className={textClasses}>{text}</span>}
                                                                                                                                                                                                                                                                                                                                                  </>
                                                                                                                                                                                                                                                                                                                                                    );

                                                                                                                                                                                                                                                                                                                                                      // إذا تم إرسال رابط توجيه href يتم التغليف بـ Link
                                                                                                                                                                                                                                                                                                                                                        if (href) {
                                                                                                                                                                                                                                                                                                                                                            return (
                                                                                                                                                                                                                                                                                                                                                                  <Link href={href} className={containerClassName} onClick={onClick}>
                                                                                                                                                                                                                                                                                                                                                                          {renderContent()}
                                                                                                                                                                                                                                                                                                                                                                                </Link>
                                                                                                                                                                                                                                                                                                                                                                                    );
                                                                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                                                                        return (
                                                                                                                                                                                                                                                                                                                                                                                            <div
                                                                                                                                                                                                                                                                                                                                                                                                  className={containerClassName}
                                                                                                                                                                                                                                                                                                                                                                                                        onClick={onClick}
                                                                                                                                                                                                                                                                                                                                                                                                              onKeyDown={onClick ? handleKeyDown : undefined}
                                                                                                                                                                                                                                                                                                                                                                                                                    role={onClick ? 'button' : undefined}
                                                                                                                                                                                                                                                                                                                                                                                                                          tabIndex={onClick ? 0 : undefined}
                                                                                                                                                                                                                                                                                                                                                                                                                              >
                                                                                                                                                                                                                                                                                                                                                                                                                                    {renderContent()}
                                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                                                                                                                                                                                                          AppLogo.displayName = 'AppLogo';

                                                                                                                                                                                                                                                                                                                                                                                                                                          export default AppLogo;
                                                                                                                                                                                                                                                                                                                                                                                                                                          