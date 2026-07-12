import { cp, copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

await mkdir(dist, { recursive: true });
await copyFile(resolve(root, 'index.html'), resolve(dist, 'index.html'));
await cp(resolve(root, 'assets'), resolve(dist, 'assets'), { recursive: true, force: true });

console.log('Static portfolio build complete');
