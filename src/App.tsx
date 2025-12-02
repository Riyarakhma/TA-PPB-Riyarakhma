import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { Book, Page, UserProfile } from './types';
import BottomNav from './components/BottomNav';

function App() {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Cek localStorage saat load awal untuk persistensi login
    const savedUser = localStorage.getItem('litly_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isRegistering, setIsRegistering] = useState(false);

  // App State
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [favoriteIDs, setFavoriteIDs] = useState<string[]>([]); 

  // --- Auth Handlers ---
  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('litly_user', JSON.stringify(userData));
    setIsRegistering(false);
    setCurrentPage('landing'); // Redirect ke landing setelah login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('litly_user');
    setFavoriteIDs([]);
    setCurrentPage('landing');
  };

  // --- Data Fetching ---
  useEffect(() => {
    // Hanya fetch data jika user sudah login dan TIDAK di halaman landing (kecuali fetch buku)
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

    if (user && currentPage !== 'landing') {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites/${user.id}`);
          if (response.ok) {
            const data: string[] = await response.json();
            setFavoriteIDs(data);
          }
        } catch (error) {
          console.error("Gagal mengambil favorit:", error);
        }
      };
      
      // Refresh profile data (untuk memastikan sync)
      const fetchProfile = async () => {
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            localStorage.setItem('litly_user', JSON.stringify(data));
          }
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
        }
      };

      fetchFavorites();
      fetchProfile();
    }
  }, [currentPage, user?.id]); 

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

  const toggleFavorite = async (bookId: string) => {
    if (!user) return; // Guard clause

    const isFavorite = favoriteIDs.includes(bookId);
    const newFavorites = isFavorite
      ? favoriteIDs.filter((id) => id !== bookId)
      : [...favoriteIDs, bookId];
    setFavoriteIDs(newFavorites);

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = isFavorite
        ? `/api/favorites/${user.id}/${bookId}`
        : `/api/favorites/${user.id}`;
        
      const options: RequestInit = { method };
      
      if (method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ bookId });
      }

      await fetch(url, options);
    } catch (error) {
      console.error("Gagal update favorit:", error);
      setFavoriteIDs(favoriteIDs); // Rollback
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

  // --- Render Auth Pages if not logged in ---
  if (!user) {
    if (isRegistering) {
      return <Register onRegisterSuccess={handleLogin} onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  // --- Render Main App ---
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
        return (
          <div className="relative">
            <Profile 
              userId={user.id} 
              initialProfile={user} 
              onProfileUpdate={(updated) => {
                setUser(updated);
                localStorage.setItem('litly_user', JSON.stringify(updated));
              }} 
            />
            {/* Tombol Logout Tambahan di halaman profil */}
            <div className="max-w-4xl mx-auto px-8 pb-16">
               <button 
                 onClick={handleLogout}
                 className="w-full border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition-colors"
               >
                 Keluar (Logout)
               </button>
            </div>
          </div>
        );
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
          profilePicUrl={user.profilepicurl || null}
        />
      )}
      {renderPage()}
      
      {currentPage !== 'landing' && (
        <BottomNav
          currentPage={currentPage}
          onNavigate={handleNavigate}
          profilePicUrl={user.profilepicurl || null}
        />
      )}
    </div>
  );
}

export default App;