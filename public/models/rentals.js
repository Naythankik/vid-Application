const date = new Date();
const rentals = [
  {
    id: 1,
    userId: 1,
    price: "$2000",
    movieId: 2,
    rentDuration: `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`,
  },
  {
    id: 2,
    userId: 10,
    price: "$3500",
    movieId: 5,
    rentDuration: `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`,
  },
  {
    id: 3,
    userId: 9,
    price: "$6500",
    movieId: 1,
    rentDuration: `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`,
  },
  {
    id: 4,
    userId: 6,
    price: "$289",
    movieId: 4,
    rentDuration: `${date.getDay()} ${date.getMonth()} ${date.getFullYear()}`,
  },
  {
    id: 5,
    userId: 1,
    price: "$289",
    movieId: 4,
    rentDuration: `${date.getDay()} ${date.getMonth()} ${date.getFullYear()}`,
  },
];

module.exports = rentals;
