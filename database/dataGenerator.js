const { addBooking, addUserGeneralActions } = require('./index');

const HITS_RANGE = [3, 15];

//  Get a random number of visits for a particular user
const getRandomNumOfVisits = (min, max) => (
  Math.floor(Math.random() * ((max - min) + 1)) + min
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
  }

  if (visits >= 2 && visits <= 7) {
    return ((21 - visits) * visits);
  }

  if (visits >= 8 && visits <= 13) {
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
  const datesBooked = listing.nightlyPrices.map(day => day.date);

  const prices = listing.nightlyPrices.map(day => parseInt(day.price.slice(1), 10));

  const totalPrice = prices.reduce((sum, value) => sum + value, 0);
  const avgPrice = (totalPrice / prices.length).toFixed(2);

  return {
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
};

//  when a user conducts a search (get request to SQS for a search doc)
const generateUserHits = (searchObj) => {
  const searchId = searchObj.payload.searchEventId;
  const { userId, checkIn, checkOut } = searchObj.payload.request;
  const searchResults = searchObj.payload.results;
  let bookingDetails;

  const visits = getVisitsForUser();
  const booked = searchResults.length >= 1 ? isBooked(visits) : false;

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
        bookingDetails = generateUserBooking(searchId, v, userId, checkIn, checkOut, listing);
      } else if (v === 1 && hit === 1) {
        hitDetail.action = 'search';
        hitDetail.listingId = null;
        hitsDetailsForVisit.hitsDetails.push(hitDetail);
      } else {
        hitDetail.action = 'view_listing_details';
        hitDetail.listingId = listing.listingId;
        hitsDetailsForVisit.hitsDetails.push(hitDetail);
      }

      hit += 1;
    }

    visitsForSearch.push(hitsDetailsForVisit);
  }

  addUserGeneralActions(visitsForSearch);

  if (booked) {
    addBooking(bookingDetails);
  }
  // function to add to ElasticSearch here
};

/* ----- END DATA GENERATION FUNCTIONS ----- */

