const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports.bulkInsertDocuments = (index, docs) => {
  const body = [];
  const action = {
    index: {
      _index: index,
      _type: 'external',
    },
  };

  docs.forEach((doc) => {
    body.push(action);
    body.push(doc);
  });

  return esClient.bulk({ body })
    .then((res) => {
      console.log('successfully imported into ES');
    })
    .catch((err) => {
      console.error('there was an error', err);
    });
};

module.exports.insertBookingHitAndDetails = (hit, booking) => {
  const hitAction = {
    index: {
      _index: 'user-hits',
      _type: 'external',
    },
  };

  const bookingAction = {
    index: {
      _index: 'user-bookings',
      _type: 'external',
    },
  };

  const body = [hitAction, hit, bookingAction, booking];
  return esClient.bulk({ body })
    .then((res) => {
      console.log('successfully imported into ES');
    })
    .catch((err) => {
      console.error('there was an error', err);
    });
};
