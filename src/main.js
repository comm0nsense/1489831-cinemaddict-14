import { generateMovie, commentsData } from './mock/mock-movie.js';
import { userProfiles } from './mock/mock-user-profile.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortingTemplate } from './view/sorting';
import { createUserProfileTemplate } from './view/user-profile.js';
import { createMovieCardTemplate } from './view/movie-card.js';
import { createShowMoreBtnTemplate } from './view/show-more-btn.js';
import { createMoviePopupTemplate } from './view/popup.js';
import { createMoviesSectionTemplate } from './view/movies-section.js';
import { createFooterStatisticsTemplate } from './view/footer-statictics.js';
import { createStatisticsTemplate } from './view/statictics.js';
import { generateFilter } from './filter.js';
import { generateArray } from './util.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = generateArray(TOTAL_MOVIES, generateMovie);
// console.log(movies);
// OS: There are no movies in our database.

const filters = generateFilter(movies);
// console.log(filters);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


render(siteHeader, createUserProfileTemplate(userProfiles[0]));
render(siteMainElement, createFiltersTemplate(filters));
render(siteMainElement, createSortingTemplate());//OS: по идее нужна функция сортировки по дате и рейтингу

//// Отрисовка экрана Статистика - закомментировано, чтобы скрыть
render(siteMainElement, createStatisticsTemplate(userProfiles[1]));
////

////Отрисовка экрана фильмы - как должно быть реализовано переключение между экранами?
render(siteMainElement, createMoviesSectionTemplate());//ничего не принимает...?

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

  const showMoreBtnClickHandler= () => {
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
  //OS: 2 карточки с наивысшим рейтингом
  render(topRatedMoviesListContainer, createMovieCardTemplate(movies[i]));
  //OS: 2 карточки с наибольшим количеством комментариев
  render(mostCommentedMoviesListContainer, createMovieCardTemplate(movies[i + 2]));
}
//// Конец отрисовки Экрана фильмы

//// Отрисовка Футера
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
render(siteFooterElement, createFooterStatisticsTemplate(movies.length));

////Отрисовка Попапа -- закомментировано, чтобы скрыть
render(siteBodyElement, createMoviePopupTemplate(movies[0], commentsData));
