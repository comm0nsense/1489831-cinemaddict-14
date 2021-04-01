import { createMainNavigationTemplate } from './view/main-navigation.js';
import { createFiltersTemplate } from './view/filters.js';
import { createUserProfile } from './view/user-profile.js';
import { createMovieCard } from './view/film-card.js';
import { createShowMoreBtn } from './view/show-more-btn.js';
import {createMovieDetailsPopup} from './view/popup.js';

const MOVIES_COUNT = 5;
const SECTION_MOVIES_COUNT = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeader, createUserProfile());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createFiltersTemplate());

const movies = document.createElement('section');
movies.className = 'films';
siteMainElement.appendChild(movies);

const moviesList = document.createElement('section');
moviesList.className = 'films-list';
movies.appendChild(moviesList);

const moviesListContainer = document.createElement('div');
moviesListContainer.className = 'films-list__container';
moviesList.appendChild(moviesListContainer);

for (let i = 0; i < MOVIES_COUNT; i++) {
  render(moviesListContainer, createMovieCard());
}

render(moviesList, createShowMoreBtn());

const TOP_RATED_TITLE = 'Top rated';
const MOST_COMMENTED_TITLE = 'Most commented';

const createMoviesListExtra = (text) => {
  const moviesListExtra = document.createElement('section');
  moviesListExtra.className = 'films-list--extra';
  movies.appendChild(moviesListExtra);

  const moviesListTitle = document.createElement('h2');
  moviesListTitle.textContent = text;
  moviesListTitle.className = 'films-list__title';
  moviesListExtra.appendChild(moviesListTitle);
  const moviesListExtraContainer = document.createElement('div');
  moviesListExtraContainer.className = 'films-list__container';
  moviesListExtra.appendChild(moviesListExtraContainer);

  for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
    render(moviesListExtraContainer, createMovieCard());
  }
};

createMoviesListExtra(TOP_RATED_TITLE);
createMoviesListExtra(MOST_COMMENTED_TITLE);

render(document.body, createMovieDetailsPopup());
