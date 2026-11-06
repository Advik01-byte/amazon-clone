import { getProduct } from './products.js'; 

export let cart = JSON.parse(localStorage.getItem('cart')); // null if no cart exists in local storage

if (!cart) {
  cart = [];
}

export function addToCart(productId, quantitySelector) {
  // FIX: Look for the item inside the CART, not the products list
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += Number(quantitySelector.value);
  } else {
    cart.push({ 
      productId, 
      quantity: Number(quantitySelector.value), 
      deliveryOptionId: '1' 
    });
  }
  
  saveToStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach(item => {
    cartQuantity += item.quantity;
  });
  
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

export function addedToCartPopup(productId, addedTimeouts) {
  const added = document.querySelector(`.js-added-to-cart-${productId}`);
  if (added) {
    added.classList.add('added-to-cart-visible');
    
    if (addedTimeouts[productId]) {
      clearTimeout(addedTimeouts[productId]);
    }
    
    const timeoutId = setTimeout(() => {
      added.classList.remove('added-to-cart-visible');
    }, 2000);
    
    addedTimeouts[productId] = timeoutId;
  }
}

export function removeFromCart(productId) {
  const newCart = cart.filter(cartItem => cartItem.productId !== productId);
  cart = newCart;
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartQuantityCheckout() {
  let cartQuantity = 0;
  cart.forEach(item => {
    cartQuantity += item.quantity;
  });
  
  const checkoutElement = document.querySelector('.js-items-in-checkout');
  if (checkoutElement) {
    checkoutElement.innerHTML = `${cartQuantity} items`;
  }
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  
  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  
  // FIX: Changed matchingProduct to matchingItem
  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  
  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}
