import { db } from './database';
import { encrypt, decrypt } from './encryption';
import * as validator from 'validator';
import { storeCredentials } from './utils';
import { execSync } from 'child_process';


interface AccountConfig {
    id: number;
    name: string;
    email: string;
    token?: string;
}

export function createTable(tableName: string): void {
    const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`).get(tableName);

    if (tableExists) {
        console.log(`Table '${tableName}' already exists.`);
    } else {
        db.exec(`
            CREATE TABLE ${tableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                token TEXT, /* Поле для хранения зашифрованного токена или пароля */
                UNIQUE(name, email)
            );
        `);
        console.log(`Table '${tableName}' created successfully.`);
    }
}

export function deleteTable(tableName: string): void {
    const tableExists = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`).get(tableName);

    if (!tableExists) {
        console.error(`Table '${tableName}' does not exist.`);
    } else {
        db.exec(`DROP TABLE ${tableName}`);
        console.log(`Table '${tableName}' deleted successfully.`);
    }
}

export function addAccount(tableName: string, name: string, email: string, token?: string): void {
    if (!validator.isEmail(email)) {
        console.error('Invalid email address.');
        process.exit(1);
    }

    const exists = db.prepare(`SELECT * FROM ${tableName} WHERE name = ? OR email = ?`).get(name, email);
    if (exists) {
        console.error('Account with this name or email already exists.');
        process.exit(1);
    }

    const encryptedToken = token ? encrypt(token) : null;
    const stmt = db.prepare(`INSERT INTO ${tableName} (name, email, token) VALUES (?, ?, ?)`);
    stmt.run(name, email, encryptedToken);
    console.log(`Account '${name}' added to table '${tableName}'.`);

    if (token) {
        storeCredentials("github.com", name, decrypt(encryptedToken!)); 
    }
}

export function deleteAccount(tableName: string, identifier: string): void {
    const stmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ? OR name = ?`);
    const result = stmt.run(identifier, identifier);

    if (result.changes > 0) {
        console.log(`Account with identifier '${identifier}' deleted successfully from table '${tableName}'.`);
    } else {
        console.error(`No account found with identifier '${identifier}' in table '${tableName}'.`);
    }
}

export function showAccounts(tableName: string): void {
    const rows = db.prepare(`SELECT id, name FROM ${tableName}`).all() as AccountConfig[];

    if (rows.length === 0) {
        console.log(`No accounts found in folder '${tableName}'.`);
    } else {
        console.log(`Accounts in table '${tableName}':`);
        rows.forEach((row) => {
            console.log(`${row.id}: ${row.name}`);
        });
    }
}

export function showTables(): void {
    const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence', 'accounts')`).all() as { name: string }[];

    if (tables.length === 0) {
        console.log('No folders found.');
    } else {
        console.log('Your folders:');
        tables.forEach((table) => {
            console.log(table.name);
        });
    }
}

export function switchAccount(tableName: string, identifier: string): void {
    // Проверяем, существует ли таблица
    const tableExists = db.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name=?;
    `).get(tableName);

    if (!tableExists) {
        console.error(`Table '${tableName}' does not exist.`);
        process.exit(1);
    }

    let row: AccountConfig | undefined;

    if (!isNaN(Number(identifier))) {
        const id = parseInt(identifier, 10);
        row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id) as AccountConfig;
    } else {
        row = db.prepare(`SELECT * FROM ${tableName} WHERE name = ?`).get(identifier) as AccountConfig;
    }

    if (!row) {
        console.error(`Account with ${!isNaN(Number(identifier)) ? 'ID' : 'name'} '${identifier}' not found in table '${tableName}'`);
        process.exit(1);
    }

    console.log(`Switching to account '${row.name}' with the following details:`);
    console.log(`Name: ${row.name}`);
    console.log(`Email: ${row.email}`);
    if (row.token) {
        console.log(`Token/Password: ****`);
        storeCredentials("github.com", row.name, decrypt(row.token!));
    }

    execSync(`git config --global user.name "${row.name}"`);
    execSync(`git config --global user.email "${row.email}"`);

    console.log(`Switched to account '${row.name}'`);
}
