const crypto = require('crypto');
const fs = require('fs');
const Database = require('better-sqlite3');

const encryptionKey = crypto.randomBytes(32).toString('hex');

fs.writeFileSync('encryption-key.txt', encryptionKey);

const db = new Database('secure-database.db');
db.exec(`PRAGMA key = '${encryptionKey}';`);

db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    );
`);

console.log('Database initialized with encryption.');
