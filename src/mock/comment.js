import {
  getRandomElementFromArray,
  generateRandomArray,
  getRandomDate
} from './util.js';

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const NAMES = [
  'James',
  'Mary',
  'John Doe',
  'Patricia',
  'Robert Nagovki',
  'Jennifer',
  'Michael',
  'Linda',
  'William',
  'Elizabeth',
  'David',
  'Barbara',
];

const SENTENCES = [
  'I felt goosebumps and even got a bit emotional at a few points.',
  'Its a must watch for all superhero movie lovers.',
  ' The release of this movie is revolutionary',
  'This one tells the full story and I must say nicely.',
  ' This is the movie we, all the fans wanted and deserve.',
  'So corny its actually unbelievable. One of the worst movies I have seen all year.',
  'Not many movies are worth watching for 4 hours including this one.',
];

let commentId = 0;

const generateComment = () => {

  return {
    id: commentId++,
    author: getRandomElementFromArray(NAMES),
    text: generateRandomArray(SENTENCES, 1, 3).join(' '),
    date: getRandomDate(),
    emotion: getRandomElementFromArray(EMOTIONS),
  };
};

export { generateComment};
