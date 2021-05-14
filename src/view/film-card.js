import { convertRuntime, convertDateToYear } from '../util';
import { SHORT_DESC_LENGTH } from '../const';
import AbstractView from './abstract';

const createFilmCardTemplate = (film) => {
  const {
    id,
    title,
    totalRating,
    releaseDate,
    runtime,
    poster,
    genres,
    commentsIds,
    description,
    isWatchlist,
    isAlreadyWatched,
    isFavorite,
  } = film;

  return (
    `<article class="film-card" id="${id}">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${convertDateToYear(releaseDate)}</span>
            <span class="film-card__duration">${convertRuntime(runtime)}</span>
            <span class="film-card__genre">${genres[0]}</span>
          </p>
          <img src="./images/posters/${poster}" alt="" class="film-card__poster">
          <p class="film-card__description">${(description.length <= SHORT_DESC_LENGTH) ? description : description.slice(0, SHORT_DESC_LENGTH) + '...'}</p>
          <a class="film-card__comments">${commentsIds.length} comments</a>
          <div class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isAlreadyWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
          </div>
        </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }
}

