'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import type { Product } from './InventoryContent';
import { Barcode, Loader2, Camera } from 'lucide-react';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  editingProduct: Product | null;
  prefillData?: {
    barcode: string;
    name: string;
    image: string;
    category: string;
  } | null;
}

type FormValues = Omit<Product, 'id'>;

const categories = ['مشروبات', 'وجبات خفيفة', 'قهوة وشاي', 'زيوت', 'بقالة أساسية', 'معلبات', 'حلويات', 'ألبان', 'منظفات', 'أخرى'];
const units = ['قطعة', 'كرتون', 'كيس', 'علبة', 'لتر', 'كغ'];
const statuses: Product['status'][] = ['متوفر', 'منخفض', 'نفد', 'موقوف'];

export default function ProductModal({ open, onClose, onSave, editingProduct, prefillData }: ProductModalProps) {
  const [saving, setSaving] = useState(false);
  const [productImage, setProductImage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      barcode: '',
      name: '',
      category: 'مشروبات',
      costPrice: 0,
      originalPrice: 0,
      finalPrice: 0,
      stock: 0,
      minOrderQty: 1,
      status: 'متوفر',
      unit: 'قطعة',
    },
  });

  useEffect(() => {
    if (editingProduct) {
      const { id, ...rest } = editingProduct;
      reset(rest);
      setProductImage('');
    } else if (prefillData) {
      reset({
        barcode: prefillData.barcode,
        name: prefillData.name,
        category: prefillData.category || 'أخرى',
        costPrice: 0,
        originalPrice: 0,
        finalPrice: 0,
        stock: 0,
        minOrderQty: 1,
        status: 'متوفر',
        unit: 'قطعة',
      });
      setProductImage(prefillData.image || '');
    } else {
      reset({
        barcode: '', name: '', category: 'مشروبات',
        costPrice: 0, originalPrice: 0, finalPrice: 0,
        stock: 0, minOrderQty: 1, status: 'متوفر', unit: 'قطعة',
      });
      setProductImage('');
    }
  }, [editingProduct, prefillData, reset, open]);

  // Backend integration point: POST /api/products or PUT /api/products/:id
  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    const product: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      ...values,
      costPrice: Number(values.costPrice),
      originalPrice: Number(values.originalPrice),
      finalPrice: Number(values.finalPrice),
      stock: Number(values.stock),
      minOrderQty: Number(values.minOrderQty),
    };
    onSave(product);
    setSaving(false);
  };

  const FieldError = ({ name }: { name: keyof FormValues }) =>
    errors[name] ? (
      <p className="text-xs text-danger font-arabic mt-1">{errors[name]?.message as string}</p>
    ) : null;

  const isScannedMode = !editingProduct && !!prefillData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border text-foreground font-arabic font-semibold text-sm hover:bg-muted transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-arabic font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-95 min-w-[100px] justify-center"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'
            )}
          </button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Scanned product preview banner */}
        {isScannedMode && prefillData?.name && (
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
            {productImage ? (
              <img
                src={productImage}
                alt={prefillData.name}
                className="w-14 h-14 object-contain rounded-lg bg-white border border-border flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                <Camera size={18} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-arabic text-emerald-700 dark:text-emerald-400 font-semibold mb-0.5">✓ تم جلب بيانات المنتج تلقائياً</p>
              <p className="font-arabic font-bold text-foreground text-sm leading-snug line-clamp-1">{prefillData.name}</p>
              <span className="inline-block bg-primary/10 text-primary text-xs font-arabic font-semibold px-2 py-0.5 rounded-md mt-1">
                {prefillData.category}
              </span>
            </div>
          </div>
        )}

        {/* Barcode + Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              الباركود <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Barcode size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                {...register('barcode', { required: 'الباركود مطلوب' })}
                placeholder="6291001234567"
                readOnly={isScannedMode}
                className={`w-full bg-background border border-border rounded-xl pr-9 pl-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all ${isScannedMode ? 'opacity-70 cursor-default' : ''}`}
              />
            </div>
            <p className="text-xs text-muted-foreground font-arabic mt-1">رقم الباركود المطبوع على المنتج</p>
            <FieldError name="barcode" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
              اسم المنتج <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: 'اسم المنتج مطلوب', minLength: { value: 2, message: 'يجب أن يكون الاسم حرفين على الأقل' } })}
              placeholder="مياه نستله 500 مل"
              readOnly={isScannedMode && !!prefillData?.name}
              className={`w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all ${isScannedMode && prefillData?.name ? 'opacity-70 cursor-default' : ''}`}
            />
            <FieldError name="name" />
          </div>
        </div>

        {/* Category + Unit + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">الفئة</label>
            <select
              {...register('category')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all appearance-none"
            >
              {categories.map((c) => (
                <option key={`cat-sel-${c}`} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">وحدة القياس</label>
            <select
              {...register('unit')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all appearance-none"
            >
              {units.map((u) => (
                <option key={`unit-sel-${u}`} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">حالة المنتج</label>
            <select
              {...register('status')}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-arabic text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all appearance-none"
            >
              {statuses.map((s) => (
                <option key={`status-sel-${s}`} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Scanned mode: only show the 3 required fields prominently */}
        {isScannedMode ? (
          <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-4">
            <h4 className="font-arabic font-bold text-sm text-foreground pb-2 border-b border-border flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">!</span>
              أدخل بيانات البيع بالجملة
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                  سعر الجملة (IQD) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('finalPrice', {
                    required: 'سعر الجملة مطلوب',
                    min: { value: 1, message: 'يجب أن يكون السعر أكبر من صفر' },
                  })}
                  placeholder="12000"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
                <FieldError name="finalPrice" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                  الكمية المتوفرة <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('stock', {
                    required: 'الكمية مطلوبة',
                    min: { value: 0, message: 'الكمية لا يمكن أن تكون سالبة' },
                  })}
                  placeholder="100"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
                <FieldError name="stock" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                  الحد الأدنى للطلب <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  {...register('minOrderQty', {
                    required: 'الحد الأدنى مطلوب',
                    min: { value: 1, message: 'يجب أن يكون الحد الأدنى 1 على الأقل' },
                  })}
                  placeholder="12"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
                <FieldError name="minOrderQty" />
              </div>
            </div>
            {/* Hidden fields with defaults for scanned mode */}
            <input type="hidden" {...register('costPrice')} value={0} />
            <input type="hidden" {...register('originalPrice')} value={0} />
          </div>
        ) : (
          <>
            {/* Full pricing section for manual add/edit */}
            <div className="border border-border rounded-xl p-4 bg-muted/20">
              <h4 className="font-arabic font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border">
                تفاصيل الأسعار (بالدينار العراقي)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                    سعر التكلفة <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('costPrice', {
                      required: 'سعر التكلفة مطلوب',
                      min: { value: 1, message: 'يجب أن يكون السعر أكبر من صفر' },
                    })}
                    placeholder="8500"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <p className="text-xs text-muted-foreground font-arabic mt-1">السعر الذي اشتريت به</p>
                  <FieldError name="costPrice" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                    السعر الأصلي <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('originalPrice', {
                      required: 'السعر الأصلي مطلوب',
                      min: { value: 1, message: 'يجب أن يكون السعر أكبر من صفر' },
                    })}
                    placeholder="10000"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <p className="text-xs text-muted-foreground font-arabic mt-1">السعر قبل الخصم</p>
                  <FieldError name="originalPrice" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                    السعر النهائي <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('finalPrice', {
                      required: 'السعر النهائي مطلوب',
                      min: { value: 1, message: 'يجب أن يكون السعر أكبر من صفر' },
                    })}
                    placeholder="12000"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <p className="text-xs text-muted-foreground font-arabic mt-1">السعر المعروض للمحلات</p>
                  <FieldError name="finalPrice" />
                </div>
              </div>
            </div>

            {/* Stock section */}
            <div className="border border-border rounded-xl p-4 bg-muted/20">
              <h4 className="font-arabic font-semibold text-sm text-foreground mb-3 pb-2 border-b border-border">
                إعدادات المخزون والطلب
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                    الكمية المتوفرة <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('stock', {
                      required: 'الكمية مطلوبة',
                      min: { value: 0, message: 'الكمية لا يمكن أن تكون سالبة' },
                    })}
                    placeholder="100"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <p className="text-xs text-muted-foreground font-arabic mt-1">الكمية الحالية في المستودع</p>
                  <FieldError name="stock" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground font-arabic mb-1.5">
                    الحد الأدنى للطلب (MOQ) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('minOrderQty', {
                      required: 'الحد الأدنى مطلوب',
                      min: { value: 1, message: 'يجب أن يكون الحد الأدنى 1 على الأقل' },
                    })}
                    placeholder="12"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <p className="text-xs text-muted-foreground font-arabic mt-1">أقل كمية يمكن للمحل طلبها</p>
                  <FieldError name="minOrderQty" />
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}