import {createElement} from '../util';

const createFilmListExtraTemplate = (filmsListType) => {
  return (
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${filmsListType}</h2>
      <div class="films-list__container">
      </div>
     </section>`
  );
};

export default class ExtraList {
  constructor(filmsListType) {
    this._element = null;
    this._filmsListType = filmsListType;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._filmsListType);
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
}
