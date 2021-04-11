import { createFiltersTemplate } from './view/filters.js';
import { createSortingTemplate } from './view/sorting';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreBtnTemplate } from './view/show-more-btn.js';
import { createMoviePopupTemplate } from './view/popup.js';
import { createMoviesSectionTemplate } from './view/movies-section.js';
import { generateMovie } from './mock/movie.js';
import { generateFilter } from './filter.js';
import { createFooterStatisticsTemplate } from './view/footer-statictics.js';
import { createUserProfile } from './mock/mock-user-profile.js';
import { createStatisticsTemplate } from './view/statictics.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = new Array(TOTAL_MOVIES).fill().map(() => generateMovie());
// console.log(movies);
const filters = generateFilter(movies);
// console.log(filters);
const userProfiles = new Array(5).fill().map(() => createUserProfile());
// console.log(userProfiles);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


render(siteHeader, createUserProfileTemplate(userProfiles[0]));
render(siteMainElement, createFiltersTemplate(filters));
render(siteMainElement, createSortingTemplate());

//// Отрисовка экрана Статистика
// render(siteMainElement, createStatisticsTemplate(userProfiles[1]));
////

////Отрисовка экаран фильмы
render(siteMainElement, createMoviesSectionTemplate());

const siteMoviesSection = siteMainElement.querySelector('.films');
const movieList = siteMoviesSection.querySelector('.films-list');
const siteMoviesListContainer = siteMoviesSection.querySelector('.films-list__container');

for (let i = 0; i < NUMBER_OF_MOVIES_TO_RENDER; i++) {
  render(siteMoviesListContainer, createMovieCardTemplate(movies[i]));
}

if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
  render(movieList, createShowMoreBtnTemplate());
  const showMoreBtn = movieList.querySelector('.films-list__show-more');
  let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

  const showMoreBtnClickHandler= (evt) => {
    evt.preventDefault();
    movies
      .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => render(siteMoviesListContainer, createMovieCardTemplate(movie)));

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
  render(topRatedMoviesListContainer, createMovieCardTemplate(movies[i]));
  render(mostCommentedMoviesListContainer, createMovieCardTemplate(movies[i + 2]));
}
//// Конец отрисовки Экрана фильмы

//// Отрисовка Футера
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterElement, createFooterStatisticsTemplate(movies));

////Отрисовка Попапа
// render(siteBodyElement, createMoviePopupTemplate(movies[0]));
