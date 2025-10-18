// === Theo dõi đơn hàng ===
// API + local fallback
const API = window.API_BASE_URL || 'http://localhost:8080';
const money = n => n.toLocaleString('vi-VN')+'đ';

// Gọi danh sách đơn hàng
async function fetchOrdersFromAPI(customerNumber){
  let url = `${API}/api/orders`;
  if (customerNumber) url += `?customerNumber=${encodeURIComponent(customerNumber)}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Fetch orders failed');
  const list = await res.json();
  return list.map(o => ({
    id: String(o.orderNumber || o.id),
    createdAt: o.createdAt || '',
    fullName: o.fullName || o.customerName || '',
    phone: o.phone || '',
    address: o.address || '',
    items: o.items || [],
    subtotal: o.subtotal || 0,
    shipping: o.shipping || 15000,
    total: o.total || 0,
    status: o.status || 'Processing',
    customerNumber: o.customerNumber || null
  }));
}

// Cập nhật trạng thái
async function updateOrderStatusAPI(orderId, status){
  const res = await fetch(`${API}/api/orders/${encodeURIComponent(orderId)}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ status })
  });
  if(!res.ok) throw new Error('Update status failed');
  return res.json();
}

// Load đơn hàng
async function loadOrders(){
  const profile = JSON.parse(localStorage.getItem('profile')||'{}');
  const customerNumber = profile.customerNumber || null;
  try{
    const orders = await fetchOrdersFromAPI(customerNumber);
    localStorage.setItem('orders', JSON.stringify(orders));
    return orders;
  }catch(e){
    console.warn('API /api/orders fail, use local', e);
    return JSON.parse(localStorage.getItem('orders')||'[]');
  }
}

// Render danh sách
function renderList(orders){
  const root = document.getElementById('ordersRoot');
  if(!orders.length){
    root.innerHTML = '<p class="empty">Bạn chưa có đơn hàng nào.</p>';
    return;
  }
  root.innerHTML = orders.map(o=>{
    const badgeClass = ({
      'Processing':'processing',
      'Shipped':'shipped',
      'Delivered':'delivered',
      'Cancelled':'cancelled'
    })[o.status] || 'processing';

    const rows = (o.items||[]).map(i=>`
      <tr>
        <td>${i.name || i.productName || i.code}</td>
        <td>x${i.qty || i.quantity || 1}</td>
        <td>${money(i.price || i.unitPrice || 0)}</td>
        <td style="text-align:right">${money((i.price||i.unitPrice||0)*(i.qty||i.quantity||1))}</td>
      </tr>`).join('');

    return `
    <article class="order-card" data-id="${o.id}">
      <div class="order-head">
        <div><strong>Mã đơn:</strong> ${o.id} ${o.createdAt?`• <strong>Ngày:</strong> ${o.createdAt}`:''}</div>
        <div class="badge ${badgeClass}">${o.status}</div>
      </div>
      <div class="order-body">
        ${o.fullName?`<div><strong>Người nhận:</strong> ${o.fullName} ${o.phone?`• ${o.phone}`:''} ${o.address?`• ${o.address}`:''}</div>`:''}
        <table class="order-lines">
          <thead><tr><th>Món</th><th>SL</th><th>Đơn giá</th><th style="text-align:right">Thành tiền</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="display:flex;justify-content:flex-end;gap:16px;margin-top:8px">
          <div><strong>Tạm tính:</strong> ${money(o.subtotal||0)}</div>
          <div><strong>Ship:</strong> ${money(o.shipping||15000)}</div>
          <div><strong>Tổng:</strong> ${money(o.total||((o.subtotal||0)+(o.shipping||15000)))}</div>
        </div>
        <div class="actions">
          <button class="to-ship">Đánh dấu Shipped</button>
          <button class="to-deliver">Đánh dấu Delivered</button>
          <button class="to-cancel">Hủy đơn</button>
          <button class="to-menu" onclick="location.href='index.html'">← Về Menu</button>
        </div>
      </div>
    </article>`;
  }).join('');

  // Bind sự kiện
  root.querySelectorAll('.order-card').forEach(card=>{
    const id = card.getAttribute('data-id');
    async function setStatus(st){
      try{
        await updateOrderStatusAPI(id, st);
        const fresh = await loadOrders();
        renderList(fresh);
      }catch(e){
        console.warn('PUT /api/orders/:id fail, set local', e);
        const list = JSON.parse(localStorage.getItem('orders')||'[]');
        const idx = list.findIndex(x=>String(x.id)===String(id));
        if(idx>-1){ list[idx].status = st; localStorage.setItem('orders', JSON.stringify(list)); }
        renderList(list);
      }
    }
    card.querySelector('.to-ship')?.addEventListener('click', ()=>setStatus('Shipped'));
    card.querySelector('.to-deliver')?.addEventListener('click', ()=>setStatus('Delivered'));
    card.querySelector('.to-cancel')?.addEventListener('click', ()=>setStatus('Cancelled'));
  });
}

(async function init(){
  const orders = await loadOrders();
  renderList(orders);
})();
