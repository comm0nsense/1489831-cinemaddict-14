import {createElement} from '../util';

const createFooterStatistics = (number) => {
  return (
    `<p>${number} movies inside</p>`
  );
};

export default class Statistics {
  constructor(number) {
    this._element = null;
    this._number = number;
  }

  getTemplate() {
    return createFooterStatistics(this._number);
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

