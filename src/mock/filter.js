const filmToFilterMap = {
  'All Movies': (films) => films.length,
  'Watchlist': (films) => films.filter((film) => film.isWatchlist).length,
  'Favorites': (films) => films.filter((film) => film.isFavorite).length,
  'History': (films) => films.filter((film) => film.isAlreadyWatched).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map( ([filterName, countFilms])=> {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
