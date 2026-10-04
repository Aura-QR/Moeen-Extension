/* Exercises harvestAllWeeksForHader, the "تحديث كل الأسابيع" walk.
 *
 * The walk used to read 20 weeks forward from the week on screen and then walk
 * all of them back. It now reads a window around this week: the weeks before
 * it and the week after it.
 *
 * The function is sliced out of content.js and run against a fake Madrasati
 * grid, as in week_preparation.test.js. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8').replace(/\r\n/g, '\n');
const START = '    var HADER_WEEKS_BEFORE = ';
const END = '    // While حضر drives the Madrasati grid';

let failures = 0;
function check(label, condition) {
  console.log((condition ? '✓ ' : '✗ ') + label);
  if (!condition) failures++;
}

function addWeeks(weekDate, count) {
  const date = new Date(weekDate + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + count * 7);
  return date.toISOString().slice(0, 10);
}

/** A Madrasati grid showing `shown`, with weeks from `first` to `last`. */
function fakeMadrasati({ thisWeek, shown, first, last, abortAfterSteps }) {
  const state = { shown, steps: 0, harvested: [], abort: false };
  function stepMadrasatiWeek(direction) {
    const next = addWeeks(state.shown, direction);
    if (next < first || next > last) return Promise.resolve({ moved: false, reason: 'end_of_range' });
    state.shown = next;
    state.steps++;
    if (abortAfterSteps && state.steps >= abortAfterSteps) state.abort = true;
    return Promise.resolve({ moved: true, period: { week_date: next } });
  }
  const stubs = {
    sendRuntimeMessage: async () => ({ success: true }),
    readMadrasatiPeriod: () => ({ week_date: state.shown }),
    haderSundayOf: () => thisWeek,
    stepMadrasatiWeek,
    goToMadrasatiWeek: async (weekDate) => {
      let moved = 0;
      while (state.shown !== weekDate) {
        const direction = weekDate > state.shown ? 1 : -1;
        await stepMadrasatiWeek(direction);
        moved += direction;
      }
      return moved;
    },
    harvestScheduleForHader: async () => {
      state.harvested.push(state.shown);
      return { success: true, week_source: 'period', week_date: state.shown };
    },
    slimHaderWeek: (snapshot) => ({ week_date: snapshot.week_date }),
  };
  return { state, stubs };
}

function build(stubs, state) {
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice the week walk out of content.js');
  const names = Object.keys(stubs);
  const factory = new Function(...names, 'abortState', `
    ${SOURCE.slice(from, to).replace(/haderAllWeeksAbort/g, 'abortState.abort')}
    return harvestAllWeeksForHader;
  `);
  return factory(...names.map((name) => stubs[name]), state);
}

const THIS_WEEK = '2026-10-04';
const TERM = { first: '2026-08-23', last: '2026-12-27' };

(async () => {
  console.log('\n— on this week, mid-term —');
  {
    const { state, stubs } = fakeMadrasati({ thisWeek: THIS_WEEK, shown: THIS_WEEK, ...TERM });
    const walk = build(stubs, state);
    const { result, moves } = await walk('h', { weeksBefore: 4, weeksAfter: 1 });
    check('reads this week, next week and the four before',
      JSON.stringify(state.harvested) === JSON.stringify([
        '2026-10-04', '2026-10-11', '2026-09-27', '2026-09-20', '2026-09-13', '2026-09-06',
      ]));
    check('six weeks reported', result.weeks_count === 6);
    check('in six clicks, not forty', state.steps === 6);
    check('a full sync', result.complete === true);
    check('reports where the grid ended', moves === -4 && state.shown === addWeeks(THIS_WEEK, moves));
  }

  console.log('\n— the teacher left Madrasati on another week —');
  {
    const { state, stubs } = fakeMadrasati({ thisWeek: THIS_WEEK, shown: '2026-10-18', ...TERM });
    const walk = build(stubs, state);
    const { moves } = await walk('h', { weeksBefore: 4, weeksAfter: 1 });
    check('the window is still around this week', state.harvested[0] === THIS_WEEK && state.harvested.length === 6);
    check('moves counts from the week the teacher left', state.shown === addWeeks('2026-10-18', moves));
  }

  console.log('\n— last week of the term —');
  {
    const { state, stubs } = fakeMadrasati({ thisWeek: THIS_WEEK, shown: THIS_WEEK, first: TERM.first, last: THIS_WEEK });
    const walk = build(stubs, state);
    const { result } = await walk('h', { weeksBefore: 4, weeksAfter: 1 });
    check('the earlier weeks are still read', result.weeks_count === 5 && state.harvested.at(-1) === '2026-09-06');
    check('and it is still a full sync', result.complete === true);
  }

  console.log('\n— a preparation takes the tab —');
  {
    const { state, stubs } = fakeMadrasati({ thisWeek: THIS_WEEK, shown: THIS_WEEK, ...TERM, abortAfterSteps: 2 });
    const walk = build(stubs, state);
    const { result, moves } = await walk('h', { weeksBefore: 4, weeksAfter: 1 });
    check('the walk stops', result.stop_reason === 'interrupted' && result.complete === false);
    check('and says where the grid is', state.shown === addWeeks(THIS_WEEK, moves));
  }

  console.log('\n— an older site that only sends maxWeeks —');
  {
    const { state, stubs } = fakeMadrasati({ thisWeek: THIS_WEEK, shown: THIS_WEEK, ...TERM });
    const walk = build(stubs, state);
    const { result } = await walk('h', { maxWeeks: 3 });
    check('walks forward as before', JSON.stringify(state.harvested) === JSON.stringify([
      '2026-10-04', '2026-10-11', '2026-10-18',
    ]) && result.complete === true);
  }

  console.log(failures ? `\n${failures} failed` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
