(() => {
  const fallback = 'images/kodaikanal/WhatsApp Image 2026-08-08 at 11.00.03 PM.jpeg';

  function clean(value) {
    if (typeof value !== 'string') return '';
    const path = value.trim().replace(/^["'](.*)["']$/, '$1').trim();
    if (!path || /^(?:[a-z]:[\\/]|\\\\|file:)/i.test(path)) return '';
    return path;
  }

  function sources(tour) {
    const uploaded = Array.isArray(tour?.images) ? tour.images : [];
    return [...new Set([...uploaded, tour?.imagePath, fallback].map(clean).filter(Boolean))];
  }

  function bind(image, list) {
    let index = 0;
    image.onerror = () => {
      index += 1;
      if (index < list.length) image.src = list[index];
      else image.hidden = true;
    };
    if (list.length) image.src = list[0];
    else image.hidden = true;
  }

  window.DreampathTourImages = { clean, sources, bind };
})();
