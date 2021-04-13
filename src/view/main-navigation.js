const ALL_MOVIES_FILTER = 'All Movies';

const createFilterItemTemplate = ({ name, count }, isActive) => {

  return `
    <a href="#${name.toLowerCase()}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
    ${name === ALL_MOVIES_FILTER
    ? ALL_MOVIES_FILTER
    : `${name}<span class="main-navigation__item-count">${count}</span>`}
    </a>
  `;
};

export const createFiltersTemplate = (filters) => {
  const filterItemsTemplate = filters.
    map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
          ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};
