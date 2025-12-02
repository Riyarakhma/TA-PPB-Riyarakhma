import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// --- Database (Neon / PostgreSQL) ---
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

// --- Ensure uploads directory exists ---
const uploadsDir = path.join(process.cwd(), 'api', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// --- Serve static uploaded files ---
app.use('/uploads', express.static(uploadsDir));

// --- Multer (disk storage) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    // userId + timestamp + ext
    const userId = req.params.userId || 'anon';
    const name = `user_${userId}_${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// --- ROUTES ---

// Get all books (existing)
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET profile by userId
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      // If not exists, optionally create a minimal user row so frontend has something
      // (optional) — here we return 404
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update profile (name, nim, group, email)
app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, nim, group, email } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, nim = $2, "group" = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, nim, group, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST upload profile pic (multipart/form-data key: profilePic)
app.post('/api/profile/:userId/upload-pic', upload.single('profilePic'), async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // Build public URL for the uploaded file
    // If running locally: http://localhost:4000/uploads/filename
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update DB
    const result = await pool.query(
      'UPDATE users SET profilePicUrl = $1 WHERE id = $2 RETURNING *',
      [fileUrl, userId]
    );

    if (result.rows.length === 0) {
      // Optionally delete file if user not found
      fs.unlinkSync(path.join(uploadsDir, req.file.filename));
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// === Favorites endpoints (keep existing) ===
app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT bookId FROM user_favorites WHERE userId = $1', [userId]);
    res.json(result.rows.map((row) => row.bookid));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ error: 'bookId is required' });
  }

  try {
    await pool.query(
      'INSERT INTO user_favorites (userId, bookId) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, bookId]
    );
    res.status(201).json({ success: true, bookId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/favorites/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await pool.query('DELETE FROM user_favorites WHERE userId = $1 AND bookId = $2', [userId, bookId]);
    res.status(200).json({ success: true, bookId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Start server locally and export for Vercel ---
if (!process.env.VERCEL_ENV) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`[API] Server listening on http://localhost:${port}`);
  });
}

export default app;
