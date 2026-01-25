# Healthcare Scheduling System Backend

## Deskripsi Proyek

Healthcare Scheduling System Backend adalah aplikasi backend yang dibangun dengan NestJS untuk mengelola sistem penjadwalan kesehatan. Aplikasi ini menyediakan API GraphQL untuk mengelola pasien, janji temu (appointments), alur kerja (workflows), dan autentikasi pengguna.

## Fitur Utama

- **Manajemen Pasien**: Tambah, edit, dan hapus data pasien
- **Penjadwalan Janji Temu**: Buat dan kelola janji temu medis
- **Alur Kerja**: Sistem workflow untuk proses medis
- **Autentikasi**: Login dan register dengan JWT
- **GraphQL API**: Endpoint yang fleksibel untuk frontend
- **Database**: Menggunakan MySQL dengan Prisma ORM
- **Caching**: Redis untuk performa yang lebih baik

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL
- **ORM**: Prisma
- **Caching**: Redis
- **API**: GraphQL
- **Authentication**: JWT
- **Containerization**: Docker & Docker Compose

## Prerequisites

Sebelum menjalankan proyek ini, pastikan Anda memiliki:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Docker dan Docker Compose (untuk menjalankan dengan container)
- MySQL (jika menjalankan lokal tanpa Docker)

## Instalasi

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd healthcare-scheduling-system-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` ke `.env`
   - Sesuaikan konfigurasi database, Redis, dan JWT sesuai kebutuhan

4. Setup database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## Menjalankan Proyek Secara Lokal

### Dengan Docker (Direkomendasikan)

1. Pastikan Docker dan Docker Compose terinstall.

2. Jalankan aplikasi dengan Docker Compose:
   ```bash
   docker-compose up --build
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

### Tanpa Docker

1. Pastikan MySQL dan Redis berjalan secara lokal.

2. Jalankan aplikasi:
   ```bash
   npm run start:dev
   ```

   Aplikasi akan berjalan di `http://localhost:3000`

## Menjalankan dengan Docker

Proyek ini sudah dikonfigurasi dengan Docker untuk memudahkan deployment.

### Menggunakan Docker Compose

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build
```

### Menggunakan Dockerfile Saja

```bash
# Build image
docker build -t healthcare-backend .

# Run container
docker run -p 3000:3000 healthcare-backend
```

## API Documentation

Aplikasi menggunakan GraphQL. Anda dapat mengakses GraphQL Playground di `http://localhost:3000/graphql` saat aplikasi berjalan.

### Contoh Query

```graphql
# Login
mutation {
  login(loginInput: { email: "user@example.com", password: "password" }) {
    accessToken
    user {
      id
      email
    }
  }
}

# Get Patients
query {
  patients {
    id
    name
    email
  }
}
```

## Testing

Jalankan test dengan:
```bash
npm run test
```

Untuk end-to-end testing:
```bash
npm run test:e2e
```

## Build untuk Production

```bash
npm run build
```

## Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.