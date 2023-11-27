require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3001;
const authRouter = require('./prisma/routers/auth');

app.use(express.json());

app.use(authRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
