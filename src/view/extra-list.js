import AbstractView from './abstract';

const createFilmListExtraTemplate = (filmsListType) => {
  return (
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">${filmsListType}</h2>
      <div class="films-list__container">
      </div>
     </section>`
  );
};

export default class ExtraList extends AbstractView {
  getTemplate() {
    return createFilmListExtraTemplate(this._filmsListType);
  }
}
