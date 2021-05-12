import SortingView from '../view/sorting.js';
import FilmCardsContainerView from '../view/film-cards-container.js';
import FilmListView from '../view/films-list.js';
import FilmsExtraListView from '../view/films-extra-list.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import EmptyFilmListView from '../view/empty-film-list.js';
// import UserProfile from '../view/user-profile';
import Sorting from '../view/sorting.js';

import { render, remove } from '../utils/render.js';
import { RenderPosition, FilmExtraListTitle, SortType, UserAction, UpdateType } from '../utils/const.js';
import { checkIfAllFilmsWithoutComments, sortByMostCommented, checkIfAllFilmsWithoutRating, sortByRating, sortByReleaseDate } from '../utils/util.js';
import { filter } from '../utils/filter.js';

import MoviePresenter from './movie.js';


const FILM_COUNT_PER_STEP = 5;
const NUMBER_OF_EXTRA_FILMS = 2;

export default class MoviesList {
  constructor(container, filmsModel, commentsModel, filterModel) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._container = container;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._sortingComponent = null;
    this._showMoreBtnComponent = null;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;

    this._filmCardsContainer = new FilmCardsContainerView();
    this._filmListComponent = new FilmListView();
    this._emptyFilmListComponent = new EmptyFilmListView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init () {
    this._renderFilmLists();
  }

  _getComments() {
    return this._commentsModel.getComments();
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

  _handleModeChange() {
    Object
      .values(this._filmCardPresenter)
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
    switch (actionType) {
      case UserAction.UPDATE://update film
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD://add comment
        this._commentsModel.addComment(updateType, update);
        // console.log(this._getComments());
        break;
      case UserAction.DELETE://delete comment
        // console.log(this._getComments());
        this._commentsModel.deleteComment(updateType, update);
        // console.log(this._getComments());
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
    switch (updateType) {//чистом виде PATCH не достаточен, т.к. любое изменение фильма влечет изменение экрана
      // case UpdateType.PATCH:
      //
      //   if(this._filmCardPresenter[data.id]) {
      //     this._filmCardPresenter[data.id].init(data);
      //   }
      //
      //   if (this._topRatedFilmCardPresenter[data.id]){
      //     this._topRatedFilmCardPresenter[data.id].init(data);
      //   }
      //
      //   if (this._mostCommentedFilmCardPresenter[data.id]) {
      //     this._mostCommentedFilmCardPresenter[data.id].init(data);
      //   }
      //
      //   break;
      case UpdateType.MINOR:
        if(this._filmCardPresenter[data.id]) {
          this._filmCardPresenter[data.id].init(data);
        }

        if (this._topRatedFilmCardPresenter[data.id]){
          this._topRatedFilmCardPresenter[data.id].init(data);
        }

        if (this._mostCommentedFilmCardPresenter[data.id]) {
          this._mostCommentedFilmCardPresenter[data.id].init(data);
        }
        this._clearFilmLists();
        this._renderFilmLists(); //при перерисовке возьмет новые данные у обновленной модели
        break;
      case UpdateType.MAJOR:
        this._clearFilmLists({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmLists();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmLists({resetRenderedFilmCount: true});
    this._renderFilmLists();
  }

  _renderSorting() {
    // console.log(this._sortingComponent);
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCardsContainer() {
    render(this._container, this._filmCardsContainer, RenderPosition.BEFOREEND);
  }

  _renderEmptyMovieList() {
    render(this._filmCardsContainer, this._emptyFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmCardContainer, movie) {
    const presenter = new MoviePresenter(filmCardContainer, this._getComments(), this._handleViewAction, this._handleModeChange);
    presenter.init(movie);
    return presenter;
  }

  _renderFilmListContainer() {
    render(this._filmCardsContainer, this._filmListComponent.getElement(), RenderPosition.AFTERBEGIN);
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

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  _renderFilms(films) {
    const filmLMainListContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    films.forEach((film) => {
      this._filmCardPresenter[film.id] = this._renderFilmCard(filmLMainListContainer, film);
    });
  }

  _renderFilmList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    this._renderFilms(films);

    if(filmCount > FILM_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedFilms() {
    const isAllFilmsWithoutRating = checkIfAllFilmsWithoutRating(this._getFilms());

    if (isAllFilmsWithoutRating) {
      return;
    }

    if (this._topRatedListComponent !== null) {
      this._topRatedListComponent = null;
    }

    const moviesSortByRating = sortByRating(this._getFilms());
    this._topRatedListComponent = new FilmsExtraListView(FilmExtraListTitle.TOP_RATED);
    render(this._filmCardsContainer, this._topRatedListComponent, RenderPosition.BEFOREEND);
    const extraListContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    moviesSortByRating
      .slice(0, NUMBER_OF_EXTRA_FILMS)
      .forEach((movie) => {
        this._topRatedFilmCardPresenter[movie.id] = this._renderFilmCard(extraListContainer, movie);
      });
  }

  _renderMostCommentedFilms() {
    const isAllFilmsWithoutComments = checkIfAllFilmsWithoutComments(this._getFilms());

    if (isAllFilmsWithoutComments) {
      return;
    }

    if (this._mostCommentedListComponent !== null) {
      this._mostCommentedListComponent = null;
    }

    const moviesSortByMostCommented = sortByMostCommented(this._getFilms());
    this._mostCommentedListComponent = new FilmsExtraListView(FilmExtraListTitle.MOST_COMMENTED);
    render(this._filmCardsContainer, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const extraListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    moviesSortByMostCommented
      .slice(0, NUMBER_OF_EXTRA_FILMS)
      .forEach((movie) => {
        this._mostCommentedFilmCardPresenter[movie.id] = this._renderFilmCard(extraListContainer, movie);
      });
  }

  _clearFilmLists({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._topRatedFilmCardPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._mostCommentedFilmCardPresenter)
      .forEach((presenter) => presenter.destroy());

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

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

    if(resetSortType) {
      this._currentSortType = Sorting.DEFAULT;
    }
  }


  _renderFilmLists() {

    if (!this._getFilms().length) {
      this._renderEmptyMovieList();
      return;
    }

    this._renderSorting();
    this._renderFilmCardsContainer();
    this._renderFilmListContainer();
    this._renderFilmList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
