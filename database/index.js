const { client } = require('./config');

const addBooking = (listingId, checkIn, checkOut, totalPrice, avgPrice) => {
  const queryString = `INSERT INTO bookings (listing_id, check_in, check_out, total_price, avg_price_per_night) values (${listingId}, '${checkIn}', '${checkOut}', '$${totalPrice}', '$${avgPrice}')`;

  client.query(queryString)
    .then(res => console.log(res.rows[0]))
    .catch(err => console.error(err));
}

module.exports.addBooking = addBooking;