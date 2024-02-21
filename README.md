# network-source-maps-loader

Load source maps from network in Node.js source-maps support.

```js
//# sourceMappingURL=http://127.0.0.1:8080/a.js.map
```

## Usage

```js
$ serve -p 12500 fixtures &
$ node --import ./src/register-hooks.js --enable-source-maps fixtures/throw-async.mjs
/Developer/github/network-source-maps-loader/fixtures/throw-async.ts:4
  throw new Error(message)
        ^

Error: Message 0.12119181844551652
    at Throw (/Developer/github/network-source-maps-loader/fixtures/throw-async.ts:4:9)
    at <anonymous> (/Developer/github/network-source-maps-loader/fixtures/throw-async.ts:7:7)
    at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:336:24)
    at async loadESM (node:internal/process/esm_loader:34:7)
    at async handleMainPromise (node:internal/modules/run_main:106:12)
```
