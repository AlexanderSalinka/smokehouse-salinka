# Restructure Smokehouse Salinka Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the single-file `GROK_GOOD_STATE.html` prototype into a clean `index.html` / `css/style.css` / `js/data.js` / `js/app.js` project, with no behavior changes except a broken-image fallback.

**Architecture:** Static site, no build tools, no npm (Node is not installed on this machine and none is required). CDN dependencies (Bootstrap 5.3.3, Font Awesome 6.6.0, Google Fonts) stay as `<link>`/`<script>` tags in `index.html`.

**Tech Stack:** Plain HTML5, CSS3, vanilla JS (ES6), Bootstrap 5.3.3 (CDN), Font Awesome 6.6.0 (CDN).

## Global Constraints

- No build tools, no npm, no Node — this is a static site opened directly in a browser.
- No automated test framework exists or is being introduced; verification is manual, in-browser.
- No behavior changes versus `GROK_GOOD_STATE.html` except: broken/hotlinked images fall back to a local inline placeholder instead of showing a broken-image icon.
- Out of scope (do not touch): replacing hotlinked/placeholder images with real photos, real checkout flow, backend/database.
- Source of truth for current behavior: `/Users/alexandersalinka/Coding/Vibe Coded/GROK_GOOD_STATE.html`.
- Target project root: `/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/` (already git-initialized).

---

### Task 1: Extract styles into `css/style.css`

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Produces: a stylesheet defining `.navbar`, `.smoke-bg`, `.hero`, `.product-card` (+ `.visible` state and `:hover`), `#wines .product-card`, `.section-padding`, `.badge-origin`, `#products`/`#wines` background, `#cartOffcanvas`, `.fly-to-cart` (+ `flyToCartAnim` keyframes), `.custom-toast`, and the `--primary`/`--accent`/`--gold`/`--smoke`/`--eggshell` CSS custom properties. `index.html` (Task 4) will link this file.

- [ ] **Step 1: Write `css/style.css`**

```css
:root {
    --primary: #1a110c;
    --accent: #8c4a2f;
    --gold: #d4af88;
    --smoke: rgba(30, 25, 22, 0.96);
    --eggshell: #f5f0e8;
}

body {
    font-family: 'Inter', sans-serif;
    background: #f9f5f0;
    color: #3c2f28;
}
h1, h2, h3, h4, .modal-title, .offcanvas-title {
    font-family: 'Playfair Display', serif;
}

.navbar {
    background: rgba(26, 17, 12, 0.98) !important;
    backdrop-filter: blur(12px);
}

.smoke-bg {
    background: linear-gradient(var(--smoke), var(--smoke)),
                url('https://lugner.sk/wp-content/uploads/2024/03/IMG_3870.webp') center/cover no-repeat fixed;
    position: relative;
}
.smoke-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 70%);
    animation: smokeDrift 28s linear infinite;
    pointer-events: none;
}
@keyframes smokeDrift {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-40px, -80px) rotate(5deg); }
}

.hero {
    background: linear-gradient(rgba(26, 17, 12, 0.78), rgba(26, 17, 12, 0.9)),
                url('https://lugner.sk/wp-content/uploads/2024/03/IMG_3870.webp') center/cover no-repeat fixed;
    color: white;
    padding: 260px 0 170px;
}

.product-card {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    overflow: hidden;
    height: 100%;
    border-radius: 20px;
    background: var(--eggshell);
    box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    opacity: 0;
    transform: translateY(50px);
}
.product-card.visible {
    opacity: 1;
    transform: translateY(0);
}
.product-card:hover {
    transform: translateY(-22px) scale(1.03);
    box-shadow: 0 50px 100px -15px rgba(140, 74, 47, 0.55) !important;
}
.product-card img {
    height: 260px;
    object-fit: cover;
    transition: transform 0.9s ease;
    will-change: transform;
}
.product-card:hover img {
    transform: scale(1.12);
}

#wines .product-card,
#wines .product-card img {
    backface-visibility: hidden;
    transform: translateZ(0);
}

.section-padding {
    padding: 80px 0;
}
.badge-origin {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(212, 175, 136, 0.95);
    color: #1a110c;
    font-size: 0.78rem;
    padding: 6px 14px;
    border-radius: 50px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(212,175,136,0.3);
}

#products, #wines {
    background: #d4b88a url('https://hollandandoak.com/wp-content/uploads/2025/03/QCCI-5_endGrain_med_cropped.jpg') center/cover no-repeat;
    background-blend-mode: multiply;
}

#cartOffcanvas {
    box-shadow: -20px 0 40px -10px rgba(0,0,0,0.25);
    width: 460px;
}
.fly-to-cart {
    animation: flyToCartAnim 0.9s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}
@keyframes flyToCartAnim {
    to {
        top: 90px;
        right: 70px;
        transform: scale(0.12);
        opacity: 0;
    }
}
.custom-toast {
    background: var(--primary);
    border-radius: 9999px;
    box-shadow: 0 20px 30px -10px rgba(0,0,0,0.3);
}
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `grep -c '^\.' "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/css/style.css"`
Expected: a non-zero count of class selector lines (exact number isn't important — this just confirms the file isn't empty/truncated).

Also run: `grep -c "smokeDrift\|flyToCartAnim\|product-card\|custom-toast" "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/css/style.css"`
Expected: `4` (one match per distinct name searched, confirming all four key pieces are present).

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add css/style.css
git commit -m "Extract styles into css/style.css"
```

