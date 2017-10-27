const USER_ID_RANGE = 100000;
const VISITS_RANGE = 30;
const HITS_RANGE = 25;

const USER_VISITS_COUNT = [0, 0, 0, 0, 0];
// idx = 0, max 30000
// idx = 1, max 50000
// idx = 2, max 15000
// idx = 3, max 3000
// idx = 4, max 2000

// Get a random user id so that visit values are spread randomly
const getRandomUserId = () => (
  Math.ceil(Math.random() * USER_ID_RANGE)
);

//  Get a random number of visits for a particular user
const getRandomNumOfVisits = () => (
  Math.ceil(Math.random() * VISITS_RANGE)
);

//  Get a random number of user actions for a returning visit
const getRandomNumOfHits = () => (
  Math.ceil(Math.random() * HITS_RANGE)
);

//  Eventually: refactor
const getVisitsAndCountUser = () => {
  const visits = getRandomNumOfVisits();

  if ((visits >= 1) && (visits <= 7) && (USER_VISITS_COUNT[0] < 30000)) {
    USER_VISITS_COUNT[0] += 1;
  } else if ((visits >= 8) && (visits <= 13) && (USER_VISITS_COUNT[1] < 50000)) {
    USER_VISITS_COUNT[1] += 1;
  } else if ((visits >= 14) && (visits <= 19) && (USER_VISITS_COUNT[2] < 15000)) {
    USER_VISITS_COUNT[2] += 1;
  } else if ((visits >= 20) && (visits <= 25) && (USER_VISITS_COUNT[3] < 3000)) {
    USER_VISITS_COUNT[3] += 1;
  } else if ((visits >= 26) && (USER_VISITS_COUNT[4] < 2000)) {
    USER_VISITS_COUNT[4] += 1;
  } else {
    getVisitsAndCountUser();
  }

  return visits;
};

//  the next few functions are for determining number of bookings per user for number of visits
const getChance = () => (Math.random() * 100).toFixed(2);

const getBookingsForMaxTwo = (chance, chanceForMax, chanceForOne) => {
  let bookings = 0;

  if (chance < chanceForMax) {
    bookings = 2;
  } else if (chance < chanceForOne) {
    bookings = 1;
  }

  return bookings;
};

const getBookingsOneVisit = () => {
  const chance = getChance();
  let bookings = 0;

  if (chance < 3) {
    bookings = 1;
  }

  return bookings;
};

const getBookingsTwoToSevenVisits = (visits) => {
  const chance = getChance();
  const chanceForOne = (21 - visits) * visits;
  const chanceForMax = (visits / 10);
  const bookings = getBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsEightToThirteenVisits = (visits) => {
  const chance = getChance();
  const increment = visits - 7;
  let i = 1;
  let numerator = 8;
  const denominator = 10;
  const chanceForOne = 98;

  while (i < increment) {
    numerator += 2;
    i += 1;
  }

  const chanceForMax = numerator / denominator;
  const bookings = getBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsFourteenToNineteenVisits = (visits) => {
  const chance = getChance();
  const increment = visits - 13;
  let i = 1;
  let numerator = 20;
  const denominator = 10;
  let chanceForOne = 97.90;

  while (i < increment) {
    chanceForOne = (chanceForOne - 0.09).toFixed(2);
    numerator += 1;
    i += 1;
  }

  const chanceForMax = numerator / denominator;
  const bookings = getBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsTwentyToTwentyFiveVisits = (visits) => {
  const chance = getChance();
  let chanceForOne = 96.85;
  const increment = visits - 19;
  let i = 1;
  const chanceForTwo = ((29 + increment) / 10);
  const chanceForMax = 0.11;
  let bookings = 0;

  while (i < increment) {
    chanceForOne = (chanceForOne - 0.1).toFixed(2);
    i += 1;
  }

  if (chance < chanceForMax) {
    bookings = 3;
  } else if (chance < chanceForTwo) {
    bookings = 2;
  } else if (chance < chanceForOne) {
    bookings = 1;
  }

  return bookings;
};

const getBookingsTwentySixPlusVisits = (visits) => {
  const chance = getChance();
  const chanceForOne = 96.60;
  const increment = visits - 25;
  const chanceForTwo = 3;
  const chanceForThree = ((30 + increment) / 100);
  const chanceForMax = 0.05;
  let bookings = 0;

  if (chance < chanceForMax) {
    bookings = 4;
  } else if (chance < chanceForThree) {
    bookings = 3;
  } else if (chance < chanceForTwo) {
    bookings = 2;
  } else if (chance < chanceForOne) {
    bookings = 1;
  }

  return bookings;
};

const getNumOfBookingsForUser = (visits) => {
  let bookings;

  if (visits === 1) {
    bookings = getBookingsOneVisit();
  } else if (visits <= 7) {
    bookings = getBookingsTwoToSevenVisits(visits);
  } else if (visits <= 13) {
    bookings = getBookingsEightToThirteenVisits(visits);
  } else if (visits <= 19) {
    bookings = getBookingsFourteenToNineteenVisits(visits);
  } else if (visits <= 25) {
    bookings = getBookingsTwentyToTwentyFiveVisits(visits);
  } else {
    bookings = getBookingsTwentySixPlusVisits(visits);
  }

  return bookings;
};

const firstVisitActions = {
  1: 'search',
  2: 'view_listing_details',
};

//  randomly determine which user visits ended in a booking action
const getVisitsThatBooked = (bookings, visits) => {
  const result = [];

  while (result.length < bookings) {
    const v = Math.ceil(Math.random() * visits);
    if (!result.includes(v)) {
      result.push(v);
    }
  }

  return result;
};

const formatDate = (year, month, day) => {
  const mo = (`0${month}`).slice(-2);
  const d = (`0${day}`).slice(-2);

  return `${year}:${mo}:${d}`;
};

const formatTime = (hour, minutes, seconds) => {
  const hr = (`0${hour}`).slice(-2);
  const min = (`0${minutes}`).slice(-2);
  const sec = (`0${seconds}`).slice(-2);

  return `${hr}:${min}:${sec}`;
};

/* ----- END HELPER FUNCTIONS ----- */

const tempUserStream = {}; // temporary object to hold user hits by userId


//  eventually I will add a condition for users to generate more search actions

const populateUserStream = () => {
  const userId = getRandomUserId();
  const visits = getVisitsAndCountUser();
  const bookings = getNumOfBookingsForUser();
  const visitsThatBooked = getVisitsThatBooked(bookings, visits);

  tempUserStream[userId] = [];

  for (let v = 1; v <= visits; v += 1) {
    let hitsForVisit = getRandomNumOfHits();
    let hitsDetailsForVisit = {};
    let hit = 1;

    if (visits === 1 && hitsForVisit === 1) {
      hitsForVisit += 2;
    }

    while (hit <= hitsForVisit) {
      if (v === 0 && hit === 1) { //  if first visit and first hit
        hitsDetailsForVisit = firstVisitActions;
        hit += 2;
      }

      if (hit === hitsForVisit) { //  if last hit for visit
        if (visitsThatBooked.includes(v)) {
          hitsDetailsForVisit[hit] = 'book'; //  last hit is a book
        } else {
          hitsDetailsForVisit[hit] = 'view_listing_details'; //  last hit is a view
        }

        tempUserStream[userId].push(hitsDetailsForVisit); //  end of current visit, push into array
        hit += 1;
      } else {
        hitsDetailsForVisit[hit] = 'view_listing_details';
        hit += 1;
      }
    }
  }

  return tempUserStream;
};
