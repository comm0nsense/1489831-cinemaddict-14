import AbstractView from './abstract.js';
import {FilterType} from '../utils/const.js';

const ALL_MOVIES_FILTER = 'All Movies';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return `
    <a href="#${name.toLowerCase()}" id="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
    ${name === FilterType.ALL //all movies??
    ? ALL_MOVIES_FILTER
    : `${name}<span class="main-navigation__item-count">${count}</span>`}
    </a>
  `;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
          ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    this._callback.filterTypeChange(evt.target.id);
    // console.log(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
