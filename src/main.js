import FilterView from './view/filter';
import SortingView from './view/sorting';
import UserProfileView from './view/user-profile';
import FilmsBoardView from './view/films-board';
import MainListView from './view/main-list';
import ExtraListView from './view/extra-list';
import StatisticsView from './view/statistics';
import FilmCardView from './view/film-card';
import ShowMoreBtnView from './view/show-more-btn';
import FilmPopupView from './view/film-popup';
import EmptyListView from './view/empty-list';
import { generateComments, generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { generateFilter } from './mock/filter';
import { render, sortByMostCommented, sortByRating} from './util';
import { RenderPosition, ExtraListTitles } from './const';


const FILM_COUNT = 0;
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

const siteMainElement = document.querySelector('.main');

render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsBoardView().getElement(), RenderPosition.BEFOREEND);

const siteFilmsBoardElement = document.querySelector('.films');

// const mainListComponent = new MainListView();
// render(siteFilmsBoardElement, mainListComponent.getElement(), RenderPosition.BEFOREEND);
// const siteMainListElement = document.querySelector('.films-list');
// const mainListContainer = siteMainListElement.querySelector('.films-list__container');

const renderFilmCard = (container, film) => {
  const filmCardComponent = new FilmCardView(film);

  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    renderFilmPopup(film);
  });

  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    renderFilmPopup(film);
  });

  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    renderFilmPopup(film);
  });

  render(container, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmPopup = (film) => {
  const filmPopupComponent = new FilmPopupView(film, comments);

  filmPopupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    siteBodyElement.removeChild(filmPopupComponent.getElement());
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      siteBodyElement.removeChild(filmPopupComponent.getElement());
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(siteBodyElement, filmPopupComponent.getElement(), RenderPosition.BEFOREEND);
  siteBodyElement.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);
};

if (!films.length ) {
  render(siteFilmsBoardElement, new EmptyListView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);
  const mainListComponent = new MainListView();
  render(siteFilmsBoardElement, mainListComponent.getElement(), RenderPosition.BEFOREEND);
  const siteMainListElement = document.querySelector('.films-list');
  const mainListContainer = siteMainListElement.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilmCard(mainListContainer, films[i]);
  }
  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    render(siteMainListElement, new ShowMoreBtnView().getElement(), RenderPosition.BEFOREEND);

    const showMoreBtn = siteMainListElement.querySelector('.films-list__show-more');

    showMoreBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilmCard(mainListContainer, film));

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
    .forEach((film) => renderFilmCard(topRatedListContainer, film));


  const mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
  render(siteFilmsBoardElement, mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
  const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');
  const mostCommentedFilms = sortByMostCommented(films);
  mostCommentedFilms
    .slice(0, FILM_COUNT_EXTRA_LIST)
    .forEach((film) => renderFilmCard(mostCommentedListContainer, film));
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);

