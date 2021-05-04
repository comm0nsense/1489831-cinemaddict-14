import { converArrayToList, formatReleaseDate } from '../util/util.js';
import { formatCommentDate } from '../util/util.js';
import AbstractView from './abstract.js';

/**
 * Функция создания строки выбора смайла для новго комментария
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
 * @param {Object} comment - данные о комментрии
 * @returns {string} строка, содержащая разметку шаблона комментария
 */
const createCommentItemTemplate = (comment) => {
  const {
    emotion,
    author,
    text,
    date,
  } = comment;

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
         <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
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
  } = movie;


  const genreTitle = genres.length > 1 ? 'Genres' : 'Genre';
  const genreList = genres.length > 1
    ? `${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}`
    : `<span class="film-details__genre">${genres}</span>`;

  let commentsFragment = '';
  if (movieCommentsIds.length) {
    commentsFragment = comments.map((comment) => createCommentItemTemplate(comment)).join('');
  }

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
                <td class="film-details__cell">${runtime}</td>
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
            <div class="film-details__add-emoji-label"></div>

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

export default class FilmPopup extends AbstractView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;

    this._closeBtnClickHandler = this._closeBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
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
    return createFilmPopupTemplate(this._movie, this._comments);
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

