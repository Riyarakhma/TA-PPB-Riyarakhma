import { Book } from '../types';
import { Heart } from 'lucide-react'; // Impor ikon Heart

interface BookCardProps {
  book: Book;
  onClick: () => void;
  // Prop baru untuk fitur favorit
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

export default function BookCard({ book, onClick, isFavorite, onToggleFavorite }: BookCardProps) {
  
  // Handler untuk tombol favorit
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik menyebar ke kartu (pindah halaman)
    onToggleFavorite(book.id);
  };
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden transition-all duration-300 
                 border border-transparent hover:shadow-lg hover:border-gray-200 relative">
      
      {/* Tombol Favorit */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 p-2 bg-white/70 rounded-full
                   backdrop-blur-sm hover:bg-white transition-all"
        aria-label="Toggle Favorite"
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            isFavorite ? 'text-red-600 fill-red-600' : 'text-gray-700 hover:text-red-600'
          }`}
        />
      </button>

      {/* Gambar Kartu (dibuat bisa diklik) */}
      <button onClick={onClick} className="w-full text-left">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-base mb-1 line-clamp-2 text-black transition-colors group-hover:text-red-600">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{book.author}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{book.year}</span>
            <span className="text-xs text-black uppercase tracking-wider">{book.category}</span>
          </div>
        </div>
      </button>
    </div>
  );
}