import { createFiltersTemplate } from './view/filters';
import { createSortingTemplate } from './view/sorting';
// import { createFilmPopupTemplate } from './view/film-popup';
import { createUserProfileTemplate } from './view/user-profile';
import { createFilmsBoardTemplate } from './view/films-board';
import { createFilmsListMainTemplate } from './view/films-list-main';
import { createFilmListExtraTemplate } from './view/films-list-extra';
import { createFooterStatistics } from './view/statistics';
import { createFilmCardTemplate } from './view/film-card';

const FILM_COUNT_MAIN_LIST = 5;
const FILM_COUNT_EXTRA_LIST = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, createUserProfileTemplate(), 'beforeend');

// const siteBodyElement = document.querySelector('body');
// render(siteBodyElement, createFilmPopupTemplate(), 'beforeend' );

const siteMainElement = document.querySelector('.main');
render(siteMainElement, createFiltersTemplate(), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createFilmsBoardTemplate(), 'beforeend');

const siteFilmsBoardElement = document.querySelector('.films');
render(siteFilmsBoardElement, createFilmsListMainTemplate(), 'beforeend');
const siteFilmsMainListElement = document.querySelector('#main-list');
const filmsMainListContainer = siteFilmsMainListElement.querySelector('.films-list__container');

for (let i = 0; i < FILM_COUNT_MAIN_LIST; i++) {
  render(filmsMainListContainer, createFilmCardTemplate(), 'beforeend');
}

render(siteFilmsBoardElement, createFilmListExtraTemplate(), 'beforeend');
const siteTopRatedFilmsListElement = document.querySelector('#top-rated-list');
const topRatedFilmsListContainer = siteTopRatedFilmsListElement.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_EXTRA_LIST; i++) {
  render(topRatedFilmsListContainer, createFilmCardTemplate(), 'beforeend');
}

const siteMostCommentedFilmsListElement = document.querySelector('#most-commented-list');
const mostCommentedFilmsListContainer = siteMostCommentedFilmsListElement.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_EXTRA_LIST; i++) {
  render(mostCommentedFilmsListContainer, createFilmCardTemplate(), 'beforeend');
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createFooterStatistics(), 'beforeend');

