// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Set current table (for demo purposes)
    localStorage.setItem('currentTable', '12');
});

// Function to update cart count in the UI
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    if (cartCountElements.length > 0) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
        });
    }
}

// Function to add item to cart
function addToCart(item) {
    // Check if similar item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.options) === JSON.stringify(item.options)
    );
    
    if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    return true;
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    return cart;
}
//--------------------------------nuova aggiunta---------------------------------------------------- 

// js/main.js
// Inizializza comportamento per le varie pagine (menu, carrello, custom, admin, qr, animazioni).
(function () {
  const PATH = location.pathname.split('/').pop();

  // Utilità localStorage
  const STORAGE = {
    CART: 'bt_cart_v1',
    PRODUCTS: 'bt_products_v1',
    ORDERS: 'bt_orders_v1',
    ADMIN: 'bt_admin_v1'
  };

  function read(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } }
  function write(key, v) { localStorage.setItem(key, JSON.stringify(v)); }

  // seed prodotti (se non ci sono)
  function seedProducts() {
    if (!read(STORAGE.PRODUCTS)) {
      const products = [
        { id: 'p1', name: 'Milk Tea Classico', price: 4.5, img: 'assets/products/drink1.jpg', deleted: false },
        { id: 'p2', name: 'Taro Bubble Tea', price: 5.0, img: 'assets/products/drink2.jpg', deleted: false },
        { id: 'p3', name: 'Matcha Latte', price: 4.8, img: 'assets/products/drink3.jpg', deleted: false },
        { id: 'p4', name: 'Fruit Tea Mango', price: 4.2, img: 'assets/products/drink4.jpg', deleted: false },
        { id: 'p5', name: 'Strawberry Latte', price: 4.7, img: 'assets/products/drink5.jpg', deleted: false },
        { id: 'p6', name: 'Coconut Bubble Tea', price: 4.9, img: 'assets/products/drink1.jpg', deleted: false }
      ];
      write(STORAGE.PRODUCTS, products);
    }
  }

  // CART API
  function getCart() { return read(STORAGE.CART) || []; }
  function saveCart(cart) { write(STORAGE.CART, cart); }
  function addToCart(item) {
    const cart = getCart();
    const found = cart.find(i => i.id === item.id);
    if (found) { found.qty += item.qty || 1; }
    else cart.push({ ...item, qty: item.qty || 1 });
    saveCart(cart);
    window.dispatchEvent(new CustomEvent('bt-cart-updated', { detail: { cart } }));
  }

  function removeFromCart(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    window.dispatchEvent(new CustomEvent('bt-cart-updated', { detail: { cart } }));
  }

  // ORDERS API (simula invio ordine)
  function placeOrder(cart) {
    const orders = read(STORAGE.ORDERS) || [];
    const id = `ORD${String(orders.length + 1).padStart(3, '0')}`;
    const order = { id, items: cart, status: 'In preparazione', createdAt: new Date().toISOString() };
    orders.push(order);
    write(STORAGE.ORDERS, orders);
    // svuota carrello
    saveCart([]);
    window.dispatchEvent(new CustomEvent('bt-order-placed', { detail: { order } }));
    return order;
  }

  // ADMIN mock credential seed
  function seedAdmin() {
    if (!read(STORAGE.ADMIN)) {
      write(STORAGE.ADMIN, { username: 'admin', password: 'admin' }); // attenzione: solo per test locale!
    }
  }

  // render helpers
  function renderCartWidget() {
    const cartCountEls = document.querySelectorAll('.bt-cart-count');
    const cart = getCart();
    cartCountEls.forEach(el => { el.textContent = cart.reduce((s,i)=>s+i.qty,0); });
  }

  // PAGE: menu.html
  function initMenuPage() {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    const products = (read(STORAGE.PRODUCTS) || []).filter(p => !p.deleted);
    grid.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card fade-in';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>€${p.price.toFixed(2)}</p>
        <button data-id="${p.id}">Aggiungi</button>
      `;
      grid.appendChild(card);
    });

    grid.addEventListener('click', e => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const prod = (read(STORAGE.PRODUCTS) || []).find(x => x.id === id);
      if (prod) addToCart({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
      // piccolo feedback
      btn.textContent = 'Aggiunto ✓';
      setTimeout(()=> btn.textContent = 'Aggiungi',800);
    });
  }

  // PAGE: custom.html
  function initCustomPage() {
    const form = document.querySelector('main.custom form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const base = form.querySelector('#base').value;
      const sciroppo = form.querySelector('#sciroppo').value;
      const perle = form.querySelector('#perle').value;
      const name = `${base} con ${sciroppo} (${perle})`;
      // prezzo stimato
      const price = 4.5;
      addToCart({ id: 'custom-' + Date.now(), name, price, qty: 1 });
      // feedback
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Aggiunto ✓';
      setTimeout(()=> btn.textContent = 'Aggiungi al carrello', 800);
    });
  }

  // PAGE: carrello.html
  function initCarrelloPage() {
    const list = document.querySelector('.carrello .items');
    const totalEl = document.querySelector('.carrello .totale strong');
    const checkoutBtn = document.querySelector('.carrello button');

    function render() {
      const cart = getCart();
      list.innerHTML = '';
      if (cart.length === 0) list.innerHTML = '<li>Il carrello è vuoto</li>';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - €${(item.price * item.qty).toFixed(2)} <button class="remove" data-id="${item.id}">Rimuovi</button>`;
        list.appendChild(li);
      });
      const total = cart.reduce((s,i)=> s + (i.price * i.qty), 0);
      if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
    }

    list.addEventListener('click', e => {
      const btn = e.target.closest('button.remove');
      if (!btn) return;
      removeFromCart(btn.getAttribute('data-id'));
      render();
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) { alert('Carrello vuoto'); return; }
        const order = placeOrder(cart);
        alert(`Ordine ${order.id} ricevuto!`);
        render();
      });
    }

    window.addEventListener('bt-cart-updated', render);
    render();
  }

  // PAGE: menu index or shared header cart count
  function initCartWidget() {
    renderCartWidget();
    window.addEventListener('bt-cart-updated', renderCartWidget);
    window.addEventListener('bt-order-placed', () => {
      renderCartWidget();
    });
  }

  // PAGE: admin/login.html
  function initAdminLogin() {
    const form = document.querySelector('body.login form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const username = form.querySelector('input[type="text"]').value;
      const password = form.querySelector('input[type="password"]').value;
      const admin = read(STORAGE.ADMIN);
      if (admin && admin.username === username && admin.password === password) {
        // semplice "sessione" locale
        localStorage.setItem('bt_admin_session', JSON.stringify({ user: username, ts: Date.now() }));
        location.href = 'dashboard.html';
      } else {
        alert('Credenziali non valide (seed: admin/admin)');
      }
    });
  }

  // PAGE: admin/dashboard.html
  function initAdminDashboard() {
    const table = document.querySelector('.admin table');
    if (!table) return;
    function render() {
      const orders = read(STORAGE.ORDERS) || [];
      const bodyHtml = orders.map(o => `<tr>
        <td>${o.id}</td>
        <td>${o.items.map(i=> `${i.name} x${i.qty}`).join('<br>')}</td>
        <td>
          <select data-id="${o.id}">
            <option ${o.status==='In preparazione'?'selected':''}>In preparazione</option>
            <option ${o.status==='Pronto'?'selected':''}>Pronto</option>
            <option ${o.status==='Consegnato'?'selected':''}>Consegnato</option>
          </select>
        </td>
      </tr>`).join('');
      // remove old rows (except header)
      table.querySelectorAll('tr:not(:first-child)').forEach(n => n.remove());
      table.insertAdjacentHTML('beforeend', bodyHtml);
    }

    table.addEventListener('change', e => {
      const sel = e.target.closest('select[data-id]');
      if (!sel) return;
      const id = sel.getAttribute('data-id');
      const val = sel.value;
      const orders = read(STORAGE.ORDERS) || [];
      const idx = orders.findIndex(x => x.id === id);
      if (idx >= 0) {
        orders[idx].status = val;
        write(STORAGE.ORDERS, orders);
      }
    });

    render();
  }

  // PAGE: admin/prodotti.html
  function initAdminProdotti() {
    const main = document.querySelector('.admin');
    if (!main) return;
    const list = document.createElement('ul');
    list.className = 'lista-prodotti';
    main.appendChild(list);

    function render() {
      const products = read(STORAGE.PRODUCTS) || [];
      list.innerHTML = '';
      products.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `${p.name} <button class="delete" data-id="${p.id}">${p.deleted ? 'Ripristina' : 'Elimina'}</button>`;
        list.appendChild(li);
      });
    }

    main.addEventListener('click', e => {
      const btn = e.target.closest('button.delete');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const products = read(STORAGE.PRODUCTS) || [];
      const idx = products.findIndex(x => x.id === id);
      if (idx >= 0) {
        // soft delete toggle
        products[idx].deleted = !products[idx].deleted;
        write(STORAGE.PRODUCTS, products);
        render();
      }
    });

    render();
  }

  // PAGE: admin/statistiche.html
  function initAdminStats() {
    const el = document.querySelector('.admin');
    if (!el) return;
    const orders = read(STORAGE.ORDERS) || [];
    const products = read(STORAGE.PRODUCTS) || [];
    const mostSold = (() => {
      const map = {};
      orders.forEach(o => o.items.forEach(i => map[i.name] = (map[i.name] || 0) + i.qty));
      const sorted = Object.entries(map).sort((a,b)=>b[1]-a[1]);
      return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]}x)` : 'Nessuno';
    })();
    el.innerHTML += `<p>Ordini totali: ${orders.length}</p><p>Prodotti totali: ${products.length}</p><p>Prodotto più venduto: ${mostSold}</p>`;
  }

  // PAGE: index.html (attiva bolle)
  function initIndexPage() {
    if (window.BTBubbles) window.BTBubbles.attach();
  }

  // PAGE: QR (se presenti video e canvas)
  function initQRPage() {
    const video = document.getElementById('bt-qr-video');
    const canvas = document.getElementById('bt-qr-canvas');
    if (!video || !canvas || !window.BTQRScanner) return;
    // start on button click or auto start if element data-autostart present
    const btn = document.getElementById('bt-qr-start');
    if (btn) btn.addEventListener('click', () => window.BTQRScanner.start(video, canvas));
    if (video.dataset.autostart === '1') window.BTQRScanner.start(video, canvas);

    // handle event
    window.addEventListener('bt-qr-scanned', (ev) => {
      alert('QR scanner trovato: ' + ev.detail.data);
    });
  }

  // INIT sequence
  function init() {
    seedProducts();
    seedAdmin();
    initCartWidget();

    // common small listeners
    document.addEventListener('click', (e) => {
      // placeholder for delegated interactions if serve
    });

    // route-specific
    if (/index\.html|^$/.test(PATH)) initIndexPage();
    if (PATH === 'menu.html') initMenuPage();
    if (PATH === 'custom.html') initCustomPage();
    if (PATH === 'carrello.html') initCarrelloPage();
    if (PATH === 'dolci.html') { /* nothing special — styles already applied */ }
    if (PATH === 'login.html' || PATH === 'admin/login.html') initAdminLogin();
    if (PATH === 'dashboard.html' || PATH === 'admin/dashboard.html') initAdminDashboard();
    if (PATH === 'prodotti.html' || PATH === 'admin/prodotti.html') initAdminProdotti();
    if (PATH === 'statistiche.html' || PATH === 'admin/statistiche.html') initAdminStats();
    // QR scanner (generic)
    initQRPage();

    // nice: update cart counts on load
    window.dispatchEvent(new CustomEvent('bt-cart-updated', { detail: { cart: getCart() } }));
  }

  // start when DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // expose for debugging
  window.BTCore = { addToCart, getCart, placeOrder, STORAGE };
})();
