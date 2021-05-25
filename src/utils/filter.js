import {FilterType} from './const.js';

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film.id),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isAlreadyWatched),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
};
