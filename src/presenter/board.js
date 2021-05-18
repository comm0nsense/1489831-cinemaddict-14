import FilmsBoardView from '../view/films-board';
import MainListView from '../view/main-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import ExtraListView from '../view/extra-list';
import {ExtraListTitle, RenderPosition, SortType, UpdateType, UserAction} from '../utils/const';
import {remove, render} from '../utils/render';
import ShowMoreBtnView from '../view/show-more-btn';
import { sortByMostCommented, sortByRating, sortByReleaseDate} from '../utils/film';
import FilmPresenter from './film';
// import { updateItem } from '../utils/common';
import {filter} from '../utils/filter';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA_LIST = 2;

export default class Board {
  constructor(boardContainer, filmsModel, commentsModel, filterModel) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._mainListFilmPresenter = {};
    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._boardContainerComponent = new FilmsBoardView();
    this._mainListComponent = new MainListView();
    this._emptyListComponent = new EmptyListView();
    this._topRatedListComponent = new ExtraListView(ExtraListTitle.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitle.MOST_COMMENTED);

    this._sortingComponent = null;
    this._showMoreBtnComponent = null;

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {

    this._renderBoard();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);
    console.log(filteredFilms);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByReleaseDate);
      case SortType.RATING:
        return sortByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _getComments() {
    return this._commentsModel.getComments();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainList({resetRenderedFilmCount: true});
    this._renderMainList();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  /**
   * Метод для обработки действий на представлении, т.е. обновляет модель данных
   * в зависимости от действий пользователя на View.
   * @param actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
   * @param updateType - тип изменений, нужно чтобы понять, что нужно обновить во View после обновления модели.
   * @param update - обновленные данные
   * @private
   */
  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    // this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);
    // Здесь будем вызывать обновление модели
    // if (this._mainListFilmPresenter[updatedFilm.id]) {
    //   this._mainListFilmPresenter[updatedFilm.id].init(updatedFilm);
    // }
    //
    // if (this._topRatedListFilmPresenter[updatedFilm.id]) {
    //   this._topRatedListFilmPresenter[updatedFilm.id].init(updatedFilm);
    // }
    //
    // if (this._mostCommentedListFilmPresenter[updatedFilm.id]) {
    //   this._mostCommentedListFilmPresenter[updatedFilm.id].init(updatedFilm);
    // }
    switch (actionType) {
      case UserAction.UPDATE:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  /**
   * Метод, который оповещает Presenter, что поменялись данные в модели.
   * Оповещение происходит через приватный метод _notify Observer-а в соответствующем методе Films Model.
   * Метод _notify наследуется Films Model от класса Observer.
   * @param updateType - В зависимости от типа изменений - PATCH/MINOR/MAJOR - решаем , что делать:
   * - PATCH: изменение одной карточки
   * - MINOR: изменение всего списка карточек целиком
   * - MAJOR: перерисовка всего экрана со списками фильмов
   * @param data - обновленные данные
   * @private
   */
  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._mainListFilmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this._clearMainList();
        this._clearExtraLists();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this._clearMainList({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _renderEmptyList() {
    render(this._boardContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard (container, film) {
    const filmPresenter = new FilmPresenter(container, this._getComments(), this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    return filmPresenter;
  }

  _renderFilms(films) {
    const mainListContainer = this._mainListComponent.getElement().querySelector('.films-list__container');
    // this._boardFilms
    //   .slice(from, to)
    films.forEach((film) => {
      this._mainListFilmPresenter[film.id] = this._renderFilmCard(mainListContainer, film);
    });
  }

  _clearMainList({resetRenderedFilmCount = true, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => presenter.destroy());

    this._mainListFilmPresenter = {};
    // this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._sortingComponent);
    remove(this._showMoreBtnComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }
  }

  _clearExtraLists() {
    const presenters = [
      ...Object.values(this._topRatedListFilmPresenter),
      ...Object.values(this._mostCommentedListFilmPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
  }

  _clearFilmLists({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    const presenters = [
      ...Object.values(this._mainListFilmPresenter),
      ...Object.values(this._topRatedListFilmPresenter),
      ...Object.values(this._mostCommentedListFilmPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._mainListFilmPresenter = {};
    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    remove(this._showMoreBtnComponent);
    //удаление компонента пустой лист?? Нужно??
    remove(this._sortingComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      // на случай если перерисовка списка вызвана
      // уменьшением количества фильмов (например, убираем из favorites/watchlist/watched
      // нужно скорректировать число показанных фильмов
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }
  }

  _handleShowMoreBtnClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn(){
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
    render(this._mainListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  _renderMainList() {
    const films = this._getFilms();
    const filmCount = films.length;

    this._renderSorting();

    render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);

    render(this._boardContainerComponent, this._mainListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedList() {
    render(this._boardContainerComponent, this._topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedListContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = sortByRating(this._getFilms());
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._topRatedListFilmPresenter[film.id] = this._renderFilmCard(topRatedListContainer, film);
      });
  }

  _renderMostCommentedList() {
    render(this._boardContainerComponent, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const mostCommentedListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(this._getFilms());
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._mostCommentedListFilmPresenter[film.id] = this._renderFilmCard(mostCommentedListContainer, film);
      });
  }

  _renderBoard() {

    if (!this._getFilms().length) {
      // remove(this._sortingComponent);
      render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);
      this._renderEmptyList();
      return;
    }

    this._renderMainList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
    // this._clearFilmLists();
  }
}
