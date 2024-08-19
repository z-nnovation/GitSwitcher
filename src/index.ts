#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const CONFIG_FILE_PATH = path.resolve(__dirname, '../.creds/git-accounts.json');

interface AccountConfig {
    name: string;
    email: string;
}

function switchAccount(account: string): void {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
        console.error(`Configuration file not found: ${CONFIG_FILE_PATH}`);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')) as Record<string, AccountConfig>;

    if (!config[account]) {
        console.error(`Account ${account} not found in configuration`);
        process.exit(1);
    }

    execSync(`git config --global user.name "${config[account].name}"`);
    execSync(`git config --global user.email "${config[account].email}"`);

    console.log(`Switched to ${account} account`);
}

const account = process.argv[2];
if (!account) {
    console.error('Please provide an account name');
    process.exit(1);
}

switchAccount(account);
