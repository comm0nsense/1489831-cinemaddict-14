import dayjs from 'dayjs';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const FilmExtraListTitle = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most Commented',
};

/**
 * Вместо шаблонной строки принимает элемент
 * @param {*} container  - DOM-узел, куда добавляем элемент
 * @param {DOM element} element - ссылка на DOM-узел, т.е. элемент, котоырй получился в рез-те обработки разметки и который нужно добавить в контейнер
 * @param {constant} place - местоположение в контейнетре: в начале или в конце
 */
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


/**
 * Функция создания DOM-элемента на основании разметки
 * @param {string} template - принимает шаблонную строку. Строка должна иметь общую обертку.
 * @returns DOM-элемент
 */
export const createSiteElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
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
