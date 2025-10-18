// Admin CRUD sản phẩm
const API = window.API_BASE_URL || 'http://localhost:8080';
const money = n => Number(n||0).toLocaleString('vi-VN')+'đ';

const $ = sel => document.querySelector(sel);
const form = {
  code: $('#pCode'),
  name: $('#pName'),
  cat:  $('#pCat'),
  price:$('#pPrice'),
  stock:$('#pStock'),
  img:  $('#pImg'),
  desc: $('#pDesc')
};

const state = { products: [], filter: { q:'', cat:'' } };

// ===== API helpers (mềm dẻo theo backend) =====
function mapFromAPI(p){
  return {
    id: p.id ?? p.productId ?? p.code ?? p.productCode ?? null,
    code: p.code ?? p.productCode ?? '',
    name: p.name ?? p.productName ?? '',
    description: p.description ?? p.productDescription ?? '',
    category_code: p.category_code ?? p.categoryCode ?? p.category ?? '',
    price: Number(p.price ?? p.unitPrice ?? 0),
    stock: Number(p.stock ?? p.quantity ?? 0),
    image_url: p.image_url ?? p.imageUrl ?? p.image ?? ''
  };
}
function mapToAPI(input){
  // Body gửi cho POST/PUT (điều chỉnh tên field nếu backend yêu cầu khác)
  return {
    code: input.code,
    name: input.name,
    description: input.description,
    category_code: input.category_code,
    price: Number(input.price),
    stock: Number(input.stock || 0),
    image_url: input.image_url
  };
}

// ===== Fallback localStorage =====
const LS_KEY = 'PRODUCTS_ADMIN';
function loadLocal(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||'[]'); }catch{return []} }
function saveLocal(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }

// ===== CRUD via API with fallback =====
async function apiList(){
  try{
    const url = new URL(`${API}/api/products`);
    if(state.filter.q) url.searchParams.set('search', state.filter.q);
    if(state.filter.cat) url.searchParams.set('category', state.filter.cat);
    const res = await fetch(url);
    if(!res.ok) throw new Error('list failed');
    const data = await res.json();
    const mapped = Array.isArray(data) ? data.map(mapFromAPI) : [];
    saveLocal(mapped); // cache để offline
    return mapped;
  }catch(e){
    console.warn('API list fail, use local cache', e);
    return loadLocal();
  }
}

