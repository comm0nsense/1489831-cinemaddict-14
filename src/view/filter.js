import AbstractView from './abstract';

const createFilterItemTemplate = (filter, currentType) => {
  const {type, name, count } = filter;
  return (
    `<a href="${name.toLowerCase()}" id="${type}"
      class="main-navigation__item ${type === currentType ? 'main-navigation__item--active' : ''}">
    ${name}
    <span class="main-navigation__item-count ${name === 'All Movies' ? 'visually-hidden' : ''}">${count}</span></a>`
  );
};

const createFilterTemplate = (filterItems, currentType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentType))
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

export default class Filter extends AbstractView {
  constructor(filterItems, currentType) {
    super();
    this._filterItems = filterItems;
    this._currentType = currentType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filterItems, this._currentType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.id);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
