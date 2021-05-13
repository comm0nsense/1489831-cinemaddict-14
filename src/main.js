import { createFilterTemplate } from './view/filter';
import { createSortingTemplate } from './view/sorting';
import { createFilmPopupTemplate } from './view/film-popup';
import { createUserProfileTemplate } from './view/user-profile';
import { createFilmsBoardTemplate } from './view/films-board';
import { createFilmsListMainTemplate } from './view/films-list-main';
import { createFilmListExtraTemplate } from './view/films-list-extra';
import { createFooterStatistics } from './view/statistics';
import { createFilmCardTemplate } from './view/film-card';
import { createShowMoreBtnTemlate } from './view/show-more-btn';
import { generateComments, generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { generateFilter } from './mock/filter';

const FILM_COUNT = 12;
const FILM_COUNT_EXTRA_LIST = 2;
const FILM_COUNT_PER_STEP = 5;

const comments = generateComments(5);
const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);
const filters = generateFilter(films);

console.log(comments);
console.log(films);
console.log(filters);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, createUserProfileTemplate(), 'beforeend');

const siteBodyElement = document.querySelector('body');
// render(siteBodyElement, createFilmPopupTemplate(films[0], comments), 'beforeend' );

const siteMainElement = document.querySelector('.main');
render(siteMainElement, createFilterTemplate(filters), 'beforeend');
render(siteMainElement, createSortingTemplate(), 'beforeend');
render(siteMainElement, createFilmsBoardTemplate(), 'beforeend');

const siteFilmsBoardElement = document.querySelector('.films');
render(siteFilmsBoardElement, createFilmsListMainTemplate(), 'beforeend');
const siteFilmsMainListElement = document.querySelector('#main-list');
const filmsMainListContainer = siteFilmsMainListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(filmsMainListContainer, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(siteFilmsMainListElement, createShowMoreBtnTemlate(), 'beforeend');

  const showMoreBtn = siteFilmsMainListElement.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsMainListContainer, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreBtn.remove();
    }
  });
}

render(siteFilmsBoardElement, createFilmListExtraTemplate(), 'beforeend');
const siteTopRatedFilmsListElement = document.querySelector('#top-rated-list');
const topRatedFilmsListContainer = siteTopRatedFilmsListElement.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_EXTRA_LIST; i++) {
  render(topRatedFilmsListContainer, createFilmCardTemplate(films[i]), 'beforeend');
}

const siteMostCommentedFilmsListElement = document.querySelector('#most-commented-list');
const mostCommentedFilmsListContainer = siteMostCommentedFilmsListElement.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT_EXTRA_LIST; i++) {
  render(mostCommentedFilmsListContainer, createFilmCardTemplate(films[i]), 'beforeend');
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createFooterStatistics(films.length), 'beforeend');

