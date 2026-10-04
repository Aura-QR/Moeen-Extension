/* Exercises syncAuthFromSite: signing the extension in and out from the Hader
 * site, so teachers do not log in to the extension separately.
 *
 * The functions are sliced out of background.js and run against a fake
 * chrome.storage and API. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'background.js'), 'utf8').replace(/\r\n/g, '\n');
const START = 'const HADAR_AUTH_SESSION_KEY = ';
const END = 'async function findMadrasatiTab(';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

function build({ stored, users }) {
  const state = { stored, apiCalls: 0 };
  const chrome = {
    storage: {
      local: {
        get: async (key) => (state.stored ? { [key]: state.stored } : {}),
        set: async (items) => { state.stored = Object.values(items)[0]; },
        remove: async () => { state.stored = null; },
      },
    },
  };
  const callHadarApi = async (apiPath, options, token) => {
    state.apiCalls++;
    const user = users[token];
    return user ? { ok: true, status: 200, data: { user } } : { ok: false, status: 401, data: null };
  };
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice the auth sync out of background.js');
  const factory = new Function('chrome', 'callHadarApi', 'globalThis', `
    ${SOURCE.slice(from, to)}
    return { syncAuthFromSite, isHaderSiteUrl };
  `);
  return { state, ...factory(chrome, callHadarApi, {}) };
}

const TEACHER = { id: 7, name: 'معلم', email: 't@example.com', role: 'teacher' };
const OTHER = { id: 9, name: 'آخر', email: 'o@example.com', role: 'teacher' };

(async () => {
  console.log('\n— signing in on the site —');
  {
    const { state, syncAuthFromSite } = build({ stored: null, users: { good: TEACHER } });
    const result = await syncAuthFromSite({ token: 'good' });
    check('signs the extension in', result.signedIn === true && state.stored?.isAuthenticated === true);
    check('as the site account', state.stored.token === 'good' && state.stored.user.email === TEACHER.email);
    await syncAuthFromSite({ token: 'good' });
    check('the same token is not checked again', state.apiCalls === 1);
  }

  console.log('\n— a token the API rejects —');
  {
    const { state, syncAuthFromSite } = build({ stored: null, users: {} });
    const result = await syncAuthFromSite({ token: 'forged' });
    check('is not kept', result.success === false && state.stored === null);
  }

  console.log('\n— another account signs in on the site —');
  {
    const { state, syncAuthFromSite } = build({
      stored: { isAuthenticated: true, token: 'old', user: OTHER },
      users: { good: TEACHER },
    });
    await syncAuthFromSite({ token: 'good' });
    check('the extension follows the site', state.stored.token === 'good' && state.stored.user.id === TEACHER.id);
  }

  console.log('\n— signing out on the site —');
  {
    const { state, syncAuthFromSite } = build({
      stored: { isAuthenticated: true, token: 'good', user: TEACHER },
      users: { good: TEACHER },
    });
    await syncAuthFromSite({ token: null, previousToken: 'good' });
    check('signs the extension out', state.stored === null);
  }
  {
    const { state, syncAuthFromSite } = build({
      stored: { isAuthenticated: true, token: 'own', user: OTHER },
      users: {},
    });
    await syncAuthFromSite({ token: null, previousToken: 'good' });
    check('but not an extension signed in on its own as someone else', state.stored?.token === 'own');
  }

  console.log('\n— who may ask —');
  {
    const { isHaderSiteUrl } = build({ stored: null, users: {} });
    check('the Hader site', isHaderSiteUrl('https://haderedu.com/preparation/schedule'));
    check('local development', isHaderSiteUrl('http://localhost:3000/login'));
    check('not a look-alike domain', !isHaderSiteUrl('https://haderedu.com.evil.example/'));
    check('not Madrasati', !isHaderSiteUrl('https://schools.madrasati.sa/'));
  }

  console.log(failures ? `\n${failures} failed` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
