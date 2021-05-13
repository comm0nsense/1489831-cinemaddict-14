import {createElement} from '../util';

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count } = filter;
  return (
    `<a href="#history"
      class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
    ${name}
    <span class="main-navigation__item-count ${name === 'All Movies' ? 'visually-hidden' : ''}">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index ===0))
    .join('');

  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">
        ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class Filter {
  constructor(filterItems) {
    this._element = null;
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createFilterTemplate(this._filterItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
