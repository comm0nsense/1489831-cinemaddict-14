import FilterView from './view/filter';
import UserProfileView from './view/user-profile';
import StatisticsView from './view/statistics';
import { generateComments, generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { generateFilter } from './mock/filter';
import { render } from './utils/render';
import { RenderPosition } from './utils/const';
import BoardPresenter from './presenter/board';

const FILM_COUNT = 12;

const comments = generateComments(25);
const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);
const filters = generateFilter(films);

// console.log(comments);
// console.log(films);
// console.log(filters);

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
const siteMainElement = document.querySelector('.main');
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMainElement);
boardPresenter.init(films, comments);

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);
