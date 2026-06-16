const STORAGE_KEY = 'jamr_invoice_cart_v1';

// قراءة الفاتورة المحفوظة عند فتح الموقع أو تحديث الصفحة.
export function loadCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn('Unable to read JAMR cart from localStorage.', error);
    return [];
  }
}

// حفظ كل تغيير في الفاتورة حتى لا تضيع اختيارات الزبون بعد التحديث.
export function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Unable to save JAMR cart to localStorage.', error);
  }
}

// حذف نسخة الفاتورة من التخزين عند مسح الطلب بالكامل.
export function resetCartStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
