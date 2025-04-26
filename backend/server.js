const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const path = require('path');
const pool = require('./db'); 
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/users', userRoutes);

// Mở trang chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Route xử lý login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT * FROM users WHERE username = ?', [username]
    );
    conn.release();

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password); // ✅ so sánh đúng cách

      if (isMatch) {
        res.json({ role: user.role }); // đúng mật khẩu
      } else {
        res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
      }
    } else {
      res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Server chạy
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
