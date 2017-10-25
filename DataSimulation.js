const USER_ID_RANGE = 100000;
const VISITS_RANGE = 30;
const HITS_RANGE = 25;

const USER_VISITS_COUNT = {
  1: 0, //  1-7, max 30000
  2: 0, //  8-12, max 50000
  3: 0, //  13-20, max 15000
  4: 0, //  20+ max 5000
};

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

const countUserVisits = () => {
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
    countUserVisits();
  }

  return visits;
};

const getMaxBookings = (visits) => {
  let maxBookings = 0;

  if (visits <= 7) {
    maxBookings = (Math.round(visits * 0.3));
  } else if ((visits >= 8) && (visits <= 12)) {
    maxBookings = (Math.round(visits * 0.25));
  } else if ((visits >= 13) && (visits <= 20)) {
    maxBookings = (Math.round(visits * 0.20));
  } else {
    maxBookings = (Math.round(visits * 0.15));
  }

  return maxBookings;
};

const tempUserStream = {};

const firstVisit = () => {
  const firstVisitActions = {
    1: 'search',
    2: 'view_listing_details',
  };

  return firstVisitActions;
};

const lastHit = (visits) => {
  const bookingChance = Math.random() * 100;
  let booked = false;

  if (visits <= 7) {
    if (bookingChance <= 30) {
      booked = true;
    }
  } else if ((visits >= 8) && (visits <= 12)) {
    if ((bookingChance >= 31) && (bookingChance <= 55)) {
      booked = true;
    }
  } else if ((visits >= 15) && (visits <= 20)) {
    if ((bookingChance >= 57) && (bookingChance <= 85)) {
      booked = true;
    }
  } else {
    booked = true;
  }

  return booked;
};

const populateUserStream = () => {
  const userId = getRandomUserId();
  const visits = countUserVisits();
  let maxBookings = getMaxBookings(visits);

  tempUserStream[userId] = [];

  for (let v = 0; v < visits; v += 1) {
    const hitsForVisit = getRandomNumOfHits();
    let hitsDetailsForVisit = {};
    let hit = 1;

    while (hit <= hitsForVisit) {
      if (v === 0 && hit === 1) {
        hitsDetailsForVisit = firstVisit();
        hit += 2;
      } else if (hit === hitsForVisit) {
        if (lastHit(visits) && maxBookings > 0) {
          hitsDetailsForVisit[hit] = 'booked';
          maxBookings -= 1;
        } else {
          hitsDetailsForVisit[hit] = 'view_listing_details';
        }
        tempUserStream[userId].push(hitsDetailsForVisit);
        hit += 1;
      } else {
        hitsDetailsForVisit[hit] = 'view_listing_details';
        hit += 1;
      }
    }
  }

  return tempUserStream;
};

// console.log(populateUserStream()[1]);
