// Data (add images for each category)


const PRODUCTS = [
  {code:'CK101', img:'assets/img_CK101.jpg', name:'Gà rán giòn', desc:'Miếng gà rán giòn rụm', price:49000, cat:'ga-ran', img:'assets/garan.jpg'},
  {code:'CK102', img:'assets/img_CK102.jpg', name:'Gà rán cay', desc:'Vị cay Hàn Quốc', price:52000, cat:'ga-ran', img:'assets/gasotcay.webp'},
  {code:'CK103', img:'assets/img_CK103.jpg', name:'Combo gà 2 miếng', desc:'Kèm khoai + nước', price:109000, cat:'ga-ran', img:'assets/combo2mieng.jpg'},

  {code:'PZ201', img:'assets/img_PZ201.jpg', name:'Pizza phô mai', desc:'Đế mỏng, phô mai kéo sợi', price:129000, cat:'pizza', img:'assets/pizzaphomai.webp'},
  {code:'PZ202', img:'assets/img_PZ202.jpg', name:'Pizza hải sản', desc:'Tôm mực sốt kem', price:159000, cat:'pizza', img:'assets/pizzahaisan.webp'},
  {code:'PZ203', img:'assets/img_PZ203.jpg', name:'Pizza bò BBQ', desc:'Bò nướng sốt BBQ', price:149000, cat:'pizza', img:'assets/pizzabo.webp'},

  {code:'BG301', img:'assets/img_BG301.jpg', name:'Burger bò', desc:'Bánh mềm, bò nướng', price:59000, cat:'burger-com-my', img:'assets/burgerbo.jpg'},
  {code:'BG302', img:'assets/img_BG302.jpg', name:'Cơm gà sốt teriyaki', desc:'Kèm salad', price:65000, cat:'burger-com-my', img:'assets/comga.jpg'},
  {code:'BG303', img:'assets/img_BG303.jpg', name:'Mỳ Ý sốt bò bằm', desc:'Đậm đà vị Ý', price:69000, cat:'burger-com-my', img:'assets/myy.jpg'},

  {code:'SN401', img:'assets/img_SN401.jpg', name:'Khoai tây chiên', desc:'Vừa giòn vừa thơm', price:29000, cat:'thuc-an-nhe', img:'assets/khoaitay.webp'},
  {code:'SN402', img:'assets/img_SN402.jpg', name:'Gà viên', desc:'Ăn chơi lai rai', price:39000, cat:'thuc-an-nhe', img:'assets/gavienchien.jpg'},
  {code:'SN403', img:'assets/img_SN403.jpg', name:'Bánh hành', desc:'Siêu cuốn miệng', price:25000, cat:'thuc-an-nhe', img:'assets/banhhanh.jpg'},

  {code:'SD501', img:'assets/img_SD501.jpg', name:'Pepsi 330ml', desc:'Uống lạnh ngon hơn', price:15000, cat:'mon-an-kem', img:'assets/pepsi.webp'},
  {code:'SD502', img:'assets/img_SD502.jpg', name:'7Up 330ml', desc:'Thanh mát', price:15000, cat:'mon-an-kem', img:'assets/7up.webp'},
  {code:'SD503', img:'assets/img_SD503.jpg', name:'Nước suối', desc:'0 kcal', price:12000, cat:'mon-an-kem', img:'assets/nuocsuoi.jpg'},
];

const CATS = [
  {id:'ga-ran', title:'Gà rán'},
  {id:'pizza', title:'Pizza'},
  {id:'burger-com-my', title:'Burger • Cơm • Mỳ Ý'},
  {id:'thuc-an-nhe', title:'Thức ăn nhẹ'},
  {id:'mon-an-kem', title:'Món ăn kèm'}
];

const money = n => n.toLocaleString('vi-VN')+'đ';
function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); renderCartBadge(); }

function renderMenu(){
  const root = document.getElementById('menuRoot');
  root.innerHTML = CATS.map(cat=>{
    const items = PRODUCTS.filter(p=>p.cat===cat.id).map(p=>card(p)).join('');
    return `
      <section id="${cat.id}">
        <h2 class="section-title">🍽️ ${cat.title}</h2>
        <div class="grid">${items}</div>
      </section>
    `;
  }).join('');
}

function card(p){
  return `
  <article class="card">
    <div class="thumb"><img src="${p.img}" alt="${p.name}"></div>
    <div class="content">
      <div class="name">${p.name}</div>
      <div class="desc">${p.desc||''}</div>
      <div class="price">${money(p.price)}</div>
      <button class="add" onclick='addToCart("${p.code}")'>+ Thêm món</button>
    </div>
  </article>`;
}

function addToCart(code){
  const item = PRODUCTS.find(x=>x.code===code);
  if(!item) return;
  const cart = getCart();
  const idx = cart.findIndex(x=>x.code===code);
  if(idx>-1) cart[idx].qty += 1; else cart.push({code, name:item.name, price:item.price, qty:1});
  saveCart(cart); renderCartPanel();
}

function renderCartBadge(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = money(total);
  document.getElementById('panelTotal').textContent = money(total);
}

function renderCartPanel(){
  const cart = getCart();
  const list = document.getElementById('cartList');
  if(!cart.length){ list.innerHTML = '<div style="color:#64748b">Giỏ hàng trống.</div>'; return; }
  list.innerHTML = cart.map(i=>`
    <div style="display:flex;justify-content:space-between;gap:8px;margin:6px 0;align-items:center">
      <div style="flex:1">
        <div style="font-weight:700">${i.name}</div>
        <div style="font-size:13px;color:#64748b">${money(i.price)} × ${i.qty}</div>
      </div>
      <div style="font-weight:800">${money(i.price*i.qty)}</div>
      <button title="Giảm 1" onclick='dec("${i.code}")' class="btn-mini">−</button>
      <button title="Tăng 1" onclick='inc("${i.code}")' class="btn-mini">+</button>
    </div>
  `).join('');
  renderCartBadge();
}

function inc(code){
  const cart = getCart();
  const it = cart.find(x=>x.code===code); if(!it) return;
  it.qty++; saveCart(cart); renderCartPanel();
}
function dec(code){
  let cart = getCart();
  const it = cart.find(x=>x.code===code); if(!it) return;
  it.qty--; if(it.qty<=0) cart = cart.filter(x=>x.code!==code);
  saveCart(cart); renderCartPanel();
}

document.getElementById('cartBtn').addEventListener('click', ()=>{
  document.getElementById('cartBox').classList.toggle('open');
});

renderMenu(); renderCartBadge(); renderCartPanel();
