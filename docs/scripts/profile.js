// === Hồ sơ khách hàng ===
const API = window.API_BASE_URL || 'http://localhost:8080';

async function getCustomerById(id){
  const res = await fetch(`${API}/api/customers/${encodeURIComponent(id)}`);
  if(!res.ok) throw new Error('Get customer failed');
  return res.json();
}
async function createCustomer(body){
  const res = await fetch(`${API}/api/customers`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error('Create customer failed');
  return res.json();
}
async function updateCustomer(id, body){
  const res = await fetch(`${API}/api/customers/${encodeURIComponent(id)}`, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  if(!res.ok) throw new Error('Update customer failed');
  return res.json();
}

function loadProfileLocal(){
  try{ return JSON.parse(localStorage.getItem('profile')||'{}'); }
  catch{ return {}; }
}
function saveProfileLocal(pf){ localStorage.setItem('profile', JSON.stringify(pf)); }
function fillForm(pf){
  if(pf.fullName) document.getElementById('pfName').value = pf.fullName;
  if(pf.phone) document.getElementById('pfPhone').value = pf.phone;
  if(pf.address) document.getElementById('pfAddress').value = pf.address;
}

async function loadProfile(){
  const localPf = loadProfileLocal();
  if(localPf.customerNumber){
    try{
      const c = await getCustomerById(localPf.customerNumber);
      const merged = {
        customerNumber: c.customerNumber || localPf.customerNumber,
        fullName: c.customerName || localPf.fullName,
        phone: c.phone || localPf.phone,
        address: c.address || localPf.address
      };
      saveProfileLocal(merged);
      fillForm(merged);
      return;
    }catch(e){ console.warn('GET /api/customers/:id fail, use local', e); }
  }
  fillForm(localPf);
}

async function saveProfile(){
  const fullName = document.getElementById('pfName').value.trim();
  const phone = document.getElementById('pfPhone').value.trim();
  const address = document.getElementById('pfAddress').value.trim();
  if(!fullName || !phone || !address){ alert('Vui lòng nhập đủ thông tin'); return; }

  let pf = loadProfileLocal();
  try{
    if(pf.customerNumber){
      await updateCustomer(pf.customerNumber, { customerName: fullName, phone, address });
      pf = { ...pf, fullName, phone, address };
    }else{
      const created = await createCustomer({ customerName: fullName, phone, address });
      const customerNumber = created.customerNumber || Date.now();
      pf = { customerNumber, fullName, phone, address };
    }
    saveProfileLocal(pf);
    alert('Đã lưu hồ sơ!');
  }catch(e){
    console.warn('API /api/customers fail, save local only', e);
    pf = { ...pf, fullName, phone, address, customerNumber: pf.customerNumber || Date.now() };
    saveProfileLocal(pf);
    alert('Đã lưu hồ sơ (offline)');
  }
}

function renderHistory(){
  const root = document.getElementById('historyRoot');
  const orders = JSON.parse(localStorage.getItem('orders')||'[]');
  if(!orders.length){ root.innerHTML = '<p class="empty">Chưa có đơn hàng nào.</p>'; return; }
  const money = n => n.toLocaleString('vi-VN')+'đ';
  root.innerHTML = orders.map(o=>`
    <div class="hist-item">
      <div><strong>${o.id}</strong> • <small>${o.createdAt||''}</small></div>
      <div>Tổng: <strong>${money(o.total||0)}</strong> • Trạng thái: <strong>${o.status||'Processing'}</strong></div>
      <div><a href="orders.html">Xem chi tiết</a></div>
    </div>
  `).join('');
}

document.getElementById('savePf').addEventListener('click', saveProfile);
loadProfile();
renderHistory();
