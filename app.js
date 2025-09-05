
// DATOS Y ESTADO<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<//
const products = [
  { id: 1, name: "Fernet Branca 750ml", priceUSD: 14.99, image: "https://i.ibb.co/fdc1Wjyx/fernet-1.png" },
  { id: 2, name: "Vodka Absolut 1L", priceUSD: 23.50, image: "https://i.ibb.co/bMvGkX2G/vodka-2.png" },
  { id: 3, name: "Whisky Jameson 700ml", priceUSD: 31.90, image: "https://i.ibb.co/gLZzNVs0/wiskyj-3.png" },
  { id: 4, name: "Gin Gordon's 750ml", priceUSD: 18.25, image: "https://i.ibb.co/dwRTrVzp/gin-gordo-4.png" },
  { id: 5, name: "Tequila Jose Cuervo 750ml", priceUSD: 27.40, image: "https://i.ibb.co/KpyfnTy5/tequila-jose-c-5.png" },
  { id: 6, name: "Ron Havana Club 7 años", priceUSD: 26.80, image: "https://i.ibb.co/Dg6C2jmy/ron-havana-6.png" },
  { id: 7, name: "Cerveza Heineken 473ml", priceUSD: 2.50, image: "https://i.ibb.co/ccX7grv3/heineken.png" },
  { id: 8, name: "Cerveza Quilmes 473ml", priceUSD: 2.10, image: "https://i.ibb.co/TMvzg5Td/quilmes.png" },
  { id: 9, name: "Campari 750ml", priceUSD: 15.60, image: "https://i.ibb.co/v677nRjW/campari.png" },
  { id: 10, name: "Gancia Americano 950ml", priceUSD: 7.90, image: "https://i.ibb.co/Kcx6JcqM/gancia.png" },
  { id: 11, name: "Aperol 750ml", priceUSD: 15.20, image: "https://i.ibb.co/BVMS2bH1/aperol.png" },
  { id: 12, name: "Malbec Mendoza 750ml", priceUSD: 9.50, image: "https://i.ibb.co/7dv2PJ4P/malbec-mendoza.png" },
  { id: 13, name: "Sidra 710ml", priceUSD: 3.20, image: "https://i.ibb.co/bgC37ZpZ/sidrafarruca.png" },
  { id: 14, name: "Vodka Smirnoff 700ml", priceUSD: 15.40, image: "https://i.ibb.co/DHMRKfX2/smirnoff.png" },
  { id: 15, name: "Whisky Johnnie Red 750ml", priceUSD: 24.99, image: "https://i.ibb.co/PsRDgBrX/jonnyred.png" },
  { id: 16, name: "Gin Beefeater 700ml", priceUSD: 22.50, image: "https://i.ibb.co/39VtyXJw/ginbeef.png" },
  { id: 17, name: "Tequila Don Julio 750ml", priceUSD: 48.00, image: "https://i.ibb.co/46xQkHW/tequilajulio.png" },
  { id: 18, name: "Ron Bacardí 750ml", priceUSD: 19.80, image: "https://i.ibb.co/LFWjqtB/bacardi.png" },
  { id: 19, name: "Espumante Extra Brut", priceUSD: 11.10, image: "https://i.ibb.co/KxjSr5Wy/espumante.png" },
  { id: 20, name: "Energy Drink 473ml", priceUSD: 1.90, image: "https://i.ibb.co/DPbr8swP/monster.png" },
];

let cart = JSON.parse(localStorage.getItem("cart_bolichera") || "[]");
let currency = localStorage.getItem("currency_bolichera") || "USD";
let exchangeRate = Number(localStorage.getItem("rate_bolichera") || 0); // ARS por 1 USD
let lastRateAt = localStorage.getItem("rate_at_bolichera") || null;

// Helpers de formato<<<<<<<<<<<<<<<<<<<<<<<<<
const money = (amount, curr = currency) => {
  // Usamos siempre 2 decimales y mostramos la moneda abreviada al final
  return `$ ${amount.toFixed(2)}`;
};

