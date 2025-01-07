
---

# 🎓 E-Learning Backend 🚀  
**Sistem backend untuk platform e-learning yang modern, aman, dan scalable. Dikembangkan menggunakan NestJS, Prisma, dan MySQL untuk pengalaman belajar yang lebih efektif.**

---

## 🌟 **Fitur Unggulan**
- **📚 Manajemen Course:** CRUD untuk admin dan instruktur. Student dapat mendaftar ke course yang tersedia.
- **📝 Kuis dan Submission:** Student bisa menyelesaikan kuis dan mengumpulkan tugas.
- **🏅 Sertifikat:** Sertifikat digital untuk student setelah menyelesaikan course.
- **🔒 Keamanan Tinggi:** Autentikasi JWT, hashing password, dan validasi data.
- **⚡ Performant & Scalable:** Teknologi modern untuk mendukung banyak pengguna.

---

## 🛠 **Teknologi yang Digunakan**
- **NestJS** - Framework backend yang modular dan efisien.
- **MySQL** - Relational database untuk menyimpan data.
- **Prisma ORM** - ORM untuk mempermudah pengelolaan database.
- **JWT Authentication** - Sistem keamanan berbasis token.
- **TypeScript** - Supaya lebih aman dan scalable.

---

## 🚀 **Cara Menjalankan Proyek**
Ikuti langkah berikut untuk menjalankan proyek di lokal:

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/samudsamudra/Simulasi_Open_Course.git
cd (nama repo)
```

### 2️⃣ **Install Dependencies**
```bash
npm install
```

### 3️⃣ **Setup File `.env`**
Buat file `.env` di root folder dengan isi berikut:
```
DATABASE_URL=(Silahkan baca dulu reponya)
JWT_SECRET=(Silahkan baca dulu reponya)
```

### 4️⃣ **Setup Database**
Jalankan migrasi database dan generate Prisma Client:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ **Run Server**
Jalankan server development:
```bash
npm run start:dev
```

---

## 📌 **Fitur yang Sudah Dikembangkan**
- **✅ Autentikasi User**: Register & Login dengan sistem JWT.
- **✅ Manajemen Course**: CRUD untuk admin & instruktur.
- **✅ Pendaftaran Course**: Student dapat mendaftar ke course tertentu.
- **✅ Kuis & Submission**: Sistem kuis dengan evaluasi otomatis.
- **✅ Sertifikat Digital**: Sertifikat otomatis setelah menyelesaikan course.

---

## 🔮 **Roadmap Pengembangan**
Fitur berikut akan segera ditambahkan:
1. **📊 Leaderboard & Gamifikasi**  
   - Ranking berdasarkan poin dari kuis & penyelesaian course.
   - Hadiah menarik untuk top student.

2. **⭐ Rating & Review Course**  
   - Review dari student untuk meningkatkan kualitas course.
   - Sistem bintang untuk mempermudah evaluasi course.

3. **🔔 Notifikasi untuk User**  
   - Notifikasi real-time untuk kuis baru atau pengumuman penting.
   - Email notifikasi untuk tugas atau progress course.

---

## 🏗️ **Struktur Proyek**
```
e-learning-backend/
├── src/
│   ├── auth/              # Module autentikasi (JWT, Guards, dll.)
│   ├── courses/           # Module untuk course dan quiz
│   ├── users/             # Module user management
│   ├── certificates/      # Module sertifikat
│   └── main.ts            # Entry point aplikasi
├── prisma/
│   ├── schema.prisma      # Schema Prisma untuk database
│   └── migrations/        # File migrasi database
├── .env                   # Konfigurasi environment
└── README.md              # Dokumentasi proyek
```

---

## 💻 **Endpoint API**
Berikut adalah beberapa endpoint utama dalam sistem:

### 🔒 **Auth**
| Endpoint         | Method | Deskripsi                      |
|------------------|--------|--------------------------------|
| `/auth/register` | POST   | Mendaftarkan user baru         |
| `/auth/login`    | POST   | Login user (JWT Authentication)|

### 📚 **Courses**
| Endpoint                   | Method | Deskripsi                            |
|----------------------------|--------|--------------------------------------|
| `/courses`                 | GET    | Mendapatkan semua course             |
| `/courses/:id`             | GET    | Mendapatkan detail course            |
| `/courses/:id/register`    | POST   | Mendaftarkan student ke sebuah course|

### 🏅 **Certificates**
| Endpoint                   | Method | Deskripsi                            |
|----------------------------|--------|--------------------------------------|
| `/certificates/:courseId`  | POST   | Mengeluarkan sertifikat untuk course |
| `/certificates/my-certificates` | GET | Mendapatkan semua sertifikat student |

---

## ✨ **Kontributor**
- [Samudra](https://github.com/samudsamudra) - **Developer & Maintainer**

---

🚀 **Siap untuk berkontribusi atau memberikan masukan? Jangan ragu untuk membuat issue atau pull request!** 😊

---
