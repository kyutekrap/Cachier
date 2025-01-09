import CryptoJS from 'crypto-js';
import { ConfigOptions } from './ConfigOptions';

export function encrypt(text: string) {
    const saltedText = ConfigOptions._salt + text;
    const encrypted = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(saltedText));
    return encrypted;
}