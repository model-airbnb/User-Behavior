const { client } = require('./config');

const addUserGeneralActions = (userId, visitNum, actionType, searchId, listingId) => {
  const queryString = `INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id) values (${userId}, ${visitNum}, ${actionType}, ${searchId}, ${listingId})`;
};

const addBooking = (listingId, checkIn, checkOut, totalPrice, avgPrice, userId, visitNum, searchId) => {
  const queryString = `with inserted as (
    INSERT INTO bookings (listing_id, check_in, check_out, total_price, avg_price_per_night)
    values (${listingId}, '${checkIn}', '${checkOut}', '$${totalPrice}', '$${avgPrice}')
    returning *
    )
    INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id, booking_id)
    values (${userId}, ${visitNum}, 'book', ${searchId}, ${listingId}, (select inserted.booking_id from inserted))`;

  client.query(queryString)
    .then(res => console.log(res))
    .catch(err => console.error(err));
};

// const addUserBookingAction = (userId, visitNum, searchId, listingId, bookingId) => {
//   const queryString = `INSERT INTO user_hits (user_id, visit_num, action_type, search_id, listing_id, booking_id) values (${userId}, ${visitNum}, 'book', ${searchId}, ${listingId}, ${bookingId})`;
// };

module.exports.addBooking = addBooking;
