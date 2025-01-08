import crypto from 'crypto';
import { ConfigOptions } from './ConfigOptions';

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ConfigOptions._salt, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
}