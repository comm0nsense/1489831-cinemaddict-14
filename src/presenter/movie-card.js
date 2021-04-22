
import MovieDetailedCardView from '../view/movie-detailed-card.js';
import MovieCommentsView from '../view/movie-comments.js';

import { RenderPosition } from '../util/const.js';
import { render, remove } from '../util/render.js';

const classesToOpenDetailedFilmCard = [
  'film-card__poster',
  'film-card__comments',
  'film-card__title',
];

const siteBodyElement = document.querySelector('body');

export default class MovieCard {
  constructor(movie, comments) {
    this._movie = movie;
    this._comments = comments;

    this._detailedFilmCardComponent = new MovieDetailedCardView(movie);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._popupCloseBtnClickHandler = this._popupCloseBtnClickHandler.bind(this);
  }

  init(movie, evt) {
    this._renderDetailedFilmCard(movie, evt);
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

      if (!siteBodyElement.querySelector('.film-details')) {
        this._renderDetailedFilmCardComponent();
        this._renderDetailedFilmCardCommentsComponent(movie);


        this._detailedFilmCardComponent.setCloseBtnClickHandler(this._popupCloseBtnClickHandler);
        document.addEventListener('keydown', this._escKeyDownHandler);
      }//проверяет есть ли уже карточка
    }//проверяет был ли клик по тому элементу, который открывает попап
  }//renderDetailedFilmCard

}
