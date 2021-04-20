import { createSiteElement } from '../util/util.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t intantiate Abstract, only conrete one');
    }

    this._element = null;
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
