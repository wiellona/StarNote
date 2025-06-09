# Star-Note: Panduan Deployment Lokal Dengan Docker

Dokumen ini berisi instruksi lengkap untuk menjalankan aplikasi Star-Note di lingkungan lokal menggunakan Docker. Panduan ini ditujukan untuk client yang ingin menginstal dan menjalankan Star-Note di komputer atau server mereka sendiri.

## Prasyarat

Sebelum memulai, pastikan komputer Anda memiliki:

1. **Docker Desktop**

   - Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Mac: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/) dan [Docker Compose](https://docs.docker.com/compose/install/)

2. **Minimal Hardware Requirements**:

   - CPU: 2 core processor
   - RAM: Minimal 4GB (8GB direkomendasikan)
   - Storage: 1GB ruang kosong

3. **Koneksi Internet** (dibutuhkan untuk akses ke MongoDB Atlas dan Cloudinary)

## Langkah-langkah Instalasi

### 1. Persiapan File Aplikasi

#### Melalui Git (Direkomendasikan):

```powershell
# Clone repository
git clone <repository-url>

# Masuk ke direktori project
cd Star-Note
```

#### Melalui Download Manual:

1. Download file ZIP aplikasi dari source yang disediakan
2. Extract file ZIP ke folder pilihan Anda
3. Buka terminal/command prompt dan arahkan ke folder hasil extract

### 2. Konfigurasi (Opsional)

Aplikasi sudah dikonfigurasi dengan pengaturan default yang siap digunakan. Namun, jika Anda ingin mengubah beberapa pengaturan:

#### Konfigurasi Port:

Jika port 80 (frontend) atau 5001 (backend) sudah digunakan di komputer Anda, edit file `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "5001:5000" # Ubah 5001 ke port lain, misalnya 8001:5000

  frontend:
    ports:
      - "80:80" # Ubah 80 ke port lain, misalnya 8080:80
```

### 3. Membangun dan Menjalankan Container

Buka terminal atau command prompt dan jalankan perintah berikut di direktori Star-Note:

```powershell
# Membangun dan menjalankan container dalam mode background
docker-compose up -d
```

Proses ini akan:

1. Download image Docker yang diperlukan (Node.js, Nginx)
2. Membangun images custom untuk frontend dan backend secara aman
3. Membuat dan menjalankan container dengan non-root user
4. Mengonfigurasi health checks untuk monitoring
5. Membuat jaringan Docker untuk komunikasi antar container
6. Menyiapkan volume untuk persistent logs

Waktu yang dibutuhkan tergantung pada kecepatan internet dan performa komputer, umumnya 5-10 menit untuk build pertama kali.

### 4. Verifikasi Instalasi

Setelah proses selesai, verifikasi bahwa container berjalan dengan baik:

```powershell
docker-compose ps
```

Output seharusnya menunjukkan dua container yang berjalan:

- `starnote-backend`
- `starnote-frontend`

Keduanya harus memiliki status "Up" dan health status "healthy". Jika status menunjukkan "starting" atau "unhealthy", tunggu beberapa saat dan periksa lagi.

Anda juga dapat memeriksa health endpoint secara langsung:

```powershell
# Periksa health backend
curl http://localhost:5001/api/health

# Periksa health frontend
curl http://localhost/health
```

### 5. Mengakses Aplikasi

Buka browser web dan akses aplikasi:

- **Frontend**: http://localhost (atau http://localhost:8080 jika Anda mengubah port)
- **Backend API**: http://localhost:5001/api (atau port yang sudah Anda konfigurasikan)

Untuk memverifikasi backend berjalan dengan baik, akses endpoint health check:
http://localhost:5001/api/health

## Penggunaan Aplikasi

### 1. Membuat Akun

1. Pada halaman awal, klik tombol "Register"
2. Isi formulir dengan username, email, dan password
3. Klik "Register" untuk membuat akun

### 2. Login

1. Pada halaman login, masukkan email dan password
2. Klik "Login"
3. Setelah berhasil, Anda akan diarahkan ke dashboard

### 3. Fitur Utama

Lihat `README.md` untuk detail penggunaan fitur-fitur utama:

- Pengelolaan Notes
- Flashcards
- Timer Pomodoro

## Administrasi

### Melihat Log Container

Untuk melihat log dari container:

```powershell
# Melihat log dari semua container
docker-compose logs

# Melihat log dari backend saja
docker-compose logs backend

# Melihat log dari frontend saja
docker-compose logs frontend

# Melihat log secara real-time
docker-compose logs -f
```

### Restart Container

Jika perlu restart aplikasi:

```powershell
# Restart semua container
docker-compose restart

# Restart container tertentu
docker-compose restart backend
```

### Menghentikan Aplikasi

Untuk menghentikan aplikasi tanpa menghapus container:

```powershell
docker-compose stop
```

Untuk menghentikan dan menghapus container:

```powershell
docker-compose down
```

Untuk menghentikan, menghapus container, dan menghapus volumes (akan menghapus data lokal):

```powershell
docker-compose down -v
```

### Memperbarui Aplikasi

Ketika ada versi baru dari aplikasi:

```powershell
# Pull perubahan terbaru (jika menggunakan git)
git pull

# Rebuild dan restart container
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Masalah Umum

1. **Error: Ports are not available**

   ```
   Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
   ```

   **Solusi**: Port sudah digunakan oleh aplikasi lain. Edit `docker-compose.yml` dan ubah mapping port ke port yang tidak digunakan.

2. **Container exit dengan error code**
   **Solusi**: Cek log dengan `docker-compose logs` untuk detail error.

3. **Tidak bisa terhubung ke MongoDB**
   **Solusi**: Pastikan komputer terhubung ke internet dan URL MongoDB di file `.env` atau `docker-compose.yml` benar.

4. **Aplikasi lambat**
   **Solusi**: Pastikan komputer memenuhi minimal requirements. Docker Desktop juga sebaiknya dikonfigurasi dengan resource yang cukup (RAM, CPU).

### Bantuan Lanjutan

Jika Anda mengalami masalah yang tidak tercantum di atas, silakan hubungi tim support di [contact email] dengan menyertakan:

1. Deskripsi masalah
2. Screenshot error (jika ada)
3. Output dari perintah `docker-compose logs`

## FAQ

**Q: Apakah saya perlu memahami Docker untuk menggunakan aplikasi ini?**
A: Tidak, panduan ini telah menyederhanakan proses deployment. Anda hanya perlu mengikuti langkah-langkah yang disediakan.

**Q: Apakah data saya aman?**
A: Ya, semua data disimpan di MongoDB Atlas dengan koneksi terenkripsi. Password disimpan dengan hash dan JWT digunakan untuk autentikasi.

**Q: Apakah aplikasi akan tetap berjalan jika komputer di-restart?**
A: Tidak secara default. Untuk mengatur agar container berjalan otomatis setelah restart, tambahkan opsi `restart: always` di `docker-compose.yml`:

```yaml
services:
  backend:
    restart: always
    # ...

  frontend:
    restart: always
    # ...
```

**Q: Bisakah aplikasi ini dijalankan tanpa internet?**
A: Tidak. Aplikasi membutuhkan koneksi ke MongoDB Atlas (database) dan Cloudinary (penyimpanan gambar).

## Lisensi

© 2025 StarNote K2 Group 6. All rights reserved.
