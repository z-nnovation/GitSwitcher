#!/usr/bin/env node

import { createTable, deleteTable, addAccount, deleteAccount, showAccounts, showTables, switchAccount } from './services/credentials';

const command = process.argv[2];
const tableName = process.argv[3];
const identifier = process.argv[4];
const email = process.argv[5];

if (command === 'create') {
    createTable(tableName);
} else if (command === 'delete-table') {
    deleteTable(tableName);
} else if (command === 'add') {
    if (!identifier || !email) {
        console.error('Please provide both a name and an email.');
        process.exit(1);
    }
    addAccount(tableName, identifier, email, process.argv[6]);
} else if (command === 'delete-account') {
    if (!identifier) {
        console.error('Please provide an account ID or name.');
        process.exit(1);
    }
    deleteAccount(tableName, identifier);
} else if (command === 'show') {
    showAccounts(tableName);
} else if (command === 'show-folders') {
    showTables();
} else if (command === 'use') {
    switchAccount(tableName, identifier);
} else {
    console.error('Unknown command.');
    process.exit(1);
}
