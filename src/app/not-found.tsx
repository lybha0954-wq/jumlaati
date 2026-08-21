'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-arabic" dir="rtl">
              <h1 className="text-3xl font-black text-white mb-2">404</h1>
                    <p className="text-xs text-slate-400 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة في منصة جملتي.</p>
                          <button 
                                  onClick={() => router.push('/')}
                                          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg"
                                                >
                                                        العودة للرئيسية
                                                              </button>
                                                                  </div>
                                                                    );
                                                                    }
