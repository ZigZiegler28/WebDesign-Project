/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


// ########################## Toggle Navbar on Mobile ##########################
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('.navbar-nav');   
navbarToggler.addEventListener('click', function() {
navbarNav.classList.toggle('show');
});













// ########################## Cart Function ##########################
// Toggle cart visibility (slide-out)
function toggleCart() {
    const cartPopup = document.getElementById('cartPopup');
    cartPopup.classList.toggle('show');
    updateCartDisplay();  // Check cart status when toggling
    updateCartBubble();
}

// Function to update the cart bubble
function updateCartBubble() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart
    const cartBubble = document.getElementById('cart-bubble');

    // Show the bubble only if there are items in the cart
    if (totalItems > 0) {
        cartBubble.textContent = totalItems; // Show the number of items
        cartBubble.style.display = 'inline-block'; // Ensure the bubble is visible
    } else {
        cartBubble.style.display = 'none'; // Hide the bubble if there are no items
    }
}

// Function to update the cart's display when toggling or adding/removing items
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartTotal = document.querySelector('.cart-total');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartItems = cartItemsContainer.children;

    // Check if the cart is empty
    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';  // Show the "Your cart is empty" message
        cartItemsContainer.style.display = 'none'; // Hide cart items
        cartTotal.style.display = 'none'; // Hide the total section
        checkoutBtn.style.display = 'none'; // Hide the checkout button
    } else {
        emptyCartMessage.style.display = 'none';  // Hide the empty message
        cartItemsContainer.style.display = 'block'; // Show cart items
        cartTotal.style.display = 'flex'; // Show the total section
        checkoutBtn.style.display = 'block'; // Show the checkout button
    }
}

// Event listener for the "Proceed to Checkout" button
document.getElementById('checkoutBtn')?.addEventListener('click', function() {
    // Redirect to checkout page (replace 'checkout.html' with the actual URL of your checkout page)
    window.location.href = 'checkout.html';  // Update with your actual checkout page URL
});

// Event listener for Add to Cart button
document.getElementById('addToCartBtn')?.addEventListener('click', function() {
    const itemName = document.getElementById('product-name').dataset.name;
    const size = document.querySelector('.size-buttons .btn.active')?.dataset.size || 'Not Selected';
    const color = document.querySelector('.color-buttons .btn.active')?.dataset.color || 'Not Selected';
    const quantity = document.getElementById('quantity').value;
    const price = parseFloat(document.getElementById('product-price').textContent.replace('$', ''));
    const imageUrl = document.querySelector('.product-image').src;
    
    if (size === 'Not Selected' || color === 'Not Selected') {
        alert('Please select both size and color.');
        return;
    }

    const totalPrice = price * quantity;
    addToCart(itemName, size, color, quantity, totalPrice, imageUrl);
    toggleCart();
});

// Function to add item to cart
function addToCart(itemName, size, color, quantity, totalPrice, imageUrl) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve the existing cart or initialize it

    // Look for an existing item in the cart with the same name, size, and color
    let existingItem = cart.find(item => item.itemName === `${itemName} (${size}, ${color})`);

    if (existingItem) {
        // Update quantity and price if item already exists in the cart
        existingItem.quantity += parseInt(quantity);
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
        // If item doesn't exist, create a new cart item entry
        cart.push({
            itemName: `${itemName} (${size}, ${color})`,
            size,
            color,
            quantity: parseInt(quantity),
            price: parseFloat((totalPrice / quantity).toFixed(2)),
            totalPrice: totalPrice,
            imageUrl
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Re-render the cart
    toggleCart();
    renderCart(cart);
    updateCartTotal(cart);
    updateCartIcon();  // Update the cart icon with new item count and total
    updateCartBubble();
}

// Function to render cart items on the page
function renderCart(cart) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing cart items

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.imageUrl}" alt="Product Image" class="cart-item-image">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.itemName}</span>
                <div class="cart-item-single-price">$${item.price}</div>
                <div class="cart-item-size">Size: ${item.size}</div>
                <div class="cart-item-color">Color: ${item.color}</div>
                <div class="input-group">
                    <button class="btn btn-outline-dark decrease-quantity">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="form-control text-center cart-item-quantity" readonly>
                    <button class="btn btn-outline-dark increase-quantity">+</button>
                    <div class="delete-button">
                        <button class="btn btn-outline-danger delete-item"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
            <span class="cart-item-price">$${item.totalPrice.toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(cartItem);

        // Add event listener to the delete button
        const deleteButton = cartItem.querySelector('.delete-item');
        deleteButton.addEventListener('click', function() {
            removeFromCart(item);
        });
    });

    updateCartDisplay();
}

