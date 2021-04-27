import dayjs from 'dayjs';

const NUMBER_OF_MOVIES_TO_MEET_CRITERIA = 0;


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
 * @param {function} elementGeneratingFunc - функция, создающая элемент массива
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
  return movies.find((movie) => parseFloat(movie.movieCommentsIds.length) > NUMBER_OF_MOVIES_TO_MEET_CRITERIA);
};

const checkIfAllFilmsWithoutRating = (movies) => {
  return movies.find((movie) => parseFloat(movie.totalRating) > NUMBER_OF_MOVIES_TO_MEET_CRITERIA);
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
  sortByReleaseDate
};
