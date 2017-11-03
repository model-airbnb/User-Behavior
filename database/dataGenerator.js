const { addBooking, addUserGeneralActions } = require('./index');

const HITS_RANGE = [3, 15];

//  Get a random number of visits for a particular user
const getRandomNumOfVisits = (MIN, MAX) => (
  Math.floor(Math.random() * ((MAX - MIN) + 1)) + MIN
);

const getVisitsForUser = () => {
  let visits;
  const chance = Math.ceil(Math.random() * 100);

  if (chance <= 55) {
    visits = getRandomNumOfVisits(1, 7);
  } else if (chance > 55 && chance <= 92) {
    visits = getRandomNumOfVisits(8, 13);
  } else {
    visits = getRandomNumOfVisits(14, 20);
  }

  return visits;
};

//  Get a random number of user hits for each visit
const getRandomNumOfHits = () => (
  Math.floor(Math.random() * ((HITS_RANGE[1] - HITS_RANGE[0]) + 1)) + HITS_RANGE[0]
);

//  the next few functions are for determining if a user booked within their search
const getChance = () => (Math.random() * 100).toFixed(2);

const getChanceForBooked = (visits) => {
  if (visits === 1) {
    return 30;
  } else if (visits >= 2 && visits <= 7) {
    return ((21 - visits) * visits);
  } else if (visits >= 8 && visits <= 13) {
    return 98 + (((visits - 8) * 2) / 10);
  }

  return 99 + ((visits - 13) / 10);
};

const isBooked = (visits) => {
  const chance = getChance();
  const bookedChance = getChanceForBooked(visits);

  if (chance < bookedChance) {
    return true;
  }

  return false;
};

/* ----- END HELPER FUNCTIONS ----- */

const generateUserBooking = (searchId, visitNum, userId, checkIn, checkOut, listing) => {
  const datesBooked = listing.nightlyPrices.map(day => (
    day.date
  ));

  const prices = listing.nightlyPrices.map(day => (
    parseInt(day.price.slice(1), 10)
  ));

  const totalPrice = prices.reduce((sum, value) => sum + value, 0);
  const avgPrice = (totalPrice / prices.length).toFixed(2);

  const bookingDetails = {
    searchId,
    visitNum,
    userId,
    listingId: listing.listingId,
    checkIn,
    checkOut,
    datesBooked,
    totalPrice,
    avgPrice,
    is_available: 0,
  };

  addBooking(bookingDetails); // add to PostgresQL
  // function to send to SQS
};

//  when a user conducts a search (get request to SQS for a search doc)
const generateUserHits = (searchObj) => {
  const searchId = searchObj.payload.searchEventId;
  const { userId, checkIn, checkOut } = searchObj.payload.request;
  const searchResults = searchObj.payload.results;

  const visits = getVisitsForUser();
  const booked = searchResults.length >= 1 ? isBooked() : false;

  const visitsForSearch = [];

  for (let v = 1; v <= visits; v += 1) {
    const hitsForVisit = getRandomNumOfHits();
    let hit = 1;

    const hitsDetailsForVisit = {
      searchId,
      userId,
      visitNum: v,
      hitsDetails: [],
    };

    while (hit <= hitsForVisit) {
      const hitDetail = {
        action: '',
        listingId: '',
      };

      const listing = searchResults[Math.floor(Math.random() * searchResults.length)];

      if (v === visits && hit === hitsForVisit && booked) {
        hitDetail.action = 'book';
        generateUserBooking(searchId, v, userId, checkIn, checkOut, listing);
      } else {
        hitDetail.action = 'view_listing_details';
      }

      hitDetail.listingId = listing.listingId;
      hitsDetailsForVisit.hitsDetails.push(hitDetail);
      hit += 1;
    }

    visitsForSearch.push(hitsDetailsForVisit);
  }

  addUserGeneralActions(visitsForSearch);
  // function to add to ElasticSearch here
};

/* ----- END DATA GENERATION FUNCTIONS ----- */
