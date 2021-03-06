import FilmsBoardView from '../view/films-board';
import MainListView from '../view/main-list';
import SortingView from '../view/sorting';
import EmptyListView from '../view/empty-list';
import ExtraListView from '../view/extra-list';
import LoadingView from '../view/loading';
import { ExtraListTitle, RenderPosition, SortType, UpdateType, UserAction } from '../utils/const';
import { remove, render } from '../utils/render';
import ShowMoreBtnView from '../view/show-more-btn';
import { sortByMostCommented, sortByRating, sortByReleaseDate } from '../utils/film';
import FilmPresenter from './film';
import { filter } from '../utils/filter';
import CommentsModel from '../model/comments';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_EXTRA_LIST = 2;

export default class Board {
  constructor(boardContainer, filmsModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._commentsModel = new CommentsModel();

    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmPopupPresenter = null;
    this._mainListFilmPresenter = {};
    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._boardContainerComponent = new FilmsBoardView();
    this._mainListComponent = new MainListView();
    this._emptyListComponent = new EmptyListView();
    this._topRatedListComponent = new ExtraListView(ExtraListTitle.TOP_RATED);
    this._mostCommentedListComponent = new ExtraListView(ExtraListTitle.MOST_COMMENTED);
    this._loadingComponent = new LoadingView();

    this._sortingComponent = null;
    this._showMoreBtnComponent = null;

    this._handleShowMoreBtnClick = this._handleShowMoreBtnClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {

    this._renderBoard();

    this._renderExtraFilms();

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  showComponents() {
    if (!this._sortingComponent || !this._boardContainerComponent) {
      return;
    }

    this._sortingComponent.show();
    this._boardContainerComponent.show();
  }

  hideComponents() {
    if (!this._sortingComponent || !this._boardContainerComponent) {
      return;
    }

    this._sortingComponent.hide();
    this._boardContainerComponent.hide();
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByReleaseDate);
      case SortType.RATING:
        return sortByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMainList({ resetRenderedFilmCount: true });
    this._renderBoard();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    render(this._boardContainer, this._sortingComponent, RenderPosition.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => presenter.resetView());

    if (this._filmPopupPresenter) {
      this._filmPopupPresenter.destroyPopup();
      this._filmPopupPresenter = null;
    }
  }

  _handleDeleteCommentError(filmId, filmPopup, update, isShakeElement) {
    if (this._mainListFilmPresenter[filmId]) {
      this._mainListFilmPresenter[filmId].init(filmPopup, update, isShakeElement);
    }

    if (this._topRatedListFilmPresenter[filmId]) {
      this._topRatedListFilmPresenter[filmId].init(filmPopup, update, isShakeElement);
    }

    if (this._mostCommentedListFilmPresenter[filmId]) {
      this._mostCommentedListFilmPresenter[filmId].init(filmPopup, update, isShakeElement);
    }
  }

  _handleAddCommentError(filmId) {
    if (this._mainListFilmPresenter[filmId]) {
      this._mainListFilmPresenter[filmId].shakeComponent();
    }

    if (this._topRatedListFilmPresenter[filmId]) {
      this._topRatedListFilmPresenter[filmId].shakeComponent();
    }

    if (this._mostCommentedListFilmPresenter[filmId]) {
      this._mostCommentedListFilmPresenter[filmId].shakeComponent();
    }
  }

  /**
   * ?????????? ?????? ?????????????????? ???????????????? ???? ??????????????????????????, ??.??. ?????????????????? ???????????? ????????????
   * ?? ?????????????????????? ???? ???????????????? ???????????????????????? ???? View.
   * @param actionType - ???????????????? ????????????????????????, ?????????? ?????????? ????????????, ?????????? ?????????? ???????????? ??????????????
   * @param updateType - ?????? ??????????????????, ?????????? ?????????? ????????????, ?????? ?????????? ???????????????? ???? View ?????????? ???????????????????? ????????????.
   * @param update - ?????????????????????? ????????????
   * @param filmId - id ????????????
   * @private
   */
  _handleViewAction(actionType, updateType, update, filmId) {
    let isShakeElement = false;
    switch (actionType) {
      case UserAction.UPDATE:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.DELETE:
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(updateType, update, filmId);
            this._filmsModel.removeDeletedCommentId(updateType, update, filmId);
          })
          .catch(() => {
            isShakeElement = true;
            const filmPopup = this._filmsModel.getFilms().find((film) => film.id === filmId);
            this._handleDeleteCommentError(filmId, filmPopup, update, isShakeElement);
          });
        break;
      case UserAction.ADD:
        this._api.addComment(update)
          .then((response) => {
            const { comments,
              movie: {
                comments: commentsIds,
              },
            } = response;
            this._commentsModel.setComments(filmId, comments.map(CommentsModel.adaptToClient));
            this._filmsModel.addNewCommentId(updateType, filmId, commentsIds);
          })
          .catch(() => {
            this._handleAddCommentError(filmId);
          });
        break;
    }
  }

  _handleModelEventPatch(data) {
    if (this._mainListFilmPresenter[data.id]) {
      this._mainListFilmPresenter[data.id].init(data);
    }

    if (this._topRatedListFilmPresenter[data.id]) {
      this._topRatedListFilmPresenter[data.id].init(data);
    }

    if (this._mostCommentedListFilmPresenter[data.id]) {
      this._mostCommentedListFilmPresenter[data.id].init(data);
    }
  }

  /**
   * ??????????, ?????????????? ?????????????????? Presenter, ?????? ???????????????????? ???????????? ?? ????????????.
   * ???????????????????? ???????????????????? ?????????? ?????????????????? ?????????? _notify Observer-?? ?? ?????????????????????????????? ???????????? Films Model.
   * ?????????? _notify ?????????????????????? Films Model ???? ???????????? Observer.
   * @param updateType - ?? ?????????????????????? ???? ???????? ?????????????????? - PATCH/MINOR/MAJOR - ???????????? , ?????? ????????????:
   * - PATCH: ?????????????????? ?????????? ????????????????
   * - MINOR: ?????????????????? ?????????? ???????????? ???????????????? ??????????????
   * - MAJOR: ?????????????????????? ?????????? ???????????? ???? ???????????????? ??????????????
   * @param data - ?????????????????????? ????????????
   * @private
   */
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleModelEventPatch(data);
        break;
      case UpdateType.MINOR:
        this._clearMainList({ resetRenderedFilmCount: true });
        this._renderBoard();

        this._renderExtraFilms();

        this._renderPopupFilm();
        break;
      case UpdateType.MAJOR:
        this._clearMainList({ resetRenderedTaskCount: true, resetSortType: true });
        this._renderBoard();

        this._renderExtraFilms();
        this._renderPopupFilm();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        this._renderExtraFilms();
        break;
    }
  }

  _renderEmptyList() {
    render(this._boardContainerComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmCard(container, film) {

    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._commentsModel, this._api);
    filmPresenter.init(film);

    return filmPresenter;
  }

  _renderFilms(films) {
    const mainListContainer = this._mainListComponent.getElement().querySelector('.films-list__container');
    films.forEach((film) => {
      this._mainListFilmPresenter[film.id] = this._renderFilmCard(mainListContainer, film);
    });
  }

  _clearMainList({ resetRenderedFilmCount = true, resetSortType = false } = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._mainListFilmPresenter)
      .forEach((presenter) => {

        if (presenter.isPopupMode()) {
          this._filmPopupPresenter = presenter;
        }

        presenter.destroy();

      });

    this._mainListFilmPresenter = {};
    remove(this._sortingComponent);
    remove(this._showMoreBtnComponent);

    this._renderedFilmCount = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmCount, this._renderedFilmCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearExtraLists() {
    const presenters = [
      ...Object.values(this._topRatedListFilmPresenter),
      ...Object.values(this._mostCommentedListFilmPresenter),
    ];

    presenters.forEach((presenter) => {

      if (presenter.isPopupMode()) {
        this._filmPopupPresenter = presenter;
      }

      presenter.destroy();

    });

    this._topRatedListFilmPresenter = {};
    this._mostCommentedListFilmPresenter = {};

    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
  }

  _handleShowMoreBtnClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreBtnComponent);
    }
  }

  _renderShowMoreBtn() {
    if (this._showMoreBtnComponent !== null) {
      this._showMoreBtnComponent = null;
    }

    this._showMoreBtnComponent = new ShowMoreBtnView();
    this._showMoreBtnComponent.setClickHandler(this._handleShowMoreBtnClick);
    render(this._mainListComponent, this._showMoreBtnComponent, RenderPosition.BEFOREEND);
  }

  _renderMainList(films) {
    const filmCount = films.length;

    this._renderSorting();

    render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);

    render(this._boardContainerComponent, this._mainListComponent, RenderPosition.AFTERBEGIN);

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMoreBtn();
    }
  }

  _renderTopRatedList() {
    render(this._boardContainerComponent, this._topRatedListComponent, RenderPosition.BEFOREEND);
    const topRatedListContainer = this._topRatedListComponent.getElement().querySelector('.films-list__container');
    const topRatedFilms = sortByRating(this._filmsModel.getFilms());
    topRatedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._topRatedListFilmPresenter[film.id] = this._renderFilmCard(topRatedListContainer, film);
      });
  }

  _renderMostCommentedList() {
    render(this._boardContainerComponent, this._mostCommentedListComponent, RenderPosition.BEFOREEND);
    const mostCommentedListContainer = this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
    const mostCommentedFilms = sortByMostCommented(this._filmsModel.getFilms());
    mostCommentedFilms
      .slice(0, FILM_COUNT_EXTRA_LIST)
      .forEach((film) => {
        this._mostCommentedListFilmPresenter[film.id] = this._renderFilmCard(mostCommentedListContainer, film);
      });
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();

    if (!films.length) {
      render(this._boardContainer, this._boardContainerComponent, RenderPosition.BEFOREEND);
      this._renderEmptyList();
      return;
    }

    if (this._emptyListComponent) {
      remove(this._emptyListComponent);
    }

    this._renderMainList(films);
  }

  _renderExtraFilms() {
    this._clearExtraLists();

    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderPopupFilm() {
    if (!this._filmPopupPresenter) {
      return;
    }

    const popupFilm = this._filmsModel.getFilms().find((film) => film.id === this._filmPopupPresenter.getFilmId());

    if (!popupFilm) {
      return;
    }

    this._filmPopupPresenter.init(popupFilm);
  }
}
