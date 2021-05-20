import FilmCardView from '../view/film-card';
import {remove, render, replace } from '../utils/render';
import {RenderPosition, UserAction, UpdateType} from '../utils/const';
import FilmPopupView from '../view/film-popup';
import { generateComments } from '../mock/film';
import CommentsModel from '../model/comments';

export const comments = generateComments(55);

const siteBodyElement = document.querySelector('body'); //вынести в константу?
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListsContainer, changeData, changeMode) {
    this._filmListsContainer = filmListsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);

    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__poster');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__title');
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick, '.film-card__comments');
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    if (!prevFilmCardComponent) {
      render(this._filmListsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListsContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmPopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign({}, this._film, { isFavorite: !this._film.isFavorite }),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign({}, this._film, { isAlreadyWatched: !this._film.isAlreadyWatched }),
    );
  }

  _handleAddToWatchlistClick() {
    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign({}, this._film, { isWatchlist: !this._film.isWatchlist }),
    );
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.POPUP;
    this._renderFilmPopup();
  }

  _renderFilmPopup() {
    const prevFilmPopupComponent = this._filmPopupComponent;

    if (prevFilmPopupComponent !== null) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
      remove(prevFilmPopupComponent);
      this._addPopupEvents();
      return;
    }

    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(comments);

    this._filmPopupComponent = new FilmPopupView(this._film, this._commentsModel.getComments());

    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);

    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDownHandler);

    this._addPopupEvents();
  }

  _addPopupEvents() {


    this._filmPopupComponent.setCloseBtnClickHandler(this._handleCloseBtnClick);
    this._filmPopupComponent.setPopupFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setPopupAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._filmPopupComponent.setPopupMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);

    this._filmPopupComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
  }

  _handleDeleteCommentClick(deletedCommentId) {
    const updatedCommentsIds = this._film.commentsIds.filter((commentId) => commentId !== parseInt(deletedCommentId));
    // 1) обновляем фильм в модели фильмов - т.е. перезаписываем поле movieCommentsIds у фильма
    this._changeData(
      UserAction.UPDATE,
      UpdateType.PATCH,
      {...this._film, commentsIds: updatedCommentsIds},
    );
  }

  _handleFormSubmit() {
    // _handleFormSubmit(comment) {
    // console.log(comment);
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
    this._mode = Mode.DEFAULT;
  }
}
