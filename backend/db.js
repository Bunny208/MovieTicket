const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',     
    user: 'root',          
    password: '123', 
    database: 'movie_db', 
    connectionLimit: 5,
    port: 3307
});
async function testConnection() {
    try {
        const conn = await pool.getConnection();
        console.log('Kết nối đến MariaDB thành công!');
        conn.release(); 
    } catch (err) {
        console.error('Lỗi kết nối đến MariaDB:', err);
    }
}
testConnection(); 
module.exports = pool;
