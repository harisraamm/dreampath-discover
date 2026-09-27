(() => {
  const list = document.querySelector('.trip-list');
  if (!list) return;

  const normalize = value => String(value || '').trim().toLowerCase();
  const stateFor = tour => {
    const state = normalize(tour.state).replace(/[^a-z]/g, '');
    if (state === 'kerala' || state === 'tamilnadu') return state;
    const destination = normalize(tour.destination);
    if (destination.includes('kerala')) return 'kerala';
    if (destination.includes('tamil')) return 'tamilnadu';
    return '';
  };

  fetch('/api/tours')
    .then(response => {
      if (!response.ok) throw new Error('Trip packages are unavailable.');
      return response.json();
    })
    .then(tours => {
      const existingTitles = new Set(
        [...list.querySelectorAll('.trip-row h2')].map(heading => normalize(heading.textContent))
      );
      const filter = document.querySelector('.filter.active')?.dataset.filter || 'all';

      tours.forEach(tour => {
        const state = stateFor(tour);
        const titleKey = normalize(tour.title);
        if (!state || !titleKey || existingTitles.has(titleKey)) return;
        existingTitles.add(titleKey);

        const row = document.createElement('a');
        row.className = 'trip-row admin-trip-row';
        row.dataset.type = state;
        row.href = `tour-detail.html?id=${encodeURIComponent(tour.id)}`;
        row.hidden = filter !== 'all' && filter !== state;

        const image = document.createElement('img');
        DreampathTourImages.bind(image, DreampathTourImages.sources(tour));
        image.alt = tour.title;

        const copy = document.createElement('div');
        const eyebrow = document.createElement('p');
        eyebrow.className = 'eyebrow';
        const region = state === 'kerala' ? 'KERALA' : 'TAMIL NADU';
        eyebrow.textContent = `${region}${tour.destination ? ` · ${tour.destination}` : ''}${tour.durationDays ? ` · ${tour.durationDays} DAYS` : ''}`;
        const heading = document.createElement('h2');
        heading.textContent = tour.title;
        const description = document.createElement('p');
        description.textContent = tour.description || '';
        copy.append(eyebrow, heading, description);

        const meta = document.createElement('div');
        meta.className = 'trip-meta';
        const price = document.createElement('strong');
        price.textContent = `From ₹${Number(tour.price).toLocaleString('en-IN')}`;
        const link = document.createElement('span');
        link.className = 'arrow-link';
        link.textContent = 'View journey →';
        meta.append(price, link);

        row.append(image, copy, meta);
        list.append(row);
      });
    })
    .catch(() => {});
})();
