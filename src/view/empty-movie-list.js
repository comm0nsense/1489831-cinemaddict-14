import { createSiteElement } from '../util/util.js';

const createEmptyListTemplate = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class EmptyMovieList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEmptyListTemplate();
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
