const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

esClient.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

module.exports.esClient = esClient;
