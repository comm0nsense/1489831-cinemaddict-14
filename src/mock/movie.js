import {
  getRandomInteger,
  getRandomNumber,
  getRandomElementFromArray,
  getRandomDate,
  convertTime,
  generateRandomArray
} from './util.js';

import {
  generateComment
} from './comment.js';

import {
  generateArray
} from '../util/util.js';

import {
  nanoid
} from 'nanoid';

const TITLES = [
  'Mank',
  'The Assistant',
  'La Llorna',
  'Boys State',
  'She Dies Tomorrow',
  'The Vast of Night',
  'Night of the Kings',
  'I am Thinking of Ending Things',
  'Beanpole',
  'Tigertail',
  'Nomadland',
  'Martin Eden',
  'Dick Johnson Is Dead',
  'Minari',
  'Time',
  'Bacurau',
  'First Cow',
  'American Utopia',
  'Lovers Rock',
  'Collective',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const COUNTRIES = [
  'Australia',
  'Brazil',
  'Canada',
  'China',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Italy',
  'Japan',
  'Mexico',
  'Russia',
  'Saudi Arabia',
  'South Africa',
  'South Korea',
  'Turkey',
  'UK',
  'USA',
];

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Drama',
  'Documentary',
  'Horror',
  'Sci-Fi',
  'Western',
  'Thriller',
  'Fantasy',
  'Crime',
  'Music',
];

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const DIRECTORS = [
  'Roman Polanski',
  'Tim Burton',
  'Charles Chaplin',
  'Sidney Lumet',
  'James Cameron',
  'John Ford',
  'Joel Coen',
  'Ingmar Bergman',
  'David Lean',
  'Clint Eastwood',
  'Milos Forman',
  'Peter Jackson',
  'John Huston',
  'Billy Wilder',
  'Woody Allen',
  'Francis Ford Coppola',
  'Stanley Kubrick',
  'Alfred Hitchcock',
  'Martin Scorsese',
];

const WRITERS = [
  'Billy Wilder',
  'Ethan Coen and Joel Coen',
  'Robert Towne',
  'Quentin Tarantino',
  'Francis Ford Coppola',
  'William Goldman',
  'Charlie Kaufman',
  'Woody Allen',
  'Nora Ephron',
  'Ernest Lehman',
  'Paul Schrader',
  'Oliver Stone',
];

const ACTORS = [
  'Jack Nicholson',
  'Marlon Brando',
  'Robert De Niro',
  'Al Pacino',
  'Daniel Day-Lewis',
  'Dustin Hoffman',
  'Tom Hanks',
  'Katharine Hepburn',
  'Audrey Hepburn',
  'Bette Davis',
  'Meryl Streep',
];

let movieId = 1;

const AGE_RATINGS = [
  0,
  6,
  12,
  18,
];

const generateComments = (number) => {
  return generateArray(number, generateComment);
};

const generateArrayOfCommentsIds = (comments) => {
  const arrayOfCommentsIds = [];

  comments.forEach((comment) => {
    arrayOfCommentsIds.push(comment.id);
  });

  return arrayOfCommentsIds;
};

const generateMovieCommentsIds = (commentsIds) => {
  return commentsIds.splice(0, getRandomInteger(0, 5));
};

const generateUserDetails = () => {
  const isAlreadyWatched = Boolean(getRandomInteger(0, 1));

  return {
    'isWatchlist': Boolean(getRandomInteger(0, 1)),
    'isAlreadyWatched': isAlreadyWatched,
    'watchingDate': isAlreadyWatched ? Boolean(getRandomDate()) : false,
    'isFavorite': Boolean(getRandomInteger(0, 1)),
  };
};

const generateMovie = (array) => {

  return {
    'id': nanoid(),
    'title': getRandomElementFromArray(TITLES),
    'originalTitle': getRandomElementFromArray(TITLES),
    'poster': getRandomElementFromArray(POSTERS),
    'ageRating': getRandomElementFromArray(AGE_RATINGS),
    'description': generateRandomArray(SENTENCES, 1, 5).join(' '),
    'totalRating': getRandomNumber(0, 10).toFixed(1),
    // 'totalRating': 0,
    'director': getRandomElementFromArray(DIRECTORS),
    'writers': generateRandomArray(WRITERS, 1, 3),
    'actors': generateRandomArray(ACTORS, 5, 20),
    'releaseDate': getRandomDate(new Date(1990, 0, 1), new Date()),
    'releaseCountry': getRandomElementFromArray(COUNTRIES),
    'genres': generateRandomArray(GENRES, 1, 3),
    // 'movieCommentsIds': arrayOfCommentsIds.splice(0, getRandomInteger(0, 5)),
    'movieCommentsIds': generateMovieCommentsIds(array),

    // 'movieCommentsIds': '',
    'runtime': convertTime(getRandomInteger(60, 240)),
    'userDetails': generateUserDetails(),
  };
};

const generateMovies = (number, array) => {
  return new Array(number).fill().map(() => generateMovie(array));
};

export {
  GENRES,
  generateComments,
  generateArrayOfCommentsIds,
  generateMovies
};

