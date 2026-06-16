import { discountRules } from '../data/discounts.js';
import { loadCart, saveCart, resetCartStorage } from './storage.js';

let cartItems = loadCart();

const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function persist() {
  saveCart(cartItems);
}

export function getCartItems() {
  return [...cartItems];
}

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

export function increaseQuantity(productId) {
  const item = cartItems.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += 1;
  persist();
}

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

export function removeItem(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  persist();
}

export function clearCart() {
  cartItems = [];
  resetCartStorage();
}

export function getSubtotal() {
  return roundMoney(
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  );
}

export function getDiscounts() {
  const subtotal = getSubtotal();

  return discountRules
    .map((rule) => {
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
