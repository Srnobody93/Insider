(()=>{
const P=[
{id:'BR-001',name:'Cafetera italiana',list:39.9,price:34.9,tax:['Cocina','Café','Cafeteras'],brand:'Brasa'},
{id:'BR-002',name:'Sartén de hierro',list:49,price:49,tax:['Cocina','Utensilios','Sartenes'],brand:'Forja'},
{id:'BR-003',name:'Set de cuchillos',list:99.5,price:89.5,tax:['Cocina','Utensilios','Cuchillos'],brand:'Forja'},
{id:'BR-004',name:'Mantel de lino',list:27.5,price:27.5,tax:['Mesa','Textil','Manteles'],brand:'Brasa'},
{id:'BR-005',name:'Jarra de cerámica',list:25,price:22,tax:['Mesa','Vajilla','Jarras'],brand:'Arcilla'},
{id:'BR-006',name:'Tabla de olivo',list:31,price:31,tax:['Mesa','Servir','Tablas'],brand:'Arcilla'}];
const SHIP={standard:{n:'Estándar (3-5 días)',c:4.9},express:{n:'Exprés (24 h)',c:9.9}};
const PAY={card:'Tarjeta',paypal:'PayPal',transfer:'Transferencia'};
const dl=window.dataLayer=window.dataLayer||[];
const ev=(event,ecommerce,extra)=>{dl.push({ecommerce:null});dl.push({event,ecommerce,...extra});};
const $=s=>document.querySelector(s),app=$('#app');
const eur=n=>n.toLocaleString('es-ES',{style:'currency',currency:'EUR'});
const r2=n=>Math.round(n*100)/100;
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const prod=id=>P.find(p=>p.id===id);
const abs=u=>new URL(u,location.href).href,purl=p=>abs('product.html?id='+p.id),img=p=>abs('img/'+p.id+'.svg');
const ins=(p,q)=>({id:p.id,name:p.name,taxonomy:p.tax,unit_price:p.list,unit_sale_price:p.price,url:purl(p),product_image_url:img(p),...(q?{quantity:q}:{})});
const cats=()=>{const t={};P.forEach(p=>{t[p.tax[0]]=t[p.tax[0]]||{};(t[p.tax[0]][p.tax[1]]=t[p.tax[0]][p.tax[1]]||[]).push(p.tax[2]);});return t;};
window.getCategories=cats;
const item=(p,q=1,list,i)=>({item_id:p.id,item_name:p.name,item_brand:p.brand,item_category:p.tax[0],item_category2:p.tax[1],item_category3:p.tax[2],price:p.price,quantity:q,...(list?{item_list_id:'catalogo',item_list_name:list,index:i}:{})});
const lines=()=>get('cart',[]).map(l=>({p:prod(l.id),q:l.q}));
const items=()=>lines().map(l=>item(l.p,l.q));
const sub=()=>r2(lines().reduce((s,l)=>s+l.p.price*l.q,0));
const shipCost=(k,s)=>k==='standard'&&s>=100?0:SHIP[k].c;
const badge=()=>{$('#badge').textContent=lines().reduce((s,l)=>s+l.q,0);set('cartSnap',cartObj());};
const change=(id,d)=>{let c=get('cart',[]),l=c.find(x=>x.id===id);if(l)l.q+=d;else c.push({id,q:d});set('cart',c.filter(x=>x.q>0));badge();};
const thumb=(p,c='')=>`<img class="ph ${c}" src="img/${p.id}.svg" alt="${p.name}">`;
const insItems=()=>lines().map(l=>ins(l.p,l.q));
const cartObj=()=>{const S=sub();return {total:S?r2(S+shipCost('standard',S)):0,items:insItems()};};
const price=p=>(p.list>p.price?`<span class="old">${eur(p.list)}</span>`:'')+eur(p.price);
const pages={

home(){
 const cat=new URLSearchParams(location.search).get('cat'),path=cat?cat.split('/'):[];
 const L=P.filter(p=>path.every((c,i)=>p.tax[i]===c));
 const links=[...new Set(P.flatMap(p=>[p.tax[0],p.tax[0]+'/'+p.tax[1]]))];
 app.innerHTML=`${path.length?`<div class="crumb">${['Inicio',...path].join(' › ')}</div>`:''}<h1>${path.length?path[path.length-1]:'Para la mesa y la cocina'}</h1>
 <nav class="chips"><a href="index.html" class="${cat?'':'on'}">Todo</a>${links.map(l=>`<a href="index.html?cat=${encodeURIComponent(l)}" class="${l===cat?'on':''}">${l.split('/').pop()}${l.includes('/')?'':' ▾'}</a>`).join('')}</nav>
 <div class="grid">${L.map((p,i)=>`<a class="card" href="product.html?id=${p.id}" data-id="${p.id}" data-i="${i}">${thumb(p)}<div style="margin-top:10px">${p.name}</div><div class="mut">${p.tax.join(' › ')}</div><div class="price">${price(p)}</div></a>`).join('')}</div>`;
 const nm=path.length?path.join(' › '):'Catálogo';
 if(cat)dl.push({page_type:'category'});
 ev('view_item_list',{item_list_id:'catalogo',item_list_name:nm,items:L.map((p,i)=>item(p,1,nm,i))},{listing:{taxonomy:path,categories:cats()}});
 app.addEventListener('click',e=>{const a=e.target.closest('.card');if(!a)return;const p=prod(a.dataset.id);
  ev('select_item',{item_list_id:'catalogo',item_list_name:nm,items:[item(p,1,nm,+a.dataset.i)]});});
},

product(){
 const p=prod(new URLSearchParams(location.search).get('id'));if(!p){location.replace('index.html');return;}
 app.innerHTML=`<div class="two"><div>${thumb(p,'big')}</div><div><h1>${p.name}</h1><div class="crumb">${p.tax.join(' › ')}</div><p class="price" style="font-size:24px">${price(p)}</p><button class="btn" id="add">Añadir al carrito</button> <a class="btn alt" href="cart.html">Ver carrito</a><p id="msg" class="mut" role="status"></p></div></div>`;
 ev('view_item',{currency:'EUR',value:p.price,items:[item(p)]},{product:ins(p)});
 $('#add').onclick=()=>{change(p.id,1);ev('add_to_cart',{currency:'EUR',value:p.price,items:[item(p)]},{cart:cartObj()});$('#msg').textContent='Añadido al carrito.';};
},

cart(){
 let first=true;
 const draw=()=>{const L=lines();
  if(!L.length){app.innerHTML=`<h1>Tu carrito</h1><p>Está vacío. <a href="index.html">Explora el catálogo</a>.</p>`;}
  else app.innerHTML=`<h1>Tu carrito</h1><div class="two"><div>${L.map(l=>`<div class="row">${thumb(l.p)}<div class="g">${l.p.name}<div class="mut">${price(l.p)}</div></div><div class="q"><button data-a="-1" data-id="${l.p.id}" aria-label="Quitar uno">−</button> ${l.q} <button data-a="1" data-id="${l.p.id}" aria-label="Añadir uno">+</button></div><div class="price">${eur(l.p.price*l.q)}</div><button class="btn alt" data-a="rm" data-id="${l.p.id}">Eliminar</button></div>`).join('')}</div>
  <div class="box"><div class="tot"><span>Subtotal</span><span>${eur(sub())}</span></div><div class="tot"><span>Envío estimado</span><span>${shipCost('standard',sub())?eur(shipCost('standard',sub())):'Gratis'}</span></div><div class="tot big"><span>Total</span><span>${eur(cartObj().total)}</span></div><p class="mut">IVA incluido. Envío gratis desde 100 €.</p><a class="btn" href="checkout.html">Ir al checkout</a></div></div>`;
  if(first){first=false;ev('view_cart',{currency:'EUR',value:sub(),items:items()},{cart:cartObj()});}};
 draw();
 app.addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;
  const p=prod(b.dataset.id),cur=get('cart',[]).find(x=>x.id===p.id).q;
  if(b.dataset.a==='1'){change(p.id,1);ev('add_to_cart',{currency:'EUR',value:p.price,items:[item(p)]},{cart:cartObj()});}
  else{const n=b.dataset.a==='rm'?cur:1;change(p.id,-n);ev('remove_from_cart',{currency:'EUR',value:r2(p.price*n),items:[item(p,n)]},{cart:cartObj()});}
  draw();});
},

checkout(){
 if(!lines().length){location.replace('cart.html');return;}
 const S=sub();let ship='standard',pay='card';
 app.innerHTML=`<h1>Checkout</h1><form id="f" class="two"><div class="box"><label>Nombre completo<input type="text" name="name" required></label><label>Email<input type="email" name="email" required></label><label>Dirección<input type="text" name="addr" required></label><label>Ciudad y código postal<input type="text" name="city" required></label><label>Teléfono (opcional)<input type="text" name="phone"></label><div class="opt"><input type="checkbox" name="optin" id="optin"><label for="optin">Acepto recibir comunicaciones comerciales por email</label></div>
 <h3>Envío</h3>${Object.entries(SHIP).map(([k,v],i)=>`<div class="opt"><input type="radio" name="ship" id="s${k}" value="${k}" ${i?'':'checked'}><label for="s${k}">${v.n}</label></div>`).join('')}
 <h3>Pago (simulado)</h3>${Object.entries(PAY).map(([k,v],i)=>`<div class="opt"><input type="radio" name="pay" id="p${k}" value="${k}" ${i?'':'checked'}><label for="p${k}">${v}</label></div>`).join('')}</div>
 <div class="box"><div id="sum"></div><button class="btn" type="submit">Confirmar pedido</button></div></form>`;
 const sum=()=>{const sc=shipCost(ship,S);$('#sum').innerHTML=lines().map(l=>`<div class="tot"><span>${l.q}× ${l.p.name}</span><span>${eur(l.p.price*l.q)}</span></div>`).join('')+`<div class="tot"><span>Envío</span><span>${sc?eur(sc):'Gratis'}</span></div><div class="tot big"><span>Total</span><span>${eur(S+sc)}</span></div>`;};
 sum();
 ev('begin_checkout',{currency:'EUR',value:S,items:items()});
 $('#f').addEventListener('change',e=>{
  if(e.target.name==='ship'){ship=e.target.value;sum();ev('add_shipping_info',{currency:'EUR',value:S,shipping_tier:SHIP[ship].n,items:items()});}
  if(e.target.name==='pay'){pay=e.target.value;ev('add_payment_info',{currency:'EUR',value:S,payment_type:PAY[pay],items:items()});}});
 $('#f').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),sc=shipCost(ship,S),total=r2(S+sc);
  {const nm=String(f.get('name')).trim().split(' ');set('user',{email:f.get('email'),name:nm[0],surname:nm.slice(1).join(' '),phone_number:f.get('phone')||undefined,gdpr_optin:!!f.get('optin'),email_optin:!!f.get('optin')});}
  set('order',{id:'BR-'+Date.now().toString(36).toUpperCase(),date:new Date().toISOString(),customer:{name:f.get('name'),email:f.get('email'),addr:f.get('addr'),city:f.get('city')},items:items(),ins:insItems(),sub:S,ship:sc,shipTier:SHIP[ship].n,tax:r2(total-total/1.21),total,payment:PAY[pay],tracked:false});
  set('cart',[]);set('cartSnap',null);location.href='confirmation.html';});
},

