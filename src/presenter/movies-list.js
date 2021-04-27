import SortingView from '../view/sorting.js';
import FilmCardsContainerView from '../view/film-cards-container.js';
import FilmListView from '../view/films-list.js';
import FilmsExtraListView from '../view/films-extra-list.js';
import ShowMoreBtnView from '../view/show-more-btn.js';
import EmptyFilmListView from '../view/empty-film-list.js';

import { render, remove } from '../util/render.js';
import { RenderPosition, FilmExtraListTitle } from '../util/const.js';
import { updateItem } from '../util/common.js';

import MoviePresenter from './movie.js';


const NUMBER_OF_MOVIES_TO_RENDER = 5;
const NUMBER_OF_EXTRA_FILMS = 2;
const NUMBER_OF_MOVIES_TO_MEET_CRITERIA = 0;

export default class MoviesList {
  constructor(container) { //mainSiteComponent
    this._container = container;
    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._sortingComponent = new SortingView();
    this._filmCardsContainer = new FilmCardsContainerView();
    this._filmListComponent = new FilmListView();
    this._extraListComponent = new FilmsExtraListView();
    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._emptyFilmListComponent = new EmptyFilmListView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(movies, comments) {
    this._movies = movies.slice();//нужен ли тут slice??
    this._comments = comments.slice();

    this._renderFilmLists(this._movies);
  }

  _handleModeChange() {

    if (this._filmCardPresenter) {
      Object
        .values(this._filmCardPresenter)
        .forEach((presenter) => presenter.resetView());
    }
  }

  _handleFilmCardChange(updatedFilm) {
    //в моках, в массиве фильмов меняем данные в объекте фильма, на котором пользователь
    //что-то кликнул.
    console.log(this._movies.find((prevFilm) => prevFilm.id === updatedFilm.id));
    this._movies = updateItem(this._movies, updatedFilm);//заменяет объекта фильма в моках на новый с изменениями
    console.log(updatedFilm);
    // Дальше в сохраненных ранее в FilmPresentere карточках по film.id находим карточку
    //в которой произошло изменение и вызываем метод init передавая туда
    //агрументом карточку чтобы она перерисовалась.
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
    const presenter = new MoviePresenter(filmCardcontainer, this._comments, this._handleFilmCardChange);//для каждой карточки передается _handleFilmCardChange метод
    // const filmCardPresenter = new MoviePresenter(filmCardcontainer, this._comments, this._handleFilmCardChange, this._handleModeChange);//для каждой карточки передается _handleFilmCardChange метод
    presenter.init(movie);
    return presenter;
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

  _renderShowMoreBtn() {
    render(this._filmListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
  }

  _renderFilmList() {
    this._renderFilmListContainer();

    for (let i = 0; i < Math.min(this._movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
      const presenter = this._renderFilmCard(this._filmListComponent.getElement().querySelector('.films-list__container'), this._movies[i]);
      this._filmCardPresenter[this._movies[i].id] = presenter;
    }

    if (this._movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedFilms() {
    const isAllFilmsWithoutRating = this._movies
      .every((movie) => parseFloat(movie.totalRating) === NUMBER_OF_MOVIES_TO_MEET_CRITERIA);

    if (!isAllFilmsWithoutRating) {
      const moviesSortByRating = [...this._movies].sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
      this._extraListComponent = new FilmsExtraListView(FilmExtraListTitle.TOP_RATED); //как иначе можно передать extraListTitle??
      render(this._filmCardsContainer, this._extraListComponent, RenderPosition.BEFOREEND);
      moviesSortByRating
        .slice(0, NUMBER_OF_EXTRA_FILMS)
        .forEach((movie) => {
          const presenter = this._renderFilmCard(this._extraListComponent.getElement().querySelector('.films-list__container'), movie);
          this._topRatedFilmCardPresenter[movie.id] = presenter; //ключ - movie id, значение - instance презентера карточки фильма
        });
    }
    // console.log(this._topRatedFilmCardPresenter);
  }

  _renderMostCommentedFilms() {
    const isAllFilmsWithoutComments = this._movies
      .every((movie) => parseFloat(movie.movieCommentsIds.length) === NUMBER_OF_MOVIES_TO_MEET_CRITERIA);

    if (!isAllFilmsWithoutComments) {
      const moviesSortByMostComments = [...this._movies].sort((a, b) => parseFloat(b.movieCommentsIds.length) - parseFloat(a.movieCommentsIds.length));
      this._extraListComponent = new FilmsExtraListView(FilmExtraListTitle.MOST_COMMENTED);
      render(this._filmCardsContainer, this._extraListComponent, RenderPosition.BEFOREEND);
      moviesSortByMostComments
        .slice(0, NUMBER_OF_EXTRA_FILMS)
        .forEach((movie) => {
          const presenter = this._renderFilmCard(this._extraListComponent.getElement().querySelector('.films-list__container'), movie);
          this._mostCommentedFilmCardPresenter[movie.id] = presenter; //ключ - movie id, значение - instance презентера карточки фильма
        });
    }
  }

  _clearFilmLists() {
    const presenterts = [
      ...Object.values(this._filmCardPresenter),
      ...Object.values(this._topRatedFilmCardPresenter),
      ...Object.values(this._mostCommentedFilmCardPresenter),
    ];

    presenterts.forEach((presenter) => presenter.destroy());
    this._numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;
    this._filmCardPresenter = {};
    remove(this._showMoreBtnComponent);
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};
    //нужно ли удалять контейнеры, куда отрисовываются списки фильмов?
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
      // this._clearFilmLists();
    }
  }

}
