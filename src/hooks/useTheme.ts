"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "jumlati-theme";

// ═══ متجر عالمي مشترك — يمنع إعادة العرض المزدوجة ═══
let globalTheme: Theme = "light";
const listeners = new Set<(t: Theme) => void>();

function notifyAll(t: Theme) {
  globalTheme = t;
  listeners.forEach((fn) => fn(t));
}

function applyToDom(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(globalTheme);

  // مرّة واحدة عند mount — نقرأ من DOM الذي ضبطه السكريبت
  useEffect(() => {
    const domTheme: Theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    if (domTheme !== globalTheme) {
      globalTheme = domTheme;
      setThemeState(domTheme);
    }
    const listener = (t: Theme) => setThemeState(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = globalTheme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyToDom(next);
    notifyAll(next);
  }, []);

  const set = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    applyToDom(next);
    notifyAll(next);
  }, []);

  return { theme, toggle, set, mounted: true };
}
