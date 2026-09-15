require('dotenv').config();
const mysql = require('mysql2');

// Supports three connection modes:
// 1. MYSQL_URL      — full connection string (Railway / TiDB Cloud)
// 2. DATABASE_URL   — alternative full string (some providers)
// 3. Individual vars — DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

let pool;

const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

if (url) {
  pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit:    5,       // keep low for serverless
    queueLimit:         0,
    // TiDB Cloud requires SSL
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: true }
  });
} else {
  pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'blood_donation_db',
    port:     Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit:    5,
    queueLimit:         0
  });
}

const promisePool = pool.promise();

promisePool.query('SELECT 1')
  .then(() => console.log('✅  MySQL connected.'))
  .catch(err => console.error('❌  MySQL error:', err.message));

module.exports = promisePool;
