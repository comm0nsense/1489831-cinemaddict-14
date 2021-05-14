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


const FILM_COUNT = 12;
const FILM_COUNT_EXTRA_LIST = 2;
const FILM_COUNT_PER_STEP = 5;

const comments = generateComments(25);
const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);
const filters = generateFilter(films);

console.log(comments);
console.log(films);
console.log(filters);

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

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView().getElement(), RenderPosition.BEFOREEND);
const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const renderFilmsBoard = (boardContainer, boardFilms) => {
  const boardComponent = new FilmsBoardView();//section.films
  const mainListComponent = new MainListView();//section.films-list
  const sortingComponent = new SortingView();//ul.sort

  render(boardContainer,sortingComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const sortingElement = boardContainer.querySelector('.sort');
  const boardElement = boardContainer.querySelector('.films');

  if (!boardFilms.length) {
    sortingElement.remove();
    sortingComponent.removeElement();
    render(boardElement, new EmptyListView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), mainListComponent.getElement(), RenderPosition.BEFOREEND);
  const mainListContainer = mainListComponent.getElement().querySelector('.films-list__container');

  boardFilms
    .slice(0, Math.min(boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => renderFilmCard(mainListContainer, boardFilm));

  if (boardFilms.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const showMoreBtnComponent =  new ShowMoreBtnView();
    render(mainListComponent.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);
    const showMoreBtn = mainListComponent.getElement().querySelector('.films-list__show-more');

    showMoreBtn.addEventListener('click', (evt) => {
      evt.preventDefault();
      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((boardFilm) => renderFilmCard(mainListContainer, boardFilm));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        showMoreBtn.remove();
      }
    });
  }

  const renderTopRatedList = () => {
    const topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    render(boardComponent.getElement(), topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
    const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = sortByRating(films);
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => renderFilmCard(topRatedListContainer, film));
  };

  const renderMostCommentedList = () => {
    const mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    render(boardComponent.getElement(), mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
    const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(films);
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => renderFilmCard(mostCommentedListContainer, film));
  };

  renderTopRatedList();
  renderMostCommentedList();
};

renderFilmsBoard(siteMainElement, films);

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);

