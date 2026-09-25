# PANDUAN DEPLOYMENT & INSTALASI SERVER (DEPLOYMENT & SETUP GUIDE)
## Smart School LMS — UPT SDN 9 Gandangbatu Sillanan
**Penyedia Solusi:** TechSoe (Teknologi Inovasi Soedirman)  
**Tech Stack:** Laravel 13, React.js, Inertia.js, MySQL 8.0, Vite  
**Versi Dokumen:** 1.1.0  
**Tanggal:** 25 September 2026  

---

## 1. Kebutuhan Sistem (System Requirements)

| Komponen | Lingkungan Pengembangan (Local Dev) | Lingkungan Produksi (Live Production VPS) |
| :--- | :--- | :--- |
| **Sistem Operasi** | Windows 10/11 (Laragon / WSL2) | Ubuntu Server 22.04 / 24.04 LTS |
| **PHP Runtime** | PHP 8.2+ / 8.3 | PHP 8.2-FPM / 8.3-FPM |
| **Ekstensi PHP Wajib**| `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `gd`, `zip` | Sama dengan lokal |
| **Basis Data** | MySQL 8.0 (Port 3306) | MySQL 8.0 Community Server |
| **Node.js & Bundler** | Node.js 20+ (LTS) & Vite | Node.js 20+ (LTS) & Vite |
| **Web Server** | Nginx / Apache bawaan Laragon | Nginx Engine (HTTP/2, TLS 1.3, Gzip) |
| **Dependency Mgr** | Composer 2.7+ & NPM / PNPM | Composer 2.7+ & NPM |
| **SSL / HTTPS** | Auto Virtual Host SSL (Laragon) | Let's Encrypt Certbot SSL TLS 1.3 |

---

## 2. Instalasi Lingkungan Pengembangan Lokal (Laragon)

Direktori proyek terpasang di: `c:\laragon\www\lms-techsoe-sdn9`

### Langkah 1: Kloning & Pengaturan Dependensi
Buka terminal PowerShell atau Laragon Terminal di root direktori proyek:
```powershell
# Masuk ke direktori
cd c:\laragon\www\lms-techsoe-sdn9

# Salin berkas konfigurasi lingkungan
cp .env.example .env

# Install dependensi PHP (Laravel 13)
composer install

# Install dependensi React, Inertia, & Tailwind
npm install

# Build aset frontend via Vite untuk testing
npm run build
```

### Langkah 2: Konfigurasi Basis Data (.env)
Sesuaikan parameter database di file `.env`:
```ini
APP_NAME="Smart School LMS SDN 9"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://lms-techsoe-sdn9.test

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms_techsoe_sdn9
DB_USERNAME=root
DB_PASSWORD=

VITE_APP_NAME="${APP_NAME}"
```

### Langkah 3: Inisialisasi Database & Storage Link
```powershell
# Generate application encryption key
php artisan key:generate

# Jalankan migrasi dan seeder awal MySQL
php artisan migrate:fresh --seed

# Hubungkan direktori storage ke public
php artisan storage:link
```

### Langkah 4: Menjalankan Server Pengembangan
```powershell
# Jalankan Vite Dev Server untuk hot-reloading React
npm run dev
```

### Langkah 5: Kredensial Akun Bawaan (Default Seed Accounts)
| Peran | Username / NIP / NISN | Password Default | Keterangan |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `password123` | Akses penuh sistem |
| **Kepala Sekolah** | `198502012010012025` | `password123` | Hendrika Genti, S.Pd.SD. |
| **Guru / Wali Kelas** | `198705122015021003` | `password123` | Akun demo guru kelas |
| **Guru BK** | `199003202019032008` | `password123` | Akun demo konseling |
| **Siswa Demo** | `0081234567` (NISN) | `password123` | Akun siswa kelas 6 |

---

## 3. Konfigurasi Server Produksi (Ubuntu VPS & Nginx)

### 3.1 Blok Server Nginx (/etc/nginx/sites-available/lms.sdn9gandangbatu.sch.id)

```nginx
server {
    listen 80;
    server_name lms.sdn9gandangbatu.sch.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lms.sdn9gandangbatu.sch.id;
    root /var/www/lms-techsoe-sdn9/public;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/lms.sdn9gandangbatu.sch.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lms.sdn9gandangbatu.sch.id/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    index index.php index.html;
    charset utf-8;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Ukuran Maksimum Upload (Bahan ajar & tugas)
    client_max_body_size 15M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 3.2 Hak Akses Direktori Linux
```bash
# Set kepemilikan user web server
sudo chown -R www-data:www-data /var/www/lms-techsoe-sdn9

# Set permission direktori & storage
sudo find /var/www/lms-techsoe-sdn9 -type d -exec chmod 755 {} \;
sudo find /var/www/lms-techsoe-sdn9 -type f -exec chmod 644 {} \;
sudo chmod -R 775 /var/www/lms-techsoe-sdn9/storage /var/www/lms-techsoe-sdn9/bootstrap/cache
```

### 3.3 Optimasi Produksi Laravel & Build React Aset
```bash
# Build bundle React produksi
npm run build

# Cache konfigurasi Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

---

## 4. Penjadwalan Tugas & Pencadangan Otomatis (Cron & Backup)

### 4.1 Laravel Task Scheduler
Tambahkan entri cronjob pada Linux server (`crontab -e -u www-data`):
```bash
* * * * * cd /var/www/lms-techsoe-sdn9 && php artisan schedule:run >> /dev/null 2>&1
```

### 4.2 Skrip Pencadangan Basis Data Harian (Backup)
Pencadangan otomatis dieksekusi setiap pukul 02.00 WITA:
```bash
# /etc/cron.daily/lms_backup.sh
#!/bin/bash
BACKUP_DIR="/var/backups/lms_techsoe_sdn9"
DATE=$(date +'%Y-%m-%d_%H%M%S')
mkdir -p $BACKUP_DIR

# Dump Database MySQL 8.0
mysqldump -u root -p'SECURE_DB_PASSWORD' lms_techsoe_sdn9 | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# Arsipkan direktori bahan ajar & tugas
tar -czf "$BACKUP_DIR/storage_$DATE.tar.gz" -C /var/www/lms-techsoe-sdn9/storage/app/public .

# Hapus backup yang lebih tua dari 30 hari
find $BACKUP_DIR -type f -mtime +30 -delete
```

---

## 5. Prosedur Pemulihan Bencana (Disaster Recovery Plan)

1. **Restorasi Database:**
   ```bash
   gunzip < /var/backups/lms_techsoe_sdn9/db_2026-09-25_020000.sql.gz | mysql -u root -p lms_techsoe_sdn9
   ```
2. **Restorasi File Storage:**
   ```bash
   tar -xzf /var/backups/lms_techsoe_sdn9/storage_2026-09-25_020000.tar.gz -C /var/www/lms-techsoe-sdn9/storage/app/public/
   ```
3. **Bersihkan Cache Aplikasi:**
   ```bash
   php artisan optimize:clear
   php artisan optimize
   ```
