import { useState } from 'react';
import { UserProfile } from '../types';
import { BookOpen } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    group: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrasi gagal');
      }

      onRegisterSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-black rounded-lg flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input name="name" type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" onChange={handleChange} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">NIM (ID)</label>
              <input name="nim" type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kelompok</label>
              <input name="group" type="text" required className="mt-1 w-full px-3 py-2 border rounded-md" onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="mt-1 w-full px-3 py-2 border rounded-md" onChange={handleChange} />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" required className="mt-1 w-full px-3 py-2 border rounded-md" onChange={handleChange} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors font-medium"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-black hover:underline">
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}