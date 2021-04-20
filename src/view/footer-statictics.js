import AbstractView from './abstract.js';

const createFooterStatisticsTemplate = (length) => {
  return `
    <p>${length} movies inside</p>
  `;
};

export default class FooterStatistics extends AbstractView {
  constructor(numberOfMovies) {
    super();
    this._numberOfMovies = numberOfMovies;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._numberOfMovies);
  }
}
