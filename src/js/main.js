import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

import { addItem, decreaseQuantity, getCartItems, increaseQuantity } from './modules/cart.js';
import { showAddSuccess } from './modules/alerts.js';
import { getProductById, renderCategories, renderProducts } from './modules/renderProducts.js';
import {
  bindCartControls,
  bindInvoiceDrawer,
  bindNavigationState,
  pulseCartBadge,
  renderCart,
  renderOffers,
} from './modules/ui.js';

let activeCategory = 'all';

// تغيير التصنيف النشط وإعادة عرض المنتجات المناسبة له.
function bindCategoryFilters() {
  document.querySelector('.js-category-strip').addEventListener('click', (event) => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;

    activeCategory = button.dataset.categoryId;
    renderCategories(activeCategory);
    renderProducts(activeCategory, getCartItems());
  });
}

// نقطة تحديث مشتركة حتى تبقى الفاتورة وكروت المنتجات متزامنة.
function refreshCartViews() {
  renderCart();
  renderProducts(activeCategory, getCartItems());
}

// التعامل مع إضافة المنتج وأزرار الكمية الظاهرة داخل كارت المنتج.
function bindAddToCart() {
  document.querySelector('.js-products-grid').addEventListener('click', async (event) => {
    const button = event.target.closest('.js-add-product');
    const quantityControl = event.target.closest('[data-product-cart-action]');

    if (quantityControl) {
      const productId = quantityControl.dataset.productId;

      if (quantityControl.dataset.productCartAction === 'increase') {
        increaseQuantity(productId);
        refreshCartViews();
        pulseCartBadge();
        return;
      }

      if (quantityControl.dataset.productCartAction === 'decrease') {
        decreaseQuantity(productId);
        refreshCartViews();
        return;
      }
    }

    if (!button) return;

    const product = getProductById(button.dataset.productId);
    if (!product || !product.availability) return;

    addItem(product);
    refreshCartViews();
    pulseCartBadge();
    await showAddSuccess();
  });
}

// تشغيل كل عمليات الرسم والربط عند تحميل التطبيق.
function init() {
  renderCategories(activeCategory);
  renderProducts(activeCategory, getCartItems());
  renderOffers();
  renderCart();
  bindCategoryFilters();
  bindAddToCart();
  bindCartControls(refreshCartViews);
  bindInvoiceDrawer();
  bindNavigationState();
}

init();
