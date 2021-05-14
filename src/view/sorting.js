import AbstractView from './abstract';

/**
 * Функция по генерации шаблон компонента
 * NB: недопустимы любые пробелы и отступы между кавычкой и последующим DOM-элементом.
 * @returns {string}
 */
const createSortingTemplate = () => {
  return (
    `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
  );
};

export default class Sorting extends AbstractView {
  getTemplate() {
    return createSortingTemplate();
  }
}
