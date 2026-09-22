require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'blood_donation_db',
  port:     Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit:    2,   // low for serverless
  queueLimit:         0,
  // SSL — required for TiDB Cloud, ignored for localhost
  ssl: (process.env.DB_SSL === 'true')
    ? { rejectUnauthorized: true }
    : undefined
});

const promisePool = pool.promise();

promisePool.query('SELECT 1')
  .then(() => console.log(' MySQL connected.'))
  .catch(err => console.error(' MySQL error:', err.message));

module.exports = promisePool;
