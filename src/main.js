import { generateMovie, commentsData } from './mock/mock-movie.js';
import { userProfiles } from './mock/mock-user-profile.js';
import {
  generateArray,
  renderTemplate,
  renderElement,
  RenderPosition,
  FilmExtraListTitle
} from './util.js';

import MoviesSectionView from './view/movies-section.js';
import MoviesListView from './view/movies-list.js';
import ShowMoreBtnView from './view/show-more-btn.js';
import SortingView from './view/sorting.js';
import MoviesExtraListView from './view/movies-list-extra.js';
import FooterStatisticsView from './view/footer-statictics.js';
// import createMoviesExtraListTemplate from './view/movies-list-extra.js';
import { createFiltersTemplate } from './view/main-navigation.js';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createMoviePopupTemplate } from './view/popup.js';
// import { createFooterStatisticsTemplate } from './view/footer-statictics.js';
import { createStatisticsTemplate } from './view/statictics.js';
import { generateFilter } from './filter.js';


const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = generateArray(TOTAL_MOVIES, generateMovie);
// console.log(movies);
// OS: There are no movies in our database.

const filters = generateFilter(movies);
// console.log(filters);

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


renderTemplate(siteHeaderElement, createUserProfileTemplate(userProfiles[0]));
renderTemplate(siteMainElement, createFiltersTemplate(filters));
renderElement(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND); //OS: нужна функция сортировки по дате и рейтингу

//// Отрисовка экрана Статистика - закомментировано, чтобы скрыть
// renderTemplate(siteMainElement, createStatisticsTemplate(userProfiles[1]));
////

////Отрисовка экрана фильмы - как должно быть реализовано переключение между экранами?
const filmsSectionComponent = new MoviesSectionView();
renderElement(siteMainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListComponent = new MoviesListView();
renderElement(filmsSectionComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListContainer = filmsListComponent.getElement().querySelector('.films-list__container');

for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
  renderTemplate(filmsListContainer, createMovieCardTemplate(movies[i]));
}

if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
  const showMoreBtnComponent = new ShowMoreBtnView();
  renderElement(filmsListComponent.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);
  let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

  const showMoreBtnClickHandler= () => {
    movies
      .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => renderTemplate(filmsListContainer, createMovieCardTemplate(movie)));

    numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (numberOfMoviesRendered >= movies.length) {
      showMoreBtnComponent.getElement().remove();
    }
  };

  showMoreBtnComponent.getElement().addEventListener('click', showMoreBtnClickHandler);
}

const topRatedListComponent = new MoviesExtraListView(FilmExtraListTitle.TOP_RATED);
renderElement(filmsSectionComponent.getElement(), topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
const mostCommentedListComponent = new MoviesExtraListView(FilmExtraListTitle.MOST_COMMENTED);
renderElement(filmsSectionComponent.getElement(), mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
// const topRatedMoviesList = siteMoviesSection.querySelector('#films-list-top-rated');
const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
// const mostCommentedMoviesList = siteMoviesSection.querySelector('#films-list-most-commented');
const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  //OS: 2 карточки с наивысшим рейтингом
  renderTemplate(topRatedListContainer, createMovieCardTemplate(movies[i]));
  //OS: 2 карточки с наибольшим количеством комментариев
  renderTemplate(mostCommentedListContainer, createMovieCardTemplate(movies[i + 2]));
}
//// Конец отрисовки Экрана фильмы

//// Отрисовка Футера
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
renderElement(siteFooterElement, new FooterStatisticsView(movies.length).getElement(), RenderPosition.BEFOREEND);

////Отрисовка Попапа -- закомментировано, чтобы скрыть
// renderTemplate(siteBodyElement, createMoviePopupTemplate(movies[0], commentsData));
