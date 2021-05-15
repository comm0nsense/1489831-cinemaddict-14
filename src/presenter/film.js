import FilmCardView from '../view/film-card';
import {remove, render, replace } from '../utils/render';
import {RenderPosition} from '../utils/const';
import FilmPopupView from '../view/film-popup';

const siteBodyElement = document.querySelector('body'); //вынести в константу?

export default class Film {
  constructor(filmListContainer, commentsData) {
    this._filmListContainer = filmListContainer;
    this._commentsData = commentsData;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);

    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__poster');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__title');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__comments');

    if (prevFilmCardComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmCardComponent.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleFilmCardClick() {
    this._renderFilmPopup();
  }

  _renderFilmPopup() {
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmPopupComponent = new FilmPopupView(this._film, this._commentsData);
    this._filmPopupComponent.setCloseBtnClickHandler(this._handleCloseBtnClick);

    if (prevFilmPopupComponent === null) {
      render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
      siteBodyElement.classList.add('hide-overflow');
      document.addEventListener('keydown', this._onEscKeyDownHandler);

      return;
    }

    if (this._filmPopupComponent.getElement().contains(prevFilmPopupComponent.getElement())){
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmPopupComponent);
  }

  _handleCloseBtnClick() {
    this._closeFilmPopup();
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmPopup();
    }
  }

  _closeFilmPopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }
}