confirmation(){
 const o=get('order',null);if(!o){location.replace('index.html');return;}
 app.innerHTML=`<div class="ok">✓</div><h1>¡Gracias por tu compra, ${o.customer.name.split(' ')[0]}!</h1><p>Pedido <b>${o.id}</b>. Enviaremos la confirmación a ${o.customer.email}.</p>
 <div class="box">${o.items.map(i=>`<div class="tot"><span>${i.quantity}× ${i.item_name}</span><span>${eur(i.price*i.quantity)}</span></div>`).join('')}<div class="tot"><span>Envío (${o.shipTier})</span><span>${o.ship?eur(o.ship):'Gratis'}</span></div><div class="tot"><span>IVA incluido (21 %)</span><span>${eur(o.tax)}</span></div><div class="tot big"><span>Total pagado</span><span>${eur(o.total)}</span></div></div>
 <p class="mut">Enviar a: ${o.customer.addr}, ${o.customer.city} · Pago: ${o.payment}</p><a class="btn" href="index.html">Seguir comprando</a>`;
 if(!o.tracked){ev('purchase',{transaction_id:o.id,currency:'EUR',value:o.total,tax:o.tax,shipping:o.ship,items:o.items},{transaction:{order_id:o.id,total:o.total,items:o.ins}});o.tracked=true;set('order',o);}
}};
badge();pages[document.body.dataset.page]();
})();
