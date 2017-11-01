const { Client } = require('pg');

const config = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PORT || '5000',
  user: process.env.PGUSER || 'postgres',
  database: process.env.PGDATABASE || 'userstream',
  password: process.env.PGPASSWORD || 'qdot',
};

const client = new Client(config);
client.connect();


module.exports.client = client;

// const {
//   host, port, user, database, password,
// } = config;

// module.exports.pgConnection = `postgresql://${user}:${password}@${host}:${port}/postgres`;
// module.exports.dbConnection = process.env.DATABASE_URL || `postgresql://${user}:${password}@${host}:${port}/${database}`;