async function apiCreate(product){
  const body = mapToAPI(product);
  try{
    const res = await fetch(`${API}/api/products`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error('create failed');
    return await res.json();
  }catch(e){
    console.warn('API create fail, write local', e);
    // local fallback: push vào cache
    const list = loadLocal();
    list.push(product);
    saveLocal(list);
    return { message:'saved-local' };
  }
}

async function apiUpdate(idOrCode, product){
  const body = mapToAPI(product);
  const url1 = `${API}/api/products/${encodeURIComponent(idOrCode)}`; // PUT /:id
  try{
    let res = await fetch(url1, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if(!res.ok){
      // thử endpoint theo code khác, nếu backend mong đợi /by-code/:code
      const url2 = `${API}/api/products/by-code/${encodeURIComponent(idOrCode)}`;
      res = await fetch(url2, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    }
    if(!res.ok) throw new Error('update failed');
    return await res.json();
  }catch(e){
    console.warn('API update fail, update local', e);
    const list = loadLocal();
    const idx = list.findIndex(x=>x.code===idOrCode || String(x.id)===String(idOrCode));
    if(idx>-1){ list[idx] = {...list[idx], ...product}; saveLocal(list); }
    return { message:'updated-local' };
  }
}

async function apiDelete(idOrCode){
  try{
    let res = await fetch(`${API}/api/products/${encodeURIComponent(idOrCode)}`, { method:'DELETE' });
    if(!res.ok){
      const url2 = `${API}/api/products/by-code/${encodeURIComponent(idOrCode)}`;
      res = await fetch(url2, { method:'DELETE' });
    }
    if(!res.ok) throw new Error('delete failed');
    return await res.json();
  }catch(e){
    console.warn('API delete fail, delete local', e);
    const list = loadLocal().filter(x=>x.code!==idOrCode && String(x.id)!==String(idOrCode));
    saveLocal(list);
    return { message:'deleted-local' };
  }
}

// ===== UI =====
function clearForm(){
  form.code.value = '';
  form.name.value = '';
  form.cat.value = '';
  form.price.value = '';
  form.stock.value = '';
  form.img.value = '';
  form.desc.value = '';
  $('#btnSave').dataset.editing = '';
}

function fillFormFromRow(p){
  form.code.value = p.code||'';
  form.name.value = p.name||'';
  form.cat.value  = p.category_code||'';
  form.price.value= p.price||0;
  form.stock.value= p.stock||0;
  form.img.value  = p.image_url||'';
  form.desc.value = p.description||'';
  $('#btnSave').dataset.editing = p.code || p.id || '';
}

function row(p){
  return `
    <tr data-id="${p.id||''}" data-code="${p.code||''}">
      <td><code>${p.code||''}</code></td>
      <td>${p.name||''}</td>
      <td>${p.category_code||''}</td>
      <td>${money(p.price)}</td>
      <td>${p.stock ?? 0}</td>
      <td>${p.image_url?`<img src="${p.image_url}" alt="${p.name}">`:''}</td>
      <td class="actions-row">
        <button class="btn-outline btn-edit">Sửa</button>
        <button class="btn-outline btn-del">Xoá</button>
      </td>
    </tr>`;
}

function renderTable(){
  const tbody = $('#tbody');
  let list = state.products.slice();
  const q = (state.filter.q||'').toLowerCase();
  const cat = (state.filter.cat||'').trim();
  if(q){
    list = list.filter(x=> (x.name||'').toLowerCase().includes(q) || (x.code||'').toLowerCase().includes(q));
  }
  if(cat){ list = list.filter(x=> (x.category_code||'') === cat); }
  tbody.innerHTML = list.map(row).join('');

  // bind row actions
  tbody.querySelectorAll('tr').forEach(tr=>{
    const code = tr.getAttribute('data-code');
    const id   = tr.getAttribute('data-id') || code;
    const data = state.products.find(x=>x.code===code || String(x.id)===String(id));
    tr.querySelector('.btn-edit').addEventListener('click', ()=>fillFormFromRow(data));
    tr.querySelector('.btn-del').addEventListener('click', async ()=>{
      if(!confirm(`Xoá món ${data?.name||code}?`)) return;
      await apiDelete(code||id);
      await reload();
    });
  });
}

async function reload(){
  state.products = await apiList();
  renderTable();
}

// ===== events =====
$('#btnReload').addEventListener('click', reload);
$('#btnReset').addEventListener('click', clearForm);
$('#q').addEventListener('input', e=>{ state.filter.q = e.target.value; renderTable(); });
$('#catFilter').addEventListener('change', e=>{ state.filter.cat = e.target.value; renderTable(); });

$('#btnSave').addEventListener('click', async ()=>{
  const input = {
    code: (form.code.value||'').trim(),
    name: (form.name.value||'').trim(),
    category_code: (form.cat.value||'').trim(),
    price: Number(form.price.value||0),
    stock: Number(form.stock.value||0),
    image_url: (form.img.value||'').trim(),
    description: (form.desc.value||'').trim()
  };
  if(!input.code || !input.name || !input.category_code || !input.price){
    alert('Vui lòng nhập đủ Code / Tên / Danh mục / Giá');
    return;
  }
  const editingKey = $('#btnSave').dataset.editing;
  if(editingKey){
    await apiUpdate(editingKey, input);
  }else{
    await apiCreate(input);
  }
  await reload();
  clearForm();
});

// khởi động
reload();
