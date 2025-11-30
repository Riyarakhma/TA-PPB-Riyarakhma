import {
  BookOpen,
  Globe,
  Zap,
  Lock,
  Search,
  Heart,
  UserCheck,
  Server, // Ikon baru
  Database, // Ikon baru
  Cloud, // Ikon baru
} from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Tentang Perpustakaan Pribadi
          </h1>
          <p className="text-lg text-gray-600">
            Mengenal lebih jauh tentang platform digital perpustakaan pribadi kami
          </p>
        </div>

        {/* Blok deskripsi utama */}
        <div className="bg-black text-white p-10 md:p-12 mb-12 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <BookOpen className="w-8 h-8 flex-shrink-0" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Perpustakaan Pribadi</h2>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Platform PWA full-stack modern yang menghadirkan pengalaman membaca
            digital yang elegan dan fungsional. Aplikasi ini terhubung ke API
            kustom yang menyimpan data pengguna, favorit, dan profil secara
            persisten di dalam database cloud.
          </p>
        </div>

        {/* --- FITUR UTAMA (Diperbarui) --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Fitur Utama</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Fitur 1: Pencarian */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <Search className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Pencarian Cepat</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Temukan buku berdasarkan judul atau penulis secara instan
                langsung dari header.
              </p>
            </div>
            {/* Fitur 2: Favorit (Diperbarui) */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <Heart className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Koleksi Favorit</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tandai buku yang Anda sukai dan lihat di halaman favorit.
                Pilihan Anda disimpan di database.
              </p>
            </div>
            {/* Fitur 3: Profil (Diperbarui) */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <UserCheck className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Profil Cloud</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Edit info profil dan unggah foto pribadi Anda ke Cloudinary,
                dengan data tersimpan aman di database.
              </p>
            </div>
          </div>
        </div>

        {/* --- Keunggulan Platform (Diperbarui) --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Keunggulan Platform</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 p-6 rounded-lg">
              <Zap className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Progressive Web App</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Teknologi PWA memungkinkan aplikasi diinstal di perangkat Anda
                seperti aplikasi native, dengan fitur offline.
              </p>
            </div>
            <div className="border border-gray-200 p-6 rounded-lg">
              <Globe className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Responsif & Modern</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Desain minimalis beradaptasi sempurna di semua perangkat,
                dari smartphone hingga desktop, untuk pengalaman optimal.
              </p>
            </div>
            {/* Diperbarui */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <Server className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">API Kustom</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dibangun dengan backend Express.js kustom untuk menangani
                logika bisnis, data pengguna, dan integrasi layanan cloud.
              </p>
            </div>
            {/* Diperbarui */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <Database className="w-8 h-8 mb-4 text-black" />
              <h3 className="text-lg font-medium mb-2">Database Serverless</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Menggunakan Neon sebagai database PostgreSQL serverless
                yang terkelola, memastikan data selalu tersedia dan aman.
              </p>
            </div>
          </div>
        </div>

        {/* --- Teknologi (Diperbarui) --- */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Tumpukan Teknologi (Tech Stack)</h2>
          <p className="text-gray-600 mb-6">
            Aplikasi ini dibangun menggunakan arsitektur full-stack modern:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>React 18 & Vite</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Node.js</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Express.js</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>PostgreSQL (Neon)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Cloudinary</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>GSAP (Animasi)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>Vercel (Deployment)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}