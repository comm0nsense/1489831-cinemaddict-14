import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import PopupCommentsView from '../view/popup-comments.js';
import { RenderPosition } from '../util/const.js';
import { render, remove } from '../util/render.js';

const classesToOpenPopup = [
  'film-card__poster',
  'film-card__comments',
  'film-card__title',
];

const siteBodyElement = document.querySelector('body');

export default class Movie {
  constructor(filmsCardsContainer, comments) {
    this._filmCardsContainer = filmsCardsContainer;
    this._comments = comments;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._popupCloseBtnClickHandler = this._popupCloseBtnClickHandler.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
  }

  init(movie) {
    this._movie = movie;

    this._filmCardComponent = new FilmCardView(this._movie);

    render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);

    this._filmCardComponent.setOpenFilmPopupHandler(this._handleFilmCardClick);
  }

  _handleFilmCardClick(evt) {
    this._renderFilmPopup(this._movie, evt);
  }

  _renderFilmPopupDesc() {
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmPopupComments(movie) {
    const popupCommentsComponent = new PopupCommentsView(movie, this._comments);
    render(this._filmPopupComponent.getElement().querySelector('.film-details__bottom-container'),
      popupCommentsComponent,
      RenderPosition.BEFOREEND,
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this._filmPopupComponent); //будет undefined если вынести как метод класса если не сделать bind в конструкторе - посмотреть 4 лайв про это
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _popupCloseBtnClickHandler() {
    remove(this._filmPopupComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _renderFilmPopup(movie, evt) {
    const clickTarget = evt.target.classList.value;

    if (classesToOpenPopup.includes(clickTarget)) {
      siteBodyElement.classList.add('hide-overflow');
      this._filmPopupComponent = new FilmPopupView(movie);

      if (!siteBodyElement.querySelector('.film-details')) {
        this._renderFilmPopupDesc();
        this._renderFilmPopupComments(movie);


        this._filmPopupComponent.setCloseBtnClickHandler(this._popupCloseBtnClickHandler);
        document.addEventListener('keydown', this._escKeyDownHandler);
      }//проверяет есть ли уже карточка
    }//проверяет был ли клик по тому элементу, который открывает попап
  }//renderFilmPopup
}
