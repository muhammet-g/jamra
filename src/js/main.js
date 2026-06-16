import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

import { addItem } from './modules/cart.js';
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

function bindCategoryFilters() {
  document.querySelector('.js-category-strip').addEventListener('click', (event) => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;

    activeCategory = button.dataset.categoryId;
    renderCategories(activeCategory);
    renderProducts(activeCategory);
  });
}

function bindAddToCart() {
  document.querySelector('.js-products-grid').addEventListener('click', async (event) => {
    const button = event.target.closest('.js-add-product');
    if (!button) return;

    const product = getProductById(button.dataset.productId);
    if (!product || !product.availability) return;

    addItem(product);
    renderCart();
    pulseCartBadge();
    await showAddSuccess();
  });
}

function init() {
  renderCategories(activeCategory);
  renderProducts(activeCategory);
  renderOffers();
  renderCart();
  bindCategoryFilters();
  bindAddToCart();
  bindCartControls();
  bindInvoiceDrawer();
  bindNavigationState();
}

init();