const getPrice = (product) => {
  if (currency === "USD") return product.priceUSD;
  // Si no hay tasa conocida, devolvemos el precio en USD y marcamos que falta tasa
  if (!exchangeRate || exchangeRate <= 0) return product.priceUSD;
  return product.priceUSD * exchangeRate;
};

// DOM refs<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItemsEl = document.getElementById("cartItems");
const subtotalLabel = document.getElementById("subtotalLabel");
const cartCountEl = document.getElementById("cartCount");
const currencySelect = document.getElementById("currencySelect");
const rateInfo = document.getElementById("rateInfo");
const toolbar = document.querySelector(".toolbar");

// Inyectar input de búsqueda en toolbar<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const injectSearch = () => {
  // Crear contenedor a la izquierda (si no existe)
  const right = toolbar.querySelector('.toolbar__right');
  const left = toolbar.querySelector('.toolbar__left');

  // INPUT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const wrapper = document.createElement('div');
  wrapper.className = 'toolbar__search';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '0.6rem';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Buscar producto...';
  input.id = 'searchInput';
  input.style.padding = '.5rem .7rem';
  input.style.borderRadius = '10px';
  input.style.border = '1px solid rgba(255,255,255,0.08)';
  input.style.background = 'transparent';
  input.style.color = 'var(--text)';
  input.autocomplete = 'off';

  wrapper.appendChild(input);
  // Insertar entre left y right
  toolbar.insertBefore(wrapper, right);

  // Listener de búsqueda (filtrado en tiempo real)
  input.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    renderProducts(q);
  });
};

// Render productos<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const renderProducts = (query = '') => {
  let html = '';
  for (const p of products) {
    if (query) {
      const hay = (p.name + ' ' + (p.id || '')).toLowerCase();
      if (!hay.includes(query)) continue;
    }
    const price = getPrice(p);
    html += `
      <article class="card">
        <img class="card__img" src="${p.image}" alt="${p.name}" loading="lazy"/>
        <div class="card__body">
          <h3 class="card__title">${p.name}</h3>
          <div class="card__meta">
            <span class="price">${money(price)}</span>
            <small class="muted">/${currency}</small>
          </div>
          <button data-id="${p.id}" class="btn btn--neon add-btn">
            <i class="fa-solid fa-plus"></i> Agregar
          </button>
        </div>
      </article>
    `;
  }
  productGrid.innerHTML = html;

  // Listeners<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const addButtons = productGrid.querySelectorAll('.add-btn');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.getAttribute('data-id'));
      addToCart(id);
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Agregado al carrito', showConfirmButton: false, timer: 1000 });
    });
  });
};

//Carrito: CRUD localStorage<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const saveCart = () => localStorage.setItem('cart_bolichera', JSON.stringify(cart));

const addToCart = (id, qty = 1) => {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  renderCart();
};

const removeFromCart = (id) => {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
};

const increaseQty = (id) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += 1;
  saveCart();
  renderCart();
};

const decreaseQty = (id) => {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty -= 1;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCart(); }
};

const clearCart = () => { cart = []; saveCart(); renderCart(); };

