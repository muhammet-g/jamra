import { categories, products } from '../data/products.js';

const categoryStrip = document.querySelector('.js-category-strip');
const productsGrid = document.querySelector('.js-products-grid');

function productCard(product) {
  const tags = product.tags
    .map((tag) => `<span class="product-card__tag">${tag}</span>`)
    .join('');

  return `
    <article class="product-card ${!product.availability ? 'is-unavailable' : ''}" data-category="${product.category}">
      <div class="product-card__media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
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
          <button
            class="btn jamr-btn jamr-btn--sm js-add-product"
            type="button"
            data-product-id="${product.id}"
            ${!product.availability ? 'disabled' : ''}
          >
            ${product.availability ? 'أضف' : 'غير متاح'}
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </article>
  `;
}

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

export function renderProducts(activeCategory = 'all') {
  const visibleProducts =
    activeCategory === 'all'
      ? products
      : products.filter((product) => product.category === activeCategory);

  productsGrid.innerHTML = visibleProducts.map(productCard).join('');
}

export function getProductById(productId) {
  return products.find((product) => product.id === productId);
}
