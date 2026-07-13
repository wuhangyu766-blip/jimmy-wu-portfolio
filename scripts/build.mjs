import { cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const client = resolve(dist, 'client');

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await copyFile(resolve(root, 'index.html'), resolve(client, 'index.html'));
await cp(resolve(root, 'assets'), resolve(client, 'assets'), { recursive: true, force: true });
await cp(resolve(root, 'server'), resolve(dist, 'server'), { recursive: true, force: true });
await cp(resolve(root, '.openai'), resolve(dist, '.openai'), { recursive: true, force: true });

console.log('Static portfolio build complete');