const search = {"topic":"search",
"payload":{
    "searchEventId":"gt9s22lxj9gem9m4",
    "request":{
        "timestamp":"2017-11-01T02:09:29.152Z",
        "visitId":"1",
        "userId":"52490",
        "market":"Amsterdam",
        "roomType":"any",
        "limit":"25",
        "checkIn":"2017-11-27",
        "checkOut":"2017-12-04"
    },
    "results":[{
        "listingId":20168,
        "listingName":"City Centre - Private Bathroom - Lockable Studio.",
        "hostName":"Alex",
        "market":"Amsterdam",
        "neighbourhood":"Centrum-Oost",
        "roomType":"Private room",
        "nightlyPrices":[{
            "date":"2017-11-27",
            "price":"$130.00"
        },{
            "date":"2017-11-28",
            "price":"$130.00"
        },{
            "date":"2017-11-29","price":"$130.00"},{"date":"2017-11-30","price":"$130.00"},{"date":"2017-12-01","price":"$100.00"},{"date":"2017-12-02","price":"$100.00"},{"date":"2017-12-03","price":"$100.00"}],
        "averageRating":53,
        "score":0
    },{
        "listingId":25488,"listingName":"**Lovely 3 bedrooms Apartment *","hostName":"Jeff","market":"Amsterdam","neighbourhood":"Oostelijk Havengebied - Indische Buurt","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$184.00"},{"date":"2017-11-28","price":"$184.00"},{"date":"2017-11-29","price":"$184.00"},{"date":"2017-11-30","price":"$184.00"},{"date":"2017-12-01","price":"$184.00"},{"date":"2017-12-02","price":"$184.00"},{"date":"2017-12-03","price":"$184.00"}],"averageRating":86,"score":1},{"listingId":27886,"listingName":"B&B on houseboat in canal district","hostName":"Flip","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$135.00"},{"date":"2017-11-28","price":"$135.00"},{"date":"2017-11-29","price":"$135.00"},{"date":"2017-11-30","price":"$135.00"},{"date":"2017-12-01","price":"$135.00"},{"date":"2017-12-02","price":"$135.00"},{"date":"2017-12-03","price":"$135.00"}],"averageRating":95,"score":2},{"listingId":28658,"listingName":"Cosy guest room near city centre -1","hostName":"Michele","market":"Amsterdam","neighbourhood":"Bos en Lommer","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$70.00"},{"date":"2017-11-28","price":"$70.00"},{"date":"2017-11-29","price":"$70.00"},{"date":"2017-11-30","price":"$70.00"},{"date":"2017-12-01","price":"$70.00"},{"date":"2017-12-02","price":"$70.00"},{"date":"2017-12-03","price":"$70.00"}],"averageRating":62,"score":3},{"listingId":29051,"listingName":"Comfortable single room","hostName":"Edwin","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$55.00"},{"date":"2017-11-28","price":"$55.00"},{"date":"2017-11-29","price":"$55.00"},{"date":"2017-11-30","price":"$55.00"},{"date":"2017-12-01","price":"$55.00"},{"date":"2017-12-02","price":"$55.00"},{"date":"2017-12-03","price":"$55.00"}],"averageRating":97,"score":4},{"listingId":31080,"listingName":"2-story apartment + rooftop terrace","hostName":"Nienke","market":"Amsterdam","neighbourhood":"Zuid","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$219.00"},{"date":"2017-11-28","price":"$219.00"},{"date":"2017-11-29","price":"$219.00"},{"date":"2017-11-30","price":"$219.00"},{"date":"2017-12-01","price":"$219.00"},{"date":"2017-12-02","price":"$219.00"},{"date":"2017-12-03","price":"$219.00"}],"averageRating":18,"score":5},{"listingId":41125,"listingName":"Amsterdam Center Entire Apartment","hostName":"Fatih","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$110.00"},{"date":"2017-11-28","price":"$110.00"},{"date":"2017-11-29","price":"$110.00"},{"date":"2017-11-30","price":"$110.00"},{"date":"2017-12-01","price":"$130.00"},{"date":"2017-12-02","price":"$130.00"},{"date":"2017-12-03","price":"$110.00"}],"averageRating":64,"score":6},{"listingId":42161,"listingName":"Beautiful Apartment in Amsterdam East","hostName":"Emiel","market":"Amsterdam","neighbourhood":"Watergraafsmeer","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$119.00"},{"date":"2017-11-28","price":"$119.00"},{"date":"2017-11-29","price":"$119.00"},{"date":"2017-11-30","price":"$119.00"},{"date":"2017-12-01","price":"$119.00"},{"date":"2017-12-02","price":"$119.00"},
        {"date":"2017-12-03","price":"$119.00"}],"averageRating":75,"score":7},{"listingId":43980,"listingName":"View into park / museum district","hostName":"Ym","market":"Amsterdam","neighbourhood":"Zuid","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$108.00"},{"date":"2017-11-28","price":"$108.00"},{"date":"2017-11-29","price":"$108.00"},{"date":"2017-11-30","price":"$108.00"},{"date":"2017-12-01","price":"$118.00"},{"date":"2017-12-02","price":"$118.00"},{"date":"2017-12-03","price":"$108.00"}],"averageRating":11,"score":8},{"listingId":44535,"listingName":"Two Private Rooms for B&B in elegant flat offered","hostName":"Gianni","market":"Amsterdam","neighbourhood":"Slotervaart","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$125.00"},{"date":"2017-11-28","price":"$125.00"},{"date":"2017-11-29","price":"$125.00"},{"date":"2017-11-30","price":"$125.00"},{"date":"2017-12-01","price":"$125.00"},{"date":"2017-12-02","price":"$125.00"},{"date":"2017-12-03","price":"$125.00"}],"averageRating":63,"score":9},{"listingId":44805,"listingName":"Bed & Batik - free bikes","hostName":"Pieter-Bas & Sophie","market":"Amsterdam","neighbourhood":"Oostelijk Havengebied - Indische Buurt","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$95.00"},{"date":"2017-11-28","price":"$95.00"},{"date":"2017-11-29","price":"$95.00"},{"date":"2017-11-30","price":"$95.00"},{"date":"2017-12-01","price":"$95.00"},{"date":"2017-12-02","price":"$95.00"},{"date":"2017-12-03","price":"$95.00"}],"averageRating":86,"score":10},{"listingId":45246,"listingName":"Cozy Flat in the Jordaan (center)","hostName":"George","market":"Amsterdam","neighbourhood":"Westerpark","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$163.00"},{"date":"2017-11-28","price":"$163.00"},{"date":"2017-11-29","price":"$163.00"},{"date":"2017-11-30","price":"$163.00"},{"date":"2017-12-01","price":"$163.00"},{"date":"2017-12-02","price":"$163.00"},{"date":"2017-12-03","price":"$163.00"}],"averageRating":14,"score":11},{"listingId":47333,"listingName":"Swaen Downtown for max 4 persons","hostName":"Riek","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$199.00"},{"date":"2017-11-28","price":"$199.00"},{"date":"2017-11-29","price":"$199.00"},{"date":"2017-11-30","price":"$199.00"},{"date":"2017-12-01","price":"$199.00"},{"date":"2017-12-02","price":"$199.00"},{"date":"2017-12-03","price":"$199.00"}],"averageRating":80,"score":12},{"listingId":48076,"listingName":"Amsterdam Central and lot of space","hostName":"Franklin","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$350.00"},{"date":"2017-11-28","price":"$350.00"},{"date":"2017-11-29","price":"$350.00"},{"date":"2017-11-30","price":"$350.00"},{"date":"2017-12-01","price":"$350.00"},{"date":"2017-12-02","price":"$350.00"},{"date":"2017-12-03","price":"$300.00"}],"averageRating":40,"score":13},{"listingId":49552,"listingName":"Historic Multatuli luxury 3bed2bath","hostName":"Joanna & MP","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$420.00"},{"date":"2017-11-28","price":"$420.00"},{"date":"2017-11-29","price":"$420.00"},
        {"date":"2017-11-30","price":"$420.00"},{"date":"2017-12-01","price":"$500.00"},{"date":"2017-12-02","price":"$500.00"},{"date":"2017-12-03","price":"$420.00"}],"averageRating":96,"score":14},{"listingId":49790,"listingName":"Luxurous Houseboat-Great Location","hostName":"Klaas","market":"Amsterdam","neighbourhood":"De Baarsjes - Oud-West","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$220.00"},{"date":"2017-11-28","price":"$220.00"},{"date":"2017-11-29","price":"$220.00"},{"date":"2017-11-30","price":"$220.00"},{"date":"2017-12-01","price":"$220.00"},{"date":"2017-12-02","price":"$220.00"},{"date":"2017-12-03","price":"$220.00"}],"averageRating":93,"score":15},{"listingId":50523,"listingName":"B & B de 9 Straatjes (city center)","hostName":"Raymond","market":"Amsterdam","neighbourhood":"Centrum-West","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$110.00"},{"date":"2017-11-28","price":"$110.00"},{"date":"2017-11-29","price":"$110.00"},{"date":"2017-11-30","price":"$110.00"},{"date":"2017-12-01","price":"$125.00"},{"date":"2017-12-02","price":"$125.00"},{"date":"2017-12-03","price":"$110.00"}],"averageRating":23,"score":16},{"listingId":53671,"listingName":"Nice room near centre with en suite bath","hostName":"Georg","market":"Amsterdam","neighbourhood":"Westerpark","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$90.00"},{"date":"2017-11-28","price":"$90.00"},{"date":"2017-11-29","price":"$90.00"},{"date":"2017-11-30","price":"$90.00"},{"date":"2017-12-01","price":"$95.00"},{"date":"2017-12-02","price":"$95.00"},{"date":"2017-12-03","price":"$95.00"}],"averageRating":94,"score":17},{"listingId":55703,"listingName":"groundfloor apartment with garden","hostName":"Arjan","market":"Amsterdam","neighbourhood":"Bos en Lommer","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$250.00"},{"date":"2017-11-28","price":"$250.00"},{"date":"2017-11-29","price":"$250.00"},{"date":"2017-11-30","price":"$250.00"},{"date":"2017-12-01","price":"$250.00"},{"date":"2017-12-02","price":"$250.00"},{"date":"2017-12-03","price":"$250.00"}],"averageRating":19,"score":18},{"listingId":55868,"listingName":"Apartment near Museumplein (centre)","hostName":"Cornelie","market":"Amsterdam","neighbourhood":"Zuid","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$125.00"},{"date":"2017-11-28","price":"$125.00"},{"date":"2017-11-29","price":"$125.00"},{"date":"2017-11-30","price":"$125.00"},{"date":"2017-12-01","price":"$149.00"},{"date":"2017-12-02","price":"$149.00"},{"date":"2017-12-03","price":"$125.00"}],"averageRating":34,"score":19},{"listingId":57811,"listingName":"A Modern City Centre apartment","hostName":"Robert","market":"Amsterdam","neighbourhood":"Centrum-Oost","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$125.00"},{"date":"2017-11-28","price":"$125.00"},{"date":"2017-11-29","price":"$125.00"},{"date":"2017-11-30","price":"$125.00"},{"date":"2017-12-01","price":"$135.00"},{"date":"2017-12-02","price":"$135.00"},{"date":"2017-12-03","price":"$125.00"}],"averageRating":80,"score":20},{"listingId":71231,"listingName":"THE AMSTERDAM EXPERIENCE !!! ","hostName":"Philipe","market":"Amsterdam","neighbourhood":"De Pijp - Rivierenbuurt","roomType":"Entire home/apt","nightlyPrices":[{"date":"2017-11-27","price":"$202.00"},
        {"date":"2017-11-28","price":"$202.00"},{"date":"2017-11-29","price":"$202.00"},{"date":"2017-11-30","price":"$202.00"},{"date":"2017-12-01","price":"$209.00"},{"date":"2017-12-02","price":"$216.00"},{"date":"2017-12-03","price":"$201.00"}],"averageRating":25,"score":21},{"listingId":75499,"listingName":"Red Studio Palamedes Amsterdam","hostName":"Edwin + Karin","market":"Amsterdam","neighbourhood":"De Baarsjes - Oud-West","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$110.00"},{"date":"2017-11-28","price":"$110.00"},{"date":"2017-11-29","price":"$110.00"},{"date":"2017-11-30","price":"$110.00"},{"date":"2017-12-01","price":"$110.00"},{"date":"2017-12-02","price":"$110.00"},{"date":"2017-12-03","price":"$110.00"}],"averageRating":93,"score":22},{"listingId":76459,"listingName":"Yellow Studio Palamedes Amsterdam","hostName":"Edwin + Karin","market":"Amsterdam","neighbourhood":"De Baarsjes - Oud-West","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$110.00"},{"date":"2017-11-28","price":"$110.00"},{"date":"2017-11-29","price":"$110.00"},{"date":"2017-11-30","price":"$110.00"},{"date":"2017-12-01","price":"$110.00"},{"date":"2017-12-02","price":"$110.00"},{"date":"2017-12-03","price":"$110.00"}],"averageRating":61,"score":23},{"listingId":81982,"listingName":"Houseboat Amstel river next to park","hostName":"Martin","market":"Amsterdam","neighbourhood":"De Pijp - Rivierenbuurt","roomType":"Private room","nightlyPrices":[{"date":"2017-11-27","price":"$105.00"},{"date":"2017-11-28","price":"$105.00"},{"date":"2017-11-29","price":"$105.00"},{"date":"2017-11-30","price":"$105.00"},{"date":"2017-12-01","price":"$108.00"},{"date":"2017-12-02","price":"$108.00"},{"date":"2017-12-03","price":"$105.00"}],"averageRating":88,"score":24}],"timeline":{"event":"httpSearchRequest","start":{"timestamp":"2017-11-01T02:09:29.152Z","msTimeLapsed":0},"dbFetch":{"timestamp":"2017-11-01T02:09:29.152Z","msTimeLapsed":0},"dbResults":{"timestamp":"2017-11-01T02:09:31.178Z","msTimeLapsed":2026},"httpSearchResponse":{"timestamp":"2017-11-01T02:09:31.180Z","msTimeLapsed":2}}}}


generateUserHits(search);
