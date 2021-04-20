import AbstractView from './abstract.js';

const ALL_MOVIES_FILTER = 'All Movies';

const createMainNavItemTemplate = ({ name, count }, isActive) => {

  return `
    <a href="#${name.toLowerCase()}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
    ${name === ALL_MOVIES_FILTER
    ? ALL_MOVIES_FILTER
    : `${name}<span class="main-navigation__item-count">${count}</span>`}
    </a>
  `;
};

const createMainNavTemplate = (filters) => {
  const filterItemsTemplate = filters.
    map((filter, index) => createMainNavItemTemplate(filter, index === 0)).join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
          ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};

export default class MainNav extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMainNavTemplate(this._filters);
  }
}
