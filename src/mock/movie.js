import {
  getRandomInteger,
  random,
  getRandomArrayElement,
  convertArrayToUniqArray,
  generateArray,
  getRandomDate,
  convertTime
} from './util.js';
import { generateComment } from './comment.js';

const titles = [
  'Mank', 'The Assistant', 'La Llorna', 'Boys State', 'She Dies Tomorrow', 'The Vast of Night',
  'Night of the Kings', 'I am Thinking of Ending Things', 'Beanpole', 'Tigertail', 'Nomadland',
  'Martin Eden', 'Dick Johnson Is Dead', 'Minari', 'Time', 'Bacurau', 'First Cow', 'American Utopia',
  'Lovers Rock', 'Collective',
];

const posters = [
  '../images/posters/made-for-each-other.png',
  '../images/posters/popeye-meets-sinbad.png',
  '../images/posters/sagebrush-trail.jpg',
  '../images/posters/santa-claus-conquers-the-martians.jpg',
  '../images/posters/the-dance-of-life.jpg',
  '../images/posters/the-great-flamarion.jpg',
  '../images/posters/the-man-with-the-golden-arm.jpg',
];

const countires = ['Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India',
  'Indonesia', 'Italy', 'Japan', 'Mexico', ' Russia', 'Saudi Arabia', 'South Africa',
  'South Korea', 'Turkey', 'UK', 'USA'];

const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Documentary', 'Horror',
  'Sci-Fi', 'Western', 'Thriller', 'Fantasy', 'Crime', 'Music'];

const sentences = [
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

const directors = ['Roman Polanski', 'Tim Burton', 'Charles Chaplin', 'Sidney Lumet', 'James Cameron',
  'John Ford', 'Joel Coen', 'Ingmar Bergman', 'David Lean', 'Clint Eastwood', 'Milos Forman',
  'Peter Jackson', 'John Huston', 'Billy Wilder', 'Woody Allen', 'Francis Ford Coppola', 'Stanley Kubrick',
  'Alfred Hitchcock', 'Martin Scorsese'];

const writers = ['Billy Wilder', 'Ethan Coen and Joel Coen', 'Robert Towne', 'Quentin Tarantino',
  'Francis Ford Coppola', 'William Goldman', ' Charlie Kaufman', 'Woody Allen', 'Nora Ephron',
  'Ernest Lehman', 'Paul Schrader', 'Oliver Stone'];

const actors = ['Jack Nicholson', 'Marlon Brando', 'Robert De Niro', 'Al Pacino', 'Daniel Day-Lewis',
  'Dustin Hoffman', 'Tom Hanks', 'Katharine Hepburn', 'Audrey Hepburn', 'Bette Davis', 'Meryl Streep'];

let movieId = 0;

const ageRatingMap = new Map([
  ['0+', 0],
  ['6+', 6],
  ['12+', 12],
  ['18+', 18],
]);

const ageRatingList = ['0+', '6+', '12+', '18+'];

const generateGenreArray = () => {
  const array = generateArray(1, 3, genres);
  return convertArrayToUniqArray(array);
};

const generateDescription = () => {
  const array = generateArray(1, 5, sentences);
  const uniqArray = convertArrayToUniqArray(array);
  return uniqArray.join(' ');
};

const generateWriters = () => {
  const array = generateArray(1, 3, writers);
  return convertArrayToUniqArray(array);
};

const generateActors = () => {
  const array = generateArray(5, 20, actors);
  return convertArrayToUniqArray(array);
};

const generateUserDetails = () => {
  const isAlreadyWatched = Boolean(getRandomInteger(0, 1));

  if (isAlreadyWatched) {
    return {
      'watchlist': getRandomInteger(0, 1),
      'already_watched': true,
      'watching_date': getRandomDate(),
      'favorite': getRandomInteger(0, 1),
    };
  } else {
    return {
      'watchlist': getRandomInteger(0, 1),
      'already_watched': false,
      'watching_date': null,
      'favorite': getRandomInteger(0, 1),
    };
  }
};

const generateMovie = () => {
  // порядок полей такой же как в структуре данных? или нет?
  return {
    // 'filmInfo': {
    'id': movieId++,
    'title': getRandomArrayElement(titles),
    'alternative_title': getRandomArrayElement(titles),
    'poster': getRandomArrayElement(posters),
    'ageRating': ageRatingMap.get(getRandomArrayElement(ageRatingList)),
    'description': generateDescription(),
    'totalRating': random(0, 10).toFixed(1),//Почему название через low dash?
    'director': getRandomArrayElement(directors),
    'writers': generateWriters(),
    'actors': generateActors(),
    // 'release': {
    'releaseDate': getRandomDate(new Date(1990, 0, 1), new Date()),
    'releaseCountry': getRandomArrayElement(countires),
    // },
    'genre': generateGenreArray(),
    'comments': new Array(getRandomInteger(0, 5)).fill().map(() => generateComment()),
    'runtime': convertTime(getRandomInteger(60, 240)),
    'userDetails': generateUserDetails(),
    // },
  };
};
//объект movie содержит все данные для заполнения не только картчоки, но и попапа?

export { generateMovie };

