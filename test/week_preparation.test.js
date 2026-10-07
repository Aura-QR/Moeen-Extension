/* Exercises executeHaderBrowserPreparation when the lessons belong to weeks
 * other than the one on screen in Madrasati.
 *
 * Preparation works by finding the lesson's card in the Madrasati grid, so a
 * lesson from another week used to fail with "the lesson is no longer in the
 * schedule". Each lesson now carries its week_date; the run moves the grid to
 * that week, prepares, and puts the teacher back where they were.
 *
 * The functions are sliced out of content.js and evaluated against a fake
 * Madrasati grid — content.js is one large IIFE that cannot be imported. */
const fs = require('fs');
const path = require('path');

// Windows checkouts (core.autocrlf) give content.js CRLF endings, which would
// hide the multi-line END marker below.
const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8').replace(/\r\n/g, '\n');
const START = '    function findHaderLessonSelect(token)';
const END = '    if (isContextAlive()) {\n      chrome.runtime.onMessage.addListener';

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`✗ ${label}\n    got:      ${JSON.stringify(actual)}\n    expected: ${JSON.stringify(expected)}`); }
  else console.log(`✓ ${label}`);
}

function addDays(date, days) {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** A Madrasati grid that shows one week at a time. `slots` gives a card's
 * position as { token: [day, period] }; classroom and subject are fixed. */
function fakeMadrasati({ start, weeks, firstWeek, lastWeek, slots = {} }) {
  const state = { week: start, visited: [start], prepared: [] };

  function selectFor(token) {
    return {
      getAttribute: (name) => (name === 'data-lesson-token' ? token : null),
      options: [{ value: '1,2,3' }],
      dispatchEvent() {},
      closest: () => ({
        querySelector: () => null,
        classList: { add() {}, remove() {} },
        setAttribute() {},
      }),
      parentElement: null,
    };
  }

  const stubs = {
    document: {
      querySelectorAll: () => (weeks[state.week] || []).map(selectFor),
    },
    readMadrasatiPeriod: () => ({ week_date: state.week, label: 'الفترة ' + state.week }),
    harvestScheduleForHader: async () => ({
      success: true,
      lessons: (weeks[state.week] || []).map((token) => ({
        token,
        day: (slots[token] || [0, 1])[0],
        period: (slots[token] || [0, 1])[1],
        classroom_id: '175048',
        subject_id: 273,
      })),
    }),
    stepMadrasatiWeek: async (direction) => {
      const next = addDays(state.week, direction * 7);
      if (next < firstWeek || next > lastWeek) return { moved: false, reason: 'end_of_range' };
      state.week = next;
      state.visited.push(next);
      return { moved: true, period: { week_date: next } };
    },
    injectDashboardUI: async () => {},
    showHaderWorkBanner: () => {},
    updateDashboardStatus: () => {},
    hideHaderWorkBanner: () => {},
    scanDashboardCards: async () => {},
    sleep: async () => {},
    setResourceEnabled: () => {},
    prefetchAILessonDataForCard: async () => {},
    silentPrepareLesson: async (token) => { state.prepared.push(token); return true; },
  };
  return { state, stubs };
}

/** Builds executeHaderBrowserPreparation over the fake grid. */
function build(stubs) {
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice the preparation functions out of content.js');

  const messages = [];
  const names = Object.keys(stubs);
  const factory = new Function(...names, 'sendRuntimeMessage', 'Event', `
    var haderRemotePreparationRunning = true;
    ${SOURCE.slice(from, to)}
    return {
      run: executeHaderBrowserPreparation,
      running: function () { return haderRemotePreparationRunning; }
    };
  `);
  const api = factory(
    ...names.map((name) => stubs[name]),
    async (message) => { messages.push(message); return { success: true }; },
    function Event() {},
  );
  return { ...api, messages };
}

function lesson(id, token, weekDate) {
  return {
    preparation_id: id,
    lesson_token: token,
    selection_value: '1,2,3',
    selection_text: 'درس ' + id,
    selected_modules: ['assignment'],
    ...(weekDate ? { week_date: weekDate } : {}),
  };
}

(async () => {
  console.log('\n— lessons from several weeks —');
  {
    const { state, stubs } = fakeMadrasati({
      start: '2026-10-04',
      weeks: { '2026-10-04': ['A', 'C'], '2026-10-11': ['B'] },
      firstWeek: '2026-09-27',
      lastWeek: '2026-10-18',
    });
    const { run, running, messages } = build(stubs);
    await run({
      operationId: 'op',
      ticket: 't',
      lessons: [lesson(2, 'B', '2026-10-11'), lesson(1, 'A', '2026-10-04'), lesson(3, 'C')],
    });
    const result = messages.find((m) => m.action === 'HADER_BROWSER_PREPARATION_RESULT');
    check('every lesson is prepared', result.results.map((r) => [r.preparation_id, r.status]), [[3, 'done'], [1, 'done'], [2, 'done']]);
    // The grid moved once, to the later week, not back and forth per lesson.
    check('the grid visits each week once', state.visited, ['2026-10-04', '2026-10-11', '2026-10-04']);
    check('the teacher ends on the week they started on', state.week, '2026-10-04');
    check('the tab is free for the next run', running(), false);
  }

  console.log('\n— a week Madrasati will not show —');
  {
    const { state, stubs } = fakeMadrasati({
      start: '2026-10-04',
      weeks: { '2026-10-04': ['A'] },
      firstWeek: '2026-10-04',
      lastWeek: '2026-10-11',
    });
    const { run, messages } = build(stubs);
    await run({
      operationId: 'op',
      ticket: 't',
      lessons: [lesson(1, 'A', '2026-10-04'), lesson(2, 'Z', '2026-10-25')],
    });
    const result = messages.find((m) => m.action === 'HADER_BROWSER_PREPARATION_RESULT');
    check('the reachable lesson is still prepared', result.results[0].status, 'done');
    check('the unreachable one fails on its own', result.results[1].status, 'error');
    check('and Madrasati is not written for it', state.prepared, ['A']);
    check('the teacher is still put back', state.week, '2026-10-04');
  }

  console.log('\n— the saved token no longer matches the card —');
  {
    const { state, stubs } = fakeMadrasati({
      start: '2026-10-04',
      weeks: { '2026-10-04': ['A'], '2026-10-11': ['B-new', 'D'] },
      firstWeek: '2026-10-04',
      lastWeek: '2026-10-11',
      slots: { 'B-new': [2, 3], D: [2, 4] },
    });
    const { run, messages } = build(stubs);
    const rotated = Object.assign(lesson(1, 'B-old', '2026-10-11'), {
      day_of_week: 2, period_number: 3, classroom_id: '175048', subject_id: 273,
    });
    const unplaced = lesson(2, 'X-old', '2026-10-11');
    await run({ operationId: 'op', ticket: 't', lessons: [rotated, unplaced] });
    const result = messages.find((m) => m.action === 'HADER_BROWSER_PREPARATION_RESULT');
    check('the card is found by its slot', result.results.map((r) => r.status), ['done', 'error']);
    check('and prepared under its current token', state.prepared, ['B-new']);
    check('without a slot there is nothing to match on', /لم أجد الحصة/.test(result.results[1].error), true);
  }

  console.log(failures ? `\n${failures} failed` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
