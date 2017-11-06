const elasticSearch = require('./index');

const ES_HITS_INDEX = 'user-hits';

module.exports.processUserHits = (hits) => {
  elasticSearch.bulkInsertDocuments(ES_HITS_INDEX, hits);
};

module.exports.processUserBookings = (booking) => {
  const bookingHit = {
    user_id: booking.userId,
    visit_num: booking.visitNum,
    action_type: 'book',
    search_id: booking.searchId,
    listing_id: booking.listingId,
  };

  const bookingDetails = {
    search_id: booking.searchId,
    user_id: booking.userId,
    visit_num: booking.visitNum,
    listing_id: booking.listingId,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    total_price: booking.totalPrice,
    avg_price_per_night: booking.avgPrice,
  };

  elasticSearch.insertBookingHitAndDetails(bookingHit, bookingDetails);
};
