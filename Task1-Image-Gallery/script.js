(() => {
  // DOM refs
  const gallery = document.getElementById('gallery');
  const items = Array.from(document.querySelectorAll('.gallery .item'));
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lbClose');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  // State
  let currentIndex = -1; // index among visible items

  // Helpers
  function getVisibleItems() {
    return items.filter(i => !i.classList.contains('hidden'));
  }

  function openLightbox(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (index + visible.length) % visible.length;
    const fig = visible[currentIndex];
    const img = fig.querySelector('img');
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = fig.querySelector('figcaption')?.textContent || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    // focus close for keyboard users
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImage.src = '';
    currentIndex = -1;
  }

  function showNext() { openLightbox(currentIndex + 1); }
  function showPrev() { openLightbox(currentIndex - 1); }

  // Event wiring for items (click to open)
  gallery.addEventListener('click', (e) => {
    const fig = e.target.closest('.item');
    if (!fig) return;
    const visible = getVisibleItems();
    const idx = visible.indexOf(fig);
    if (idx === -1) return;
    openLightbox(idx);
  });

  // Buttons
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  lbClose.addEventListener('click', () => closeLightbox());

  // Close when clicking backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowRight') showNext();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'Escape') closeLightbox();
    }
  });

  // Filters
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      // update active class
      filterButtons.forEach(b => b.classList.toggle('active', b === btn));

      items.forEach(i => {
        const cat = i.dataset.category || '';
        if (filter === 'all' || filter === cat) {
          i.classList.remove('hidden');
        } else {
          i.classList.add('hidden');
        }
      });
    });
  });

  // Accessibility: tab to images shows outline, space/enter opens
  items.forEach(i => {
    i.setAttribute('tabindex', '0');
    i.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const visible = getVisibleItems();
        const idx = visible.indexOf(i);
        if (idx !== -1) openLightbox(idx);
      }
    });
  });

  // Optional: Preload images when opening (small optimization)
  lbImage.addEventListener('load', () => {
    // nice to have for transitions; could be extended
  });

})();
