import { generateMovie, commentsData } from './mock/mock-movie.js';
import { userProfiles } from './mock/mock-user-profile.js';
import { generateArray, renderTemplate, renderElement, RenderPosition } from './util.js';
// import { createMoviesSectionTemplate } from './view/movies-section.js';
import MoviesSectionView from './view/movies-section.js';

import { createFiltersTemplate } from './view/filters.js';
import { createSortingTemplate } from './view/sorting';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreBtnTemplate } from './view/show-more-btn.js';
import { createMoviePopupTemplate } from './view/popup.js';

import { createFooterStatisticsTemplate } from './view/footer-statictics.js';
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

// const render = (container, template, place = 'beforeend') => {
//   container.insertAdjacentHTML(place, template);
// };

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


renderTemplate(siteHeader, createUserProfileTemplate(userProfiles[0]));
renderTemplate(siteMainElement, createFiltersTemplate(filters));
renderTemplate(siteMainElement, createSortingTemplate());//OS: по идее нужна функция сортировки по дате и рейтингу

//// Отрисовка экрана Статистика - закомментировано, чтобы скрыть
// renderTemplate(siteMainElement, createStatisticsTemplate(userProfiles[1]));
////

////Отрисовка экрана фильмы - как должно быть реализовано переключение между экранами?
renderElement(siteMainElement, new MoviesSectionView().getElement(), RenderPosition.BEFOREEND);

const siteMoviesSection = siteMainElement.querySelector('.films');
const movieList = siteMoviesSection.querySelector('.films-list');
const siteMoviesListContainer = siteMoviesSection.querySelector('.films-list__container');

for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
  renderTemplate(siteMoviesListContainer, createMovieCardTemplate(movies[i]));
}

if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
  renderTemplate(movieList, createShowMoreBtnTemplate());
  const showMoreBtn = movieList.querySelector('.films-list__show-more');
  let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

  const showMoreBtnClickHandler= () => {
    movies
      .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => renderTemplate(siteMoviesListContainer, createMovieCardTemplate(movie)));

    numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (numberOfMoviesRendered >= movies.length) {
      showMoreBtn.remove();
    }
  };

  showMoreBtn.addEventListener('click', showMoreBtnClickHandler);
}

const topRatedMoviesList = siteMoviesSection.querySelector('#films-list-top-rated');
const topRatedMoviesListContainer = topRatedMoviesList.querySelector('.films-list__container');
const mostCommentedMoviesList = siteMoviesSection.querySelector('#films-list-most-commented');
const mostCommentedMoviesListContainer = mostCommentedMoviesList.querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  //OS: 2 карточки с наивысшим рейтингом
  renderTemplate(topRatedMoviesListContainer, createMovieCardTemplate(movies[i]));
  //OS: 2 карточки с наибольшим количеством комментариев
  renderTemplate(mostCommentedMoviesListContainer, createMovieCardTemplate(movies[i + 2]));
}
//// Конец отрисовки Экрана фильмы

//// Отрисовка Футера
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
renderTemplate(siteFooterElement, createFooterStatisticsTemplate(movies.length));

////Отрисовка Попапа -- закомментировано, чтобы скрыть
// renderTemplate(siteBodyElement, createMoviePopupTemplate(movies[0], commentsData));
