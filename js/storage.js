(function(){
  const PREFIX='zenn-nova:';
  const LEGACY_PREFIX='zenn-tjkt:';
  // One-way migration keeps previous browser data without deleting the original keys.
  try { const legacyKeys = []; for (let i = 0, count = localStorage.length; i < count; i++) { const key = localStorage.key(i); if (key && key.startsWith(LEGACY_PREFIX)) legacyKeys.push(key); } for (const key of legacyKeys) { const next = PREFIX + key.slice(LEGACY_PREFIX.length); if (localStorage.getItem(next) === null) localStorage.setItem(next, localStorage.getItem(key)); } } catch (e) { console.warn('Local storage migration was skipped', e); }
  const safeParse=(raw,fallback)=>{try{return raw===null?fallback:JSON.parse(raw)}catch{return fallback}};
  const store={
    get(key,fallback){try{return safeParse(localStorage.getItem(PREFIX+key),fallback)}catch{return fallback}},
    set(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true}catch(e){console.error('LocalStorage unavailable',e);return false}},
    remove(key){try{localStorage.removeItem(PREFIX+key);return true}catch{return false}},
    reset(){try{Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).forEach(k=>localStorage.removeItem(k));return true}catch{return false}},
    keys(){try{return Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).map(k=>k.slice(PREFIX.length))}catch{return []}}
  };
  const icons={
    overview:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    dashboard:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
    calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 19h2m4 0h2"/>',
    network:'<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M10.7 7.5 6.3 16.3M13.3 7.5l4.4 8.8M8 19h8"/>',
    router:'<rect x="3" y="8" width="18" height="10" rx="2"/><path d="M7 8V5m10 3V5M7 13h.01M11 13h.01M15 13h.01M7 18v3m10-3v3"/>',
    terminal:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/>',
    cloud:'<path d="M7 18a5 5 0 1 1 .6-9.96A7 7 0 0 1 21 11.5 3.5 3.5 0 0 1 18 18Z"/>',
    workflow:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><path d="M9 6h6M18 9v6M6 9v9h9"/>',
    cable:'<path d="M7 7V3m10 4V3M5 7h14v5a7 7 0 0 1-14 0Z"/><path d="M12 19v3"/>',
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Zm0 0v16"/><path d="M8 7h8m-8 4h7"/>',
    quiz:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h3m2 0h3m-8 4h8"/>',
    file:'<path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h5M8 13h8m-8 4h8"/>',
    notes:'<path d="M5 3h14v18H5zM8 7h8m-8 4h8m-8 4h5"/><path d="M16 17v4"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    theme:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    collapse:'<path d="m15 18-6-6 6-6"/>',
    star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    server:'<rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6h.01M8 17h.01M12 6h5m-5 11h5"/>',
    cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 9h6v6H9z"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2m-11 0 1 15h12l1-15M10 10v7m4-7v7"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
    plus:'<path d="M12 5v14M5 12h14"/>'
  };
  const icon=(name,cls='')=>`<svg class="icon${cls?' '+cls:''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]||icons.info}</svg>`;
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast=(title,message='',kind='success')=>{const region=document.getElementById('toastRegion');if(!region)return;const el=document.createElement('div');el.className='toast '+(kind==='error'?'error':kind==='warning'?'warning':'');el.innerHTML=`<span class="toast-mark"></span><div><strong>${esc(title)}</strong>${message?`<p>${esc(message)}</p>`:''}</div>`;region.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(6px)';setTimeout(()=>el.remove(),220)},3400)};
  const copy=async(text)=>{try{await navigator.clipboard.writeText(String(text));toast('Berhasil disalin','Isi sudah masuk ke clipboard.')}catch{const ta=document.createElement('textarea');ta.value=String(text);ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Berhasil disalin','Isi sudah masuk ke clipboard.')}catch{toast('Gagal menyalin','Browser tidak mengizinkan akses clipboard.','error')}ta.remove()}};
  const confirm=({title='Konfirmasi',message='Lanjutkan tindakan ini?',actionText='Lanjutkan',danger=false}={})=>new Promise(resolve=>{const dlg=document.getElementById('confirmDialog');if(!dlg){resolve(window.confirm(message));return}document.getElementById('confirmTitle').textContent=title;document.getElementById('confirmMessage').textContent=message;const btn=document.getElementById('confirmAction');btn.textContent=actionText;btn.className='btn '+(danger?'btn-danger':'btn-primary');const done=(e)=>{dlg.removeEventListener('close',closed);resolve(dlg.returnValue==='confirm')};const closed=()=>done();dlg.addEventListener('close',closed,{once:true});dlg.showModal()});
  const formatDate=(value)=>{try{return new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value))}catch{return String(value)}};
  const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  window.Zenn={store,icon,esc,toast,copy,confirm,formatDate,uid};
})();
