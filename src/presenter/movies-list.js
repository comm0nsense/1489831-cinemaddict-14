import SortingView from '../view/sorting.js';
import MoviesContainerView from '../view/movies-container.js';
import MoviesListView from '../view/movies-list.js';
import MoviesExtraListView from '../view/movies-extra-list.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import MovieCardView from '../view/movie-card.js';
import EmptyMovieListView from '../view/empty-movie-list.js';

import MovieDetailedCardView from '../view/movie-detailed-card.js';
import MovieCommentsView from '../view/movie-comments.js';

import { render, remove } from '../util/render.js';
import { RenderPosition, FilmExtraListTitle } from '../util/const.js';

// import MovieCardPresenter from './movie-card.js';

const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;
const EXTRA_LIST_MOVIES_COUNT = 0;

const classesToOpenDetailedFilmCard = [
  'film-card__poster',
  'film-card__comments',
  'film-card__title',
];

const siteBodyElement = document.querySelector('body');

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;
    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

    this._sortingComponent = new SortingView();
    this._filmsContainer = new MoviesContainerView();
    this._filmListComponent = new MoviesListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyMovieListComponent = new EmptyMovieListView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._popupCloseBtnClickHandler = this._popupCloseBtnClickHandler.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();

    this._renderFilmSection(movies);
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    render(this._container, this._filmsContainer, RenderPosition.BEFOREEND);
  }

  _renderEmptyMovieList() {
    render(this._filmsContainer, this._emptyMovieListComponent, RenderPosition.BEFOREEND);
  }

  _renderDetailedFilmCardComponent() {
    render(siteBodyElement, this._detailedFilmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderDetailedFilmCardCommentsComponent(movie) {
    const movieCommentsComponent = new MovieCommentsView(movie, this._comments);
    render(this._detailedFilmCardComponent.getElement().querySelector('.film-details__bottom-container'),
      movieCommentsComponent,
      RenderPosition.BEFOREEND,
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this._detailedFilmCardComponent); //будет undefined если вынести как метод класса если не сделать bind в конструкторе - посмотреть 4 лайв про это
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _popupCloseBtnClickHandler() {
    remove(this._detailedFilmCardComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _renderDetailedFilmCard(movie, evt) {
    const clickTarget = evt.target.classList.value;

    if (classesToOpenDetailedFilmCard.includes(clickTarget)) {
      siteBodyElement.classList.add('hide-overflow');
      this._detailedFilmCardComponent = new MovieDetailedCardView(movie);

      if (!siteBodyElement.querySelector('.film-details')) {
        this._renderDetailedFilmCardComponent();
        this._renderDetailedFilmCardCommentsComponent(movie);


        this._detailedFilmCardComponent.setCloseBtnClickHandler(this._popupCloseBtnClickHandler);
        document.addEventListener('keydown', this._escKeyDownHandler);
      }//проверяет есть ли уже карточка
    }//проверяет был ли клик по тому элементу, который открывает попап
  }//renderDetailedFilmCard

  _renderFilmCard(filmCardcontainer, movie) {
    const filmComponent = new MovieCardView(movie);
    render(filmCardcontainer, filmComponent, RenderPosition.BEFOREEND);

    filmComponent.setOpenDetailedFilmCardHandler((evt) => {
      this._renderDetailedFilmCard(movie, evt);
      // const filmDetailedCardPresenter = new MovieCardPresenter(movie, this._comments);
      // filmDetailedCardPresenter.init(movie, evt);

    });
  }

  _renderFilmListContainer() {
    render(this._filmsContainer, this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _handleShowMoreBtnClick() {
    this._movies//как тут упросить?
      .slice(this._numberOfMoviesRendered, this._numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movie));//getElement - потому что не render где уже есть getElement

    this._numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (this._numberOfMoviesRendered >= this._movies.length) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtnComponent() {
    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);

  }

  _renderFilmList(movies) {
    this._renderFilmListContainer();

    for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
      this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movies[i]);
    }

    if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
      this._renderShowMoreBtnComponent();
    }
  }

  _renderFilmExtraList(extraListTitle, movies) {
    const extraListComponent = new MoviesExtraListView(extraListTitle); //как иначе можно передать extraListTitle??
    render(this._filmsContainer, extraListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
      this._renderFilmCard(extraListComponent.getElement().querySelector('.films-list__container'), movies[i]);
    }
  }

  _renderTopRatedFilms(movies) {
    const isAllFilmsWithoutRating = movies
      .every((movie) => parseFloat(movie.totalRating) === EXTRA_LIST_MOVIES_COUNT);

    if (!isAllFilmsWithoutRating) {
      const moviesSortByRating = [...movies].sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
      this._renderFilmExtraList(FilmExtraListTitle.TOP_RATED, moviesSortByRating);
    }
  }

  _renderMostCommentedFilms(movies) {
    const isAllFilmsWithoutComments = movies
      .every((movie) => parseFloat(movie.movieCommentsIds.length) === EXTRA_LIST_MOVIES_COUNT);

    if (!isAllFilmsWithoutComments) {
      const moviesSortByMostComments = [...movies].sort((a, b) => parseFloat(b.movieCommentsIds.length) - parseFloat(a.movieCommentsIds.length));
      this._renderFilmExtraList(FilmExtraListTitle.MOST_COMMENTED, moviesSortByMostComments);
    }
  }


  _renderFilmSection(movies) {

    if (!movies.length) {
      this._renderEmptyMovieList();
    } else {
      this._renderSorting();
      this._renderFilmsContainer();
      this._renderFilmList(movies);
      this._renderTopRatedFilms(movies);
      this._renderMostCommentedFilms(movies);
    }
  }

}
