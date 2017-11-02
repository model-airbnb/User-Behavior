const { Client } = require('pg');

const config = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PORT || '5000',
  user: process.env.PGUSER || 'postgres',
  database: process.env.PGDATABASE || 'userstream',
  password: process.env.PGPASSWORD || 'qdot',
};

const dbClient = new Client(config);
dbClient.connect();


module.exports.dbClient = dbClient;
