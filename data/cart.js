export let cart = JSON.parse(localStorage.getItem("cart"));

if (!cart) {
    cart = [
        {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2
        },
        {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1
        }
    ];
}

export function addToCart(productId, quantitySelector) {
    let matchingItem;

    cart.forEach(cartItem => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += Number(quantitySelector.value);
    } else {
        cart.push(
            {
                productId,
                quantity: Number(quantitySelector.value)
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