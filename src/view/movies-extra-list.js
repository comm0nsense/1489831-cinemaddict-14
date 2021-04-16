import { createSiteElement } from '../util/util.js';

const createMoviesExtraListTemplate = (listTitle) => {

  return `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${listTitle}</h2>
      <div class="films-list__container"></div>
    </section>
    `;
};

// console.log(createSiteElement(createMoviesExtraListTemplate()));

export default class MoviesExtraList {
  constructor(listTitle) {
    this._element = null;
    this._listTitle = listTitle;
  }

  getTemplate() {
    return createMoviesExtraListTemplate(this._listTitle);
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
