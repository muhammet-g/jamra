import { discountRules } from '../data/discounts.js';
import { loadCart, saveCart, resetCartStorage } from './storage.js';

let cartItems = loadCart();

// تقريب القيم المالية لتفادي كسور JavaScript الطويلة مثل 10.399999.
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function persist() {
  saveCart(cartItems);
}

// نعيد نسخة من العناصر حتى لا تعدل الواجهة الحالة الأصلية مباشرة.
export function getCartItems() {
  return [...cartItems];
}

// إضافة منتج للفاتورة أو زيادة كميته إذا كان موجودًا مسبقًا.
export function addItem(product) {
  if (!product.availability) return;

  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      quantity: 1,
    });
  }

  persist();
}

// زيادة كمية صنف موجود داخل الفاتورة.
export function increaseQuantity(productId) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += 1;
  persist();
}

// تقليل الكمية، وإذا وصلت إلى صفر يتم حذف الصنف من الفاتورة.
export function decreaseQuantity(productId) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  if (item.quantity <= 1) {
    removeItem(productId);
    return;
  }

  item.quantity -= 1;
  persist();
}

// حذف صنف واحد من الفاتورة حسب معرّفه.
export function removeItem(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  persist();
}

// مسح الفاتورة من الذاكرة ومن localStorage.
export function clearCart() {
  cartItems = [];
  resetCartStorage();
}

// حساب المجموع قبل تطبيق أي خصومات.
export function getSubtotal() {
  return roundMoney(
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  );
}

// تطبيق قواعد الخصم القابلة للتعديل من discounts.js.
export function getDiscounts() {
  const subtotal = getSubtotal();

  return discountRules
    .map((rule) => {
      // خصومات مرتبطة بكمية منتج محدد، مثل 3 كيلو كباب.
      if (rule.type === 'itemQuantity') {
        const item = cartItems.find((cartItem) => cartItem.id === rule.productId);
        if (!item || item.quantity < rule.minQuantity) return null;

        const base = item.price * item.quantity;
        return {
          id: rule.id,
          title: rule.title,
          amount: roundMoney((base * rule.percentage) / 100),
          percentage: rule.percentage,
        };
      }

      // خصومات مرتبطة بإجمالي الفاتورة، مثل تجاوز 250 ريال.
      if (rule.type === 'subtotal' && subtotal > rule.minSubtotal) {
        return {
          id: rule.id,
          title: rule.title,
          amount: roundMoney((subtotal * rule.percentage) / 100),
          percentage: rule.percentage,
        };
      }

      return null;
    })
    .filter(Boolean);
}

// تجميع كل أرقام الفاتورة التي تحتاجها الواجهة في مكان واحد.
export function getTotals() {
  const subtotal = getSubtotal();
  const discounts = getDiscounts();
  const discountTotal = roundMoney(
    discounts.reduce((total, discount) => total + discount.amount, 0),
  );

  return {
    subtotal,
    discounts,
    discountTotal,
    total: Math.max(0, roundMoney(subtotal - discountTotal)),
    count: cartItems.reduce((total, item) => total + item.quantity, 0),
  };
}
