const { dbClient } = require('./config');
const messageBus = require('../messageBus/index');

const addUserGeneralActions = (visitsForSearch) => {
  const { searchId, userId } = visitsForSearch[0];
  let valuesString = '';

  for (let i = 0; i < visitsForSearch.length; i += 1) {
    const { visitNum } = visitsForSearch[i];

    const hitsForVisit = visitsForSearch[i].hitsDetails.map(hit => `(${userId}, ${visitNum}, '${hit.action}', '${searchId}', ${hit.listingId})`);
    valuesString += `, ${hitsForVisit.join(', ')}`;
  }

  const queryString = `INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id) values ${valuesString}`;

  dbClient.query(queryString)
    .then(res => console.log('successfully inserted: ', res))
    .catch(err => console.error(err));

  return visitsForSearch;
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
      values (${searchId}, ${userId}, ${visitNum}, ${listingId}, '${checkIn}', '${checkOut}', '$${totalPrice}', '$${avgPrice}')
      returning *)
    INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id, booking_id)
      values (${userId}, ${visitNum}, 'book', '${searchId}', ${listingId}, (select inserted.booking_id from inserted))`;

  dbClient.query(queryString)
    .then((res) => {
      console.log('successfully inserted: ', res);
      messageBus.publishBookingEvent(bookingDetails);
    })
    .catch(err => console.error(err));

  return bookingDetails;
};

module.exports.addBooking = addBooking;
module.exports.addUserGeneralActions = addUserGeneralActions;

