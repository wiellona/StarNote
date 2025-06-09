---
title: Star-Note
---

# Star-Note

## Tim Pengembang

**K2 Group 6 - Sistem Basis Data (Semester 4, 2025)**

| Foto                                                                                                                                 | Nama                            | NPM        |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ---------- |
| <img src="https://i.imgur.com/4ZxvxWl.jpeg" alt="Wiellona" width="100" height="100" style="border-radius: 50%; object-fit: cover;"/> | Wiellona Darlene Oderia Saragih | 2306264396 |
| <img src="https://i.imgur.com/drcd5aT.jpeg" alt="Kiara" width="100" height="100" style="border-radius: 50%; object-fit: cover;"/>    | Putri Kiara Salsabila Arief     | 2306250743 |
| <img src="https://i.imgur.com/7dcKnNw.jpeg" alt="Laura" width="100" height="100" style="border-radius: 50%; object-fit: cover;"/>    | Laura Fawzia Sambowo            | 2306260145 |

## Daftar Isi

- [Tim Pengembang](#tim-pengembang)
- [Tentang StarNote](#tentang-starnote)
- [Cara Menggunakan](#cara-menggunakan)
- [Instalasi](#instalasi)
- [Tech Stack](#tech-stack)
- [Dokumentasi Teknis](#dokumentasi-teknis)
- [Lisensi](#lisensi)

---

## Tentang StarNote

**StarNote** adalah aplikasi web produktivitas yang mengintegrasikan tiga modul utama untuk mendukung kegiatan akademik mahasiswa: manajemen catatan digital, sistem flashcard pembelajaran, dan timer Pomodoro untuk manajemen waktu. Aplikasi ini dibangun dengan teknologi modern React.js dan Node.js dengan database MongoDB.

### Fitur Utama

**Manajemen Catatan**

- Editor teks lengkap dengan format styling
- Upload dan integrasi gambar
- Sistem organisasi dengan tag
- Pencarian berdasarkan judul, konten, atau tag
- Penyimpanan otomatis
- Export ke PDF

**Sistem Flashcard**

- Kartu pembelajaran dengan dukungan teks dan gambar
- Organisasi berdasarkan kategori mata pelajaran
- Mode latihan dengan algoritma pengulangan
- Tracking progress dan statistik pembelajaran
- Import/export data flashcard

**Timer Pomodoro**

- Sesi kerja dan istirahat yang dapat disesuaikan
- Notifikasi otomatis
- Statistik produktivitas harian dan mingguan
- Integrasi dengan catatan dan flashcard yang sedang dipelajari

**Keamanan dan Profil**

- Sistem autentikasi aman dengan JWT
- Profil pengguna dengan foto
- Data pribadi yang terlindungi
- Penyimpanan cloud untuk gambar

---

## Cara Menggunakan

### Akses Aplikasi

1. Buka browser dan kunjungi alamat aplikasi![image](https://hackmd.io/_uploads/SJfiXJ4mll.png)
2. Daftar akun baru atau login dengan akun yang sudah ada ![image](https://hackmd.io/_uploads/HyBpm1N7ge.png)
3. Mulai menggunakan fitur-fitur yang tersedia

### Memulai dengan Catatan

1. Klik menu "Notes" di navigasi utama![image](https://hackmd.io/_uploads/ryk4NJV7lx.png)
2. Tekan tombol "New Note" untuk membuat catatan baru ![image](https://hackmd.io/_uploads/Sy8HNJNQxl.png)

3. Tulis judul dan konten catatan
4. Gunakan toolbar untuk format teks atau upload gambar
5. Tambahkan tag untuk organisasi yang lebih baik
6. Tekan tombol save untuk menyimpan catatan ![image](https://hackmd.io/_uploads/HJDtNJ4Qle.png)

### Menggunakan Flashcard

1. Pilih menu "Flashcard" ![image](https://hackmd.io/_uploads/H1Wo414Qll.png)

2. Tekan tombol New Card untuk membuat kartu baru ![image](https://hackmd.io/_uploads/BkHAVy4Qgg.png)

3. Tambah kartu baru dengan memilih kategori dan mengisi pertanyaan dan jawaban. Tekan tombon save untuk menyimpan kartu ![image](https://hackmd.io/_uploads/rkSQrJV7gg.png)

4. Mulai sesi belajar dengan Study Mode ![image](https://hackmd.io/_uploads/HJFBBJVmel.png)

   ![image](https://hackmd.io/_uploads/rJs8SyEQlx.png)
   ![image](https://hackmd.io/_uploads/BymPBJN7ge.png)

### Timer Pomodoro

1. Akses menu "Pomodoro" untuk membantu Anda menerapkan Teknik Pomodoro ![image](https://hackmd.io/_uploads/ryh2H1E7xx.png)

2. Atur durasi sesi kerja dan istirahat sesuai kebutuhan ![image](https://hackmd.io/_uploads/S19aH14mxx.png)

---

## Instalasi

### Prasyarat Sistem

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (disarankan)
- [Git](https://git-scm.com/) untuk mengunduh kode
- Koneksi internet untuk akses database dan penyimpanan gambar

### Instalasi dengan Docker (Disarankan)

1. **Unduh Aplikasi**

   ```bash
   git clone https://github.com/yourusername/StarNote.git
   cd StarNote
   ```

2. **Jalankan Aplikasi**

   ```bash
   docker-compose up -d
   ```

3. **Verifikasi Instalasi**

   ```bash
   docker-compose ps
   ```

4. **Akses Aplikasi**

   - **Aplikasi Utama**: http://localhost
   - **API Backend**: http://localhost:5000/api
   - **Status Sistem**: http://localhost:5000/api/health

5. **Hentikan Aplikasi**
   ```bash
   docker-compose down
   ```

### Instalasi Manual (Development)

Jika ingin mengembangkan atau memodifikasi aplikasi:

1. **Setup Backend**

   ```bash
   cd star-note-backend
   npm install
   ```

   Buat file `.env` dengan konfigurasi berikut:

   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/note-app
    JWT_SECRET=secret_key_yang_sangat_kuat
    PORT=5000
    CLOUDINARY_CLOUD_NAME=nama_cloud_anda
    CLOUDINARY_API_KEY=api_key_anda
    CLOUDINARY_API_SECRET=api_secret_anda
   ```

   Jalankan server:

   ```bash
   npm start
   ```

2. **Setup Frontend**

   ```bash
   cd star-note-frontend
   npm install
   ```

   Buat file `.env`:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=nama_cloud_anda
   ```

   Jalankan aplikasi:

   ```bash
   npm run dev
   ```

3. **Akses Aplikasi**
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:5000

---

### Debugging dan Log

**Melihat Log Aplikasi:**

```bash
# Semua log
docker-compose logs

# Log backend saja
docker-compose logs backend

# Log frontend saja
docker-compose logs frontend

# Follow log secara real-time
docker-compose logs -f
```

**Restart Aplikasi:**

```bash
docker-compose down
docker-compose up -d
```

**Reset Data (hati-hati):**

```bash
docker-compose down -v
docker-compose up -d
```

### Bantuan Teknis

Jika masalah berlanjut, periksa:

1. Status layanan cloud (MongoDB Atlas, Cloudinary)
2. Konfigurasi firewall atau antivirus
3. Resource sistem (RAM, storage)
4. Koneksi internet yang stabil

---

## Tech Stack

<div align="center">

### 🚀 **Modern Full-Stack Architecture**

</div>

<table align="center">
<tr>
<td align="center" width="50%">

### 🎨 **Frontend Excellence**

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**🔧 Core Libraries:**
![React Router](https://img.shields.io/badge/React_Router-7.6.0-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.9.0-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-5.5.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary_React-1.14.3-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</td>
<td align="center" width="50%">

### ⚡ **Backend Power**

![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.16.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**🛡️ Security & Utils:**
![Mongoose](https://img.shields.io/badge/Mongoose-8.14.1-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0.2-4285F4?style=for-the-badge&logo=security&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-1.4.5-FF6B6B?style=for-the-badge&logo=files&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2.6.1-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</td>
</tr>
</table>

---

### 🏗️ **Infrastructure & DevOps**

<div align="center">

![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Web_Server-009639?style=for-the-badge&logo=nginx&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud_DB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

| Component               | Technology              | Purpose                               |
| ----------------------- | ----------------------- | ------------------------------------- |
| **🐳 Containerization** | Docker & Docker Compose | Development & deployment consistency  |
| **🌐 Web Server**       | Nginx                   | High-performance static file serving  |
| **☁️ Database**         | MongoDB Atlas           | Scalable cloud database hosting       |
| **📸 Media CDN**        | Cloudinary              | Optimized image delivery & processing |

---

### 🎯 **Architecture Overview**

![picture 3](https://i.imgur.com/9YugCm2.png)

**🏗️ System Architecture Flow:**

1. **🌐 Client Access** → User accesses via browser
2. **🐳 Docker Container** → Nginx serves React frontend
3. **⚡ Frontend Processing** → React handles UI/UX with routing
4. **🔄 API Communication** → Axios makes HTTP requests
5. **🛡️ Security Layer** → JWT authentication & file validation
6. **📊 Data Processing** → Express routes handle business logic
7. **💾 Data Persistence** → MongoDB Atlas stores all data
8. **☁️ Media Storage** → Cloudinary manages images & files

**🔧 Port Configuration:**

- **Frontend (Nginx)**: Port 80
- **Backend (Express)**: Port 5000
- **Database**: MongoDB Atlas (Cloud)
- **CDN**: Cloudinary (Cloud)

**🔥 Key Features:**

- **Microservices Ready** - Containerized architecture for scalability
- **Cloud-First** - MongoDB Atlas + Cloudinary integration
- **Modern Stack** - Latest React 19 with Vite for lightning-fast development
- **Security Focused** - JWT authentication with encrypted passwords
- **Performance Optimized** - Nginx proxy with CDN delivery

### API Endpoints

**Authentication**

- `POST /api/users/register` - Registrasi user baru
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Profil user
- `PUT /api/users/profile` - Update profil

**Notes Management**

- `GET /api/notes` - Ambil semua catatan user
- `POST /api/notes` - Buat catatan baru
- `GET /api/notes/:id` - Ambil catatan spesifik
- `PUT /api/notes/:id` - Update catatan
- `DELETE /api/notes/:id` - Hapus catatan

**Flashcards**

- `GET /api/flashcards` - Ambil semua flashcard
- `POST /api/flashcards` - Buat flashcard baru
- `PUT /api/flashcards/:id` - Update flashcard
- `DELETE /api/flashcards/:id` - Hapus flashcard

**Pomodoro Timer**

- `GET /api/pomodoro` - Ambil sesi Pomodoro
- `POST /api/pomodoro` - Buat sesi baru
- `PUT /api/pomodoro/:id` - Update sesi

### Database Schema

**Users Collection**

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Notes Collection**

```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  tags: [String],
  userId: ObjectId (ref: User),
  images: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Flashcards Collection**

```javascript
{
  _id: ObjectId,
  front: String (required),
  back: String (required),
  category: String,
  difficulty: Number,
  userId: ObjectId (ref: User),
  frontImage: String,
  backImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

**PomodoroTimer Collection**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  workDuration: Number,
  breakDuration: Number,
  sessionsCompleted: Number,
  date: Date,
  createdAt: Date
}
```

### Environment Variables

**Backend (.env)**

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env)**

```
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Docker Configuration

**docker-compose.yml**

- Frontend: Port 80 (Nginx)
- Backend: Port 5000 (Express)
- Database: MongoDB Atlas (cloud)
- Media: Cloudinary (cloud)

### Keamanan

- Password hashing dengan bcrypt
- JWT token authentication
- CORS configuration
- Input validation dan sanitization
- File upload restrictions
- Environment variables untuk sensitive data

---

## Lisensi

© 2025 StarNote - K2 Group 6. Semua hak dilindungi undang-undang.

**Proyek Sistem Basis Data - Semester 4, 2025**  
Fakultas Ilmu Komputer, Universitas Indonesia

---

_Aplikasi ini dikembangkan sebagai tugas mata kuliah Sistem Basis Data dengan tujuan pembelajaran dan implementasi konsep database dalam aplikasi web modern._
