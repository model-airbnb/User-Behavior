const USER_ID_RANGE = 100000;
const VISITS_RANGE = 30;
const HITS_RANGE = 25;

const USER_VISITS_COUNT = {
  1: 0, //  1-7, max 30000
  2: 0, //  8-12, max 50000
  3: 0, //  13-20, max 15000
  4: 0, //  20+ max 5000
};

// Get a random user id so that visit values are spread randomly
const getRandomUserId = () => (
  Math.ceil(Math.random() * USER_ID_RANGE)
);

//  Get a random number of visits for a particular user within a 3 month period
const getRandomNumOfVisits = () => (
  Math.ceil(Math.random() * VISITS_RANGE)
);

//  Get a random number of user actions for a returning visit
const getRandomNumOfHits = () => (
  Math.ceil(Math.random() * HITS_RANGE)
);

const countUsersByVisits = () => {
  const visits = getRandomNumOfVisits();

  if ((visits >= 1) && (visits <= 7) && (USER_VISITS_COUNT[1] < 30000)) {
    USER_VISITS_COUNT[1] += 1;
  } else if ((visits >= 8) && (visits <= 12) && (USER_VISITS_COUNT[2] < 50000)) {
    USER_VISITS_COUNT[2] += 1;
  } else if ((visits >= 13) && (visits <= 20) && (USER_VISITS_COUNT[3] < 15000)) {
    USER_VISITS_COUNT[3] += 1;
  } else if ((visits >= 21) && (USER_VISITS_COUNT[4] < 5000)) {
    USER_VISITS_COUNT[4] += 1;
  } else {
    countUsersByVisits();
  }

  return visits;
};

//  the next few functions are for determining number of bookings per user for number of visits
const getChance = () => (Math.random() * 100).toFixed(2);

const findNumBookingsForMaxTwo = (chance, chanceForMax, chanceForOne) => {
  let bookings = 0;

  if (chance < chanceForMax) {
    bookings = 2;
  } else if (chance < chanceForOne) {
    bookings = 1;
  }

  return bookings;
};

const getBookingsForOne = () => {
  const chance = getChance();
  let bookings = 0;

  if (chance < 3) {
    bookings = 1;
  }

  return bookings;
};

const getBookingsForTwoToSeven = (visits) => {
  const chance = getChance();
  const chanceForMax = (visits / 10);
  const chanceForOne = (21 - visits) * visits;
  const bookings = findNumBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsForEightToThirteen = (visits) => {
  const chance = getChance();
  const increment = visits - 7;
  let i = 0;
  let numerator = 6;
  const denominator = 10;

  while (i < increment) {
    numerator += 2;
    i += 1;
  }

  const chanceForMax = numerator / denominator;
  const chanceForOne = 98;
  const bookings = findNumBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

/* ----- END HELPER FUNCTIONS ----- */

const tempUserStream = {}; // temporary object to hold user hits by userId

// const firstVisit = () => {
//   const firstVisitActions = {
//     1: 'search',
//     2: 'view_listing_details',
//   };

//   return firstVisitActions;
// };


// const populateUserStream = () => {
//   const userId = getRandomUserId();
//   const visits = countUsersByVisits();
//   let maxBookings = getMaxBookings(visits);

//   tempUserStream[userId] = [];

//   for (let v = 0; v < visits; v += 1) {
//     const hitsForVisit = getRandomNumOfHits();
//     let hitsDetailsForVisit = {};
//     let hit = 1;

//     while (hit <= hitsForVisit) {
//       if (v === 0 && hit === 1) {
//         hitsDetailsForVisit = firstVisit();
//         hit += 2;
//       } else if (hit === hitsForVisit) {
//         if (lastHit(visits) && maxBookings > 0) {
//           hitsDetailsForVisit[hit] = 'booked';
//           maxBookings -= 1;
//         } else {
//           hitsDetailsForVisit[hit] = 'view_listing_details';
//         }
//         tempUserStream[userId].push(hitsDetailsForVisit);
//         hit += 1;
//       } else {
//         hitsDetailsForVisit[hit] = 'view_listing_details';
//         hit += 1;
//       }
//     }
//   }

//   return tempUserStream;
// };

// console.log(populateUserStream()[1]);
