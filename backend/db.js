require('dotenv').config();
const mysql = require('mysql2');

// Railway provides MYSQL_URL as a connection string automatically.
// Fall back to individual .env vars for local development.
let pool;

if (process.env.MYSQL_URL) {
  // Railway MySQL plugin: use the full URL
  pool = mysql.createPool(process.env.MYSQL_URL);
} else {
  pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'blood_donation_db',
    port:     Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0
  });
}

const promisePool = pool.promise();

promisePool.query('SELECT 1')
  .then(() => console.log('✅  MySQL connected successfully.'))
  .catch(err => console.error('❌  MySQL connection error:', err.message));

module.exports = promisePool;
