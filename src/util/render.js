import { RenderPosition } from './const.js';
import Abstract from '../view/abstract.js';
/**
 * функция отрисовки компонента или ДОМ-элемента
 * @param {DOM element} container  - DOM-узел, куда добавляем элемент
 * @param {DOM element} element - ссылка на DOM-узел, т.е. элемент, котоырй получился в рез-те обработки разметки и который нужно добавить в контейнер
 * @param {constant} place - местоположение в контейнетре: в начале или в конце
 */
export const render = (container, child, place) => {

  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
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


export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};
