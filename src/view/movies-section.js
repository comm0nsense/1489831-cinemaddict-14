import { createSiteElement } from '../util.js';

const createMoviesSectionTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container">
        </div>
      </section>
      <section id="films-list-top-rated" class="films-list films-list--extra">
        <h2 class="films-list__title">Top rated</h2>
        <div class="films-list__container">
        </div>
      </section>
      <section id="films-list-most-commented" class="films-list films-list--extra">
        <h2 class="films-list__title">Most commented</h2>
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

export default class MoviesSection {
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
