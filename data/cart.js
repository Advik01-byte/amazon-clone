import { getProduct } from "./products.js";

export let cart = JSON.parse(localStorage.getItem("cart")); // null if no cart exists in local storage

if (!cart) {
    cart = [];
}

export function addToCart(productId, quantitySelector) {
    const matchingItem = getProduct(productId);

    if (matchingItem) {
        matchingItem.quantity += Number(quantitySelector.value);
    } else {
        cart.push(
            {
                productId,
                quantity: Number(quantitySelector.value),
                deliveryOptionId: "1"
            }
        );
    }

    saveToStorage();
}

export function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach(item => {
        cartQuantity += item.quantity;
    });

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

export function addedToCartPopup(productId, addedTimeouts) {
    const added = document.querySelector(`.js-added-to-cart-${productId}`);
    added.classList.add("added-to-cart-visible")

    if (addedTimeouts[productId]) {
        clearTimeout(addedTimeouts[productId]);
    }

    const timeoutId = setTimeout(() => {
        added.classList.remove("added-to-cart-visible");
    }, 2000);

    addedTimeouts[productId] = timeoutId;
}

export function removeFromCart(productId) {
    const newCart = cart.filter(cartItem => cartItem.productId !== productId);
    
    cart = newCart;
    saveToStorage();
    
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartQuantityCheckout() {
    document.querySelector(".js-items-in-checkout").innerHTML = cart.length;
}

export function updateQuantity(productId, newQuantity) {
    const matchingProduct = getProduct(productId);

    matchingProduct.quantity = newQuantity;

    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    const matchingItem = getProduct(productId);

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}