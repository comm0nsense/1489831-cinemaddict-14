import { createSiteElement } from '../util.js';

const createFooterStatisticsTemplate = (length) => {
  return `
    <p>${length} movies inside</p>
  `;
};

export default class FooterStatistics {
  constructor(numberOfMovies) {
    this._element = null;
    this._numberOfMovies = numberOfMovies;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._numberOfMovies);
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
