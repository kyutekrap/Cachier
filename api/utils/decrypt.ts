import CryptoJS from 'crypto-js';
import { ConfigOptions } from './ConfigOptions';

export function decrypt(encryptedText: string) {
    const decoded = CryptoJS.enc.Base64.parse(encryptedText).toString(CryptoJS.enc.Utf8);
    return decoded.slice(ConfigOptions._salt.length);
}