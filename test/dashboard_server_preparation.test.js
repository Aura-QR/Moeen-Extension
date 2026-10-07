/* Exercises prepareDashboardThroughServer: the «حضر» button inside Madrasati.
 *
 * The button used to prepare every selected lesson after one plan check and
 * never report back, so the daily and monthly limits and the Madrasati
 * account link never applied to it. It now asks the server first (authorize),
 * names the Madrasati teacher (claim), and only then writes to Madrasati. The
 * rules below are the ones that make the limits real: nothing is written
 * unless the server agreed, and batches stay within the server's 10-lesson
 * cap.
 *
 * The functions are sliced out of content.js and evaluated against stubs —
 * content.js is one large IIFE that cannot be imported. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8').replace(/\r\n/g, '\n');
const START = '    var HADER_OPERATION_MAX_LESSONS = ';
const END = '    // src/content/dashboard-storage-helpers.js';

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`✗ ${label}\n    got:      ${JSON.stringify(actual)}\n    expected: ${JSON.stringify(expected)}`); }
  else console.log(`✓ ${label}`);
}

/** Builds prepareDashboardThroughServer over a fake server. `server` decides
 * each authorize and claim answer; every call is recorded. */
function build(server) {
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice the dashboard preparation out of content.js');

  const calls = { authorize: [], claim: [], executed: [] };
  let operations = 0;
  const stubs = {
    sendRuntimeMessage: async (message) => {
      if (message.action === 'HADER_AUTHORIZE_PREPARATION') {
        calls.authorize.push(message.lessons.map((l) => l.lesson_token));
        const answer = server.authorize(calls.authorize.length, message.lessons);
        if (!answer.ok) return answer;
        operations++;
        const lessons = message.lessons.map((l, i) => Object.assign({ preparation_id: operations * 100 + i }, l));
        server.pending = lessons;
        return { ok: true, status: 201, data: { success: true, operation_id: 'op' + operations, ticket: 't' + operations } };
      }
      if (message.action === 'HADER_PREPARATION_TICKET' && message.step === 'claim') {
        calls.claim.push(message.body);
        const answer = server.claim ? server.claim(calls.claim.length) : null;
        if (answer) return answer;
        return { ok: true, status: 200, data: { success: true, lessons: server.pending } };
      }
      throw new Error('unexpected message ' + message.action);
    },
    executeHaderBrowserPreparation: async (message) => {
      calls.executed.push(message.lessons.map((l) => l.lesson_token));
      return {
        results: message.lessons.map((l) => ({
          preparation_id: l.preparation_id,
          status: (server.failTokens || []).includes(l.lesson_token) ? 'error' : 'done',
        })),
      };
    },
    readMadrasatiPeriod: () => ({ week_date: '2026-10-04' }),
    readMadrasatiUser: () => ({ madrasati_user_id: 'F10A5C95735D01C3AC1FAAFB6F66AA30', madrasati_user_name: 'معلم' }),
    getResourceEnabled: (key) => key === 'activity' || key === 'homework',
    isHaderPreparationBusy: () => false,
    waitForHaderAllWeeksToStop: async () => {},
    updateDashboardStatus: () => {},
    scheduleWithConcurrency: () => [],
    prefetchAILessonDataForCard: async () => {},
  };
  const names = Object.keys(stubs);
  const factory = new Function(...names, 'crypto', `
    var haderAllWeeksRunning = false;
    var haderAllWeeksAbort = false;
    var haderRemotePreparationRunning = false;
    var haderRemotePreparationStartedAt = 0;
    ${SOURCE.slice(from, to)}
    return prepareDashboardThroughServer;
  `);
  return { prepare: factory(...names.map((n) => stubs[n]), { randomUUID: () => 'uuid' }), calls };
}

function cards(count) {
  return Array.from({ length: count }, (_, i) => {
    const select = { style: {} };
    const div = {
      getAttribute: (name) => (name === 'data-class-id' ? '175048' : null),
      closest: () => null,
      parentElement: null,
    };
    return {
      select,
      div,
      token: 'T' + i,
      selection: { treeValue: '528,60,' + (900 + i), treeText: 'درس ' + i },
      subjectId: '528',
      realSchoolId: 'e7f07d5ab1e7a8baa59f6fc2ba80190b',
    };
  });
}

const allowed = { authorize: () => ({ ok: true }) };

(async () => {
  console.log('\n— the server agrees —');
  {
    const { prepare, calls } = build(allowed);
    const outcome = await prepare(cards(12));
    check('batches stay within the 10-lesson cap', calls.authorize.map((b) => b.length), [10, 2]);
    check('every lesson is prepared', outcome, { done: 12, failed: 0, stopped: '' });
    check('the claim names the Madrasati teacher', calls.claim[0].madrasati_user_id, 'F10A5C95735D01C3AC1FAAFB6F66AA30');
  }

  console.log('\n— what the server is told —');
  {
    let sent = null;
    const { prepare } = build({ authorize: (_, lessons) => { sent = lessons[0]; return { ok: true }; } });
    await prepare(cards(1));
    check('the lesson as the server validates it', sent, {
      lesson_token: 'T0',
      selection_value: '528,60,900',
      selection_text: 'درس 0',
      subject_id: 528,
      classroom_id: '175048',
      school_madrasati_id: 'E7F07D5AB1E7A8BAA59F6FC2BA80190B',
      selected_modules: ['assignment', 'homework'],
      week_date: '2026-10-04',
    });
  }

  console.log('\n— a limit is reached —');
  {
    const message = 'وصلت إلى الحد اليومي في تحضير الدروس (20). يتجدد الحد غدًا.';
    const { prepare, calls } = build({ authorize: () => ({ ok: false, status: 429, data: { message } }) });
    const outcome = await prepare(cards(3));
    check('Madrasati is not written', calls.executed, []);
    check('the server\'s message is shown', outcome.stopped, message);
  }

  console.log('\n— the second batch is over the limit —');
  {
    const { prepare, calls } = build({
      authorize: (n) => (n === 1 ? { ok: true } : { ok: false, status: 429, data: { message: 'المتبقي لك اليوم 0 من 20' } }),
    });
    const outcome = await prepare(cards(14));
    check('only the agreed batch is written', calls.executed.map((b) => b.length), [10]);
    check('and it is reported with the reason', outcome, { done: 10, failed: 0, stopped: 'المتبقي لك اليوم 0 من 20' });
  }

  console.log('\n— the account is used by another teacher —');
  {
    const { prepare, calls } = build({
      authorize: () => ({ ok: true }),
      claim: () => ({ ok: false, status: 409, data: { message: 'هذا الحساب مرتبط بمعلم آخر في مدرستي.' } }),
    });
    const outcome = await prepare(cards(2));
    check('Madrasati is not written', calls.executed, []);
    check('the refusal is shown', outcome.stopped, 'هذا الحساب مرتبط بمعلم آخر في مدرستي.');
  }

  console.log('\n— a lesson fails in Madrasati —');
  {
    const { prepare } = build(Object.assign({ failTokens: ['T1'] }, allowed));
    const outcome = await prepare(cards(3));
    check('it is counted as failed, the rest as done', outcome, { done: 2, failed: 1, stopped: '' });
  }

  console.log(failures ? `\n${failures} failed` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
