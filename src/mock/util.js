// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const shuffleArray = (array) => {
  let curId = array.length;

  while (0 !== curId) {
    const randId = Math.floor(Math.random() * curId);
    curId -= 1;
    const tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }

  return array;
};

export const getRandomElementFromArray = (array) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

export const generateRandomArray = (array, start, end) => {
  const shuffledArray = shuffleArray(array);
  return Array(getRandomInteger(start, end)).fill().map(() => getRandomElementFromArray(shuffledArray));
};

export const getRandomNumber = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

export const getRandomDate = (start = new Date(2000, 0, 1), end = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
