import dayjs from 'dayjs';
import { StatPeriod } from './const';

export const getFilmsByPeriod = (films, period) => {
  if (period === StatPeriod.ALL) {
    return films;
  }

  return films.slice().filter((film) => dayjs(film.watchingDate).isSame(dayjs(), period));
};

export const getTotaDuration = (films) => {
  if (!films) {
    return '0';
  }

  return films.reduce((counter,film) => counter + film.runtime, 0);
};

const calcGenreNumber = (films, genre) => {
  return films.filter((film) => film.genres.includes(genre)).length;
};

export const getCountByGenre = (films) => {
  const genres = films
    .map((film) => film.genres)
    .flat(1);
  const genresSet = [...new Set(genres)];
  const countByGenre = genresSet.map((genre) => {
    return {
      genre,
      count: calcGenreNumber(films, genre),
    };
  });

  const countByGenreDescOrder = countByGenre.sort((a, b) => b.count - a.count);

  return countByGenreDescOrder;
};
