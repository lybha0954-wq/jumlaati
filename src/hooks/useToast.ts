import { toast } from 'sonner';
export function useToast() { return { showToast: (t: string, m: string, s?: string) => { if (t === 'success') toast.success(m, { description: s }); else if (t === 'error') toast.error(m, { description: s }); else toast(m); } }; }
