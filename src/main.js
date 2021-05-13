import FilterView from './view/filter';
import SortingView from './view/sorting';
import UserProfileView from './view/user-profile';
import FilmsBoardView from './view/films-board';
import MainListView from './view/main-list';
import ExtraListView from './view/extra-list';
import StatisticsView from './view/statistics';
import FilmCardView from './view/film-card';
import ShowMoreBtnView from './view/show-more-btn';
import { generateComments, generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { generateFilter } from './mock/filter';
import { renderTemplate, render, sortByMostCommented, sortByRating} from './util';
import { RenderPosition, ExtraListTitles } from './const';


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


const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView().getElement(), RenderPosition.BEFOREEND);

const siteBodyElement = document.querySelector('body');
// renderElement(siteBodyElement, new FilmPopupView(films[0], comments).getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsBoardView().getElement(), RenderPosition.BEFOREEND);

const siteFilmsBoardElement = document.querySelector('.films');

const mainListComponent = new MainListView();
render(siteFilmsBoardElement, mainListComponent.getElement(), RenderPosition.BEFOREEND);
const siteMainListElement = document.querySelector('.films-list');
const mainListContainer = siteMainListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(mainListContainer, new FilmCardView(films[i]).getElement(), RenderPosition.BEFOREEND);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(siteMainListElement, new ShowMoreBtnView().getElement(), RenderPosition.BEFOREEND);

  const showMoreBtn = siteMainListElement.querySelector('.films-list__show-more');

  showMoreBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(mainListContainer, new FilmCardView(film).getElement(), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreBtn.remove();
    }
  });
}

const topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
render(siteFilmsBoardElement, topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
const topRatedFilms = sortByRating(films);
topRatedFilms
  .slice(0, FILM_COUNT_EXTRA_LIST)
  .forEach((film) => renderTemplate(topRatedListContainer, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));


const mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
render(siteFilmsBoardElement, mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');
const mostCommentedFilms = sortByMostCommented(films);
mostCommentedFilms
  .slice(0, FILM_COUNT_EXTRA_LIST)
  .forEach((film) => renderTemplate(mostCommentedListContainer, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);

