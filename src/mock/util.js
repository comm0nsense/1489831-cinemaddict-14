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

const getUniqueRandomNumbers = (length, min, max) => {
  const arr = [];
  while (arr.length < length) {
    const number = getRandomInteger(min, max);
    if (arr.indexOf(number) === -1) arr.push(number);
  }
  return arr;
};

const getRandomArrayElement = (array) => {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
};

export {
  getRandomInteger,
  getUniqueRandomNumbers,
  random,
  getRandomArrayElement
};
