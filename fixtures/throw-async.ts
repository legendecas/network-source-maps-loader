const message = 'Message ' + Math.random();

export async function Throw() {
  throw new Error(message)
}

await Throw();

// To recreate:
//
// npx tsc --module esnext --target es2017 --outDir fixtures/source-map --sourceMap fixtures/source-map/throw-async.ts
// + rename js to mjs
// + rename js to mjs in source map comment in mjs file
// + rename source map comment in js file
