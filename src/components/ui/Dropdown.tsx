"use client";

import React, { useState, useEffect } from 'react';
import * as React from "react";
import { cn } from "@/lib/utils";

export function Dropdown({ trigger, children, align = "end" }: { trigger: React.ReactNode; children: React.ReactNode; align?: "start" | "end" }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={cn("absolute z-50 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg", align === "end" ? "left-0" : "right-0")}>
          {children}
        </div>
      )}
    </div>
  );
}
