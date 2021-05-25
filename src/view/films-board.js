import AbstractView from './abstract';

export const createFilmsBoardTemplate = () => {
  return (
    `<section class="films">
     </section>`
  );
};

export default class FilmsBoard extends AbstractView {
  getTemplate() {
    return createFilmsBoardTemplate();
  }
}

