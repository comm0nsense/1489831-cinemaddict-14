import { createElement } from '../utils/render';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  hide() {
    this.getElement().classList.add('visually-hidden');
  }

  show() {
    this.getElement().classList.remove('visually-hidden');
  }

  shake(elementId) {
    let element = null;

    if (elementId) {
      element = document.getElementById(elementId);
    } else {
      element = this.getElement();
    }

    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
