import cors from 'cors';
import express from 'express';

const app = express();
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ name, email, password });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
