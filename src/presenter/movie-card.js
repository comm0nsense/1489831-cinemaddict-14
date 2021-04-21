
import MovieDetailedCardView from '../view/movie-detailed-card.js';
import MovieCommentsView from '../view/movie-comments.js';

import { RenderPosition } from '../util/const.js';

const siteBodyElement = document.querySelector('body');

export default class MovieCard {
  constructor (movie, comments) {
    this._movie = movie;
    this._comments = comments;
  }

  init(movie, comments){
    this._movie = movie;

    this._detailedFilmCardComponent = new MovieDetailedCardView(movie);
  }

  _renderDetailedFilmCard(movie, evt) {
    const clickTarget = evt.target.classList.value;

    if (classesToOpenDetailedFilmCard.includes(clickTarget)) {

      siteBodyElement.classList.add('hide-overflow');
      const detailedFilmCardComponent = new MovieDetailedCardView(movie);

      if (!siteBodyElement.querySelector('.film-details')) {
        render(siteBodyElement, detailedFilmCardComponent, RenderPosition.BEFOREEND);
        const commentsContainer = detailedFilmCardComponent.getElement().querySelector('.film-details__bottom-container');
        const movieCommentsComponent = new MovieCommentsView(movie, comments);
        console.log('должны начать рисовать комменты - как из сюда передать??');
        render(commentsContainer, movieCommentsComponent, RenderPosition.BEFOREEND);

        const closeDetailedFilmCard = () => {
          remove(detailedFilmCardComponent);
          siteBodyElement.classList.remove('hide-overflow');
          document.removeEventListener('keydown', onEscKeyDown);
        };

        const onEscKeyDown = (evt) => {
          if (evt.key === 'Escape' || evt.key === 'Esc') {
            evt.preventDefault();
            closeDetailedFilmCard();
          }
        };

        const onPopupCloseBtnClick = () => {
          closeDetailedFilmCard();
        };

        detailedFilmCardComponent.setCloseBtnClickHandler(onPopupCloseBtnClick);
        document.addEventListener('keydown', onEscKeyDown);
      }
    }
  }
}
