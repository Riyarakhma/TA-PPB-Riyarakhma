import { useState, useRef, useEffect } from 'react';
import { User, Mail, Hash, Users, Edit, Save, Upload, Loader2 } from 'lucide-react';
import { UserProfile } from '../types'; // Impor tipe UserProfile

// (Data default dan kunci localStorage dihapus)

// Tipe untuk data formulir
interface ProfileFormData {
  name: string;
  nim: string;
  group: string;
  email: string;
}

// Tipe untuk props ProfileInput
interface ProfileInputProps {
  name: keyof ProfileFormData; // Sesuaikan dengan tipe
  label: string;
  value: string;
  icon: React.ElementType;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileInput = ({ name, label, value, icon: Icon, isEditing, onChange }: ProfileInputProps) => (
  <div className="pb-6 border-b border-gray-200">
    <label htmlFor={name} className="text-xs text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </label>
    <div className="flex items-center space-x-4">
      <Icon className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className="text-lg font-medium text-black w-full bg-transparent focus:outline-none disabled:text-gray-900"
      />
    </div>
  </div>
);

// Tipe untuk props halaman Profile
interface ProfileProps {
  userId: string;
  initialProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void; // Callback untuk update App.tsx
}

export default function Profile({ userId, initialProfile, onProfileUpdate }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '', nim: '', group: '', email: ''
  });
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // State loading baru
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Muat data dari prop (yang didapat dari API di App.tsx)
  useEffect(() => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name,
        nim: initialProfile.nim,
        group: initialProfile.group, // Nama kolom di DB adalah 'group'
        email: initialProfile.email,
      });
      setProfilePicUrl(initialProfile.profilepicurl);
    }
  }, [initialProfile]);

  // Handler untuk perubahan input teks
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler untuk menyimpan perubahan (hanya teks)
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const updatedProfile: UserProfile = await response.json();
      
      // Update state lokal dan state di App.tsx
      setFormData({ 
        name: updatedProfile.name, 
        nim: updatedProfile.nim, 
        group: updatedProfile.group, 
        email: updatedProfile.email 
      });
      onProfileUpdate(updatedProfile); // Kirim data lengkap ke App.tsx
      setIsEditing(false);

    } catch (error) {
      console.error("Gagal menyimpan profil:", error);
    }
  };

  // Handler untuk membatalkan edit
  const handleCancel = () => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name,
        nim: initialProfile.nim,
        group: initialProfile.group,
        email: initialProfile.email,
      });
    }
    setIsEditing(false);
  };

  // Handler saat gambar dipilih (UPLOAD LOGIC)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('profilePic', file);

    try {
      // Kirim file ke endpoint upload API kita
      const response = await fetch(`/api/profile/${userId}/upload-pic`, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error('Upload gagal');
      }

      const updatedProfile: UserProfile = await response.json();
      
      // Update state lokal dan state di App.tsx
      setProfilePicUrl(updatedProfile.profilepicurl);
      onProfileUpdate(updatedProfile); // Kirim data lengkap ke App.tsx

    } catch (error) {
      console.error("Gagal unggah gambar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handler untuk memicu klik input file
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Profil</h1>
            <p className="text-lg text-gray-600">
              {isEditing ? 'Anda sedang dalam mode edit' : 'Kelola informasi pribadi Anda'}
            </p>
          </div>
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="bg-gray-100 text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 rounded-full">
              <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center overflow-hidden">
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}

                {/* Tampilkan overlay loading saat mengunggah */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <>
                  <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 bg-white text-black p-3 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                    disabled={isUploading}
                  />
                </>
              )}
            </div>
          </div>

          <div className="space-y-6 max-w-md mx-auto">
            <ProfileInput
              name="name"
              label="Nama Lengkap"
              value={formData.name}
              icon={User}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileInput
              name="nim"
              label="NIM"
              value={formData.nim}
              icon={Hash}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileInput
              name="group"
              label="Kelompok"
              value={formData.group}
              icon={Users}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <ProfileInput
              name="email"
              label="Email"
              value={formData.email}
              icon={Mail}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm font-medium tracking-wider text-gray-500 uppercase mb-4 text-center">
              Tentang Aplikasi
            </h2>
            <p className="text-center text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
              Aplikasi Perpustakaan Pribadi adalah Progressive Web App (PWA) yang
              dikembangkan menggunakan React dan TypeScript. Aplikasi ini menampilkan
              koleksi buku dengan desain minimalis modern, dilengkapi dengan fitur offline
              dan dapat diinstall ke perangkat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}