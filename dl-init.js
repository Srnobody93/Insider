/* Se carga ANTES del snippet de GTM. En una MPA el dataLayer se reinicia en cada página,
   así que user, currency, page_type y cart se vuelven a publicar en cada carga. */
(function () {
  var g = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var id;
  try {
    id = localStorage.getItem('uid');
    if (!id) { id = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); localStorage.setItem('uid', id); }
  } catch (e) {}
  var u = g('user') || {}, snap = g('cartSnap');
  var user = Object.assign({ uuid: id, language: 'es', returning: !!(u.email || g('order')) }, u);
  var data = { page_type: document.currentScript.dataset.page, currency: 'EUR', user: user };
  if (snap && snap.items && snap.items.length) data.cart = snap;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
})();
