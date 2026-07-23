let cart = JSON.parse(localStorage.getItem('salinkaCart')) || [];

const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="100%" height="100%" fill="#e8e0d4"/>' +
    '<text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#8c4a2f" text-anchor="middle" dominant-baseline="middle">Image unavailable</text>' +
    '</svg>'
);

function saveCart() {
    localStorage.setItem('salinkaCart', JSON.stringify(cart));
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = total;
    document.getElementById('offcanvasCartCount').textContent = total;
}

function filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase().trim();
    const origin = document.getElementById('originFilter').value;

    const filtered = products.filter(p => {
        const matchSearch = !search || p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
        const matchOrigin = !origin || p.origin === origin;
        return matchSearch && matchOrigin;
    });

    renderProducts(filtered);
}

function renderProducts(prods = products) {
    const container = document.getElementById('productGrid');
    container.innerHTML = prods.map((p) => {
        const globalIndex = products.indexOf(p);
        return `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="card product-card h-100">
                    <div class="position-relative">
                        <img src="${p.img}" class="card-img-top" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
                        <span class="badge-origin">${p.origin}</span>
                    </div>
                    <div class="card-body d-flex flex-column p-4 text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="text-muted small flex-grow-1">${p.desc}</p>
                        <p class="fw-bold text-success fs-3 mb-3">${p.price} € / kg</p>
                        <div class="d-flex gap-2">
                            <button onclick="showProduct(${globalIndex}, 'meat'); event.stopImmediatePropagation();" class="btn btn-outline-dark flex-grow-1">Details</button>
                            <button onclick="addToCart(${globalIndex}, 'meat'); event.stopImmediatePropagation();" class="btn btn-dark flex-grow-1">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
        }, { threshold: 0.15 });
        document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
    }, 100);
}

function renderWines() {
    const container = document.getElementById('wineGrid');
    container.innerHTML = wines.map((w, i) => `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card product-card h-100">
                <div class="position-relative">
                    <img src="${w.img}" class="card-img-top" alt="${w.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
                    <span class="badge-origin">${w.type}</span>
                </div>
                <div class="card-body d-flex flex-column p-4 text-center">
                    <h5 class="card-title">${w.name}</h5>
                    <p class="text-muted small flex-grow-1">${w.desc}</p>
                    <p class="fw-bold text-success fs-3 mb-3">${w.price} €</p>
                    <div class="d-flex gap-2">
                        <button onclick="showProduct(${i}, 'wine'); event.stopImmediatePropagation();" class="btn btn-outline-dark flex-grow-1">Details</button>
                        <button onclick="addToCart(${i}, 'wine'); event.stopImmediatePropagation();" class="btn btn-dark flex-grow-1">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showProduct(index, type) {
    const item = type === 'meat' ? products[index] : wines[index];
    const modal = new bootstrap.Modal(document.getElementById('productModal'));

    document.getElementById('modalTitle').textContent = item.name;
    document.getElementById('modalBody').innerHTML = `
        <div class="row g-5">
            <div class="col-md-6">
                <img src="${item.img}" class="img-fluid rounded-3" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
            </div>
            <div class="col-md-6">
                <p class="lead">${item.longDesc}</p>
                <h3 class="text-success">${item.price} ${type === 'meat' ? '€ / kg' : '€'}</h3>
                <p class="text-muted"><strong>Perfect with:</strong> ${item.wine || item.longDesc}</p>
                <button onclick="addToCart(${index}, '${type}'); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();"
                        class="btn btn-dark w-100 py-3 mt-4">ADD TO CART</button>
            </div>
        </div>
    `;
    modal.show();
}

function addToCart(index, type) {
    const product = type === 'meat' ? products[index] : wines[index];
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, type });
    }

    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart`);
    createFlyAnimation(product.img);
}

function createFlyAnimation(imgSrc) {
    const fly = document.createElement('div');
    fly.className = 'fly-to-cart position-fixed';
    fly.style.cssText = `width:60px;height:60px;background-image:url('${imgSrc}');background-size:cover;background-position:center;left:50%;top:35%;border-radius:50%;z-index:99999;`;
    document.body.appendChild(fly);
    setTimeout(() => fly.remove(), 1000);
}

function renderCart() {
    const body = document.getElementById('cartBody');
    let html = '';
    let subtotal = 0;

    if (cart.length === 0) {
        html = `<div class="text-center py-5"><p class="lead text-muted">Your cart is empty</p></div>`;
    } else {
        html = `<div class="list-group list-group-flush">`;
        cart.forEach((item, i) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="list-group-item cart-item px-4 py-4">
                    <div class="d-flex gap-3">
                        <img src="${item.img}" style="width:78px;height:78px;object-fit:cover;border-radius:12px;" alt="${item.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>${item.name}</strong><br>
                                    <small class="text-muted">${item.origin}</small>
                                </div>
                                <button onclick="removeFromCart(${i})" class="btn btn-link text-danger p-0"><i class="fas fa-times"></i></button>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <div class="input-group input-group-sm" style="width:140px;">
                                    <button onclick="changeQuantity(${i}, -1)" class="btn btn-outline-secondary">-</button>
                                    <input type="number" class="form-control text-center quantity-input" value="${item.quantity}" onchange="setQuantity(${i}, this.value)">
                                    <button onclick="changeQuantity(${i}, 1)" class="btn btn-outline-secondary">+</button>
                                </div>
                                <span class="fw-bold">${itemTotal} €</span>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        html += `</div>`;
    }
    body.innerHTML = html;

    const shipping = subtotal > 50 ? 0 : 9;
    const total = subtotal + shipping;

    document.getElementById('cartSummary').innerHTML = `
        <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${subtotal} €</span></div>
        <div class="d-flex justify-content-between mb-3"><span>Shipping</span><span>${shipping} €</span></div>
        <div class="d-flex justify-content-between fs-4 border-top pt-3"><strong>Total</strong><strong class="text-success">${total} €</strong></div>
    `;
}

function removeFromCart(i) {
    const name = cart[i].name;
    cart.splice(i, 1);
    saveCart();
    updateCartCount();
    renderCart();
    showToast(`${name} removed`);
}

function changeQuantity(i, delta) {
    cart[i].quantity += delta;
    if (cart[i].quantity < 1) removeFromCart(i);
    else {
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function setQuantity(i, val) {
    let qty = parseInt(val);
    if (isNaN(qty) || qty < 1) removeFromCart(i);
    else {
        cart[i].quantity = qty;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function clearCart() {
    if (confirm("Clear the entire cart?")) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function toggleCart() {
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    renderCart();
    offcanvas.show();
}

function closeCartAndScroll() {
    bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast position-fixed bottom-0 start-50 translate-middle-x p-3 text-white';
    toast.style.zIndex = '99999';
    toast.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

function checkout() {
    if (cart.length === 0) return;
    alert("🎉 Thank you! Your order has been received. (Demo checkout)");
    cart = [];
    saveCart();
    updateCartCount();
    bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
}

function init() {
    const origins = [...new Set(products.map(p => p.origin))];
    const select = document.getElementById('originFilter');
    origins.forEach(origin => {
        const option = document.createElement('option');
        option.value = origin;
        option.textContent = origin;
        select.appendChild(option);
    });
    renderProducts();
    renderWines();
    updateCartCount();
}

window.onload = init;
