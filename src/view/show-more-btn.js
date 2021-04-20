import AbstractView from './abstract.js';

const createShowMoreBtnTemplate = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreBtn extends AbstractView {
  getTemplate() {
    return createShowMoreBtnTemplate();
  }
}
