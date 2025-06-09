# Star-Note: Keamanan dan Praktik Terbaik

Dokumen ini berisi informasi penting tentang keamanan dan praktik terbaik untuk menggunakan aplikasi Star-Note dalam lingkungan produksi. Panduan ini terutama ditujukan untuk administrator atau tim IT yang mengelola deployment aplikasi.

## Variabel Lingkungan dan Kredensial

Aplikasi Star-Note menggunakan beberapa kredensial dan konfigurasi sensitif yang perlu diperhatikan keamanannya:

### Database MongoDB

Aplikasi ini menggunakan MongoDB Atlas untuk database. Kredensial yang digunakan adalah:

```
MONGO_URI=mongodb+srv://k2group6:4lfVCblY5sTmdFbu@cluster0.nagmn0c.mongodb.net/note-app
```

**Rekomendasi Keamanan**:

- Untuk lingkungan produksi, sebaiknya buat cluster MongoDB baru dengan kredensial yang berbeda
- Batasi akses IP ke database hanya dari server produksi Anda
- Aktifkan fitur MongoDB Atlas Encryption at Rest untuk data sensitif

### JWT Secret

JWT digunakan untuk autentikasi dan kredensial yang digunakan adalah:

```
JWT_SECRET=j8K#p2Lm*7Zq!9Xs@5Rv$4Yt^6Wn&3Ub
```

**Rekomendasi Keamanan**:

- Untuk deployment produksi, ganti JWT_SECRET dengan nilai acak yang baru
- Gunakan generator secret yang kuat dengan panjang minimal 32 karakter
- Jangan membagikan JWT_SECRET ke pihak tidak berwenang

### Cloudinary

Aplikasi menggunakan Cloudinary untuk penyimpanan dan pengelolaan gambar. Kredensial yang digunakan adalah:

```
CLOUDINARY_CLOUD_NAME=drno8mzax
CLOUDINARY_API_KEY=698282118967281
CLOUDINARY_API_SECRET=x_M_uuM1W7Hp1j09T4BN32rwbXE
```

**Rekomendasi Keamanan**:

- Untuk deployment produksi, buat akun Cloudinary baru dengan kredensial yang berbeda
- Batasi penggunaan Cloudinary hanya untuk domain aplikasi Anda
- Atur batasan kapasitas penyimpanan untuk mencegah penyalahgunaan

## Cara Mengubah Kredensial

### Metode 1: Melalui docker-compose.yml

Edit file `docker-compose.yml` dan ubah nilai kredensial di bagian `environment`:

```yaml
services:
  backend:
    environment:
      - MONGO_URI=mongodb+srv://newuser:newpassword@yourcluster.mongodb.net/your-db
      - JWT_SECRET=your-new-secret-key
      - CLOUDINARY_CLOUD_NAME=your-cloud-name
      - CLOUDINARY_API_KEY=your-api-key
      - CLOUDINARY_API_SECRET=your-api-secret
```

### Metode 2: Melalui File .env

1. Buat file `.env` baru di direktori `be-star-note/` dengan kredensial yang telah diperbarui
2. Rebuild container dengan perintah:
   ```
   docker-compose down
   docker-compose up -d --build
   ```

## Keamanan Aplikasi

### Docker Security

Aplikasi yang telah di-dockerize memiliki keamanan tambahan:

1. **Non-Root User**:

   - Container backend berjalan sebagai user `node` (bukan root)
   - Container frontend berjalan sebagai user `nginx` (bukan root)

2. **Health Checks**:

   - Backend dan frontend memiliki health check untuk monitoring kondisi container
   - Gunakan `docker-compose ps` untuk memeriksa status health container

3. **Resource Limits**:
   - Untuk produksi, tambahkan batasan resource di docker-compose.yml:
     ```yaml
     services:
       backend:
         deploy:
           resources:
             limits:
               cpus: "0.5"
               memory: "500M"
     ```

### HTTPS

Secara default, aplikasi berjalan menggunakan HTTP. Untuk deployment produksi, sangat direkomendasikan untuk mengaktifkan HTTPS.

**Opsi 1: Menggunakan Reverse Proxy seperti Nginx**:

1. Pasang Nginx di server host
2. Dapatkan sertifikat SSL (misalnya dari Let's Encrypt)
3. Konfigurasi Nginx untuk proxy pass ke container Docker dengan SSL

Contoh konfigurasi Nginx:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5001/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Opsi 2: Menggunakan Traefik sebagai Reverse Proxy**:

Traefik dapat diintegrasikan langsung dengan Docker dan otomatis memperoleh sertifikat SSL dari Let's Encrypt.

## Backup dan Pemulihan Data

### Backup Database MongoDB Atlas

MongoDB Atlas menyediakan fitur backup otomatis:

1. Login ke MongoDB Atlas
2. Pilih cluster yang digunakan oleh aplikasi
3. Buka tab "Backup"
4. Aktifkan "Continuous Backup" atau "Cloud Backup"
5. Atur jadwal backup dan periode penyimpanan sesuai kebutuhan

### Restorasi Data

Untuk mengembalikan data dari backup:

1. Login ke MongoDB Atlas
2. Pilih cluster yang digunakan oleh aplikasi
3. Buka tab "Backup"
4. Pilih point-in-time backup yang ingin dipulihkan
5. Klik "Restore" dan ikuti instruksi

## Pemantauan

### Pemantauan Container Docker

Gunakan Docker's built-in tools:

```
docker stats
```

Atau gunakan tools pihak ketiga seperti:

- Portainer (UI untuk mengelola container)
- cAdvisor (untuk metrics)
- Prometheus + Grafana (untuk monitoring dan alerting)

### Pemantauan Aplikasi

Log aplikasi dapat diakses melalui:

```
docker-compose logs -f
```

Untuk pemantauan produksi yang lebih komprehensif, pertimbangkan menggunakan:

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- New Relic

## Scaling Aplikasi

Untuk jumlah pengguna yang lebih besar, pertimbangkan:

1. **Horizontal Scaling**:

   - Gunakan Docker Swarm atau Kubernetes untuk menjalankan multiple instances
   - Tambahkan load balancer di depan instance frontend

2. **Vertical Scaling**:
   - Tingkatkan resource (CPU/RAM) yang dialokasikan untuk Docker
   - Gunakan instance MongoDB Atlas dengan tier yang lebih tinggi

## Checklist Keamanan Produksi

Sebelum membuka aplikasi untuk akses publik, pastikan:

- [ ] Semua kredensial default telah diganti
- [ ] HTTPS diaktifkan
- [ ] Batasan akses IP ke MongoDB Atlas dikonfigurasi
- [ ] Sistem backup diaktifkan dan diuji
- [ ] Firewall server dikonfigurasi dengan baik
- [ ] Monitoring dan alerting dikonfigurasi
- [ ] Batas upload file diatur dengan wajar
- [ ] Password policy diterapkan (minimal 8 karakter, kombinasi huruf dan angka)
- [ ] Container Docker dijalankan dengan non-root user
- [ ] Health checks Docker dikonfigurasi dan berfungsi
- [ ] Docker images diperbarui ke versi terbaru untuk patch keamanan
- [ ] Batasan resource Docker dikonfigurasi untuk mencegah DoS
- [ ] Headers keamanan di Nginx sudah dikonfigurasi

## Lisensi

© 2025 StarNote K2 Group 6. All rights reserved.
