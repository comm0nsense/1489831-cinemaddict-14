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

const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;
const EXTRA_LIST_MOVIES_COUNT = 0;

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;

    this._sortingComponent = new SortingView();
    this._filmsContainer = new MoviesContainerView();
    this._filmListComponent = new MoviesListView();
    // this._filmExtraListComponent = new MoviesExtraListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyMovieListComponent = new EmptyMovieListView();
  }

  init(movies) {
    this._movies = movies.slice();

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsContainer, RenderPosition.BEFOREEND);

    this._renderFilmSection(movies);
  }

  _renderFilmCard(container, movie) {
    const filmComponent = new MovieCardView(movie);
    render(container, filmComponent, RenderPosition.BEFOREEND);

    // filmComponent.setOpenDetailedFilmCardHandler((evt) => {
    // renderDetailedFilmCard(movie, evt);
    // });
  }

  _renderFilmList(movies) {
    render(this._filmsContainer, this._filmListComponent.getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
      this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movies[i]);
    }

    if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
      render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
      let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

      const onShowMoreBtnClick = () => {
        movies
          .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
          .forEach((movie) => this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), movie));

        numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

        if (numberOfMoviesRendered >= movies.length) {
          remove(this._showMoreBtnComponent);
        }
      };

      this._showMoreBtnComponent.setClickHandler(onShowMoreBtnClick);
    }
  }

  _renderFilmExtraList(extraListTitle, movies) {
    const extraListComponent = new MoviesExtraListView(extraListTitle);
    render(this._filmsContainer, extraListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
      this._renderFilmCard(extraListComponent.getElement().querySelector('.films-list__container'), movies[i]);
    }
  }

  _renderFilmSection(movies) {

    if (!movies.length) {
      render(this._filmsContainer, this._emptyMovieListComponent, RenderPosition.BEFOREEND);
    } else {
      this._renderFilmList(movies);

      const isAllFilmsWithoutRating = movies
        .every((movie) => parseFloat(movie.totalRating) === EXTRA_LIST_MOVIES_COUNT);

      if (!isAllFilmsWithoutRating) {
        const moviesSortByRating = [...movies].sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
        this._renderFilmExtraList(FilmExtraListTitle.TOP_RATED, moviesSortByRating);
      }

      const isAllFilmsWithoutComments = movies
        .every((movie) => parseFloat(movie.movieCommentsIds.length) === EXTRA_LIST_MOVIES_COUNT);

      if (!isAllFilmsWithoutComments) {
        const moviesSortByMostComments = [...movies].sort((a, b) => parseFloat(b.movieCommentsIds.length) - parseFloat(a.movieCommentsIds.length));
        this._renderFilmExtraList(FilmExtraListTitle.MOST_COMMENTED, moviesSortByMostComments);
      }
    }
  }
}
