import { MenuItem } from './const.js';

export const filter = {
  [MenuItem.ALL]: (films) => films,
  [MenuItem.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
  [MenuItem.HISTORY]: (films) => films.filter((film) => film.isAlreadyWatched),
  [MenuItem.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [MenuItem.STATS]: (films) => films,
};
