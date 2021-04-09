import { createFiltersTemplate } from './view/filters.js';
import { createSortingTemplate } from './view/sorting';
import { createUserProfile } from './view/user-profile.js';
import { createMovieCard } from './view/movie-card.js';
import { createShowMoreBtn } from './view/show-more-btn.js';
import { createMoviePopupTemplate } from './view/popup.js';
import { createMoviesSectionTemplate } from './view/movies-section.js';
import { generateMovie } from './mock/movie.js';
import './mock/comment.js';
// import { generateFilter } from './mock/filter.js';
import { createFooterStatisticsTemplate } from './view/footer-statictics.js';
import './mock/sorting.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = new Array(TOTAL_MOVIES).fill().map(() => generateMovie());
console.log(movies);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeader, createUserProfile());
render(siteMainElement, createFiltersTemplate(movies));
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createMoviesSectionTemplate());

const siteMoviesSection = siteMainElement.querySelector('.films');
const movieList = siteMoviesSection.querySelector('.films-list');
const siteMoviesListContainer = siteMoviesSection.querySelector('.films-list__container');

if (movies.length >= NUMBER_OF_MOVIES_TO_RENDER) {

  const showMoreBtnHandler = () => {
    const numberOfMoviesRendered = siteMoviesListContainer.children.length;
    const restMovies = TOTAL_MOVIES - numberOfMoviesRendered;

    if (restMovies > NUMBER_OF_MOVIES_TO_RENDER) {
      for (let i = 0; i < NUMBER_OF_MOVIES_TO_RENDER; i++) {
        const index = i + numberOfMoviesRendered;
        render(siteMoviesListContainer, createMovieCard(movies[index]));
      }
    } else if (restMovies <= NUMBER_OF_MOVIES_TO_RENDER) {
      for (let i = 0; i < restMovies; i++) {
        const index = i + numberOfMoviesRendered;
        render(siteMoviesListContainer, createMovieCard(movies[index]));
        showMoreBtn.remove();
      }
    }
  };

  for (let i = 0; i < NUMBER_OF_MOVIES_TO_RENDER; i++) {
    render(siteMoviesListContainer, createMovieCard(movies[i]));
  }
  render(movieList, createShowMoreBtn());
  const showMoreBtn = movieList.querySelector('.films-list__show-more');
  showMoreBtn.addEventListener('click', showMoreBtnHandler);
} else {
  for (let i = 0; i < movies.length; i++) {
    render(siteMoviesListContainer, createMovieCard(movies[i]));
  }
}

const topRatedMoviesList = siteMoviesSection.querySelector('#films-list-top-rated');
const topRatedMoviesListContainer = topRatedMoviesList.querySelector('.films-list__container');
const mostCommentedMoviesList = siteMoviesSection.querySelector('#films-list-most-commented');
const mostCommentedMoviesListContainer = mostCommentedMoviesList.querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  render(topRatedMoviesListContainer, createMovieCard(movies[i]));
  render(mostCommentedMoviesListContainer, createMovieCard(movies[i + 2]));
}

const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
render (siteFooterElement, createFooterStatisticsTemplate(movies));
// render(siteBodyElement, createMoviePopupTemplate(movies[0]));
