"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ابدأ
    setVisible(true);
    setProgress(15);

    // تقدّم تدريجي
    const t1 = setTimeout(() => setProgress(45), 120);
    const t2 = setTimeout(() => setProgress(75), 300);
    const t3 = setTimeout(() => setProgress(95), 600);

    // انتهِ
    const t4 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setProgress(0), 250);
      }, 150);
    }, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-0.5"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 250ms ease",
        pointerEvents: "none",
      }}
    >
      <div
        className="h-full bg-gradient-to-l from-[#3a9d82] via-[#2e8b73] to-[#1e6b57]"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 && progress < 100
            ? "0 0 8px rgba(46, 139, 115, 0.6)"
            : "none",
          transition: "width 300ms ease, box-shadow 200ms ease",
        }}
      />
    </div>
  );
}
