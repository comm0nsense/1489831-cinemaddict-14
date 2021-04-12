import { createSiteElement } from '../util.js';

const createShowMoreBtnTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class showMoreBtn {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreBtnTemplate();
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