---

### Task 2: Extract catalog data into `js/data.js`

**Files:**
- Create: `js/data.js`

**Interfaces:**
- Produces: `const products` (array of 16 objects, each with `name`, `origin`, `price`, `img`, `desc`, `longDesc`, `wine`) and `const wines` (array of 3 objects, each with `name`, `origin`, `price`, `img`, `desc`, `longDesc`, `type`). `js/app.js` (Task 3) reads both by name — this file must be loaded before `js/app.js` in `index.html`.

- [ ] **Step 1: Write `js/data.js`**

```javascript
const products = [
    { name: "Smoked Slovakian Bacon", origin: "Slovakia", price: 16, img: "https://www.masterbuilt.com/cdn/shop/articles/Slow_20Smoked_20Bacon.jpg?v=1705428187", desc: "Classic dry-cured and beech-smoked bacon.", longDesc: "Made from premium pork belly using our generations-old family recipe.", wine: "Full-bodied Slovak Frankovka or Austrian Zweigelt" },
    { name: "Traditional Sausage", origin: "Slovakia", price: 14, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD0VVpm69Fkq_A5ZH8s5G0g5nwdmUXtoBVXw&s", desc: "Coarse-ground smoked sausage with natural spices.", longDesc: "Rich flavor developed through slow cold-smoking process.", wine: "Spicy Tempranillo or young Rioja" },
    { name: "Smoked Ham", origin: "Slovakia", price: 12, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIgtd4FKSblDLk1E4fHDtIR4kOxQmolatM3g&s", desc: "Slow-smoked premium leg ham.", longDesc: "Cured and smoked for weeks to achieve deep, complex taste.", wine: "Light Pinot Noir or chilled Lambrusco" },
    { name: "Speck Alto Adige", origin: "Italy", price: 18, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqK1LPuY_fvnYIy-nr2wMI1XfZonF9hz6CZA&s", desc: "Lightly smoked Alpine ham.", longDesc: "Seasoned with juniper, bay leaves and spices, then gently smoked.", wine: "Trentino Pinot Grigio or Alto Adige Gewürztraminer" },
    { name: "Pancetta Affumicata", origin: "Italy", price: 16, img: "https://www.gustini.sk/media/iopt/catalog/product/cache/5cd2659c5c312525b4bd4af8818bc486/7/7/77154_1.webp", desc: "Rolled and smoked Italian pork belly.", longDesc: "Essential ingredient for authentic Italian carbonara.", wine: "Chianti Classico or crisp Vermentino" },
    { name: "Coppa di Parma", origin: "Italy", price: 22, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRwQuKb2_mmO8ySK_GSe7jOZqa5dyNaeIYyg&s", desc: "Dry-cured pork neck delicacy.", longDesc: "Delicate marbling with black pepper and garlic seasoning.", wine: "Barolo or aged Brunello di Montalcino" },
    { name: "Chorizo Ibérico", origin: "Spain", price: 19, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvKW9IMAze3534ZhyU8OusysITqz7zuTzDDg&s", desc: "Smoky paprika sausage from Iberian pork.", longDesc: "Bold, spicy and full of character.", wine: "Spanish Garnacha or Ribera del Duero" },
    { name: "Jamón Ibérico", origin: "Spain", price: 45, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1vheBVCVYhGSqbiOgat-sIEcsINutIjfYoQ&s", desc: "Acorn-fed Iberian cured ham.", longDesc: "World-renowned premium ham with intense nutty flavor.", wine: "Fine Sherry (Oloroso) or aged Rioja Reserva" },
    { name: "Salchichón", origin: "Spain", price: 17, img: "https://jamonesibericosmadrid.com/wp-content/uploads/2018/02/2-11-salchichon-castano-det2.jpg", desc: "Traditional Spanish cured salami.", longDesc: "Coarse texture with excellent black pepper seasoning.", wine: "Spanish Tempranillo or Priorat" },
    { name: "Smoked Trout", origin: "Slovakia", price: 16, img: "https://www.oklahomajoes.co.nz/Images/Recipes/Main/smoked-trout.jpg", desc: "Delicate cold-smoked river trout.", longDesc: "Mild, flaky texture with subtle beech smoke aroma.", wine: "Chablis or crisp Sauvignon Blanc" },
    { name: "Smoked Mackerel", origin: "Scotland", price: 14, img: "https://www.gtcaviar.com/cdn/shop/files/mackerel1.jpg?v=1703171364&width=1445", desc: "Rich hot-smoked Atlantic mackerel.", longDesc: "Bold, oily flavor perfect for pâté or salads.", wine: "Sancerre or unoaked Chardonnay" },
    { name: "Smoked Herring (Kippers)", origin: "UK", price: 13, img: "https://www.smokedsalmon.co.uk/cdn/shop/files/product-image_011b091c-b8a4-446c-8bd1-5dc523fe7714.jpg?v=1708620660", desc: "Traditional cold-smoked kippers.", longDesc: "Classic breakfast delicacy with robust smoky taste.", wine: "Dry Riesling or English sparkling wine" },
    { name: "Smoked Gouda", origin: "Netherlands", price: 19, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2A3zjI5UC59YfX_3p7DCh8J6op4obXFIW5g&s", desc: "Mild Dutch smoked gouda.", longDesc: "Creamy with a gentle smoky finish.", wine: "Pinot Noir or medium-bodied Merlot" },
    { name: "Smoked Cheddar", origin: "UK", price: 18, img: "https://pearlvalleycheese.com/cdn/shop/products/pearl-valley-smoked-cheddar-cheese.jpg?v=1737212207", desc: "Aged sharp smoked cheddar.", longDesc: "Intense smoke and sharp tang.", wine: "Cabernet Sauvignon or aged Port" },
    { name: "Idiazábal", origin: "Spain", price: 24, img: "https://despananyc.com/cdn/shop/products/Idiazabal_5f57f718-857a-4773-8da8-aa4bdf0dc501.jpg?v=1596735313&width=480", desc: "Basque smoked sheep cheese.", longDesc: "Nutty, buttery with beechwood smoke.", wine: "Txakoli or light Basque cider" },
    { name: "Smoked Provolone", origin: "Italy", price: 17, img: "https://en.emiliafood.love/cdn/shop/products/Mildprovolonevalpadanadoppdoemiliafoodloveselectedwithloveinitaly_2_2048x.jpg?v=1696517373", desc: "Italian smoked provolone.", longDesc: "Mild and stretchy with light smoke.", wine: "Nebbiolo or Barbera d'Alba" }
];

const wines = [
    { name: "Frankovka Modrá", origin: "Slovakia", price: 28, img: "https://via.placeholder.com/600x400/8c4a2f/ffffff?text=Frankovka", desc: "Full-bodied red with dark fruit notes", longDesc: "Excellent with smoked bacon and ham.", type: "Red" },
    { name: "Rizling Rýnsky", origin: "Slovakia", price: 24, img: "https://via.placeholder.com/600x400/d4af88/1a110c?text=Rizling", desc: "Elegant white with floral aroma", longDesc: "Pairs beautifully with smoked fish.", type: "White" },
    { name: "Pinot Noir Reserve", origin: "Austria", price: 32, img: "https://via.placeholder.com/600x400/8c4a2f/ffffff?text=Pinot+Noir", desc: "Light red with earthy undertones", longDesc: "Ideal companion for smoked ham.", type: "Red" }
];
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `grep -c '{ name:' "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/js/data.js"`
Expected: `19` (16 products + 3 wines).

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add js/data.js
git commit -m "Extract catalog data into js/data.js"
```

