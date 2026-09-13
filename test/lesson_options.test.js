/* Exercises how fetchLessonTreeOptions chooses between Madrasati's live lesson
 * list and the bundled snapshot.
 *
 * This path decides which lessons a teacher is offered, and it got it wrong in
 * a way nobody could see from the code: the snapshot's `groups` were captured
 * during a second semester, so a first-semester teacher was shown chapter 6
 * onwards and none of chapters 1-5. The rules below are the ones that failure
 * turned on.
 *
 * The functions are sliced out of content.js and evaluated against stubs —
 * content.js is one large IIFE that cannot be imported. */
const fs = require('fs');
const path = require('path');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'content.js'), 'utf8');
const START = '    // One live request per subject per page';
const END = '    function createDashboardSelectDropdown';

let failures = 0;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log(`✗ ${label}\n    got:      ${JSON.stringify(actual)}\n    expected: ${JSON.stringify(expected)}`); }
  else console.log(`✓ ${label}`);
}

/** Builds fetchLessonTreeOptions over caller-supplied stubs. */
function build({ live, local }) {
  const from = SOURCE.indexOf(START);
  const to = SOURCE.indexOf(END);
  if (from < 0 || to < 0 || to < from) throw new Error('could not slice the lesson-option functions out of content.js');

  const calls = { live: 0 };
  const factory = new Function('fetchGoalLessonSubjectLive', 'getLocalSubjectData', 'console', `
    ${SOURCE.slice(from, to)}
    return fetchLessonTreeOptions;
  `);

  return {
    fetchLessonTreeOptions: factory(
      async (subjectId) => { calls.live++; return live(subjectId); },
      async () => local,
      { log() {}, warn() {} },
    ),
    calls,
  };
}

const lesson = (composite, name) => ({ info: { compositeId: composite, name } });
const groupsOf = (...names) => ({ groups: [names.map((n, i) => lesson(`1,2,${i + 10}`, n))] });
const texts = (out) => out.map((o) => o.text);

(async () => {
  console.log('\n— live wins —');
  {
    const { fetchLessonTreeOptions } = build({
      live: async () => [lesson('528,60,900', 'الجبر: الأنماط -- التهيئة')],
      local: groupsOf('العمليات على الكسور الاعتيادية -- التهيئة'),
    });
    const out = await fetchLessonTreeOptions(528, 'الرياضيات');
    // The whole point: a stale snapshot must not beat what Madrasati serves
    // for the term the teacher is actually in.
    check('Madrasati is preferred over the snapshot', texts(out), ['الجبر: الأنماط -- التهيئة']);
    check('the option value stays the composite id', out[0].value, '528,60,900');
  }

  console.log('\n— unusable live rows —');
  {
    const { fetchLessonTreeOptions } = build({
      live: async () => [lesson('528,,900', 'درس بلا معرّف وحدة'), lesson('528,60,901', 'درس سليم')],
      local: groupsOf('من اللقطة'),
    });
    // A missing TreeId yields "528,,900", which preparation cannot address.
    check('a row without a tree id is dropped',
      texts(await fetchLessonTreeOptions(528, 'الرياضيات')), ['درس سليم']);
  }
  {
    const { fetchLessonTreeOptions } = build({
      live: async () => [lesson('528,,900', 'الوحيد وهو تالف')],
      local: groupsOf('من اللقطة'),
    });
    // If nothing usable survives, the snapshot still beats an empty dropdown.
    check('all rows unusable falls back to the snapshot',
      texts(await fetchLessonTreeOptions(528, 'الرياضيات')), ['من اللقطة']);
  }

  console.log('\n— Madrasati unreachable —');
  {
    const { fetchLessonTreeOptions } = build({ live: async () => null, local: groupsOf('درس من groups') });
    check('null live falls back to groups',
      texts(await fetchLessonTreeOptions(528, 'الرياضيات')), ['درس من groups']);
  }
  {
    const { fetchLessonTreeOptions } = build({
      live: async () => { throw new Error('network down'); },
      local: groupsOf('درس من groups'),
    });
    // A thrown request must not take the dropdown down with it.
    check('a thrown request still falls back',
      texts(await fetchLessonTreeOptions(528, 'الرياضيات')), ['درس من groups']);
  }
  {
    const { fetchLessonTreeOptions } = build({
      live: async () => null,
      local: { groups: [], rawLessonsList: [{ id: 77, name: 'درس من rawLessonsList' }] },
    });
    check('empty groups still reach rawLessonsList',
      texts(await fetchLessonTreeOptions(528, 'الرياضيات')), ['درس من rawLessonsList']);
  }

  console.log('\n— one request per subject —');
  {
    const { fetchLessonTreeOptions, calls } = build({
      live: async () => [lesson('528,60,900', 'درس')],
      local: groupsOf('من اللقطة'),
    });
    await Promise.all([1, 2, 3, 4].map(() => fetchLessonTreeOptions(528, 'الرياضيات')));
    // A schedule holds many cards per subject; each one must not refetch.
    check('four cards share a single request', calls.live, 1);
  }

  console.log(failures ? `\n${failures} FAILED` : '\nAll passed');
  process.exit(failures ? 1 : 0);
})();
