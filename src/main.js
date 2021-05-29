import UserProfileView from './view/user-profile';
import StatisticsView from './view/footer-statistics';
import { generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { render } from './utils/render';
import {RenderPosition, MenuItem, UpdateType} from './utils/const';
import BoardPresenter from './presenter/board';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import { comments } from './presenter/film';
import StatsView from './view/stats';
import Api from './api';

const AUTHORIZATION = 'Basic sfkjsdf345jk';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

// const commentsIds = generateArrayOfCommentsIds(comments);
// const films = generateFilms(FILM_COUNT, commentsIds);
// const api = new Api(END_POINT, AUTHORIZATION);

// api.getFilms().then((films) => {
//   console.log(films);
// });
//
// api.getComments(0).then((comments) => {
//   console.log(comments);
// });

// console.log(comments);
// console.log(films);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
// filmsModel.setFilms(films);

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, api);

let statComponent = null;
// statComponent = new StatsView(filmsModel.getFilms());

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem){
    case MenuItem.STATS:
      statComponent.init();
      render(siteMainElement, statComponent, RenderPosition.BEFOREEND);
      statComponent.show();
      boardPresenter.hideComponents();
      break;
    default:
      statComponent.hide();
      boardPresenter.showComponents();
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel, handleSiteMenuClick);

render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(filmsModel.getFilms().length), RenderPosition.BEFOREEND);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    statComponent = new StatsView(filmsModel.getFilms());
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

