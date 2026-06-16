const STORAGE_KEY = 'jamr_invoice_cart_v1';

export function loadCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.warn('Unable to read JAMR cart from localStorage.', error);
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Unable to save JAMR cart to localStorage.', error);
  }
}

export function resetCartStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
