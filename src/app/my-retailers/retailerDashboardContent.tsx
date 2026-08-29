'use client';

import React, { useState } from 'react';
import { 
  Store, 
  Phone, 
  MapPin, 
  Search, 
  Plus, 
  CheckCircle2, 
  User, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface BranchRelation {
  id: number;
  branchName: string;
  chainName: string;
  manager: string;
  phone: string;
  city: string;
  totalOrders: number;
  lastOrderDate: string;
  status: 'نشط' | 'معلق';
}

export default function MyBranchesContent() {
  const [branches, setBranches] = useState<BranchRelation[]>([
    { id: 101, branchName: 'فرع النخيل مول', chainName: 'مطاعم البرجر الذهبي', manager: 'محمد العتيبي', phone: '+966 50 111 2233', city: 'الرياض', totalOrders: 45, lastOrderDate: 'منذ يومين', status: 'نشط' },
    { id: 102, branchName: 'فرع شارع التحلية', chainName: 'بيتزا روما', manager: 'كارلوس سميث', phone: '+966 54 222 3344', city: 'جدة', totalOrders: 28, lastOrderDate: 'أمس', status: 'نشط' },
    { id: 103, branchName: 'الفرع الرئيسي', chainName: 'حلويات الشرق', manager: 'خالد الحربي', phone: '+966 53 333 4455', city: 'الدمام', totalOrders: 62, lastOrderDate: 'منذ 3 أيام', status: 'نشط' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // نموذج ربط فرع جديد بالمورد
  const [newBranch, setNewBranch] = useState({
    branchName: '',
    chainName: '',
    manager: '',
    phone: '',
    city: ''
  });

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.branchName || !newBranch.phone) return;

    const branch: BranchRelation = {
      id: Date.now(),
      branchName: newBranch.branchName,
      chainName: newBranch.chainName || 'فرع مستقل',
      manager: newBranch.manager || 'غير محدد',
      phone: newBranch.phone,
      city: newBranch.city || 'الرياض',
      totalOrders: 0,
      lastOrderDate: 'جديد',
      status: 'نشط'
    };

    setBranches([branch, ...branches]);
    setNewBranch({ branchName: '', chainName: '', manager: '', phone: '', city: '' });
    setIsModalOpen(false);
  };

  const filteredBranches = branches.filter(b => 
    b.branchName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.chainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* رأس الصفحة */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">فروعي ومعاميلي</h1>
            <p className="text-sm text-gray-500 mt-1">قائمة الفروع، المطاعم، والعملاء المسجلين لديك والمرتبطين بنشاطك التوريدي.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع / عميل جديد</span>
          </button>
        </header>

        {/* شريط البحث */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث باسم الفرع، السلسلة، أو اسم المدير..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap">
            إجمالي الفروع: {branches.length}
          </div>
        </div>

        {/* شبكة عرض الفروع والمعاميل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBranches.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400">
              لا توجد نتائج مطابقة لبحثك.
            </div>
          ) : (
            filteredBranches.map((branch) => (
              <div key={branch.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{branch.branchName}</h3>
                    <span className="text-xs text-blue-600 font-semibold">{branch.chainName}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {branch.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium text-gray-400">المدير:</span>
                    <span>{branch.manager}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{branch.city}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    <span>الطلبات: <strong className="text-blue-600">{branch.totalOrders}</strong></span>
                  </div>
                  <div className="text-gray-400">
                    آخر طلب: {branch.lastOrderDate}
                  </div>
                  <button className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <span>السجل</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* نافذة منبثقة (Modal) لإضافة فرع جديد */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-gray-900">ربط فرع أو عميل جديد بك</h2>
              <form onSubmit={handleAddBranch} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">اسم الفرع / المطعم</label>
                  <input 
                    type="text" 
                    placeholder="مثال: فرع النخيل مول"
                    value={newBranch.branchName}
                    onChange={(e) => setNewBranch({...newBranch, branchName: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">اسم السلسلة / العلامة التجارية</label>
                  <input 
                    type="text" 
                    placeholder="مثال: مطاعم البرجر الذهبي"
                    value={newBranch.chainName}
                    onChange={(e) => setNewBranch({...newBranch, chainName: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">اسم المسؤول / المدير</label>
                    <input 
                      type="text" 
                      placeholder="اسم المدير"
                      value={newBranch.manager}
                      onChange={(e) => setNewBranch({...newBranch, manager: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهاتف</label>
                    <input 
                      type="text" 
                      placeholder="+966 ..."
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">المدينة</label>
                  <input 
                    type="text" 
                    placeholder="الرياض، جدة..."
                    value={newBranch.city}
                    onChange={(e) => setNewBranch({...newBranch, city: e.target.value})}
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all shadow-sm shadow-blue-200"
                  >
                    حفظ وربط الفرع
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
                      }
