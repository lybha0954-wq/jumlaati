# تصميم سياسات RLS

> تصميم فقط — التنفيذ خطوة بخطوة لاحقاً.

## الترتيب (الأبسط أولاً)
1. categories — عام
2. profiles — كل واحد يرى نفسه
3. products — عام + المورد يكتب
4. notifications — كل واحد يرى إشعاراته
5. relationships — الطرفان + admin
6. orders — 4 أدوار
7. order_items — يتبع الطلب
8. payments — يتبع الطلب
