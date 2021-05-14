import AbstractView from './abstract';

export const createShowMoreBtnTemlate = () => {
  return `
   <button class="films-list__show-more">Show more</button>
  `;
};

export default class ShowMoreBtn extends AbstractView {
  getTemplate() {
    return createShowMoreBtnTemlate();
  }
}
