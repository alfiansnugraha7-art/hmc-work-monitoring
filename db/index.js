// ====================================================================
// HMC GROUP - WORK MONITORING CENTER
// PostgreSQL Database Connection Pool Service (pg)
// ====================================================================

const { Pool } = require('pg');

// Environment variables fallback for local & VPS production
const pool = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
  user: process.env.PGUSER || process.env.DB_USER || 'postgres',
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
  database: process.env.PGDATABASE || process.env.DB_NAME || 'hmc_work_monitoring',
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
  max: 20, // max pool clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('🐘 PostgreSQL Database pool connected successfully!');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
