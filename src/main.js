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

const FILM_COUNT = 12;

const commentsIds = generateArrayOfCommentsIds(comments);
const films = generateFilms(FILM_COUNT, commentsIds);

// console.log(comments);
// console.log(films);
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
const siteMainElement = document.querySelector('.main');

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel);

const statComponent = new StatsView();

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
