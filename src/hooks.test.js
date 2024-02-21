import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import serveHandler from 'serve-handler';
import http from 'http';

import { load } from './hooks.js';
import assert from 'node:assert';

const kFixturesDir = path.resolve(new URL('.', import.meta.url).pathname, '../fixtures');

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return serveHandler(request, response);
});

test.before(async () => {
  await new Promise((resolve) => {
    server.listen(12500, () => {
      resolve();
    });
  });
});

test.after(async () => {
  server.close();
});

test('should resolve source map url', async (t) => {
  const filename = path.join(kFixturesDir, 'throw-async.mjs');
  const content = await fs.readFile(path.join(kFixturesDir, 'throw-async.mjs'), 'utf8');
  const result = await load(url.pathToFileURL(filename), {}, () => ({
    format: 'module',
    source: content,
  }));

  const expected = await fs.readFile(path.join(kFixturesDir, 'throw-async.mjs'), 'utf8');
  assert.strictEqual(result.source, expected);
});
