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
import { sortByMostCommented, sortByRating} from './utils/film';
import { render, remove } from './utils/render';
import { RenderPosition, ExtraListTitles } from './utils/const';


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

  filmCardComponent.setFilmCardClickHandler( () => {
    renderFilmPopup(film);
  }, '.film-card__poster');

  filmCardComponent.setFilmCardClickHandler ( ()  => {
    renderFilmPopup(film);
  }, '.film-card__title');

  filmCardComponent.setFilmCardClickHandler(() => {
    renderFilmPopup(film);
  }, '.film-card__comments');

  render(container, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilmPopup = (film) => {
  const filmPopupComponent = new FilmPopupView(film, comments);

  filmPopupComponent.setCloseBtnClickHandler(() => {
    // evt.preventDefault(); //??
    remove(filmPopupComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      remove(filmPopupComponent);
      siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(siteBodyElement, filmPopupComponent, RenderPosition.BEFOREEND);
  siteBodyElement.classList.add('hide-overflow');
  document.addEventListener('keydown', onEscKeyDown);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

const renderFilmsBoard = (boardContainer, boardFilms) => {
  const boardComponent = new FilmsBoardView();//section.films
  const mainListComponent = new MainListView();//section.films-list
  const sortingComponent = new SortingView();//ul.sort

  render(boardContainer,sortingComponent, RenderPosition.BEFOREEND);
  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);

  const boardElement = boardContainer.querySelector('.films');

  if (!boardFilms.length) {
    remove(sortingComponent);
    render(boardElement, new EmptyListView(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent, mainListComponent, RenderPosition.BEFOREEND);
  const mainListContainer = mainListComponent.getElement().querySelector('.films-list__container');

  boardFilms
    .slice(0, Math.min(boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => renderFilmCard(mainListContainer, boardFilm));

  if (boardFilms.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;
    const showMoreBtnComponent =  new ShowMoreBtnView();
    render(mainListComponent, showMoreBtnComponent, RenderPosition.BEFOREEND);

    showMoreBtnComponent.setClickHandler(() => {
      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((boardFilm) => renderFilmCard(mainListContainer, boardFilm));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        remove(showMoreBtnComponent);
      }
    });
  }

  const renderTopRatedList = () => {
    const topRatedListComponent = new ExtraListView(ExtraListTitles.TOP_RATED);
    render(boardComponent, topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = sortByRating(films);
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => renderFilmCard(topRatedListContainer, film));
  };

  const renderMostCommentedList = () => {
    const mostCommentedListComponent = new ExtraListView(ExtraListTitles.MOST_COMMENTED);
    render(boardComponent, mostCommentedListComponent, RenderPosition.BEFOREEND);
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
render(siteFooterStatisticsElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);
