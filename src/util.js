import dayjs from 'dayjs';
import { RenderPosition } from './const';

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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
 * Функция создает DOM-element
 // 1. создаём пустой div-блок
 // 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
 // 3. возвращаем этот DOM-элемент
 // HTML в строке должен иметь общую обёртку,
 // то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
 // а не просто <a>Link 1</a><a>Link 2</a>
 * @param {} template
 * @returns {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstElementChild; // 3
};

export const sortByMostCommented = (movies) => {
  return movies.slice().sort((a, b) => parseFloat(b.commentsIds.length) - parseFloat(a.commentsIds.length));
};

export const sortByRating = (movies) => {
  return movies.slice().sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
};

export const convertDateToYear = (date) => {
  return dayjs(date).format('YYYY');
};

export const formatCommentDate = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm ');
};

export const formatReleaseDate = (date) => {
  return dayjs(date).format('D MMMM YYYY');
};

export const convertRuntime = (time) => {
  if (time < 60) {
    return `${time}m`;
  }

  const h = parseInt(time / 60);

  return `${h}h ${time - (h * 60)}m`;
};
