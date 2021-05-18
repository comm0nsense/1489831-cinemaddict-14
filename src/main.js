import UserProfileView from './view/user-profile';
import StatisticsView from './view/statistics';
import { generateComments, generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { render } from './utils/render';
import { RenderPosition } from './utils/const';
import BoardPresenter from './presenter/board';
import FilmsModel from './model/films';
import CommentsModel from './model/comments';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';

const FILM_COUNT = 25;

const comments = generateComments(55);
const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);


// console.log(comments);
// console.log(films);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();//7.1.10

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
const siteMainElement = document.querySelector('.main');

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, commentsModel, filterModel);
filterPresenter.init();
boardPresenter.init();

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);
