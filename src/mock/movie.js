import { getRandomInteger, getUniqueRandomNumbers, random, getRandomArrayElement } from './util.js';
import {generateComment} from './comment.js';

const generateDescription = () => {
  const sentences = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    'Cras aliquet varius magna, non porta ligula feugiat eget. ',
    'Fusce tristique felis at fermentum pharetra. ',
    'Aliquam id orci ut lectus varius viverra. ',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
    'Sed sed nisi sed augue convallis suscipit in sed felis. ',
    'Aliquam erat volutpat. ',
    'Nunc fermentum tortor ac porta dapibus. ',
    'In rutrum ac purus sit amet tempus.',
  ];

  //случайное кол-во предложений от 0 до 5
  const randomCount = getRandomInteger(0, 5);

  //случайные индексы предложений для составления описания
  const randomIndexes = getUniqueRandomNumbers(randomCount, 0, sentences.length - 1);

  const array = [];

  for (const index of randomIndexes) {
    array.push(sentences[index]);
  }

  return array.join('');
};

const generateTitle = () => {
  const titles = [
    'Mank', 'The Assistant', 'La Llorna', 'Boys State', 'She Dies Tomorrow', 'The Vast of Night',
    'Night of the Kings', 'I am Thinking of Ending Things', 'Beanpole', 'Tigertail', 'Nomadland',
    'Martin Eden', 'Dick Johnson Is Dead', 'Minari', 'Time', 'Bacurau', 'First Cow', 'American Utopia',
    'Lovers Rock', 'Collective',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    '../public/images/posters/made-for-each-other.png',
    'popeye-meets-sinbad',
    'sagebrush-trail',
    'santa-claus-conquers-the-martians',
    'the-dance-of-life',
    'the-great-flamarion',
    'the-man-with-the-golden-arm',
  ];

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateReleaseCountry = () => {
  const countires = ['Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India',
    'Indonesia', 'Italy', 'Japan', 'Mexico', ' Russia', 'Saudi Arabia', 'South Africa',
    'South Korea', 'Turkey', 'UK', 'USA'];

  return getRandomArrayElement(countires);
};

const generateGenre = () => {
  const genres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Drama', 'Documentary', 'Horror',
    'Sci-Fi', 'Western', 'Thriller', 'Fantasy', 'Crime', 'Music'];
  const randomCount = getRandomInteger(1, 3); //количество жанров
  const randomIndexes = getUniqueRandomNumbers(randomCount, 0, genres.length - 1);
  const array = [];

  for (const index of randomIndexes) {
    array.push(genres[index]);
  }

  return array;
};

const generateMovieComments = () => {
  const random = getRandomInteger(0, 5);
  const comments = new Array(random).fill().map(() => generateComment());
  return comments;
};

const generateMovie = () => {
  // порядок полей такой же как в структуре данных? или нет?
  return {
    'film_info': {
      'title': generateTitle(),
      'poster': generatePoster(),
      'description': generateDescription(),
      'total_rating': random(0, 10).toFixed(1),//Почему название через low dash?
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'release_country': generateReleaseCountry(),
      },
      'genre': generateGenre(),
      'comments': generateMovieComments(),
      'runtime': '1h 36m',
      'user_details': {
        'watchlist': false,
        'already_watched': true,
        'watching_date': '2019-04-12T16:12:32.554Z',
        'favorite': false,
      },
    },
  };
};
//Этот объект содержит все данные для заполнения не только картчоки, но и попапа?
console.log(generateMovie());
