// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path, secret } = await request.json();

    // تحقق أمان (تأكد من وجود متغير بيئي)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!path) {
      return NextResponse.json({ message: 'Path is required' }, { status: 400 });
    }

    // إعادة توليد المسار المطلوب (مثل /products/123 أو /store/acme)
    revalidatePath(path);
    
    return NextResponse.json({ revalidated: true, path });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
// app/api/products/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// تحديد حجم الصورة القياسي (مناسب للويب)
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 80; // جودة 80% للتوازن بين الحجم والجودة

export async function POST(request: NextRequest) {
  try {
    // 1. التحقق من المصادقة
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
    }

    // 2. استقبال الملف وـ productId من الـ FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: 'الملف أو معرف المنتج مفقود' }, { status: 400 });
    }

    // 3. التحقق من أن هذا المنتج يخص هذا المورد (أمان)
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('supplier_id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    // نتحقق من دور المستخدم (يسمح فقط للموردين أو المشرفين)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isSupplier = profile?.role === 'supplier';
    const isAdmin = profile?.role === 'admin';
    const isOwner = product.supplier_id === user.id;

    if (!isAdmin && !(isSupplier && isOwner)) {
      return NextResponse.json({ error: 'لا تملك صلاحية تعديل هذا المنتج' }, { status: 403 });
    }

    // 4. تحويل الملف إلى Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. معالجة الصورة (ضغط وتحويل إلى WebP) باستخدام Sharp
    const processedImageBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside', // يحافظ على الأبعاد الأصلية دون قص
        withoutEnlargement: true, // لا يُكبّر الصور الصغيرة
      })
      .webp({ quality: QUALITY }) // تحويل إلى WebP
      .toBuffer();

    // 6. إنشاء مسار فريد للملف (لتجنب التكرار)
    const fileExtension = 'webp';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${user.id}/${productId}/${fileName}`; // تنظيم المجلدات

    // 7. رفع الصورة المضغوطة إلى Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, processedImageBuffer, {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000', // تخزين مؤقت لمدة سنة
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 });
    }

    // 8. الحصول على الرابط العام للصورة
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    // 9. تحديث جدول المنتجات وإضافة الرابط إلى مصفوفة `images`
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({
        images: supabase.raw(`array_append(COALESCE(images, '{}'::text[]), '${publicUrl}')`)
      })
      .eq('id', productId)
      .select('images')
      .single();

    if (updateError) {
      // إذا فشل التحديث، نحذف الصورة التي رفعناها لتجنب الملفات اليتيمة
      await supabase.storage.from('product-images').remove([filePath]);
      console.error('DB Update Error:', updateError);
      return NextResponse.json({ error: 'فشل تحديث بيانات المنتج' }, { status: 500 });
    }

    // 10. إعادة توليد صفحة المنتج فوراً (On-Demand Revalidation)
    const { data: productSlug } = await supabase
      .from('products')
      .select('slug')
      .eq('id', productId)
      .single();

    if (productSlug?.slug) {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `/products/${productSlug.slug}`,
          secret: process.env.REVALIDATION_SECRET
        })
      });
    }

    return NextResponse.json({
      success: true,
      images: updatedProduct?.images || [],
      publicUrl,
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'حدث خطأ داخلي في الخادم' }, { status: 500 });
  }
}
