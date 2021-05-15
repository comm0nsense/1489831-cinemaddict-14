// export const updateItem = (items, update) => {
//   const index = items.findIndex((item) => item.id === update.id);
//
//   if (index === -1) {
//     return items;
//   }
//
//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };

export const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);
