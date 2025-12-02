import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// --- Database ---
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

// --- Uploads Setup ---
const uploadsDir = path.join(process.cwd(), 'api', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const userId = req.params.userId || 'anon';
    cb(null, `user_${userId}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// --- AUTH ROUTES ---

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, nim, group, email, password } = req.body;

  try {
    // Cek apakah NIM/ID sudah ada
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [nim]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User dengan NIM ini sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru (ID menggunakan NIM)
    const newUser = await pool.query(
      `INSERT INTO users (id, name, nim, "group", email, password, profilePicUrl)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, nim, "group", email, profilePicUrl`,
      [nim, name, nim, group, email, hashedPassword, null]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registrasi gagal' });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { nim, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [nim]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User tidak ditemukan' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Password salah' });
    }

    // Kembalikan data user (tanpa password)
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login error' });
  }
});

// --- EXISTING ROUTES ---

app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT id, name, nim, "group", email, profilePicUrl FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, nim, group, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, nim = $2, "group" = $3, email = $4 WHERE id = $5 RETURNING id, name, nim, "group", email, profilePicUrl',
      [name, nim, group, email, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/profile/:userId/upload-pic', upload.single('profilePic'), async (req, res) => {
  const { userId } = req.params;
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const result = await pool.query(
      'UPDATE users SET profilePicUrl = $1 WHERE id = $2 RETURNING id, name, nim, "group", email, profilePicUrl',
      [fileUrl, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT bookId FROM user_favorites WHERE userId = $1', [userId]);
    res.json(result.rows.map((row) => row.bookid));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;
  try {
    await pool.query(
      'INSERT INTO user_favorites (userId, bookId) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, bookId]
    );
    res.status(201).json({ success: true, bookId });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/favorites/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await pool.query('DELETE FROM user_favorites WHERE userId = $1 AND bookId = $2', [userId, bookId]);
    res.status(200).json({ success: true, bookId });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (!process.env.VERCEL_ENV) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`[API] Server listening on http://localhost:${port}`);
  });
}

export default app;