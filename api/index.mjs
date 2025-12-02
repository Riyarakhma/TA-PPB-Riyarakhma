import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load env vars
dotenv.config({ path: '../.env' });

const app = express();

// Konfigurasi CORS agar frontend bisa akses
app.use(cors({
  origin: '*', // Di production, sebaiknya ganti dengan URL frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- Database Connection ---
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

// --- Cloudinary Configuration ---
// Pastikan variabel ini ada di Vercel Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Storage (Cloudinary) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'litly-profiles', // Nama folder di Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Opsional: resize gambar
  },
});

const upload = multer({ storage: storage });

// --- AUTH ROUTES ---

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, nim, group, email, password } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [nim]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User dengan NIM ini sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (id, name, nim, "group", email, password, profilePicUrl)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, nim, "group", email, profilePicUrl`,
      [nim, name, nim, group, email, hashedPassword, null]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Register Error:", err);
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

    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Login error' });
  }
});

// --- EXISTING ROUTES ---

// Get All Books
app.get('/api/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Books Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Profile
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT id, name, nim, "group", email, profilePicUrl FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Profile Info
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
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload Profile Pic (Updated for Cloudinary)
app.post('/api/profile/:userId/upload-pic', upload.single('profilePic'), async (req, res) => {
  const { userId } = req.params;

  // Jika menggunakan CloudinaryStorage, req.file akan berisi informasi dari Cloudinary
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    // req.file.path akan berisi URL gambar aman (https) dari Cloudinary
    const fileUrl = req.file.path; 

    const result = await pool.query(
      'UPDATE users SET profilePicUrl = $1 WHERE id = $2 RETURNING id, name, nim, "group", email, profilePicUrl',
      [fileUrl, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Favorites Routes
app.get('/api/favorites/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query('SELECT bookId FROM user_favorites WHERE userId = $1', [userId]);
    res.json(result.rows.map((row) => row.bookid));
  } catch (err) {
    console.error("Get Favorites Error:", err);
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
    console.error("Add Favorite Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/favorites/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    await pool.query('DELETE FROM user_favorites WHERE userId = $1 AND bookId = $2', [userId, bookId]);
    res.status(200).json({ success: true, bookId });
  } catch (err) {
    console.error("Delete Favorite Error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start Server (Only for local dev)
if (!process.env.VERCEL_ENV) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`[API] Server listening on http://localhost:${port}`);
  });
}

export default app;