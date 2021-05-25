import AbstractView from './abstract';

const createFilmListExtraTemplate = (listTitle) => {
  return (
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${listTitle}</h2>
      <div class="films-list__container">
      </div>
     </section>`
  );
};

export default class ExtraList extends AbstractView {
  constructor(listTitle) {
    super();
    this._listTitle = listTitle;
  }
  getTemplate() {
    return createFilmListExtraTemplate(this._listTitle);
  }
}