// Function to remove an item from the cart
function removeFromCart(itemToRemove) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.itemName !== itemToRemove.itemName); // Remove item from cart
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage

    // Re-render the cart
    renderCart(cart);
    updateCartTotal(cart);
    updateCartIcon();  // Update the cart icon after item removal
    updateCartBubble();
}

// Function to update total price
function updateCartTotal(cart) {
    let total = 0;
    cart.forEach(item => {
        total += item.totalPrice;
    });
    const cartTotalAmount = document.querySelector('.cart-total-amount');
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

// Event listener for size button selection
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// Event listener for color button selection
document.querySelectorAll('.color-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// Quantity changer on the product page
document.getElementById('increase')?.addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
});

document.getElementById('decrease')?.addEventListener('click', function() {
    const quantityInput = document.getElementById('quantity');
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
});

// Quantity changer in cart items
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase-quantity')) {
        const quantityInput = event.target.closest('.cart-item').querySelector('.cart-item-quantity');
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
        updateItemPrice(event.target.closest('.cart-item'));
        updateCartTotalFromDOM();
        updateCartInLocalStorage();
    }

    if (event.target.classList.contains('decrease-quantity')) {
        const quantityInput = event.target.closest('.cart-item').querySelector('.cart-item-quantity');
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
            updateItemPrice(event.target.closest('.cart-item'));
            updateCartTotalFromDOM();
            updateCartInLocalStorage();
        }
    }
});

// Update individual item price when quantity changes in cart
function updateItemPrice(cartItem) {
    const quantity = parseInt(cartItem.querySelector('.cart-item-quantity').value);
    const pricePerItem = parseFloat(cartItem.querySelector('.cart-item-single-price').textContent.replace('$', ''));
    const totalPrice = pricePerItem * quantity;
    cartItem.querySelector('.cart-item-price').textContent = `$${totalPrice.toFixed(2)}`;
}

// Update cart total based on changes in cart DOM
function updateCartTotalFromDOM() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        const priceText = item.querySelector('.cart-item-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        total += price;
    });
    const cartTotalAmount = document.querySelector('.cart-total-amount');
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

// Update the cart in localStorage after quantity change
function updateCartInLocalStorage() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-item').forEach(cartItemElement => {
        const itemName = cartItemElement.querySelector('.cart-item-name').textContent;
        const quantity = parseInt(cartItemElement.querySelector('.cart-item-quantity').value);
        const totalPrice = parseFloat(cartItemElement.querySelector('.cart-item-price').textContent.replace('$', ''));

        // Find the cart item and update quantity and total price
        const item = cart.find(item => item.itemName === itemName);
        if (item) {
            item.quantity = quantity;
            item.totalPrice = totalPrice;
        }
    });

    // Save updated cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTotalFromDOM();  // Update the cart total display after localStorage update
}

// On page load, render cart from localStorage and auto-select first size and color
window.addEventListener('load', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart(cart);
    updateCartTotal(cart);
    updateCartBubble();

    // Automatically select the first size and color if not already selected
    const firstSizeButton = document.querySelector('.size-buttons .btn');
    const firstColorButton = document.querySelector('.color-buttons .btn');

    if (firstSizeButton && !document.querySelector('.size-buttons .btn.active')) {
        firstSizeButton.classList.add('active');
    }

    if (firstColorButton && !document.querySelector('.color-buttons .btn.active')) {
        firstColorButton.classList.add('active');
    }

    // Update the cart total in the header or other UI elements
    updateCartIcon();
});

// Update cart icon (item count and total) in header or nav bar
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    
    const cartIcon = document.querySelector('.cart-icon');
    const cartTotalAmount = document.querySelector('.cart-total-amount-header');
    
    cartIcon.textContent = cartCount;  // Update the item count in the cart icon
    cartTotalAmount.textContent = `$${cartTotal.toFixed(2)}`;  // Update the total price in the cart icon
}


