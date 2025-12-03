require('dotenv').config();
const mysql = require('mysql2');
const util = require('util');

// Create connection pool with production-ready configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: process.env.NODE_ENV === 'production' ? 5 : 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: process.env.NODE_ENV === 'production' ? 60000 : 10000,
  acquireTimeout: process.env.NODE_ENV === 'production' ? 60000 : 10000,
  timeout: process.env.NODE_ENV === 'production' ? 60000 : 10000,
  charset: 'utf8mb4',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Event listeners
pool.on('connection', () => console.log('🔗 New connection created in pool'));
pool.on('acquire', () => console.log('📥 Connection acquired from pool'));
pool.on('release', () => console.log('📤 Connection released back to pool'));
pool.on('enqueue', () => console.log('⏳ Waiting for available connection slot'));

// Test pool connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Pool Connection Failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Error Details:', err);
    console.error('\n📋 Current Database Config:');
    console.error('Host:', process.env.DB_HOST);
    console.error('User:', process.env.DB_USER);
    console.error('Database:', process.env.DB_NAME);
    console.error('Port:', process.env.DB_PORT || 3306);
    console.error('\n⚠️  Backend is running but database connection failed!');
    // Don't exit, let the server run
    // process.exit(1);
  } else {
    console.log('✅ MySQL Pool Connected!');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);
    connection.release();
  }
});

// Health check function
pool.healthCheck = function () {
  return new Promise((resolve, reject) => {
    this.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Health check failed:', err.message);
        reject(err);
        return;
      }

      connection.ping((pingErr) => {
        connection.release();
        if (pingErr) {
          console.error('❌ Ping failed:', pingErr.message);
          reject(pingErr);
        } else {
          console.log('✅ Health check passed');
          resolve(true);
        }
      });
    });
  });
};

// 🔹 Convert pool methods to return Promise with proper destructuring
const originalExecute = pool.execute.bind(pool);
const originalQuery = pool.query.bind(pool);

pool.execute = (sql, params) => {
  return new Promise((resolve, reject) => {
    originalExecute(sql, params, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve([rows, fields]);
      }
    });
  });
};

pool.query = (sql, params) => {
  return new Promise((resolve, reject) => {
    originalQuery(sql, params, (err, rows, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve([rows, fields]);
      }
    });
  });
};

module.exports = pool;
