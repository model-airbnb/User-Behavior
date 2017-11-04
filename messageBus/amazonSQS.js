const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
  accessKeyId: config.accessKey,
  secretAccessKey: config.secretKey,
});

const sqs = new AWS.SQS({ region: config.region });
const { subscriber } = config;

const MAX_NUMBER_OF_MESSAGES_TO_RECEIVE = 10;
const MESSAGE_VISIBILITY_TIMEOUT = 10;


module.exports.publish = (message) => {
  const sqsParams = {
    QueueUrl: subscriber,
    MessageBody: JSON.stringify(message),
  };

  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log('success!', data);
    }
  });
};

module.exports.consume = () => {
  const sqsParams = {
    QueueUrl: config.queue,
    AttributeNames: ['All'],
    MaxNumberOfMessages: MAX_NUMBER_OF_MESSAGES_TO_RECEIVE,
    VisibilityTimeout: MESSAGE_VISIBILITY_TIMEOUT,
  };

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(sqsParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports.done = (message) => {
  const sqsParams = {
    QueueUrl: config.queue,
    ReceiptHandle: message.ReceiptHandle,
  };

  sqs.deleteMessage(sqsParams, (err) => {
    if (err) throw err;
  });
};
