import MovieCardView from '../view/movie-card.js';
import { RenderPosition, FilmExtraListTitle } from '../util/const.js';
import { render, remove } from '../util/render.js';

export default class Movie {
  constructor(filmCardContainer) {
    this._filmCardContainer = filmCardContainer;
  }

  init(movie) {
    this._movie = movie;

    this._filmComponent = new MovieCardView(movie);

    render(this._filmCardContainer, this._filmComponent, RenderPosition.BEFOREEND);

    this._filmComponent.setOpenDetailedFilmCardHandler((evt) => {
      console.log('получилось');
      // this._renderDetailedFilmCard(movie, evt);
      // const filmDetailedCardPresenter = new MovieCardPresenter(movie, this._comments);
      // filmDetailedCardPresenter.init(movie, evt);

    });
  }
}
