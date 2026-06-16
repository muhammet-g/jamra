import {
  clearCart,
  decreaseQuantity,
  getCartItems,
  getTotals,
  increaseQuantity,
  removeItem,
} from './cart.js';
import { confirmClearCart, confirmRemoveItem } from './alerts.js';
import { discountRules } from '../data/discounts.js';

const currency = '﷼';

const invoiceDrawer = document.querySelector('.js-invoice-drawer');
const invoiceItems = document.querySelector('.js-invoice-items');
const discountList = document.querySelector('.js-discount-list');
const subtotalElement = document.querySelector('.js-subtotal');
const discountTotalElement = document.querySelector('.js-discount-total');
const totalElement = document.querySelector('.js-total');
const badgeElements = document.querySelectorAll('.js-cart-badge');
const offersGrid = document.querySelector('.js-offers-grid');
const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav__item');

function formatPrice(value) {
  return `${value.toLocaleString('ar-SA', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function emptyInvoiceTemplate() {
  return `
    <div class="invoice-empty">
      <i class="fa-solid fa-receipt"></i>
      <strong>الفاتورة فارغة</strong>
      <span>أضف أطباقك المفضلة وسيظهر الإجمالي هنا.</span>
    </div>
  `;
}

function invoiceItemTemplate(item) {
  return `
    <article class="invoice-item">
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <div class="invoice-item__content">
        <h3>${item.name}</h3>
        <span>${formatPrice(item.price)} / ${item.unit}</span>
        <div class="quantity-control" aria-label="تعديل كمية ${item.name}">
          <button type="button" data-cart-action="increase" data-product-id="${item.id}" aria-label="زيادة ${item.name}">
            <i class="fa-solid fa-plus"></i>
          </button>
          <strong>${item.quantity}</strong>
          <button type="button" data-cart-action="decrease" data-product-id="${item.id}" aria-label="إنقاص ${item.name}">
            <i class="fa-solid fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="invoice-item__aside">
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <button class="icon-button icon-button--danger" type="button" data-cart-action="remove" data-product-id="${item.id}" aria-label="حذف ${item.name}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </article>
  `;
}

export function renderCart() {
  const items = getCartItems();
  const totals = getTotals();

  invoiceItems.innerHTML = items.length
    ? items.map(invoiceItemTemplate).join('')
    : emptyInvoiceTemplate();

  discountList.innerHTML = totals.discounts.length
    ? totals.discounts
        .map(
          (discount) => `
            <div class="discount-row">
              <span>${discount.title}</span>
              <strong>- ${formatPrice(discount.amount)}</strong>
            </div>
          `,
        )
        .join('')
    : '<div class="discount-row discount-row--muted">لا توجد خصومات مطبقة حاليًا</div>';

  subtotalElement.textContent = formatPrice(totals.subtotal);
  discountTotalElement.textContent = `- ${formatPrice(totals.discountTotal)}`;
  totalElement.textContent = formatPrice(totals.total);

  badgeElements.forEach((badge) => {
    badge.textContent = totals.count;
    badge.classList.toggle('is-empty', totals.count === 0);
  });
}

export function pulseCartBadge() {
  badgeElements.forEach((badge) => {
    badge.classList.remove('pulse');
    window.requestAnimationFrame(() => badge.classList.add('pulse'));
  });
}

export function openInvoice() {
  invoiceDrawer.classList.add('is-open');
  document.body.classList.add('invoice-open');
}

export function closeInvoice() {
  invoiceDrawer.classList.remove('is-open');
  document.body.classList.remove('invoice-open');
}

export function renderOffers() {
  offersGrid.innerHTML = discountRules
    .map(
      (rule) => `
        <article class="offer-card">
          <span>${rule.percentage}%</span>
          <h3>${rule.title}</h3>
          <p>${rule.description}</p>
        </article>
      `,
    )
    .join('');
}

export function bindCartControls() {
  invoiceItems.addEventListener('click', async (event) => {
    const control = event.target.closest('[data-cart-action]');
    if (!control) return;

    const productId = control.dataset.productId;
    const item = getCartItems().find((cartItem) => cartItem.id === productId);

    if (control.dataset.cartAction === 'increase') {
      increaseQuantity(productId);
      renderCart();
      return;
    }

    if (control.dataset.cartAction === 'decrease') {
      decreaseQuantity(productId);
      renderCart();
      return;
    }

    if (control.dataset.cartAction === 'remove' && item) {
      const result = await confirmRemoveItem(item.name);
      if (result.isConfirmed) {
        removeItem(productId);
        renderCart();
      }
    }
  });

  document.querySelector('.js-clear-cart').addEventListener('click', async () => {
    if (!getCartItems().length) return;

    const result = await confirmClearCart();
    if (result.isConfirmed) {
      clearCart();
      renderCart();
    }
  });
}

export function bindInvoiceDrawer() {
  document.querySelectorAll('.js-open-invoice').forEach((button) => {
    button.addEventListener('click', openInvoice);
  });

  document.querySelectorAll('.js-close-invoice').forEach((button) => {
    button.addEventListener('click', closeInvoice);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeInvoice();
  });
}

export function bindNavigationState() {
  const sections = ['home', 'menu', 'offers', 'about', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;

      mobileNavItems.forEach((item) => {
        const href = item.getAttribute('href');
        item.classList.toggle('active', href === `#${visible.target.id}`);
      });
    },
    { threshold: 0.45 },
  );

  sections.forEach((section) => observer.observe(section));
}
