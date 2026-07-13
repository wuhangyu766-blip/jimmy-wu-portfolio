import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';

const run = promisify(execFile);
const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('includes the approved identity and GitHub link without exposing email', () => {
  assert.match(page, /Jimmy Wu/);
  assert.match(page, /吴航宇/);
  assert.match(page, /https:\/\/github\.com\/wuhangyu766-blip/);
  assert.doesNotMatch(page, /961360749@qq\.com/);
  assert.doesNotMatch(page, /mailto:/);
});

test('includes the required sections and excludes the phone number', () => {
  for (const id of ['projects', 'experience', 'skills', 'contact']) {
    assert.match(page, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(page, /19550128365/);
});

test('keeps the GitHub URL in the link target rather than visible copy', () => {
  assert.doesNotMatch(page, />https:\/\/github\.com\/wuhangyu766-blip</);
  assert.match(page, />访问 GitHub\s*</);
});

test('declares the static-site build command required by hosting', () => {
  assert.equal(typeof packageJson.scripts.build, 'string');
});

test('build creates a deployable dist directory', async () => {
  await run(process.execPath, ['scripts/build.mjs'], { cwd: new URL('..', import.meta.url) });
  const builtPage = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8');
  const builtStyles = await readFile(new URL('../dist/client/assets/styles.css', import.meta.url), 'utf8');
  const builtServer = await readFile(new URL('../dist/server/index.js', import.meta.url), 'utf8');
  const builtHosting = await readFile(new URL('../dist/.openai/hosting.json', import.meta.url), 'utf8');
  await assert.rejects(readFile(new URL('../dist/index.html', import.meta.url), 'utf8'));
  assert.match(builtPage, /Jimmy Wu/);
  assert.match(builtStyles, /--surface/);
  assert.match(builtServer, /export default/);
  assert.match(builtServer, /fetch\(request, env\)/);
  assert.match(builtServer, /env\.ASSETS\.fetch\(new Request\(assetUrl, request\)\)/);
  assert.match(builtServer, /pathname === '\/'/);
  assert.match(builtServer, /pathname = '\/index\.html'/);
  assert.match(builtHosting, /project_id/);
});
