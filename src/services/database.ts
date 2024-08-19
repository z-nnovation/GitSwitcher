import Database from 'better-sqlite3';
import * as fs from 'fs';

const encryptionKey = fs.readFileSync('encryption-key.txt', 'utf-8').trim();
export const db = new Database('secure-database.db');
db.exec(`PRAGMA key = '${encryptionKey}';`);
