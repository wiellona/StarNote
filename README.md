# ✨ Star-Note

<div align="center">
  <img src="./star-note-frontend/public/Logo.png" alt="Star-Note Logo" width="200" height="auto"/>
  <p><em>Satu Aplikasi untuk Semua Kebutuhan Produktivitasmu</em></p>
</div>

## 📝 Ringkasan

**Star-Note** adalah platform all-in-one yang menggabungkan:

- 📒 Pengelolaan catatan dengan format kaya
- 🃏 Flashcard untuk pembelajaran efektif
- ⏱️ Timer Pomodoro untuk produktivitas

Dirancang untuk membantu Anda mengorganisasi pikiran, meningkatkan proses belajar, dan mengelola waktu secara efisien dalam satu aplikasi terpadu.

## ✨ Fitur Utama

<table>
<tr>
<td width="50%">
    
### 📒 Manajemen Catatan
- ✅ Editor teks dengan format kaya (bold, italic, list, dll)
- 🏷️ Organisasi dengan sistem tag
- 🖼️ Dukungan upload gambar langsung ke catatan
- 🔍 Pencarian cepat berdasarkan judul atau konten
</td>
<td width="50%">
    
### 🃏 Sistem Flashcard
- 📚 Buat dan kelola flashcard untuk belajar efisien
- 📁 Kategorisasi untuk organisasi yang lebih baik
- 📊 Mode latihan dengan sistem spaced repetition
- 🖼️ Dukungan gambar untuk visual learning
</td>
</tr>
<tr>
<td>
    
### ⏱️ Timer Pomodoro
- 🍅 Teknik manajemen waktu Pomodoro terintegrasi
- 📈 Statistik sesi untuk analisis produktivitas
- 🔔 Notifikasi pergantian sesi otomatis
- ⚙️ Durasi kerja dan istirahat yang dapat disesuaikan
</td>
<td>
    
### ☁️ Integrasi Cloud
- 🌐 Penyimpanan gambar via Cloudinary
- 🖱️ Upload dengan drag-and-drop
- 👁️ Preview gambar sebelum upload
- 🔄 Sinkronisasi data real-time
</td>
</tr>
</table>

## 🛠️ Teknologi Yang Digunakan

<div align="center">
<table>
<tr>
<th>Frontend</th>
<th>Backend</th>
<th>Infrastructure</th>
</tr>
<tr>
<td>

- <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/> React.js
- <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/> Vite
- <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind"/> Tailwind CSS
- <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios"/> Axios
- <img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white" alt="Nginx"/> Nginx

</td>
<td>

- <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/> Node.js
- <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/> Express.js
- <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/> MongoDB
- <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white" alt="JWT"/> JWT Auth
- <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white" alt="Cloudinary"/> Cloudinary

</td>
<td>

- <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/> Docker & Compose
- <img src="https://img.shields.io/badge/RESTful-009688?style=flat-square&logo=fastapi&logoColor=white" alt="REST"/> RESTful API
- <img src="https://img.shields.io/badge/Security-4B5563?style=flat-square&logo=shield&logoColor=white" alt="Security"/> Non-root security
- <img src="https://img.shields.io/badge/Health Checks-22C55E?style=flat-square&logo=checkmarx&logoColor=white" alt="Health"/> Health monitoring
- <img src="https://img.shields.io/badge/Logging-2E7D32?style=flat-square&logo=logtail&logoColor=white" alt="Logging"/> Persistent logs

</td>
</tr>
</table>
</div>

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat

<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/> **Docker & Docker Compose** - [Download di sini](https://www.docker.com/products/docker-desktop/)  
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git"/> **Git** - Opsional untuk clone repository

### 🐳 Instalasi dengan Docker (Direkomendasikan)

<details>
<summary><b>Klik untuk melihat langkah-langkah instalasi</b></summary>

#### 1️⃣ Dapatkan Kode Aplikasi

```bash
# Clone repositori (atau unduh sebagai ZIP)
git clone <repository-url>
cd Star-Note
```

#### 2️⃣ Jalankan dengan Docker Compose

```bash
# Build dan jalankan container
docker-compose up -d
```

#### 3️⃣ Verifikasi Aplikasi Berjalan

```bash
# Cek status container
docker-compose ps

# Cek health status backend
curl http://localhost:5001/api/health
```

#### 4️⃣ Akses Aplikasi

- 🖥️ **Frontend**: [http://localhost](http://localhost)
- 🔌 **API Backend**: [http://localhost:5001/api](http://localhost:5001/api)

#### 5️⃣ Menghentikan Aplikasi

```bash
docker-compose down
```

</details>

### 🧪 Mode Pengembangan

<details>
<summary><b>Klik untuk melihat mode pengembangan</b></summary>

Untuk developer yang ingin menjalankan dengan hot-reload:

```bash
# Jalankan dalam mode development
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

Akses:

- Frontend dev server: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5001/api](http://localhost:5001/api)
</details>

### 🌐 Demo Online

<p align="center">
<a href="#"><img src="https://img.shields.io/badge/Demo Online-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Demo"/></a>
</p>

> Demo akan tersedia setelah aplikasi dirilis

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
