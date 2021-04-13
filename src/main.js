import { generateMovie, commentsData } from './mock/mock-movie.js';
import { userProfiles } from './mock/mock-user-profile.js';
import { generateFilter } from './filter.js';

import {
  generateArray,
  renderTemplate,
  renderElement,
  RenderPosition,
  FilmExtraListTitle
} from './util.js';

import MoviesSectionView from './view/movies-section.js';
import MoviesListView from './view/movies-list.js';
import ShowMoreBtnView from './view/show-more-btn.js';
import SortingView from './view/sorting.js';
import MoviesExtraListView from './view/movies-list-extra.js';
import FooterStatisticsView from './view/footer-statictics.js';
import UserProfileView from './view/user-profile.js';
import MovieCardView from './view/movie-card.js';
import MainNavView from './view/main-navigation.js';
import MoviePopupView from './view/popup.js';
import StatisticsView from './view/statictics.js';

const TOTAL_MOVIES = 12;
const NUMBER_OF_MOVIES_TO_RENDER = 5;
const SECTION_MOVIES_COUNT = 2;

const movies = generateArray(TOTAL_MOVIES, generateMovie);
// console.log(movies);
// OS: There are no movies in our database.

const filters = generateFilter(movies);
// console.log(filters);

const siteBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');


renderElement(siteHeaderElement,  new UserProfileView(userProfiles[0]).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new MainNavView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND); //OS: нужна функция сортировки по дате и рейтингу

//// Отрисовка экрана Статистика - закомментировано, чтобы скрыть
// renderElement(siteMainElement, new StatisticsView(userProfiles[1]).getElement(), RenderPosition.BEFOREEND);
////

////Отрисовка экрана фильмы - как должно быть реализовано переключение между экранами?
const filmsSectionComponent = new MoviesSectionView();
renderElement(siteMainElement, filmsSectionComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListComponent = new MoviesListView();
renderElement(filmsSectionComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListContainer = filmsListComponent.getElement().querySelector('.films-list__container');


for (let i = 0; i < Math.min(movies.length, NUMBER_OF_MOVIES_TO_RENDER); i++) {
  renderElement(filmsListContainer, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
}

if (movies.length > NUMBER_OF_MOVIES_TO_RENDER) {
  const showMoreBtnComponent = new ShowMoreBtnView();
  renderElement(filmsListComponent.getElement(), showMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);
  let numberOfMoviesRendered = NUMBER_OF_MOVIES_TO_RENDER;

  const showMoreBtnClickHandler= () => {
    movies
      .slice(numberOfMoviesRendered, numberOfMoviesRendered + NUMBER_OF_MOVIES_TO_RENDER)
      .forEach((movie) => renderElement(filmsListContainer, new MovieCardView(movie).getElement(), RenderPosition.BEFOREEND));

    numberOfMoviesRendered += NUMBER_OF_MOVIES_TO_RENDER;

    if (numberOfMoviesRendered >= movies.length) {
      showMoreBtnComponent.getElement().remove();
    }
  };

  showMoreBtnComponent.getElement().addEventListener('click', showMoreBtnClickHandler);
}

const topRatedListComponent = new MoviesExtraListView(FilmExtraListTitle.TOP_RATED);
renderElement(filmsSectionComponent.getElement(), topRatedListComponent.getElement(), RenderPosition.BEFOREEND);
const mostCommentedListComponent = new MoviesExtraListView(FilmExtraListTitle.MOST_COMMENTED);
renderElement(filmsSectionComponent.getElement(), mostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
// const topRatedMoviesList = siteMoviesSection.querySelector('#films-list-top-rated');
const topRatedListContainer = topRatedListComponent.getElement().querySelector('.films-list__container');
// const mostCommentedMoviesList = siteMoviesSection.querySelector('#films-list-most-commented');
const mostCommentedListContainer = mostCommentedListComponent.getElement().querySelector('.films-list__container');

for (let i = 0; i < SECTION_MOVIES_COUNT; i++) {
  //OS: 2 карточки с наивысшим рейтингом
  renderElement(topRatedListContainer, new MovieCardView(movies[i]).getElement(), RenderPosition.BEFOREEND);
  //OS: 2 карточки с наибольшим количеством комментариев
  renderElement(mostCommentedListContainer, new MovieCardView(movies[i + 2]).getElement(), RenderPosition.BEFOREEND);
}
//// Конец отрисовки Экрана фильмы

//// Отрисовка Футера
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
renderElement(siteFooterElement, new FooterStatisticsView(movies.length).getElement(), RenderPosition.BEFOREEND);

////Отрисовка Попапа -- закомментировано, чтобы скрыть
// renderElement(siteBodyElement, new MoviePopupView(movies[0], commentsData).getElement(), RenderPosition.BEFOREEND);
