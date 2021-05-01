import { formatCommentDate } from '../util/util.js';
import AbstractView from './abstract.js';

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
 * Функция создания компонента списка комментариев
 * @param {array} comments - массив комментариев
 * @returns {string} строка, содержащая разметку комопнента списка комментариев
 */
const createCommentsTemplate = (movie, comments) => {
  const {movieCommentsIds} = movie;

  let commentsFragment = '';
  if (movieCommentsIds.length) {
    const array = comments.filter(({ id }) => movieCommentsIds.includes(id));
    commentsFragment = array.map((comment) => createCommentItemTemplate(comment)).join('');
  }

  return `
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
  `;
};

export default class PopupComments extends AbstractView {
  constructor(movie, comments) {
    super();
    this._movie = movie;
    this._comments = comments;
  }

  getTemplate() {
    return createCommentsTemplate(this._movie, this._comments);
  }
}
