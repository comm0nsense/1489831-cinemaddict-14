import { getRandomInteger, getUniqueRandomNumbers } from './util.js';

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

const generateMovie = () => {
  return {
    // film_info: {
    title: generateTitle(),
    poster: generatePoster(),
    description: generateDescription(),
    // }
  };
};

console.log(generateMovie());
