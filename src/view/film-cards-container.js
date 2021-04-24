import AbstractView from './abstract.js';

const createFilmCardsContainerTemplate = () => {
  return '<section class="films"></section>';
};

export default class FilmCardsContainer extends AbstractView {
  getTemplate() {
    return createFilmCardsContainerTemplate();
  }
}
