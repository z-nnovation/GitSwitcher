const crypto = require('crypto');
const fs = require('fs');
const Database = require('better-sqlite3');

// Генерация случайного ключа шифрования
const encryptionKey = crypto.randomBytes(32).toString('hex');

// Сохранение ключа в файл для последующего использования
fs.writeFileSync('encryption-key.txt', encryptionKey);

// Инициализация базы данных с использованием ключа шифрования
const db = new Database('secure-database.db');
db.exec(`PRAGMA key = '${encryptionKey}';`);

// Создание таблицы для аккаунтов
db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    );
`);

console.log('Database initialized with encryption.');
