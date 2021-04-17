import { createSiteElement } from '../util/util.js';

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

export default class MainNav {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getTemplate() {
    return createMainNavTemplate(this._filters);
  }

  getElement() {
    if(!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
