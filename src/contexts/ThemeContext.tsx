'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
    toggleTheme: () => void;
      setTheme: (theme: Theme) => void;
        isDark: boolean;
          mounted: boolean;
          }

          const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

          export const useTheme = (): ThemeContextValue => {
            const context = useContext(ThemeContext);
              if (!context) {
                  // إرجاع قيمة افتراضية آمنة في حال استدعاء useTheme خارج Provider
                      return {
                            theme: 'light',
                                  toggleTheme: () => {},
                                        setTheme: () => {},
                                              isDark: false,
                                                    mounted: false,
                                                        };
                                                          }
                                                            return context;
                                                            };

                                                            export function ThemeProvider({ children }: { children: React.ReactNode }) {
                                                              const [theme, setThemeState] = useState<Theme>('light');
                                                                const [mounted, setMounted] = useState(false);

                                                                  // تطبيق المظهر على عنصر HTML الرئيسي
                                                                    const applyTheme = useCallback((targetTheme: Theme) => {
                                                                        const root = document.documentElement;
                                                                            if (targetTheme === 'dark') {
                                                                                  root.classList.add('dark');
                                                                                        root.style.colorScheme = 'dark';
                                                                                            } else {
                                                                                                  root.classList.remove('dark');
                                                                                                        root.style.colorScheme = 'light';
                                                                                                            }
                                                                                                              }, []);

                                                                                                                useEffect(() => {
                                                                                                                    setMounted(true);
                                                                                                                        const saved = localStorage.getItem('jumlaati_theme') as Theme | null;

                                                                                                                            if (saved === 'dark' || saved === 'light') {
                                                                                                                                  setThemeState(saved);
                                                                                                                                        applyTheme(saved);
                                                                                                                                            } else {
                                                                                                                                                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                                                                                                                                        const initialTheme: Theme = prefersDark ? 'dark' : 'light';
                                                                                                                                                              setThemeState(initialTheme);
                                                                                                                                                                    applyTheme(initialTheme);
                                                                                                                                                                        }

                                                                                                                                                                            // الاستماع لتغير وضع النظام في حال عدم تحديد خيار ثابت
                                                                                                                                                                                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                                                                                                                                                                                    const handleChange = (e: MediaQueryListEvent) => {
                                                                                                                                                                                          const hasSavedTheme = localStorage.getItem('jumlaati_theme');
                                                                                                                                                                                                if (!hasSavedTheme) {
                                                                                                                                                                                                        const newTheme: Theme = e.matches ? 'dark' : 'light';
                                                                                                                                                                                                                setThemeState(newTheme);
                                                                                                                                                                                                                        applyTheme(newTheme);
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                      mediaQuery.addEventListener('change', handleChange);
                                                                                                                                                                                                                                          return () => mediaQuery.removeEventListener('change', handleChange);
                                                                                                                                                                                                                                            }, [applyTheme]);

                                                                                                                                                                                                                                              const toggleTheme = useCallback(() => {
                                                                                                                                                                                                                                                  setThemeState((prev) => {
                                                                                                                                                                                                                                                        const next: Theme = prev === 'light' ? 'dark' : 'light';
                                                                                                                                                                                                                                                              localStorage.setItem('jumlaati_theme', next);
                                                                                                                                                                                                                                                                    applyTheme(next);
                                                                                                                                                                                                                                                                          return next;
                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                }, [applyTheme]);

                                                                                                                                                                                                                                                                                  const setTheme = useCallback((newTheme: Theme) => {
                                                                                                                                                                                                                                                                                      localStorage.setItem('jumlaati_theme', newTheme);
                                                                                                                                                                                                                                                                                          setThemeState(newTheme);
                                                                                                                                                                                                                                                                                              applyTheme(newTheme);
                                                                                                                                                                                                                                                                                                }, [applyTheme]);

                                                                                                                                                                                                                                                                                                  const value = useMemo(
                                                                                                                                                                                                                                                                                                      () => ({
                                                                                                                                                                                                                                                                                                            theme,
                                                                                                                                                                                                                                                                                                                  toggleTheme,
                                                                                                                                                                                                                                                                                                                        setTheme,
                                                                                                                                                                                                                                                                                                                              isDark: theme === 'dark',
                                                                                                                                                                                                                                                                                                                                    mounted,
                                                                                                                                                                                                                                                                                                                                        }),
                                                                                                                                                                                                                                                                                                                                            [theme, toggleTheme, setTheme, mounted]
                                                                                                                                                                                                                                                                                                                                              );

                                                                                                                                                                                                                                                                                                                                                return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                