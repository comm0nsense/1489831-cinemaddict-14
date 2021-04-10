const createFilterItemTemplate = (filter) => {
  const { name, count } = filter;

  return ( //почему не будет работаь если убрать ()?
    `
    <a href="#${name}" class="main-navigation__item">${name}
    <span class="main-navigation__item-count">${count}</span></a>
    `
  );
};

export const createFiltersTemplate = (filters) => {
  const filterItemsTemaplate = filters.
    map((filter) => createFilterItemTemplate(filter)).join('');

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterItemsTemaplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
