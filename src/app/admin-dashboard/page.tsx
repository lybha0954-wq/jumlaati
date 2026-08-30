import React from 'react';
import { AdminDashboardContent } from './components/AdminDashboardContent';

export const metadata = {
  title: 'لوحة تحكم المدير — جُمْلَتِي',
  description: 'نظرة عامة ومؤشرات أداء منصة توريد البقالة بالجملة',
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
