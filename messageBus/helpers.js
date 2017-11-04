const sqs = require('./amazonSQS');
const dataGenerator = require('../database/dataGenerator');

module.exports.createBookingMessage = (bookingDetails) => {
  const {
    searchId,
    userId,
    listingId,
    datesBooked,
    totalPrice,
  } = bookingDetails;

  const bookingMessage = {
    searchId,
    userId,
    listingId,
    datesBooked,
    totalPrice,
    is_available: 0,
  };

  sqs.publish(bookingMessage);
};

module.exports.sendSearchInfo = () => {
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

module.exports.sendSearchInfo();