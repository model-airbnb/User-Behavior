const { dbClient } = require('./config');
const messageBus = require('../messageBus/helpers');
const elasticSearch = require('../elasticSearch/helpers');

const addUserGeneralActions = (visitsForSearch) => {
  const { searchId, userId } = visitsForSearch[0];
  let valuesString = '';
  const totalHits = [];

  for (let i = 0; i < visitsForSearch.length; i += 1) {
    const { visitNum } = visitsForSearch[i];
    const hitsValues = [];

    visitsForSearch[i].hitsDetails.forEach((hit) => {
      hitsValues.push(`(${userId}, ${visitNum}, '${hit.action}', '${searchId}', ${hit.listingId})`);
      totalHits.push({
        user_id: userId,
        visit_num: visitNum,
        action_type: hit.action,
        search_id: searchId,
        listing_id: hit.listingId,
      });
    });

    valuesString += `,${hitsValues.join(',')}`;
  }

  const queryString = `INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id) VALUES ${valuesString.substring(1)}`;

  dbClient.query(queryString)
    .then((res) => {
      console.log('successfully inserted user_hits into PG');
      elasticSearch.processUserHits(totalHits);
    })
    .catch(err => console.error(err));
};

const addBooking = (bookingDetails) => {
  const {
    searchId,
    userId,
    visitNum,
    listingId,
    checkIn,
    checkOut,
    totalPrice,
    avgPrice,
  } = bookingDetails;

  const queryString = `with inserted as
    (INSERT INTO bookings (search_id, user_id, visit_num, listing_id, check_in, check_out, total_price, avg_price_per_night)
      VALUES ('${searchId}', ${userId}, ${visitNum}, ${listingId}, '${checkIn}', '${checkOut}', '$${totalPrice}', '$${avgPrice}')
      returning *)
    INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id, booking_id)
      VALUES (${userId}, ${visitNum}, 'book', '${searchId}', ${listingId}, (select inserted.booking_id from inserted))`;

  dbClient.query(queryString)
    .then((res) => {
      console.log('successfully inserted bookings into PG');
      elasticSearch.processUserBookings(bookingDetails);
      messageBus.createBookingMessage(bookingDetails);
    })
    .catch(err => console.error(err));
};

module.exports.addBooking = addBooking;
module.exports.addUserGeneralActions = addUserGeneralActions;

