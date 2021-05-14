import FilmCardView from '../view/film-card';
import {remove, render} from '../utils/render';
import {RenderPosition} from '../utils/const';
import FilmPopupView from '../view/film-popup';

const siteBodyElement = document.querySelector('body'); //вынести в константу?

export default class Film {
  constructor(filmListContainer, commentsData) {
    this._filmListContainer = filmListContainer;
    this._commentsData = commentsData;

    this._filmCardComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);
  }

  init(film) {
    this._film = film;

    this._filmCardComponent = new FilmCardView(film);

    render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__poster');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__title');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__comments');
  }

  _handleFilmCardClick() {
    this._renderFilmPopup();//комментарии
  }

  _renderFilmPopup() {
    this._filmPopupComponent = new FilmPopupView(this._film, this._commentsData);
    this._filmPopupComponent.setCloseBtnClickHandler(this._handleCloseBtnClick);
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDownHandler);
  }

  _handleCloseBtnClick() {
    remove(this._filmPopupComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDownHandler);
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(this._filmPopupComponent);
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._onEscKeyDownHandler);
    }
  }
}
