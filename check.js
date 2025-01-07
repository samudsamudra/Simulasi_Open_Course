const bcrypt = require('bcrypt');

// Hash bcrypt yang ingin dicek
const storedHash = "$2b$10$KIXQsmThyK6uG81tLtFlPOI16y6Pg6IuCGkVZ4ZnG5EBkoxYy3T2m";

// Coba tebak password (edit sesuai dugaanmu)
const plainPassword = "password123"; // Ubah ini dengan tebakan password

async function checkPassword() {
    const match = await bcrypt.compare(plainPassword, storedHash);
    console.log(match ? "✅ Password cocok!" : "❌ Password salah!");
}

checkPassword();
