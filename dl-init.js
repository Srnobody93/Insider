/* Se carga ANTES del snippet de GTM (después de catalog.js).
   En una MPA el dataLayer se reinicia en cada página, así que se publica en cada carga:
   page_type, currency, user, cart y page_data (el objeto propio de cada página). */
(function () {
  var pt = document.currentScript.dataset.page;
  var g = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var id;
  try {
    id = localStorage.getItem('uid');
    if (!id) { id = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem('uid', id); }
  } catch (e) {}
  var u = g('user') || {}, snap = g('cartSnap');
  var user = Object.assign({ uuid: id, language: 'es', returning: !!(u.email || g('order')) }, u);
  var data = { page_type: pt, currency: 'EUR', user: user };
  if (snap && snap.items && snap.items.length) data.cart = snap;

  // page_data: product -> producto | cart y checkout -> {total, items} | purchase -> {order_id, total, items}
  var pd = null;
  if (pt === 'product') {
    var pid = new URLSearchParams(location.search).get('id');
    var p = (window.CATALOG || []).filter(function (x) { return x.id === pid; })[0];
    if (p) pd = window.insProduct(p);
  } else if (pt === 'cart' || pt === 'checkout') {  // checkout se trata como parte del carrito
    pd = snap && snap.items ? snap : { total: 0, items: [] };
  } else if (pt === 'purchase') {
    var o = g('order');
    if (o) pd = { order_id: o.id, total: o.total, items: o.ins };
  }
  if (pd) data.page_data = pd;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
})();
