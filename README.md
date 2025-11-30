# Lit.ly

Selamat datang di Lit.ly, sebuah aplikasi Perpustakaan Pribadi (*Personal Library*) berarsitektur *full-stack*. Aplikasi ini dibangun sebagai Progressive Web App (PWA) modern menggunakan React (Vite), TypeScript, dan Tailwind CSS untuk *frontend*, serta Node.js/Express, database Neon (PostgreSQL), dan Cloudinary untuk *backend*.

Aplikasi ini menampilkan koleksi buku, memungkinkan pengguna untuk menyimpan favorit, dan mengelola profil pengguna dengan unggahan foto kustom.

 ---

## ✨ Fitur Utama

  * **Arsitektur Full-Stack:** Frontend React terpisah yang berkomunikasi dengan API Express.js kustom.
  * **Database Cloud:** Data pengguna, profil, dan favorit disimpan secara persisten di database serverless PostgreSQL yang di-hosting oleh **Neon**.
  * **Cloud Image Upload:** Foto profil diunggah ke **Cloudinary** dan URL-nya disimpan di database.
  * **Koleksi Favorit:** Pengguna dapat menambah atau menghapus buku dari daftar favorit mereka, yang terhubung dengan akun mereka.
  * **Profil Pengguna:** Halaman profil yang dapat diedit di mana pengguna dapat memperbarui informasi pribadi dan foto profil mereka.
  * **Progressive Web App (PWA):** Dapat diinstal di perangkat *desktop* atau *mobile* untuk akses seperti aplikasi *native* dan fungsionalitas *offline*.
  * **Animasi Halus:** Animasi *landing page* yang memukau ditenagai oleh **GSAP & ScrollTrigger**.
  * **Desain Responsif:** UI yang bersih dan modern dibangun dengan **Tailwind CSS**, berfungsi di semua ukuran layar.
  * **Navigasi Ganda:** Menggunakan *Header* standar untuk *desktop* dan *Bottom Navigation Bar* untuk *mobile*.

-----

## 🛠️ Tumpukan Teknologi (Tech Stack)

Proyek ini dibagi menjadi dua bagian utama: *frontend* (root) dan *backend* (`/api`).

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| | GSAP (Animasi), Lucide React (Ikon) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (dihosting di **Neon**) |
| **Penyimpanan File** | **Cloudinary** (untuk foto profil) |
| **Deployment** | Vercel |

-----

## 🚀 Menjalankan Secara Lokal (Local Setup)

Ikuti langkah-langkah ini untuk menjalankan proyek di mesin lokal Anda.

### 1\. Prasyarat

  * [Node.js](https://nodejs.org/) (v18 atau lebih baru)
  * [npm](https://www.npmjs.com/)
  * Akun **Neon** (untuk database PostgreSQL)
  * Akun **Cloudinary** (untuk penyimpanan gambar)

### 2\. Kloning Repositori

```bash
git clone https://github.com/username/folder.git
cd folder
```

### 3\. Instal Dependensi

Proyek ini memiliki dua file `package.json`. Anda perlu menginstal dependensi untuk keduanya.

```bash
# Instal dependensi frontend (React, Vite, dll.)
npm install

# Instal dependensi backend (Express, pg, cloudinary, dll.)
npm install --prefix api
```

### 4\. Pengaturan Variabel Lingkungan (.env)

Buat file bernama `.env` di **root** proyek (di samping `package.json`).

```env
# 1. Dapatkan dari dashboard Neon Anda
DATABASE_URL="postgres://user:password@host/dbname?sslmode=require"

# 2. Dapatkan dari dashboard Cloudinary Anda
CLOUDINARY_CLOUD_NAME="NAMA_CLOUD_ANDA"
CLOUDINARY_API_KEY="API_KEY_ANDA"
CLOUDINARY_API_SECRET="API_SECRET_ANDA"
```

### 5\. Pengaturan Database (Hanya Sekali)

Anda perlu membuat tabel di database Neon Anda.

1.  Buka **SQL Editor** di *dashboard* Neon Anda.

2.  Jalankan kueri SQL berikut untuk membuat tabel:

    ```sql
    -- Membuat tabel untuk buku
    CREATE TABLE books (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        year INT,
        cover TEXT,
        description TEXT,
        category VARCHAR(100),
        pages INT,
        isbn VARCHAR(20),
        price INT,
        publisher VARCHAR(255),
        publicationDate VARCHAR(100),
        format VARCHAR(100),
        dimensions VARCHAR(100),
        synopsis TEXT,
        purchaseUrl TEXT
    );

    -- Membuat tabel untuk pengguna
    CREATE TABLE users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        nim VARCHAR(255),
        "group" VARCHAR(255),
        email VARCHAR(255),
        profilePicUrl TEXT
    );

    -- Membuat tabel join untuk favorit
    CREATE TABLE user_favorites (
        userId VARCHAR(255) REFERENCES users(id),
        bookId VARCHAR(255) REFERENCES books(id),
        PRIMARY KEY (userId, bookId)
    );
    ```

### 6\. Isi Database (Seeding)

Setelah tabel dibuat, jalankan skrip *seeding* untuk mengisi data buku dan data pengguna *default*.

```bash
# Mengisi tabel 'books' dan membuat pengguna default
npm run db:seed
```

### 7\. Jalankan Aplikasi

Jalankan server *frontend* dan *backend* secara bersamaan.

```bash
npm run dev
```

  * Frontend (Vite) akan berjalan di `http://localhost:5173`
  * Backend (Express) akan berjalan di `http://localhost:4000`

-----

## ☁️ Deployment

Proyek ini dikonfigurasi untuk *deployment* mudah di **Vercel**.

1.  *Push* kode Anda ke repositori GitHub.
2.  Hubungkan repositori GitHub Anda ke Vercel.
3.  Vercel akan otomatis mendeteksi konfigurasi *monorepo* dari file `vercel.json`.
4.  **PENTING:** Jangan lupa untuk menambahkan variabel lingkungan (`DATABASE_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) di *dashboard* Vercel Anda (Project \> Settings \> Environment Variables).
5.  Klik **Deploy**.

-----

## 🏗️ Struktur Proyek

```
/
├── api/                  # Backend Express.js
│   ├── index.mjs         # Server API (endpoint, logika)
│   ├── seed.mjs          # Skrip untuk mengisi database
│   ├── seed-data.js      # Data buku (untuk seeding)
│   └── package.json      # Dependensi backend (express, pg, dll)
│
├── public/               # Aset statis (ikon, manifest.json)
│
├── src/                  # Kode sumber Frontend React
│   ├── assets/           # Komponen SVG
│   ├── components/       # Komponen UI (Header, BottomNav, BookCard)
│   ├── data/             # Data buku statis (kini tidak terpakai, diganti seed.js)
│   ├── pages/            # Komponen halaman (Home, Profile, Detail, dll)
│   ├── types/            # Definisi TypeScript
│   ├── App.tsx           # Logika aplikasi utama (routing, state)
│   ├── main.tsx          # Titik masuk React
│   └── index.css         # Styling global Tailwind
│
├── .env                  # Variabel lingkungan (JANGAN di-commit)
├── .gitignore           
├── package.json          # Dependensi frontend & skrip
├── tailwind.config.js    # Konfigurasi Tailwind
├── vite.config.ts        # Konfigurasi Vite (proxy & PWA)
├── vercel.json           # Konfigurasi deployment Vercel
└── README.md             # File ini
```