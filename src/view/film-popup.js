import {
  converArrayToList,
  formatReleaseDate,
  formatCommentDate,
  convertRuntime
} from '../utils/util.js';

import SmartView from './smart.js';

const DEFAULT_NEW_COMMENT = {
  comment: '',
  emoji: null,
};

/**
 * Функция создания строки выбора смайла для нового комментария
 * @returns {string}
 */
const createNewCommentEmojiFragment = () => {

  const EMOTIONS = [
    'smile',
    'sleeping',
    'puke',
    'angry',
  ];
  /**
   * Функция создания разметки одного смайла из строки выбора смайлов для нового комментария
   * @param {string} emojiType - строка, которая содержит название вида смайла
   * @returns {string} строка разметки смайла
   */
  const createNewCommentEmojiItemTemplate = (emojiType) => {
    return `
    <input class="film-details__emoji-item visually-hidden" name="comment-${emojiType}" type="radio" id="emoji-${emojiType}" value="${emojiType}">
    <label class="film-details__emoji-label" for="emoji-${emojiType}">
      <img src="./images/emoji/${emojiType}.png" width="30" height="30" alt="emoji">
    </label>
    `;
  };

  return EMOTIONS.map((emoji) => createNewCommentEmojiItemTemplate(emoji)).join('');
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

const createFilmPopupTemplate = (movie, comments) => {
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
    movieCommentsIds,
    newComment,
  } = movie;


  const genreTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const genreList = genres.length > 1
    ? `${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`
    : `<span class="film-details__genre">${genres}</span>`;

  const commentsFragment = comments.map((comment) => createCommentItemTemplate(comment)).join('');

  const { emoji } = newComment;

  return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

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
                <td class="film-details__cell">${converArrayToList(writers)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${converArrayToList(actors)}</td>
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
                <td class="film-details__term">${genreTitle}</td>
                <td class="film-details__cell">
                  ${genreList}
                  </td>
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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movieCommentsIds.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsFragment}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
            ${emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createNewCommentEmojiFragment()}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>
  `;
};

export default class FilmPopup extends SmartView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
    this._data = FilmPopup.parseFilmToData(movie);

    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);

    this._commentEmojiClickHandler = this._commentEmojiClickHandler.bind(this);

    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._inputNewCommentHandler = this._inputNewCommentHandler.bind(this);
    this._submitNewCommentHandler = this._submitNewCommentHandler.bind(this);

    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return { ...film, newComment: DEFAULT_NEW_COMMENT };
  }

  static parseDataToComment(data) { //???
    return {
      // comment: {...data.newComment.comment},
      // emotion: {...data.newComment.emotion},
      comment: data.newComment.comment,
      // emotion: data.newComment.emotion,
      emotion: 'angry',

      id: Date.now(),
    };
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick(this._movie, this._comments);
  }

  _markAsWatchedClickHandler() {
    this._callback.markAsWatchedClick(this._movie, this._comments);
  }

  _addToWatchlistClickHandler() {
    this._callback.addToWatchlistClick(this._movie, this._comments);
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data, this._comments);
  }

  _commentEmojiClickHandler(evt) {
    evt.preventDefault();
    const scrollPosition = document.querySelector('.film-details').scrollTop;
    this.updateData({
      newComment: {...this._data.newComment, emoji: evt.target.value },
    });
    document.querySelector('.film-details').scrollTo(0, scrollPosition);
  }

  _inputNewCommentHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: {...this._data.newComment, comment: evt.target.value},
    }, true);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    const deletedCommentId = evt.target.id;
    const updatedCommentsIds = this._movie.movieCommentsIds.filter((commentId) => commentId !== parseInt(evt.target.id));
    this._callback.deleteCommentClick(updatedCommentsIds, deletedCommentId);
  }

  _submitNewCommentHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      const newComment = FilmPopup.parseDataToComment(this._data);
      const newCommentId = newComment.id;
      const movieCommentsIds = this._movie.movieCommentsIds;
      movieCommentsIds.push(newCommentId);
      this._callback.submitNewComment(newComment, movieCommentsIds);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((item) => item.addEventListener('click', this._commentEmojiClickHandler));

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._inputNewCommentHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
    this.setSubmitNewCommentHandler(this._callback.submitNewComment);
  }

  setSubmitNewCommentHandler(callback) {
    this._callback.submitNewComment = callback;
    document.addEventListener('keydown', this._submitNewCommentHandler);
  }

  setDeleteCommentClickHandler (callback) {
    this._callback.deleteCommentClick = callback;
    const allDeleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    allDeleteButtons.forEach((deleteBtn) => deleteBtn.addEventListener('click', this._deleteCommentClickHandler));
  }

  setCloseBtnClickHandler(callback) {
    this._callback.closeBtnClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeBtnClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-label--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback.markAsWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-label--watched')
      .addEventListener('click', this._markAsWatchedClickHandler);
  }

  setAddToWatchlistClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement().querySelector('.film-details__control-label--watchlist')
      .addEventListener('click', this._addToWatchlistClickHandler);
  }
}

