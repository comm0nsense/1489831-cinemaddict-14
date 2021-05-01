const movieToFilterMap = {
  'All Movies': (movies) => movies.filter((movie) => movie.id).length,
  'Watchlist': (movies) => movies.filter((movie) => movie.isWatchlist).length,
  'Favorites': (movies) => movies.filter((movie) => movie.isFavorite).length,
  'History': (movies) => movies.filter((movie) => movie.isAlreadyWatched).length,
};

export const generateFilterData = (movies) => {
  return Object.entries(movieToFilterMap).map( ([filterName, countMovies])=> {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
