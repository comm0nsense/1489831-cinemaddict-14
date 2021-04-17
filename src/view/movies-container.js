import { createSiteElement } from '../util/util.js';

const createMoviesSectionTemplate = () => {
  return '<section class="films"></section>';
};

export default class MoviesContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesSectionTemplate();
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
