import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = new Map();
  }

  hasComments(filmId) {
    return this._comments.has(filmId);
  }

  setComments(filmId, comments) {
    this._comments.set(filmId, comments.slice());
  }

  getComments(filmId) {
    return this._comments.get(filmId);
  }

  addComment(updateType, update, filmId) {

    const comments = update.slice();
    const updatedComments = [];

    const renameKey = (object, key, newKey) => {
      const clonedObj = Object.assign({}, object);
      const targetKey = clonedObj[key];
      delete clonedObj[key];
      clonedObj[newKey] = targetKey;
      return clonedObj;
    };

    comments.forEach((comment) => {
      const adaptenComment = renameKey(comment, 'comment', 'text');
      updatedComments.push(adaptenComment);
    });

    //найти по filmId обновить добавить в массив новый комент и положить обратно в словарь
    this._comments.set(filmId, updatedComments);
    this._notify(updateType, this._comments);
  }

  /**
   * Метод для удаления комментария по клику пользователя: по filmId находит
   * в модели-мапе все комментарии к этому фильму, дальше обновляет массив
   * комментов к этому фильму и оповещает view, чтобы произошла перерисовка компонента по обновленной модели
   * @param updateType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
   * @param update - id удаленного комментария
   * @param filmId - id фильма, на котором произошло событие
   */
  deleteComment(updateType, update, filmId) {
    const filmComments = this._comments.get(filmId);
    const removeIndex = filmComments.map((comment) => comment.id).indexOf(update);
    filmComments.splice(removeIndex, 1);

    this._comments.set(filmId, filmComments);
    this._notify(updateType, this._comments);
  }

  static adaptToClient(comment) {

    const adaptedComment = Object.assign(
      {},
      comment,
      {
        text: comment.comment,
      },
    );

    delete adaptedComment.comment;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        comment: comment.text,
      },
    );

    delete adaptedComment.text;

    return adaptedComment;
  }
}
