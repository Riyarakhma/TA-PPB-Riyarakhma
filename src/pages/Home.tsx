import { Book } from '../types';
import BookCard from '../components/BookCard';

interface HomeProps {
  books: Book[];
  onBookClick: (bookId: string) => void;
  favoriteIDs: string[];
  onToggleFavorite: (bookId: string) => void;
  isLoading: boolean; // Prop baru
}

export default function Home({ books, onBookClick, favoriteIDs, onToggleFavorite, isLoading }: HomeProps) {
  
  // Tampilkan pesan loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <h2 className="text-xl font-medium">Memuat koleksi buku...</h2>
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
            Koleksi Buku
          </h1>
          <p className="text-lg text-gray-600">
            {books.length > 0
              ? `Menampilkan ${books.length} buku`
              : 'Tidak ada buku yang cocok dengan pencarian Anda.'}
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
          <div className="text-center py-16">
            <p className="text-gray-500">Coba kata kunci lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}