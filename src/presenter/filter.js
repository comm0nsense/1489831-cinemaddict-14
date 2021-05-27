import FilterView from '../view/filter.js';
import { MenuItem, UpdateType, RenderPosition } from '../utils/const.js';
import { render, remove, replace } from '../utils/render.js';
import { filter } from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel, handleSiteMenuClick) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._handleSiteMenuClick = handleSiteMenuClick;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilters();
  }

  _renderFilters() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._handleSiteMenuClick(filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: MenuItem.ALL,
        name: 'All movies',
        count: filter[MenuItem.ALL](films).length,
      },
      {
        type: MenuItem.WATCHLIST,
        name: 'Watchlist',
        count: filter[MenuItem.WATCHLIST](films).length,
      },
      {
        type: MenuItem.HISTORY,
        name: 'History',
        count: filter[MenuItem.HISTORY](films).length,
      },
      {
        type: MenuItem.FAVORITES,
        name: 'Favorites',
        count: filter[MenuItem.FAVORITES](films).length,
      },
    ];
  }
}
