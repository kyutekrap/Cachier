import crypto from 'crypto';
import { ConfigOptions } from './ConfigOptions';

export function decrypt(encryptedText: string) {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
    const encrypted = encryptedText.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ConfigOptions._salt, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}