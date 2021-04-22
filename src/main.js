import { generateComments, generateArrayOfCommentsIds, generateMovies } from './mock/movie.js';
import { userProfiles } from './mock/user-profile.js';
import { generateFilterData } from './filter.js';

import { render, remove } from './util/render.js';
import { RenderPosition, FilmExtraListTitle } from './util/const.js';

import MoviesContainerView from './view/movies-container.js';
import MoviesListView from './view/movies-list.js';
import ShowMoreBtnView from './view/show-more-btn.js';
import SortingView from './view/sorting.js';
import MoviesExtraListView from './view/movies-extra-list.js';
import FooterStatisticsView from './view/footer-statictics.js';
import UserProfileView from './view/user-profile.js';
import MovieCardView from './view/movie-card.js';
import MainNavView from './view/main-nav.js';
import MovieDetailedCardView from './view/movie-detailed-card.js';
import MovieCommentsView from './view/movie-comments.js';
import EmptyMovieListView from './view/empty-movie-list.js';
// import StatisticsView from './view/statictics.js';

import MoviesListPresenter from './presenter/movies-list.js';
import MoviesList from './view/movies-list.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;
const EXTRA_LIST_MOVIES_COUNT = 0;
const TOTAL_COMMENTS = 125;
const classesToOpenDetailedFilmCard = [
  'film-card__poster',
  'film-card__comments',
  'film-card__title',
];

const comments = generateComments(TOTAL_COMMENTS);
const commentsIds = generateArrayOfCommentsIds(comments);
const movies = generateMovies(TOTAL_MOVIES, commentsIds);
// console.log(movies);

const filters = generateFilterData(movies);
// console.log(filters);

const siteBodyElement = document.querySelector('body');

/* USER RANK */
const siteHeaderElement = document.querySelector('.header');
const userProfileComponent =  new UserProfileView(userProfiles[0]);
render(siteHeaderElement, userProfileComponent, RenderPosition.BEFOREEND);

/* MENU - FILTERS */
const siteMainElement = document.querySelector('.main');
const mainNavComponent = new MainNavView(filters);
render(siteMainElement, mainNavComponent, RenderPosition.BEFOREEND);

const moviesListPresenter = new MoviesListPresenter(siteMainElement);

moviesListPresenter.init(movies, comments);
/* SORTING */
// const sortingComponent = new SortingView();
// render(siteMainElement, sortingComponent, RenderPosition.BEFOREEND); //OS: нужна функция сортировки по дате и рейтингу

/* STATISTICS SCREEN (закомментировано, чтобы скрыть) */
// render(siteMainElement, new StatisticsView(userProfiles[1]).getElement(), RenderPosition.BEFOREEND);

/* FILM SECTION */
// const filmsContainerComponent = new MoviesContainerView();
// render(siteMainElement, filmsContainerComponent, RenderPosition.BEFOREEND);

/**
 * Функция открывает детальную карточку фильма
 * @param {object} movie  - объект фильма, по которому был клик
 * @param {evt} evt - событие при клике
 */
// const renderDetailedFilmCard = (movie, evt) => {
//   const clickTarget = evt.target.classList.value;

//   if (classesToOpenDetailedFilmCard.includes(clickTarget)) {

//     siteBodyElement.classList.add('hide-overflow');
//     const detailedFilmCardComponent = new MovieDetailedCardView(movie);

//     if (!siteBodyElement.querySelector('.film-details')) {
//       render(siteBodyElement, detailedFilmCardComponent, RenderPosition.BEFOREEND);
//       const commentsContainer = detailedFilmCardComponent.getElement().querySelector('.film-details__bottom-container');
//       const movieCommentsComponent = new MovieCommentsView(movie, comments);
//       render(commentsContainer, movieCommentsComponent, RenderPosition.BEFOREEND);

//       const closeDetailedFilmCard = () => {
//         remove(detailedFilmCardComponent);
//         siteBodyElement.classList.remove('hide-overflow');
//         document.removeEventListener('keydown', onEscKeyDown);
//       };

