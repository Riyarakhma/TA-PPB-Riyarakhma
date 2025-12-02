import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import Favorites from './pages/Favorites';
import { Book, Page, UserProfile } from './types'; // Impor UserProfile
import BottomNav from './components/BottomNav';

const MOCK_USER_ID = '21120123140168'; // Ganti dengan ID pengguna yang sesuai

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data dari API
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]); // Default array kosong
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State baru untuk profil

  // --- EFEK UNTUK MENGAMBIL DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${MOCK_USER_ID}`);
        if (response.ok) {
          const data: UserProfile = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      }
    };
    
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites/${MOCK_USER_ID}`);
        if (response.ok) {
          const data: string[] = await response.json();
          setFavoriteIDs(data);
        }
      } catch (error) {
        console.error("Gagal mengambil favorit:", error);
      }
    };

    const fetchBooks = async () => {
      setIsLoadingBooks(true);
      try {
        const response = await fetch('/api/books');
        const data: Book[] = await response.json();
        setAllBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setIsLoadingBooks(false);
    };

    fetchBooks();
    
    // Logika untuk mengambil data pengguna
    if (currentPage === 'landing') {
       // Reset profile jika kembali ke landing
       setUserProfile(null);
    } else {
       // Jika tidak di landing, ambil data profil & favorit
       // (Ini juga akan berjalan saat pertama kali pindah dari landing)
       fetchProfile();
       fetchFavorites();
    }

  }, [currentPage]); // Dijalankan ulang saat halaman berubah

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (page === 'home' || page === 'landing') {
      setSelectedBookId(null);
    }
  };

  const handleBookClick = (bookId: string) => {
    setSelectedBookId(bookId);
    setCurrentPage('detail');
  };

  // --- FUNGSI FAVORIT (API BARU) ---
  const toggleFavorite = async (bookId: string) => {
    const isFavorite = favoriteIDs.includes(bookId);
    
    // Optimistic UI Update: Langsung perbarui state
    const newFavorites = isFavorite
      ? favoriteIDs.filter((id) => id !== bookId)
      : [...favoriteIDs, bookId];
    setFavoriteIDs(newFavorites);

    // Kirim permintaan ke API
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = isFavorite
        ? `/api/favorites/${MOCK_USER_ID}/${bookId}`
        : `/api/favorites/${MOCK_USER_ID}`;
        
      const options: RequestInit = { method };
      
      if (method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ bookId });
      }

      await fetch(url, options);
    } catch (error) {
      console.error("Gagal update favorit:", error);
      // Rollback jika gagal
      setFavoriteIDs(favoriteIDs);
    }
  };

  const selectedBook = allBooks.find((book) => book.id === selectedBookId);

  const filteredBooks = useMemo(() => {
    return allBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allBooks, searchQuery]);

  const favoriteBooks = useMemo(() => {
    return allBooks.filter((book) => favoriteIDs.includes(book.id));
  }, [allBooks, favoriteIDs]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'home':
        return (
          <Home
            books={filteredBooks}
            onBookClick={handleBookClick}
            favoriteIDs={favoriteIDs}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoadingBooks}
          />
        );
      case 'detail':
        return selectedBook ? (
          <BookDetail book={selectedBook} onBack={() => handleNavigate('home')} />
        ) : null;
      case 'profile':
        // Kirim ID pengguna dan data profil ke halaman Profile
        return <Profile 
                  userId={MOCK_USER_ID} 
                  initialProfile={userProfile} 
                  onProfileUpdate={setUserProfile} // Callback untuk update foto
               />;
      case 'about':
        return <About />;
      case 'favorites':
        return (
          <Favorites
            books={favoriteBooks}
            onBookClick={handleBookClick}
            favoriteIDs={favoriteIDs}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoadingBooks}
          />
        );
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {currentPage !== 'landing' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSearch={setSearchQuery}
          // Kirim URL foto profil
          profilePicUrl={userProfile?.profilepicurl || null}
        />
      )}
      {renderPage()}
      
      {/* Tampilkan BottomNav jika bukan di landing page */}
      {currentPage !== 'landing' && (
        <BottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          // Kirim URL foto profil
          profilePicUrl={userProfile?.profilepicurl || null}
        />
      )}
    </div>
  );
}

export default App;