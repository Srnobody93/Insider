/* Catálogo compartido: lo usan dl-init.js (head) y app.js */
window.CATALOG=[
{id:'BR-001',name:'Cafetera italiana',list:39.9,price:34.9,tax:['Cocina','Café','Cafeteras'],brand:'Brasa'},
{id:'BR-002',name:'Sartén de hierro',list:49,price:49,tax:['Cocina','Utensilios','Sartenes'],brand:'Forja'},
{id:'BR-003',name:'Set de cuchillos',list:99.5,price:89.5,tax:['Cocina','Utensilios','Cuchillos'],brand:'Forja'},
{id:'BR-004',name:'Mantel de lino',list:27.5,price:27.5,tax:['Mesa','Textil','Manteles'],brand:'Brasa'},
{id:'BR-005',name:'Jarra de cerámica',list:25,price:22,tax:['Mesa','Vajilla','Jarras'],brand:'Arcilla'},
{id:'BR-006',name:'Tabla de olivo',list:31,price:31,tax:['Mesa','Servir','Tablas'],brand:'Arcilla'}];
(function(){var abs=function(u){return new URL(u,location.href).href;};
window.insProduct=function(p,q){var o={id:p.id,name:p.name,taxonomy:p.tax,unit_price:p.list,unit_sale_price:p.price,url:abs('product.html?id='+p.id),product_image_url:abs('img/'+p.id+'.svg')};if(q)o.quantity=q;return o;};})();
