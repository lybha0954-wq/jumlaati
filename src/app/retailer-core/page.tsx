
'use client';
import { useState } from 'react';
import { ShoppingCart, Package, Clock, CreditCard, LogOut, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RetailerCore() {
  const router = useRouter();
    const { signOut } = useAuth();

      return (
          <div className="min-h-screen bg-slate-950 text-slate-100 font-arabic p-6" dir="rtl">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                        <div>
                                  <h1 className="text-xl font-black text-white">متجر التجزئة</h1>
                                            <p className="text-xs text-slate-400">لوحة الطلبات والعمليات اليومية</p>
                                                    </div>
                                                            <button onClick={() => { signOut(); router.push('/portal'); }} className="text-rose-400 text-xs flex items-center gap-2">
                                                                      <LogOut size={16} /> خروج
                                                                              </button>
                                                                                    </header>

                                                                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                                                  <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                                                                                            <div className="relative mb-6">
                                                                                                                        <Search className="absolute right-3 top-3 text-slate-500" size={18} />
                                                                                                                                    <input type="text" placeholder="ابحث عن بضاعة..." className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-3 pr-10 text-xs outline-none" />
                                                                                                                                              </div>
                                                                                                                                                        <div className="text-center py-20 text-slate-500 text-xs">جاري تحميل المنتجات المتوفرة في السوق...</div>
                                                                                                                                                                </div>

                                                                                                                                                                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                                                                                                                                                                  <h2 className="text-sm font-bold mb-4 flex items-center gap-2"><ShoppingCart size={18}/> سلة الطلبات</h2>
                                                                                                                                                                                            <div className="border-t border-slate-800 pt-4 text-center text-slate-500 text-xs">السلة فارغة</div>
                                                                                                                                                                                                    </div>
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                );
                                                                                                                                                                                                                }
                                                                                                                                                                                                                