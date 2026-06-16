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

// تنسيق السعر بالريال مع أرقام عربية وبدون نص طويل مكرر.
function formatPrice(value) {
  return `${value.toLocaleString('ar-SA', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

// قالب يظهر عندما لا تحتوي الفاتورة على أي أصناف.
function emptyInvoiceTemplate() {
  return `
    <div class="invoice-empty">
      <i class="fa-solid fa-receipt"></i>
      <strong>الفاتورة فارغة</strong>
      <span>أضف أطباقك المفضلة وسيظهر الإجمالي هنا.</span>
    </div>
  `;
}

// قالب صنف داخل الفاتورة مع أزرار الزيادة والنقص والحذف.
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

// إعادة رسم الفاتورة، الخصومات، المجاميع، وعدّاد السلة بعد كل تغيير.
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

// حركة قصيرة للـ badge حتى يلاحظ الزبون أن الفاتورة تغيرت.
export function pulseCartBadge() {
  badgeElements.forEach((badge) => {
    badge.classList.remove('pulse');
    window.requestAnimationFrame(() => badge.classList.add('pulse'));
  });
}

// فتح درج الفاتورة ومنع تمرير الصفحة الخلفية.
export function openInvoice() {
  invoiceDrawer.classList.add('is-open');
  document.body.classList.add('invoice-open');
}

// إغلاق درج الفاتورة وإرجاع تمرير الصفحة.
export function closeInvoice() {
  invoiceDrawer.classList.remove('is-open');
  document.body.classList.remove('invoice-open');
}

// عرض بطاقات العروض من نفس قواعد الخصم المستخدمة في الحسابات.
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

// ربط أزرار الفاتورة، مع قبول callback لتحديث كروت المنتجات أيضًا.
export function bindCartControls(onCartChange = renderCart) {
  invoiceItems.addEventListener('click', async (event) => {
    const control = event.target.closest('[data-cart-action]');
    if (!control) return;

    const productId = control.dataset.productId;
    const item = getCartItems().find((cartItem) => cartItem.id === productId);

    if (control.dataset.cartAction === 'increase') {
      increaseQuantity(productId);
      onCartChange();
      return;
    }

    if (control.dataset.cartAction === 'decrease') {
      decreaseQuantity(productId);
      onCartChange();
      return;
    }

    if (control.dataset.cartAction === 'remove' && item) {
      const result = await confirmRemoveItem(item.name);
      if (result.isConfirmed) {
        removeItem(productId);
        onCartChange();
      }
    }
  });

  document.querySelector('.js-clear-cart').addEventListener('click', async () => {
    if (!getCartItems().length) return;

    const result = await confirmClearCart();
    if (result.isConfirmed) {
      clearCart();
      onCartChange();
    }
  });
}

// ربط فتح وإغلاق درج الفاتورة من كل الأزرار والـ Escape.
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

// تحديث حالة التنقل السفلي حسب القسم الظاهر على الشاشة.
export function bindNavigationState() {
  const sections = ['home', 'menu', 'offers', 'contact']
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
