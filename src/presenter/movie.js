import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { RenderPosition, UserAction, UpdateType } from '../utils/const.js';
import { render, remove, replace } from '../utils/render.js';
// import UserProfile from '../view/user-profile';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const siteBodyElement = document.querySelector('body');

export default class Movie {
  constructor(filmsCardsContainer, commentsData, updateFilmCardData, changeMode) {

    this._filmCardsContainer = filmsCardsContainer;
    this._commentsData = commentsData;
    this._updateFilmCardData = updateFilmCardData; //handleViewAction
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

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSubmitNewCommentClick = this._handleSubmitNewCommentClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._filmComments = this._commentsData.filter(({ id }) => movie.movieCommentsIds.includes(id));

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
    this._filmPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    this._filmPopupComponent.setSubmitNewCommentHandler(this._handleSubmitNewCommentClick);
  }

  _handleFavoriteClick() {
    this._updateFilmCardData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this._movie, isFavorite: !this._movie.isFavorite},
    );
  }

  _handleMarkAsWatchedClick() {
    this._updateFilmCardData(
      UserAction.UPDATE,
      UpdateType.MINOR,
      {...this._movie, isAlreadyWatched: !this._movie.isAlreadyWatched},
    );
  }

  _handleAddToWatchlistClick() {
    this._updateFilmCardData(
      UserAction.UPDATE,
      UpdateType.MINOR,//с минором работает фильтр
      {...this._movie, isWatchlist: !this._movie.isWatchlist},
    );
  }

  _handleDeleteCommentClick(updatedCommentsIds, deletedCommentId) {
    // console.log(this._movie);
    // console.log(updatedCommentsIds);
    // 1) обновляем фильм в модели фильмов - т.е. перезаписываем поле movieCommentsIds у фильма
    this._updateFilmCardData(
      UserAction.UPDATE,
      UpdateType.MINOR,// c минором работает удаление коммента на экранах, но не обновляется попап
      // UpdateType.PATCH,// c патчем работает удаление коммента на попапе и в основном списке, а топ-комментед не обновляется
      {...this._movie, movieCommentsIds: updatedCommentsIds },
    );

    // remove(this._filmPopupComponent);
    // this._renderFilmPopup();
    // console.log(this._movie);
    // console.log(deletedCommentId);

    //2) удаляем из модели комментарий, который удалил пользователь кликом в попапе
    const [deletedComment] = this._commentsData.filter((comment) => comment.id === parseInt(deletedCommentId));
    // console.log(deletedComment);
    this._updateFilmCardData( // movie-list presenter => this._commentsModel.addComment(updateType, update);
      UserAction.DELETE,
      // UpdateType.PATCH,
      UpdateType.MINOR,
      deletedComment,
    );
  }

  _handleSubmitNewCommentClick(newComment, movieCommentsIds) {
    // console.log(newComment);
    //2) добавляем новый комментарий в модель комментариев
    this._updateFilmCardData(
      UserAction.ADD,
      // UpdateType.PATCH,
      UpdateType.MINOR,
      newComment,
    );

    //1) обновляем фильм в модели фильмов - т.е. перезаписываем поле movieCommentsIds у фильма
    this._updateFilmCardData(
      UserAction.UPDATE,
      // UpdateType.PATCH,
      UpdateType.MINOR,
      {...this._movie, movieCommentsIds: movieCommentsIds },
    );
    // console.log(this._movie);
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
