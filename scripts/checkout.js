import { cart, removeFromCart, updateCartQuantityCheckout, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

cart.forEach(cartItem => {
  const { productId } = cartItem;
  let matchingProduct;

  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date"> Delivery date: Tuesday, June 21 </div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
          <div class="product-quantity">
            <span class="js-quantity-label-${matchingProduct.id}">
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link js-update-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id} js-quantity-input" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title"> Choose a delivery option: </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date"> Tuesday, June 21 </div>
              <div class="delivery-option-price"> FREE Shipping </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date"> Wednesday, June 15 </div>
              <div class="delivery-option-price"> $4.99 - Shipping </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date"> Monday, June 13 </div>
              <div class="delivery-option-price"> $9.99 - Shipping </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

updateCartQuantityCheckout();
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-quantity-link").forEach(link => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    removeFromCart(productId);
    updateCartQuantityCheckout();
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
  });
});

document.querySelectorAll(".js-update-link").forEach(link => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    
    container.classList.add("is-editing-quantity");
    link.classList.add("update-link-invisible");
    quantityLabel.innerHTML = "Quantity: ";
    
    let oldQuantity = 0;
    cart.forEach(cartItem => {
      if (cartItem.productId === productId) {
        oldQuantity = cartItem.quantity;
      }
    });
    quantityInput.value = oldQuantity;
  });
});

function addKeyboardSupport(container, quantityInput, productId, quantityLabel) {
  container.classList.remove("is-editing-quantity");
  
  const updateLink = document.querySelector(`.js-update-link-${productId}`);
  if (updateLink) {
    updateLink.classList.remove("update-link-invisible");
  }

  if (quantityInput.value.trim() === "") {
    let originalQuantity = 0;
    cart.forEach(cartItem => {
      if (cartItem.productId === productId) {
        originalQuantity = cartItem.quantity;
      }
    });
    quantityLabel.innerHTML = `Quantity: <span class="quantity-label">${originalQuantity}</span>`;
  } else {
    const newQuantity = Number(quantityInput.value);
    if (newQuantity < 0 || isNaN(newQuantity) || newQuantity > 1000) {
      alert("Please enter a valid quantity.");
      return;
    } else if (newQuantity === 0) {
      removeFromCart(productId);
      updateCartQuantityCheckout();
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      return;
    }
    quantityLabel.innerHTML = `Quantity: <span class="quantity-label">${newQuantity}</span>`;
    updateQuantity(productId, newQuantity);
  }
}

document.querySelectorAll(".js-save-link").forEach(link => {
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    addKeyboardSupport(container, quantityInput, productId, quantityLabel);
  });
});

document.querySelectorAll(".js-quantity-input").forEach(input => {
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const { productId } = input.dataset;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      
      addKeyboardSupport(container, input, productId, quantityLabel);
    }
  });
});
