/* Exercises saveClassesToHader in background.js: new classes are created,
 * classes with the same name get their names replaced, and nothing is sent
 * when the extension isn't signed in. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8').replace(/\r\n/g, '\n');
const START = 'async function saveClassesToHader(';
const END = 'async function findMadrasatiTab(';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

function build({ stored, existing }) {
  const calls = [];
  const chrome = { storage: { local: { get: async (key) => (stored ? { [key]: stored } : {}) } } };
  const callHadarApi = async (apiPath, options) => {
    calls.push({ path: apiPath, method: options.method, body: options.body ? JSON.parse(options.body) : null });
    if (options.method === 'GET') return { ok: true, status: 200, data: { data: existing } };
    return { ok: true, status: options.method === 'POST' ? 201 : 200, data: { data: {} } };
  };
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < from) throw new Error('could not slice saveClassesToHader out of background.js');
  const factory = new Function('chrome', 'callHadarApi', 'HADAR_AUTH_SESSION_KEY', `${SOURCE.slice(from, to)}; return saveClassesToHader;`);
  return { save: factory(chrome, callHadarApi, 'HADAR_AUTH'), calls };
}

(async () => {
  const signedIn = { isAuthenticated: true, token: 't', tokenType: 'Bearer' };

  const a = build({ stored: signedIn, existing: [{ id: 7, name: 'خامس' }] });
  const result = await a.save([
    { name: 'خامس', students: ['أ', ' ب ', ''] },
    { name: 'اولى', students: ['ج'] },
    { name: 'سادس', students: [] },
  ]);
  check('saves two classes', result.success && result.saved === 2);
  check('replaces the names of an existing class', a.calls.some((c) => c.method === 'PUT' && c.path === '/classes/7' && JSON.stringify(c.body) === JSON.stringify({ students: ['أ', 'ب'] })));
  check('creates a new class', a.calls.some((c) => c.method === 'POST' && c.body.name === 'اولى' && c.body.students[0] === 'ج'));
  check('skips a class without names', !a.calls.some((c) => c.body && c.body.name === 'سادس'));

  const b = build({ stored: null, existing: [] });
  const out = await b.save([{ name: 'خامس', students: ['أ'] }]);
  check('asks to sign in first', !out.success && out.code === 'not_signed_in' && b.calls.length === 0);

  if (failures) {
    console.log(`\n${failures} check(s) failed`);
    process.exit(1);
  }
})();
