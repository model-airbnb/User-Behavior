const elasticSearch = require('./index');

const ES_HITS_INDEX = 'user-hits';
const ES_BOOKINGS_INDEX = 'user-bookings';

module.exports.processUserHits = (hits) => {
  console.log('HITSSSS', hits);
  elasticSearch.bulkInsertDocuments(ES_HITS_INDEX, hits)
};

module.exports.processUserBookings = (bookings) => {
  console.log('bookings', bookings);
};
