export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  cover: string;
  description: string;
  category: string;
  pages: number;
  isbn: string;
  price: number;
  publisher: string;
  publicationDate: string;
  format: string;
  dimensions: string;
  synopsis: string;
  purchaseUrl: string;
}

export type Page = 'landing' | 'home' | 'detail' | 'profile' | 'about' | 'favorites';

// TAMBAHAN BARU
export interface UserProfile {
  id: string;
  name: string;
  nim: string;
  group: string;
  email: string;
  profilepicurl: string | null; // PostgreSQL mengembalikan nama kolom lowercase
}