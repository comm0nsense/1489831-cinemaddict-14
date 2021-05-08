import dayjs from 'dayjs';

const NUMBER_OF_MOVIES_TO_MEET_CRITERIA = 0;

const convertRuntime = (time) => {
  if (time < 60) {
    return `${time}m`;
  }

  const h = parseInt(time / 60);

  return `${h}h ${time - (h * 60)}m`;
};

const formatCommentDate = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm ');
};

const converArrayToList = (array) => {
  return array.join(', ');
};

const formatReleaseDate = (date) => {
  return dayjs(date).format('D MMMM YYYY');
};

const convertDateToYear = (date) => {
  return dayjs(date).format('YYYY');
};

/**
 * Функция генерации массива
 * @param {number} length - длина массива
 * @param {function} elementGeneratingFunction - функция, создающая элемент массива
 * @returns {array} - массив элементов, которые создаются переданной функцией
 */
const generateArray = (length, elementGeneratingFunction) => {
  return new Array(length).fill().map(elementGeneratingFunction);
};

const sortByMostCommented = (movies) => {
  const moviesSortByMostCommented = movies.slice().sort((a, b) => parseFloat(b.movieCommentsIds.length) - parseFloat(a.movieCommentsIds.length));
  return moviesSortByMostCommented;
};

const checkIfAllFilmsWithoutComments = (movies) => {
  const result = movies.find((movie) => parseFloat(movie.movieCommentsIds.length) > NUMBER_OF_MOVIES_TO_MEET_CRITERIA);
  return result === undefined ? true : false;
};

const checkIfAllFilmsWithoutRating = (movies) => {
  const result = movies.find((movie) => parseFloat(movie.totalRating) > NUMBER_OF_MOVIES_TO_MEET_CRITERIA);
  return result === undefined ? true : false;
};

const sortByRating = (movies) => {
  return movies.slice().sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
};

const sortByReleaseDate = (filmA, filmB) => {
  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};


export {
  formatCommentDate,
  converArrayToList,
  formatReleaseDate,
  convertDateToYear,
  generateArray,
  sortByMostCommented,
  checkIfAllFilmsWithoutComments,
  checkIfAllFilmsWithoutRating,
  sortByRating,
  sortByReleaseDate,
  convertRuntime
};
