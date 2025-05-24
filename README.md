# Star-Note

![Star-Note Logo](./star-note-frontend/public/Logo.png)

## Deskripsi

Star-Note adalah aplikasi all-in-one untuk pengelolaan catatan, flashcard untuk pembelajaran, dan timer pomodoro untuk meningkatkan produktivitas. Aplikasi ini dirancang untuk memudahkan pengguna dalam mengorganisir pikiran, meningkatkan proses belajar, dan mengelola waktu dengan lebih efektif.

## Fitur

### 1. Manajemen Catatan

- Buat, edit, dan hapus catatan dengan rich text formatting
- Organisasi catatan dengan tag
- Unggah dan lampirkan gambar pada catatan
- Cari catatan berdasarkan judul atau konten

### 2. Flashcard untuk Pembelajaran

- Buat kartu flashcard untuk membantu proses belajar
- Organisasi flashcard berdasarkan kategori
- Mode latihan dengan sistem pengulangan berdasarkan tingkat penguasaan
- Lampirkan gambar pada flashcard

### 3. Timer Pomodoro

- Atur sesi kerja dan istirahat dengan timer pomodoro
- Statistik penggunaan untuk melacak produktivitas
- Notifikasi untuk pergantian antara sesi kerja dan istirahat
- Pengaturan durasi yang dapat disesuaikan

### 4. Integrasi dengan Cloudinary

- Penyimpanan dan pengelolaan gambar melalui Cloudinary
- Upload gambar dengan drag-and-drop
- Preview gambar sebelum upload

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios untuk API calls
- Nginx (untuk serving static files dalam container)

### Backend

- Node.js
- Express.js
- MongoDB (database)
- JWT untuk autentikasi
- Cloudinary API untuk penyimpanan gambar

### Infrastructure

- Docker & Docker Compose untuk containerization
- RESTful API architecture

## Cara Menjalankan Aplikasi

### Prasyarat

- [Docker](https://www.docker.com/products/docker-desktop/) dan Docker Compose terinstal di komputer Anda
- Git untuk mengkloning repository (opsional)

### Langkah-langkah untuk Client

#### Opsi 1: Menjalankan dengan Docker Compose

1. Unduh atau clone repository ini ke komputer lokal:

   ```
   git clone <repository-url>
   ```

   atau unduh sebagai ZIP dan extract ke folder lokal

2. Buka terminal atau command prompt dan arahkan ke folder Star-Note:

   ```
   cd path/to/Star-Note
   ```

3. Jalankan aplikasi dengan Docker Compose:

   ```
   docker-compose up -d
   ```

   Perintah ini akan membangun dan menjalankan container untuk frontend dan backend aplikasi.

4. Tunggu beberapa saat hingga proses build selesai. Setelah selesai, buka browser dan akses:

   - Frontend: http://localhost
   - Backend API: http://localhost:5001/api

5. Untuk menghentikan aplikasi:
   ```
   docker-compose down
   ```

#### Opsi 2: Akses Demo Online (Jika Tersedia)

- Akses aplikasi online di: [URL Demo] (akan ditambahkan jika tersedia)

## Cara Penggunaan Aplikasi

### Registrasi dan Login

1. Buka aplikasi di browser dan klik "Register" untuk membuat akun baru
2. Isi username, email, dan password
3. Setelah registrasi berhasil, login dengan email dan password Anda

### Pengelolaan Catatan

1. Setelah login, navigasi ke menu "Notes"
2. Klik tombol "New Note" untuk membuat catatan baru
3. Isi judul dan konten catatan
4. Gunakan toolbar formatting untuk mengedit teks
5. Tambahkan tag jika diperlukan
6. Klik "Save" untuk menyimpan catatan

### Flashcard

1. Navigasi ke menu "Flashcards"
2. Klik "Create Flashcard" untuk membuat flashcard baru
3. Isi bagian depan (pertanyaan) dan belakang (jawaban) kartu
4. Pilih kategori atau buat kategori baru
5. Tambahkan gambar jika diperlukan
6. Klik "Save" untuk menyimpan flashcard
7. Gunakan mode "Practice" untuk berlatih dengan flashcard

### Timer Pomodoro

1. Navigasi ke menu "Pomodoro"
2. Atur durasi sesi kerja dan istirahat
3. Klik "Start" untuk memulai timer
4. Timer akan otomatis beralih antara sesi kerja dan istirahat
5. Lihat statistik penggunaan di bagian bawah halaman

## Pengembangan

### Struktur Project

```
Star-Note/
├── docker-compose.yml         # Konfigurasi Docker Compose
├── be-star-note/              # Backend aplikasi
│   ├── Dockerfile             # Docker config untuk backend
│   ├── server.js              # Entry point backend
│   ├── config/                # Konfigurasi aplikasi
│   ├── middleware/            # Express middleware
│   ├── models/                # Model database MongoDB
│   └── routes/                # API routes
│
└── star-note-frontend/        # Frontend aplikasi
    ├── Dockerfile             # Docker config untuk frontend
    ├── nginx.conf             # Konfigurasi Nginx
    ├── src/                   # Source code React
    │   ├── components/        # Reusable components
    │   ├── contexts/          # React contexts
    │   ├── pages/             # Page components
    │   └── utils/             # Utility functions
    └── public/                # Static assets
```

### Endpoint API

#### Authentication

- `POST /api/users/register` - Registrasi user baru
- `POST /api/users/login` - Login user

#### Notes

- `GET /api/notes` - Ambil semua catatan user
- `POST /api/notes` - Buat catatan baru
- `GET /api/notes/:id` - Ambil detail catatan berdasarkan ID
- `PUT /api/notes/:id` - Update catatan
- `DELETE /api/notes/:id` - Hapus catatan

#### Flashcards

- `GET /api/flashcards` - Ambil semua flashcard user
- `POST /api/flashcards` - Buat flashcard baru
- `GET /api/flashcards/:id` - Ambil detail flashcard berdasarkan ID
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Hapus flashcard

#### Pomodoro

- `GET /api/pomodoro` - Ambil pengaturan dan statistik pomodoro
- `POST /api/pomodoro` - Simpan sesi pomodoro baru
- `PUT /api/pomodoro/settings` - Update pengaturan pomodoro

## Troubleshooting

### Masalah Umum

1. **Tidak dapat mengakses aplikasi di browser**

   - Pastikan container Docker berjalan dengan perintah `docker-compose ps`
   - Cek apakah port 80 dan 5001 tidak digunakan oleh aplikasi lain di komputer Anda
   - Coba akses backend API langsung di http://localhost:5001/api/health

2. **Login atau register gagal**

   - Pastikan koneksi internet aktif karena aplikasi menggunakan MongoDB Atlas cloud
   - Periksa apakah email sudah terdaftar sebelumnya

3. **Gambar tidak dapat diupload**

   - Pastikan koneksi internet aktif karena upload gambar menggunakan Cloudinary
   - Periksa ukuran file, maksimal 10MB per gambar

4. **Container Docker gagal memulai**
   - Jalankan `docker-compose logs` untuk melihat detail error
   - Pastikan tidak ada container lain yang menggunakan port yang sama

### Restart Aplikasi

Jika mengalami masalah, coba restart container:

```
docker-compose down
docker-compose up -d
```

## Lisensi

© 2025 StarNote K2 Group 6. All rights reserved.
