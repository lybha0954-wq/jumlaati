'use client';

import { createClient } from '@/lib/supabase/client';

export interface AppNotificationDB {
  id: string;
  userId: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: 'order' | 'invoice' | 'stock' | 'system';
  isRead: boolean;
  linkUrl: string;
  roleTarget: 'admin' | 'supplier' | 'retailer' | 'all';
  data?: Record<string, any>;
  createdAt: string;
}

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    return /relation.*does not exist|column.*does not exist|function.*does not exist|syntax error/i.test(error.message);
  }
  return false;
}

function toNotification(row: any): AppNotificationDB {
  return {
    id: row.id,
    userId: row.user_id,
    titleAr: row.title_ar ?? '',
    titleEn: row.title_en ?? '',
    messageAr: row.message_ar ?? '',
    messageEn: row.message_en ?? '',
    type: row.type as AppNotificationDB['type'],
    isRead: row.is_read ?? false,
    linkUrl: row.link_url ?? '',
    roleTarget: (row.role_target ?? 'all') as AppNotificationDB['roleTarget'],
    data: row.data ?? undefined,
    createdAt: row.created_at,
  };
}

export const notificationService = {
  async getForUser(userId: string): Promise<AppNotificationDB[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) { if (isSchemaError(error)) throw error; return []; }
      return (data ?? []).map(toNotification);
    } catch (e: any) { if (isSchemaError(e)) throw e; return []; }
  },

  async getUnreadCount(userId: string): Promise<number> {
    const supabase = createClient();
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      if (error) { if (isSchemaError(error)) throw error; return 0; }
      return count ?? 0;
    } catch (e: any) { if (isSchemaError(e)) throw e; return 0; }
  },

  async markAsRead(id: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },

  async create(notification: Omit<AppNotificationDB, 'id' | 'createdAt'>): Promise<AppNotificationDB | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          title_ar: notification.titleAr,
          title_en: notification.titleEn,
          message_ar: notification.messageAr,
          message_en: notification.messageEn,
          type: notification.type,
          is_read: notification.isRead ?? false,
          link_url: notification.linkUrl ?? '',
          role_target: notification.roleTarget ?? 'all',
          data: notification.data ?? null,
        })
        .select()
        .single();
      if (error) { if (isSchemaError(error)) throw error; return null; }
      return toNotification(data);
    } catch (e: any) { if (isSchemaError(e)) throw e; return null; }
  },

  async delete(id: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) { if (isSchemaError(error)) throw error; return false; }
      return true;
    } catch (e: any) { if (isSchemaError(e)) throw e; return false; }
  },
};
