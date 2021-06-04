import UserProfileView from './view/user-profile';
import StatisticsView from './view/footer-statistics';
import { render } from './utils/render';
import {RenderPosition, MenuItem, UpdateType} from './utils/const';
import BoardPresenter from './presenter/board';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import StatsView from './view/stats';
import Api from './api';

const AUTHORIZATION = 'Basic sfkjsdf345jk';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, api);

let statComponent = null;
statComponent = new StatsView(filmsModel);

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
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

