const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

module.exports.bulkInsertDocuments = (index, type, docs) => {
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

  return esClient.bulk({ body });
};
