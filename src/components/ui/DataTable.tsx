"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export function DataTable<T>({ data, columns, className }: { data: T[]; columns: Column<T>[]; className?: string }) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((col) => (
              <th key={col.key as string} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, index) => (
            <tr key={index} className="border-b transition-colors hover:bg-muted/50">
              {columns.map((col) => (
                <td key={col.key as string} className="p-4 align-middle">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
