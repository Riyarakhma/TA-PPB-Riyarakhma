import { useState } from 'react';
import { BookOpen, Search, User } from 'lucide-react'; // Impor User
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSearch: (query: string) => void;
  profilePicUrl: string | null; // Prop baru
}

export default function Header({ currentPage, onNavigate, onSearch, profilePicUrl }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (page: Page | Page[]) => {
    if (Array.isArray(page)) {
      return page.includes(currentPage);
    }
    return currentPage === page;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <header className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand - Kiri */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2 hover:opacity-70 transition-opacity flex-shrink-0"
          >
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
          </button>

          {/* === Navigasi Desktop - Tengah Kiri === */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 ml-8">
            <button
              onClick={() => onNavigate('home')}
              className={`px-6 py-2 text-sm font-medium tracking-wide transition-colors border-r border-gray-200 ${
                isActive(['home', 'detail'])
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Koleksi
            </button>
            <button
              onClick={() => onNavigate('favorites')}
              className={`px-6 py-2 text-sm font-medium tracking-wide transition-colors border-r border-gray-200 ${
                isActive('favorites')
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Favorit
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`px-6 py-2 text-sm font-medium tracking-wide transition-colors border-r border-gray-200 ${
                isActive('about')
                  ? 'text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Tentang
            </button>
          </nav>

          {/* === Actions - Kanan === */}
          <div className="flex items-center space-x-4"> {/* Ubah space-x-6 jadi 4 */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari buku..."
                className="border border-gray-300 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all w-full md:w-48"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            
            {/* === TOMBOL PROFIL BARU DENGAN GAMBAR === */}
            <button
              onClick={() => onNavigate('profile')}
              className="hidden md:block rounded-full w-10 h-10 bg-gray-200 hover:opacity-80 transition-opacity"
            >
              {profilePicUrl ? (
                <img 
                  src={profilePicUrl} 
                  alt="Profil" 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}