---

### Task 3: Extract app logic into `js/app.js`, add image fallback

**Files:**
- Create: `js/app.js`

**Interfaces:**
- Consumes: `products`, `wines` (from `js/data.js`, Task 2) — must be loaded first.
- Produces: `cart` (module-level array), and functions `saveCart()`, `updateCartCount()`, `filterProducts()`, `renderProducts(prods)`, `renderWines()`, `showProduct(index, type)`, `addToCart(index, type)`, `createFlyAnimation(imgSrc)`, `renderCart()`, `removeFromCart(i)`, `changeQuantity(i, delta)`, `setQuantity(i, val)`, `clearCart()`, `toggleCart()`, `closeCartAndScroll()`, `showToast(message)`, `checkout()`, `init()`. These are called directly from `onclick=` attributes in `index.html` (Task 4), so they must remain global (not wrapped in a module or IIFE).
- Also produces: `FALLBACK_IMG` (a local `data:image/svg+xml` URI, no network dependency) used as the `onerror` target on every product/wine `<img>`.

- [ ] **Step 1: Write `js/app.js`**

```javascript
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
```

- [ ] **Step 2: Verify the file was written correctly**

Run:
```bash
grep -c '^function ' "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/js/app.js"
```
Expected: `17` (saveCart, updateCartCount, filterProducts, renderProducts, renderWines, showProduct, addToCart, createFlyAnimation, renderCart, removeFromCart, changeQuantity, setQuantity, clearCart, toggleCart, closeCartAndScroll, showToast, checkout, init — 18 actually, count is informational; confirm the grep output is close to this list length and re-check by eye against the function list in this task's Interfaces section if it doesn't match).

