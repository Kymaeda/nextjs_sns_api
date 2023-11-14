const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const PORT = 3001;

const prisma = PrismaClient();

// 新規ユーザ登録API
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // TODO: passwordのハッシュ化
  const user = await prisma.user.create({ data: { name, email, password } });

  return res.json(user);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
