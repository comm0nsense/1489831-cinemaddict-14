import { UserRank } from './const';

const rank = {
  [UserRank.NOVICE]: (count) => count <= 10,
  [UserRank.FAN]: (count) => count <= 20 && count > 10,
  [UserRank.MOVIE_BUFF]: (count) => count > 20,
};

export const getRankName = (films) => {
  const watchedFilmsCount = films.length;
  const [rankName] = Object.entries(rank)
    .filter(([, rankCount]) => rankCount(watchedFilmsCount))
    .flat();

  return rankName;
};

