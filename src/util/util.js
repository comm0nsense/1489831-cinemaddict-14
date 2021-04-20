import dayjs from 'dayjs';

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

export {
  formatCommentDate,
  converArrayToList,
  formatReleaseDate,
  convertDateToYear,
  generateArray
};
