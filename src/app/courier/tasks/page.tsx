'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, PackageCheck } from 'lucide-react';

export default function CourierTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('courier_id', user?.id)
        .in('status', ['assigned', 'delivering']);
      if (!error && data) setTasks(data);
    }
    fetchTasks();
  }, [user?.id]);

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setTasks((prev) => prev.filter((t) => t.id !== orderId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">المهام المكلف بها</h1>
      <p className="text-slate-400 mt-2">هذه الطلبات التي كلفك بها المورد:</p>

      <div className="mt-6 space-y-4">
        {tasks.length === 0 && (
          <p className="text-slate-500">لا توجد مهام حالياً.</p>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{task.buyer_store_name || 'متجر غير محدد'}</h3>
              <span className="text-xs text-amber-400">{task.delivery_city}</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              <MapPin size={14} className="inline ml-1" />
              {task.delivery_address}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              <Phone size={14} className="inline ml-1" />
              {task.buyer_phone}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => updateStatus(task.id, 'delivering')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm"
              >
                بدأت التوصيل
              </button>
              <button
                onClick={() => updateStatus(task.id, 'completed')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm"
              >
                تم التسليم
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