//       const onEscKeyDown = (evt) => {
//         if (evt.key === 'Escape' || evt.key === 'Esc') {
//           evt.preventDefault();
//           closeDetailedFilmCard();
//         }
//       };

//       const onPopupCloseBtnClick = () => {
//         closeDetailedFilmCard();
//       };

//       detailedFilmCardComponent.setCloseBtnClickHandler(onPopupCloseBtnClick);
//       document.addEventListener('keydown', onEscKeyDown);
//     }
//   }
// };


// const renderFilmCard = (container, movie) => {
//   const filmComponent = new MovieCardView(movie);
//   render(container, filmComponent, RenderPosition.BEFOREEND);

//   filmComponent.setOpenDetailedFilmCardHandler((evt) => {
//     renderDetailedFilmCard(movie, evt);
//   });
// };

// const renderFilmList = (listContainer, movies) => {
//   const filmsListComponent = new MoviesListView();
//   render(listContainer, filmsListComponent, RenderPosition.BEFOREEND);
//   const filmsListContainer = filmsListComponent.getElement().querySelector('.films-list__container');

//   for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
//     renderFilmCard(filmsListContainer, movies[i]);
//   }

//   if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
//     const showMoreBtnComponent = new ShowMoreBtnView();
//     render(filmsListComponent, showMoreBtnComponent, RenderPosition.BEFOREEND);
//     let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

//     const onShowMoreBtnClick = () => {
//       movies
//         .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
//         .forEach((movie) => renderFilmCard(filmsListContainer, movie));

//       numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

//       if (numberOfMoviesRendered >= movies.length) {
//         remove(showMoreBtnComponent);
//       }
//     };

//     showMoreBtnComponent.setClickHandler(onShowMoreBtnClick);
//   }
// };

// const renderFilmExtraList = (extraListTitle, movies) => {
//   const extraListComponent = new MoviesExtraListView(extraListTitle);

//   render(filmsContainerComponent, extraListComponent, RenderPosition.BEFOREEND);

//   const extraListContainer = extraListComponent.getElement().querySelector('.films-list__container');
//   for (let i = 0; i < SECTION_MOVIES_COUNT; i++) { //если одинаковый рейтниг, то 2 случайных - это просто беру 2 первых после сортировки
//     renderFilmCard(extraListContainer, movies[i]);
//   }
// };

// const renderFilmSection = (sectionContainer, movies) => {
//   if (!movies.length) {
//     render(sectionContainer, new EmptyMovieListView().getElement(), RenderPosition.BEFOREEND);
//   } else {

//     renderFilmList(filmsContainerComponent.getElement(), movies);

//     const isAllFilmsWithoutRating = movies
//       .every((movie) => parseFloat(movie.totalRating) === EXTRA_LIST_MOVIES_COUNT);

//     if (!isAllFilmsWithoutRating) {
//       const moviesSortByRating = [...movies].sort((a, b) => parseFloat(b.totalRating) - parseFloat(a.totalRating));
//       renderFilmExtraList(FilmExtraListTitle.TOP_RATED, moviesSortByRating);
//     }

//     const isAllFilmsWithoutComments = movies
//       .every((movie) => parseFloat(movie.movieCommentsIds.length) === EXTRA_LIST_MOVIES_COUNT);

//     if (!isAllFilmsWithoutComments) {
//       const moviesSortByMostComments = [...movies].sort((a, b) => parseFloat(b.movieCommentsIds.length) - parseFloat(a.movieCommentsIds.length));
//       renderFilmExtraList(FilmExtraListTitle.MOST_COMMENTED, moviesSortByMostComments);
//     }
//   }
// };

// renderFilmSection(siteMainElement, movies);

/* FOOTER */
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const footerStaticsComponent =  new FooterStatisticsView(movies.length);
render(siteFooterElement, footerStaticsComponent, RenderPosition.BEFOREEND);
