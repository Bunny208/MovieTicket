const pool = require('../db');

async function createUser(username, password) {
  const conn = await pool.getConnection();
  try {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await conn.query(sql, [username, password]);
  } finally {
    conn.release();
  }
}

async function findUserByUsername(username) {
  const conn = await pool.getConnection();
  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const rows = await conn.query(sql, [username]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}


module.exports = {
  createUser,
  findUserByUsername
};