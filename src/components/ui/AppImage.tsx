'use client';

import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import Image from 'next/image';

// صورة SVG افتراضية في حال عدم توفر ملف محلي
const DEFAULT_FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%239CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

export interface AppImageProps {
  src: string;
    alt: string;
      width?: number;
        height?: number;
          className?: string;
            priority?: boolean;
              quality?: number;
                placeholder?: 'blur' | 'empty';
                  blurDataURL?: string;
                    fill?: boolean;
                      sizes?: string;
                        onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void;
                          fallbackSrc?: string;
                            loading?: 'lazy' | 'eager';
                              unoptimized?: boolean;
                                containerClassName?: string;
                                  style?: React.CSSProperties;
                                    [key: string]: any;
                                    }

                                    export const AppImage = memo(function AppImage({
                                      src,
                                        alt,
                                          width,
                                            height,
                                              className = '',
                                                priority = false,
                                                  quality = 85,
                                                    placeholder = 'empty',
                                                      blurDataURL,
                                                        fill = false,
                                                          sizes,
                                                            onClick,
                                                              fallbackSrc = '/assets/images/no_image.png',
                                                                loading = 'lazy',
                                                                  unoptimized = false,
                                                                    containerClassName = '',
                                                                      style,
                                                                        ...props
                                                                        }: AppImageProps) {
                                                                          const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc || DEFAULT_FALLBACK_SVG);
                                                                            const [isLoading, setIsLoading] = useState<boolean>(true);
                                                                              const [hasError, setHasError] = useState<boolean>(false);

                                                                                // تحديث الصورة في حال تغير المصدر (src) من المكون الأب
                                                                                  useEffect(() => {
                                                                                      setImageSrc(src || fallbackSrc || DEFAULT_FALLBACK_SVG);
                                                                                          setHasError(false);
                                                                                              setIsLoading(true);
                                                                                                }, [src, fallbackSrc]);

                                                                                                  const isExternalUrl = useMemo(
                                                                                                      () => typeof imageSrc === 'string' && (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')),
                                                                                                          [imageSrc]
                                                                                                            );

                                                                                                              const resolvedUnoptimized = unoptimized || isExternalUrl || imageSrc.startsWith('data:');

                                                                                                                const handleError = useCallback(() => {
                                                                                                                    if (!hasError) {
                                                                                                                          setHasError(true);
                                                                                                                                setImageSrc(fallbackSrc || DEFAULT_FALLBACK_SVG);
                                                                                                                                    }
                                                                                                                                        setIsLoading(false);
                                                                                                                                          }, [hasError, fallbackSrc]);

                                                                                                                                            const handleLoad = useCallback(() => {
                                                                                                                                                setIsLoading(false);
                                                                                                                                                    setHasError(false);
                                                                                                                                                      }, []);

                                                                                                                                                        const imageClassName = useMemo(() => {
                                                                                                                                                            const classes = ['transition-all duration-300', className];
                                                                                                                                                                if (isLoading) classes.push('bg-slate-200 dark:bg-slate-800 animate-pulse');
                                                                                                                                                                    if (onClick) classes.push('cursor-pointer hover:opacity-90 active:scale-[0.99]');
                                                                                                                                                                        return classes.filter(Boolean).join(' ');
                                                                                                                                                                          }, [className, isLoading, onClick]);

                                                                                                                                                                            const imageProps = useMemo(() => {
                                                                                                                                                                                const baseProps: Record<string, any> = {
                                                                                                                                                                                      src: imageSrc,
                                                                                                                                                                                            alt: alt || 'صورة',
                                                                                                                                                                                                  className: imageClassName,
                                                                                                                                                                                                        quality,
                                                                                                                                                                                                              placeholder,
                                                                                                                                                                                                                    unoptimized: resolvedUnoptimized,
                                                                                                                                                                                                                          onError: handleError,
                                                                                                                                                                                                                                onLoad: handleLoad,
                                                                                                                                                                                                                                      onClick,
                                                                                                                                                                                                                                            style,
                                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                                    if (priority) {
                                                                                                                                                                                                                                                          baseProps.priority = true;
                                                                                                                                                                                                                                                              } else {
                                                                                                                                                                                                                                                                    baseProps.loading = loading;
                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                            if (blurDataURL && placeholder === 'blur') {
                                                                                                                                                                                                                                                                                  baseProps.blurDataURL = blurDataURL;
                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                          return baseProps;
                                                                                                                                                                                                                                                                                            }, [
                                                                                                                                                                                                                                                                                                imageSrc,
                                                                                                                                                                                                                                                                                                    alt,
                                                                                                                                                                                                                                                                                                        imageClassName,
                                                                                                                                                                                                                                                                                                            quality,
                                                                                                                                                                                                                                                                                                                placeholder,
                                                                                                                                                                                                                                                                                                                    resolvedUnoptimized,
                                                                                                                                                                                                                                                                                                                        handleError,
                                                                                                                                                                                                                                                                                                                            handleLoad,
                                                                                                                                                                                                                                                                                                                                onClick,
                                                                                                                                                                                                                                                                                                                                    style,
                                                                                                                                                                                                                                                                                                                                        priority,
                                                                                                                                                                                                                                                                                                                                            loading,
                                                                                                                                                                                                                                                                                                                                                blurDataURL,
                                                                                                                                                                                                                                                                                                                                                  ]);

                                                                                                                                                                                                                                                                                                                                                    if (fill) {
                                                                                                                                                                                                                                                                                                                                                        return (
                                                                                                                                                                                                                                                                                                                                                              <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
                                                                                                                                                                                                                                                                                                                                                                      <Image
                                                                                                                                                                                                                                                                                                                                                                                {...imageProps}
                                                                                                                                                                                                                                                                                                                                                                                          fill
                                                                                                                                                                                                                                                                                                                                                                                                    sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                                                                                                                                                                                                                                                                                                                                                                                                              style={{ objectFit: 'cover', ...style }}
                                                                                                                                                                                                                                                                                                                                                                                                                        {...props}
                                                                                                                                                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                              return (
                                                                                                                                                                                                                                                                                                                                                                                                                                                  <Image
                                                                                                                                                                                                                                                                                                                                                                                                                                                        {...imageProps}
                                                                                                                                                                                                                                                                                                                                                                                                                                                              width={width || 400}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    height={height || 300}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                          sizes={sizes}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                {...props}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      AppImage.displayName = 'AppImage';

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      export default AppImage;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      