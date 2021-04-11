import dayjs from 'dayjs';

const convertDateToYear = (date) => {
  return dayjs(date).format('YYYY');
};

export const createMovieCardTemplate = (movie) => {

  const {
    title,
    totalRating,
    releaseDate,
    runtime,
    poster,
    genres,
    movieCommentsIds,
    description,
  } = movie;

  const releaseYear = convertDateToYear(releaseDate);

  const shortDescription = (description.length <= 139)
    ? description
    : description.slice(0, 139) + '...';


  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${movieCommentsIds.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};
