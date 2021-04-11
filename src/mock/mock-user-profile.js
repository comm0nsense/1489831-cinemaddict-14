import {
  getRandomElementFromArray,
  getRandomInteger
} from './mock-util.js';

import {
  GENRES
}  from './movie.js';

const USER_RANKS = ['Novice', 'Fan', 'Movie Buff'];

const createUserProfile = () => {
  const isWatched = Boolean(getRandomInteger(0,1));

  return {
    'rank': isWatched ? getRandomElementFromArray(USER_RANKS) : '',
    'totalMoviesWatched': isWatched ? getRandomInteger(0, 100) : 0,
    'totalDuration': isWatched ? getRandomInteger(1, 240) : 0, //100 фильом * 4 часа * 60 мин
    // 'totalDuration': isWatched ? '133' : 0, //100 фильом * 4 часа * 60 мин
    'topGenre': isWatched ? getRandomElementFromArray(GENRES): '',
  };
};

export { createUserProfile };
