const PG = require('pg')
const Pool = require('pg-pool');
const { mode } = require('stats-lite');
require('dotenv')

const { types } = PG;

// const {
//   PRODUCTION,
//   DEV_POSTGRE_USER,
//   DEV_POSTGRE_PASSWORD,
//   DEV_POSTGRE_HOST,
//   DEV_POSTGRE_DATABASE,
//   DEV_POSTGRE_PORT,
//   PRODUCTION_POSTGRE_USER,
//   PRODUCTION_POSTGRE_PASSWORD,
//   PRODUCTION_POSTGRE_HOST,
//   PRODUCTION_POSTGRE_DATABASE,
//   PRODUCTION_POSTGRE_PORT
// } = process.env

// const config = {
//   user: PRODUCTION === 'true' ? PRODUCTION_POSTGRE_USER : DEV_POSTGRE_USER,
//   password: PRODUCTION === 'true' ? PRODUCTION_POSTGRE_PASSWORD : DEV_POSTGRE_PASSWORD,
//   host: PRODUCTION === 'true' ? PRODUCTION_POSTGRE_HOST : DEV_POSTGRE_HOST,
//   database: PRODUCTION === 'true' ? PRODUCTION_POSTGRE_DATABASE : DEV_POSTGRE_DATABASE,
//   port: PRODUCTION === 'true' ? PRODUCTION_POSTGRE_PORT : DEV_POSTGRE_PORT,
// }
const config = {
  user: 'postgres',
  password: '0Y6PP3rwir',
  host: '104.167.197.64',
  database: 'pros',
  port: 5432,
}


types.setTypeParser(1082, stringValue => stringValue);

types.setTypeParser(1083, stringValue => stringValue);

types.setTypeParser(1114, stringValue => stringValue);

const pool = new Pool(config);

module.exports = {
  pool
}