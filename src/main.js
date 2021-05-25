import UserProfileView from './view/user-profile';
import StatisticsView from './view/statistics';
import { generateArrayOfCommentsIds, generateFilms} from './mock/film';
import { render } from './utils/render';
import { RenderPosition, MenuItem, UpdateType, FilterType } from './utils/const';
import BoardPresenter from './presenter/board';
import FilmsModel from './model/films';
import FilterModel from './model/filter';
import FilterPresenter from './presenter/filter';
import { comments } from './presenter/film';

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

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel);

filterPresenter.init();
boardPresenter.init();

const handleSiteMenuClick = (menuItem) => {

  switch (menuItem) {
    case MenuItem.STATISTICS:
      // Скрыть доску
      boardPresenter.destroy();
      // console.log('boardPresenter.destroy()');
      // Показать статистику
      break;
    case MenuItem.ALL_MOVIES:
      // Показать доску
      boardPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.WATCHLIST:
      // Показать доску
      // filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      // Скрыть статистику
      break;
  }
};

const mainNavigation = document.querySelector('.main-navigation');
// нужно перенести в компонент Фильтр-Меню??
mainNavigation.addEventListener('click', (evt) => {
  evt.preventDefault();
  const menuItemType = evt.target.id;
  handleSiteMenuClick(menuItemType);
});

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);
