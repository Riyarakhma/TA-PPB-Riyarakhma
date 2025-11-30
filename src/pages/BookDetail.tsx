import { ArrowLeft } from 'lucide-react';
import { Book } from '../types';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

export default function BookDetail({ book, onBack }: BookDetailProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // --- MODIFIKASI ---
  // Kita tidak perlu membuat const 'searchQuery' atau 'ecommerceUrl' lagi,
  // karena URL-nya sudah tersedia di 'book.purchaseUrl'.
  // --- AKHIR MODIFIKASI ---

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Container dengan padding vertikal lebih besar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Tombol Kembali yang lebih rapi */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base font-medium">Koleksi</span>
        </button>

        {/* --- GRID UTAMA (GAMBAR & INFO) --- */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
          
          {/* --- KOLOM KIRI (GAMBAR & TOMBOL) --- */}
          <div>
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-6 rounded-lg shadow-lg">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* --- MODIFIKASI --- */}
            {/* Ganti 'href' untuk menggunakan properti baru dari 'book' */}
            <a
              href={book.purchaseUrl} // <-- DIUBAH DI SINI
              target="_blank" 
              rel="noopener noreferrer" 
              className="block w-full bg-black text-white py-4 font-medium tracking-wide
                               hover:bg-gray-800 transition-colors rounded-lg text-base text-center"
            >
              BELI SEKARANG
            </a>
            {/* --- AKHIR MODIFIKASI --- */}

          </div>

          {/* --- KOLOM KANAN (INFO) --- */}
          <div className="flex flex-col"> 
            
            <div className="inline-block px-4 py-1 bg-gray-100 text-gray-800 text-sm 
                            font-medium tracking-wide mb-5 self-start rounded-full">
              {book.category}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">{book.title}</h1>
            <p className="text-2xl text-gray-600 mb-8">{book.author}</p>
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-5xl font-bold tracking-tight">{formatPrice(book.price)}</p>
            </div>

            <h3 className="text-sm font-medium tracking-wider text-gray-500 uppercase mb-4">
              Detail Buku
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Tanggal Publikasi</p>
                <p className="text-base font-medium text-black">{book.publicationDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Penerbit</p>
                <p className="text-base font-medium text-black">{book.publisher}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah Halaman</p>
                <p className="text-base font-medium text-black">{book.pages} halaman</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ISBN</p>
                <p className="text-base font-medium text-black">{book.isbn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Format</p>
                <p className="text-base font-medium text-black">{book.format}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ukuran</p>
                <p className="text-base font-medium text-black">{book.dimensions}</p>
              </div>
            </div>
            <div className='space-y-4 mt-8'>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Deskripsi Singkat</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {book.description}
              </p>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Sinopsis</h2>
              <p className="text-gray-700 leading-relaxed mb-12 text-base">
                {book.synopsis}
              </p>              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}