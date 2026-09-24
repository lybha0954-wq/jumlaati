import { toast } from 'sonner';
export function useToast() {
  return { showToast: (type: string, message: string, sub?: string) => {
    if (type === 'success') toast.success(message, { description: sub });
    else if (type === 'error') toast.error(message, { description: sub });
    else toast(message, { description: sub });
  }};
}
