import FilmsBoardView from '../view/films-board';
import MainListView from '../view/main-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import ExtraListView from '../view/extra-list';
import {ExtraListTitles, RenderPosition, SortType} from '../utils/const';
import {remove, render} from '../utils/render';
import ShowMoreBtnView from '../view/show-more-btn';
import { sortByMostCommented, sortByRating, sortByReleaseDate} from '../utils/film';
import FilmPresenter from './film';
import { updateItem } from '../utils/common';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA_LIST = 2;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._mainListFilmPresenter = {};
    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._boardContainerComponent = new FilmsBoardView();//section.films
    this._sortingComponent = new SortingView();//ul.sor
    this._mainListComponent = new MainListView();//section.films-list
    this._emptyListComponent = new EmptyListView();
    this._topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    this._showMoreBtnComponent =  new ShowMoreBtnView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(boardFilms, commentsData) {
    this._boardFilms = boardFilms.slice();
    this._sourcedBoardFilms = boardFilms.slice();
    this._commentsData = commentsData.slice();
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._renderSorting();
    render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);
    this._boardElement = this._boardContainer.querySelector('.films');

    this._renderBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardFilms.sort(sortByReleaseDate);
        break;
      case SortType.RATING:
        this._boardFilms = sortByRating(this._boardFilms);
        break;
      default:
        this._boardFilms = this._boardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearMainList();
    this._renderMainList();
  }

  _renderSorting() {
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  /**
   * Функция по изменению данных о фильме, которая передается в film-presenter фильма как changeData
   * @param {object}updatedFilm
   * @private
   */
  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._sourcedBoardFilms = updateItem(this._sourcedBoardFilms, updatedFilm);

    if (this._mainListFilmPresenter[updatedFilm.id]) {
      this._mainListFilmPresenter[updatedFilm.id].init(updatedFilm);
    }

    if (this._topRatedListFilmPresenter[updatedFilm.id]) {
      this._topRatedListFilmPresenter[updatedFilm.id].init(updatedFilm);
    }

    if (this._mostCommentedListFilmPresenter[updatedFilm.id]) {
      this._mostCommentedListFilmPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _renderEmptyList() {
    render(this._boardElement, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard (container, film) {
    const filmPresenter = new FilmPresenter(container, this._commentsData, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    return filmPresenter;
  }

  _renderFilms(from ,to) {
    const mainListContainer = this._mainListComponent.getElement().querySelector('.films-list__container');
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => {
        this._mainListFilmPresenter[boardFilm.id] = this._renderFilmCard(mainListContainer, boardFilm);
      });
  }

  _clearMainList() {
    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => presenter.destroy());

    this._mainListFilmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreBtnComponent);
  }

  _clearFilmLists() {
    const presenters = [
      ...Object.values(this._mainListFilmPresenter),
      ...Object.values(this._topRatedListFilmPresenter),
      ...Object.values(this._mostCommentedListFilmPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroy());

    this._mainListFilmPresenter = {};
    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreBtnComponent);
  }

  _handleShowMoreBtnClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._boardFilms.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn(){
    render(this._mainListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderMainList() {
    render(this._boardContainerComponent, this._mainListComponent, RenderPosition.AFTERBEGIN);
    this._renderFilms(0, Math.min(this._boardFilms.length, FILM_COUNT_PER_STEP));

    if (this._boardFilms.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedList() {
    render(this._boardContainerComponent, this._topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedListContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = sortByRating(this._boardFilms);
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._topRatedListFilmPresenter[film.id] = this._renderFilmCard(topRatedListContainer, film);
      });
  }

  _renderMostCommentedList() {
    render(this._boardContainerComponent, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const mostCommentedListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(this._boardFilms);
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._mostCommentedListFilmPresenter[film.id] = this._renderFilmCard(mostCommentedListContainer, film);
      });
  }

  _renderBoard() {

    if (!this._boardFilms.length) {
      remove(this._sortingComponent);
      this._renderEmptyList();
      return;
    }

    this._renderMainList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
    // this._clearFilmLists();
  }
}
