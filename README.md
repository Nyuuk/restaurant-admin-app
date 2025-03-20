# Aplikasi Admin Restoran

Aplikasi Admin untuk sistem manajemen restoran berbasis web yang dirancang untuk meningkatkan efisiensi operasional restoran skala kecil.

## Deskripsi Aplikasi

Aplikasi Admin Restoran adalah panel administrasi untuk mengelola seluruh aspek operasional restoran, termasuk:

- **Manajemen Menu**: Menambah, mengedit, dan menghapus menu serta kategori
- **Manajemen Pesanan**: Melihat dan memproses pesanan masuk
- **Manajemen Meja**: Mengatur meja, membuat QR code untuk scan pelanggan
- **Manajemen Reservasi**: Mencatat dan mengelola reservasi pelanggan
- **Manajemen Pembayaran**: Memproses dan melacak pembayaran
- **Analitik**: Melihat laporan penjualan dan tren bisnis

Aplikasi ini melengkapi aplikasi pelanggan yang memungkinkan pelanggan memesan makanan melalui scan QR code di meja atau memesan take away.

## Teknologi

Aplikasi ini dibangun menggunakan:

- **Frontend**: JavaScript, jQuery, Tailwind CSS, Chart.js, DataTables
- **Build Tools**: Webpack, PostCSS, Babel
- **Backend** (terpisah): Golang dengan Echo/Gin framework, PostgreSQL

## Prasyarat

- Node.js (v14 atau lebih baru)
- npm atau yarn

## Instalasi

Clone repositori ini dan instal dependensi:

```bash
# Clone repositori
git clone https://github.com/username/restaurant-admin.git
cd restaurant-admin

# Instal dependensi
npm install
# atau dengan yarn
yarn install
```

## Pengembangan

Untuk menjalankan server pengembangan:

```bash
npm run dev
# atau dengan yarn
yarn dev
```

Server pengembangan akan berjalan di `http://localhost:9000`.

## Build untuk Produksi

Untuk membuat build produksi:

```bash
npm run build
# atau dengan yarn
yarn build
```

File build akan tersedia di folder `public/`.

## Deployment

### Deployment dengan Docker (Direkomendasikan)

1. **Buat Dockerfile**

```dockerfile
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Buat nginx.conf**

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Konfigurasi untuk API proxy jika diperlukan
    location /api {
        proxy_pass http://api-service:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Build dan jalankan Docker container**

```bash
# Build Docker image
docker build -t restaurant-admin .

# Jalankan container
docker run -d -p 80:80 restaurant-admin
```

### Deployment dengan Nginx (Tanpa Docker)

1. Build aplikasi seperti di atas
2. Salin folder `public/` ke direktori web server Anda (misalnya `/var/www/html/admin`)
3. Konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name admin.restaurant.com;

    root /var/www/html/admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. Restart Nginx:

```bash
sudo systemctl restart nginx
```

### Deployment dengan Server Statis

Anda juga dapat meng-host folder `public/` di layanan hosting statis seperti:
- AWS S3 + CloudFront
- Google Cloud Storage + CDN
- Netlify
- Vercel

Perhatikan bahwa jika Anda menggunakan hosting statis, Anda perlu mengkonfigurasi API backend Anda untuk menerima CORS dari domain hosting statis Anda.

## Konfigurasi API Backend

Secara default, aplikasi frontend mengharapkan API backend tersedia di `http://localhost:8080/api`. 

Untuk mengubah URL API:
1. Buka file `src/js/services/api.js`
2. Ubah nilai `API_BASE_URL` ke URL API Anda

```javascript
// API base URL
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

Untuk deployment produksi, sebaiknya gunakan variabel lingkungan untuk mengonfigurasi URL API.

## Akun Demo

Aplikasi ini dilengkapi dengan akun demo:

- **Admin**  
  Username: `admin`  
  Password: `admin123`

- **Kasir**  
  Username: `kasir`  
  Password: `kasir123`

## Struktur Folder

```
restaurant-admin/
├── public/                      # Folder output build
├── src/
│   ├── js/
│   │   ├── components/          # Komponen UI reusable
│   │   ├── pages/               # JavaScript untuk halaman spesifik
│   │   ├── services/            # Layanan (API, Auth, dll)
│   ├── css/                     # File CSS
│   ├── assets/                  # Asset (gambar, font, dll)
│   └── templates/               # Template HTML
├── package.json                 # Konfigurasi npm
├── webpack.config.js            # Konfigurasi webpack
├── postcss.config.js            # Konfigurasi PostCSS
└── tailwind.config.js           # Konfigurasi Tailwind CSS
```

## Pengembangan Lebih Lanjut

Aplikasi ini masih dapat dikembangkan lebih lanjut:

1. Implementasikan integrasi API yang sebenarnya (mengganti mock API)
2. Tambahkan fitur pencetakan struk
3. Tambahkan fitur notifikasi real-time untuk pesanan baru
4. Implementasikan fitur ekspor data
5. Tambahkan fitur manajemen pengguna dan kontrol akses

## Lisensi

[MIT](LICENSE)

## Kontak

Untuk pertanyaan atau dukungan, silakan hubungi [your-email@example.com](mailto:your-email@example.com).