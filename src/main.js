import UserProfileView from './view/user-profile';
import StatisticsView from './view/footer-statistics';
import { generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { render } from './utils/render';
import { RenderPosition, MenuItem } from './utils/const';
import BoardPresenter from './presenter/board';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import { comments } from './presenter/film';
import StatsView from './view/stats';
import Api from './api';

const FILM_COUNT = 25;
const AUTHORIZATION = 'Basic sfkjsdf34535jk';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);
const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms().then((films) => {
  console.log(films);
});

api.getComments(0).then((comments) => {
  console.log(comments);
});

// console.log(comments);
console.log(films);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
const siteMainElement = document.querySelector('.main');

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel);

const statComponent = new StatsView(films);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem){
    case MenuItem.STATS:
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

filterPresenter.init();
boardPresenter.init();


const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);
