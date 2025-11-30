import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

// --- Konfigurasi ---
dotenv.config({ path: '../.env' });
const app = express();
app.use(cors());
app.use(express.json()); // Middleware untuk parsing JSON body

// --- Konfigurasi Database (Neon) ---
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

// --- Konfigurasi Cloudinary ---
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// --- Konfigurasi Multer (Upload File) ---
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('profilePic');
const parser = new DatauriParser();

// --- API Endpoint Buku ---
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === API ENDPOINT PROFIL ===

// 1. Mendapatkan data profil pengguna
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Memperbarui data profil pengguna (teks saja)
app.put('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, nim, group, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, nim = $2, "group" = $3, email = $4 WHERE id = $5 RETURNING *',
      [name, nim, group, email, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Mengunggah gambar profil baru
app.post('/api/profile/:userId/upload-pic', multerUploads, async (req, res) => {
  const { userId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const fileExtension = path.extname(req.file.originalname).toString();
    const fileContent = parser.format(fileExtension, req.file.buffer).content;

    const result = await cloudinary.uploader.upload(fileContent, {
      folder: 'perpustakaanku_profiles',
      public_id: `user_${userId}`
    });

    const newPicUrl = result.secure_url;

    const dbResult = await pool.query(
      'UPDATE users SET profilePicUrl = $1 WHERE id = $2 RETURNING *',
      [newPicUrl, userId]
    );

    res.json(dbResult.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});


// === API ENDPOINT FAVORIT ===

// 1. Mendapatkan semua ID buku favorit pengguna
app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT bookId FROM user_favorites WHERE userId = $1', [userId]);
    res.json(result.rows.map(row => row.bookid));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Menambah buku ke favorit
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
  } catch (err)
 {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Menghapus buku dari favorit
app.delete('/api/favorites/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await pool.query(
      'DELETE FROM user_favorites WHERE userId = $1 AND bookId = $2',
      [userId, bookId]
    );
    res.status(200).json({ success: true, bookId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// --- MULAI SERVER (UNTUK LOKAL) & EKSPOR (UNTUK VERCEL) ---

// Cek jika kita TIDAK sedang di lingkungan serverless Vercel
// Jika `VERCEL_ENV` tidak ada, berarti kita ada di lokal
if (!process.env.VERCEL_ENV) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`[API] Server listening on http://localhost:${port}`);
  });
}

// Ekspor app agar Vercel tetap bisa menggunakannya
export default app;