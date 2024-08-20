import * as fs from 'fs';
import * as path from 'path';

export function storeCredentials(remoteUrl: string, name: string, token: string): void {
    const credsDir = path.join(__dirname, '.creds');
    
    if (!fs.existsSync(credsDir)) {
        fs.mkdirSync(credsDir);
    }

    const credentialsFile = path.join(credsDir, 'git-credentials');
    const credentialsEntry = `https://${name}:${token}@${remoteUrl}`;

    fs.appendFileSync(credentialsFile, `${credentialsEntry}\n`, 'utf8');
    console.log(`Credentials for ${name} have been stored.`);
}
