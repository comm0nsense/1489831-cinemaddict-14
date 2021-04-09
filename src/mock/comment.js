import {
  getRandomArrayElement,
  generateArray,
  convertArrayToUniqArray,
} from './util.js';

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

const names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer',
  'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara'];

const sentences = [
  'I felt goosebumps and even got a bit emotional at a few points.',
  'Its a must watch for all superhero movie lovers.',
  ' The release of this movie is revolutionary',
  'This one tells the full story and I must say nicely.',
  ' This is the movie we, all the fans wanted and deserve.',
  'So corny its actually unbelievable. One of the worst movies I have seen all year.',
  'Not many movies are worth watching for 4 hours including this one.',
];

let commentId = 0;

const generateCommentText = () => {
  const array = generateArray(1,3, sentences);
  const uniqArray = convertArrayToUniqArray(array);
  return uniqArray.join(' ');
};

const generateComment = () => {

  return {
    'id': commentId++,
    'author': getRandomArrayElement(names),
    'text': generateCommentText(),
    'date': '2019-05-11T00:00:00.000Z',
    'emotion': getRandomArrayElement(emotions),
  };
};

//25 фильмов на 5 комментов = 125
const commentsData = new Array(125).fill().map(() => generateComment());
console.log(commentsData);

const arrayOfCommentsIds = [];
commentsData.forEach((comment) => {
  arrayOfCommentsIds.push(comment.id);
});

export { generateComment, arrayOfCommentsIds, commentsData };
