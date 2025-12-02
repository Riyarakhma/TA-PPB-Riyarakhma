import pg from 'pg';
import dotenv from 'dotenv';
import { books } from './seed-data.js'; 

dotenv.config({ path: '../.env' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

// USER DEFAULT
const DEFAULT_USER = {
  id: '21120123140168',
  name: 'Riyarakhma Febriana',
  nim: '21120123140168',
  group: 'Teknik Komputer',
  email: 'riyarakhma@example.com',
  profilePicUrl: null,
};

async function seedDatabase() {
  console.log('----------------------------------------');
  console.log('🚀 Memulai proses seeding...');
  console.log('----------------------------------------');

  const client = await pool.connect();

  try {
    // 1. Kosongkan favorites
    console.log('🧹 Menghapus tabel user_favorites...');
    await client.query(`TRUNCATE TABLE user_favorites RESTART IDENTITY CASCADE;`);
    console.log('✔ user_favorites dikosongkan.');

    // 2. Insert / update user default
    console.log('👤 Menambahkan user default...');
    await client.query(
      `
      INSERT INTO users (id, name, nim, "group", email, profilePicUrl)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE 
        SET name = EXCLUDED.name,
            nim = EXCLUDED.nim,
            "group" = EXCLUDED.group,
            email = EXCLUDED.email,
            profilePicUrl = EXCLUDED.profilePicUrl;
    `,
      [
        DEFAULT_USER.id,
        DEFAULT_USER.name,
        DEFAULT_USER.nim,
        DEFAULT_USER.group,
        DEFAULT_USER.email,
        DEFAULT_USER.profilePicUrl,
      ]
    );
    console.log('✔ User default selesai.');

    // 3. Insert books FROM seed-data.js
    console.log(`📚 Menambahkan ${books.length} buku dari seed-data.js ...`);

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
        ON CONFLICT (id) DO NOTHING;
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

    console.log('✔ Semua buku dari seed-data.js telah dimasukkan.');

    console.log('----------------------------------------');
    console.log('🎉 SEEDING SELESAI TANPA ERROR!');
    console.log('----------------------------------------');
  } catch (err) {
    console.error('❌ ERROR saat seeding:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seedDatabase();
