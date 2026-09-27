(() => {
  const tokenKey = 'dreampath.auth.token';
  const token = () => sessionStorage.getItem(tokenKey);
  const headers = () => ({ Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' });
  const form = document.querySelector('#tour-form');
  const msg = document.querySelector('#message');
  const fields = ['destination', 'state', 'title', 'price', 'duration', 'imagePath', 'description', 'accommodationDetails', 'foodDetails', 'facilities'];
  let selectedTour = null;
  let editingAvailability = true;

  function inferState(destination = '') {
    const value = String(destination).toLowerCase();
    if (value.includes('kerala')) return 'kerala';
    if (value.includes('tamil')) return 'tamilnadu';
    return '';
  }

  async function request(url, options = {}) {
    const multipart = options.body instanceof FormData;
    let response;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        response = await fetch(url, { cache: 'no-store', ...options, headers: { Authorization: `Bearer ${token()}`, ...(multipart ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) } });
        if (![502, 503, 504].includes(response.status) || attempt === 4) break;
      } catch (error) {
        if (attempt === 4) throw new Error('Could not reach the tour service. Check that Docker services are running, then reload.');
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
    if (!response.ok) {
      const body = await response.text();
      let message = body || `Request failed (${response.status}).`;
      try { message = JSON.parse(body).message || JSON.parse(body).error || message; } catch {}
      throw new Error(message);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  function renderImages(tour) {
    selectedTour = tour;
    const manager = document.querySelector('#image-manager');
    manager.hidden = !tour;
    const coverPreview = document.querySelector('#cover-preview');
    const coverImage = document.querySelector('#cover-image');
    const coverCaption = document.querySelector('#cover-caption');
    coverPreview.hidden = !tour;
    if (tour) {
      coverImage.hidden = false;
      DreampathTourImages.bind(coverImage, DreampathTourImages.sources(tour));
      coverImage.alt = `${tour.title} current cover`;
      coverCaption.textContent = tour.images?.length ? 'Current cover: first uploaded photo' : 'Current cover: the image URL in the form above';
    }
    document.querySelector('#image-upload').value = '';
    const list = document.querySelector('#image-list');
    list.replaceChildren();
    (tour?.images || []).forEach((url, index) => {
      const card = document.createElement('article'); card.className = 'image-card';
      const image = document.createElement('img'); image.src = url; image.alt = `${tour.title} photo ${index + 1}`;
      const caption = document.createElement('p'); caption.textContent = `Photo ${index + 1}`;
      const controls = document.createElement('div'); controls.className = 'image-controls';
      const button = (label, action, disabled = false) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.disabled = disabled; b.onclick = action; controls.append(b); };
      button('Move left', () => moveImage(index, -1), index === 0);
      button('Move right', () => moveImage(index, 1), index === tour.images.length - 1);
      button('Remove', () => removeImage(index));
      card.append(image, caption, controls); list.append(card);
    });
    if (!tour?.images?.length) list.textContent = 'No package photos uploaded yet.';
  }

  async function moveImage(index, delta) {
    const images = [...selectedTour.images]; [images[index], images[index + delta]] = [images[index + delta], images[index]];
    try { renderImages(await request(`/api/tours/${selectedTour.id}/images`, { method: 'PUT', body: JSON.stringify(images) })); }
    catch (error) { msg.textContent = error.message; }
  }

  async function removeImage(index) {
    if (!confirm('Remove this photo from the package?')) return;
    try { renderImages(await request(`/api/tours/${selectedTour.id}/images/${index}`, { method: 'DELETE' })); msg.textContent = 'Photo removed.'; }
    catch (error) { msg.textContent = error.message; }
  }

  document.querySelector('#image-upload').addEventListener('change', async event => {
    const files = [...event.target.files];
    if (!selectedTour || !files.length) return;
    try {
      for (const file of files) {
        const data = new FormData(); data.append('file', file);
        selectedTour = await request(`/api/tours/${selectedTour.id}/images`, { method: 'POST', body: data, headers: { Authorization: `Bearer ${token()}` } });
      }
      renderImages(selectedTour); msg.textContent = `${files.length} photo${files.length === 1 ? '' : 's'} uploaded.`;
    } catch (error) { msg.textContent = error.message; }
  });

  async function load() {
    const box = document.querySelector('#tour-table');
    try {
      const tours = (await request('/api/tours/admin')).filter(tour => tour.available);
      if (!tours.length) { box.textContent = 'No journeys yet.'; return; }
      const table = document.createElement('table'), head = document.createElement('thead'), header = document.createElement('tr');
      ['Journey', 'Destination', 'Price', 'Status', 'Actions'].forEach(value => { const th = document.createElement('th'); th.textContent = value; header.append(th); });
      head.append(header); table.append(head); const body = document.createElement('tbody');
      tours.forEach(tour => {
        const row = document.createElement('tr');
        [tour.title, tour.destination, `₹${Number(tour.price).toLocaleString('en-IN')}`, tour.available ? 'Active' : 'Inactive'].forEach(value => { const td = document.createElement('td'); td.textContent = value; row.append(td); });
        const td = document.createElement('td'), actions = document.createElement('div'); actions.className = 'admin-actions';
        const edit = document.createElement('button'); edit.textContent = 'Edit'; edit.onclick = () => {
          document.querySelector('#tour-id').value = tour.id;
          editingAvailability = tour.available;
          fields.forEach(field => {
            const value = field === 'duration' ? (tour.durationDays ?? '') : (tour[field] ?? '');
            document.querySelector('#' + field).value = field === 'state' && !value ? inferState(tour.destination) : value;
          });
          document.querySelector('#form-heading').textContent = 'Edit journey'; renderImages(tour); window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        const photos = document.createElement('button'); photos.textContent = 'Manage photos'; photos.onclick = () => { renderImages(tour); document.querySelector('#image-manager').scrollIntoView({ behavior: 'smooth' }); };
        const remove = document.createElement('button'); remove.textContent = tour.available ? 'Delete' : 'Restore'; remove.onclick = async () => {
          const action = tour.available ? 'remove from public listings and delete its uploaded photos' : 'restore to public listings';
          if (!confirm(`${tour.available ? 'Remove' : 'Restore'} “${tour.title}” ${action}?`)) return;
          remove.disabled = true; remove.textContent = tour.available ? 'Deleting…' : 'Restoring…';
          try {
            if (tour.available) await request(`/api/tours/admin/${tour.id}`, { method: 'DELETE' });
            else await request(`/api/tours/${tour.id}`, { method: 'PUT', body: JSON.stringify({ ...tour, available: true }) });
            if (selectedTour?.id === tour.id) renderImages(null);
            msg.textContent = tour.available ? `“${tour.title}” was removed from public listings.` : `“${tour.title}” was restored.`;
            await load(); msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (error) { remove.disabled = false; remove.textContent = tour.available ? 'Delete' : 'Restore'; msg.textContent = `Could not update “${tour.title}”: ${error.message}`; msg.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        };
        actions.append(edit, photos, remove); td.append(actions); row.append(td); body.append(row);
      });
      table.append(body); box.replaceChildren(table);
    } catch (error) { box.textContent = error.message; }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault(); msg.textContent = 'Saving…';
    const id = document.querySelector('#tour-id').value, payload = {};
    fields.forEach(field => payload[field] = document.querySelector('#' + field).value);
    payload.imagePath = DreampathTourImages.clean(payload.imagePath);
    payload.price = Number(payload.price); payload.durationDays = Number(payload.duration); delete payload.duration; payload.available = id ? editingAvailability : true;
    try {
      await request(id ? `/api/tours/${id}` : '/api/tours', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      msg.textContent = 'Journey saved.'; form.reset(); document.querySelector('#tour-id').value = ''; document.querySelector('#form-heading').textContent = 'Add a journey'; renderImages(null); await load();
    } catch (error) { msg.textContent = error.message; }
  });
  document.querySelector('#cancel-edit').onclick = () => { form.reset(); document.querySelector('#tour-id').value = ''; editingAvailability = true; document.querySelector('#form-heading').textContent = 'Add a journey'; renderImages(null); };
  load();
})();
