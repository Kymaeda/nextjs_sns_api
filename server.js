const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const app = express();

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

  // TODO: jwtを使ってトークンを発行する
  return res.json(user);
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
