import he from 'he';
import {formatReleaseDate, formatCommentDate, convertRuntime} from '../utils/film';
import SmartView from './smart.js';
import {KeyDownType} from '../utils/const';

const DEFAULT_NEW_COMMENT = {
  text: '',
  emotion: null,
};

/**
 * Функция создания шаблона комментария
 * @param {Object} comment - данные о комментарии
 * @returns {string} строка, содержащая разметку шаблона комментария
 */
const createCommentItemTemplate = (comment) => {
  const {
    id,
    emotion,
    author,
    text,
    date,
  } = comment;

  return `
    <li class="film-details__comment" id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
         <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatCommentDate(date)}</span>
          <button class="film-details__comment-delete" id="${id}">Delete</button>
        </p>
      </div>
     </li>
  `;
};

const createFilmPopupTemplate = (film, filmComments) => {
  const {
    poster,
    ageRating,
    title,
    originalTitle,
    totalRating,
    director,
    writers,
    actors,
    releaseDate,
    runtime,
    releaseCountry,
    genres,
    description,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
    commentsIds,
    newComment,
    isDisabled,
  } = film;

  const {emotion, text} = newComment;

  const commentsFragment = filmComments.map((comment) => createCommentItemTemplate(comment)).join('');

  const genreList = genres.length > 1
    ? `${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`
    : `<span class="film-details__genre">${genres}</span>`;

  return `
     <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatReleaseDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${convertRuntime(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    ${genreList}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? 'checked' : ''}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isAlreadyWatched ? 'checked' : ''}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? 'checked' : ''}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

            <ul class="film-details__comments-list">
                ${commentsFragment}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                 ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(text) ? text : ''}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${emotion === 'smile' ? ' checked' : ''} ${isDisabled ? ' disabled' : ''}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${emotion === 'sleeping' ? ' checked' : ''} ${isDisabled ? ' disabled' : ''}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${emotion === 'puke' ? ' checked' : ''} ${isDisabled ? ' disabled' : ''}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${emotion === 'angry' ? ' checked' : ''} ${isDisabled ? ' disabled' : ''}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._data = FilmPopup.parseFilmToData(film);
    this._comments = comments;

    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._popupFavoriteClickHandler = this._popupFavoriteClickHandler.bind(this);
    this._popupMarkAsWatchedClickHandler = this._popupMarkAsWatchedClickHandler.bind(this);
    this._popupAddToWatchlistClickHandler = this._popupAddToWatchlistClickHandler.bind(this);

    this._changeCommentEmojiHandler = this._changeCommentEmojiHandler.bind(this);
    this._inputNewCommentHandler =  this._inputNewCommentHandler.bind(this);

    this._newCommentSendHandler = this._newCommentSendHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);

    this.setNewCommentSendHandler(this._callback.newCommentSend);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      newComment: DEFAULT_NEW_COMMENT,
      isDisabled: false,
    });
  }

  static parseDataToComment(data) {
    return {
      // author: 'TestAuthor',
      // id: Date.now(),
      text: data.newComment.text,
      emotion: data.newComment.emotion,
      // date: dayjs().toDate(),
      filmId: data.id,
    };
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data, this._comments);
  }

  _newCommentSendHandler(evt) {
    if (evt.key === KeyDownType.ENTER && (evt.metaKey || evt.ctrlKey)) {
      const scrollPosition = document.querySelector('.film-details').scrollTop;
      evt.preventDefault();
      const { text, emotion } = this._data.newComment;

      if(!text.trim() || !emotion) {
        return;
      }

      const newComment = FilmPopup.parseDataToComment(this._data);
      this._callback.newCommentSend(newComment);
      document.querySelector('.film-details').scrollTo(0, scrollPosition);
    }
  }

  setNewCommentSendHandler(callback) {
    this._callback.newCommentSend = callback;
  }

  _changeCommentEmojiHandler(evt) {
    evt.preventDefault();
    const scrollPosition = document.querySelector('.film-details').scrollTop;

    this.updateData({
      newComment: Object.assign({}, this._data.newComment, { emotion: evt.target.value }),
    });

    document.querySelector('.film-details').scrollTo(0, scrollPosition);
  }

  _inputNewCommentHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign({}, this._data.newComment, {text: evt.target.value}),
    }, true);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((item) => item.addEventListener('change', this._changeCommentEmojiHandler));

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._inputNewCommentHandler);

    this.getElement().addEventListener('keydown', this._newCommentSendHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setPopupAddToWatchlistClickHandler(this._callback.popupAddToWatchlistClick);
    this.setPopupFavoriteClickHandler(this._callback.popupFavoriteClick);
    this.setPopupMarkAsWatchedClickHandler(this._callback.popupMarkAsWatchedClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
  }

  _closeBtnClickHandler(evt) {
    document.removeEventListener('keydown', this._newCommentSendHandler);
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _popupFavoriteClickHandler() {
    this._callback.popupFavoriteClick(this._film);
  }

  _popupMarkAsWatchedClickHandler() {
    this._callback.popupMarkAsWatchedClick(this._film);
  }

  _popupAddToWatchlistClickHandler() {
    this._callback.popupAddToWatchlistClick(this._film);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    const scrollPosition = document.querySelector('.film-details').scrollTop;
    this._callback.deleteCommentClick(evt.target.id);

    document.querySelector('.film-details').scrollTo(0, scrollPosition);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    const allDeleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    allDeleteButtons.forEach((deleteBtn) => deleteBtn.addEventListener('click', this._deleteCommentClickHandler));
  }

  setPopupMarkAsWatchedClickHandler(callback) {
    this._callback.popupMarkAsWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched')
      .addEventListener('click', this._popupMarkAsWatchedClickHandler);
  }

  setPopupAddToWatchlistClickHandler(callback) {
    this._callback.popupAddToWatchlistClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist')
      .addEventListener('click', this._popupAddToWatchlistClickHandler);
  }

  setPopupFavoriteClickHandler(callback) {
    this._callback.popupFavoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite')
      .addEventListener('click', this._popupFavoriteClickHandler);
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeBtnClickHandler);
  }
}

