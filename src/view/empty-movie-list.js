import AbstractView from './abstract.js'; //почему без фигурных скобок? Если седалть, то ломается

const createEmptyListTemplate = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class EmptyMovieList extends AbstractView {
  getTemplate() {
    return createEmptyListTemplate();
  }
}
