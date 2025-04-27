const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

async function register(req, res) {
  const { username, password, email, full_name } = req.body;
  if (!username || !password || !email || !full_name) {
    return res.status(400).send('Thiếu thông tin đăng ký.');
  }

  try {
    const existingUser = await userModel.findUserByUsername(username);
    if (existingUser !== null) {
      return res.status(400).send('Username đã tồn tại.');
    }

    const existingEmail = await userModel.findUserByEmail(email);
    if (existingEmail !== null) {
      return res.status(400).send('Email đã tồn tại.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(username, hashedPassword, email, full_name);

    res.status(201).send('Đăng ký thành công.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi máy chủ.');
  }
}
async function login(req, res) {
  const { username, password } = req.body;
  console.log('Login request received for username:', username);
  if (!username || !password) {
    console.log('Missing username or password in login request');
    return res.status(400).send('Thiếu username hoặc password.');
  }

  try {
    const user = await userModel.findUserByUsername(username);
    console.log('User data retrieved for login:', user);
    if (!user) {
      console.log('User not found during login for username:', username);
      return res.status(400).send('Sai tài khoản hoặc mật khẩu.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid for username', username, ':', isPasswordValid);
    if (!isPasswordValid) {
      console.log('Invalid password for username:', username);
      return res.status(400).send('Sai tài khoản hoặc mật khẩu.');
    }

    const response = {
      message: 'Đăng nhập thành công.',
      role: user.role,
      username: user.username,
      full_name: user.full_name,
      email: user.email || ''
    };
    console.log('Login API response sent:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Lỗi máy chủ.');
  }
}
module.exports = {
  register,
  login
};
