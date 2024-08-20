import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import * as crypto from 'crypto';

const encryptionKeyPath = path.join(__dirname, '../../encryption-key.txt');
const databasePath = path.join(__dirname, '../../secure-database.db');

let encryptionKey: string;
if (!fs.existsSync(encryptionKeyPath)) {
    encryptionKey = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(encryptionKeyPath, encryptionKey);
    console.log(`Encryption key generated and saved to ${encryptionKeyPath}`);
} else {
    encryptionKey = fs.readFileSync(encryptionKeyPath, 'utf-8').trim();
    //console.log(`Encryption key loaded from ${encryptionKeyPath}`);
}

const db = new Database(databasePath);
db.exec(`PRAGMA key = '${encryptionKey}';`);

export { db };
