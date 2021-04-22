import { generateComments, generateArrayOfCommentsIds, generateMovies } from './mock/movie.js';
import { userProfiles } from './mock/user-profile.js';
import { generateFilterData } from './filter.js';

import { render } from './util/render.js';
import { RenderPosition } from './util/const.js';

import FooterStatisticsView from './view/footer-statictics.js';
import UserProfileView from './view/user-profile.js';
import MainNavView from './view/main-nav.js';

// import StatisticsView from './view/statictics.js';

import MoviesListPresenter from './presenter/movies-list.js';


const TOTAL_MOVIES = 12;
const TOTAL_COMMENTS = 125;

const comments = generateComments(TOTAL_COMMENTS);
const commentsIds = generateArrayOfCommentsIds(comments);
const movies = generateMovies(TOTAL_MOVIES, commentsIds);
// console.log(movies);

const filters = generateFilterData(movies);
// console.log(filters);

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
const moviesListPresenter = new MoviesListPresenter(siteMainElement);
moviesListPresenter.init(movies, comments);

/* FOOTER */
const siteFooterElement = siteBodyElement.querySelector('.footer__statistics');
const footerStaticsComponent =  new FooterStatisticsView(movies.length);
render(siteFooterElement, footerStaticsComponent, RenderPosition.BEFOREEND);
