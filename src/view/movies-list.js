import { createSiteElement } from '../util.js';

const createMoviesListTemplate = () => {

  return `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
    `;
};

export default class MoviesList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesListTemplate();
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