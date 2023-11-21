const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

require('dotenv').config();

const saltRounds = 10;
const PORT = 3001;

const prisma = new PrismaClient();

app.use(express.json());

// 新規ユーザ登録API
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.json(user);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res.status(404).json({
      message: 'アカウントが存在しません。',
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      message: 'メールアドレス、もしくはパスワードが正しくありません。',
    });
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  return res.json({ token });
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
