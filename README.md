# جمر / JAMR QR Menu

واجهة QR Menu عربية فاخرة لمطعم مشاوي premium باسم **جمر / JAMR**.  
المشروع مبني بـ Vite ويدعم عرض المنتجات ديناميكيًا، إضافة الأصناف إلى الفاتورة، حساب الخصومات، حفظ الفاتورة بعد تحديث الصفحة، وتجربة responsive للجوال والكمبيوتر.

> مهم: لا تفتح ملف `index.html` مباشرة من المتصفح، لأن التنسيقات والـ JavaScript تعمل عبر Vite. استخدم أوامر التشغيل بالأسفل.

## التقنيات المستخدمة

- HTML5
- Bootstrap 5
- Sass / SCSS
- Vanilla JavaScript
- Vite
- SweetAlert2
- FontAwesome
- localStorage

## التشغيل المحلي

افتح PowerShell داخل مجلد المشروع:

```powershell
cd c:\main-projects\nirox-projects\jamra
```

ثبّت الحزم:

```powershell
npm install
```

شغّل خادم التطوير:

```powershell
npm run dev
```

ثم افتح الرابط الذي يظهر لك، غالبًا:

```text
http://localhost:5173
```

## حل مشكلة التنسيقات لا تظهر

إذا ظهرت الصفحة بدون تصميم أو بدون ألوان:

1. تأكد أنك لم تفتح `index.html` مباشرة.
2. شغّل المشروع بهذا الأمر:

```powershell
npm run dev
```

3. افتح:

```text
http://localhost:5173
```

السبب: ملفات SCSS والصور وFontAwesome يتم تجميعها بواسطة Vite، لذلك تحتاج تشغيل خادم Vite حتى تظهر التنسيقات بشكل صحيح.

## أوامر المشروع

```powershell
npm run dev
```

تشغيل المشروع أثناء التطوير.

```powershell
npm run build
```

إنشاء نسخة إنتاج داخل مجلد `dist`.

```powershell
npm run preview
```

معاينة نسخة الإنتاج بعد تنفيذ `npm run build`.

## بنية الملفات

```text
src/
  assets/
    images/
      logo/
      products/
  js/
    data/
      products.js
      discounts.js
    modules/
      alerts.js
      cart.js
      renderProducts.js
      storage.js
      ui.js
    main.js
  scss/
    abstracts/
    base/
    components/
    layout/
    main.scss
index.html
package.json
vite.config.js
```

## المميزات

- تصميم عربي RTL فاخر ومناسب لمطعم مشاوي.
- واجهة mobile-first مع تنقل سفلي ثابت للجوال.
- Navbar علوي ثابت للشاشات الكبيرة.
- عرض المنتجات من `products.js` بدون hardcoded HTML.
- إضافة المنتجات إلى الفاتورة.
- زيادة وتقليل الكمية.
- حذف صنف من الفاتورة.
- مسح الفاتورة بالكامل.
- حفظ الفاتورة في `localStorage`.
- استرجاع الفاتورة بعد تحديث الصفحة.
- حساب المجموع الفرعي والخصومات والإجمالي.
- تحديث badge الفاتورة تلقائيًا.
- تنبيهات SweetAlert2 عند الإضافة والحذف والمسح.

## الخصومات الحالية

قواعد الخصم موجودة في:

```text
src/js/data/discounts.js
```

القواعد الافتراضية:

- 2 فروج مشوي كامل = خصم 10%.
- 3 كيلو شيش طاووق = خصم 15%.
- 3 كيلو كباب = خصم 12%.
- فاتورة أعلى من 250 ﷼ = خصم 5%.

## تعديل المنتجات

المنتجات موجودة في:

```text
src/js/data/products.js
```

كل منتج يحتوي على:

```js
{
  id,
  name,
  category,
  description,
  price,
  image,
  tags,
  unit,
  availability
}
```

## النشر على Vercel

إعدادات Vercel المقترحة:

- Framework Preset: `Vite`
- Build Command:

```text
npm run build
```

- Output Directory:

```text
dist
```

## ملاحظات

- المشروع QR Menu فقط.
- لا يوجد backend.
- لا يوجد تسجيل دخول.
- لا يوجد دفع إلكتروني.
- العمل كله يتم داخل المتصفح باستخدام JavaScript وlocalStorage.
