import FilmCardView from '../view/film-card';
import {remove, render, replace } from '../utils/render';
import {RenderPosition, UserAction, UpdateType, KeyDownType} from '../utils/const';
import FilmPopupView  from '../view/film-popup';
import { generateComments } from '../mock/film';
import dayjs from 'dayjs';

export const comments = generateComments(25);

const siteBodyElement = document.querySelector('body'); //вынести в константу?
const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmListsContainer, changeData, changeMode, commentsModel, api) {
    this._filmListsContainer = filmListsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._api = api;

    this._filmCardComponent = null;
    this._filmPopupComponent = null;
    this._mode = Mode.DEFAULT;

    this._filmComments = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleCloseBtnClick = this._handleCloseBtnClick.bind(this);
    this._onEscKeyDownHandler = this._onEscKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);

    this._handleNewCommentSend = this._handleNewCommentSend.bind(this);
  }

  init(film) {
    this._film = film;

    if (this.isPopupMode()) {
      this._renderFilmPopup();

      return;
    }

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._film);

    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    if (!prevFilmCardComponent) {
      render(this._filmListsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);
    remove(prevFilmCardComponent);
  }

  isPopupMode() {
    return this._mode === Mode.POPUP;
  }

  getFilmId() {
    return this._film.id;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmPopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    this._filmCardComponent = null;
  }

  destroyPopup() {
    this._closeFilmPopup();
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
      Object.assign(
        {},
        this._film,
        {
          isAlreadyWatched: !this._film.isAlreadyWatched,
          watchingDate: !this._film.isAlreadyWatched ? dayjs() : '',
        }),
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

    if (!this._commentsModel.hasComments(this._film.id)) {
      return this._api.getComments(this._film.id)
        .then((response) => {
          this._commentsModel.setComments(this._film.id, response);
        })
        .then(() => this._renderFilmPopup());
    }

    this._renderFilmPopup();
  }

  _renderFilmPopup() {
    this._mode = Mode.POPUP;
    const prevFilmPopupComponent = this._filmPopupComponent;

    this._filmComments = this._commentsModel.getComments(this._film.id);

    this._filmPopupComponent = new FilmPopupView(this._film, this._filmComments);

    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDownHandler);

    this._addPopupEvents();

    if (!prevFilmPopupComponent) {
      render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmPopupComponent, prevFilmPopupComponent);
    remove(prevFilmPopupComponent);
  }

  _addPopupEvents() {

    this._filmPopupComponent.setCloseBtnClickHandler(this._handleCloseBtnClick);
    this._filmPopupComponent.setPopupFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setPopupAddToWatchlistClickHandler(this._handleAddToWatchlistClick);
    this._filmPopupComponent.setPopupMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);

    this._filmPopupComponent.setNewCommentSendHandler(this._handleNewCommentSend);
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
  }

  _handleDeleteCommentClick(deletedCommentId) {
    const filmCommentIds = this._film.commentsIds;
    const updatedFilmCommentsIds = filmCommentIds.filter((id) => id !== deletedCommentId);

    this._changeData(
      UserAction.DELETE,
      UpdateType.MINOR,
      deletedCommentId, this._film.id,
    );

    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this._film, commentsIds: updatedFilmCommentsIds},
      // {...this._film},

    );
  }

  _handleNewCommentSend(comment) {
    // const filmCommentIds = this._film.commentsIds;

    this._changeData(
      UserAction.ADD,
      UpdateType.MINOR,
      comment, this._film.id,
    );

    //id нового комментария появится только после обновления модели
    this._changeData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this._film},
      // {...this._film, commentsIds: 'где тут взять ids они появятся после отправки комента'},
    );
  }

  _handleCloseBtnClick() {
    this._closeFilmPopup();
  }

  _onEscKeyDownHandler(evt) {
    if (evt.key === KeyDownType.ESC || evt.key === KeyDownType.ESC_SHORT) {
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
