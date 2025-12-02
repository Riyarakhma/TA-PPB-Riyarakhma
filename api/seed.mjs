import pg from 'pg';
import dotenv from 'dotenv';
import { books } from './seed-data.js';

dotenv.config({ path: '../.env' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

async function seedDatabase() {
  console.log('----------------------------------------');
  console.log('🚀 Memulai proses seeding (Hanya Buku)...');
  console.log('----------------------------------------');

  const client = await pool.connect();

  try {
    // Kita TIDAK menghapus user_favorites atau users agar data registrasi aman.
    // Kita hanya akan memperbarui atau menambahkan buku.

    console.log(`📚 Memproses ${books.length} buku dari seed-data.js ...`);

    for (const b of books) {
      await client.query(
        `
        INSERT INTO books (
          id, title, author, year, cover, description, category, pages,
          isbn, price, publisher, publicationDate, format, dimensions,
          synopsis, purchaseUrl
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,
          $9,$10,$11,$12,$13,$14,$15,$16
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          author = EXCLUDED.author,
          year = EXCLUDED.year,
          cover = EXCLUDED.cover,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          pages = EXCLUDED.pages,
          isbn = EXCLUDED.isbn,
          price = EXCLUDED.price,
          publisher = EXCLUDED.publisher,
          publicationDate = EXCLUDED.publicationDate,
          format = EXCLUDED.format,
          dimensions = EXCLUDED.dimensions,
          synopsis = EXCLUDED.synopsis,
          purchaseUrl = EXCLUDED.purchaseUrl;
      `,
        [
          b.id,
          b.title,
          b.author,
          b.year,
          b.cover,
          b.description,
          b.category,
          b.pages,
          b.isbn,
          b.price,
          b.publisher,
          b.publicationDate,
          b.format,
          b.dimensions,
          b.synopsis,
          b.purchaseUrl,
        ]
      );
    }

    console.log('✔ Tabel buku telah disinkronisasi.');
    console.log('----------------------------------------');
    console.log('🎉 SEEDING SELESAI!');
    console.log('----------------------------------------');
  } catch (err) {
    console.error('❌ ERROR saat seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();