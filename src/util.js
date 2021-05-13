import dayjs from 'dayjs';

export const convertDateToYear = (date) => {
  return dayjs(date).format('YYYY');
};

export const formatCommentDate = (date) => {
  return dayjs(date).format('YYYY/MM/DD HH:mm ');
};

export const formatReleaseDate = (date) => {
  return dayjs(date).format('D MMMM YYYY');
};

export const convertRuntime = (time) => {
  if (time < 60) {
    return `${time}m`;
  }

  const h = parseInt(time / 60);

  return `${h}h ${time - (h * 60)}m`;
};
