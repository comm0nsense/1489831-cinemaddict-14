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
import {filter} from '../utils/filter';
import CommentsModel from '../model/comments';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA_LIST = 2;

export default class Board {
  constructor(boardContainer, filmsModel, filterModel) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._commentsModel = new CommentsModel();

    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmPopupPresenter = null;
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


  }

  init() {

    this._renderBoard();

    this._renderExtraFilms();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearMainList({resetRenderedFilmCount: true, resetSortType: true});
    this._clearExtraLists();

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByReleaseDate);
      case SortType.RATING:
        return sortByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainList({resetRenderedFilmCount: true});
    this._renderBoard();
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

    if (this._filmPopupPresenter) {
      this._filmPopupPresenter.destroyPopup();
      this._filmPopupPresenter = null;
    }
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
    switch (actionType) {
      case UserAction.UPDATE:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE:
        this._commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD:
        this._commentsModel.addComment(updateType, update);
        break;
    }
  }

  _handleModelEventPatch(data) {
    if (this._mainListFilmPresenter[data.id]) {
      this._mainListFilmPresenter[data.id].init(data);
    }

    if (this._topRatedListFilmPresenter[data.id]) {
      this._topRatedListFilmPresenter[data.id].init(data);
    }

    if (this._mostCommentedListFilmPresenter[data.id]) {
      this._mostCommentedListFilmPresenter[data.id].init(data);
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
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleModelEventPatch(data);
        break;
      case UpdateType.MINOR:
        this._clearMainList({resetRenderedFilmCount: true});
        this._renderBoard();

        this._renderExtraFilms();

        this._renderPopupFilm();
        break;
      case UpdateType.MAJOR:
        this._clearMainList({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();

        this._renderExtraFilms();
        this._renderPopupFilm();
        break;
    }
  }

  _renderEmptyList() {
    render(this._boardContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard (container, film) {

    const filmPresenter =  new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);

    return filmPresenter;
  }

  _renderFilms(films) {
    const mainListContainer = this._mainListComponent.getElement().querySelector('.films-list__container');
    films.forEach((film) => {
      this._mainListFilmPresenter[film.id] = this._renderFilmCard(mainListContainer, film);
    });
  }

  _clearMainList({resetRenderedFilmCount = true, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => {

        if (presenter.isPopupMode()){
          this._filmPopupPresenter = presenter;
        }

        presenter.destroy();

      });

    this._mainListFilmPresenter = {};
    remove(this._sortingComponent);
    remove(this._showMoreBtnComponent);

    this._renderedFilmCount = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmCount, this._renderedFilmCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearExtraLists() {
    const presenters = [
      ...Object.values(this._topRatedListFilmPresenter),
      ...Object.values(this._mostCommentedListFilmPresenter),
    ];

    presenters.forEach((presenter) => {

      if (presenter.isPopupMode()){
        this._filmPopupPresenter = presenter;
      }

      presenter.destroy();

    });

    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
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

  _renderMainList(films) {
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
    const topRatedFilms = sortByRating(this._filmsModel.getFilms());
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._topRatedListFilmPresenter[film.id] = this._renderFilmCard(topRatedListContainer, film);
      });
  }

  _renderMostCommentedList() {
    render(this._boardContainerComponent, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const mostCommentedListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(this._filmsModel.getFilms());
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._mostCommentedListFilmPresenter[film.id] = this._renderFilmCard(mostCommentedListContainer, film);
      });
  }

  _renderBoard() {
    const films = this._getFilms();

    if (!films.length) {
      render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);
      this._renderEmptyList();
      return;
    }

    if (this._emptyListComponent) {
      remove(this._emptyListComponent);
    }

    this._renderMainList(films);
  }

  _renderExtraFilms() {
    this._clearExtraLists();

    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderPopupFilm() {
    if (!this._filmPopupPresenter) {
      return;
    }

    const popupFilm = this._filmsModel.getFilms().find((film) => film.id === this._filmPopupPresenter.getFilmId());

    if (!popupFilm) {
      return;
    }

    this._filmPopupPresenter.init(popupFilm);
  }
}
