import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        actors: film.film_info.actors,
        ageRating: film.film_info.age_rating,
        commentsIds: film.comments,
        description: film.film_info.description,
        director: film.film_info.director,
        genres: film.film_info.genre,
        isAlreadyWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        isWatchlist: film.user_details.watchlist,
        originalTitle: film.film_info.alternative_title,
        poster: film.film_info.poster,
        releaseCountry: film.film_info.release.release_country,
        releaseDate: film.film_info.release.date,
        runtime: film.film_info.runtime,
        title: film.film_info.title,
        totalRating: film.film_info.total_rating,
        watchingDate: film.user_details.watching_date !==null ? new Date(film.user_details.watching_date) : film.user_details.watching_date,
        writers: film.film_info.writers,

      },
    );

    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.comments;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.favorite;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.release.release_country;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.user_details.watching_date;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'comments': film.commentsIds,
        'film_info': {
          'actors': film.actors,
          'age_rating': film.ageRating,
          'alternative_title': film.originalTitle,
          'description': film.description,
          'director': film.director,
          'genre': film.genres,
          'poster': film.poster,
          'release': {
            'date': film.releaseDate,
            'release_country': film.releaseCountry,
          },
          'runtime': film.runtime,
          'title': film.title,
          'total_rating': film.totalRating,
          'writers': film.writers,
        },
        'user_details': {
          'watchlist': film.isWatchlist,
          'already_watched': film.isAlreadyWatched,
          'favorite': film.isFavorite,
          'watching_date': film.watchingDate ? film.watchingDate.toISOString() : null,
        },
      },
    );

    delete adaptedFilm.commentsIds;
    delete adaptedFilm.actors;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.description;
    delete adaptedFilm.director;
    delete adaptedFilm.genres;
    delete adaptedFilm.poster;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.releaseCountry;
    delete adaptedFilm.runtime;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.writers;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isAlreadyWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.title;

    return adaptedFilm;
  }
}
