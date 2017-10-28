const config = {
  host: process.env.PGHOST || 'localhost',
  port: process.env.PORT || '5000',
  user: process.env.PGUSER || 'postgres',
  database: process.env.PGDATABASE || 'userstream',
  password: process.env.PGPASSWORD || 'qdot',
};

module.exports = config;

const {
  host, port, user, database, password,
} = config;

module.exports.pgConnection = `postgresql://${user}:${password}@${host}:${port}/postgres`;
module.exports.dbConnection = `postgresql://${user}:${password}@${host}:${port}/inventory`;
module.exports.testDbConnection = `postgresql://${user}:${password}@${host}:${port}/${database}`;