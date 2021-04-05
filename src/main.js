import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createFiltersTemplate } from './view/filters.js';
import { createUserProfile } from './view/user-profile.js';
import { createMovieCard } from './view/movie-card.js';
import { createShowMoreBtn } from './view/show-more-btn.js';
import { createMovieDetailsPopup } from './view/popup.js';
import { createMoviesSectionTemplate } from './view/movies-section.js';
import {generateMovie} from './mock/movie.js';
import './mock/comment.js';


const MOVIES_COUNT = 5;
const SECTION_MOVIES_COUNT = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector('body');
const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeader, createUserProfile());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createFiltersTemplate());
render(siteMainElement, createMoviesSectionTemplate());

const siteMoviesSection = siteMainElement.querySelector('.films');

const siteMoviesListContainer = siteMoviesSection.querySelector('.films-list__container');

const movies = new Array(5).fill().map(() => generateMovie());
console.log(movies);

for (let i = 0; i < movies.length; i++) {
  render(siteMoviesListContainer, createMovieCard(movies[i]));
}

render(siteMoviesSection, createShowMoreBtn());

const topRatedMoviesList = siteMoviesSection.querySelector('#films-list-top-rated');
const topRatedMoviesListContainer = topRatedMoviesList.querySelector('.films-list__container');
const mostCommentedMoviesList = siteMoviesSection.querySelector('#films-list-most-commented');
const mostCommentedMoviesListContainer = mostCommentedMoviesList.querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  render(topRatedMoviesListContainer, createMovieCard());
  render(mostCommentedMoviesListContainer, createMovieCard());
}

// render(siteBodyElement, createMovieDetailsPopup());
