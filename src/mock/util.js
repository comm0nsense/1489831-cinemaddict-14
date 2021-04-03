const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getUniqueRandomNumbers = (length, min, max) => {
  const arr = [];
  while (arr.length < length) {
    const number = getRandomInteger(min, max);
    if (arr.indexOf(number) === -1) arr.push(number);
  }
  return arr;
};

export {getRandomInteger, getUniqueRandomNumbers};
