import { generateComments, generateArrayOfCommentsIds, generateMovies } from './mock/movie.js';
import { userProfiles } from './mock/user-profile.js';
import { generateFilterData } from './filter.js';

import { render } from './util/render.js';
import { RenderPosition } from './util/const.js';

import FooterStatisticsView from './view/footer-statictics.js';
import UserProfileView from './view/user-profile.js';
import MainNavView from './view/main-nav.js';

// import StatisticsView from './view/statistics.js';

import MoviesListPresenter from './presenter/movies-list.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';

const TOTAL_MOVIES = 7;
const TOTAL_COMMENTS = 125;

const comments = generateComments(TOTAL_COMMENTS);
const commentsIds = generateArrayOfCommentsIds(comments);
const movies = generateMovies(TOTAL_MOVIES, commentsIds);
const filters = generateFilterData(movies);
// console.log(movies);
const filmsModel = new FilmsModel();
filmsModel.setFilms(movies);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const siteBodyElement = document.querySelector('body');

/* USER RANK */
const siteHeaderElement = document.querySelector('.header');
const userProfileComponent =  new UserProfileView(userProfiles[0]);
render(siteHeaderElement, userProfileComponent, RenderPosition.BEFOREEND);

/* MENU - FILTERS */
const siteMainElement = document.querySelector('.main');
const mainNavComponent = new MainNavView(filters);
render(siteMainElement, mainNavComponent, RenderPosition.BEFOREEND);

/* MOVIES SECTION */
const moviesListPresenter = new MoviesListPresenter(siteMainElement, filmsModel, commentsModel);
moviesListPresenter.init();

/* FOOTER */
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const footerStaticsComponent =  new FooterStatisticsView(movies.length);
render(siteFooterElement, footerStaticsComponent, RenderPosition.BEFOREEND);
