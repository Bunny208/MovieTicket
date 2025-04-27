const pool = require('../db');

async function createUser(username, password, email, full_name) {
  const conn = await pool.getConnection();
  try {
    const sql = 'INSERT INTO users (username, password, email, full_name) VALUES (?, ?, ?, ?)';
    await conn.query(sql, [username, password, email, full_name]);
  } finally {
    conn.release();
  }
}
async function findUserByUsername(username) {
  const conn = await pool.getConnection();
  try {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const rows = await conn.query(sql, [username]);
    console.log('Database query result for username:', username);
    console.log('Rows from DB:', rows);
    if (rows.length > 0) {
      console.log('Email from DB for username', username, ':', rows[0].email);
    } else {
      console.log('No user found with username:', username);
    }
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

async function findUserByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const rows = await conn.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail
};
