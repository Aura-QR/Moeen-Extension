/* Exercises requestLessonAI: the lesson's AI text through Hader first, and
 * n8n directly only as a fallback, so preparation never stops.
 *
 * The function is sliced out of content.js and run against a fake runtime
 * message channel, storage and fetch. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8').replace(/\r\n/g, '\n');
const START = '    var DIRECT_AI_FALLBACK = true;';
const END = '    var LESSON_RESOURCE_ERROR_PATTERNS = [';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

function build({ session, hader, n8n, fallback = true }) {
  const calls = { hader: [], n8n: [] };
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice requestLessonAI out of content.js');
  const code = SOURCE.slice(from, to).replace('var DIRECT_AI_FALLBACK = true;', `var DIRECT_AI_FALLBACK = ${fallback};`);
  const factory = new Function('getLocal', 'sendRuntimeMessage', 'fetch', 'log', 'AUTH_SESSION_KEY', 'N8N_AI_WEBHOOK_URL', 'N8N_AI_API_KEY', 'AI_WEBHOOK_TIMEOUT_MS', `
    ${code}
    return requestLessonAI;
  `);
  const requestLessonAI = factory(
    async () => (session ? { HADAR_AUTH: session } : {}),
    async (message) => { calls.hader.push(message); return typeof hader === 'function' ? hader(message) : hader; },
    async (url, options) => { calls.n8n.push({ url, options }); return n8n(); },
    () => {},
    'HADAR_AUTH',
    'https://n8n.example/webhook',
    'test-key',
    1000,
  );
  return { requestLessonAI, calls };
}

const lesson = { grade: 'الصف الخامس', subject: 'العلوم', lesson_title: 'دورة الماء' };
const n8nAnswer = [{ data: { prep: 'من n8n' } }];
const okN8n = () => ({ ok: true, status: 200, json: async () => n8nAnswer });

(async () => {
  {
    const { requestLessonAI, calls } = build({
      session: { token: 'tok', tokenType: 'Bearer' },
      hader: { ok: true, status: 200, data: { prep: 'من حضّر' } },
      n8n: okN8n,
    });
    const result = await requestLessonAI(lesson);
    check('answers through Hader when it works', result && result.prep === 'من حضّر');
    check('sends the lesson and the token to Hader', calls.hader[0].action === 'LESSON_AI' && calls.hader[0].token === 'tok' && calls.hader[0].payload === lesson);
    check('does not call n8n when Hader answered', calls.n8n.length === 0);
  }
  for (const [label, hader] of [['Hader is not deployed yet (404)', { ok: false, status: 404, data: null }],
                                 ['Hader fails (502)', { ok: false, status: 502, data: { message: 'x' } }],
                                 ['the background has no handler (older build)', undefined],
                                 ['the message channel throws', () => { throw new Error('closed'); }]]) {
    const { requestLessonAI, calls } = build({ session: { token: 'tok' }, hader, n8n: okN8n });
    const result = await requestLessonAI(lesson);
    check(`falls back to n8n when ${label}`, result === n8nAnswer && calls.n8n.length === 1);
  }
  {
    const { requestLessonAI, calls } = build({ session: null, hader: { ok: true, data: {} }, n8n: okN8n });
    const result = await requestLessonAI(lesson);
    check('not signed in: skips Hader and calls n8n as before', result === n8nAnswer && calls.hader.length === 0);
    const sent = calls.n8n[0];
    check('the direct call is the same as before', sent.url === 'https://n8n.example/webhook'
      && sent.options.headers['x-api-key'] === 'test-key' && sent.options.body === JSON.stringify(lesson));
  }
  {
    const { requestLessonAI } = build({ session: { token: 'tok' }, hader: { ok: false, status: 500 }, n8n: () => ({ ok: false, status: 500 }) });
    check('both fail: null, so the lesson uses its default texts', (await requestLessonAI(lesson)) === null);
  }
  {
    const { requestLessonAI } = build({ session: { token: 'tok' }, hader: { ok: false, status: 500 }, n8n: () => { throw new Error('offline'); } });
    check('n8n offline: null, no exception', (await requestLessonAI(lesson)) === null);
  }
  {
    const { requestLessonAI, calls } = build({ session: { token: 'tok' }, hader: { ok: false, status: 500 }, n8n: okN8n, fallback: false });
    check('with the fallback off: null and n8n is never called', (await requestLessonAI(lesson)) === null && calls.n8n.length === 0);
  }

  if (failures) {
    console.error(`\n${failures} check(s) failed`);
    process.exit(1);
  }
  console.log('\nAll lesson AI checks passed.');
})();
