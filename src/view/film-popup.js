import {formatReleaseDate, formatCommentDate, convertRuntime} from '../utils/film';
// import AbstractView from './abstract';
import SmartView from './smart.js';

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

const createFilmPopupTemplate = (film, comments) => {
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

  const filmComments = comments.filter(({id}) => commentsIds.includes(id));
  // console.log(filmComments);
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
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>

            <ul class="film-details__comments-list">
                ${commentsFragment}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">
                 ${emotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${text ? text : ''}</textarea>
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

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

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
      comment: Object.assign({}, data.newComment),
    };
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data, this._comments);
  }


  _formSubmitHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();
      const newComment = FilmPopup.parseDataToComment(this._data);
      this._callback.formSubmit(newComment);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', this._formSubmitHandler);
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
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseBtnClickHandler(this._callback.closeBtnClick);
    this.setPopupAddToWatchlistClickHandler(this._callback.popupAddToWatchlistClick);
    this.setPopupFavoriteClickHandler(this._callback.popupFavoriteClick);
    this.setPopupMarkAsWatchedClickHandler(this._callback.popupMarkAsWatchedClick);

    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _closeBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeBtnClick();
  }

  _popupFavoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupFavoriteClick(this._film);
  }

  _popupMarkAsWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupMarkAsWatchedClick(this._film);
  }

  _popupAddToWatchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupAddToWatchlistClick(this._film);
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

