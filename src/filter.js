// console.log('test');
const movieToFilterMap = {
  // all: (movies) => movies,
  'Watchlist': (movies) => movies
    .filter((movie) => movie.userDetails.watchlist === 1).length,
  'Favorites': (movies) => movies
    .filter((movie) => movie.userDetails.favorite === 1).length,
  'History': (movies) => movies
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
