'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      // توجيه المستخدم حسب دوره بعد تسجيل الدخول
      // سيتم ذلك تلقائياً بعد جلب البروفايل، لكن هنا نستخدم مسار عام
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">تسجيل الدخول</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition"
          >
            دخول
          </button>
        </form>
        <p className="text-center text-slate-500 text-xs mt-6">منصة جملتي - السوق العراقي</p>
      </div>
    </div>
  );
}
