import fs from 'fs';
import path from 'path';

const __dirname = process.cwd();
const filePath = path.join(__dirname, 'cachier.config.mjs');

fs.writeFile(filePath, `/** @type {import('cachier-api').IndexedDBConfig} */
export const dbConfig = {};`, (err) => {
    if (err) throw err;
});