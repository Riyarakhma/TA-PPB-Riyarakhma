import dotenv from 'dotenv';
import pg from 'pg';
import { books } from './seed-data.js';

dotenv.config({ path: '../.env' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('Memulai proses seeding...');
    
    await client.query('TRUNCATE TABLE books RESTART IDENTITY');
    console.log('Tabel books dikosongkan.');

    for (const book of books) {
      const query = `
        INSERT INTO books (
          id, title, author, year, cover, description, category, pages, 
          isbn, price, publisher, publicationDate, format, dimensions, 
          synopsis, purchaseUrl
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, 
          $9, $10, $11, $12, $13, $14, 
          $15, $16
        )
      `;
      const values = [
        book.id,
        book.title,
        book.author,
        book.year,
        book.cover,
        book.description,
        book.category,
        book.pages,
        book.isbn,
        book.price,
        book.publisher,
        book.publicationDate,
        book.format,
        book.dimensions,
        book.synopsis,
        book.purchaseUrl
      ];
      
      await client.query(query, values);
      console.log(`- Menambahkan: ${book.title}`);
    }
    
    console.log('Seeding selesai!');
  } catch (err) {
    console.error('Error saat seeding:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();