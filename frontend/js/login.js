(() => {
  const tokenKey = 'dreampath.auth.token';
  const userForm = document.querySelector('#user-form');
  const adminForm = document.querySelector('#admin-form');
  const status = document.querySelector('#auth-status');
  const tabs = [...document.querySelectorAll('[data-mode]')];
  let mode = 'user';
  let requested = false;
  const localFileNotice = 'This page was opened as a local file, so it cannot reach the login API. Start the Dreampath Docker services and open http://localhost:4200.';
  const fetchError = error => location.protocol === 'file:' ? localFileNotice : (error.message === 'Failed to fetch' ? 'Could not reach the Dreampath login service. Make sure the Docker services are running, then reload this page.' : error.message);
  const responseError = (data, response, fallback) => data.detail || data.message || data.error_description || data.error || `${fallback} (HTTP ${response.status}).`;
  const stored = sessionStorage.getItem(tokenKey);
  if (stored) fetch('/api/auth/me', {headers:{Authorization:`Bearer ${stored}`}}).then(r => r.ok ? r.json() : null).then(me => { if (me) location.replace(me.role === 'ADMIN' ? 'admin-dashboard.html' : 'home.html'); }).catch(()=>{});
  tabs.forEach(tab => tab.addEventListener('click', () => {
    mode = tab.dataset.mode;
    tabs.forEach(t => t.classList.toggle('active', t === tab));
    userForm.hidden = mode !== 'user'; adminForm.hidden = mode !== 'admin';
    status.textContent = ''; requested = false;
    document.querySelector('#otp-step').hidden = true;
    document.querySelector('#user-submit').textContent = 'Send sign-in code';
    document.querySelector('#auth-title').textContent = mode === 'user' ? 'Welcome back' : 'Admin sign in';
    document.querySelector('#auth-description').textContent = mode === 'user' ? 'Sign in to explore thoughtful journeys through South India.' : 'Manage the journeys offered on Dreampath Discover.';
  }));
  userForm.addEventListener('submit', async event => {
    event.preventDefault(); status.textContent = 'Please wait…';
    const contact = document.querySelector('#contact').value.trim();
    const button = document.querySelector('#user-submit'); button.disabled = true;
    try {
      const url = requested ? '/api/auth/otp/verify' : '/api/auth/otp/request';
      const body = requested ? {contact, code:document.querySelector('#otp-code').value.trim()} : {contact};
      const response = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(responseError(data, response, 'Could not complete sign in'));
      if (!requested) { requested = true; document.querySelector('#otp-step').hidden = false; document.querySelector('#otp-code').required = true; button.textContent='Verify code and continue'; status.textContent=`Code sent by ${data.deliveryMethod === 'SMS' ? 'SMS' : 'email'} to ${data.maskedContact}.`; document.querySelector('#otp-code').focus(); }
      else { sessionStorage.setItem(tokenKey,data.accessToken); location.replace('home.html'); }
    } catch (error) { status.textContent = fetchError(error); }
    finally { button.disabled = false; }
  });
  adminForm.addEventListener('submit', async event => {
    event.preventDefault(); status.textContent='Please wait…';
    try {
      const response=await fetch('/api/auth/admin-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.querySelector('#admin-email').value.trim(),password:document.querySelector('#admin-password').value})});
      const data=await response.json().catch(()=>({})); if(!response.ok) throw new Error(responseError(data, response, 'Admin sign-in failed'));
      sessionStorage.setItem(tokenKey,data.accessToken); location.replace('admin-dashboard.html');
    } catch(error) { status.textContent=fetchError(error); }
  });
})();
