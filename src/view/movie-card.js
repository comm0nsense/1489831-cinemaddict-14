import {
  convertDateToYear,
  createSiteElement
} from '../util/util.js';


const SHORT_DESC_LENGTH = 139;

const createMovieCardTemplate = (movie) => {

  const {
    id,
    title,
    totalRating,
    releaseDate,
    runtime,
    poster,
    genres,
    movieCommentsIds,
    description,
    userDetails: {isWatchlist, isAlreadyWatched, isFavorite},
  } = movie;

  return `
    <article class="film-card" id = "${id}">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${convertDateToYear(releaseDate)}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${(description.length <= SHORT_DESC_LENGTH) ? description : description.slice(0, 139) + '...'}</p>
      <a class="film-card__comments">${movieCommentsIds.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isAlreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class MovieCard {
  constructor(movie) {
    this._element = null;
    this._movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  getElement() {
    if(!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