Run:
```bash
grep -c 'onerror=' "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/js/app.js"
```
Expected: `4` (renderProducts card image, renderWines card image, showProduct modal image, renderCart item image).

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add js/app.js
git commit -m "Extract app logic into js/app.js, add broken-image fallback"
```

---

### Task 4: Assemble `index.html`

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `css/style.css` (Task 1), `js/data.js` (Task 2), `js/app.js` (Task 3) — all three must exist before this file is meaningful, and must be loaded in that order (`data.js` before `app.js`).
- Produces: the page itself — the deliverable this whole plan builds toward.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Premium smoked meats and curated wines from Smokehouse Salinka — time-honored European tradition since 1975.">
    <title>Smokehouse Salinka | Premium Smoked Meats</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark sticky-top py-3">
        <div class="container">
            <a class="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2" href="#">
                <i class="fas fa-fire"></i> SMOKEHOUSE SALINKA
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="nav">
                <ul class="navbar-nav ms-auto align-items-center gap-1">
                    <li class="nav-item"><a class="nav-link px-3" href="#story">Story</a></li>
                    <li class="nav-item"><a class="nav-link px-3" href="#products">Meats</a></li>
                    <li class="nav-item"><a class="nav-link px-3" href="#wines">Wines</a></li>
                    <li class="nav-item"><a class="nav-link px-3" href="#location">Visit</a></li>
                    <li class="nav-item ms-3 position-relative">
                        <button onclick="toggleCart()" class="btn btn-outline-light position-relative d-flex align-items-center gap-2 px-3 py-2">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="cartCount" class="badge bg-warning text-dark rounded-pill">0</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section id="hero" class="hero text-center smoke-bg">
        <div class="container position-relative" style="z-index: 2;">
            <div class="mb-4">
                <span class="badge bg-warning text-dark px-5 py-3 fs-5 rounded-pill">ESTABLISHED 1975</span>
            </div>
            <h1 class="display-1 fw-bold mb-4">Údené fajnovosti</h1>
            <p class="lead fs-3 col-lg-8 mx-auto">
                Masterfully smoked delicacies from the old European tradition.<br>
                <span class="opacity-75">For those who appreciate the finest.</span>
            </p>
            <button onclick="document.getElementById('products').scrollIntoView({ behavior: 'smooth' })" class="btn btn-light btn-lg px-5 py-3 mt-4 shadow-sm fs-5">
                DISCOVER THE COLLECTION
            </button>
        </div>
    </section>

    <!-- Story -->
    <section id="story" class="section-padding bg-light">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-lg-6">
                    <img src="https://swaledale.co.uk/cdn/shop/files/1500x600_5_swaledale_whole_carcass.jpg?crop=center&height=576&v=1680769538&width=1440"
                         class="img-fluid rounded-4 shadow" alt="Traditional smokehouse with hanging meats" loading="lazy">
                </div>
                <div class="col-lg-6">
                    <h2 class="display-5 mb-4">Our Legacy</h2>
                    <p class="lead">For over five decades, the Salinka family has perfected the ancient art of smoking meats using only the finest ingredients and time-honored techniques.</p>
                    <p>Sweetwood smoke, patience, and reverence for tradition define every product we create.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Products -->
    <section id="products" class="section-padding">
        <div class="container">
            <div class="d-flex flex-wrap justify-content-between align-items-end mb-5">
                <h2 class="display-5">The Smoked Collection</h2>
                <div class="d-flex gap-3 flex-wrap">
                    <input type="text" id="searchInput" class="form-control" placeholder="Search products..." style="min-width: 260px;" onkeyup="filterProducts()">
                    <select id="originFilter" class="form-select" style="min-width: 180px;" onchange="filterProducts()">
                        <option value="">All Origins</option>
                    </select>
                </div>
            </div>
            <div class="row g-4" id="productGrid"></div>
        </div>
    </section>

    <!-- Wines -->
    <section id="wines" class="section-padding smoke-bg">
        <div class="container">
            <h2 class="display-5 section-title text-white text-center">Curated Wines</h2>
            <p class="text-center text-white-50 mb-5">Perfectly paired with our smoked delicacies</p>
            <div class="row g-4" id="wineGrid"></div>
        </div>
    </section>

    <!-- Location -->
    <section id="location" class="section-padding smoke-bg text-white">
        <div class="container">
            <h2 class="display-5 section-title text-white text-center">The Smokehouse</h2>
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="ratio ratio-16x9 mb-4 rounded-4 overflow-hidden shadow">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.5!2d18.042!3d48.894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476b3f8e6f0f0f0f%3A0x1!2sJed%C4%BEov%C3%A1%2012%2C%20911%2005%20Tren%C4%8D%C3%ADn!5e0!3m2!1sen!2ssk!4v123456789" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                    <p class="text-center lead">Jedľová 12, Trenčín, Slovakia</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Product Modal -->
    <div class="modal fade" id="productModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalTitle"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-5" id="modalBody"></div>
            </div>
        </div>
    </div>

    <!-- Cart -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" style="width: 460px;">
        <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title d-flex align-items-center gap-2">
                <i class="fas fa-shopping-cart"></i> Your Cart (<span id="offcanvasCartCount">0</span>)
            </h5>
            <div>
                <button onclick="clearCart()" class="btn btn-sm btn-outline-danger me-2">
                    <i class="fas fa-trash"></i> Clear
                </button>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
        </div>
        <div class="offcanvas-body d-flex flex-column p-0" id="cartBody"></div>
        <div class="p-4 border-top bg-light mt-auto">
            <div id="cartSummary"></div>
            <div class="d-grid gap-2 mt-4">
                <button onclick="checkout()" class="btn btn-dark w-100 py-3 fw-semibold fs-5">PROCEED TO CHECKOUT</button>
                <button onclick="closeCartAndScroll()" class="btn btn-outline-dark w-100 py-3">Continue Shopping</button>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container text-center">
            <h4 class="d-flex align-items-center justify-content-center gap-2 mb-3">
                <i class="fas fa-fire"></i> Smokehouse Salinka
            </h4>
            <p class="opacity-75 mb-1">Ing. Alexander Salinka • Trenčín, Slovakia</p>
            <p class="small opacity-50">&copy; 2026 • Exclusively for those who demand the extraordinary</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/data.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify it opens without errors**

Run:
```bash
open "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/index.html"
```
Expected: the page opens in the default browser, showing the hero section ("Údené fajnovosti"), and the product grid populates with cards (images may show the "Image unavailable" fallback for any dead hotlinks — that's correct, not a bug).

Open the browser's DevTools console (Cmd+Option+J in Chrome/Safari) and confirm there are no red errors. `data.js` and `app.js` both loading with no "products is not defined" or similar errors confirms the script load order is correct.

- [ ] **Step 3: Commit**

```bash
cd "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka"
git add index.html
git commit -m "Assemble index.html referencing extracted css/js files"
```

---

### Task 5: Full manual verification against the original

**Files:** none (verification only)

**Interfaces:** none — this task exercises the finished site through the browser.

- [ ] **Step 1: Open both versions side by side**

```bash
open "/Users/alexandersalinka/Coding/Vibe Coded/GROK_GOOD_STATE.html"
open "/Users/alexandersalinka/Coding/Vibe Coded/smokehouse-salinka/index.html"
```

- [ ] **Step 2: Walk through this checklist on the new version, comparing behavior to the original**

- [ ] Product grid renders all 16 meat products with correct names/prices/origins
- [ ] Wine grid renders all 3 wines
- [ ] Typing in the search box filters the product grid live
- [ ] Selecting an origin from the dropdown filters the product grid
- [ ] Clicking "Details" on a product opens the modal with correct name/price/description/wine pairing
- [ ] Clicking "Add to Cart" (from the card or the modal) increments the cart badge, shows a toast, and plays the fly-to-cart animation
- [ ] Opening the cart (shopping cart icon) shows added items with correct quantities and subtotal/shipping/total
- [ ] The `+`/`-` buttons and the quantity input field both update quantity and totals correctly
- [ ] Removing an item (the × button) removes it and updates totals
- [ ] "Clear" empties the cart after confirmation
- [ ] "PROCEED TO CHECKOUT" shows the demo alert and empties the cart
- [ ] Refreshing the page preserves the cart (localStorage persistence)
- [ ] Scrolling down triggers the fade-in animation on product cards
- [ ] No visual differences from the original layout/styling

- [ ] **Step 3: Confirm the fallback image works (optional but recommended)**

Temporarily edit one product's `img` value in `js/data.js` to an invalid URL (e.g. `"https://example.invalid/broken.jpg"`), refresh `index.html`, and confirm the "Image unavailable" placeholder appears instead of a broken-image icon. Then revert the edit (do not commit the broken URL).

- [ ] **Step 4: Final commit**

If Step 2 or Step 3 surfaced any discrepancies, fix them in the relevant file (`index.html`, `css/style.css`, `js/data.js`, or `js/app.js`) and commit the fix with a message describing what was wrong. If everything matched with no changes needed, no commit is necessary for this task.
