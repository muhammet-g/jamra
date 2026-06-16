import { categories, products } from '../data/products.js';

const categoryStrip = document.querySelector('.js-category-strip');
const productsGrid = document.querySelector('.js-products-grid');

// بناء بطاقة منتج واحدة، وتغيير زر الإضافة إلى عداد كمية إذا كان المنتج في الفاتورة.
function productCard(product, cartItem) {
  const tags = product.tags
    .map((tag) => `<span class="product-card__tag">${tag}</span>`)
    .join('');
  const quantityControls = cartItem
    ? `
      <div class="product-card__quantity" aria-label="تعديل كمية ${product.name}">
        <button type="button" data-product-cart-action="increase" data-product-id="${product.id}" aria-label="زيادة ${product.name}">
          <i class="fa-solid fa-plus"></i>
        </button>
        <strong>${cartItem.quantity}</strong>
        <button type="button" data-product-cart-action="decrease" data-product-id="${product.id}" aria-label="إنقاص ${product.name}">
          <i class="fa-solid fa-minus"></i>
        </button>
      </div>
    `
    : `
      <button
        class="btn jamr-btn jamr-btn--sm js-add-product"
        type="button"
        data-product-id="${product.id}"
        ${!product.availability ? 'disabled' : ''}
      >
        ${product.availability ? 'أضف' : 'غير متاح'}
        <i class="fa-solid fa-plus"></i>
      </button>
    `;

  return `
    <article class="product-card ${!product.availability ? 'is-unavailable' : ''}" data-category="${product.category}">
      <div class="product-card__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async" />
        <div class="product-card__tags">${tags}</div>
      </div>
      <div class="product-card__body">
        <div class="product-card__title-row">
          <h3>${product.name}</h3>
          <span class="product-card__unit">${product.unit}</span>
        </div>
        <p>${product.description}</p>
        <div class="product-card__footer">
          <strong>${product.price} <span>﷼</span></strong>
          ${quantityControls}
        </div>
      </div>
    </article>
  `;
}

// رسم أزرار التصنيفات مع تمييز التصنيف النشط.
export function renderCategories(activeCategory = 'all') {
  categoryStrip.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-pill ${category.id === activeCategory ? 'active' : ''}"
          type="button"
          data-category-id="${category.id}"
        >
          <i class="fa-solid ${category.icon}"></i>
          <span>${category.name}</span>
        </button>
      `,
    )
    .join('');
}

// عرض المنتجات حسب التصنيف الحالي ومزامنتها مع كميات الفاتورة.
export function renderProducts(activeCategory = 'all', cartItems = []) {
  const visibleProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  productsGrid.innerHTML = visibleProducts
    .map((product) => {
      const cartItem = cartItems.find((item) => item.id === product.id);
      return productCard(product, cartItem);
    })
    .join('');
}

// البحث عن المنتج من مصدر البيانات عند الضغط على زر الإضافة.
export function getProductById(productId) {
  return products.find((product) => product.id === productId);
}
