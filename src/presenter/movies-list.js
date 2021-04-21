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

import { generateComments} from '../mock/movie.js';

const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;
const EXTRA_LIST_MOVIES_COUNT = 0;
const TOTAL_COMMENTS = 125;
const classesToOpenDetailedFilmCard = [
  'film-card__poster',
  'film-card__comments',
  'film-card__title',
];

const comments = generateComments(TOTAL_COMMENTS);
// const commentsIds = generateArrayOfCommentsIds(comments);

const siteBodyElement = document.querySelector('body');

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;

    this._sortingComponent = new SortingView();
    this._filmsContainer = new MoviesContainerView();
    this._filmListComponent = new MoviesListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyMovieListComponent = new EmptyMovieListView();
  }

  init(movies, comments) {
    this._movies = movies.slice();

    this._renderFilmSection(movies);
  }

  _renderSorting() {
    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsContainer() {
    render(this._container, this._filmsContainer, RenderPosition.BEFOREEND);
  }

  _renderDetailedFilmCard(movie, evt) {
    const clickTarget = evt.target.classList.value;

    if (classesToOpenDetailedFilmCard.includes(clickTarget)) {

      siteBodyElement.classList.add('hide-overflow');
      const detailedFilmCardComponent = new MovieDetailedCardView(movie);

      if (!siteBodyElement.querySelector('.film-details')) {
        render(siteBodyElement, detailedFilmCardComponent, RenderPosition.BEFOREEND);
        const commentsContainer = detailedFilmCardComponent.getElement().querySelector('.film-details__bottom-container');
        const movieCommentsComponent = new MovieCommentsView(movie, comments);
        console.log('должны начать рисовать комменты - как из сюда передать??');
        render(commentsContainer, movieCommentsComponent, RenderPosition.BEFOREEND);

        const closeDetailedFilmCard = () => {
          remove(detailedFilmCardComponent);
          siteBodyElement.classList.remove('hide-overflow');
          document.removeEventListener('keydown', onEscKeyDown);
        };

        const onEscKeyDown = (evt) => {
          if (evt.key === 'Escape' || evt.key === 'Esc') {
            evt.preventDefault();
            closeDetailedFilmCard();
          }
        };

        const onPopupCloseBtnClick = () => {
          closeDetailedFilmCard();
        };

        detailedFilmCardComponent.setCloseBtnClickHandler(onPopupCloseBtnClick);
        document.addEventListener('keydown', onEscKeyDown);
      }
    }
  }

  _renderFilmCard(container, movie) {
    const filmComponent = new MovieCardView(movie);
    render(container, filmComponent, RenderPosition.BEFOREEND);

    filmComponent.setOpenDetailedFilmCardHandler((evt) => {
      this._renderDetailedFilmCard(movie, evt);
    });
  }

  _renderFilmListContainer() {
    render(this._filmsContainer, this._filmListComponent.getElement(), RenderPosition.BEFOREEND);
  }

  _renderShowMoreBtnComponent() {

    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);

    let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

    this._showMoreBtnComponent.setClickHandler(() => {
      this._movies
        .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
        .forEach((movie) => this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movie));

      numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

      if (numberOfMoviesRendered >= this._movies.length) {
        remove(this._showMoreBtnComponent);
      }
    });

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

  _renderEmptyMovieList() {
    render(this._filmsContainer, this._emptyMovieListComponent, RenderPosition.BEFOREEND);
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
