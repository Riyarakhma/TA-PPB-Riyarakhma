import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Hash,
  Users,
  Edit,
  Save,
  Upload,
  Loader2,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileFormData {
  name: string;
  nim: string;
  group: string;
  email: string;
}

interface ProfileProps {
  userId: string;
  initialProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

export default function Profile({
  userId,
  initialProfile,
  onProfileUpdate,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    nim: "",
    group: "",
    email: "",
  });

  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load initial profile
  useEffect(() => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name,
        nim: initialProfile.nim,
        group: initialProfile.group,
        email: initialProfile.email,
      });
      setProfilePicUrl(initialProfile.profilepicurl);
    }
  }, [initialProfile]);

  // Input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Upload image
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const uploadForm = new FormData();
    uploadForm.append("profilePic", file);

    try {
      const res = await fetch(`/api/profile/${userId}/upload-pic`, {
        method: "POST",
        body: uploadForm,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const updated = await res.json();

      setProfilePicUrl(updated.profilepicurl);
      onProfileUpdate(updated);
    } catch (err) {
      console.error("Gagal upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");

      const updated = await res.json();
      onProfileUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal save:", err);
    }
  };

  const fields = [
    { key: "name", label: "Nama Lengkap", icon: User },
    { key: "nim", label: "NIM", icon: Hash },
    { key: "group", label: "Kelompok", icon: Users },
    { key: "email", label: "Email", icon: Mail },
  ] satisfies {
    key: keyof ProfileFormData;
    label: string;
    icon: React.ElementType;
  }[];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Profil</h1>
            <p className="text-lg text-gray-600">
              {isEditing
                ? "Anda sedang dalam mode edit"
                : "Kelola informasi pribadi Anda"}
            </p>
          </div>

          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-black px-5 py-2 rounded-full text-sm hover:bg-gray-200"
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
          {/* Foto profil */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 rounded-full">
              <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center overflow-hidden">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-white p-3 text-black rounded-full shadow-md border hover:bg-gray-100"
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

          {/* Input fields */}
          <div className="space-y-6 max-w-md mx-auto">
            {fields.map(({ key, label, icon: Icon }) => (
              <div key={key} className="pb-6 border-b border-gray-200">
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {label}
                </label>
                <div className="flex items-center space-x-4">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="text-lg font-medium text-black bg-transparent w-full focus:outline-none disabled:text-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tentang Aplikasi */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-sm text-gray-500 uppercase font-medium mb-4 text-center">
              Tentang Aplikasi
            </h2>
            <p className="text-center text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
              Aplikasi Perpustakaan Pribadi adalah PWA modern berbasis React +
              TypeScript yang menampilkan koleksi buku favorit Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
