
---

# **📚 Open Learning API - NestJS & Prisma**  
🚀 **Backend API untuk Platform E-Learning** yang dibangun dengan **NestJS, Prisma, dan MySQL**.  
💡 **Mendukung autentikasi JWT, manajemen kursus, sistem kuis, dan sertifikat digital dalam format PDF.**

![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

---

## **🛠️ Tech Stack**
| **Teknologi**   | **Deskripsi** |
|----------------|--------------|
| **NestJS**    | Framework backend berbasis TypeScript |
| **Prisma**    | ORM modern untuk manajemen database |
| **MySQL**     | Database relasional |
| **JWT**       | Autentikasi berbasis JSON Web Token |
| **PDFKit**    | Untuk pembuatan sertifikat dalam format PDF |

---

## **✨ Fitur Utama**
✅ **Autentikasi JWT** (Login & Register)  
✅ **CRUD User & Course**  
✅ **Student dapat mendaftar ke Course**  
✅ **Sistem Kuis dengan Submission**  
✅ **Sertifikat PDF untuk Student yang menyelesaikan Course** 🏆  
✅ **GitHub Actions dengan Prettier untuk otomatisasi kode yang rapi**  

---

## **📌 Setup & Instalasi**
### **1️⃣ Clone Repository**
```sh
git clone https://github.com/username/repo-name.git
cd repo-name
```

### **2️⃣ Instal Dependencies**
```sh
npm install
```

### **3️⃣ Konfigurasi Database**
Buat file `.env` berdasarkan `.env.example` dan isi dengan kredensial database MySQL:
```env
DATABASE_URL="rahasia xixi"
JWT_SECRET="rahasia xixi"
```

### **4️⃣ Jalankan Migrasi Database**
```sh
npx prisma migrate dev --name init
```

### **5️⃣ Generate Prisma Client**
```sh
npx prisma generate
```

### **6️⃣ Jalankan Server**
```sh
npm run start
```

---

## **🌍 API Documentation**

### **🧑‍💻 Autentikasi (Auth)**
| **Method** | **Endpoint**          | **Deskripsi** |
|------------|----------------------|--------------|
| `POST`    | `/auth/register`      | Mendaftarkan pengguna baru |
| `POST`    | `/auth/login`         | Login pengguna & mendapatkan JWT |

### **📚 Manajemen Courses**
| **Method** | **Endpoint**          | **Deskripsi** |
|------------|----------------------|--------------|
| `GET`     | `/courses`            | Mendapatkan daftar semua kursus |
| `GET`     | `/courses/:id`        | Mendapatkan detail kursus berdasarkan ID |
| `POST`    | `/courses`            | Menambahkan kursus baru (Admin & Instructor) |
| `PATCH`   | `/courses/:id`        | Mengedit kursus (Admin & Instructor) |
| `DELETE`  | `/courses/:id`        | Menghapus kursus (Admin) |

### **📜 Course Enrollment**
| **Method** | **Endpoint**             | **Deskripsi** |
|------------|-------------------------|--------------|
| `POST`    | `/courses/:id/register`  | Mendaftarkan student ke kursus |
| `GET`     | `/courses/enrolled`      | Mendapatkan daftar kursus yang diikuti oleh student |

### **📝 Manajemen Kuis**
| **Method** | **Endpoint**             | **Deskripsi** |
|------------|-------------------------|--------------|
| `GET`     | `/quizzes/:courseId`     | Mendapatkan daftar kuis dalam kursus tertentu |
| `POST`    | `/quizzes/:quizId/submit` | Submit jawaban kuis oleh student |

### **🏆 Sertifikat (Certificate)**
| **Method** | **Endpoint**                         | **Deskripsi** |
|------------|-------------------------------------|--------------|
| `POST`    | `/certificates/:courseId`          | Mengeluarkan sertifikat jika semua kuis telah diselesaikan |
| `GET`     | `/certificates/my-certificates`    | Mendapatkan daftar sertifikat yang dimiliki oleh user |
| `GET`     | `/certificates/download/:userId/:courseId` | Mengunduh sertifikat dalam format PDF |

---

## **📜 Contoh Respons API**
### **✅ Issue Sertifikat**
```json
{
  "message": "Selamat! Anda mendapatkan sertifikat dari course ini 🎉",
  "data": {
    "id": 1,
    "courseId": 1,
    "issuedAt": "2025-01-07T14:30:48.192Z",
    "pdfUrl": "/certificates/1_1.pdf"
  }
}
```

### **📜 Get All Sertifikat**
```json
{
  "message": "Daftar sertifikat Anda.",
  "data": [
    {
      "id": 1,
      "courseId": 1,
      "courseTitle": "Mastering Golang",
      "issuedAt": "2025-01-07T14:30:48.192Z",
      "pdfUrl": "/certificates/1_1.pdf"
    }
  ]
}
```

---

## **🎯 Kontribusi**
Saya sangat menyambut kontribusi! Jika kamu ingin berkontribusi:  
1. **Fork** repo ini  
2. **Buat Branch** baru (`feat/nama-fitur` atau `fix/nama-bug`)  
3. **Gunakan Conventional Commit** untuk commit message:
   ```sh
   git commit -m "feat(certificates): implement PDF generation for certificates"
   ```
4. **Push & Buat Pull Request** ✨  

---

## **🛠️ Konfigurasi Prettier & Conventional Commit**
### **1️⃣ Aktifkan Prettier Auto-Apply di GitHub Actions**
Tambahkan file berikut di `.github/workflows/prettier.yml`:
```yaml
name: Prettier Check

on: [push, pull_request]

jobs:
  prettier:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        run: npm install
      - name: Run Prettier
        run: npx prettier --check .
```

### **2️⃣ Install Commitizen untuk Conventional Commits**
```sh
npm install -g commitizen
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

### **3️⃣ Gunakan Conventional Commit saat Commit**
```sh
npx cz
```

---

## **📄 Lisensi**
© 2025 Open Learning API - NestJS & Prisma.  
Proyek ini berlisensi **MIT**.

---

### 🚀 **Selamat Coding!** 😃
