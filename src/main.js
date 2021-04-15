import { generateMovie, comments } from './mock/mock-movie.js';
import { userProfiles } from './mock/mock-user-profile.js';
import { generateFilter } from './filter.js';

import {
  generateArray,
  render,
  RenderPosition,
  FilmExtraListTitle
} from './util.js';

import MoviesSectionView from './view/movies-section.js';
import MoviesListView from './view/movies-list.js';
import ShowMoreBtnView from './view/show-more-btn.js';
import SortingView from './view/sorting.js';
import MoviesExtraListView from './view/movies-list-extra.js';
import FooterStatisticsView from './view/footer-statictics.js';
import UserProfileView from './view/user-profile.js';
import MovieCardView from './view/movie-card.js';
import MainNavView from './view/main-navigation.js';
import MoviePopupView from './view/popup.js';
import MovieCommentsView from './view/comments.js';
import EmptyMovieListView from './view/empty-list.js';
// import StatisticsView from './view/statictics.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = generateArray(TOTAL_MOVIES, generateMovie);
console.log(movies);
// OS: There are no movies in our database.

const filters = generateFilter(movies);
// console.log(filters);

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

/* USER RANK */
render(
  siteHeaderElement,
  new UserProfileView(userProfiles[0]).getElement(),
  RenderPosition.BEFOREEND);

/* MENU AND FILTERS */
render(
  siteMainElement,
  new MainNavView(filters).getElement(),
  RenderPosition.BEFOREEND);

/* SORTING */
render(
  siteMainElement,
  new SortingView().getElement(),
  RenderPosition.BEFOREEND); //OS: нужна функция сортировки по дате и рейтингу

/* STATISTICS SCREEN (закомментировано, чтобы скрыть) */
// render(siteMainElement, new StatisticsView(userProfiles[1]).getElement(), RenderPosition.BEFOREEND);

/* FILM SECTION */
// как должно быть реализовано переключение между экранами?
const filmsSectionComponent = new MoviesSectionView();

render(
  siteMainElement,
  filmsSectionComponent.getElement(),
  RenderPosition.BEFOREEND);

const filmsListComponent = new MoviesListView();

render(
  filmsSectionComponent.getElement(),
  filmsListComponent.getElement(),
  RenderPosition.BEFOREEND);

const filmsListContainer = filmsListComponent.getElement().querySelector('.films-list__container');

const renderFilm = (container, movie) => {
  const filmComponent = new MovieCardView(movie);
  render(container, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const filmPoster = filmComponent.getElement().querySelector('.film-card__poster');
  const filmComments = filmComponent.getElement().querySelector('.film-card__comments');
  const filmTitle = filmComponent.getElement().querySelector('.film-card__title');

  const onMovieCardClick = (evt) => {
    // console.log(evt.target);

    siteBodyElement.classList.add('hide-overflow');

    const popupComponent = new MoviePopupView(movies[0]);

    render(
      siteBodyElement,
      popupComponent.getElement(),
      RenderPosition.BEFOREEND);

    const commentsContainer = popupComponent.getElement().querySelector('.film-details__bottom-container');

    render(
      commentsContainer,
      new MovieCommentsView(movies[0], comments).getElement(),
      RenderPosition.BEFOREEND);

    const popupCloseBtn = popupComponent.getElement().querySelector('.film-details__close-btn');

    // const closePopup = () => {
    //   siteBodyElement.removeChild(popupComponent.getElement());
    //   siteBodyElement.classList.remove('hide-overflow');
    // };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        siteBodyElement.removeChild(popupComponent.getElement());
        siteBodyElement.classList.remove('hide-overflow');
        // closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onPopupCloseBtnClickHandler = () => {
      siteBodyElement.removeChild(popupComponent.getElement());
      siteBodyElement.classList.remove('hide-overflow');
      // closePopup();
    };

    popupCloseBtn.addEventListener('click', onPopupCloseBtnClickHandler);
    document.addEventListener('keydown', onEscKeyDown);
  };

  filmPoster.addEventListener('click', onMovieCardClick);
  filmComments.addEventListener('click', onMovieCardClick);
  filmTitle.addEventListener('click', onMovieCardClick);
};

/* ALL FILMS RENDERING */
for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
  renderFilm(filmsListContainer, movies[i]);
}

if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
  const showMoreBtnComponent = new ShowMoreBtnView();
  render(filmsListComponent.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);
  let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

  const showMoreBtnClickHandler = () => {
    movies
      .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => renderFilm(filmsListContainer, movie));

    numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (numberOfMoviesRendered >= movies.length) {
      showMoreBtnComponent.getElement().remove();
    }
  };

  showMoreBtnComponent.getElement().addEventListener('click', showMoreBtnClickHandler);
}

/* TOP RATED FILM LIST */
const topRatedListComponent = new MoviesExtraListView(FilmExtraListTitle.TOP_RATED);

render(
  filmsSectionComponent.getElement(),
  topRatedListComponent.getElement(),
  RenderPosition.BEFOREEND);

const mostCommentedListComponent = new MoviesExtraListView(FilmExtraListTitle.MOST_COMMENTED);

render(
  filmsSectionComponent.getElement(),
  mostCommentedListComponent.getElement(),
  RenderPosition.BEFOREEND);

const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  //OS: 2 карточки с наивысшим рейтингом
  renderFilm(topRatedListContainer, movies[i]);
  //OS: 2 карточки с наибольшим количеством комментариев
  renderFilm(mostCommentedListContainer, movies[i + 2]);
}

/* FOOTER */
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');

render(
  siteFooterElement,
  new FooterStatisticsView(movies.length).getElement(),
  RenderPosition.BEFOREEND);
