'use client';
import { Truck, MapPin, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LogisticsFlow() {
  const router = useRouter();
    const { signOut } = useAuth();

      return (
          <div className="min-h-screen bg-slate-950 text-slate-100 font-arabic p-6" dir="rtl">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <div className="flex items-center gap-3">
                                  <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400"><Truck size={24}/></div>
                                            <div>
                                                        <h1 className="text-xl font-black text-white">نظام التوصيل (Logistics)</h1>
                                                                    <p className="text-xs text-slate-400">إدارة حركة الشحنات في المحافظات</p>
                                                                              </div>
                                                                                      </div>
                                                                                              <button onClick={() => { signOut(); router.push('/portal'); }} className="text-rose-400 text-xs flex items-center gap-2">
                                                                                                        <LogOut size={16} /> خروج
                                                                                                                </button>
                                                                                                                      </header>

                                                                                                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                                                                                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                                                                                                                              <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><MapPin size={18}/> المهام الموكلة إليك</h2>
                                                                                                                                                        <div className="space-y-3">
                                                                                                                                                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex justify-between">
                                                                                                                                                                                  <span>شحنة متجر (أ) إلى (ب)</span>
                                                                                                                                                                                                <span className="text-amber-400 font-bold">قيد التسليم</span>
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                                                                                                                                                                                                                                <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><CheckCircle size={18}/> السجل اليومي</h2>
                                                                                                                                                                                                                                                          <div className="text-center py-10 text-slate-500 text-xs">لا توجد عمليات مكتملة اليوم.</div>
                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                              