const sqs = require('./amazonSQS');
const dataGenerator = require('../database/dataGenerator');

const MAX_WORKERS = process.argv[2] || 3;

module.exports.createBookingMessage = (bookingDetails) => {
  const {
    searchId,
    userId,
    listingId,
    datesBooked,
    totalPrice,
  } = bookingDetails;

  const bookingMessage = {
    topic: 'User Behavior',
    payload: {
      search_id: searchId,
      user_id: userId,
      listings_id: listingId,
      date: datesBooked,
      totalPrice,
      is_available: 0,
    },
  };

  sqs.publish(bookingMessage);
};

module.exports.fetchSearchInfo = () => {
  console.log('Sending search info');
  sqs.consume()
    .then(data => (
      data.Messages.map((message) => {
        sqs.done(message);
        return JSON.parse(message.Body);
      })
    ))
    .then((messages) => {
      messages.forEach((message) => {
        dataGenerator.generateUserHits(message);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendWorkers = () => {
  for (let i = 1; i <= MAX_WORKERS; i += 1) {
    module.exports.fetchSearchInfo(i);
  }
};

setInterval(sendWorkers, 6000);
