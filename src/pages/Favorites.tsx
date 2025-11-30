import { Book } from '../types';
import BookCard from '../components/BookCard';
import { Heart } from 'lucide-react';

interface FavoritesProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  favoriteIDs: string[];
  onToggleFavorite: (bookId: string) => void;
  isLoading: boolean; // Prop baru
}

export default function Favorites({ books, onBookClick, favoriteIDs, onToggleFavorite, isLoading }: FavoritesProps) {
  
  // Tampilkan pesan loading jika data buku belum siap
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <h2 className="text-xl font-medium">Memuat buku favorit...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Buku Favorit Anda
          </h1>
          <p className="text-lg text-gray-600">
            {/* Logika ini masih valid, karena 'books' di sini adalah favoriteBooks yang sudah difilter */}
            {books.length > 0
              ? `Anda memiliki ${books.length} buku favorit.`
              : 'Anda belum menambahkan buku favorit.'}
          </p>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => onBookClick(book.id)}
                isFavorite={favoriteIDs.includes(book.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-gray-200 rounded-lg">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">Belum Ada Favorit</h3>
            <p className="text-gray-500 mt-2">
              Klik ikon hati pada buku di halaman Koleksi untuk menambahkannya di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}