import { Home, Heart, Info, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profilePicUrl: string | null; // Prop baru
}

// Tipe untuk item navigasi
type NavItem = {
  page: Page;
  label: string;
  icon: React.ElementType;
  activePages: Page[]; // Halaman mana saja yang dianggap aktif untuk item ini
};

export default function BottomNav({ currentPage, onNavigate, profilePicUrl }: BottomNavProps) {
  
  // Definisikan item navigasi DI DALAM komponen agar bisa akses prop
  const navItems: NavItem[] = [
    { page: 'home', label: 'Koleksi', icon: Home, activePages: ['home', 'detail'] },
    { page: 'favorites', label: 'Favorit', icon: Heart, activePages: ['favorites'] },
    { page: 'about', label: 'Tentang', icon: Info, activePages: ['about'] },
    { page: 'profile', label: 'Profil', icon: User, activePages: ['profile'] },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = item.activePages.includes(currentPage);
          
          // Render khusus untuk tombol Profil
          if (item.page === 'profile') {
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                className={`inline-flex flex-col items-center justify-center px-5 group transition-colors ${
                  isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {/* Ganti ikon dengan gambar profil */}
                <div className={`w-6 h-6 mb-1 rounded-full flex items-center justify-center overflow-hidden 
                                ${isActive ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'}`}>
                  {profilePicUrl ? (
                    <img src={profilePicUrl} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          }

          // Render normal untuk tombol lain
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
              className={`inline-flex flex-col items-center justify-center px-5 group transition-colors ${
                isActive ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              <item.icon
                className={`w-5 h-5 mb-1 transition-colors ${
                  isActive ? 'text-black' : 'text-gray-500 group-hover:text-black'
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}