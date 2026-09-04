"use client";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/dashboard/Topbar";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Coins, Star } from "lucide-react";

export default function RetailerPointsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await fetch("/api/points");
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
          const total = data.reduce((sum: number, tx: any) => sum + (tx.type === 'earn' ? tx.points : -tx.points), 0);
          setTotalPoints(total);
        }
      } catch (error) {
        showToast("خطأ في جلب النقاط", "error");
      }
    };
    fetchPoints();
  }, []);

  const columns = [
    { key: "id", header: "المعرف" },
    { key: "type", header: "النوع", render: (row: any) => (
        <Badge variant={row.type === 'earn' ? 'success' : 'destructive'}>{row.type === 'earn' ? 'كسب' : 'استهلاك'}</Badge>
    )},
    { key: "points", header: "النقاط", render: (row: any) => (
        <span className={row.type === 'earn' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
          {row.type === 'earn' ? '+' : '-'}{row.points}
        </span>
    )},
    { key: "created_at", header: "التاريخ", render: (row: any) => new Date(row.created_at).toLocaleDateString('ar-IQ') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">نقاط الولاء</h1>
          <Badge variant="default" className="text-lg px-4 py-2">
            <Coins className="ml-2" size={18} /> {totalPoints} نقطة
          </Badge>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {transactions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <Star className="mx-auto mb-4 text-gray-300" size={48} />
              لا توجد معاملات نقاط بعد. ابدأ بالتسوق لتكسب النقاط!
            </div>
          ) : (
            <DataTable data={transactions} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
}
