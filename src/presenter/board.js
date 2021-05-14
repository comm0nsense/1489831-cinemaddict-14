import FilmsBoardView from '../view/films-board';
import MainListView from '../view/main-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import ExtraListView from '../view/extra-list';
import {ExtraListTitles, RenderPosition} from '../utils/const';
import {remove, render} from '../utils/render';
import FilmCardView from '../view/film-card';
import ShowMoreBtnView from '../view/show-more-btn';
import { sortByMostCommented, sortByRating} from '../utils/film';
import FilmPopupView from '../view/film-popup';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA_LIST = 2;

const siteBodyElement = document.querySelector('body'); //вынести в константу?

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardContainerComponent = new FilmsBoardView();//section.films
    this._sortingComponent = new SortingView();//ul.sor
    this._mainListComponent = new MainListView();//section.films-list
    this._emptyListComponent = new EmptyListView();
    this._topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    this._showMoreBtnComponent =  new ShowMoreBtnView();

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
  }

  init(boardFilms, commentsData) {
    this._boardFilms = boardFilms.slice();
    this._commentsData = commentsData.slice();
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);
    this._boardElement = this._boardContainer.querySelector('.films');

    this._renderBoard();
  }

  _renderEmptyList() {
    render(this._boardElement, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard (container, film) {

    const filmCardComponent = new FilmCardView(film);

    filmCardComponent.setFilmCardClickHandler( () => {
      this._renderFilmPopup(film);
    }, '.film-card__poster');

    filmCardComponent.setFilmCardClickHandler ( ()  => {
      this._renderFilmPopup(film);
    }, '.film-card__title');

    filmCardComponent.setFilmCardClickHandler(() => {
      this._renderFilmPopup(film);
    }, '.film-card__comments');

    render(container, filmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmPopup(film) {
    const filmPopupComponent = new FilmPopupView(film, this._commentsData);

    filmPopupComponent.setCloseBtnClickHandler(() => {
      // evt.preventDefault(); //??
      remove(filmPopupComponent);
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        remove(filmPopupComponent);
        siteBodyElement.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    render(siteBodyElement, filmPopupComponent, RenderPosition.BEFOREEND);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);
  }

  _renderFilms(from ,to) {
    const mainListContainer = this._mainListComponent.getElement().querySelector('.films-list__container');
    this._boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this._renderFilmCard(mainListContainer, boardFilm));
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
    render(this._boardContainerComponent, this._mainListComponent, RenderPosition.BEFOREEND);
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
      .forEach((film) => this._renderFilmCard(topRatedListContainer, film));
  }

  _renderMostCommentedList() {
    render(this._boardContainerComponent, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const mostCommentedListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(this._boardFilms);
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => this._renderFilmCard(mostCommentedListContainer, film));
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
  }
}
