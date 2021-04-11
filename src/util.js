import dayjs from 'dayjs';

const formatCommentDate = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm ');
};

const converArrayToList = (array) => {
  return array.join(', ');
};

const formatReleaseDate = (date) => {
  return dayjs(date).format('D MMMM YYYY');
};

export {
  formatCommentDate,
  converArrayToList,
  formatReleaseDate
};
