import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import PopupCommentsView from '../view/popup-comments.js';
import { RenderPosition } from '../util/const.js';
import { render, remove, replace } from '../util/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const siteBodyElement = document.querySelector('body');

export default class Movie {
  // constructor(filmsCardsContainer, comments, changeFilmCardData, changeMode) {
  constructor(filmsCardsContainer, comments, changeFilmCardData) {

    this._filmCardsContainer = filmsCardsContainer;
    this._comments = comments;
    this._changeData = changeFilmCardData;
    // this._changeMode = changeMode;

    this._filmCardComponent = null;
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

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(this._movie);
    this._filmCardComponent.setFilmCardClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmCardComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);

    if (prevFilmCardComponent === null) {
      render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    // console.log('после return');

    if (this._filmCardsContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      console.log('меняаем на default');
    }
  }

  _handleFilmCardClick(evt) {
    this._renderFilmPopup(evt);
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          // title: 'test - favorites click',
          userDetails: {
            isFavorite: !this._movie.userDetails.isFavorite,
            isAlreadyWatched: this._movie.userDetails.isAlreadyWatched,
            isWatchlist: this._movie.userDetails.isWatchlist,
            watchingDate: this._movie.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          // title: 'test - MarkAsWatchedClick',
          userDetails: {
            isAlreadyWatched: !this._movie.userDetails.isAlreadyWatched,
            isWatchlist: this._movie.userDetails.isWatchlist,
            watchingDate: this._movie.userDetails.watchingDate,
            isFavorite: this._movie.userDetails.isFavorite,
          },
        },
      ),
    );
  }

  _handleAddToWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._movie,
        {
          // title: 'test - AddToWatchlistClick',
          userDetails: {
            isWatchlist: !this._movie.userDetails.isWatchlist,
            isAlreadyWatched: this._movie.userDetails.isAlreadyWatched,
            watchingDate: this._movie.userDetails.watchingDate,
            isFavorite: this._movie.userDetails.isFavorite,
          },
        },
      ),
    );
    // console.log('add to watchlist test');
  }


  _renderFilmPopupDesc() {
    render(siteBodyElement, this._filmPopupComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmPopupComments() {
    const popupCommentsComponent = new PopupCommentsView(this._movie, this._comments);
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

  _renderFilmPopup() {

    siteBodyElement.classList.add('hide-overflow');
    this._filmPopupComponent = new FilmPopupView(this._movie);

    // this._changeMode();//вызываем из муви-лист презетера, который знает о всех муви
    // this._mode = Mode.DEFAULT;

    // if (!siteBodyElement.querySelector('.film-details')) {
    this._renderFilmPopupDesc();
    this._renderFilmPopupComments(this._movie);


    this._filmPopupComponent.setCloseBtnClickHandler(this._popupCloseBtnClickHandler);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setMarkAsWatchedClickHandler(this._handleMarkAsWatchedClick);//ПОЧЕМУ НЕ СТАНОВИТСЯ ЖЕЛЫТМ?? ДАННЫЕ МЕНЯЮТСЯ
    this._filmPopupComponent.setAddToWatchlistClickHandler(this._handleAddToWatchlistClick);//ПОЧЕМУ НЕ СТАНОВИТСЯ ЖЕЛЫТМ?? ДАННЫЕ МЕНЯЮТСЯ
    // }//проверяет есть ли уже карточка
  }//renderFilmPopup
}
