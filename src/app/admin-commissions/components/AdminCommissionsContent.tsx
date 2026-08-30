// src/app/admin-commissions/components/AdminCommissionsContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import CommissionSummaryCards from './Commissionsummarycards';
import RequestsList from './Requestslist';
import RequestDetailsModal from './Requestdetailsmodal';
import CommissionSettings from './CommissionSettings';

import RequestsFilters from './Requesfilters';

interface Request {
  id: string;
  type: 'wholesale' | 'retailer' | 'delivery' | 'offer' | 'nearby';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  requester_id: string;
  target_id: string;
  commission_percentage: number;
  commission_amount: number;
  description: string;
  created_at: string;
  updated_at: string;
  requester: { full_name: string; role: string; phone: string };
  target: { full_name: string; role: string; phone: string };
}

interface CommissionData {
  requests: Request[];
  stats: {
    totalRequests: number;
    pendingRequests: number;
    totalCommissions: number;
    completedRequests: number;
    completionRate: number;
  };
  typeDistribution: Record<string, number>;
}

interface AdminCommissionsContentProps {
  initialData: CommissionData;
}

export default function AdminCommissionsContent({ initialData }: AdminCommissionsContentProps) {
  const [data, setData] = useState(initialData);
  const [filteredRequests, setFilteredRequests] = useState(initialData.requests);
  const [filters, setFilters] = useState({ type: 'all', status: 'all', dateRange: 'all' });
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('ar-IQ'));
  }, []);

  // تحديث فوري عند إضافة طلب جديد
  useRealtimeSubscription({
    table: 'commission_requests',
    filter: null,
    onInsert: (payload) => {
      setData(prev => {
        const newRequests = [payload.new, ...prev.requests];
        const newStats = { ...prev.stats };
        newStats.totalRequests += 1;
        if (payload.new.status === 'pending') newStats.pendingRequests += 1;
        if (payload.new.status === 'completed') newStats.completedRequests += 1;
        newStats.completionRate = (newStats.completedRequests / newStats.totalRequests) * 100;

        const newDistribution = { ...prev.typeDistribution };
        newDistribution[payload.new.type] = (newDistribution[payload.new.type] || 0) + 1;

        return {
          requests: newRequests,
          stats: newStats,
          typeDistribution: newDistribution,
        };
      });
    },
    onUpdate: (payload) => {
      setData(prev => {
        const updatedRequests = prev.requests.map(r =>
          r.id === payload.new.id ? { ...r, ...payload.new } : r
        );
        // إعادة حساب الإحصائيات
        const stats = calculateStats(updatedRequests);
        return { ...prev, requests: updatedRequests, stats };
      });
    },
  });

  // تطبيق الفلاتر
  useEffect(() => {
    let filtered = [...data.requests];

    if (filters.type !== 'all') {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const ranges: Record<string, number> = {
        'today': 1,
        'week': 7,
        'month': 30,
        'quarter': 90,
      };
      const days = ranges[filters.dateRange];
      if (days) {
        const cutoff = new Date(now.setDate(now.getDate() - days));
        filtered = filtered.filter(r => new Date(r.created_at) >= cutoff);
      }
    }

    setFilteredRequests(filtered);
  }, [filters, data.requests]);

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen" dir="rtl">
      {/* العنوان */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          💰 إدارة العمولات والطلبات
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          آخر تحديث: {currentTime}
        </span>
      </div>

      {/* بطاقات ملخص العمولات */}
      <CommissionSummaryCards stats={data.stats} typeDistribution={data.typeDistribution} />

      {/* الفلاتر */}
      <RequestsFilters filters={filters} setFilters={setFilters} />

      {/* قائمة الطلبات */}
      <RequestsList
        requests={filteredRequests}
        onViewRequest={handleViewRequest}
      />

      {/* نافذة عرض تفاصيل الطلب */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={() => {
            // تحديث البيانات بعد تغيير الحالة
            setData(prev => ({
              ...prev,
              requests: prev.requests.map(r =>
                r.id === selectedRequest.id ? { ...r, status: 'approved' } : r
              ),
            }));
          }}
        />
      )}

      {/* إعدادات العمولات */}
      <CommissionSettings />
    </div>
  );
}

// دالة مساعدة لحساب الإحصائيات
function calculateStats(requests: Request[]) {
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
  const totalCommissions = requests.reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  return {
    totalRequests,
    pendingRequests,
    totalCommissions,
    completedRequests,
    completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0,
  };
}
