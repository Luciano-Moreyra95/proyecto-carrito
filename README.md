# La Bolichera · Simulador de Carrito (HTML/CSS/JS)

**Stack:** HTML5 + CSS3 + JavaScript (ES6+)
**Autor:** Luciano Rodrigo Moreyra
**Propósito:** Proyecto educativo/demostrativo para CODER HOUSE - Comisión 80835 - Curso Javascript - Carrera Full Stack 

---

## Características

- 20 productos de bebidas alcohólicas con estética **bolichera/neón**.
- Carrito de compras con **localStorage**
- Selector de moneda (**USD / ARS**) con **Fetch API** a `exchangerate.host` para convertir precios.
- **SweetAlert2** para alertas y confirmaciones.
- Diseño responsive y moderno, con **Google Fonts** y **Font Awesome**.

> **Nota legal:** Este demo es educativo. Beba con moderación. Venta sólo para mayores de edad.

---

## 📁 Estructura

```
carrito-bolichera/
├─ index.html     # Marcado y linkeo de librerías + contenedores
├─ styles.css     # Estilos neon/bolichera
├─ app.js         # Lógica de productos, carrito y fetch de cotización
└─ README.md
```

---

## 🚀 Cómo usar

1. Abrí `index.html` en tu navegador.
2. Agregá productos al carrito.
3. Probá el simulador agregando más cantidad de productos, prueba comprar todo o vaciar el carrito.

> Puedes elegir entre ## ARS / USD

---

## 🧩 Librerías/CDN

- **SweetAlert2:** `https://cdn.jsdelivr.net/npm/sweetalert2@11`  
  Usado para alertas al agregar/eliminar y para confirmar compra.
- **Google Fonts (Orbitron, Inter)**  
- **Font Awesome 6** para íconos.

> Todas las librerías se importan por **CDN** en `index.html`
---

## 🔧 Personalización

- Productos: editar el array `products` en `app.js` (precio en **USD**).
- Estilos: ajustar variables CSS en `:root` dentro de `styles.css`.
- Monedas: podés ampliar el selector y lógica de conversión en `app.js`.

---

## 🧪 Pruebas rápidas

- Cambiá de USD a ARS y confirmá la actualización del texto de cotización.
- Agregá/quitá items y recargá la página: el carrito debería persistir.
- Probá **Vaciar** y **Comprar** para ver los diálogos de confirmación.

---

## ⚠️ Disclaimer

- Imágenes de ejemplo provenientes de URL pública  
- Este proyecto no implementa pago real ni verificación de edad.