// Render carrito <<<<<<<<<<<<<<<<<<<<<<<<<<<
const renderCart = () => {
  if (!cart.length) {
    cartItemsEl.innerHTML = `<p class="muted">Tu carrito está vacío. Agregá algo rico pa!</p>`;
    subtotalLabel.textContent = money(0);
  } else {
    let html = '';
    let subtotal = 0;
    for (const item of cart) {
      const p = products.find(x => x.id === item.id);
      const unit = getPrice(p);
      const line = unit * item.qty;
      subtotal += line;
      html += `
        <div class="cart__item">
          <img src="${p.image}" alt="${p.name}" />
          <div>
            <strong>${p.name}</strong><br/>
            <small class="muted">${money(unit)} x ${item.qty} ${currency}</small>
          </div>
          <div class="qty-control">
            <button data-id="${p.id}" data-act="dec" title="Restar"><i class="fa-solid fa-minus"></i></button>
            <span><strong>${item.qty}</strong></span>
            <button data-id="${p.id}" data-act="inc" title="Sumar"><i class="fa-solid fa-plus"></i></button>
            <button data-id="${p.id}" data-act="del" title="Eliminar" style="margin-left:.4rem;color:var(--danger)">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }
    cartItemsEl.innerHTML = html;
    subtotalLabel.textContent = money(subtotal);

    cartItemsEl.querySelectorAll('button').forEach(btn => {
      const id = Number(btn.getAttribute('data-id'));
      const act = btn.getAttribute('data-act');
      btn.addEventListener('click', () => {
        if (act === 'inc') increaseQty(id);
        if (act === 'dec') decreaseQty(id);
        if (act === 'del') {
          removeFromCart(id);
          Swal.fire({ title: 'Eliminado', text: 'Se quitó el producto del carrito.', icon: 'info', timer: 900, showConfirmButton: false });
        }
      });
    });
  }

  const count = cart.reduce((acc, it) => acc + it.qty, 0);
  cartCountEl.textContent = count;
};

//PANEL CARRITO<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const openCart = () => { cartPanel.classList.add('cart--open'); overlay.classList.add('overlay--show'); };
const closeCart = () => { cartPanel.classList.remove('cart--open'); overlay.classList.remove('overlay--show'); };

//Fetch<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const getRateWithFallback = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Intento 1
      const res1 = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=ARS');
      if (res1.ok) {
        const d1 = await res1.json();
        if (d1 && d1.rates && d1.rates.ARS) return resolve({ rate: Number(d1.rates.ARS), source: 'exchangerate.host' });
      }
    } catch (e) { console.warn('exchangerate.host fallo', e); }

    try {
      // Intento 2
      const res2 = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res2.ok) {
        const d2 = await res2.json();
        // Estructura: d2.rates.ARS
        if (d2 && d2.rates && d2.rates.ARS) return resolve({ rate: Number(d2.rates.ARS), source: 'open.er-api.com' });
      }
    } catch (e) { console.warn('open.er-api.com fallo', e); }

    // Si llegamos acá, ambos fallaron
    return reject(new Error('No se obtuvo cotización desde APIs públicas'));
  });
};

// Wrapper async que usa la Promise anterior
const fetchRate = async () => {
  try {
    rateInfo.textContent = 'Obteniendo cotización...';
    //.then
    await getRateWithFallback().then(result => {
      exchangeRate = result.rate;
      lastRateAt = new Date().toLocaleString();
      // localStorage
      localStorage.setItem('rate_bolichera', exchangeRate);
      localStorage.setItem('rate_at_bolichera', lastRateAt);
      rateInfo.textContent = `1 USD ≈ ${exchangeRate.toFixed(2)} ARS (via ${result.source} - ${lastRateAt})`;
    }).catch(err => {
      console.error('No se pudo obtener tasa:', err);
      rateInfo.textContent = 'No se pudo obtener cotización automática. Usá el control manual.';
      // Mostrar control para ingresar una tasa manual
      showManualRateControl();
      // No lanzar error para que la UI siga funcionando
    });
  } catch (err) {
    console.error('fetchRate error', err);
    rateInfo.textContent = 'Error inesperado al obtener cotización.';
    showManualRateControl();
  } finally {
    renderProducts();
    renderCart();
  }
};

//Control para ingresar tasa manual<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const showManualRateControl = () => {
  // Si ya existe, no duplicar
  if (document.getElementById('manualRateWrap')) return;

  const wrap = document.createElement('div');
  wrap.id = 'manualRateWrap';
  wrap.style.display = 'flex';
  wrap.style.gap = '.6rem';
  wrap.style.alignItems = 'center';
  wrap.style.marginLeft = '.6rem';

  const input = document.createElement('input');
  input.type = 'number';
  input.step = '0.01';
  input.min = '0';
  input.placeholder = 'Tasa ARS por USD';
  input.style.padding = '.4rem .6rem';
  input.style.borderRadius = '8px';
  input.id = 'manualRateInput';

  const btn = document.createElement('button');
  btn.className = 'btn btn--neon';
  btn.textContent = 'Aplicar tasa';
  btn.addEventListener('click', () => {
    const v = Number(input.value);
    if (!v || v <= 0) {
      Swal.fire({ icon: 'error', title: 'Tasa inválida', text: 'Ingresá una tasa válida mayor a 0.' });
      return;
    }
    exchangeRate = v;
    lastRateAt = new Date().toLocaleString();
    localStorage.setItem('rate_bolichera', exchangeRate);
    localStorage.setItem('rate_at_bolichera', lastRateAt);
    rateInfo.textContent = `1 USD ≈ ${exchangeRate.toFixed(2)} ARS (manual - ${lastRateAt})`;
    wrap.remove();
    renderProducts();
    renderCart();
  });

  wrap.appendChild(input);
  wrap.appendChild(btn);
  // Insertar al final de toolbar right
  const right = toolbar.querySelector('.toolbar__right');
  right.appendChild(wrap);
};

//Eventos de moneda<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
currencySelect.addEventListener('change', async (e) => {
  currency = e.target.value;
  localStorage.setItem('currency_bolichera', currency);
  if (currency === 'ARS') {
    await fetchRate();
  } else {
    rateInfo.textContent = 'Mostrando en USD.';
    renderProducts();
    renderCart();
  }
});

// Checkout (simulado)<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const checkout = () => {
  if (!cart.length) {
    Swal.fire({ title: 'Tu carrito está vacío', text: 'Agregá al menos un producto para continuar.', icon: 'warning' });
    return;
  }
  const total = cart.reduce((acc, it) => {
    const p = products.find(x => x.id === it.id);
    return acc + getPrice(p) * it.qty;
  }, 0);

  Swal.fire({ title: 'Confirmar compra', html: `<p>Vas a pagar <strong>${money(total)} ${currency}</strong>.</p><small>Simulación solamente.</small>`, icon: 'question', showCancelButton: true, confirmButtonText: 'Comprar', cancelButtonText: 'Cancelar' })
    .then(res => {
      if (res.isConfirmed) {
        clearCart();
        Swal.fire({ title: '¡Gracias!', text: 'Pedido registrado (simulado).', icon: 'success' });
      }
    });
};

// Listeners globales<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
document.getElementById('btnCart').addEventListener('click', openCart);
document.getElementById('btnCloseCart').addEventListener('click', closeCart);
document.getElementById('btnClear').addEventListener('click', () => {
  if (!cart.length) return;
  Swal.fire({ title: 'Vaciar carrito', text: '¿Seguro?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'No' }).then(r => { if (r.isConfirmed) clearCart(); });
});
document.getElementById('btnCheckout').addEventListener('click', checkout);
document.getElementById('overlay').addEventListener('click', closeCart);

//Boot<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const init = async () => {
  // Inyectar búsqueda
  injectSearch();

  // Set moneda desde storage
  const sel = document.getElementById('currencySelect');
  sel.value = currency;

  // Año en footer
  const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Si moneda es ARS y no hay tasa guardada, la buscamos
  if (currency === 'ARS') {
    if (!exchangeRate || exchangeRate <= 0) {
      await fetchRate();
    } else {
      rateInfo.textContent = `1 USD ≈ ${exchangeRate.toFixed(2)} ARS (guardada ${lastRateAt || ''})`;
    }
  } else {
    rateInfo.textContent = 'Mostrando en USD.';
  }

  renderProducts();
  renderCart();
};

init();
