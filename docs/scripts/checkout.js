const money = n => n.toLocaleString('vi-VN')+'đ';
const SHIP = 15000;

function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
function setCart(x){ localStorage.setItem('cart', JSON.stringify(x)); }

function renderCartTable(){
  const cart = getCart();
  if(!cart.length){
    document.getElementById('cartTable').innerHTML = '<div class="muted">Giỏ hàng trống. Quay lại chọn món nhé.</div>';
    document.getElementById('payBtn').onclick = ()=>alert('Hộp đồ ăn của bạn đang trống');
    return;
  }
  const rows = cart.map(i=>`
    <tr>
      <td>${i.name}<div class="muted">x${i.qty}</div></td>
      <td style="text-align:right;font-weight:700">${money(i.price*i.qty)}</td>
    </tr>
  `).join('');
  document.getElementById('cartTable').innerHTML = `
    <table>
      <thead><tr><th>Món</th><th style="text-align:right">Thành tiền</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('subTotal').textContent = money(sub);
  document.getElementById('shipFee').textContent = money(SHIP);
  document.getElementById('grandTotal').textContent = money(sub+SHIP);
}

function showErr(el, msg){ el.style.display='block'; el.textContent=msg; }
function clearErr(el){ el.style.display='none'; }
function mark(input, bad){ input.style.borderColor = bad ? '#dc2626' : '#cbd5e1'; }

function checkout(){
  const cartNow = getCart();
  if(!cartNow.length){ alert('Hộp đồ ăn của bạn đang trống'); return; }

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const note = document.getElementById('note').value.trim();
  const pay = document.getElementById('pay').value;

  let ok = true;
  const en = document.getElementById('err-name');
  const ep = document.getElementById('err-phone');
  const ea = document.getElementById('err-address');
  mark(document.getElementById('name'), !name); (!name?showErr(en,'Bắt buộc'):clearErr(en)); if(!name) ok=false;
  mark(document.getElementById('phone'), !phone); (!phone?showErr(ep,'Bắt buộc'):clearErr(ep)); if(!phone) ok=false;
  mark(document.getElementById('address'), !address); (!address?showErr(ea,'Bắt buộc'):clearErr(ea)); if(!address) ok=false;
  if(!ok){ alert('Vui lòng điền thông tin'); return; }

  setCart([]);
  location.href='delivery.html';
}

document.getElementById('payBtn').addEventListener('click', checkout);
renderCartTable();
