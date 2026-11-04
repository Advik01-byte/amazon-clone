import { cart, removeFromCart, updateCartQuantityCheckout, updateDeliveryOption, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartSummaryHTML = "";

cart.forEach(cartItem => {
  const { productId } = cartItem;
  let matchingProduct;

  products.forEach(product => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  let deliveryOption;
  const { deliveryOptionId } = cartItem;

  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
        deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(
  deliveryOption.deliveryDays,
    "days"
  );
  const dateString = deliveryDate.format(
    "dddd, MMMM D"
  );

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date"> Delivery date: ${dateString} </div>
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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach(deliveryOption => {
        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            "days"
        );
        const dateString = deliveryDate.format(
            "dddd, MMMM D"
        );

        const priceString = deliveryOption.priceCents === 0
        ? "FREE Shipping"
        : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId
        ? "checked"
        : "";
        
        html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" class="delivery-option-input" name="delivery-option-${matchingProduct.id}" ${isChecked}>
                <div>
                <div class="delivery-option-date"> ${dateString} </div>
                <div class="delivery-option-price"> ${priceString} </div>
                </div>
            </div>
        `;
    });

    return html;
}

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

document.querySelectorAll(".js-delivery-option").forEach(element => {
    element.addEventListener("click", () => {
        const { productId, deliveryOptionId } = element.dataset;

        updateDeliveryOption(productId, deliveryOptionId);
    });
});