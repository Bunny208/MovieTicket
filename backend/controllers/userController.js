const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Thiếu username hoặc password.');
  }

  const existingUser = await userModel.findUserByUsername(username);
  if (existingUser) {
    return res.status(400).send('Username đã tồn tại.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser(username, hashedPassword);

  res.status(201).send('Đăng ký thành công.');
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Thiếu username hoặc password.');
  }

  const user = await userModel.findUserByUsername(username);
  if (!user) {
    return res.status(400).send('Sai tài khoản hoặc mật khẩu.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Sai tài khoản hoặc mật khẩu.');
  }

  res.status(200).json({
    message: 'Đăng nhập thành công.',
    role: user.role 
  });
}

module.exports = {
  register,
  login
};
