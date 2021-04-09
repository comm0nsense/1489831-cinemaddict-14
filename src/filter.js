// console.log('test');
const movieToFilterMap = {
  watchlist: (movies) => movies
    .filter((movie) => movie.userDetails.watchlist === 1).length,
  favorites: (movies) => movies
    .filter((movie) => movie.userDetails.favorite === 1).length,
  history: (movies) => movies
    .filter((movie) => movie.userDetails.alreadyWatched === true).length,
};

export const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map( ([filterName, countMovies])=> {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
