// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const random = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const getRandomArrayElement = (array) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

const convertArrayToUniqArray = (array) => {
  const set = new Set(array);
  const uniqArray = Array.from(set);
  return uniqArray;
};

const generateArray = (number1, number2, array) => {
  return new Array(getRandomInteger(number1, number2)).fill().map(() => getRandomArrayElement(array));
};

const getRandomDate = (start = new Date(2000, 0, 1), end = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// const start = new Date(2001, 0, 1);
// const end = new Date();
// const result = getRandomDate(start, end);
// const result2 = dayjs(result);
// console.log(`result Date: ${result}, result Dayjs: ${result2}`);

const convertTime = (n) => {
  const hours = (n / 60);
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);

  return `${rhours}h ${rminutes}m`;
};

// console.log(convertTime(200));

const getMapKeyByValue = (map, searchValue) => {
  for (const [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
};
//source: https://javascript.info/task/shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export {
  getRandomInteger,
  random,
  getRandomArrayElement,
  convertArrayToUniqArray,
  generateArray,
  getRandomDate,
  convertTime,
  getMapKeyByValue,
  shuffleArray
};
