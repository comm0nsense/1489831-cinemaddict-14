import { createSiteElement } from '../utils/render.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t intantiate Abstract, only conrete one');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method is not implemented: getTemplate');
  }

  getElement() {
    if(!this._element) {
      this._element = createSiteElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
