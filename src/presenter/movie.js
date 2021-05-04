import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { RenderPosition } from '../util/const.js';
import { render, remove, replace } from '../util/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const siteBodyElement = document.querySelector('body');

export default class Movie {
  constructor(filmsCardsContainer, commentsData, updateFilmCardData, changeMode) {

    this._filmCardsContainer = filmsCardsContainer;
    this._commentsData = commentsData;//через констуктори ли через init?
    this._updateFilmCardData = updateFilmCardData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._popupCloseBtnClickHandler = this._popupCloseBtnClickHandler.bind(this);
    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._filmComments = this._commentsData.filter(({ id }) => movie.movieCommentsIds.includes(id));
    // console.log(this._filmComments);

    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmCardComponent = new FilmCardView(this._movie);
    this._filmPopupComponent = new FilmPopupView(this._movie, this._filmComments);
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    if (!prevFilmCardComponent) {
      render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmCardsContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      remove(prevFilmPopupComponent);
      this._addPopupInfo();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmPopupComponent();
    }
  }

  _closeFilmPopupComponent() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._changeOverflow(false);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;
    this._renderFilmPopup();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _renderFilmPopup() {
    this._filmPopupComponent = new FilmPopupView(this._movie, this._filmComments);
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._addPopupInfo();
  }

  _addPopupInfo() {
    this._changeOverflow(true);
    this._addPopupEvents();
  }

  _changeOverflow(isAdded) {
    if (isAdded) {
      siteBodyElement.classList.add('hide-overflow');
    } else {
      siteBodyElement.classList.remove('hide-overflow');
    }
  }

  _addPopupEvents() {
    this._filmPopupComponent.setCloseBtnClickHandler(this._popupCloseBtnClickHandler);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmPopupComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
  }

  _handleFavoriteClick() {
    this._updateFilmCardData(
      Object.assign({}, this._movie, { isFavorite: !this._movie.isFavorite }),
    );
  }

  _handleMarkAsWatchedClick() {
    this._updateFilmCardData(
      Object.assign({}, this._movie, { isAlreadyWatched: !this._movie.isAlreadyWatched }),
    );
  }

  _handleAddToWatchlistClick() {
    this._updateFilmCardData(
      Object.assign({}, this._movie, { isWatchlist: !this._movie.isWatchlist }),
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeFilmPopupComponent();
    }
  }

  _popupCloseBtnClickHandler() {
    this._closeFilmPopupComponent();
  }
}
