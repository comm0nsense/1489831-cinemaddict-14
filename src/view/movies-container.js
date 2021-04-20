import AbstractView from './abstract.js';

const createMoviesSectionTemplate = () => {
  return '<section class="films"></section>';
};

export default class MoviesContainer extends AbstractView {
  getTemplate() {
    return createMoviesSectionTemplate();
  }
}
