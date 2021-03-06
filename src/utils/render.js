import { RenderPosition } from './const';
import Abstract from '../view/abstract';

/**
 * Функция по отрисовке Компонента или ДОМ-элемента
 * @param {object, string} container - контейнер для элемента/компонента
 * @param {object, string} child - элемент/компонент
 * @param place - указывает местоположение куда отрисовать из перечисления констант
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
 * Функция для удаления компонентов
 * @param {object} component
 */
export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

/**
 * Функция создает DOM-element
 // 1. создаём пустой div-блок
 // 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
 // 3. возвращаем этот DOM-элемент
 // HTML в строке должен иметь общую обёртку,
 // то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
 // а не просто <a>Link 1</a><a>Link 2</a>
 * @param {string} template
 * @returns {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstElementChild; // 3
};

/**
 * Функция по замене одного ДОМ-нода на другой
 * @param {object} newChild - новая карточка/попап фильма
 * @param {object } oldChild - старая карточка/попап фильма
 */
export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};
