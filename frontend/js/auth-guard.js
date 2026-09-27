(() => {
  const tokenKey='dreampath.auth.token';
  const token=sessionStorage.getItem(tokenKey);
  const page=location.pathname.split('/').pop() || 'index.html';
  if (!token) { if(page!=='index.html') location.replace('index.html'); return; }
  const logout=document.createElement('button'); logout.type='button'; logout.textContent='Sign out'; logout.className='nav-book'; logout.addEventListener('click',()=>{sessionStorage.removeItem(tokenKey);location.replace('index.html');}); document.querySelector('.nav')?.append(logout);
  fetch('/api/auth/me',{headers:{Authorization:`Bearer ${token}`}}).then(async response=>{
    if(!response.ok) throw new Error('Session expired');
    const me=await response.json();
    if(page==='admin-dashboard.html' && me.role!=='ADMIN') { location.replace('home.html'); return; }
    if(page==='index.html') { location.replace(me.role==='ADMIN'?'admin-dashboard.html':'home.html'); return; }
    document.documentElement.classList.add('authenticated');
    const nav=document.querySelector('.nav-links');
    if(nav && me.role==='ADMIN') { const li=document.createElement('li'); const a=document.createElement('a'); a.href='admin-dashboard.html'; a.textContent='Admin dashboard'; li.append(a); nav.append(li); }
  }).catch(()=>{sessionStorage.removeItem(tokenKey); if(page!=='index.html') location.replace('index.html');});
})();
