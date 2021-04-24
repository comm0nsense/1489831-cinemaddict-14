import SortingView from '../view/sorting.js';
import FilmCardsContainerView from '../view/film-cards-container.js';
import FilmListView from '../view/films-list.js';
import FilmsExtraListView from '../view/films-extra-list.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import EmptyFilmListView from '../view/empty-film-list.js';

import { render, remove } from '../util/render.js';
import { RenderPosition, FilmExtraListTitle } from '../util/const.js';

import MoviePresenter from './movie.js';

const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;
const EXTRA_LIST_MOVIES_COUNT = 0;

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;
    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

    this._sortingComponent = new SortingView();
    this._filmCardsContainer = new FilmCardsContainerView();
    this._filmListComponent = new FilmListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyFilmListComponent = new EmptyFilmListView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();
    this._comments = comments.slice();

    this._renderFilmLists(movies);
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCardsContainer() {
    render(this._container, this._filmCardsContainer, RenderPosition.BEFOREEND);
  }

  _renderEmptyMovieList() {
    render(this._filmCardsContainer, this._emptyFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(filmCardcontainer, movie) {
    const filmCardPresenter = new MoviePresenter(filmCardcontainer, this._comments);
    filmCardPresenter.init(movie);
  }

  _renderFilmListContainer() {
    render(this._filmCardsContainer, this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
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
    const extraListComponent = new FilmsExtraListView(extraListTitle); //как иначе можно передать extraListTitle??
    render(this._filmCardsContainer, extraListComponent, RenderPosition.BEFOREEND);

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


  _renderFilmLists(movies) {

    if (!movies.length) {
      this._renderEmptyMovieList();
    } else {
      this._renderSorting();
      this._renderFilmCardsContainer();
      this._renderFilmList(movies);
      this._renderTopRatedFilms(movies);
      this._renderMostCommentedFilms(movies);
    }
  }

}
