const { addBooking, addUserGeneralActions } = require('./index');

const USER_ID_RANGE = 100000;
const VISITS_RANGE = 30;
const HITS_RANGE = 25;
const CURRENT_MONTH = '10';

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
  const chanceForMax = (visits / 10);
  const chanceForOne = ((21 - visits) * visits) + chanceForMax;
  const bookings = getBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsEightToThirteenVisits = (visits) => {
  const chance = getChance();
  const increment = visits - 7;
  let i = 1;
  let numerator = 8;
  const denominator = 10;

  while (i < increment) {
    numerator += 2;
    i += 1;
  }

  const chanceForMax = numerator / denominator;
  const chanceForOne = 98 + chanceForMax;
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
  chanceForOne += chanceForMax;
  const bookings = getBookingsForMaxTwo(chance, chanceForMax, chanceForOne);

  return bookings;
};

const getBookingsTwentyToTwentyFiveVisits = (visits) => {
  const chance = getChance();
  const increment = visits - 19;
  let i = 1;
  const chanceForMax = 0.11;
  const chanceForTwo = ((29 + increment) / 10) + chanceForMax;
  let chanceForOne = 96.85 + chanceForTwo;
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
  const increment = visits - 25;
  const chanceForMax = 0.05;
  const chanceForThree = ((30 + increment) / 100) + chanceForMax;
  const chanceForTwo = 3 + chanceForThree;
  const chanceForOne = 96.60 + chanceForTwo;
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

const getNumNightsBooked = () => {
  const chance = getChance();
  let nights = 0;

  if (chance < 16) {
    nights = 1;
  } else if (chance < 46) {
    nights = 2;
  } else if (chance < 73) {
    nights = 3;
  } else if (chance < 85) {
    nights = 4;
  } else if (chance < 92) {
    nights = 5;
  } else if (chance < 96) {
    nights = 6;
  } else if (chance < 99) {
    nights = 7;
  } else {
    nights = 8;
  }

  return nights;
};

// the following functions are placeholders until data is integrated with other services
const getRandomListingId = () => (
  Math.floor(Math.random() * ((30000000 - 950) + 1)) + 950
);

const getRandomSearchId = () => (
  Math.floor(Math.random() * ((400000 - 1000) + 1)) + 1000
);

const getRandomPricePerNight = () => {
  const chance = getChance();
  let price;

  if (chance < 40) {
    price = Math.ceil(Math.random() * 12) * 10;
  } else if (chance >= 40 && chance < 80) {
    price = Math.ceil((Math.random() * ((25 - 12) + 1)) + 12) * 10;
  } else if (chance >= 80 && chance < 95) {
    price = Math.ceil((Math.random() * ((50 - 25) + 1)) + 25) * 10;
  } else {
    price = Math.ceil((Math.random() * ((80 - 50) + 1)) + 50) * 10;
  }

  return price;
};

const formatDate = (year, month, day) => {
  const mo = (`0${month}`).slice(-2);
  const d = (`0${day}`).slice(-2);

  return `${year}-${mo}-${d}`;
};

/* ----- END HELPER FUNCTIONS ----- */

//  eventually I will add a condition for users to generate more search actions
const generateUserHits = () => {
  const userHits = {};
  const userId = getRandomUserId();
  const visits = getVisitsAndCountUser();
  const bookings = getNumOfBookingsForUser(visits);
  const visitsThatBooked = getVisitsThatBooked(bookings, visits);

  userHits.USER_ID = userId;
  userHits.USER_VISITS = [];

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

        userHits.USER_VISITS.push(hitsDetailsForVisit); //  end of current visit, push into array
        hit += 1;
      } else {
        hitsDetailsForVisit[hit] = 'view_listing_details';
        hit += 1;
      }
    }
  }

  return userHits;
};

const getRandomBookedDatesAndPrice = () => {
  const numNights = getNumNightsBooked();
  const startDay = (Math.ceil(Math.random() * 23)).toString();
  const checkIn = formatDate('2017', CURRENT_MONTH, startDay);
  const endDay = (parseInt(startDay, 10) + numNights).toString();
  const checkOut = formatDate('2017', CURRENT_MONTH, endDay);
  const perNightPrice = getRandomPricePerNight();
  const totalPrice = perNightPrice * numNights;

  return [checkIn, checkOut, totalPrice, perNightPrice];
};

/* ----- END DATA GENERATION FUNCTIONS ----- */
/* ----- START DATA INSERTION FUNCTIONS ----- */

const populateBookingsTable = (userId, visitNum, searchId, listingId) => {
  const datesAndPrice = getRandomBookedDatesAndPrice();
  const checkIn = datesAndPrice[0];
  const checkOut = datesAndPrice[1];
  const totalPrice = datesAndPrice[2];
  const avgPrice = datesAndPrice[3];


  addBooking(listingId, checkIn, checkOut, totalPrice, avgPrice, userId, visitNum, searchId);
};

const populateUserHitsTable = () => {
  const userObj = generateUserHits();
  const userId = userObj.USER_ID;
  const userVisits = userObj.USER_VISITS;

  for (let v = 0; v < userVisits.length; v += 1) {
    const numHitsForVisit = Object.keys(userVisits[v]).length;

    for (let h = 1; h <= numHitsForVisit; h += 1) {
      const listingId = getRandomListingId();
      if ((h === numHitsForVisit) && (userVisits[v][h] === 'book')) {
        populateBookingsTable(userId, v + 1, 'tempSearchId', listingId);
      } else {
        addUserGeneralActions(userId, v + 1, userVisits[v][h], 'tempSearchId', listingId);
      }
    }
  }
};

for (let i = 0; i < 1000; i += 1) {
  populateUserHitsTable();
}