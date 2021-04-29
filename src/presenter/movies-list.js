import SortingView from '../view/sorting.js';
import FilmCardsContainerView from '../view/film-cards-container.js';
import FilmListView from '../view/films-list.js';
import FilmsExtraListView from '../view/films-extra-list.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import EmptyFilmListView from '../view/empty-film-list.js';

import { render, remove } from '../util/render.js';
import { RenderPosition, FilmExtraListTitle, SortType } from '../util/const.js';
import { updateItem } from '../util/common.js';
import { checkIfAllFilmsWithoutComments, sortByMostCommented, checkIfAllFilmsWithoutRating, sortByRating, sortByReleaseDate } from '../util/util';

import MoviePresenter from './movie.js';


const NUMBER_OF_MOVIES_TO_RENDER = 5;
const NUMBER_OF_EXTRA_FILMS = 2;

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;
    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._currentSortType = SortType.DEFAULT;

    this._sortingComponent = new SortingView();
    this._filmCardsContainer = new FilmCardsContainerView();
    this._filmListComponent = new FilmListView();
    this._extraListComponent = new FilmsExtraListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyFilmListComponent = new EmptyFilmListView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    // this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();

    this._sourcedMovies = movies.slice();

    this._renderFilmLists(this._movies);
  }

  // _handleModeChange() {
  //   Object
  //     .values(this._filmCardPresenter)
  //     .forEach((presenter) => presenter.resetView()); //должен удалять filmPopupComponent
  // }

  _handleFilmCardChange(updatedFilm) {
    // console.log(this._movies.find((prevFilm) => prevFilm.id === updatedFilm.id));
    this._movies = updateItem(this._movies, updatedFilm);//заменяет объекта фильма в моках на новый с изменениями
    // console.log(updatedFilm);
    this._sourcedMovies = updateItem(this._sourcedMovies, updatedFilm);

    if (this._filmCardPresenter[updatedFilm.id]) {
      this._filmCardPresenter[updatedFilm.id].init(updatedFilm);
    }

    if (this._topRatedFilmCardPresenter[updatedFilm.id]) {
      this._topRatedFilmCardPresenter[updatedFilm.id].init(updatedFilm);
    }

    if (this._mostCommentedFilmCardPresenter[updatedFilm.id]) {
      this._mostCommentedFilmCardPresenter[updatedFilm.id].init(updatedFilm);
    }
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._movies.sort(sortByReleaseDate);
        // console.log(this._movies);
        break;
      case SortType.RATING:
        this._movies = sortByRating(this._movies);
        // console.log(this._movies);
        break;
      default:
        this._movies = this._sourcedMovies.slice();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSorting() {
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
    const presenter = new MoviePresenter(filmCardContainer, this._comments, this._handleFilmCardChange, this._handleModeChange);//для каждой карточки передается _handleFilmCardChange метод
    presenter.init(movie);
    // this._filmCardPresenter[movie.id] = presenter;
    return presenter;
  }

  _renderFilmListContainer() {
    render(this._filmCardsContainer, this._filmListComponent.getElement(), RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreBtnClick() {
    this._movies
      .slice(this._numberOfMoviesRendered, this._numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => {
        // this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movie);
        const presenter = this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movie);
        this._filmCardPresenter[movie.id] = presenter;
      });

    this._numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (this._numberOfMoviesRendered >= this._movies.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderFilmList() {
    this._renderFilmListContainer();

    for (let i = 0; i < Math.min(this._movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
      // this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), this._movies[i]);
      const presenter = this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), this._movies[i]);
      this._filmCardPresenter[this._movies[i].id] = presenter;
    }

    if (this._movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedFilms() {
    const isAllFilmsWithoutRating = checkIfAllFilmsWithoutRating(this._movies);

    if (isAllFilmsWithoutRating === undefined) {
      return;
    }

    const moviesSortByRating = sortByRating(this._movies);
    this._extraListComponent = new FilmsExtraListView(FilmExtraListTitle.TOP_RATED); //как иначе можно передать extraListTitle??
    render(this._filmCardsContainer, this._extraListComponent, RenderPosition.BEFOREEND);
    moviesSortByRating
      .slice(0, NUMBER_OF_EXTRA_FILMS)
      .forEach((movie) => {
        const presenter = this._renderFilmCard(this._extraListComponent.getElement().querySelector('.films-list__container'), movie);
        this._topRatedFilmCardPresenter[movie.id] = presenter; //ключ - movie id, значение - instance презентера карточки фильма
        // this._renderFilmCard(
        //   this._extraListComponent.getElement().querySelector('.films-list__container'),
        //   movie);
      });
  }

  _renderMostCommentedFilms() {
    const isAllFilmsWithoutComments = checkIfAllFilmsWithoutComments(this._movies);

    if (isAllFilmsWithoutComments === undefined) {
      return;
    }

    const moviesSortByMostCommented = sortByMostCommented(this._movies);
    this._extraListComponent = new FilmsExtraListView(FilmExtraListTitle.MOST_COMMENTED);
    render(this._filmCardsContainer, this._extraListComponent, RenderPosition.BEFOREEND);

    moviesSortByMostCommented
      .slice(0, NUMBER_OF_EXTRA_FILMS)
      .forEach((movie) => {
        const presenter = this._renderFilmCard(this._extraListComponent.getElement().querySelector('.films-list__container'), movie);
        this._mostCommentedFilmCardPresenter[movie.id] = presenter; //ключ - movie id, значение - instance презентера карточки фильма
        // this._renderFilmCard(
        //   this._extraListComponent.getElement().querySelector('.films-list__container'),
        //   movie);
      });
  }

  _clearFilmList() {
    Object
      .values(this._filmCardPresenter)
      .forEach((presenter) => presenter.destroy());

    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;
    this._filmCardPresenter = {};
    remove(this._showMoreBtnComponent);
  }


  _renderFilmLists() {

    if (!this._movies.length) {
      this._renderEmptyMovieList();
    } else {
      this._renderSorting();
      this._renderFilmCardsContainer();
      this._renderFilmList();
      this._renderTopRatedFilms();
      this._renderMostCommentedFilms();
    }
  }
}
