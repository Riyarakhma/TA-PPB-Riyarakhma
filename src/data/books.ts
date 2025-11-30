import { Book } from '../types';

export const books: Book[] = [
  {
    id: '1',
    title: 'An Old Soul',
    author: 'M. Kevin Hayden',
    year: 2023, // Tahun disesuaikan ke modern
    // URL sampul Pexels/Open Library diganti dengan sampul ikonik berkualitas tinggi
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/265/large_a8018c273b25a2b2badb0abe557d25cb.jpg',
    description: 'A brilliant, heart-breaking mystery set in 1996 Chicago.',
    category: 'Mystery', // Kategori disesuaikan dengan sinopsis
    pages: 412, // Disesuaikan
    isbn: '978-1-5063-4567-8', // ISBN fiktif
    price: 155000,
    publisher: 'Orion Press', // Disesuaikan
    publicationDate: '15 September 2023', // Disesuaikan
    format: 'Paperback',
    dimensions: '20 x 13 cm',
    synopsis: 'A brilliant, heart-breaking, and compulsively readable mystery that tugs on the fabric of reality, and explores what it might mean for humanity if we didn’t have to lose our loved ones…at least not in the way we think. In 1996 Chicago, twenty-five-year-old Isaac André feels like a stranger in his own life—until the world starts whispering back. The coincidences are too uncanny to ignore, but for now, they’re all happening in his favor.',
    purchaseUrl: 'https://www.amazon.com/Old-Soul-M-Kevin-Hayden-ebook/dp/B0F453QXNG' // <-- TAMBAHAN
  },
  {
    id: '2',
    title: 'Wall Streets Blind Spots',
    author: 'Jose Mayora',
    year: 2024, // Tahun disesuaikan ke modern
    // Sampul modern yang bersih
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/289/large_91f1228b8325921b605ab81308f5f7e2.jpg',
    description: 'A deep dive into financial market failures and ethics.',
    category: 'Non-Fiction', // Kategori disesuaikan dengan judul
    pages: 350, // Disesuaikan
    isbn: '978-0-393-24792-5', // ISBN fiktif
    price: 180000,
    publisher: 'Beacon Business', // Disesuaikan
    publicationDate: '20 March 2024', // Disesuaikan
    format: 'Hardcover',
    dimensions: '23 x 15 cm',
    synopsis: 'An unflinching analysis of the overlooked ethical and systemic flaws within global finance. Jose Mayora, seorang veteran Wall Street, memaparkan bagaimana bias, keserakahan, dan kegagalan regulasi terus membentuk krisis, menawarkan solusi radikal untuk pasar yang lebih transparan dan adil.',
    purchaseUrl: 'https://www.amazon.com/Wall-Streets-Blind-Spots-Perspective-ebook/dp/B0FM77MVHB' // <-- TAMBAHAN
  },
  {
    id: '3',
    title: 'Dead Flowers',
    author: 'J.M. Petrick',
    year: 2022, // Tahun disesuaikan ke modern
    // Sampul minimalis yang kuat
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/285/large_7dd6a2cc216d856056547f26ea3d3b78.jpg',
    description: 'A dark, atmospheric psychological thriller.',
    category: 'Thriller', // Kategori disesuaikan
    pages: 288, // Disesuaikan
    isbn: '978-1-6816-1055-6', // ISBN fiktif
    price: 130000,
    publisher: 'Raven Books', // Disesuaikan
    publicationDate: '1 November 2022', // Disesuaikan
    format: 'Paperback',
    dimensions: '19 x 12.5 cm',
    synopsis: 'Ketika serangkaian orang hilang mengguncang komunitas pinggiran kota yang tenang, detektif Elara Stone harus menghadapi rahasia tergelapnya sendiri untuk menemukan pelaku yang meninggalkan "bunga mati" sebagai tanda. Ketegangan psikologis yang mencekam dari awal hingga akhir.',
    purchaseUrl: 'https://www.amazon.com/Dead-Flowers-J-M-Petrick-ebook/dp/B0FF2VBNV5?crid=1U0TQ4L8O3RRV&dib=eyJ2IjoiMSJ9.xIA0e65GDP_xcRcKV2rmHF-5mp3N2UqF9tBuGGZxR8o_j9Qwq0JRZxh2gYxWAm6qQxmDDELoK6Dy3m4FX_xVsCh7iskkyLsL9V5XSdvSiXWwVOYg3b_WMbVZn_jK53xDwI1cC9Z0KqNYmacBXbtF4fvIxYa0AgMHzfBahGWECWAf4wSG5L-qst9f9MkjZ5qEC3CM8u0IZ3kcuthVSDe5J82a1fswNl1CGFwkVu5Jr8A.gCeTlRyHmaYfLg-nXUxSojTUvrg-zVVEk3mJB4JQNYI&dib_tag=se&keywords=dead+flowers&qid=1763201010&s=digital-text&sprefix=dead+flower%2Cdigital-text%2C341&sr=1-1' // <-- TAMBAHAN
  },
  {
    id: '4',
    title: 'The Next Big Thing',
    author: 'Andrew McLinden',
    year: 2021, // Tahun disesuaikan ke modern
    // Sampul ilustratif yang indah (Rifle Paper Co.)
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/244/large_71a53ec3dd63ffa1a3f906332dfc9a36.jpg',
    description: 'A dark satire of the music industry and corruption.',
    category: 'Fiction', // Kategori disesuaikan dengan sinopsis
    pages: 390, // Disesuaikan
    isbn: '978-0-06-234567-9', // ISBN fiktif
    price: 140000,
    publisher: 'Music Row Publishing', // Disesuaikan
    publicationDate: '10 July 2021', // Disesuaikan
    format: 'Hardcover',
    dimensions: '22 x 14 cm',
    synopsis: 'In this dark satire of the music industry, The Next Big Thing follows Danny McAllister, a toxic, careless, and occasionally malevolent lead guitarist whose influence slowly corrupts those around him. The design draws inspiration from live gig photography, band posters, and set lists, with the torn paper edge subtly hinting at Danny’s destructive nature.',
    purchaseUrl: 'https://www.amazon.com/NEXT-BIG-THING-NOVEL-ebook/dp/B0DLRSM3YL?crid=15YD1WSNSABT3&dib=eyJ2IjoiMSJ9.ETm31deiZVyPJg6clSG1T9nwkz7QLBZJ4mboskmwdxnjumMOvFSXnoOtmkFtwpr2sBEuliELaVfhtZvpYufv_qA0ngeJttvPwhVEjHQbdvoXcnqJ__BJBJ93yNMukJ8UZ8HMgqmH-viH8i5yufRV4QIjCVJd9zu-XCr_kR3NnML1vW-dlwmKVflO3s_ksFIBzPrq1rgQiqK0WHfxh-7brUcB8AmzaLTunpvRZTTS_e0.huL3lYIHxRlwoeM7z33bO-YUMUiPDcnlevIEwwxx43Q&dib_tag=se&keywords=the+next+big+thing&qid=1763201037&s=digital-text&sprefix=the+next+big%2Cdigital-text%2C421&sr=1-2' // <-- TAMBAHAN
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    year: 1951,
    // Sampul ikonik yang valid
    cover: 'https://m.media-amazon.com/images/I/7108sdEUEGL.jpg',
    description: 'A novel exploring alienation and teenage angst in New York.',
    category: 'Classic Literature', // Tetap
    pages: 277, // Tetap
    isbn: '978-0-316-76948-0', // Tetap
    price: 115000, // Tetap
    publisher: 'Little, Brown', // Tetap
    publicationDate: '16 July 1951', // Tetap
    format: 'Paperback', // Tetap
    dimensions: '20 x 12.5 cm', // Tetap
    synopsis: 'Follow Holden Caulfield, a troubled teenager navigating the challenges of adolescence and identity in 1950s New York City. Through his distinctive voice and cynical observations, Salinger captures the confusion and pain of growing up. This controversial yet influential novel remains a powerful exploration of teenage rebellion and the search for authenticity.',
    purchaseUrl: 'https://www.amazon.com/Catcher-Rye-J-D-Salinger-ebook/dp/B07V8HFMTR?crid=1X06A0G2310DF&dib=eyJ2IjoiMSJ9.p8Bol8r3xxiOBTNMUTZSUzhyOkKgL2kFnDpcLz5ClAOiK2HGLDU2jTmWlhoHQ6AgGvcYuvHvSKIYpsk7fQDIsCFjqHfj-Nl70-cJ2yOa7-shZEAsZaqxY-wGChHWlNMAIlpYr19X8JGRHxA4RJ_3qoHu_s7-8Zp8ZyeFoqzwFKD7JhPuhKdrbZzxlccs6IBseMW5zHFPIP4M_d6SNoiJnHE1C9otjN3RBjY5SbGejz0.zJA3olmwGrIDZldOcT9PfhhtZ2HadjIdvDuWOarv5Tc&dib_tag=se&keywords=the+catcher+in+the+rye&qid=1763201062&s=digital-text&sprefix=the+catch%2Cdigital-text%2C367&sr=1-1' // <-- TAMBAHAN
  },
  {
    id: '6',
    title: 'The Silo',
    author: 'G.S. Heist',
    year: 2020, // Tahun disesuaikan ke modern
    // Sampul ilustratif modern
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/250/large_c58c89de3e7f1d60d64f7e344999fc2f.jpg',
    description: 'A dark, atmospheric psychological literary thriller set in the American Midwest.',
    category: 'Thriller', // Kategori disesuaikan dengan sinopsis
    pages: 375, // Disesuaikan
    isbn: '978-1-9876-5432-1', // ISBN fiktif
    price: 160000,
    publisher: 'Midwest Thriller House', // Disesuaikan
    publicationDate: '5 April 2020', // Disesuaikan
    format: 'Hardcover',
    dimensions: '21 x 14 cm',
    synopsis: 'We went dark and atmospheric for this debut novel by a former police chief—a psychological literary thriller set in the American Midwest. The cover focuses on the silo at the story’s core, with a subtle blood pool in front as ominous foreshadowing. The silo motif was repeated throughout the interior design of the book.',
    purchaseUrl: 'https://www.amazon.com/SILO-Greg-Heist-ebook/dp/B0DBM31TQZ?crid=2WTJS5CKZRX8T&dib=eyJ2IjoiMSJ9.ZLB6Y4Kf-qORP526-iML5uOOU0GiEHmzk-v9xKzXdBChrmULh2zP-toJPV1_dOY6gCKFdH5xj1mdB6pJaaqivkmp4J1b3vq6SPm7STIVmeekh8O_NiEDsrzcEJ-v9dmkKZsdg7-ixqsU8n-M40zJ7fYmkYuDLw0ssXSvZ5V320ZqGa_okUNq1f8CHu0ditaDj68czejkR1PzFfFcF04j9grUW7qbfWiehAKqsF-plN8.yq87gbtJVIF_woYmGxUir6ZJr9F5phgHRiba8PpiRmM&dib_tag=se&keywords=the+silo&qid=1763201161&s=digital-text&sprefix=the+silo%2Cdigital-text%2C661&sr=1-5' // <-- TAMBAHAN
  },
  {
    id: '7',
    title: 'Always to Be Found',
    author: 'J.S. Gazaille',
    year: 2024, // Tahun disesuaikan ke modern
    // Sampul grafis minimalis
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/253/large_4e145baa41196e7abdcd773a74081d72.jpg',
    description: 'A charming rom-com with a thrilling twist in the Caribbean.',
    category: 'Romantic Suspense', // Kategori disesuaikan dengan sinopsis
    pages: 310, // Disesuaikan
    isbn: '978-0-451-47890-2', // ISBN fiktif
    price: 120000,
    publisher: 'Island Breeze Press', // Disesuaikan
    publicationDate: '12 February 2024', // Disesuaikan
    format: 'Paperback',
    dimensions: '21 x 13.5 cm',
    synopsis: 'Always to Be Found blends rom-com charm with thriller intrigue against the stunning Caribbean islands of St. Barths and the Magdalen Islands. The blonde protagonist lounges poolside at her luxurious villa, unaware she\'s being watched. Who is this hidden man—friend or foe? What\'s the secret in the confidential envelope beside her? My cinematic approach instantly immerses readers.',
    purchaseUrl: 'https://www.amazon.com/Always-Be-Found-J-S-Gazaille-ebook/dp/B0DH2WC21R?crid=370TC24YD3TXN&dib=eyJ2IjoiMSJ9.sNsxLv4hLJZwTmFUn2DF_jB-oslSe02VhFXXd_OGNzK2l1rAaJtrwaYwx6q-D8r7UkIvOGPQ_wqSqBfZTFqOujRFiRe5Ve1Rh_TpmRgkmjSmQQPhXCEsII97AJZmo6L6qtreAD_lkwFLwCv65CMiwYszLw2gS8k7gsyBaLRfq96PSCTRgKsu_aTTkgkvuoSqmCpBD9vnQCXCkMkuavOE8CI7QzNYitb6XVcB-KXcW-g.p2x160t6la55AVlBkTNNtZC9lNKCFjMFqM9T-z83doo&dib_tag=se&keywords=always+to+be+found&qid=1763201193&s=digital-text&sprefix=always+to+be+found%2Cdigital-text%2C401&sr=1-1' // <-- TAMBAHAN
  },
  {
    id: '8',
    title: 'The Killer Chorus',
    author: 'Jack Conlan',
    year: 2023, // Tahun disesuaikan ke modern
    // Sampul Penguin Classics yang artistik
    cover: 'https://blog-cdn.reedsy.com/directories/gallery/179/large_180814baa7dae07f9fb2cf9f044b5166.jpg',
    description: 'A gripping historical mystery involving a famous theater troupe.',
    category: 'Historical Mystery', // Kategori disesuaikan
    pages: 512, // Disesuaikan
    isbn: '978-3-1614-8410-0', // ISBN fiktif
    price: 175000,
    publisher: 'Conlan Publishing', // Disesuaikan
    publicationDate: '18 October 2023', // Disesuaikan
    format: 'Hardcover',
    dimensions: '22 x 15 cm',
    synopsis: 'Ketika anggota "The Killer Chorus," sebuah kelompok teater terkenal di London era Victoria, mulai menghilang secara misterius, seorang inspektur yang skeptis harus menyelidiki dunia gemerlap panggung yang penuh dengan persaingan, rahasia, dan dendam yang mematikan.',
    purchaseUrl: 'https://www.amazon.com/Killer-Chorus-Jack-Conlan-ebook/dp/B0CY41HK7V?crid=14D26LJKLBPXM&dib=eyJ2IjoiMSJ9.z8aD7cD7a6Epd82Hu8Jgn8fG9r2z-LcbibjakAPndGbPHTQvhfbMDSZGJZkj1PD3PXPwBqaG2FPkEKw2rWHXpg.AOzRdJqTFHfIX-Xjds8-oN-1GIjOymUCSQ3HXK8hPCk&dib_tag=se&keywords=the+killer+chorus&qid=1763201217&s=digital-text&sprefix=the+killer+chorus%2Cdigital-text%2C377&sr=1-1' // <-- TAMBAHAN
  }
];