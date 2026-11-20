(() => {
  const grid = document.querySelector('#shop-grid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.product-card')];
  const originalOrder = [...cards];
  const search = document.querySelector('#product-search');
  const clearSearch = document.querySelector('#search-clear');
  const sort = document.querySelector('#product-sort');
  const filters = [...document.querySelectorAll('.filter-button')];
  const count = document.querySelector('#results-count');
  const empty = document.querySelector('#empty-state');
  const reset = document.querySelector('#reset-filters');
  const validCategories = new Set(filters.map((button) => button.dataset.filter));
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get('category') || 'all';
  let activeCategory = validCategories.has(requestedCategory) ? requestedCategory : 'all';

  if (params.get('q') && search) search.value = params.get('q');
  if (params.get('sort') && sort) sort.value = params.get('sort');

  const normalize = (value) => value.toLowerCase().trim();

  const update = (updateUrl = true) => {
    const query = normalize(search?.value || '');
    const visible = [];

    cards.forEach((card) => {
      const categories = card.dataset.categories.split(' ');
      const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
      const matchesQuery = !query || normalize(card.dataset.search).includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible.push(card);
    });

    const sortValue = sort?.value || 'featured';
    const sorted = [...cards].sort((a, b) => {
      if (sortValue === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortValue === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortValue === 'name') return a.dataset.title.localeCompare(b.dataset.title);
      return originalOrder.indexOf(a) - originalOrder.indexOf(b);
    });
    sorted.forEach((card) => grid.appendChild(card));

    filters.forEach((button) => {
      const active = button.dataset.filter === activeCategory;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`;
    if (empty) empty.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;
    if (clearSearch) clearSearch.hidden = !query;

    if (updateUrl) {
      const next = new URLSearchParams();
      if (activeCategory !== 'all') next.set('category', activeCategory);
      if (query) next.set('q', search.value.trim());
      if (sortValue !== 'featured') next.set('sort', sortValue);
      const queryString = next.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}`);
    }
  };

  filters.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    update();
  }));
  search?.addEventListener('input', () => update());
  sort?.addEventListener('change', () => update());
  clearSearch?.addEventListener('click', () => {
    search.value = '';
    search.focus();
    update();
  });
  reset?.addEventListener('click', () => {
    activeCategory = 'all';
    if (search) search.value = '';
    if (sort) sort.value = 'featured';
    update();
  });

  update(false);
  if (params.get('focus') === 'search') search?.focus();
})();
